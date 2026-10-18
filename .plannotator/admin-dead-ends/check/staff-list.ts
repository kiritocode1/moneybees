// Read-only: local staff accounts with their roles (no passwords).
// Run: npx payload run .plannotator/admin-dead-ends/check/staff-list.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const users = await payload.find({ collection: "users", limit: 50, depth: 0, overrideAccess: true });
for (const user of users.docs) console.log(user.id, user.name, user.email, (user.roles ?? []).join(","));
process.exit(0);
