/* Adds two roles named alike to check the apply address, then removes them. Local only; not committed. */
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
if (!/localhost:54329/.test(process.env.DATABASE_URL ?? "")) throw new Error("Local database only.");
const data = { title: "Portfolio Analyst", status: "sample" as const, team: "portfolio" as const, location: "Mumbai", employment: "Full-time", summary: "Check.", responsibilities: [{ line: "Check." }] };
const one = await payload.create({ collection: "openings", data: { ...data, title: "Head of Research & Strategy" }, overrideAccess: true, context: { skipRevalidate: true } });
const two = await payload.create({ collection: "openings", data, overrideAccess: true, context: { skipRevalidate: true } });
console.log(JSON.stringify({ first: one.anchor, second: two.anchor }));
for (const doc of [one, two]) await payload.delete({ collection: "openings", id: doc.id, overrideAccess: true, context: { skipRevalidate: true } });
process.exit(0);
