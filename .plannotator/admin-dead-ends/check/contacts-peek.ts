import config from "@payload-config";
import { getPayload } from "payload";
const payload = await getPayload({ config });
const contacts = await payload.find({ collection: "contacts", limit: 20, depth: 0, overrideAccess: true });
for (const c of contacts.docs) console.log(c.id, c.name, c.email, c.kind, c.entity ?? "-", c.investor ?? "-");
process.exit(0);
