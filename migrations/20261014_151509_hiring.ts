import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { STARTER_PLAYBOOKS, STARTER_TEMPLATES } from '../lib/crm/starter-content'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_applications_must_haves_answer" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_applications_history_kind" AS ENUM('applied', 'stage', 'email', 'interview', 'note', 'owner', 'system');
  CREATE TYPE "public"."enum_applications_notice" AS ENUM('now', '15', '30', '60', '90');
  CREATE TYPE "public"."enum_applications_team" AS ENUM('research', 'portfolio', 'advisory', 'compliance', 'services');
  CREATE TYPE "public"."enum_applications_stage" AS ENUM('new', 'shortlisted', 'interview', 'offer', 'hired', 'closed');
  CREATE TYPE "public"."enum_applications_close_reason" AS ENUM('not_taken_forward', 'role_filled', 'withdrew');
  ALTER TYPE "public"."enum_openings_status" ADD VALUE 'closed';
  CREATE TABLE "openings_must_haves" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "applications_must_haves" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" "enum_applications_must_haves_answer" NOT NULL
  );
  
  CREATE TABLE "applications_interviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL,
  	"with" varchar NOT NULL,
  	"place" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "applications_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL,
  	"kind" "enum_applications_history_kind" NOT NULL,
  	"actor_id" integer,
  	"summary" varchar NOT NULL,
  	"body" varchar,
  	"email_id" integer
  );
  
  CREATE TABLE "applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"city" varchar,
  	"linkedin" varchar,
  	"notice" "enum_applications_notice",
  	"opening_id" integer,
  	"role_title" varchar NOT NULL,
  	"team" "enum_applications_team",
  	"stage" "enum_applications_stage" DEFAULT 'new' NOT NULL,
  	"close_reason" "enum_applications_close_reason",
  	"owner_id" integer,
  	"why" varchar,
  	"experience" varchar,
  	"resume_key" varchar,
  	"resume_name" varchar,
  	"resume_size" numeric,
  	"resume_type" varchar,
  	"screen" jsonb,
  	"received_at" timestamp(3) with time zone NOT NULL,
  	"consent_at" timestamp(3) with time zone NOT NULL,
  	"delete_after" timestamp(3) with time zone NOT NULL,
  	"origin_page" varchar,
  	"origin_ip_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "careers_page_blocks_careers_resume" ALTER COLUMN "note" DROP DEFAULT;
  ALTER TABLE "_careers_page_v_blocks_careers_resume" ALTER COLUMN "note" DROP DEFAULT;
  ALTER TABLE "emails" ADD COLUMN "application_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "applications_id" integer;
  ALTER TABLE "crm_settings" ADD COLUMN "hiring_keep_months" numeric DEFAULT 12 NOT NULL;
  ALTER TABLE "crm_settings" ADD COLUMN "hiring_acknowledge" boolean DEFAULT true;
  ALTER TABLE "openings_must_haves" ADD CONSTRAINT "openings_must_haves_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_must_haves" ADD CONSTRAINT "applications_must_haves_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_interviews" ADD CONSTRAINT "applications_interviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_history" ADD CONSTRAINT "applications_history_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_history" ADD CONSTRAINT "applications_history_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."emails"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_history" ADD CONSTRAINT "applications_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_opening_id_openings_id_fk" FOREIGN KEY ("opening_id") REFERENCES "public"."openings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "openings_must_haves_order_idx" ON "openings_must_haves" USING btree ("_order");
  CREATE INDEX "openings_must_haves_parent_id_idx" ON "openings_must_haves" USING btree ("_parent_id");
  CREATE INDEX "applications_must_haves_order_idx" ON "applications_must_haves" USING btree ("_order");
  CREATE INDEX "applications_must_haves_parent_id_idx" ON "applications_must_haves" USING btree ("_parent_id");
  CREATE INDEX "applications_interviews_order_idx" ON "applications_interviews" USING btree ("_order");
  CREATE INDEX "applications_interviews_parent_id_idx" ON "applications_interviews" USING btree ("_parent_id");
  CREATE INDEX "applications_interviews_at_idx" ON "applications_interviews" USING btree ("at");
  CREATE INDEX "applications_history_order_idx" ON "applications_history" USING btree ("_order");
  CREATE INDEX "applications_history_parent_id_idx" ON "applications_history" USING btree ("_parent_id");
  CREATE INDEX "applications_history_actor_idx" ON "applications_history" USING btree ("actor_id");
  CREATE INDEX "applications_history_email_idx" ON "applications_history" USING btree ("email_id");
  CREATE INDEX "applications_email_idx" ON "applications" USING btree ("email");
  CREATE INDEX "applications_opening_idx" ON "applications" USING btree ("opening_id");
  CREATE INDEX "applications_stage_idx" ON "applications" USING btree ("stage");
  CREATE INDEX "applications_owner_idx" ON "applications" USING btree ("owner_id");
  CREATE INDEX "applications_received_at_idx" ON "applications" USING btree ("received_at");
  CREATE INDEX "applications_delete_after_idx" ON "applications" USING btree ("delete_after");
  CREATE INDEX "applications_origin_origin_ip_hash_idx" ON "applications" USING btree ("origin_ip_hash");
  CREATE INDEX "applications_updated_at_idx" ON "applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");
  ALTER TABLE "emails" ADD CONSTRAINT "emails_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "openings_anchor_idx" ON "openings" USING btree ("anchor");
  CREATE INDEX "emails_application_idx" ON "emails" USING btree ("application_id");
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("applications_id");`)

  // "Send your resume" now opens the apply form, so the note under it no longer opens an email app.
  await db.execute(sql`
  UPDATE "careers_page_blocks_careers_resume" SET "note" = NULL WHERE "note" = 'Opens your email app.';
  UPDATE "_careers_page_v_blocks_careers_resume" SET "note" = NULL WHERE "note" = 'Opens your email app.';`)

  // The starter templates and playbooks (lib/crm/starter-content.ts), where a database has none yet:
  // production had neither, so its enquiry desk sent bare acknowledgements and matched no playbook.
  const templateIds = new Map<string, number>()
  for (const [key, template] of Object.entries(STARTER_TEMPLATES)) {
    const { docs } = await payload.find({ collection: 'email-templates', where: { name: { equals: template.name } }, limit: 1, depth: 0, req })
    templateIds.set(key, docs[0]?.id ?? (await payload.create({ collection: 'email-templates', data: { ...template, purpose: template.purpose as never }, req })).id)
  }
  const { totalDocs: playbooks } = await payload.count({ collection: 'playbooks', req })
  if (playbooks === 0) {
    for (const { steps, template, kinds, severities, handlerRoles, ...playbook } of STARTER_PLAYBOOKS) {
      await payload.create({
        collection: 'playbooks',
        data: { ...playbook, kinds: [...kinds] as never, severities: [...severities] as never, handlerRoles: [...handlerRoles] as never, template: template ? templateIds.get(template) : null, steps: steps.map((step) => ({ step })) },
        req,
      })
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "openings_must_haves" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "applications_must_haves" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "applications_interviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "applications_history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "applications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "openings_must_haves" CASCADE;
  DROP TABLE "applications_must_haves" CASCADE;
  DROP TABLE "applications_interviews" CASCADE;
  DROP TABLE "applications_history" CASCADE;
  DROP TABLE "applications" CASCADE;
  ALTER TABLE "emails" DROP CONSTRAINT "emails_application_id_applications_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_applications_fk";
  
  ALTER TABLE "openings" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "openings" ALTER COLUMN "status" SET DEFAULT 'live'::text;
  DROP TYPE "public"."enum_openings_status";
  CREATE TYPE "public"."enum_openings_status" AS ENUM('live', 'sample');
  ALTER TABLE "openings" ALTER COLUMN "status" SET DEFAULT 'live'::"public"."enum_openings_status";
  ALTER TABLE "openings" ALTER COLUMN "status" SET DATA TYPE "public"."enum_openings_status" USING "status"::"public"."enum_openings_status";
  DROP INDEX "openings_anchor_idx";
  DROP INDEX "emails_application_idx";
  DROP INDEX "payload_locked_documents_rels_applications_id_idx";
  ALTER TABLE "careers_page_blocks_careers_resume" ALTER COLUMN "note" SET DEFAULT 'Opens your email app.';
  ALTER TABLE "_careers_page_v_blocks_careers_resume" ALTER COLUMN "note" SET DEFAULT 'Opens your email app.';
  ALTER TABLE "emails" DROP COLUMN "application_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "applications_id";
  ALTER TABLE "crm_settings" DROP COLUMN "hiring_keep_months";
  ALTER TABLE "crm_settings" DROP COLUMN "hiring_acknowledge";
  DROP TYPE "public"."enum_applications_must_haves_answer";
  DROP TYPE "public"."enum_applications_history_kind";
  DROP TYPE "public"."enum_applications_notice";
  DROP TYPE "public"."enum_applications_team";
  DROP TYPE "public"."enum_applications_stage";
  DROP TYPE "public"."enum_applications_close_reason";`)
}
