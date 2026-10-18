// Local QA only: one test login per role, all sharing the QA admin's password
// (read from /tmp/moneybee-qa-login.txt, never printed). Makes the missing
// operations and editor accounts; sets the same password on the others and on
// the test investor. Writes the list (emails and roles only) to stdout.
// Run: npx payload run .plannotator/admin-dead-ends/check/role-logins.ts
import { readFileSync } from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";

const password = readFileSync("/tmp/moneybee-qa-login.txt", "utf8").split("\n")[1]?.trim();
if (!password) throw new Error("No password on line 2 of /tmp/moneybee-qa-login.txt");
const payload = await getPayload({ config });

const staff = [
  { email: "asha.sales@moneybee.local", name: "Asha Rao", roles: ["sales"] },
  { email: "rahul.operations@moneybee.local", name: "Rahul Verma", roles: ["operations"] },
  { email: "vikram.compliance@moneybee.local", name: "Vikram Iyer", roles: ["compliance"] },
  { email: "meera.hr@moneybee.local", name: "Meera Nair", roles: ["hr"] },
  { email: "neha.editor@moneybee.local", name: "Neha Kapoor", roles: ["editor"] },
] as const;

for (const person of staff) {
  const found = (await payload.find({ collection: "users", where: { email: { equals: person.email } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
  if (found) await payload.update({ collection: "users", id: found.id, data: { password, loginAttempts: 0, lockUntil: null } as never, overrideAccess: true });
  else await payload.create({ collection: "users", data: { email: person.email, name: person.name, roles: [...person.roles], password } as never, overrideAccess: true });
  console.log(found ? "updated" : "created", person.roles.join(","), person.email);
}
const investor = (await payload.find({ collection: "investors", where: { email: { equals: "qa.investor@moneybee.local" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
if (investor) {
  await payload.update({ collection: "investors", id: investor.id, data: { password, loginAttempts: 0, lockUntil: null } as never, overrideAccess: true });
  console.log("updated investor qa.investor@moneybee.local");
}
process.exit(0);
