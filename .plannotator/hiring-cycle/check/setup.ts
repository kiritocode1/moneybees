/*
 * Local check setup for the hiring cycle (not committed): an HR-only and a
 * sales-only login with known passwords, and one Live role with must-haves.
 *   ./node_modules/.bin/payload run .plannotator/hiring-cycle/check/setup.ts
 */
import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
if (!/localhost:54329/.test(process.env.DATABASE_URL ?? "")) throw new Error("Local database only.");

const logins: string[] = [];
for (const [name, email, roles] of [["Meera Nair", "meera.hr@moneybee.local", ["hr"]], ["Asha Rao", "asha.sales@moneybee.local", ["sales"]]] as const) {
  const password = randomBytes(9).toString("base64url");
  const found = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1, overrideAccess: true });
  if (found.docs[0]) await payload.update({ collection: "users", id: found.docs[0].id, data: { password }, overrideAccess: true });
  else await payload.create({ collection: "users", data: { email, password, name, roles: [...roles] }, overrideAccess: true });
  logins.push(`${email} ${password}`);
}

const { docs } = await payload.find({ collection: "openings", where: { anchor: { equals: "equity-research" } }, limit: 1, overrideAccess: true });
await payload.update({
  collection: "openings",
  id: docs[0].id,
  overrideAccess: true,
  context: { skipRevalidate: true },
  data: { status: "live", mustHaves: [{ line: "Two or more years of equity research" }, { line: "CFA Level II or above" }, { line: "Builds company models in Excel" }] },
});
writeFileSync("/tmp/moneybee-hiring-logins.txt", `${logins.join("\n")}\n`, { mode: 0o600 });
console.log("Live: equity-research. Logins in /tmp/moneybee-hiring-logins.txt");
process.exit(0);
