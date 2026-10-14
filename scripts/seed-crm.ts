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
import { STARTER_PLAYBOOKS, STARTER_TEMPLATES } from "@/lib/crm/starter-content";

const payload = await getPayload({ config });
if (process.env.NODE_ENV === "production" || /planetscale|psdb/.test(process.env.DATABASE_URL ?? "")) throw new Error("Refusing to seed what looks like production.");

async function once<T>(collection: "products" | "playbooks" | "email-templates", field: string, value: string, data: T) {
  const { docs } = await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1, depth: 0, overrideAccess: true });
  return docs[0] ?? (await payload.create({ collection, data: data as never, overrideAccess: true }));
}

await once("products", "slug", "moneybee-pms", { name: "Moneybee PMS", slug: "moneybee-pms", kind: "pms", benchmark: "S&P BSE 500 TRI", inception: "2007-08-01", showPerformancePublicly: true });
await once("products", "slug", "flyingbee", { name: "Flyingbee Investment Fund", slug: "flyingbee", kind: "aif", benchmark: "S&P BSE 500 TRI", inception: "2025-01-01", showPerformancePublicly: false });

// Starter templates and playbooks (lib/crm/starter-content.ts); the hiring migration writes the same ones where none exist.
const templateIds = new Map<string, number>();
for (const [key, template] of Object.entries(STARTER_TEMPLATES)) {
  templateIds.set(key, (await once("email-templates", "name", template.name, template)).id);
}
// Replaced by the separate PMS and AIF playbooks.
await payload.delete({ collection: "playbooks", where: { name: { equals: "Large PMS or AIF investor" } }, overrideAccess: true });
for (const { steps, template, ...playbook } of STARTER_PLAYBOOKS) {
  const data = { ...playbook, template: template ? templateIds.get(template) : null, steps: steps.map((step) => ({ step })) };
  const row = await once("playbooks", "name", playbook.name, data);
  await payload.update({ collection: "playbooks", id: row.id, data: data as never, overrideAccess: true });
}

const email = "qa.admin@moneybee.local";
const existing = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1, overrideAccess: true });
const password = randomBytes(9).toString("base64url");
if (existing.docs[0]) await payload.update({ collection: "users", id: existing.docs[0].id, data: { password }, overrideAccess: true });
else await payload.create({ collection: "users", data: { email, password, name: "QA Admin", roles: ["admin"] }, overrideAccess: true });
for (const [name, mail, roles] of [["Asha Rao", "asha.sales@moneybee.local", ["sales"]], ["Vikram Iyer", "vikram.compliance@moneybee.local", ["compliance"]], ["Meera Nair", "meera.hr@moneybee.local", ["hr"]]] as const) {
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
