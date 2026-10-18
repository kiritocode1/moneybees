// Proves the PMS introduction's Goes with on real rows, then puts everything back.
// Run with the Blob token unset so the test PDF stays on this laptop:
//   BLOB_READ_WRITE_TOKEN= npx payload run .plannotator/admin-dead-ends/check/fact-sheet-attach.ts
import config from "@payload-config";
import { readFile } from "node:fs/promises";
import { getPayload } from "payload";
import { goesWithFiles, pickFiles, resolveAttachments } from "@/lib/files/library";

const payload = await getPayload({ config });
// A real PDF made with cupsfilter: Payload checks a PDF is whole before taking it.
const PDF = await readFile("/tmp/mb-check/check.pdf");
const admin = (await payload.find({ collection: "users", where: { roles: { in: ["admin"] } }, limit: 1, overrideAccess: true })).docs[0];
const sheet = (await payload.find({ collection: "fact-sheets", where: { status: { equals: "published" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
const before = sheet.pdf ?? null;
const media = await payload.create({ collection: "media", data: { alt: "Check PDF" }, file: { data: PDF, mimetype: "application/pdf", name: "check-july.pdf", size: PDF.byteLength }, overrideAccess: true });
const quiet = { system: "supersede" as const, skipRevalidate: true };
try {
  await payload.update({ collection: "fact-sheets", id: sheet.id, data: { pdf: media.id }, overrideAccess: true, context: quiet });
  const row = (await payload.find({ collection: "email-templates", where: { purpose: { equals: "pms_introduction" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
  const goes = row.goesWith ?? [];
  const now = await goesWithFiles(payload, admin, goes);
  console.log("goes with", goes, "->", now.map((f) => [f.ref, f.name, f.note, f.attachable, f.sizeLabel]));
  const rules = await pickFiles(payload, admin, { rules: true });
  console.log("rules offered", rules.suggested.map((f) => [f.ref, f.name]));
  const files = await resolveAttachments(payload, admin, now.map((f) => f.ref), "https://moneybees.localhost:1355");
  console.log("resolved", files.ok ? files.attachments.map((a) => [a.filename, a.size, a.path?.slice(0, 60), Boolean(a.content)]) : files.error);
  const blocked = await resolveAttachments(payload, admin, ["media:999999"], "https://x");
  console.log("missing file", blocked.ok ? "WRONG: accepted" : blocked.error);
} finally {
  await payload.update({ collection: "fact-sheets", id: sheet.id, data: { pdf: before }, overrideAccess: true, context: quiet });
  await payload.delete({ collection: "media", id: media.id, overrideAccess: true });
  console.log("restored fact sheet pdf to", before, "and deleted the check PDF");
}
process.exit(0);
