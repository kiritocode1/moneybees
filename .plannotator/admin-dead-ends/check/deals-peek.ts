// Read-only: the local deals, products and staff, to plan the board's browser check.
// Run: npx payload run .plannotator/admin-dead-ends/check/deals-peek.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const deals = await payload.find({ collection: "deals", limit: 100, depth: 1, overrideAccess: true });
for (const deal of deals.docs) {
  const contact = typeof deal.contact === "object" ? deal.contact : null;
  const product = typeof deal.product === "object" ? deal.product : null;
  console.log(deal.id, deal.stage, product?.kind, product?.slug, contact?.id, contact?.name, contact?.email ? "email" : "no email", deal.ticketSize, deal.stageChangedAt, typeof deal.owner === "object" ? deal.owner?.name : deal.owner, deal.enquiry ? "enquiry" : "");
}
const products = await payload.find({ collection: "products", limit: 20, depth: 0, overrideAccess: true });
console.log(products.docs.map((product) => [product.id, product.slug, product.kind, product.name]));
const contacts = await payload.count({ collection: "contacts", overrideAccess: true });
console.log("contacts", contacts.totalDocs);
const users = await payload.find({ collection: "users", limit: 20, depth: 0, overrideAccess: true });
console.log(users.docs.map((user) => [user.id, user.name, user.roles]));
process.exit(0);
