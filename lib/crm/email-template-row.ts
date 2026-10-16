import type { Payload } from "payload";
import type { CatalogueEntry } from "@/emails";
import { STARTER_TEMPLATES } from "@/lib/crm/starter-content";

/** The Email templates row holding an email's words: its starter's name first, else its purpose. */
export async function templateRow(payload: Payload, entry: CatalogueEntry) {
  if (!entry.template) return null;
  const starter = STARTER_TEMPLATES[entry.template];
  const byName = await payload.find({ collection: "email-templates", where: { name: { equals: starter.name } }, limit: 1, depth: 0, overrideAccess: true });
  if (byName.docs[0]) return byName.docs[0];
  return (await payload.find({ collection: "email-templates", where: { purpose: { equals: starter.purpose } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] ?? null;
}
