// Runs the morning task email once, as the cron would. Without RESEND_API_KEY, Payload prints each email instead of sending it.
// Run: npx payload run .plannotator/admin-dead-ends/check/digest.ts
import config from "@payload-config";
import { getPayload } from "payload";
import { sendTaskDigests } from "@/lib/crm/tasks";

const payload = await getPayload({ config });
const original = payload.sendEmail.bind(payload);
payload.sendEmail = async (message) => {
  console.log("TO:", message.to, "| SUBJECT:", message.subject);
  console.log("TEXT:", String(message.text ?? "").split("\n").filter(Boolean).slice(0, 14).join(" / "));
  return original({ ...message, to: "nobody@example.invalid" }).catch(() => undefined);
};
console.log("digests sent:", await sendTaskDigests(payload));
process.exit(0);
