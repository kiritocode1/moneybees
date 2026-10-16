import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'event_invitation' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'welcome' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'account_details' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'funds_received' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'pms_monthly_update' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'pms_quarterly_report' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'fee_statement' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'aif_investor_update' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'statement_ready' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'withdrawal_received' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'withdrawal_paid' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'notice_of_change' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'kyc_due' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'complaint_registered' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'complaint_resolved' BEFORE 'application_ack';
  ALTER TYPE "public"."enum_email_templates_purpose" ADD VALUE 'insights' BEFORE 'application_ack';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_templates" ALTER COLUMN "purpose" SET DATA TYPE text;
  DROP TYPE "public"."enum_email_templates_purpose";
  CREATE TYPE "public"."enum_email_templates_purpose" AS ENUM('enquiry_ack', 'enquiry_reply', 'pms_introduction', 'aif_introduction', 'meeting_confirmation', 'follow_up', 'pms_checklist', 'aif_checklist', 'application_ack', 'application_reject', 'interview_invite', 'offer', 'other');
  ALTER TABLE "email_templates" ALTER COLUMN "purpose" SET DATA TYPE "public"."enum_email_templates_purpose" USING "purpose"::"public"."enum_email_templates_purpose";`)
}
