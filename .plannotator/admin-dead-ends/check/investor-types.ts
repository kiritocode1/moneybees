// Read-only: each enquiry's kind, person and the investor type it gave, for the entities check.
// Run: npx payload run .plannotator/admin-dead-ends/check/investor-types.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: "enquiries", limit: 50, depth: 0, overrideAccess: true });
for (const enquiry of docs) console.log(enquiry.id, enquiry.kind, enquiry.status, "contact", enquiry.contact, "investor:", (enquiry.answers as Record<string, string> | null)?.investor ?? "-");
const entities = await payload.find({ collection: "entities", limit: 50, depth: 0, overrideAccess: true });
console.log("entities", entities.docs.map((entity) => [entity.id, entity.name, entity.type]));
process.exit(0);
