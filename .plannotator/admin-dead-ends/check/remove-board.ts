// Local QA only: removes the deals seed-board.ts made, with their tasks and timeline lines.
// Run: npx payload run .plannotator/admin-dead-ends/check/remove-board.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const deals = await payload.find({ collection: "deals", where: { title: { like: "QA board:" } }, limit: 100, depth: 0, overrideAccess: true });
const ids = deals.docs.map((deal) => deal.id);
if (ids.length) {
  await payload.delete({ collection: "tasks", where: { deal: { in: ids } }, overrideAccess: true });
  await payload.delete({ collection: "activities", where: { deal: { in: ids } }, overrideAccess: true });
  await payload.delete({ collection: "deals", where: { id: { in: ids } }, overrideAccess: true });
}
console.log("removed", ids.length);
process.exit(0);
