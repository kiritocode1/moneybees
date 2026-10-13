import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { TEAM } from '../lib/insights'
import { ABOUT_SECTIONS } from '../lib/pages/about-content'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "team_members_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar NOT NULL
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer,
  	"photo_path" varchar,
  	"linkedin" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_page_blocks_about_hero_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paragraph" varchar
  );
  
  CREATE TABLE "about_page_blocks_about_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'About us',
  	"heading" varchar DEFAULT 'About Moneybee Group',
  	"photo_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_founder_profile_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"qualification" varchar
  );
  
  CREATE TABLE "about_page_blocks_founder_profile_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar
  );
  
  CREATE TABLE "about_page_blocks_founder_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Founder',
  	"name" varchar DEFAULT 'Dhiren Shah',
  	"role" varchar DEFAULT 'Managing Director',
  	"photo_id" integer,
  	"years" numeric DEFAULT 45,
  	"years_label" varchar DEFAULT 'Years of experience',
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_team_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Our Team',
  	"button_label" varchar DEFAULT 'Get in touch',
  	"button_link" varchar DEFAULT '/contact?enquiry=general#enquiry',
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_group_areas_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "about_page_blocks_group_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'What the group does',
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_recognition_tables_returns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric
  );
  
  CREATE TABLE "about_page_blocks_recognition_tables" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rank" varchar,
  	"period" varchar,
  	"ours" numeric
  );
  
  CREATE TABLE "about_page_blocks_recognition" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Recognition',
  	"heading" varchar DEFAULT 'Ranked among India’s top-performing portfolio managers by PMS Bazaar',
  	"as_of" varchar DEFAULT 'As on 31 Dec 2024',
  	"note" varchar DEFAULT 'Returns in %. Past performance does not guarantee future performance.',
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_timeline_stops" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "about_page_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Timeline',
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Moneybee Story',
  	"line" varchar DEFAULT 'While bees convert nectar into honey, Moneybee focuses on transforming money into wealth.',
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "about_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "about_page_blocks_text" (
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
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_about_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_about_page_v_blocks_about_hero_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"paragraph" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_about_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'About us',
  	"heading" varchar DEFAULT 'About Moneybee Group',
  	"photo_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_founder_profile_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"qualification" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_founder_profile_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"point" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_founder_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Founder',
  	"name" varchar DEFAULT 'Dhiren Shah',
  	"role" varchar DEFAULT 'Managing Director',
  	"photo_id" integer,
  	"years" numeric DEFAULT 45,
  	"years_label" varchar DEFAULT 'Years of experience',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_team_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Our Team',
  	"button_label" varchar DEFAULT 'Get in touch',
  	"button_link" varchar DEFAULT '/contact?enquiry=general#enquiry',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_group_areas_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_group_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'What the group does',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_recognition_tables_returns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_recognition_tables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rank" varchar,
  	"period" varchar,
  	"ours" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_recognition" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Recognition',
  	"heading" varchar DEFAULT 'Ranked among India’s top-performing portfolio managers by PMS Bazaar',
  	"as_of" varchar DEFAULT 'As on 31 Dec 2024',
  	"note" varchar DEFAULT 'Returns in %. Past performance does not guarantee future performance.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_timeline_stops" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Timeline',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Moneybee Story',
  	"line" varchar DEFAULT 'While bees convert nectar into honey, Moneybee focuses on transforming money into wealth.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_blocks_faq" (
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
  
  CREATE TABLE "_about_page_v_blocks_text" (
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
  
  CREATE TABLE "_about_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__about_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_members_id" integer;
  ALTER TABLE "team_members_points" ADD CONSTRAINT "team_members_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_blocks_about_hero_paragraphs" ADD CONSTRAINT "about_page_blocks_about_hero_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_about_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_about_hero" ADD CONSTRAINT "about_page_blocks_about_hero_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_blocks_about_hero" ADD CONSTRAINT "about_page_blocks_about_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_founder_profile_qualifications" ADD CONSTRAINT "about_page_blocks_founder_profile_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_founder_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_founder_profile_points" ADD CONSTRAINT "about_page_blocks_founder_profile_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_founder_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_founder_profile" ADD CONSTRAINT "about_page_blocks_founder_profile_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_blocks_founder_profile" ADD CONSTRAINT "about_page_blocks_founder_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_team_carousel" ADD CONSTRAINT "about_page_blocks_team_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_group_areas_areas" ADD CONSTRAINT "about_page_blocks_group_areas_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_group_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_group_areas" ADD CONSTRAINT "about_page_blocks_group_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_recognition_tables_returns" ADD CONSTRAINT "about_page_blocks_recognition_tables_returns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_recognition_tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_recognition_tables" ADD CONSTRAINT "about_page_blocks_recognition_tables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_recognition"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_recognition" ADD CONSTRAINT "about_page_blocks_recognition_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_timeline_stops" ADD CONSTRAINT "about_page_blocks_timeline_stops_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_timeline" ADD CONSTRAINT "about_page_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_story" ADD CONSTRAINT "about_page_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_closing_doors" ADD CONSTRAINT "about_page_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_faq_questions" ADD CONSTRAINT "about_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_faq" ADD CONSTRAINT "about_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_blocks_text" ADD CONSTRAINT "about_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_about_hero_paragraphs" ADD CONSTRAINT "_about_page_v_blocks_about_hero_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_blocks_about_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_about_hero" ADD CONSTRAINT "_about_page_v_blocks_about_hero_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_about_hero" ADD CONSTRAINT "_about_page_v_blocks_about_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_founder_profile_qualifications" ADD CONSTRAINT "_about_page_v_blocks_founder_profile_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_blocks_founder_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_founder_profile_points" ADD CONSTRAINT "_about_page_v_blocks_founder_profile_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_blocks_founder_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_founder_profile" ADD CONSTRAINT "_about_page_v_blocks_founder_profile_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_founder_profile" ADD CONSTRAINT "_about_page_v_blocks_founder_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_team_carousel" ADD CONSTRAINT "_about_page_v_blocks_team_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_group_areas_areas" ADD CONSTRAINT "_about_page_v_blocks_group_areas_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_blocks_group_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_group_areas" ADD CONSTRAINT "_about_page_v_blocks_group_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_recognition_tables_returns" ADD CONSTRAINT "_about_page_v_blocks_recognition_tables_returns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_blocks_recognition_tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_recognition_tables" ADD CONSTRAINT "_about_page_v_blocks_recognition_tables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_blocks_recognition"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_recognition" ADD CONSTRAINT "_about_page_v_blocks_recognition_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_timeline_stops" ADD CONSTRAINT "_about_page_v_blocks_timeline_stops_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_timeline" ADD CONSTRAINT "_about_page_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_story" ADD CONSTRAINT "_about_page_v_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_closing_doors" ADD CONSTRAINT "_about_page_v_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_faq_questions" ADD CONSTRAINT "_about_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_faq" ADD CONSTRAINT "_about_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_blocks_text" ADD CONSTRAINT "_about_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "team_members_points_order_idx" ON "team_members_points" USING btree ("_order");
  CREATE INDEX "team_members_points_parent_id_idx" ON "team_members_points" USING btree ("_parent_id");
  CREATE INDEX "team_members__order_idx" ON "team_members" USING btree ("_order");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "about_page_blocks_about_hero_paragraphs_order_idx" ON "about_page_blocks_about_hero_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_blocks_about_hero_paragraphs_parent_id_idx" ON "about_page_blocks_about_hero_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_about_hero_order_idx" ON "about_page_blocks_about_hero" USING btree ("_order");
  CREATE INDEX "about_page_blocks_about_hero_parent_id_idx" ON "about_page_blocks_about_hero" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_about_hero_path_idx" ON "about_page_blocks_about_hero" USING btree ("_path");
  CREATE INDEX "about_page_blocks_about_hero_photo_idx" ON "about_page_blocks_about_hero" USING btree ("photo_id");
  CREATE INDEX "about_page_blocks_founder_profile_qualifications_order_idx" ON "about_page_blocks_founder_profile_qualifications" USING btree ("_order");
  CREATE INDEX "about_page_blocks_founder_profile_qualifications_parent_id_idx" ON "about_page_blocks_founder_profile_qualifications" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_founder_profile_points_order_idx" ON "about_page_blocks_founder_profile_points" USING btree ("_order");
  CREATE INDEX "about_page_blocks_founder_profile_points_parent_id_idx" ON "about_page_blocks_founder_profile_points" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_founder_profile_order_idx" ON "about_page_blocks_founder_profile" USING btree ("_order");
  CREATE INDEX "about_page_blocks_founder_profile_parent_id_idx" ON "about_page_blocks_founder_profile" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_founder_profile_path_idx" ON "about_page_blocks_founder_profile" USING btree ("_path");
  CREATE INDEX "about_page_blocks_founder_profile_photo_idx" ON "about_page_blocks_founder_profile" USING btree ("photo_id");
  CREATE INDEX "about_page_blocks_team_carousel_order_idx" ON "about_page_blocks_team_carousel" USING btree ("_order");
  CREATE INDEX "about_page_blocks_team_carousel_parent_id_idx" ON "about_page_blocks_team_carousel" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_team_carousel_path_idx" ON "about_page_blocks_team_carousel" USING btree ("_path");
  CREATE INDEX "about_page_blocks_group_areas_areas_order_idx" ON "about_page_blocks_group_areas_areas" USING btree ("_order");
  CREATE INDEX "about_page_blocks_group_areas_areas_parent_id_idx" ON "about_page_blocks_group_areas_areas" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_group_areas_order_idx" ON "about_page_blocks_group_areas" USING btree ("_order");
  CREATE INDEX "about_page_blocks_group_areas_parent_id_idx" ON "about_page_blocks_group_areas" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_group_areas_path_idx" ON "about_page_blocks_group_areas" USING btree ("_path");
  CREATE INDEX "about_page_blocks_recognition_tables_returns_order_idx" ON "about_page_blocks_recognition_tables_returns" USING btree ("_order");
  CREATE INDEX "about_page_blocks_recognition_tables_returns_parent_id_idx" ON "about_page_blocks_recognition_tables_returns" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_recognition_tables_order_idx" ON "about_page_blocks_recognition_tables" USING btree ("_order");
  CREATE INDEX "about_page_blocks_recognition_tables_parent_id_idx" ON "about_page_blocks_recognition_tables" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_recognition_order_idx" ON "about_page_blocks_recognition" USING btree ("_order");
  CREATE INDEX "about_page_blocks_recognition_parent_id_idx" ON "about_page_blocks_recognition" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_recognition_path_idx" ON "about_page_blocks_recognition" USING btree ("_path");
  CREATE INDEX "about_page_blocks_timeline_stops_order_idx" ON "about_page_blocks_timeline_stops" USING btree ("_order");
  CREATE INDEX "about_page_blocks_timeline_stops_parent_id_idx" ON "about_page_blocks_timeline_stops" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_timeline_order_idx" ON "about_page_blocks_timeline" USING btree ("_order");
  CREATE INDEX "about_page_blocks_timeline_parent_id_idx" ON "about_page_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_timeline_path_idx" ON "about_page_blocks_timeline" USING btree ("_path");
  CREATE INDEX "about_page_blocks_story_order_idx" ON "about_page_blocks_story" USING btree ("_order");
  CREATE INDEX "about_page_blocks_story_parent_id_idx" ON "about_page_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_story_path_idx" ON "about_page_blocks_story" USING btree ("_path");
  CREATE INDEX "about_page_blocks_closing_doors_order_idx" ON "about_page_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "about_page_blocks_closing_doors_parent_id_idx" ON "about_page_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_closing_doors_path_idx" ON "about_page_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "about_page_blocks_faq_questions_order_idx" ON "about_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "about_page_blocks_faq_questions_parent_id_idx" ON "about_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_faq_order_idx" ON "about_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "about_page_blocks_faq_parent_id_idx" ON "about_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_faq_path_idx" ON "about_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "about_page_blocks_text_order_idx" ON "about_page_blocks_text" USING btree ("_order");
  CREATE INDEX "about_page_blocks_text_parent_id_idx" ON "about_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "about_page_blocks_text_path_idx" ON "about_page_blocks_text" USING btree ("_path");
  CREATE INDEX "about_page__status_idx" ON "about_page" USING btree ("_status");
  CREATE INDEX "_about_page_v_blocks_about_hero_paragraphs_order_idx" ON "_about_page_v_blocks_about_hero_paragraphs" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_about_hero_paragraphs_parent_id_idx" ON "_about_page_v_blocks_about_hero_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_about_hero_order_idx" ON "_about_page_v_blocks_about_hero" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_about_hero_parent_id_idx" ON "_about_page_v_blocks_about_hero" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_about_hero_path_idx" ON "_about_page_v_blocks_about_hero" USING btree ("_path");
  CREATE INDEX "_about_page_v_blocks_about_hero_photo_idx" ON "_about_page_v_blocks_about_hero" USING btree ("photo_id");
  CREATE INDEX "_about_page_v_blocks_founder_profile_qualifications_order_idx" ON "_about_page_v_blocks_founder_profile_qualifications" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_founder_profile_qualifications_parent_id_idx" ON "_about_page_v_blocks_founder_profile_qualifications" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_founder_profile_points_order_idx" ON "_about_page_v_blocks_founder_profile_points" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_founder_profile_points_parent_id_idx" ON "_about_page_v_blocks_founder_profile_points" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_founder_profile_order_idx" ON "_about_page_v_blocks_founder_profile" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_founder_profile_parent_id_idx" ON "_about_page_v_blocks_founder_profile" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_founder_profile_path_idx" ON "_about_page_v_blocks_founder_profile" USING btree ("_path");
  CREATE INDEX "_about_page_v_blocks_founder_profile_photo_idx" ON "_about_page_v_blocks_founder_profile" USING btree ("photo_id");
  CREATE INDEX "_about_page_v_blocks_team_carousel_order_idx" ON "_about_page_v_blocks_team_carousel" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_team_carousel_parent_id_idx" ON "_about_page_v_blocks_team_carousel" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_team_carousel_path_idx" ON "_about_page_v_blocks_team_carousel" USING btree ("_path");
  CREATE INDEX "_about_page_v_blocks_group_areas_areas_order_idx" ON "_about_page_v_blocks_group_areas_areas" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_group_areas_areas_parent_id_idx" ON "_about_page_v_blocks_group_areas_areas" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_group_areas_order_idx" ON "_about_page_v_blocks_group_areas" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_group_areas_parent_id_idx" ON "_about_page_v_blocks_group_areas" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_group_areas_path_idx" ON "_about_page_v_blocks_group_areas" USING btree ("_path");
  CREATE INDEX "_about_page_v_blocks_recognition_tables_returns_order_idx" ON "_about_page_v_blocks_recognition_tables_returns" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_recognition_tables_returns_parent_id_idx" ON "_about_page_v_blocks_recognition_tables_returns" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_recognition_tables_order_idx" ON "_about_page_v_blocks_recognition_tables" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_recognition_tables_parent_id_idx" ON "_about_page_v_blocks_recognition_tables" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_recognition_order_idx" ON "_about_page_v_blocks_recognition" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_recognition_parent_id_idx" ON "_about_page_v_blocks_recognition" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_recognition_path_idx" ON "_about_page_v_blocks_recognition" USING btree ("_path");
  CREATE INDEX "_about_page_v_blocks_timeline_stops_order_idx" ON "_about_page_v_blocks_timeline_stops" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_timeline_stops_parent_id_idx" ON "_about_page_v_blocks_timeline_stops" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_timeline_order_idx" ON "_about_page_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_timeline_parent_id_idx" ON "_about_page_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_timeline_path_idx" ON "_about_page_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_about_page_v_blocks_story_order_idx" ON "_about_page_v_blocks_story" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_story_parent_id_idx" ON "_about_page_v_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_story_path_idx" ON "_about_page_v_blocks_story" USING btree ("_path");
  CREATE INDEX "_about_page_v_blocks_closing_doors_order_idx" ON "_about_page_v_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_closing_doors_parent_id_idx" ON "_about_page_v_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_closing_doors_path_idx" ON "_about_page_v_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "_about_page_v_blocks_faq_questions_order_idx" ON "_about_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_faq_questions_parent_id_idx" ON "_about_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_faq_order_idx" ON "_about_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_faq_parent_id_idx" ON "_about_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_faq_path_idx" ON "_about_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_about_page_v_blocks_text_order_idx" ON "_about_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_about_page_v_blocks_text_parent_id_idx" ON "_about_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_blocks_text_path_idx" ON "_about_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_about_page_v_version_version__status_idx" ON "_about_page_v" USING btree ("version__status");
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");
  CREATE INDEX "_about_page_v_latest_idx" ON "_about_page_v" USING btree ("latest");
  CREATE INDEX "_about_page_v_autosave_idx" ON "_about_page_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");`)

  // Today's team, in its order, with the photographs it already has in /public.
  for (const member of TEAM) {
    await payload.create({
      collection: 'team-members',
      data: { name: member.name, role: member.role, photoPath: member.photo, linkedin: member.linkedin, points: member.points.map((point) => ({ point })) },
      req,
      context: { skipRevalidate: true },
    })
  }
  // Today's /about, published, so the page reads the same on the day this ships.
  await payload.updateGlobal({ slug: 'about-page', data: { sections: [...ABOUT_SECTIONS], _status: 'published' }, req, context: { skipRevalidate: true } })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_about_hero_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_about_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_founder_profile_qualifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_founder_profile_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_founder_profile" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_team_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_group_areas_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_group_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_recognition_tables_returns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_recognition_tables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_recognition" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_timeline_stops" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_story" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_about_hero_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_about_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_founder_profile_qualifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_founder_profile_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_founder_profile" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_team_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_group_areas_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_group_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_recognition_tables_returns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_recognition_tables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_recognition" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_timeline_stops" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_story" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "team_members_points" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "about_page_blocks_about_hero_paragraphs" CASCADE;
  DROP TABLE "about_page_blocks_about_hero" CASCADE;
  DROP TABLE "about_page_blocks_founder_profile_qualifications" CASCADE;
  DROP TABLE "about_page_blocks_founder_profile_points" CASCADE;
  DROP TABLE "about_page_blocks_founder_profile" CASCADE;
  DROP TABLE "about_page_blocks_team_carousel" CASCADE;
  DROP TABLE "about_page_blocks_group_areas_areas" CASCADE;
  DROP TABLE "about_page_blocks_group_areas" CASCADE;
  DROP TABLE "about_page_blocks_recognition_tables_returns" CASCADE;
  DROP TABLE "about_page_blocks_recognition_tables" CASCADE;
  DROP TABLE "about_page_blocks_recognition" CASCADE;
  DROP TABLE "about_page_blocks_timeline_stops" CASCADE;
  DROP TABLE "about_page_blocks_timeline" CASCADE;
  DROP TABLE "about_page_blocks_story" CASCADE;
  DROP TABLE "about_page_blocks_closing_doors" CASCADE;
  DROP TABLE "about_page_blocks_faq_questions" CASCADE;
  DROP TABLE "about_page_blocks_faq" CASCADE;
  DROP TABLE "about_page_blocks_text" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "_about_page_v_blocks_about_hero_paragraphs" CASCADE;
  DROP TABLE "_about_page_v_blocks_about_hero" CASCADE;
  DROP TABLE "_about_page_v_blocks_founder_profile_qualifications" CASCADE;
  DROP TABLE "_about_page_v_blocks_founder_profile_points" CASCADE;
  DROP TABLE "_about_page_v_blocks_founder_profile" CASCADE;
  DROP TABLE "_about_page_v_blocks_team_carousel" CASCADE;
  DROP TABLE "_about_page_v_blocks_group_areas_areas" CASCADE;
  DROP TABLE "_about_page_v_blocks_group_areas" CASCADE;
  DROP TABLE "_about_page_v_blocks_recognition_tables_returns" CASCADE;
  DROP TABLE "_about_page_v_blocks_recognition_tables" CASCADE;
  DROP TABLE "_about_page_v_blocks_recognition" CASCADE;
  DROP TABLE "_about_page_v_blocks_timeline_stops" CASCADE;
  DROP TABLE "_about_page_v_blocks_timeline" CASCADE;
  DROP TABLE "_about_page_v_blocks_story" CASCADE;
  DROP TABLE "_about_page_v_blocks_closing_doors" CASCADE;
  DROP TABLE "_about_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_about_page_v_blocks_faq" CASCADE;
  DROP TABLE "_about_page_v_blocks_text" CASCADE;
  DROP TABLE "_about_page_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_members_fk";
  
  DROP INDEX "payload_locked_documents_rels_team_members_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_members_id";
  DROP TYPE "public"."enum_about_page_status";
  DROP TYPE "public"."enum__about_page_v_version_status";`)
}
