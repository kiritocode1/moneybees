// Read-only: the query behind filesSentTo (lib/crm/deal-actions.ts) for each person, to check what Documents sent offers.
// Run: npx payload run .plannotator/admin-dead-ends/check/files-sent.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
for (const person of [1, 2, 3, 4, 5, 7, 8]) {
  const { docs } = await payload.find({
    collection: "emails",
    where: { contact: { equals: person }, "attachments.ref": { exists: true }, createdAt: { greater_than: new Date(Date.now() - 60 * 86_400_000).toISOString() } },
    sort: "-createdAt",
    limit: 20,
    depth: 0,
    overrideAccess: true,
    select: { attachments: true },
  });
  console.log(person, [...new Set(docs.flatMap((email) => (email.attachments ?? []).map((file) => file.name)))]);
}
process.exit(0);
