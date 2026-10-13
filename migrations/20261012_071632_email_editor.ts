import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_templates" ALTER COLUMN "body" DROP NOT NULL;
  ALTER TABLE "email_templates" ADD COLUMN "design" jsonb;
  ALTER TABLE "email_templates" ADD COLUMN "html" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_templates" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "email_templates" DROP COLUMN "design";
  ALTER TABLE "email_templates" DROP COLUMN "html";`)
}
