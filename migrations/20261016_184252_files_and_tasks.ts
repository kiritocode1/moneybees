import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The Goes with table (email_templates_texts) is made by 20261014_151508_columns_for_seeds, before the seeds that read it.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tasks_kind" AS ENUM('call', 'email', 'meeting', 'todo');
  CREATE TYPE "public"."enum_tasks_source" AS ENUM('manual', 'call', 'meeting', 'note', 'follow_up', 'playbook', 'deal');
  CREATE TABLE "private_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"filename" varchar NOT NULL,
  	"mime_type" varchar NOT NULL,
  	"filesize" numeric NOT NULL,
  	"key" varchar NOT NULL,
  	"uploaded_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  
  CREATE TABLE "emails_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ref" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"size" numeric
  );
  
  ALTER TABLE "activities" ADD COLUMN "task_id" integer;
  ALTER TABLE "tasks" ADD COLUMN "kind" "enum_tasks_kind" DEFAULT 'todo' NOT NULL;
  ALTER TABLE "tasks" ADD COLUMN "source" "enum_tasks_source" DEFAULT 'manual' NOT NULL;
  ALTER TABLE "tasks" ADD COLUMN "letter" varchar;
  ALTER TABLE "tasks" ADD COLUMN "outcome" varchar;
  ALTER TABLE "tasks" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "private_files_id" integer;
  ALTER TABLE "private_files" ADD CONSTRAINT "private_files_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emails_attachments" ADD CONSTRAINT "emails_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emails"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "private_files_key_idx" ON "private_files" USING btree ("key");
  CREATE INDEX "private_files_uploaded_by_idx" ON "private_files" USING btree ("uploaded_by_id");
  CREATE INDEX "private_files_updated_at_idx" ON "private_files" USING btree ("updated_at");
  CREATE INDEX "private_files_created_at_idx" ON "private_files" USING btree ("created_at");
  CREATE INDEX "emails_attachments_order_idx" ON "emails_attachments" USING btree ("_order");
  CREATE INDEX "emails_attachments_parent_id_idx" ON "emails_attachments" USING btree ("_parent_id");
  CREATE INDEX "emails_attachments_ref_idx" ON "emails_attachments" USING btree ("ref");
  ALTER TABLE "activities" ADD CONSTRAINT "activities_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_files_fk" FOREIGN KEY ("private_files_id") REFERENCES "public"."private_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "activities_task_idx" ON "activities" USING btree ("task_id");
  CREATE INDEX "tasks_created_by_idx" ON "tasks" USING btree ("created_by_id");
  CREATE INDEX "payload_locked_documents_rels_private_files_id_idx" ON "payload_locked_documents_rels" USING btree ("private_files_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "private_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emails_attachments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "private_files" CASCADE;
  DROP TABLE "emails_attachments" CASCADE;
  ALTER TABLE "activities" DROP CONSTRAINT "activities_task_id_tasks_id_fk";
  
  ALTER TABLE "tasks" DROP CONSTRAINT "tasks_created_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_private_files_fk";
  
  DROP INDEX "activities_task_idx";
  DROP INDEX "tasks_created_by_idx";
  DROP INDEX "payload_locked_documents_rels_private_files_id_idx";
  ALTER TABLE "activities" DROP COLUMN "task_id";
  ALTER TABLE "tasks" DROP COLUMN "kind";
  ALTER TABLE "tasks" DROP COLUMN "source";
  ALTER TABLE "tasks" DROP COLUMN "letter";
  ALTER TABLE "tasks" DROP COLUMN "outcome";
  ALTER TABLE "tasks" DROP COLUMN "created_by_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "private_files_id";
  DROP TYPE "public"."enum_tasks_kind";
  DROP TYPE "public"."enum_tasks_source";`)
}
