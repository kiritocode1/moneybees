import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import { DOCUMENT_GROUPS, type DocumentGroup } from "@/lib/investor-centre";
import { dayMonthYear } from "@/lib/site/tokens";

/**
 * The Investor Centre's cards from /admin (collections/Documents.ts), in
 * their order there, under the four fixed groups; a group with no documents
 * is left out. Without a database, or with none added yet, the content
 * plan's eleven in lib/investor-centre.ts.
 */
export const documentGroups = cache(async (): Promise<readonly DocumentGroup[]> => {
  if (!process.env.DATABASE_URL) return DOCUMENT_GROUPS;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "documents", sort: "_order", depth: 1, limit: 200 });
  if (docs.length === 0) return DOCUMENT_GROUPS;
  return DOCUMENT_GROUPS.map((group) => ({
    ...group,
    documents: docs
      .filter((doc) => doc.group === group.id)
      .map((doc) => ({
        title: doc.title,
        id: doc.anchor ?? `document-${doc.id}`,
        glyph: doc.drawing,
        href: (typeof doc.file === "object" ? doc.file?.url : null) ?? doc.link ?? undefined,
        date: doc.date ? dayMonthYear(doc.date) : undefined,
      })),
  })).filter((group) => group.documents.length > 0);
});
