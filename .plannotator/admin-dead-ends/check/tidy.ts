// Local QA tidy-up after the step 1 checks: a neutral outcome line, and the
// PMS introduction's Goes with back to the migration's rule.
// Run: npx payload run .plannotator/admin-dead-ends/check/tidy.ts
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const outcome = "Reached at 4 pm; meeting set for Tuesday";
const tasks = await payload.find({ collection: "tasks", where: { outcome: { like: "Reached him" } }, depth: 0, overrideAccess: true });
for (const task of tasks.docs) {
  await payload.update({ collection: "tasks", id: task.id, data: { outcome }, overrideAccess: true });
  await payload.update({ collection: "activities", where: { task: { equals: task.id } }, data: { body: outcome }, overrideAccess: true });
}
const rows = await payload.find({ collection: "email-templates", where: { purpose: { equals: "pms_introduction" } }, depth: 0, overrideAccess: true });
for (const row of rows.docs) await payload.update({ collection: "email-templates", id: row.id, data: { goesWith: ["latest-fact-sheet:moneybee-pms"] }, overrideAccess: true });
console.log("tasks reworded", tasks.docs.length, "goes with reset on", rows.docs.length);
process.exit(0);
