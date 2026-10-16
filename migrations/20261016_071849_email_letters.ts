import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'pms_introduction' BEFORE 'follow_up';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'aif_introduction' BEFORE 'follow_up';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'meeting_confirmation' BEFORE 'follow_up';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'pms_checklist' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'aif_checklist' BEFORE 'application_ack';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_templates" ALTER COLUMN "purpose" SET DATA TYPE text;
  DROP TYPE "public"."enum_email_templates_purpose";
  CREATE TYPE "public"."enum_email_templates_purpose" AS ENUM('enquiry_ack', 'enquiry_reply', 'follow_up', 'application_ack', 'application_reject', 'interview_invite', 'offer', 'other');
  ALTER TABLE "email_templates" ALTER COLUMN "purpose" SET DATA TYPE "public"."enum_email_templates_purpose" USING "purpose"::"public"."enum_email_templates_purpose";`)
}
