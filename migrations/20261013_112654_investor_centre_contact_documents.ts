import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { DOCUMENT_GROUPS } from '../lib/investor-centre'
import { CONTACT_SECTIONS } from '../lib/pages/contact-content'
import { INVESTOR_CENTRE_SECTIONS } from '../lib/pages/investor-centre-content'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_documents_group" AS ENUM('investor-charter', 'disclosures', 'grievance', 'disclosure-document');
  CREATE TYPE "public"."enum_documents_drawing" AS ENUM('charter', 'disclosures', 'risk', 'policies', 'complaints', 'grievance', 'scores', 'odr', 'forms', 'pms', 'aif');
  CREATE TYPE "public"."enum_investor_centre_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__investor_centre_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"group" "enum_documents_group" NOT NULL,
  	"file_id" integer,
  	"link" varchar,
  	"date" timestamp(3) with time zone,
  	"drawing" "enum_documents_drawing" DEFAULT 'forms' NOT NULL,
  	"anchor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "investor_centre_page_blocks_logins" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Investor Centre',
  	"block_name" varchar
  );
  
  CREATE TABLE "investor_centre_page_blocks_document_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Documents',
  	"lead" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  	"block_name" varchar
  );
  
  CREATE TABLE "investor_centre_page_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "investor_centre_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "investor_centre_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "investor_centre_page_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT '',
  	"heading" varchar DEFAULT 'A heading for this section',
  	"body" varchar DEFAULT 'A paragraph or two. Leave an empty line between paragraphs.',
  	"action_label" varchar,
  	"action_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "investor_centre_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_investor_centre_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_investor_centre_page_v_blocks_logins" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Investor Centre',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_investor_centre_page_v_blocks_document_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Documents',
  	"lead" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_investor_centre_page_v_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_investor_centre_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_investor_centre_page_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_investor_centre_page_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT '',
  	"heading" varchar DEFAULT 'A heading for this section',
  	"body" varchar DEFAULT 'A paragraph or two. Leave an empty line between paragraphs.',
  	"action_label" varchar,
  	"action_link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_investor_centre_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__investor_centre_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "contact_page_blocks_enquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Get Started',
  	"heading" varchar DEFAULT 'Let''s Start a Conversation',
  	"desks_label" varchar DEFAULT 'Flyingbee AIF desks',
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_page_blocks_office" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "contact_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_page_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT '',
  	"heading" varchar DEFAULT 'A heading for this section',
  	"body" varchar DEFAULT 'A paragraph or two. Leave an empty line between paragraphs.',
  	"action_label" varchar,
  	"action_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_contact_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contact_page_v_blocks_enquiry" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Get Started',
  	"heading" varchar DEFAULT 'Let''s Start a Conversation',
  	"desks_label" varchar DEFAULT 'Flyingbee AIF desks',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contact_page_v_blocks_office" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contact_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_page_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contact_page_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT '',
  	"heading" varchar DEFAULT 'A heading for this section',
  	"body" varchar DEFAULT 'A paragraph or two. Leave an empty line between paragraphs.',
  	"action_label" varchar,
  	"action_link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contact_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investor_centre_page_blocks_logins" ADD CONSTRAINT "investor_centre_page_blocks_logins_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investor_centre_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investor_centre_page_blocks_document_cards" ADD CONSTRAINT "investor_centre_page_blocks_document_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investor_centre_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investor_centre_page_blocks_closing_doors" ADD CONSTRAINT "investor_centre_page_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investor_centre_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investor_centre_page_blocks_faq_questions" ADD CONSTRAINT "investor_centre_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investor_centre_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investor_centre_page_blocks_faq" ADD CONSTRAINT "investor_centre_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investor_centre_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investor_centre_page_blocks_text" ADD CONSTRAINT "investor_centre_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investor_centre_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_investor_centre_page_v_blocks_logins" ADD CONSTRAINT "_investor_centre_page_v_blocks_logins_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_investor_centre_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_investor_centre_page_v_blocks_document_cards" ADD CONSTRAINT "_investor_centre_page_v_blocks_document_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_investor_centre_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_investor_centre_page_v_blocks_closing_doors" ADD CONSTRAINT "_investor_centre_page_v_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_investor_centre_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_investor_centre_page_v_blocks_faq_questions" ADD CONSTRAINT "_investor_centre_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_investor_centre_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_investor_centre_page_v_blocks_faq" ADD CONSTRAINT "_investor_centre_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_investor_centre_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_investor_centre_page_v_blocks_text" ADD CONSTRAINT "_investor_centre_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_investor_centre_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_blocks_enquiry" ADD CONSTRAINT "contact_page_blocks_enquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_blocks_office" ADD CONSTRAINT "contact_page_blocks_office_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_blocks_faq_questions" ADD CONSTRAINT "contact_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_blocks_faq" ADD CONSTRAINT "contact_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_blocks_text" ADD CONSTRAINT "contact_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_blocks_enquiry" ADD CONSTRAINT "_contact_page_v_blocks_enquiry_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_blocks_office" ADD CONSTRAINT "_contact_page_v_blocks_office_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_blocks_faq_questions" ADD CONSTRAINT "_contact_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_blocks_faq" ADD CONSTRAINT "_contact_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_blocks_text" ADD CONSTRAINT "_contact_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "documents__order_idx" ON "documents" USING btree ("_order");
  CREATE INDEX "documents_file_idx" ON "documents" USING btree ("file_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE INDEX "investor_centre_page_blocks_logins_order_idx" ON "investor_centre_page_blocks_logins" USING btree ("_order");
  CREATE INDEX "investor_centre_page_blocks_logins_parent_id_idx" ON "investor_centre_page_blocks_logins" USING btree ("_parent_id");
  CREATE INDEX "investor_centre_page_blocks_logins_path_idx" ON "investor_centre_page_blocks_logins" USING btree ("_path");
  CREATE INDEX "investor_centre_page_blocks_document_cards_order_idx" ON "investor_centre_page_blocks_document_cards" USING btree ("_order");
  CREATE INDEX "investor_centre_page_blocks_document_cards_parent_id_idx" ON "investor_centre_page_blocks_document_cards" USING btree ("_parent_id");
  CREATE INDEX "investor_centre_page_blocks_document_cards_path_idx" ON "investor_centre_page_blocks_document_cards" USING btree ("_path");
  CREATE INDEX "investor_centre_page_blocks_closing_doors_order_idx" ON "investor_centre_page_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "investor_centre_page_blocks_closing_doors_parent_id_idx" ON "investor_centre_page_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "investor_centre_page_blocks_closing_doors_path_idx" ON "investor_centre_page_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "investor_centre_page_blocks_faq_questions_order_idx" ON "investor_centre_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "investor_centre_page_blocks_faq_questions_parent_id_idx" ON "investor_centre_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "investor_centre_page_blocks_faq_order_idx" ON "investor_centre_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "investor_centre_page_blocks_faq_parent_id_idx" ON "investor_centre_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "investor_centre_page_blocks_faq_path_idx" ON "investor_centre_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "investor_centre_page_blocks_text_order_idx" ON "investor_centre_page_blocks_text" USING btree ("_order");
  CREATE INDEX "investor_centre_page_blocks_text_parent_id_idx" ON "investor_centre_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "investor_centre_page_blocks_text_path_idx" ON "investor_centre_page_blocks_text" USING btree ("_path");
  CREATE INDEX "investor_centre_page__status_idx" ON "investor_centre_page" USING btree ("_status");
  CREATE INDEX "_investor_centre_page_v_blocks_logins_order_idx" ON "_investor_centre_page_v_blocks_logins" USING btree ("_order");
  CREATE INDEX "_investor_centre_page_v_blocks_logins_parent_id_idx" ON "_investor_centre_page_v_blocks_logins" USING btree ("_parent_id");
  CREATE INDEX "_investor_centre_page_v_blocks_logins_path_idx" ON "_investor_centre_page_v_blocks_logins" USING btree ("_path");
  CREATE INDEX "_investor_centre_page_v_blocks_document_cards_order_idx" ON "_investor_centre_page_v_blocks_document_cards" USING btree ("_order");
  CREATE INDEX "_investor_centre_page_v_blocks_document_cards_parent_id_idx" ON "_investor_centre_page_v_blocks_document_cards" USING btree ("_parent_id");
  CREATE INDEX "_investor_centre_page_v_blocks_document_cards_path_idx" ON "_investor_centre_page_v_blocks_document_cards" USING btree ("_path");
  CREATE INDEX "_investor_centre_page_v_blocks_closing_doors_order_idx" ON "_investor_centre_page_v_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "_investor_centre_page_v_blocks_closing_doors_parent_id_idx" ON "_investor_centre_page_v_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "_investor_centre_page_v_blocks_closing_doors_path_idx" ON "_investor_centre_page_v_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "_investor_centre_page_v_blocks_faq_questions_order_idx" ON "_investor_centre_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_investor_centre_page_v_blocks_faq_questions_parent_id_idx" ON "_investor_centre_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_investor_centre_page_v_blocks_faq_order_idx" ON "_investor_centre_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_investor_centre_page_v_blocks_faq_parent_id_idx" ON "_investor_centre_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_investor_centre_page_v_blocks_faq_path_idx" ON "_investor_centre_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_investor_centre_page_v_blocks_text_order_idx" ON "_investor_centre_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_investor_centre_page_v_blocks_text_parent_id_idx" ON "_investor_centre_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_investor_centre_page_v_blocks_text_path_idx" ON "_investor_centre_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_investor_centre_page_v_version_version__status_idx" ON "_investor_centre_page_v" USING btree ("version__status");
  CREATE INDEX "_investor_centre_page_v_created_at_idx" ON "_investor_centre_page_v" USING btree ("created_at");
  CREATE INDEX "_investor_centre_page_v_updated_at_idx" ON "_investor_centre_page_v" USING btree ("updated_at");
  CREATE INDEX "_investor_centre_page_v_latest_idx" ON "_investor_centre_page_v" USING btree ("latest");
  CREATE INDEX "_investor_centre_page_v_autosave_idx" ON "_investor_centre_page_v" USING btree ("autosave");
  CREATE INDEX "contact_page_blocks_enquiry_order_idx" ON "contact_page_blocks_enquiry" USING btree ("_order");
  CREATE INDEX "contact_page_blocks_enquiry_parent_id_idx" ON "contact_page_blocks_enquiry" USING btree ("_parent_id");
  CREATE INDEX "contact_page_blocks_enquiry_path_idx" ON "contact_page_blocks_enquiry" USING btree ("_path");
  CREATE INDEX "contact_page_blocks_office_order_idx" ON "contact_page_blocks_office" USING btree ("_order");
  CREATE INDEX "contact_page_blocks_office_parent_id_idx" ON "contact_page_blocks_office" USING btree ("_parent_id");
  CREATE INDEX "contact_page_blocks_office_path_idx" ON "contact_page_blocks_office" USING btree ("_path");
  CREATE INDEX "contact_page_blocks_faq_questions_order_idx" ON "contact_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "contact_page_blocks_faq_questions_parent_id_idx" ON "contact_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "contact_page_blocks_faq_order_idx" ON "contact_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "contact_page_blocks_faq_parent_id_idx" ON "contact_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "contact_page_blocks_faq_path_idx" ON "contact_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "contact_page_blocks_text_order_idx" ON "contact_page_blocks_text" USING btree ("_order");
  CREATE INDEX "contact_page_blocks_text_parent_id_idx" ON "contact_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "contact_page_blocks_text_path_idx" ON "contact_page_blocks_text" USING btree ("_path");
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  CREATE INDEX "_contact_page_v_blocks_enquiry_order_idx" ON "_contact_page_v_blocks_enquiry" USING btree ("_order");
  CREATE INDEX "_contact_page_v_blocks_enquiry_parent_id_idx" ON "_contact_page_v_blocks_enquiry" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_blocks_enquiry_path_idx" ON "_contact_page_v_blocks_enquiry" USING btree ("_path");
  CREATE INDEX "_contact_page_v_blocks_office_order_idx" ON "_contact_page_v_blocks_office" USING btree ("_order");
  CREATE INDEX "_contact_page_v_blocks_office_parent_id_idx" ON "_contact_page_v_blocks_office" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_blocks_office_path_idx" ON "_contact_page_v_blocks_office" USING btree ("_path");
  CREATE INDEX "_contact_page_v_blocks_faq_questions_order_idx" ON "_contact_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_contact_page_v_blocks_faq_questions_parent_id_idx" ON "_contact_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_blocks_faq_order_idx" ON "_contact_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_contact_page_v_blocks_faq_parent_id_idx" ON "_contact_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_blocks_faq_path_idx" ON "_contact_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_contact_page_v_blocks_text_order_idx" ON "_contact_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_contact_page_v_blocks_text_parent_id_idx" ON "_contact_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_blocks_text_path_idx" ON "_contact_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");
  CREATE INDEX "_contact_page_v_autosave_idx" ON "_contact_page_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");`)

  // The content plan's eleven documents, in their groups and order, without files yet; each keeps its anchor on the page.
  for (const group of DOCUMENT_GROUPS) {
    for (const doc of group.documents) {
      await payload.create({
        collection: 'documents',
        data: { title: doc.title, group: group.id, drawing: doc.glyph, anchor: doc.id },
        req,
        context: { skipRevalidate: true },
      })
    }
  }
  // Today's /investor-centre and /contact, published, so they read the same on the day this ships.
  await payload.updateGlobal({ slug: 'investor-centre-page', data: { sections: [...INVESTOR_CENTRE_SECTIONS], _status: 'published' }, req, context: { skipRevalidate: true } })
  await payload.updateGlobal({ slug: 'contact-page', data: { sections: [...CONTACT_SECTIONS], _status: 'published' }, req, context: { skipRevalidate: true } })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investor_centre_page_blocks_logins" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investor_centre_page_blocks_document_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investor_centre_page_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investor_centre_page_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investor_centre_page_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investor_centre_page_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "investor_centre_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_investor_centre_page_v_blocks_logins" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_investor_centre_page_v_blocks_document_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_investor_centre_page_v_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_investor_centre_page_v_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_investor_centre_page_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_investor_centre_page_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_investor_centre_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_blocks_enquiry" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_blocks_office" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v_blocks_enquiry" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v_blocks_office" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "investor_centre_page_blocks_logins" CASCADE;
  DROP TABLE "investor_centre_page_blocks_document_cards" CASCADE;
  DROP TABLE "investor_centre_page_blocks_closing_doors" CASCADE;
  DROP TABLE "investor_centre_page_blocks_faq_questions" CASCADE;
  DROP TABLE "investor_centre_page_blocks_faq" CASCADE;
  DROP TABLE "investor_centre_page_blocks_text" CASCADE;
  DROP TABLE "investor_centre_page" CASCADE;
  DROP TABLE "_investor_centre_page_v_blocks_logins" CASCADE;
  DROP TABLE "_investor_centre_page_v_blocks_document_cards" CASCADE;
  DROP TABLE "_investor_centre_page_v_blocks_closing_doors" CASCADE;
  DROP TABLE "_investor_centre_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_investor_centre_page_v_blocks_faq" CASCADE;
  DROP TABLE "_investor_centre_page_v_blocks_text" CASCADE;
  DROP TABLE "_investor_centre_page_v" CASCADE;
  DROP TABLE "contact_page_blocks_enquiry" CASCADE;
  DROP TABLE "contact_page_blocks_office" CASCADE;
  DROP TABLE "contact_page_blocks_faq_questions" CASCADE;
  DROP TABLE "contact_page_blocks_faq" CASCADE;
  DROP TABLE "contact_page_blocks_text" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "_contact_page_v_blocks_enquiry" CASCADE;
  DROP TABLE "_contact_page_v_blocks_office" CASCADE;
  DROP TABLE "_contact_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_contact_page_v_blocks_faq" CASCADE;
  DROP TABLE "_contact_page_v_blocks_text" CASCADE;
  DROP TABLE "_contact_page_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";
  DROP TYPE "public"."enum_documents_group";
  DROP TYPE "public"."enum_documents_drawing";
  DROP TYPE "public"."enum_investor_centre_page_status";
  DROP TYPE "public"."enum__investor_centre_page_v_version_status";
  DROP TYPE "public"."enum_contact_page_status";
  DROP TYPE "public"."enum__contact_page_v_version_status";`)
}
