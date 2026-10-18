// Read-only SQL peek for writing migrations in SQL: how Goes with and playbook steps are stored.
// Run: npx payload run .plannotator/admin-dead-ends/check/sql-peek.ts
import config from "@payload-config";
import { sql } from "@payloadcms/db-postgres";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const db = payload.db as unknown as { drizzle: { execute: (query: unknown) => Promise<{ rows: unknown[] }> } };
console.log((await db.drizzle.execute(sql`SELECT * FROM email_templates_texts ORDER BY parent_id, "order"`)).rows);
console.log((await db.drizzle.execute(sql`SELECT _order, _parent_id, id, step FROM playbooks_steps ORDER BY _parent_id, _order LIMIT 4`)).rows);
process.exit(0);
