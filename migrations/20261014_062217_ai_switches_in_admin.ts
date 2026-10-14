import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "crm_settings" ADD COLUMN "ai_triage" boolean DEFAULT false;
  ALTER TABLE "crm_settings" ADD COLUMN "ai_compliance_gate" boolean DEFAULT false;
  ALTER TABLE "crm_settings" ADD COLUMN "ai_drafts" boolean DEFAULT false;
  ALTER TABLE "crm_settings" ADD COLUMN "ai_resume_reading" boolean DEFAULT false;
  ALTER TABLE "crm_settings" ADD COLUMN "ai_applicant_screen" boolean DEFAULT false;
  ALTER TABLE "crm_settings" ADD COLUMN "visitor_id" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "crm_settings" DROP COLUMN "ai_triage";
  ALTER TABLE "crm_settings" DROP COLUMN "ai_compliance_gate";
  ALTER TABLE "crm_settings" DROP COLUMN "ai_drafts";
  ALTER TABLE "crm_settings" DROP COLUMN "ai_resume_reading";
  ALTER TABLE "crm_settings" DROP COLUMN "ai_applicant_screen";
  ALTER TABLE "crm_settings" DROP COLUMN "visitor_id";`)
}
