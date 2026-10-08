import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_fact_sheets_returns_period" AS ENUM('1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', 'SI');
  CREATE TYPE "public"."enum_fact_sheets_status" AS ENUM('draft', 'in_review', 'published', 'superseded');
  CREATE TYPE "public"."enum__fact_sheets_v_version_returns_period" AS ENUM('1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', 'SI');
  CREATE TYPE "public"."enum__fact_sheets_v_version_status" AS ENUM('draft', 'in_review', 'published', 'superseded');
  CREATE TYPE "public"."enum_products_kind" AS ENUM('pms', 'aif');
  CREATE TYPE "public"."enum_metrics_unit" AS ENUM('none', 'percent', 'years', 'crore', 'stocks');
  CREATE TYPE "public"."enum_investors_status" AS ENUM('active', 'disabled');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'compliance', 'sales', 'hr', 'operations', 'integration');
  CREATE TABLE "fact_sheets_returns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"period" "enum_fact_sheets_returns_period" NOT NULL,
  	"ours" numeric,
  	"benchmark" numeric
  );
  
  CREATE TABLE "fact_sheets_sectors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"weight" numeric NOT NULL
  );
  
  CREATE TABLE "fact_sheets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"product_id" integer NOT NULL,
  	"as_of" timestamp(3) with time zone NOT NULL,
  	"status" "enum_fact_sheets_status" DEFAULT 'draft' NOT NULL,
  	"wealth_ours" numeric,
  	"wealth_benchmark" numeric,
  	"pdf_id" integer,
  	"correction_reason" varchar,
  	"submitted_by_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"approved_by_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_fact_sheets_v_version_returns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"period" "enum__fact_sheets_v_version_returns_period" NOT NULL,
  	"ours" numeric,
  	"benchmark" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_fact_sheets_v_version_sectors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"weight" numeric NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_fact_sheets_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_product_id" integer NOT NULL,
  	"version_as_of" timestamp(3) with time zone NOT NULL,
  	"version_status" "enum__fact_sheets_v_version_status" DEFAULT 'draft' NOT NULL,
  	"version_wealth_ours" numeric,
  	"version_wealth_benchmark" numeric,
  	"version_pdf_id" integer,
  	"version_correction_reason" varchar,
  	"version_submitted_by_id" integer,
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_approved_by_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"kind" "enum_products_kind" NOT NULL,
  	"benchmark" varchar NOT NULL,
  	"inception" timestamp(3) with time zone NOT NULL,
  	"registration" varchar,
  	"show_performance_publicly" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "metrics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"key" varchar NOT NULL,
  	"value" numeric NOT NULL,
  	"unit" "enum_metrics_unit" DEFAULT 'none',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "investors_trusted_devices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hash" varchar NOT NULL,
  	"last_used_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "investors_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "investors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar,
  	"status" "enum_investors_status" DEFAULT 'active' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "investors_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"actor_id" integer,
  	"action" varchar NOT NULL,
  	"collection_slug" varchar NOT NULL,
  	"doc_id" varchar NOT NULL,
  	"summary" varchar,
  	"changes" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "login_challenges" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"investor_id" integer NOT NULL,
  	"nonce_hash" varchar NOT NULL,
  	"code_hash" varchar NOT NULL,
  	"sealed_token" varchar NOT NULL,
  	"session_expires" timestamp(3) with time zone NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"attempts" numeric DEFAULT 0 NOT NULL,
  	"consumed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"fact_sheets_id" integer,
  	"products_id" integer,
  	"metrics_id" integer,
  	"investors_id" integer,
  	"users_id" integer,
  	"audit_log_id" integer,
  	"media_id" integer,
  	"login_challenges_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"investors_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "fact_sheets_returns" ADD CONSTRAINT "fact_sheets_returns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fact_sheets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fact_sheets_sectors" ADD CONSTRAINT "fact_sheets_sectors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fact_sheets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fact_sheets" ADD CONSTRAINT "fact_sheets_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fact_sheets" ADD CONSTRAINT "fact_sheets_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fact_sheets" ADD CONSTRAINT "fact_sheets_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fact_sheets" ADD CONSTRAINT "fact_sheets_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fact_sheets_v_version_returns" ADD CONSTRAINT "_fact_sheets_v_version_returns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_fact_sheets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_fact_sheets_v_version_sectors" ADD CONSTRAINT "_fact_sheets_v_version_sectors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_fact_sheets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_fact_sheets_v" ADD CONSTRAINT "_fact_sheets_v_parent_id_fact_sheets_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."fact_sheets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fact_sheets_v" ADD CONSTRAINT "_fact_sheets_v_version_product_id_products_id_fk" FOREIGN KEY ("version_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fact_sheets_v" ADD CONSTRAINT "_fact_sheets_v_version_pdf_id_media_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fact_sheets_v" ADD CONSTRAINT "_fact_sheets_v_version_submitted_by_id_users_id_fk" FOREIGN KEY ("version_submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fact_sheets_v" ADD CONSTRAINT "_fact_sheets_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investors_trusted_devices" ADD CONSTRAINT "investors_trusted_devices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_sessions" ADD CONSTRAINT "investors_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_texts" ADD CONSTRAINT "investors_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "login_challenges" ADD CONSTRAINT "login_challenges_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fact_sheets_fk" FOREIGN KEY ("fact_sheets_id") REFERENCES "public"."fact_sheets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_metrics_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_investors_fk" FOREIGN KEY ("investors_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_login_challenges_fk" FOREIGN KEY ("login_challenges_id") REFERENCES "public"."login_challenges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_investors_fk" FOREIGN KEY ("investors_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "fact_sheets_returns_order_idx" ON "fact_sheets_returns" USING btree ("_order");
  CREATE INDEX "fact_sheets_returns_parent_id_idx" ON "fact_sheets_returns" USING btree ("_parent_id");
  CREATE INDEX "fact_sheets_sectors_order_idx" ON "fact_sheets_sectors" USING btree ("_order");
  CREATE INDEX "fact_sheets_sectors_parent_id_idx" ON "fact_sheets_sectors" USING btree ("_parent_id");
  CREATE INDEX "fact_sheets_product_idx" ON "fact_sheets" USING btree ("product_id");
  CREATE INDEX "fact_sheets_pdf_idx" ON "fact_sheets" USING btree ("pdf_id");
  CREATE INDEX "fact_sheets_submitted_by_idx" ON "fact_sheets" USING btree ("submitted_by_id");
  CREATE INDEX "fact_sheets_approved_by_idx" ON "fact_sheets" USING btree ("approved_by_id");
  CREATE INDEX "fact_sheets_updated_at_idx" ON "fact_sheets" USING btree ("updated_at");
  CREATE INDEX "fact_sheets_created_at_idx" ON "fact_sheets" USING btree ("created_at");
  CREATE INDEX "_fact_sheets_v_version_returns_order_idx" ON "_fact_sheets_v_version_returns" USING btree ("_order");
  CREATE INDEX "_fact_sheets_v_version_returns_parent_id_idx" ON "_fact_sheets_v_version_returns" USING btree ("_parent_id");
  CREATE INDEX "_fact_sheets_v_version_sectors_order_idx" ON "_fact_sheets_v_version_sectors" USING btree ("_order");
  CREATE INDEX "_fact_sheets_v_version_sectors_parent_id_idx" ON "_fact_sheets_v_version_sectors" USING btree ("_parent_id");
  CREATE INDEX "_fact_sheets_v_parent_idx" ON "_fact_sheets_v" USING btree ("parent_id");
  CREATE INDEX "_fact_sheets_v_version_version_product_idx" ON "_fact_sheets_v" USING btree ("version_product_id");
  CREATE INDEX "_fact_sheets_v_version_version_pdf_idx" ON "_fact_sheets_v" USING btree ("version_pdf_id");
  CREATE INDEX "_fact_sheets_v_version_version_submitted_by_idx" ON "_fact_sheets_v" USING btree ("version_submitted_by_id");
  CREATE INDEX "_fact_sheets_v_version_version_approved_by_idx" ON "_fact_sheets_v" USING btree ("version_approved_by_id");
  CREATE INDEX "_fact_sheets_v_version_version_updated_at_idx" ON "_fact_sheets_v" USING btree ("version_updated_at");
  CREATE INDEX "_fact_sheets_v_version_version_created_at_idx" ON "_fact_sheets_v" USING btree ("version_created_at");
  CREATE INDEX "_fact_sheets_v_created_at_idx" ON "_fact_sheets_v" USING btree ("created_at");
  CREATE INDEX "_fact_sheets_v_updated_at_idx" ON "_fact_sheets_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "metrics_key_idx" ON "metrics" USING btree ("key");
  CREATE INDEX "metrics_updated_at_idx" ON "metrics" USING btree ("updated_at");
  CREATE INDEX "metrics_created_at_idx" ON "metrics" USING btree ("created_at");
  CREATE INDEX "investors_trusted_devices_order_idx" ON "investors_trusted_devices" USING btree ("_order");
  CREATE INDEX "investors_trusted_devices_parent_id_idx" ON "investors_trusted_devices" USING btree ("_parent_id");
  CREATE INDEX "investors_sessions_order_idx" ON "investors_sessions" USING btree ("_order");
  CREATE INDEX "investors_sessions_parent_id_idx" ON "investors_sessions" USING btree ("_parent_id");
  CREATE INDEX "investors_updated_at_idx" ON "investors" USING btree ("updated_at");
  CREATE INDEX "investors_created_at_idx" ON "investors" USING btree ("created_at");
  CREATE UNIQUE INDEX "investors_email_idx" ON "investors" USING btree ("email");
  CREATE INDEX "investors_texts_order_parent" ON "investors_texts" USING btree ("order","parent_id");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_id");
  CREATE INDEX "audit_log_collection_slug_idx" ON "audit_log" USING btree ("collection_slug");
  CREATE INDEX "audit_log_doc_id_idx" ON "audit_log" USING btree ("doc_id");
  CREATE INDEX "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "login_challenges_investor_idx" ON "login_challenges" USING btree ("investor_id");
  CREATE INDEX "login_challenges_expires_at_idx" ON "login_challenges" USING btree ("expires_at");
  CREATE INDEX "login_challenges_updated_at_idx" ON "login_challenges" USING btree ("updated_at");
  CREATE INDEX "login_challenges_created_at_idx" ON "login_challenges" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_fact_sheets_id_idx" ON "payload_locked_documents_rels" USING btree ("fact_sheets_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_metrics_id_idx" ON "payload_locked_documents_rels" USING btree ("metrics_id");
  CREATE INDEX "payload_locked_documents_rels_investors_id_idx" ON "payload_locked_documents_rels" USING btree ("investors_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_login_challenges_id_idx" ON "payload_locked_documents_rels" USING btree ("login_challenges_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_investors_id_idx" ON "payload_preferences_rels" USING btree ("investors_id");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "fact_sheets_returns" CASCADE;
  DROP TABLE "fact_sheets_sectors" CASCADE;
  DROP TABLE "fact_sheets" CASCADE;
  DROP TABLE "_fact_sheets_v_version_returns" CASCADE;
  DROP TABLE "_fact_sheets_v_version_sectors" CASCADE;
  DROP TABLE "_fact_sheets_v" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "metrics" CASCADE;
  DROP TABLE "investors_trusted_devices" CASCADE;
  DROP TABLE "investors_sessions" CASCADE;
  DROP TABLE "investors" CASCADE;
  DROP TABLE "investors_texts" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "login_challenges" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_fact_sheets_returns_period";
  DROP TYPE "public"."enum_fact_sheets_status";
  DROP TYPE "public"."enum__fact_sheets_v_version_returns_period";
  DROP TYPE "public"."enum__fact_sheets_v_version_status";
  DROP TYPE "public"."enum_products_kind";
  DROP TYPE "public"."enum_metrics_unit";
  DROP TYPE "public"."enum_investors_status";
  DROP TYPE "public"."enum_users_roles";`)
}
