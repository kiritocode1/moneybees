/*
 * Checks the AI path end to end with a made-up enquiry: AI Gateway reachable,
 * Jev answering under zero data retention. Sends no real person's data.
 *
 *   ./node_modules/.bin/payload run scripts/check-ai.ts
 */
import { askJev } from "@/lib/crm/triage";

const started = Date.now();
try {
  const answers = await askJev({
    kind: "support",
    existingInvestor: true,
    answers: { topic: "Withdrawal", message: "My redemption request from last week has still not been credited. This is the second time I am writing." },
  });
  console.log(JSON.stringify({ ok: true, ms: Date.now() - started, answers }, null, 2));
} catch (error) {
  console.log(JSON.stringify({ ok: false, ms: Date.now() - started, error: error instanceof Error ? error.message : String(error) }, null, 2));
}
process.exit(0);
