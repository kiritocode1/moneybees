import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { HOME_SECTIONS } from '../lib/pages/home-content'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_blocks_two_ways_ways_kind" AS ENUM('pms', 'aif');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_blocks_two_ways_ways_kind" AS ENUM('pms', 'aif');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "home_page_blocks_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "home_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Own India''s next leaders early.',
  	"introduction" varchar DEFAULT 'We find promising small companies, and invest only after meeting their management and visiting their plants.',
  	"primary_label" varchar DEFAULT 'Get Started',
  	"primary_link" varchar DEFAULT '/contact?enquiry=general#enquiry',
  	"secondary_label" varchar DEFAULT 'Our Philosophy',
  	"secondary_link" varchar DEFAULT '/our-philosophy',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_record" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"eyebrow" varchar DEFAULT 'Performance',
  	"heading" varchar DEFAULT 'Compounding is the magic that turns small, regular investments into substantial wealth',
  	"lead" varchar DEFAULT 'Rs. 1 Mn put into Moneybee PMS in August 2007 was worth {wealthOurs} by {asOfMonth}. The same amount in the S&P BSE 500 TRI grew to {wealthBenchmark}.',
  	"more_label" varchar DEFAULT 'Performance',
  	"more_link" varchar DEFAULT '/pms#performance',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_two_ways_ways_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fact" varchar
  );
  
  CREATE TABLE "home_page_blocks_two_ways_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_home_page_blocks_two_ways_ways_kind",
  	"link" varchar,
  	"label" varchar,
  	"name" varchar,
  	"lead" varchar
  );
  
  CREATE TABLE "home_page_blocks_two_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Two ways to invest with us',
  	"button" varchar DEFAULT 'See the details',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_founder_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar
  );
  
  CREATE TABLE "home_page_blocks_founder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Why small caps',
  	"quote" varchar DEFAULT 'If India has to grow by 7-8% yoy for the next 20 years. There will be small & medium companies that will grow by 25-30% yoy. We look for these companies and stay invested with them',
  	"photo_id" integer,
  	"name" varchar DEFAULT 'Mr. Dhiren Shah, Managing Director',
  	"credentials" varchar DEFAULT 'FCA, GRAD CWA, LLB, M.COM',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_get_started" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Get Started',
  	"link_label" varchar DEFAULT 'Enquire',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "home_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_text" (
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
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_home_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_home_page_v_blocks_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Own India''s next leaders early.',
  	"introduction" varchar DEFAULT 'We find promising small companies, and invest only after meeting their management and visiting their plants.',
  	"primary_label" varchar DEFAULT 'Get Started',
  	"primary_link" varchar DEFAULT '/contact?enquiry=general#enquiry',
  	"secondary_label" varchar DEFAULT 'Our Philosophy',
  	"secondary_link" varchar DEFAULT '/our-philosophy',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_record" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"eyebrow" varchar DEFAULT 'Performance',
  	"heading" varchar DEFAULT 'Compounding is the magic that turns small, regular investments into substantial wealth',
  	"lead" varchar DEFAULT 'Rs. 1 Mn put into Moneybee PMS in August 2007 was worth {wealthOurs} by {asOfMonth}. The same amount in the S&P BSE 500 TRI grew to {wealthBenchmark}.',
  	"more_label" varchar DEFAULT 'Performance',
  	"more_link" varchar DEFAULT '/pms#performance',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_two_ways_ways_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"fact" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_two_ways_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__home_page_v_blocks_two_ways_ways_kind",
  	"link" varchar,
  	"label" varchar,
  	"name" varchar,
  	"lead" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_two_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Two ways to invest with us',
  	"button" varchar DEFAULT 'See the details',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_founder_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"point" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_founder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Why small caps',
  	"quote" varchar DEFAULT 'If India has to grow by 7-8% yoy for the next 20 years. There will be small & medium companies that will grow by 25-30% yoy. We look for these companies and stay invested with them',
  	"photo_id" integer,
  	"name" varchar DEFAULT 'Mr. Dhiren Shah, Managing Director',
  	"credentials" varchar DEFAULT 'FCA, GRAD CWA, LLB, M.COM',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_get_started" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Get Started',
  	"link_label" varchar DEFAULT 'Enquire',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_faq" (
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
  
  CREATE TABLE "_home_page_v_blocks_text" (
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
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "home_page_blocks_hero_figures" ADD CONSTRAINT "home_page_blocks_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero" ADD CONSTRAINT "home_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_record" ADD CONSTRAINT "home_page_blocks_record_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_two_ways_ways_facts" ADD CONSTRAINT "home_page_blocks_two_ways_ways_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_two_ways_ways"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_two_ways_ways" ADD CONSTRAINT "home_page_blocks_two_ways_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_two_ways"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_two_ways" ADD CONSTRAINT "home_page_blocks_two_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_founder_points" ADD CONSTRAINT "home_page_blocks_founder_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_founder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_founder" ADD CONSTRAINT "home_page_blocks_founder_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_founder" ADD CONSTRAINT "home_page_blocks_founder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_get_started" ADD CONSTRAINT "home_page_blocks_get_started_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_faq_questions" ADD CONSTRAINT "home_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_faq" ADD CONSTRAINT "home_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_text" ADD CONSTRAINT "home_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero_figures" ADD CONSTRAINT "_home_page_v_blocks_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero" ADD CONSTRAINT "_home_page_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_record" ADD CONSTRAINT "_home_page_v_blocks_record_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_two_ways_ways_facts" ADD CONSTRAINT "_home_page_v_blocks_two_ways_ways_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_two_ways_ways"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_two_ways_ways" ADD CONSTRAINT "_home_page_v_blocks_two_ways_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_two_ways"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_two_ways" ADD CONSTRAINT "_home_page_v_blocks_two_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_founder_points" ADD CONSTRAINT "_home_page_v_blocks_founder_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_founder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_founder" ADD CONSTRAINT "_home_page_v_blocks_founder_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_founder" ADD CONSTRAINT "_home_page_v_blocks_founder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_get_started" ADD CONSTRAINT "_home_page_v_blocks_get_started_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_faq_questions" ADD CONSTRAINT "_home_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_faq" ADD CONSTRAINT "_home_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_text" ADD CONSTRAINT "_home_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_blocks_hero_figures_order_idx" ON "home_page_blocks_hero_figures" USING btree ("_order");
  CREATE INDEX "home_page_blocks_hero_figures_parent_id_idx" ON "home_page_blocks_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_hero_order_idx" ON "home_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "home_page_blocks_hero_parent_id_idx" ON "home_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_hero_path_idx" ON "home_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "home_page_blocks_record_order_idx" ON "home_page_blocks_record" USING btree ("_order");
  CREATE INDEX "home_page_blocks_record_parent_id_idx" ON "home_page_blocks_record" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_record_path_idx" ON "home_page_blocks_record" USING btree ("_path");
  CREATE INDEX "home_page_blocks_two_ways_ways_facts_order_idx" ON "home_page_blocks_two_ways_ways_facts" USING btree ("_order");
  CREATE INDEX "home_page_blocks_two_ways_ways_facts_parent_id_idx" ON "home_page_blocks_two_ways_ways_facts" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_two_ways_ways_order_idx" ON "home_page_blocks_two_ways_ways" USING btree ("_order");
  CREATE INDEX "home_page_blocks_two_ways_ways_parent_id_idx" ON "home_page_blocks_two_ways_ways" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_two_ways_order_idx" ON "home_page_blocks_two_ways" USING btree ("_order");
  CREATE INDEX "home_page_blocks_two_ways_parent_id_idx" ON "home_page_blocks_two_ways" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_two_ways_path_idx" ON "home_page_blocks_two_ways" USING btree ("_path");
  CREATE INDEX "home_page_blocks_founder_points_order_idx" ON "home_page_blocks_founder_points" USING btree ("_order");
  CREATE INDEX "home_page_blocks_founder_points_parent_id_idx" ON "home_page_blocks_founder_points" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_founder_order_idx" ON "home_page_blocks_founder" USING btree ("_order");
  CREATE INDEX "home_page_blocks_founder_parent_id_idx" ON "home_page_blocks_founder" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_founder_path_idx" ON "home_page_blocks_founder" USING btree ("_path");
  CREATE INDEX "home_page_blocks_founder_photo_idx" ON "home_page_blocks_founder" USING btree ("photo_id");
  CREATE INDEX "home_page_blocks_get_started_order_idx" ON "home_page_blocks_get_started" USING btree ("_order");
  CREATE INDEX "home_page_blocks_get_started_parent_id_idx" ON "home_page_blocks_get_started" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_get_started_path_idx" ON "home_page_blocks_get_started" USING btree ("_path");
  CREATE INDEX "home_page_blocks_faq_questions_order_idx" ON "home_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "home_page_blocks_faq_questions_parent_id_idx" ON "home_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_faq_order_idx" ON "home_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "home_page_blocks_faq_parent_id_idx" ON "home_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_faq_path_idx" ON "home_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "home_page_blocks_text_order_idx" ON "home_page_blocks_text" USING btree ("_order");
  CREATE INDEX "home_page_blocks_text_parent_id_idx" ON "home_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_text_path_idx" ON "home_page_blocks_text" USING btree ("_path");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE INDEX "_home_page_v_blocks_hero_figures_order_idx" ON "_home_page_v_blocks_hero_figures" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_hero_figures_parent_id_idx" ON "_home_page_v_blocks_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_order_idx" ON "_home_page_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_hero_parent_id_idx" ON "_home_page_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_path_idx" ON "_home_page_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_record_order_idx" ON "_home_page_v_blocks_record" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_record_parent_id_idx" ON "_home_page_v_blocks_record" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_record_path_idx" ON "_home_page_v_blocks_record" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_two_ways_ways_facts_order_idx" ON "_home_page_v_blocks_two_ways_ways_facts" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_two_ways_ways_facts_parent_id_idx" ON "_home_page_v_blocks_two_ways_ways_facts" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_two_ways_ways_order_idx" ON "_home_page_v_blocks_two_ways_ways" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_two_ways_ways_parent_id_idx" ON "_home_page_v_blocks_two_ways_ways" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_two_ways_order_idx" ON "_home_page_v_blocks_two_ways" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_two_ways_parent_id_idx" ON "_home_page_v_blocks_two_ways" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_two_ways_path_idx" ON "_home_page_v_blocks_two_ways" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_founder_points_order_idx" ON "_home_page_v_blocks_founder_points" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_founder_points_parent_id_idx" ON "_home_page_v_blocks_founder_points" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_founder_order_idx" ON "_home_page_v_blocks_founder" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_founder_parent_id_idx" ON "_home_page_v_blocks_founder" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_founder_path_idx" ON "_home_page_v_blocks_founder" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_founder_photo_idx" ON "_home_page_v_blocks_founder" USING btree ("photo_id");
  CREATE INDEX "_home_page_v_blocks_get_started_order_idx" ON "_home_page_v_blocks_get_started" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_get_started_parent_id_idx" ON "_home_page_v_blocks_get_started" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_get_started_path_idx" ON "_home_page_v_blocks_get_started" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_faq_questions_order_idx" ON "_home_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_faq_questions_parent_id_idx" ON "_home_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_faq_order_idx" ON "_home_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_faq_parent_id_idx" ON "_home_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_faq_path_idx" ON "_home_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_text_order_idx" ON "_home_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_text_parent_id_idx" ON "_home_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_text_path_idx" ON "_home_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE INDEX "_home_page_v_autosave_idx" ON "_home_page_v" USING btree ("autosave");`)

  // Today's homepage, published, so the site reads the same on the day this ships.
  await payload.updateGlobal({ slug: 'home-page', data: { sections: [...HOME_SECTIONS], _status: 'published' }, req, context: { skipRevalidate: true } })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_blocks_hero_figures" CASCADE;
  DROP TABLE "home_page_blocks_hero" CASCADE;
  DROP TABLE "home_page_blocks_record" CASCADE;
  DROP TABLE "home_page_blocks_two_ways_ways_facts" CASCADE;
  DROP TABLE "home_page_blocks_two_ways_ways" CASCADE;
  DROP TABLE "home_page_blocks_two_ways" CASCADE;
  DROP TABLE "home_page_blocks_founder_points" CASCADE;
  DROP TABLE "home_page_blocks_founder" CASCADE;
  DROP TABLE "home_page_blocks_get_started" CASCADE;
  DROP TABLE "home_page_blocks_faq_questions" CASCADE;
  DROP TABLE "home_page_blocks_faq" CASCADE;
  DROP TABLE "home_page_blocks_text" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "_home_page_v_blocks_hero_figures" CASCADE;
  DROP TABLE "_home_page_v_blocks_hero" CASCADE;
  DROP TABLE "_home_page_v_blocks_record" CASCADE;
  DROP TABLE "_home_page_v_blocks_two_ways_ways_facts" CASCADE;
  DROP TABLE "_home_page_v_blocks_two_ways_ways" CASCADE;
  DROP TABLE "_home_page_v_blocks_two_ways" CASCADE;
  DROP TABLE "_home_page_v_blocks_founder_points" CASCADE;
  DROP TABLE "_home_page_v_blocks_founder" CASCADE;
  DROP TABLE "_home_page_v_blocks_get_started" CASCADE;
  DROP TABLE "_home_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_home_page_v_blocks_faq" CASCADE;
  DROP TABLE "_home_page_v_blocks_text" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TYPE "public"."enum_home_page_blocks_two_ways_ways_kind";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_blocks_two_ways_ways_kind";
  DROP TYPE "public"."enum__home_page_v_version_status";`)
}
