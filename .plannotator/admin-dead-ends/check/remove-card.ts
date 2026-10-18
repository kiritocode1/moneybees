// Removes the document card the Files check made (id from the run), so the Investor Centre is as it was.
// Run: CARD=12 npx payload run .plannotator/admin-dead-ends/check/remove-card.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const id = Number(process.env.CARD);
const card = await payload.findByID({ collection: "documents", id, depth: 0, overrideAccess: true, disableErrors: true });
if (card?.title === "Check card") {
  await payload.delete({ collection: "documents", id, overrideAccess: true, context: { skipRevalidate: true } });
  console.log("removed card", id);
} else console.log("left alone: card", id, "is", card?.title);
process.exit(0);
