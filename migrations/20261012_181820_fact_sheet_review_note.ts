import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fact_sheets" ADD COLUMN "review_note" varchar;
  ALTER TABLE "_fact_sheets_v" ADD COLUMN "version_review_note" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fact_sheets" DROP COLUMN "review_note";
  ALTER TABLE "_fact_sheets_v" DROP COLUMN "version_review_note";`)
}
