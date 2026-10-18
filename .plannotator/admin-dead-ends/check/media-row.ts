// Read-only: the newest Media rows' file names and sizes, to check a Replace.
// Run: npx payload run .plannotator/admin-dead-ends/check/media-row.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const media = await payload.find({ collection: "media", sort: "-updatedAt", limit: 3, depth: 0, overrideAccess: true });
for (const doc of media.docs) {
  const bytes = doc.url ? new Uint8Array(await (await fetch(doc.url)).arrayBuffer()) : null;
  console.log(doc.id, doc.filename, doc.filesize, doc.mimeType, "served bytes:", bytes?.byteLength, "blue pixel:", bytes ? Buffer.from(bytes).includes(Buffer.from([40, 90, 200])) : null);
}
process.exit(0);
