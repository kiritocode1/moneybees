// Read-only: what the file library holds locally, and what the PMS introduction goes with.
// Run: npx payload run .plannotator/admin-dead-ends/check/library.ts
import config from "@payload-config";
import { getPayload } from "payload";
import { goesWithFiles, pickFiles } from "@/lib/files/library";

const payload = await getPayload({ config });
const sheets = await payload.find({ collection: "fact-sheets", limit: 20, depth: 0, overrideAccess: true, select: { title: true, status: true, pdf: true, asOf: true } });
console.log("fact sheets", sheets.docs.map((s) => [s.id, s.title, s.status, s.pdf ?? null]));
const cards = await payload.find({ collection: "documents", limit: 20, depth: 0, overrideAccess: true, select: { title: true, file: true } });
console.log("cards with files", cards.docs.filter((c) => c.file).map((c) => [c.id, c.title, c.file]));
const rows = await payload.find({ collection: "email-templates", where: { purpose: { equals: "pms_introduction" } }, depth: 0, overrideAccess: true });
console.log("pms_introduction goesWith", rows.docs.map((r) => r.goesWith));
const admin = (await payload.find({ collection: "users", where: { roles: { in: ["admin"] } }, limit: 1, overrideAccess: true })).docs[0];
const picks = await pickFiles(payload, admin, { goesWith: rows.docs[0]?.goesWith ?? [] });
console.log("picks", { suggested: picks.suggested.map((f) => f.name), recent: picks.recent.map((f) => f.name), all: picks.all.map((f) => [f.ref, f.name, f.note, f.attachable]) });
console.log("goes with now", (await goesWithFiles(payload, admin, rows.docs[0]?.goesWith ?? [])).map((f) => f.name));
process.exit(0);
