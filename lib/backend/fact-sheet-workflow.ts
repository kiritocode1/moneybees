import { APIError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook } from "payload";
import { hasRole } from "@/lib/backend/roles";
import { revalidateProduct } from "@/lib/revalidate";

/*
 * The maker-checker rules for fact sheets (plan §11):
 *   draft -> in_review     anyone who can edit; records who submitted
 *   in_review -> draft     sent back for changes
 *   in_review -> published compliance only, never the person who submitted
 *   published -> superseded only the system, when a newer sheet publishes
 * A published or superseded sheet never changes again. A mistake is fixed by
 * a new sheet for the same month with a correction reason.
 */

export const STATUSES = ["draft", "in_review", "published", "superseded"] as const;
export type Status = (typeof STATUSES)[number];

/** What a caller can ask of the workflow through `req.context`. Only server code can set it. */
type WorkflowContext = { system?: "seed" | "supersede"; skipRevalidate?: boolean };

/** The fields a reviewer approves. Changing any of them while in review is refused. */
const CONTENT = ["product", "asOf", "returns", "wealth", "sectors", "pdf", "correctionReason"] as const;

/** A relationship arrives as an id or as the populated document; compare ids. */
const idOf = (value: unknown): unknown => (value && typeof value === "object" && "id" in value ? (value as { id: unknown }).id : value);

/** Array rows carry generated ids that differ between a form post and the stored row. */
function normalise(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((row) => (row && typeof row === "object" ? Object.fromEntries(Object.entries(row).filter(([key]) => key !== "id")) : row));
  return idOf(value);
}

function contentChanged(data: Record<string, unknown>, original: Record<string, unknown>) {
  return CONTENT.some((key) => key in data && JSON.stringify(normalise(data[key])) !== JSON.stringify(normalise(original[key])));
}

const monthOf = (date: unknown) => String(date).slice(0, 7);

export const enforceWorkflow: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  const context = req.context as WorkflowContext;
  if (context.system === "supersede") return data;
  if (context.system === "seed") return { ...data, publishedAt: data.status === "published" ? new Date().toISOString() : null };

  const from: Status = operation === "create" ? "draft" : originalDoc.status;
  const to: Status = data.status ?? from;

  if (from === "published" || from === "superseded") {
    throw new APIError("A published fact sheet cannot be changed. Create a new sheet for the same month with a correction reason; publishing it replaces this one.", 400);
  }
  if (operation === "create" && to !== "draft") throw new APIError("A new fact sheet starts as a draft.", 400);
  if (from === "in_review" && contentChanged(data, originalDoc)) {
    throw new APIError("This sheet is waiting for approval. Send it back to draft before editing it.", 400);
  }

  const now = new Date().toISOString();
  switch (`${from}>${to}`) {
    case "draft>draft":
    case "in_review>in_review":
      return data;
    case "draft>in_review":
      return { ...data, submittedBy: req.user?.id, submittedAt: now };
    case "in_review>draft":
      return { ...data, submittedBy: null, submittedAt: null };
    case "in_review>published": {
      if (!hasRole(req.user, "compliance")) throw new APIError("Only compliance can publish a fact sheet.", 403);
      if (idOf(originalDoc.submittedBy) === req.user?.id) throw new APIError("You submitted this sheet, so someone else has to approve it.", 403);
      const live = await req.payload.find({
        collection: "fact-sheets",
        where: { product: { equals: idOf(originalDoc.product) }, status: { equals: "published" } },
        depth: 0,
        limit: 1,
        overrideAccess: true,
        req,
      });
      const current = live.docs[0];
      if (current && monthOf(originalDoc.asOf) < monthOf(current.asOf)) {
        throw new APIError(`This sheet is for ${monthOf(originalDoc.asOf)}, older than the one on the site (${monthOf(current.asOf)}).`, 400);
      }
      if (current && monthOf(originalDoc.asOf) === monthOf(current.asOf) && !originalDoc.correctionReason) {
        throw new APIError("A sheet for this month is already published. Add a correction reason to replace it.", 400);
      }
      return { ...data, approvedBy: req.user?.id, publishedAt: now };
    }
    default:
      throw new APIError(`A fact sheet cannot go from ${from} to ${to}.`, 400);
  }
};

/** Builds the title the admin lists sheets by, e.g. "Moneybee PMS, July 2026". */
export const setTitle: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const productId = idOf(data.product ?? originalDoc?.product);
  const asOf = data.asOf ?? originalDoc?.asOf;
  if (!productId || !asOf) return data;
  const product = await req.payload.findByID({ collection: "products", id: productId as number, depth: 0, overrideAccess: true, req });
  const month = new Date(asOf).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  return { ...data, title: `${product.name}, ${month}` };
};

/**
 * After a publish: retire the sheet it replaces and rebuild the pages that
 * draw this product. After a submit: tell compliance a sheet is waiting.
 */
export const afterStatusChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const context = req.context as WorkflowContext;
  if (context.system === "supersede") return doc;
  const was: Status | undefined = previousDoc?.status;

  if (doc.status === "published" && was !== "published") {
    const older = await req.payload.find({
      collection: "fact-sheets",
      where: { product: { equals: idOf(doc.product) }, status: { equals: "published" }, id: { not_equals: doc.id } },
      depth: 0,
      limit: 100,
      overrideAccess: true,
      req,
    });
    for (const sheet of older.docs) {
      await req.payload.update({ collection: "fact-sheets", id: sheet.id, data: { status: "superseded" }, overrideAccess: true, req, context: { system: "supersede" } });
    }
    if (!context.skipRevalidate) {
      const product = await req.payload.findByID({ collection: "products", id: idOf(doc.product) as number, depth: 0, overrideAccess: true, req });
      revalidateProduct(product.slug);
    }
  }

  if (doc.status === "in_review" && was !== "in_review") {
    const reviewers = await req.payload.find({ collection: "users", where: { roles: { in: ["compliance"] } }, depth: 0, limit: 50, overrideAccess: true, req });
    const to = reviewers.docs.map((user) => user.email).filter((email) => email !== req.user?.email);
    if (to.length > 0) {
      await req.payload
        .sendEmail({ to, subject: `Fact sheet waiting for approval: ${doc.title}`, text: `${doc.title} was submitted for review. Open /admin/collections/fact-sheets/${doc.id} to approve it or send it back.` })
        .catch((error: unknown) => req.payload.logger.error({ err: error, msg: "Review email failed" }));
    }
  }
  return doc;
};
