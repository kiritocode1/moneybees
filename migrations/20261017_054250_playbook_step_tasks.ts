import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// A task's playbook step. The steps' Due and Ticks itself when columns are made by 20261014_151508_columns_for_seeds, before the seeds that write playbooks.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tasks" ADD COLUMN "step" varchar;
  CREATE INDEX "tasks_step_idx" ON "tasks" USING btree ("step");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "tasks_step_idx";
  ALTER TABLE "tasks" DROP COLUMN "step";`)
}
