// Read-only: the tasks on Kavita Shah's QA deal after it moved to Lost.
// Run: npx payload run .plannotator/admin-dead-ends/check/lost-tasks.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const tasks = await payload.find({ collection: "tasks", where: { contact: { equals: 4 } }, limit: 20, depth: 0, overrideAccess: true });
for (const task of tasks.docs) console.log(task.id, task.title, "| deal", task.deal ?? "-", "| done", task.doneAt ? "yes" : "no", "|", task.outcome ?? "");
const lines = await payload.find({ collection: "activities", where: { deal: { equals: 3 } }, sort: "-at", limit: 5, depth: 0, overrideAccess: true });
for (const line of lines.docs) console.log(line.type, "|", line.summary, "|", line.body ?? "");
process.exit(0);
