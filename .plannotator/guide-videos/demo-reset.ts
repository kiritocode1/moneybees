// Local only: puts the Guide's demo people back to their starting state before a recording.
// Ananya Bose: a PMS prospect whose enquiry Asha Rao took, with a Rs. 2 crore deal at Contacted and nothing planned.
// Run: npx payload run .plannotator/guide-videos/demo-reset.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const DAY = 86_400_000;
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString();
const asha = (await payload.find({ collection: "users", where: { email: { equals: "asha.sales@moneybee.local" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
const pms = (await payload.find({ collection: "products", where: { slug: { equals: "moneybee-pms" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
if (!asha || !pms) throw new Error("Needs Asha Rao (role-logins.ts) and the Moneybee PMS product.");

const email = "ananya.bose@example.com";
let person = (await payload.find({ collection: "contacts", where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
if (person) {
  for (const collection of ["tasks", "activities", "emails"] as const) await payload.delete({ collection, where: { contact: { equals: person.id } }, overrideAccess: true });
  await payload.delete({ collection: "deals", where: { contact: { equals: person.id } }, overrideAccess: true });
  await payload.delete({ collection: "enquiries", where: { contact: { equals: person.id } }, overrideAccess: true });
  await payload.update({ collection: "contacts", id: person.id, data: { owner: asha.id, entity: null }, overrideAccess: true });
} else {
  person = await payload.create({ collection: "contacts", data: { name: "Ananya Bose", email, phone: "+919820044444", city: "Mumbai", kind: "prospect", source: "website", owner: asha.id }, overrideAccess: true });
}
const enquiry = await payload.create({
  collection: "enquiries",
  data: { title: "PMS enquiry from Ananya Bose", contact: person.id, kind: "pms", status: "open", severity: "normal", message: "I would like to understand how the PMS works before investing about 2 crore.", answers: { name: "Ananya Bose", email, amount: "1 crore to 5 crore", city: "Mumbai" }, receivedAt: ago(3), assignee: asha.id, firstResponseAt: ago(3) },
  overrideAccess: true,
});
await payload.create({ collection: "activities", data: { contact: person.id, enquiry: enquiry.id, type: "form", summary: "Sent the PMS form", body: "I would like to understand how the PMS works before investing about 2 crore.", at: ago(3) }, overrideAccess: true });
const deal = await payload.create({ collection: "deals", data: { title: "Ananya Bose, Moneybee PMS", contact: person.id, product: pms.id, stage: "contacted", ticketSize: 2, owner: asha.id, enquiry: enquiry.id }, overrideAccess: true });
await payload.update({ collection: "deals", id: deal.id, data: { stage: "contacted", stageChangedAt: ago(3) }, overrideAccess: true });
await payload.update({ collection: "enquiries", id: enquiry.id, data: { status: "converted", deal: deal.id }, overrideAccess: true });
await payload.create({ collection: "activities", data: { contact: person.id, enquiry: enquiry.id, deal: deal.id, type: "stage", summary: "Asha Rao opened a Moneybee PMS deal", actor: asha.id, at: ago(3) }, overrideAccess: true });
console.log("reset Ananya Bose: person", person.id, "deal", deal.id);
process.exit(0);
