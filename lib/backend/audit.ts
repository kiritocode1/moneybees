import type { CollectionAfterChangeHook } from "payload";

/** Bookkeeping fields every document carries; a change to these alone is not news. */
const IGNORED = new Set(["updatedAt", "createdAt"]);

/** Top-level fields whose value differs between the two versions, with both values. */
function changedFields(before: Record<string, unknown> | undefined, after: Record<string, unknown>) {
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  for (const key of new Set([...Object.keys(before ?? {}), ...Object.keys(after)])) {
    if (IGNORED.has(key)) continue;
    const from = before?.[key];
    const to = after[key];
    if (JSON.stringify(from) !== JSON.stringify(to)) changes[key] = { from: from ?? null, to: to ?? null };
  }
  return changes;
}

/**
 * Writes one AuditLog row per create or update: who, what, and the fields that
 * changed. Rows are written with access overridden because no one, admins
 * included, may write the log directly.
 */
export const auditChange =
  (collection: string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, operation, req }) => {
    const changes = changedFields(operation === "create" ? undefined : previousDoc, doc);
    if (operation === "update" && Object.keys(changes).length === 0) return doc;
    await req.payload.create({
      collection: "audit-log",
      overrideAccess: true,
      req,
      data: {
        actor: req.user?.collection === "users" ? req.user.id : null,
        action: operation,
        collectionSlug: collection,
        docId: String(doc.id),
        summary: `${operation === "create" ? "Created" : "Updated"} ${collection} ${doc.id}: ${Object.keys(changes).join(", ") || "no fields"}`,
        changes,
      },
    });
    return doc;
  };
