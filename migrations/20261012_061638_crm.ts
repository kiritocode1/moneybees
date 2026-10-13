import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_enquiries_kind" AS ENUM('pms', 'aif', 'support', 'general');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'open', 'waiting', 'converted', 'closed', 'spam');
  CREATE TYPE "public"."enum_enquiries_severity" AS ENUM('low', 'normal', 'high', 'critical');
  CREATE TYPE "public"."enum_contacts_topics" AS ENUM('factsheet', 'insights', 'events');
  CREATE TYPE "public"."enum_contacts_kind" AS ENUM('prospect', 'investor', 'distributor', 'other');
  CREATE TYPE "public"."enum_contacts_source" AS ENUM('website', 'offline', 'referral', 'distributor', 'import', 'portal');
  CREATE TYPE "public"."enum_entities_type" AS ENUM('individual', 'huf', 'family_office', 'company', 'trust', 'other');
  CREATE TYPE "public"."enum_deals_stage" AS ENUM('enquiry', 'contacted', 'meeting', 'documents', 'onboarding', 'invested', 'lost');
  CREATE TYPE "public"."enum_activities_type" AS ENUM('form', 'email_out', 'email_in', 'email_event', 'call', 'meeting', 'note', 'page_view', 'stage', 'task', 'system');
  CREATE TYPE "public"."enum_emails_direction" AS ENUM('out', 'in');
  CREATE TYPE "public"."enum_emails_status" AS ENUM('queued', 'logged', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed', 'received');
  CREATE TYPE "public"."enum_playbooks_kinds" AS ENUM('pms', 'aif', 'support', 'general');
  CREATE TYPE "public"."enum_playbooks_severities" AS ENUM('low', 'normal', 'high', 'critical');
  CREATE TYPE "public"."enum_playbooks_handler_roles" AS ENUM('admin', 'editor', 'compliance', 'sales', 'hr', 'operations');
  CREATE TYPE "public"."enum_email_templates_purpose" AS ENUM('enquiry_ack', 'enquiry_reply', 'follow_up', 'application_ack', 'application_reject', 'interview_invite', 'offer', 'other');
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"contact_id" integer NOT NULL,
  	"kind" "enum_enquiries_kind" NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'new' NOT NULL,
  	"severity" "enum_enquiries_severity" DEFAULT 'normal' NOT NULL,
  	"message" varchar,
  	"answers" jsonb,
  	"triage" jsonb,
  	"received_at" timestamp(3) with time zone NOT NULL,
  	"due_at" timestamp(3) with time zone,
  	"first_response_at" timestamp(3) with time zone,
  	"assignee_id" integer,
  	"claimed_at" timestamp(3) with time zone,
  	"playbook_id" integer,
  	"deal_id" integer,
  	"closing_note" varchar,
  	"origin_page" varchar,
  	"origin_visitor_id" varchar,
  	"origin_utm" jsonb,
  	"origin_ip_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contacts_topics" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_contacts_topics",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"city" varchar,
  	"kind" "enum_contacts_kind" DEFAULT 'prospect' NOT NULL,
  	"source" "enum_contacts_source",
  	"entity_id" integer,
  	"owner_id" integer,
  	"referred_by_id" integer,
  	"investor_id" integer,
  	"consent_at" timestamp(3) with time zone,
  	"consent_source" varchar,
  	"consent_wording" varchar,
  	"unsubscribed_at" timestamp(3) with time zone,
  	"last_activity_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contacts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "entities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_entities_type" DEFAULT 'individual' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "deals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"contact_id" integer NOT NULL,
  	"entity_id" integer,
  	"product_id" integer NOT NULL,
  	"stage" "enum_deals_stage" DEFAULT 'enquiry' NOT NULL,
  	"ticket_size" numeric,
  	"expected_close" timestamp(3) with time zone,
  	"lost_reason" varchar,
  	"owner_id" integer,
  	"enquiry_id" integer,
  	"stage_changed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "activities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_id" integer NOT NULL,
  	"type" "enum_activities_type" NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL,
  	"summary" varchar NOT NULL,
  	"body" varchar,
  	"enquiry_id" integer,
  	"deal_id" integer,
  	"email_id" integer,
  	"actor_id" integer,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tasks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"due_at" timestamp(3) with time zone NOT NULL,
  	"owner_id" integer NOT NULL,
  	"contact_id" integer,
  	"enquiry_id" integer,
  	"deal_id" integer,
  	"done_at" timestamp(3) with time zone,
  	"done_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "emails_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" varchar NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "emails" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"direction" "enum_emails_direction" NOT NULL,
  	"status" "enum_emails_status" NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"text" varchar,
  	"contact_id" integer,
  	"enquiry_id" integer,
  	"sent_by_id" integer,
  	"in_reply_to_id" integer,
  	"resend_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "playbooks_kinds" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_playbooks_kinds",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "playbooks_severities" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_playbooks_severities",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "playbooks_handler_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_playbooks_handler_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "playbooks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar NOT NULL
  );
  
  CREATE TABLE "playbooks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"response_hours" numeric NOT NULL,
  	"order" numeric DEFAULT 100 NOT NULL,
  	"template_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"purpose" "enum_email_templates_purpose" NOT NULL,
  	"subject" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "crm_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"response_hours_critical" numeric DEFAULT 2 NOT NULL,
  	"response_hours_high" numeric DEFAULT 8 NOT NULL,
  	"response_hours_normal" numeric DEFAULT 24 NOT NULL,
  	"response_hours_low" numeric DEFAULT 72 NOT NULL,
  	"acknowledge" boolean DEFAULT true,
  	"ai_triage_confidence" numeric DEFAULT 0.7 NOT NULL,
  	"ai_compliance_block" numeric DEFAULT 0.5 NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "enquiries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contacts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "entities_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "deals_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "activities_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tasks_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "emails_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "playbooks_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "email_templates_id" integer;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_playbook_id_playbooks_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbooks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_topics" ADD CONSTRAINT "contacts_topics_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_referred_by_id_contacts_id_fk" FOREIGN KEY ("referred_by_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_texts" ADD CONSTRAINT "contacts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "deals" ADD CONSTRAINT "deals_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deals" ADD CONSTRAINT "deals_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deals" ADD CONSTRAINT "deals_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deals" ADD CONSTRAINT "deals_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deals" ADD CONSTRAINT "deals_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."emails"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_done_by_id_users_id_fk" FOREIGN KEY ("done_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emails_events" ADD CONSTRAINT "emails_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emails" ADD CONSTRAINT "emails_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emails" ADD CONSTRAINT "emails_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emails" ADD CONSTRAINT "emails_sent_by_id_users_id_fk" FOREIGN KEY ("sent_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emails" ADD CONSTRAINT "emails_in_reply_to_id_emails_id_fk" FOREIGN KEY ("in_reply_to_id") REFERENCES "public"."emails"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "playbooks_kinds" ADD CONSTRAINT "playbooks_kinds_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."playbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "playbooks_severities" ADD CONSTRAINT "playbooks_severities_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."playbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "playbooks_handler_roles" ADD CONSTRAINT "playbooks_handler_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."playbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "playbooks_steps" ADD CONSTRAINT "playbooks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."playbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "playbooks" ADD CONSTRAINT "playbooks_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "enquiries_contact_idx" ON "enquiries" USING btree ("contact_id");
  CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");
  CREATE INDEX "enquiries_severity_idx" ON "enquiries" USING btree ("severity");
  CREATE INDEX "enquiries_received_at_idx" ON "enquiries" USING btree ("received_at");
  CREATE INDEX "enquiries_due_at_idx" ON "enquiries" USING btree ("due_at");
  CREATE INDEX "enquiries_assignee_idx" ON "enquiries" USING btree ("assignee_id");
  CREATE INDEX "enquiries_playbook_idx" ON "enquiries" USING btree ("playbook_id");
  CREATE INDEX "enquiries_deal_idx" ON "enquiries" USING btree ("deal_id");
  CREATE INDEX "enquiries_origin_origin_visitor_id_idx" ON "enquiries" USING btree ("origin_visitor_id");
  CREATE INDEX "enquiries_origin_origin_ip_hash_idx" ON "enquiries" USING btree ("origin_ip_hash");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "contacts_topics_order_idx" ON "contacts_topics" USING btree ("order");
  CREATE INDEX "contacts_topics_parent_idx" ON "contacts_topics" USING btree ("parent_id");
  CREATE UNIQUE INDEX "contacts_email_idx" ON "contacts" USING btree ("email");
  CREATE INDEX "contacts_phone_idx" ON "contacts" USING btree ("phone");
  CREATE INDEX "contacts_entity_idx" ON "contacts" USING btree ("entity_id");
  CREATE INDEX "contacts_owner_idx" ON "contacts" USING btree ("owner_id");
  CREATE INDEX "contacts_referred_by_idx" ON "contacts" USING btree ("referred_by_id");
  CREATE INDEX "contacts_investor_idx" ON "contacts" USING btree ("investor_id");
  CREATE INDEX "contacts_last_activity_at_idx" ON "contacts" USING btree ("last_activity_at");
  CREATE INDEX "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE INDEX "contacts_texts_order_parent" ON "contacts_texts" USING btree ("order","parent_id");
  CREATE INDEX "entities_updated_at_idx" ON "entities" USING btree ("updated_at");
  CREATE INDEX "entities_created_at_idx" ON "entities" USING btree ("created_at");
  CREATE INDEX "deals_contact_idx" ON "deals" USING btree ("contact_id");
  CREATE INDEX "deals_entity_idx" ON "deals" USING btree ("entity_id");
  CREATE INDEX "deals_product_idx" ON "deals" USING btree ("product_id");
  CREATE INDEX "deals_stage_idx" ON "deals" USING btree ("stage");
  CREATE INDEX "deals_owner_idx" ON "deals" USING btree ("owner_id");
  CREATE INDEX "deals_enquiry_idx" ON "deals" USING btree ("enquiry_id");
  CREATE INDEX "deals_updated_at_idx" ON "deals" USING btree ("updated_at");
  CREATE INDEX "deals_created_at_idx" ON "deals" USING btree ("created_at");
  CREATE INDEX "activities_contact_idx" ON "activities" USING btree ("contact_id");
  CREATE INDEX "activities_at_idx" ON "activities" USING btree ("at");
  CREATE INDEX "activities_enquiry_idx" ON "activities" USING btree ("enquiry_id");
  CREATE INDEX "activities_deal_idx" ON "activities" USING btree ("deal_id");
  CREATE INDEX "activities_email_idx" ON "activities" USING btree ("email_id");
  CREATE INDEX "activities_actor_idx" ON "activities" USING btree ("actor_id");
  CREATE INDEX "activities_updated_at_idx" ON "activities" USING btree ("updated_at");
  CREATE INDEX "activities_created_at_idx" ON "activities" USING btree ("created_at");
  CREATE INDEX "tasks_due_at_idx" ON "tasks" USING btree ("due_at");
  CREATE INDEX "tasks_owner_idx" ON "tasks" USING btree ("owner_id");
  CREATE INDEX "tasks_contact_idx" ON "tasks" USING btree ("contact_id");
  CREATE INDEX "tasks_enquiry_idx" ON "tasks" USING btree ("enquiry_id");
  CREATE INDEX "tasks_deal_idx" ON "tasks" USING btree ("deal_id");
  CREATE INDEX "tasks_done_at_idx" ON "tasks" USING btree ("done_at");
  CREATE INDEX "tasks_done_by_idx" ON "tasks" USING btree ("done_by_id");
  CREATE INDEX "tasks_updated_at_idx" ON "tasks" USING btree ("updated_at");
  CREATE INDEX "tasks_created_at_idx" ON "tasks" USING btree ("created_at");
  CREATE INDEX "emails_events_order_idx" ON "emails_events" USING btree ("_order");
  CREATE INDEX "emails_events_parent_id_idx" ON "emails_events" USING btree ("_parent_id");
  CREATE INDEX "emails_status_idx" ON "emails" USING btree ("status");
  CREATE INDEX "emails_to_idx" ON "emails" USING btree ("to");
  CREATE INDEX "emails_contact_idx" ON "emails" USING btree ("contact_id");
  CREATE INDEX "emails_enquiry_idx" ON "emails" USING btree ("enquiry_id");
  CREATE INDEX "emails_sent_by_idx" ON "emails" USING btree ("sent_by_id");
  CREATE INDEX "emails_in_reply_to_idx" ON "emails" USING btree ("in_reply_to_id");
  CREATE INDEX "emails_resend_id_idx" ON "emails" USING btree ("resend_id");
  CREATE INDEX "emails_updated_at_idx" ON "emails" USING btree ("updated_at");
  CREATE INDEX "emails_created_at_idx" ON "emails" USING btree ("created_at");
  CREATE INDEX "playbooks_kinds_order_idx" ON "playbooks_kinds" USING btree ("order");
  CREATE INDEX "playbooks_kinds_parent_idx" ON "playbooks_kinds" USING btree ("parent_id");
  CREATE INDEX "playbooks_severities_order_idx" ON "playbooks_severities" USING btree ("order");
  CREATE INDEX "playbooks_severities_parent_idx" ON "playbooks_severities" USING btree ("parent_id");
  CREATE INDEX "playbooks_handler_roles_order_idx" ON "playbooks_handler_roles" USING btree ("order");
  CREATE INDEX "playbooks_handler_roles_parent_idx" ON "playbooks_handler_roles" USING btree ("parent_id");
  CREATE INDEX "playbooks_steps_order_idx" ON "playbooks_steps" USING btree ("_order");
  CREATE INDEX "playbooks_steps_parent_id_idx" ON "playbooks_steps" USING btree ("_parent_id");
  CREATE INDEX "playbooks_template_idx" ON "playbooks" USING btree ("template_id");
  CREATE INDEX "playbooks_updated_at_idx" ON "playbooks" USING btree ("updated_at");
  CREATE INDEX "playbooks_created_at_idx" ON "playbooks" USING btree ("created_at");
  CREATE INDEX "email_templates_purpose_idx" ON "email_templates" USING btree ("purpose");
  CREATE INDEX "email_templates_updated_at_idx" ON "email_templates" USING btree ("updated_at");
  CREATE INDEX "email_templates_created_at_idx" ON "email_templates" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_entities_fk" FOREIGN KEY ("entities_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_deals_fk" FOREIGN KEY ("deals_id") REFERENCES "public"."deals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tasks_fk" FOREIGN KEY ("tasks_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emails_fk" FOREIGN KEY ("emails_id") REFERENCES "public"."emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_playbooks_fk" FOREIGN KEY ("playbooks_id") REFERENCES "public"."playbooks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_templates_fk" FOREIGN KEY ("email_templates_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX "payload_locked_documents_rels_entities_id_idx" ON "payload_locked_documents_rels" USING btree ("entities_id");
  CREATE INDEX "payload_locked_documents_rels_deals_id_idx" ON "payload_locked_documents_rels" USING btree ("deals_id");
  CREATE INDEX "payload_locked_documents_rels_activities_id_idx" ON "payload_locked_documents_rels" USING btree ("activities_id");
  CREATE INDEX "payload_locked_documents_rels_tasks_id_idx" ON "payload_locked_documents_rels" USING btree ("tasks_id");
  CREATE INDEX "payload_locked_documents_rels_emails_id_idx" ON "payload_locked_documents_rels" USING btree ("emails_id");
  CREATE INDEX "payload_locked_documents_rels_playbooks_id_idx" ON "payload_locked_documents_rels" USING btree ("playbooks_id");
  CREATE INDEX "payload_locked_documents_rels_email_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("email_templates_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "enquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contacts_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contacts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contacts_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "entities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "deals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "activities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tasks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emails_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "playbooks_kinds" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "playbooks_severities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "playbooks_handler_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "playbooks_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "playbooks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "crm_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "contacts_topics" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "contacts_texts" CASCADE;
  DROP TABLE "entities" CASCADE;
  DROP TABLE "deals" CASCADE;
  DROP TABLE "activities" CASCADE;
  DROP TABLE "tasks" CASCADE;
  DROP TABLE "emails_events" CASCADE;
  DROP TABLE "emails" CASCADE;
  DROP TABLE "playbooks_kinds" CASCADE;
  DROP TABLE "playbooks_severities" CASCADE;
  DROP TABLE "playbooks_handler_roles" CASCADE;
  DROP TABLE "playbooks_steps" CASCADE;
  DROP TABLE "playbooks" CASCADE;
  DROP TABLE "email_templates" CASCADE;
  DROP TABLE "crm_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_enquiries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contacts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_entities_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_deals_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_activities_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tasks_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_emails_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_playbooks_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_email_templates_fk";
  
  DROP INDEX "payload_locked_documents_rels_enquiries_id_idx";
  DROP INDEX "payload_locked_documents_rels_contacts_id_idx";
  DROP INDEX "payload_locked_documents_rels_entities_id_idx";
  DROP INDEX "payload_locked_documents_rels_deals_id_idx";
  DROP INDEX "payload_locked_documents_rels_activities_id_idx";
  DROP INDEX "payload_locked_documents_rels_tasks_id_idx";
  DROP INDEX "payload_locked_documents_rels_emails_id_idx";
  DROP INDEX "payload_locked_documents_rels_playbooks_id_idx";
  DROP INDEX "payload_locked_documents_rels_email_templates_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "enquiries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contacts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "entities_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "deals_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "activities_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tasks_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "emails_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "playbooks_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "email_templates_id";
  DROP TYPE "public"."enum_enquiries_kind";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_enquiries_severity";
  DROP TYPE "public"."enum_contacts_topics";
  DROP TYPE "public"."enum_contacts_kind";
  DROP TYPE "public"."enum_contacts_source";
  DROP TYPE "public"."enum_entities_type";
  DROP TYPE "public"."enum_deals_stage";
  DROP TYPE "public"."enum_activities_type";
  DROP TYPE "public"."enum_emails_direction";
  DROP TYPE "public"."enum_emails_status";
  DROP TYPE "public"."enum_playbooks_kinds";
  DROP TYPE "public"."enum_playbooks_severities";
  DROP TYPE "public"."enum_playbooks_handler_roles";
  DROP TYPE "public"."enum_email_templates_purpose";`)
}
