/*
 * Seeds a local or staging database for the enquiry desk: the two products,
 * draft playbooks and templates for compliance to edit, a QA staff login, and
 * sample enquiries sent through the real pipeline (lib/crm/enquiries.ts).
 * Never run it against production: the people are fictional.
 *
 *   ./node_modules/.bin/payload run scripts/seed-crm.ts
 *
 * Writes the QA login to /tmp/moneybee-qa-login.txt (readable only by you).
 * Running it twice adds nothing twice except the sample enquiries.
 */
import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";
import { receiveEnquiry } from "@/lib/crm/enquiries";

const payload = await getPayload({ config });
if (process.env.NODE_ENV === "production" || /planetscale|psdb/.test(process.env.DATABASE_URL ?? "")) throw new Error("Refusing to seed what looks like production.");

async function once<T>(collection: "products" | "playbooks" | "email-templates", field: string, value: string, data: T) {
  const { docs } = await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1, depth: 0, overrideAccess: true });
  return docs[0] ?? (await payload.create({ collection, data: data as never, overrideAccess: true }));
}

await once("products", "slug", "moneybee-pms", { name: "Moneybee PMS", slug: "moneybee-pms", kind: "pms", benchmark: "S&P BSE 500 TRI", inception: "2007-08-01", showPerformancePublicly: true });
await once("products", "slug", "flyingbee", { name: "Flyingbee Investment Fund", slug: "flyingbee", kind: "aif", benchmark: "S&P BSE 500 TRI", inception: "2025-01-01", showPerformancePublicly: false });

const ack = await once("email-templates", "name", "Enquiry received", {
  name: "Enquiry received",
  purpose: "enquiry_ack",
  subject: "We have your enquiry ({{reference}})",
  body: "Hello {{firstName}},\n\nThank you for writing to Moneybee. Your reference is {{reference}}. Someone from our team will reply to this address.\n\nIf it is urgent, call us on 022-4030 2080.\n\nMoneybee",
});
const pmsReply = await once("email-templates", "name", "PMS first reply", {
  name: "PMS first reply",
  purpose: "enquiry_reply",
  subject: "Moneybee PMS: your enquiry ({{reference}})",
  body: "Hello {{firstName}},\n\nThank you for your interest in Moneybee PMS. The minimum investment is Rs. 50 lakh, as SEBI sets for portfolio management services.\n\nI have attached our latest fact sheet. Could we find 20 minutes this week to talk through how we invest and whether it suits you?\n\n{{senderName}}\nMoneybee",
});
const aifReply = await once("email-templates", "name", "AIF first reply", {
  name: "AIF first reply",
  purpose: "enquiry_reply",
  subject: "Flyingbee Investment Fund: your enquiry ({{reference}})",
  body: "Hello {{firstName}},\n\nThank you for asking about the Flyingbee Investment Fund, our Category III AIF. The minimum commitment is Rs. 1 crore.\n\nBefore I send the fund's documents, could you confirm you are investing as an individual, HUF, family office or company? I would also like to set up a call with the fund team.\n\n{{senderName}}\nMoneybee",
});
const complaint = await once("email-templates", "name", "Investor concern, first reply", {
  name: "Investor concern, first reply",
  purpose: "enquiry_reply",
  subject: "Your message to Moneybee ({{reference}})",
  body: "Hello {{firstName}},\n\nThank you for telling us. I am looking into this now with our operations team and will call you today.\n\nYour reference is {{reference}}. Please quote it if you write to us again.\n\n{{senderName}}\nMoneybee",
});

const playbooks = [
  { name: "Investor withdrawal or complaint", order: 10, kinds: [], severities: ["critical"], responseHours: 2, handlerRoles: ["operations", "compliance"], template: complaint.id, steps: ["Call the investor before writing.", "Check their account with operations before promising anything.", "Copy compliance on the reply.", "Log the call and what was agreed here."] },
  { name: "Large PMS investor", order: 20, kinds: ["pms"], severities: ["high"], responseHours: 4, handlerRoles: ["sales"], template: pmsReply.id, steps: ["Call within the reply time; email only if they don't pick up.", "Offer a meeting with the fund manager.", "Open a deal once a meeting is set."] },
  { name: "Large AIF investor", order: 21, kinds: ["aif"], severities: ["high"], responseHours: 4, handlerRoles: ["sales"], template: aifReply.id, steps: ["Call within the reply time; email only if they don't pick up.", "Confirm the Rs. 1 crore minimum and how they invest before sending documents.", "Open a deal once a meeting is set."] },
  { name: "PMS enquiry", order: 30, kinds: ["pms"], severities: [], responseHours: 24, handlerRoles: ["sales"], template: pmsReply.id, steps: ["Reply with the fact sheet and the Rs. 50 lakh minimum.", "Ask for a time to call."] },
  { name: "AIF enquiry", order: 40, kinds: ["aif"], severities: [], responseHours: 24, handlerRoles: ["sales"], template: aifReply.id, steps: ["Confirm the Rs. 1 crore minimum before sending any material.", "Send no AIF returns until compliance has cleared them for this person."] },
  { name: "Investor support", order: 50, kinds: ["support"], severities: [], responseHours: 24, handlerRoles: ["operations"], template: null, steps: ["Find the client code in the back office.", "Reply with what will happen and by when."] },
  { name: "General enquiry", order: 90, kinds: ["general"], severities: [], responseHours: 72, handlerRoles: ["sales"], template: null, steps: ["Answer it, or pass it to the right desk.", "Close it with a line on what was done."] },
];
// Replaced by the separate PMS and AIF playbooks above.
await payload.delete({ collection: "playbooks", where: { name: { equals: "Large PMS or AIF investor" } }, overrideAccess: true });
for (const { steps, ...playbook } of playbooks) {
  const row = await once("playbooks", "name", playbook.name, { ...playbook, steps: steps.map((step) => ({ step })) });
  await payload.update({ collection: "playbooks", id: row.id, data: { ...playbook, steps: steps.map((step) => ({ step })) } as never, overrideAccess: true });
}
void ack;

const email = "qa.admin@moneybee.local";
const existing = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1, overrideAccess: true });
const password = randomBytes(9).toString("base64url");
if (existing.docs[0]) await payload.update({ collection: "users", id: existing.docs[0].id, data: { password }, overrideAccess: true });
else await payload.create({ collection: "users", data: { email, password, name: "QA Admin", roles: ["admin"] }, overrideAccess: true });
for (const [name, mail, roles] of [["Asha Rao", "asha.sales@moneybee.local", ["sales"]], ["Vikram Iyer", "vikram.compliance@moneybee.local", ["compliance"]]] as const) {
  const found = await payload.find({ collection: "users", where: { email: { equals: mail } }, limit: 1, overrideAccess: true });
  if (!found.docs[0]) await payload.create({ collection: "users", data: { email: mail, password: randomBytes(12).toString("base64url"), name, roles: [...roles] }, overrideAccess: true });
}

const samples = [
  { kind: "pms", values: { name: "Rohan Mehta", email: "rohan.mehta@example.com", phone: "+91 98200 11111", amount: "Above 5 crore", city: "Mumbai", message: "We are a family looking to move part of our equity allocation into a PMS. Could someone call me this week?" } },
  { kind: "support", values: { name: "Neeta Kulkarni", email: "neeta.k@example.com", phone: "+91 98200 22222", client: "MB1042", topic: "Withdrawal", message: "I asked for a partial withdrawal on 2 October and it has still not been credited to my bank account." } },
  { kind: "aif", values: { name: "Arjun Desai", email: "arjun.desai@example.com", investor: "Individual", commitment: "1 crore to 5 crore", message: "Please share details of the Flyingbee fund and how the commitment works." } },
  { kind: "general", values: { name: "Kavita Shah", email: "kavita.shah@example.com", subject: "Unsolicited calls", message: "I keep getting calls from someone claiming to be from Moneybee. I want to complain about this." } },
  { kind: "general", values: { name: "Sameer Joshi", email: "sameer.joshi@example.com", subject: "Office visit", message: "Is your office open on Saturdays?" } },
];
const created: number[] = [];
for (const sample of samples) {
  const result = await receiveEnquiry(sample.kind, sample.values, { page: "/contact", ipHash: "seed" });
  if (!result.ok) throw new Error(result.error);
  created.push(result.id);
}
// One enquiry that has already missed its reply time, so the inbox shows an overdue row.
await payload.update({ collection: "enquiries", id: created[2], data: { receivedAt: new Date(Date.now() - 30 * 3_600_000).toISOString(), dueAt: new Date(Date.now() - 6 * 3_600_000).toISOString() }, overrideAccess: true });

writeFileSync("/tmp/moneybee-qa-login.txt", `${email}\n${password}\n`, { mode: 0o600 });
console.log(`\nSeeded ${created.length} enquiries. QA login written to /tmp/moneybee-qa-login.txt\n`);
process.exit(0);
