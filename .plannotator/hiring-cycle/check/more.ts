/*
 * Two more applications through the real intake (lib/hiring/apply.ts), for
 * the Delete now and retention checks. Local database only; not committed.
 */
import { readFileSync } from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";
import { receiveApplication } from "@/lib/hiring/apply";

const payload = await getPayload({ config });
if (!/localhost:54329/.test(process.env.DATABASE_URL ?? "")) throw new Error("Local database only.");
const fields = (name: string, email: string) => ({ name, email, phone: "+91 90000 00000", city: "Mumbai", notice: "30", why: "Check run.", consent: "yes" });
const pdf = new Uint8Array(readFileSync(".plannotator/hiring-cycle/check/Priya_Shah_Resume.pdf"));

const a = await receiveApplication({ role: "", team: "research", fields: fields("Delete Me", "delete.me@example.com"), mustHaves: [], resume: { bytes: pdf, name: "delete-me.pdf" } }, {});
const b = await receiveApplication({ role: "", team: "advisory", fields: fields("Expired Person", "expired@example.com"), mustHaves: [], resume: { bytes: pdf, name: "expired.pdf" } }, {});
if (!a.ok || !b.ok) throw new Error(JSON.stringify([a, b]));
await payload.update({ collection: "applications", id: b.id, overrideAccess: true, data: { deleteAfter: new Date(Date.now() - 86_400_000).toISOString() } });
const expired = await payload.findByID({ collection: "applications", id: b.id, overrideAccess: true });
console.log(JSON.stringify({ deleteMe: a.id, expired: b.id, expiredKey: expired.resume?.key }));
process.exit(0);
