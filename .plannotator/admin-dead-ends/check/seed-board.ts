// Local QA only: deals across the stages so the board can be checked by hand.
// Titles start "QA board:" so remove-board.ts can take them away again.
// Run: npx payload run .plannotator/admin-dead-ends/check/seed-board.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const DAY = 86_400_000;
const at = (days: number) => new Date(Date.now() - days * DAY).toISOString();
const product = { pms: 2, aif: 3 } as const;
const rows = [
  { contact: 2, kind: "pms", stage: "enquiry", amount: 1, days: 1, owner: 2, task: null },
  { contact: 4, kind: "pms", stage: "contacted", amount: 1.5, days: 4, owner: 1, task: { title: "Send the PMS checklist", kind: "email", due: -1 } },
  { contact: 5, kind: "pms", stage: "documents", amount: 3, days: 16, owner: 2, task: null },
  { contact: 7, kind: "pms", stage: "onboarding", amount: 1, days: 6, owner: 1, task: { title: "Check KYC with operations", kind: "todo", due: 2 } },
  { contact: 3, kind: "aif", stage: "contacted", amount: 1.5, days: 2, owner: 1, task: { title: "Call about a meeting", kind: "call", due: 3 } },
] as const;

for (const row of rows) {
  const deal = await payload.create({ collection: "deals", overrideAccess: true, data: { title: `QA board: ${row.kind} ${row.stage}`, contact: row.contact, product: product[row.kind], stage: row.stage, ticketSize: row.amount, owner: row.owner } });
  await payload.update({ collection: "deals", id: deal.id, overrideAccess: true, data: { stage: row.stage, stageChangedAt: at(row.days) } });
  if (row.task) {
    await payload.create({ collection: "tasks", overrideAccess: true, data: { title: row.task.title, kind: row.task.kind, source: "deal", dueAt: new Date(Date.now() + row.task.due * DAY).toISOString(), owner: row.owner, contact: row.contact, deal: deal.id } });
  }
  console.log("deal", deal.id, row.kind, row.stage);
}
process.exit(0);
