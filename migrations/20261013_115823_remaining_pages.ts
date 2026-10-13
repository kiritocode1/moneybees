import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { CAREER_ROLES } from '../lib/career-roles'
import { CASE_STUDIES } from '../lib/case-studies'
import { AIF_SECTIONS } from '../lib/pages/aif-content'
import { CAREERS_SECTIONS } from '../lib/pages/careers-content'
import { CASE_STUDIES_SECTIONS } from '../lib/pages/case-studies-content'
import { COMPARE_SECTIONS } from '../lib/pages/compare-content'
import { PHILOSOPHY_SECTIONS } from '../lib/pages/philosophy-content'
import { PICKS_SECTIONS } from '../lib/pages/picks-content'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_case_studies_drawing" AS ENUM('power', 'casting', 'laminations');
  CREATE TYPE "public"."enum_openings_status" AS ENUM('live', 'sample');
  CREATE TYPE "public"."enum_openings_team" AS ENUM('research', 'portfolio', 'advisory', 'compliance', 'services');
  CREATE TYPE "public"."enum_aif_page_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum_aif_page_blocks_key_terms_terms_drawing" AS ENUM('minimum', 'horizon', 'universe', 'benchmark', 'exit');
  CREATE TYPE "public"."enum_aif_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__aif_page_v_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum__aif_page_v_blocks_key_terms_terms_drawing" AS ENUM('minimum', 'horizon', 'universe', 'benchmark', 'exit');
  CREATE TYPE "public"."enum__aif_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pms_vs_aif_page_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum_pms_vs_aif_page_blocks_comparison_rows_drawing" AS ENUM('holding', 'money', 'structure', 'product', 'account');
  CREATE TYPE "public"."enum_pms_vs_aif_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pms_vs_aif_page_v_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum__pms_vs_aif_page_v_blocks_comparison_rows_drawing" AS ENUM('holding', 'money', 'structure', 'product', 'account');
  CREATE TYPE "public"."enum__pms_vs_aif_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_our_philosophy_page_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum_our_philosophy_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__our_philosophy_page_v_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum__our_philosophy_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_case_studies_page_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum_case_studies_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_page_v_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum__case_studies_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_picks_page_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum_picks_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__picks_page_v_blocks_product_hero_mark" AS ENUM('pms', 'aif', 'compare', 'approach', 'picks', 'cases', 'careers', 'contact', 'investor');
  CREATE TYPE "public"."enum__picks_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_careers_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__careers_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "case_studies_financials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"revenue" numeric NOT NULL,
  	"ebitda" numeric NOT NULL,
  	"pat" numeric NOT NULL
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"mark" varchar NOT NULL,
  	"drawing" "enum_case_studies_drawing" DEFAULT 'power' NOT NULL,
  	"business" varchar NOT NULL,
  	"edge" varchar NOT NULL,
  	"growth" varchar NOT NULL,
  	"anchor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "openings_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "openings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"status" "enum_openings_status" DEFAULT 'live' NOT NULL,
  	"team" "enum_openings_team" NOT NULL,
  	"location" varchar DEFAULT 'Mumbai' NOT NULL,
  	"employment" varchar DEFAULT 'Full-time' NOT NULL,
  	"summary" varchar NOT NULL,
  	"anchor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "aif_page_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean
  );
  
  CREATE TABLE "aif_page_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "aif_page_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum_aif_page_blocks_product_hero_mark" DEFAULT 'pms',
  	"block_name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_aif_performance" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Performance',
  	"heading" varchar DEFAULT 'AIF Performance',
  	"lead" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  	"method" varchar DEFAULT 'Returns in %, time-weighted (TWRR). N/A marks a period that has not run since the fund''s first close on October 30, 2025. Past performance may or may not be sustained in the future. Past performance does not guarantee future performance.',
  	"block_name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_opportunity_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "aif_page_blocks_opportunity" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Flyingbee',
  	"heading" varchar DEFAULT 'Strategic Opportunity',
  	"lead" varchar DEFAULT 'The fund focuses on opportunities in high-growth listed and pre‑IPO/unlisted companies.',
  	"block_name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_pooling" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Category III AIF',
  	"heading" varchar DEFAULT 'Why Category III AIF?',
  	"text" varchar DEFAULT 'An AIF is a privately pooled investment vehicle. Unlike PMS, where investors directly hold securities in their own demat accounts, AIF investors receive units of the fund.',
  	"block_name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_structure_parties" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_structure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Flyingbee',
  	"heading" varchar DEFAULT 'Flyingbee Structure',
  	"investors" varchar DEFAULT 'Investors',
  	"fund" varchar DEFAULT 'Flyingbee Investment Fund',
  	"manager" varchar DEFAULT 'Moneybee Investment Manager',
  	"block_name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_approach_wheel_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar
  );
  
  CREATE TABLE "aif_page_blocks_approach_wheel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Flyingbee',
  	"heading" varchar DEFAULT 'Investment Approach',
  	"line" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  	"block_name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_key_terms_terms" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"drawing" "enum_aif_page_blocks_key_terms_terms_drawing"
  );
  
  CREATE TABLE "aif_page_blocks_key_terms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Flyingbee',
  	"heading" varchar DEFAULT 'Key Terms',
  	"button_label" varchar DEFAULT 'Get Started',
  	"button_link" varchar DEFAULT '/contact?enquiry=general#enquiry',
  	"block_name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "aif_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "aif_page_blocks_text" (
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
  
  CREATE TABLE "aif_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_aif_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_aif_page_v_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum__aif_page_v_blocks_product_hero_mark" DEFAULT 'pms',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_aif_performance" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Performance',
  	"heading" varchar DEFAULT 'AIF Performance',
  	"lead" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  	"method" varchar DEFAULT 'Returns in %, time-weighted (TWRR). N/A marks a period that has not run since the fund''s first close on October 30, 2025. Past performance may or may not be sustained in the future. Past performance does not guarantee future performance.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_opportunity_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_opportunity" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Flyingbee',
  	"heading" varchar DEFAULT 'Strategic Opportunity',
  	"lead" varchar DEFAULT 'The fund focuses on opportunities in high-growth listed and pre‑IPO/unlisted companies.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_pooling" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Category III AIF',
  	"heading" varchar DEFAULT 'Why Category III AIF?',
  	"text" varchar DEFAULT 'An AIF is a privately pooled investment vehicle. Unlike PMS, where investors directly hold securities in their own demat accounts, AIF investors receive units of the fund.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_structure_parties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_structure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Flyingbee',
  	"heading" varchar DEFAULT 'Flyingbee Structure',
  	"investors" varchar DEFAULT 'Investors',
  	"fund" varchar DEFAULT 'Flyingbee Investment Fund',
  	"manager" varchar DEFAULT 'Moneybee Investment Manager',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_approach_wheel_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_approach_wheel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Flyingbee',
  	"heading" varchar DEFAULT 'Investment Approach',
  	"line" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_key_terms_terms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"drawing" "enum__aif_page_v_blocks_key_terms_terms_drawing",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_key_terms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Flyingbee',
  	"heading" varchar DEFAULT 'Key Terms',
  	"button_label" varchar DEFAULT 'Get Started',
  	"button_link" varchar DEFAULT '/contact?enquiry=general#enquiry',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_aif_page_v_blocks_faq" (
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
  
  CREATE TABLE "_aif_page_v_blocks_text" (
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
  
  CREATE TABLE "_aif_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__aif_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum_pms_vs_aif_page_blocks_product_hero_mark" DEFAULT 'pms',
  	"block_name" varchar
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pms" varchar,
  	"aif" varchar,
  	"drawing" "enum_pms_vs_aif_page_blocks_comparison_rows_drawing"
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_comparison_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Comparison',
  	"heading" varchar DEFAULT 'Simple Comparison',
  	"block_name" varchar
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_explanation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Explanation',
  	"heading" varchar DEFAULT 'Simple Explanation',
  	"pms" varchar DEFAULT 'The investor’s portfolio is managed according to the agreed investment mandate.',
  	"aif" varchar DEFAULT 'Investors contribute to a pooled fund structure that is managed according to the fund’s approved strategy and documents.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "pms_vs_aif_page_blocks_text" (
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
  
  CREATE TABLE "pms_vs_aif_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_pms_vs_aif_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum__pms_vs_aif_page_v_blocks_product_hero_mark" DEFAULT 'pms',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pms" varchar,
  	"aif" varchar,
  	"drawing" "enum__pms_vs_aif_page_v_blocks_comparison_rows_drawing",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_comparison_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Comparison',
  	"heading" varchar DEFAULT 'Simple Comparison',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_explanation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Explanation',
  	"heading" varchar DEFAULT 'Simple Explanation',
  	"pms" varchar DEFAULT 'The investor’s portfolio is managed according to the agreed investment mandate.',
  	"aif" varchar DEFAULT 'Investors contribute to a pooled fund structure that is managed according to the fund’s approved strategy and documents.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_faq" (
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
  
  CREATE TABLE "_pms_vs_aif_page_v_blocks_text" (
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
  
  CREATE TABLE "_pms_vs_aif_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__pms_vs_aif_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "our_philosophy_page_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean
  );
  
  CREATE TABLE "our_philosophy_page_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum_our_philosophy_page_blocks_product_hero_mark" DEFAULT 'pms',
  	"block_name" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_core_discs_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_core_discs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Core Philosophy',
  	"lead" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  	"block_name" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_principles_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Our philosophy',
  	"heading" varchar DEFAULT 'Undiscovered. Under researched. Under estimated.',
  	"block_name" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_criteria_look_for" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_criteria_dont_do" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_criteria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"look_for_heading" varchar DEFAULT 'What We Look For',
  	"dont_do_heading" varchar DEFAULT 'What We Don''t Do',
  	"block_name" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_risk_rings_risks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_risk_rings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Risk Management',
  	"block_name" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "our_philosophy_page_blocks_text" (
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
  
  CREATE TABLE "our_philosophy_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_our_philosophy_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum__our_philosophy_page_v_blocks_product_hero_mark" DEFAULT 'pms',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_core_discs_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"word" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_core_discs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Core Philosophy',
  	"lead" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_principles_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Our philosophy',
  	"heading" varchar DEFAULT 'Undiscovered. Under researched. Under estimated.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_criteria_look_for" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_criteria_dont_do" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_criteria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"look_for_heading" varchar DEFAULT 'What We Look For',
  	"dont_do_heading" varchar DEFAULT 'What We Don''t Do',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_risk_rings_risks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_risk_rings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Risk Management',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_philosophy_page_v_blocks_faq" (
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
  
  CREATE TABLE "_our_philosophy_page_v_blocks_text" (
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
  
  CREATE TABLE "_our_philosophy_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__our_philosophy_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "case_studies_page_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean
  );
  
  CREATE TABLE "case_studies_page_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "case_studies_page_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum_case_studies_page_blocks_product_hero_mark" DEFAULT 'pms',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_page_blocks_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_page_blocks_case_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Timeline',
  	"heading" varchar DEFAULT 'Historical Investment Timeline',
  	"lead" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  	"disclaimer" varchar DEFAULT 'The stocks and sectors shown are for illustration only and are not recommendations. Moneybee may or may not hold them in the future. Past performance may or may not be sustained.',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_page_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "case_studies_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "case_studies_page_blocks_text" (
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
  
  CREATE TABLE "case_studies_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_case_studies_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_case_studies_page_v_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_page_v_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_page_v_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum__case_studies_page_v_blocks_product_hero_mark" DEFAULT 'pms',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_page_v_blocks_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_page_v_blocks_case_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Timeline',
  	"heading" varchar DEFAULT 'Historical Investment Timeline',
  	"lead" varchar DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  	"disclaimer" varchar DEFAULT 'The stocks and sectors shown are for illustration only and are not recommendations. Moneybee may or may not hold them in the future. Past performance may or may not be sustained.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_page_v_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_case_studies_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_page_v_blocks_faq" (
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
  
  CREATE TABLE "_case_studies_page_v_blocks_text" (
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
  
  CREATE TABLE "_case_studies_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__case_studies_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "picks_page_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean
  );
  
  CREATE TABLE "picks_page_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "picks_page_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum_picks_page_blocks_product_hero_mark" DEFAULT 'pms',
  	"block_name" varchar
  );
  
  CREATE TABLE "picks_page_blocks_picks_tiers_picks_financials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"revenue" numeric,
  	"profit" numeric
  );
  
  CREATE TABLE "picks_page_blocks_picks_tiers_picks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"business" varchar,
  	"edge" varchar,
  	"growth" varchar
  );
  
  CREATE TABLE "picks_page_blocks_picks_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"multiple" varchar,
  	"count_line" varchar
  );
  
  CREATE TABLE "picks_page_blocks_picks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Our multibagger picks',
  	"heading" varchar DEFAULT 'Our superior gains stem from venturing into opportunities overlooked by the investment crowd',
  	"block_name" varchar
  );
  
  CREATE TABLE "picks_page_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "picks_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "picks_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "picks_page_blocks_text" (
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
  
  CREATE TABLE "picks_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_picks_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_picks_page_v_blocks_product_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"outline" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_picks_page_v_blocks_product_hero_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_picks_page_v_blocks_product_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"title1" varchar DEFAULT 'Portfolio',
  	"title2" varchar DEFAULT 'Management Services',
  	"sentence" varchar DEFAULT 'Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.',
  	"mark" "enum__picks_page_v_blocks_product_hero_mark" DEFAULT 'pms',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_picks_page_v_blocks_picks_tiers_picks_financials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"revenue" numeric,
  	"profit" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_picks_page_v_blocks_picks_tiers_picks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"business" varchar,
  	"edge" varchar,
  	"growth" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_picks_page_v_blocks_picks_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"multiple" varchar,
  	"count_line" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_picks_page_v_blocks_picks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Our multibagger picks',
  	"heading" varchar DEFAULT 'Our superior gains stem from venturing into opportunities overlooked by the investment crowd',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_picks_page_v_blocks_closing_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_picks_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_picks_page_v_blocks_faq" (
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
  
  CREATE TABLE "_picks_page_v_blocks_text" (
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
  
  CREATE TABLE "_picks_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__picks_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "careers_page_blocks_careers_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Careers at Moneybee',
  	"heading" varchar DEFAULT 'Build your career with Moneybee',
  	"lead" varchar DEFAULT 'Moneybee brings together professionals working across investment research, portfolio management, advisory, compliance and financial services.',
  	"button_label" varchar DEFAULT 'View roles',
  	"resume_label" varchar DEFAULT 'Send your resume',
  	"block_name" varchar
  );
  
  CREATE TABLE "careers_page_blocks_job_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Find your role',
  	"block_name" varchar
  );
  
  CREATE TABLE "careers_page_blocks_careers_office" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Life at Moneybee',
  	"photo_id" integer,
  	"caption" varchar DEFAULT 'At our Lower Parel office',
  	"text" varchar DEFAULT 'Our team works across listed and unlisted company research, portfolio management, corporate advisory and compliance.',
  	"detail" varchar DEFAULT 'Based in Lower Parel, Mumbai, Moneybee Group has been working with businesses and investors since 2004.',
  	"link_label" varchar DEFAULT 'Meet the team',
  	"link" varchar DEFAULT '/about#team',
  	"block_name" varchar
  );
  
  CREATE TABLE "careers_page_blocks_careers_resume" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Tell us about yourself.',
  	"text" varchar DEFAULT 'Send your resume with a short note about your experience and the team you would like to work with.',
  	"button_label" varchar DEFAULT 'Send your resume',
  	"note" varchar DEFAULT 'Opens your email app.',
  	"block_name" varchar
  );
  
  CREATE TABLE "careers_page_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "careers_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'FAQs',
  	"heading" varchar DEFAULT 'Questions we are often asked',
  	"block_name" varchar
  );
  
  CREATE TABLE "careers_page_blocks_text" (
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
  
  CREATE TABLE "careers_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_careers_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_careers_page_v_blocks_careers_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"label" varchar DEFAULT 'Careers at Moneybee',
  	"heading" varchar DEFAULT 'Build your career with Moneybee',
  	"lead" varchar DEFAULT 'Moneybee brings together professionals working across investment research, portfolio management, advisory, compliance and financial services.',
  	"button_label" varchar DEFAULT 'View roles',
  	"resume_label" varchar DEFAULT 'Send your resume',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_careers_page_v_blocks_job_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Find your role',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_careers_page_v_blocks_careers_office" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Life at Moneybee',
  	"photo_id" integer,
  	"caption" varchar DEFAULT 'At our Lower Parel office',
  	"text" varchar DEFAULT 'Our team works across listed and unlisted company research, portfolio management, corporate advisory and compliance.',
  	"detail" varchar DEFAULT 'Based in Lower Parel, Mumbai, Moneybee Group has been working with businesses and investors since 2004.',
  	"link_label" varchar DEFAULT 'Meet the team',
  	"link" varchar DEFAULT '/about#team',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_careers_page_v_blocks_careers_resume" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"heading" varchar DEFAULT 'Tell us about yourself.',
  	"text" varchar DEFAULT 'Send your resume with a short note about your experience and the team you would like to work with.',
  	"button_label" varchar DEFAULT 'Send your resume',
  	"note" varchar DEFAULT 'Opens your email app.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_careers_page_v_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_page_v_blocks_faq" (
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
  
  CREATE TABLE "_careers_page_v_blocks_text" (
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
  
  CREATE TABLE "_careers_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__careers_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "openings_id" integer;
  ALTER TABLE "case_studies_financials" ADD CONSTRAINT "case_studies_financials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "openings_responsibilities" ADD CONSTRAINT "openings_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_product_hero_actions" ADD CONSTRAINT "aif_page_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_product_hero_figures" ADD CONSTRAINT "aif_page_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_product_hero" ADD CONSTRAINT "aif_page_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_aif_performance" ADD CONSTRAINT "aif_page_blocks_aif_performance_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_opportunity_steps" ADD CONSTRAINT "aif_page_blocks_opportunity_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page_blocks_opportunity"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_opportunity" ADD CONSTRAINT "aif_page_blocks_opportunity_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_pooling" ADD CONSTRAINT "aif_page_blocks_pooling_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_structure_parties" ADD CONSTRAINT "aif_page_blocks_structure_parties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page_blocks_structure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_structure" ADD CONSTRAINT "aif_page_blocks_structure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_approach_wheel_steps" ADD CONSTRAINT "aif_page_blocks_approach_wheel_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page_blocks_approach_wheel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_approach_wheel" ADD CONSTRAINT "aif_page_blocks_approach_wheel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_key_terms_terms" ADD CONSTRAINT "aif_page_blocks_key_terms_terms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page_blocks_key_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_key_terms" ADD CONSTRAINT "aif_page_blocks_key_terms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_closing_doors" ADD CONSTRAINT "aif_page_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_faq_questions" ADD CONSTRAINT "aif_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_faq" ADD CONSTRAINT "aif_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aif_page_blocks_text" ADD CONSTRAINT "aif_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_product_hero_actions" ADD CONSTRAINT "_aif_page_v_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_product_hero_figures" ADD CONSTRAINT "_aif_page_v_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_product_hero" ADD CONSTRAINT "_aif_page_v_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_aif_performance" ADD CONSTRAINT "_aif_page_v_blocks_aif_performance_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_opportunity_steps" ADD CONSTRAINT "_aif_page_v_blocks_opportunity_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v_blocks_opportunity"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_opportunity" ADD CONSTRAINT "_aif_page_v_blocks_opportunity_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_pooling" ADD CONSTRAINT "_aif_page_v_blocks_pooling_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_structure_parties" ADD CONSTRAINT "_aif_page_v_blocks_structure_parties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v_blocks_structure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_structure" ADD CONSTRAINT "_aif_page_v_blocks_structure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_approach_wheel_steps" ADD CONSTRAINT "_aif_page_v_blocks_approach_wheel_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v_blocks_approach_wheel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_approach_wheel" ADD CONSTRAINT "_aif_page_v_blocks_approach_wheel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_key_terms_terms" ADD CONSTRAINT "_aif_page_v_blocks_key_terms_terms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v_blocks_key_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_key_terms" ADD CONSTRAINT "_aif_page_v_blocks_key_terms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_closing_doors" ADD CONSTRAINT "_aif_page_v_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_faq_questions" ADD CONSTRAINT "_aif_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_faq" ADD CONSTRAINT "_aif_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aif_page_v_blocks_text" ADD CONSTRAINT "_aif_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_product_hero_actions" ADD CONSTRAINT "pms_vs_aif_page_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_product_hero_figures" ADD CONSTRAINT "pms_vs_aif_page_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_product_hero" ADD CONSTRAINT "pms_vs_aif_page_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_comparison_rows" ADD CONSTRAINT "pms_vs_aif_page_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_comparison_links" ADD CONSTRAINT "pms_vs_aif_page_blocks_comparison_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_comparison" ADD CONSTRAINT "pms_vs_aif_page_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_explanation" ADD CONSTRAINT "pms_vs_aif_page_blocks_explanation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_closing_doors" ADD CONSTRAINT "pms_vs_aif_page_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_faq_questions" ADD CONSTRAINT "pms_vs_aif_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_faq" ADD CONSTRAINT "pms_vs_aif_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pms_vs_aif_page_blocks_text" ADD CONSTRAINT "pms_vs_aif_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pms_vs_aif_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_product_hero_actions" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_product_hero_figures" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_product_hero" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_comparison_rows" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_comparison_links" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_comparison_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_comparison" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_explanation" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_explanation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_closing_doors" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_faq_questions" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_faq" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_text" ADD CONSTRAINT "_pms_vs_aif_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pms_vs_aif_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_product_hero_actions" ADD CONSTRAINT "our_philosophy_page_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_product_hero_figures" ADD CONSTRAINT "our_philosophy_page_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_product_hero" ADD CONSTRAINT "our_philosophy_page_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_core_discs_stages" ADD CONSTRAINT "our_philosophy_page_blocks_core_discs_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page_blocks_core_discs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_core_discs" ADD CONSTRAINT "our_philosophy_page_blocks_core_discs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_principles_principles" ADD CONSTRAINT "our_philosophy_page_blocks_principles_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page_blocks_principles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_principles" ADD CONSTRAINT "our_philosophy_page_blocks_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_criteria_look_for" ADD CONSTRAINT "our_philosophy_page_blocks_criteria_look_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page_blocks_criteria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_criteria_dont_do" ADD CONSTRAINT "our_philosophy_page_blocks_criteria_dont_do_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page_blocks_criteria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_criteria" ADD CONSTRAINT "our_philosophy_page_blocks_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_risk_rings_risks" ADD CONSTRAINT "our_philosophy_page_blocks_risk_rings_risks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page_blocks_risk_rings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_risk_rings" ADD CONSTRAINT "our_philosophy_page_blocks_risk_rings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_closing_doors" ADD CONSTRAINT "our_philosophy_page_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_faq_questions" ADD CONSTRAINT "our_philosophy_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_faq" ADD CONSTRAINT "our_philosophy_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_philosophy_page_blocks_text" ADD CONSTRAINT "our_philosophy_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_philosophy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_product_hero_actions" ADD CONSTRAINT "_our_philosophy_page_v_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_product_hero_figures" ADD CONSTRAINT "_our_philosophy_page_v_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_product_hero" ADD CONSTRAINT "_our_philosophy_page_v_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_core_discs_stages" ADD CONSTRAINT "_our_philosophy_page_v_blocks_core_discs_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v_blocks_core_discs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_core_discs" ADD CONSTRAINT "_our_philosophy_page_v_blocks_core_discs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_principles_principles" ADD CONSTRAINT "_our_philosophy_page_v_blocks_principles_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v_blocks_principles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_principles" ADD CONSTRAINT "_our_philosophy_page_v_blocks_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_criteria_look_for" ADD CONSTRAINT "_our_philosophy_page_v_blocks_criteria_look_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v_blocks_criteria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_criteria_dont_do" ADD CONSTRAINT "_our_philosophy_page_v_blocks_criteria_dont_do_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v_blocks_criteria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_criteria" ADD CONSTRAINT "_our_philosophy_page_v_blocks_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_risk_rings_risks" ADD CONSTRAINT "_our_philosophy_page_v_blocks_risk_rings_risks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v_blocks_risk_rings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_risk_rings" ADD CONSTRAINT "_our_philosophy_page_v_blocks_risk_rings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_closing_doors" ADD CONSTRAINT "_our_philosophy_page_v_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_faq_questions" ADD CONSTRAINT "_our_philosophy_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_faq" ADD CONSTRAINT "_our_philosophy_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_philosophy_page_v_blocks_text" ADD CONSTRAINT "_our_philosophy_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_philosophy_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page_blocks_product_hero_actions" ADD CONSTRAINT "case_studies_page_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page_blocks_product_hero_figures" ADD CONSTRAINT "case_studies_page_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page_blocks_product_hero" ADD CONSTRAINT "case_studies_page_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page_blocks_case_studies" ADD CONSTRAINT "case_studies_page_blocks_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page_blocks_case_timeline" ADD CONSTRAINT "case_studies_page_blocks_case_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page_blocks_closing_doors" ADD CONSTRAINT "case_studies_page_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page_blocks_faq_questions" ADD CONSTRAINT "case_studies_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page_blocks_faq" ADD CONSTRAINT "case_studies_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page_blocks_text" ADD CONSTRAINT "case_studies_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_blocks_product_hero_actions" ADD CONSTRAINT "_case_studies_page_v_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_blocks_product_hero_figures" ADD CONSTRAINT "_case_studies_page_v_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_blocks_product_hero" ADD CONSTRAINT "_case_studies_page_v_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_blocks_case_studies" ADD CONSTRAINT "_case_studies_page_v_blocks_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_blocks_case_timeline" ADD CONSTRAINT "_case_studies_page_v_blocks_case_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_blocks_closing_doors" ADD CONSTRAINT "_case_studies_page_v_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_blocks_faq_questions" ADD CONSTRAINT "_case_studies_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_blocks_faq" ADD CONSTRAINT "_case_studies_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_blocks_text" ADD CONSTRAINT "_case_studies_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_product_hero_actions" ADD CONSTRAINT "picks_page_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_product_hero_figures" ADD CONSTRAINT "picks_page_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_product_hero" ADD CONSTRAINT "picks_page_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_picks_tiers_picks_financials" ADD CONSTRAINT "picks_page_blocks_picks_tiers_picks_financials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page_blocks_picks_tiers_picks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_picks_tiers_picks" ADD CONSTRAINT "picks_page_blocks_picks_tiers_picks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page_blocks_picks_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_picks_tiers" ADD CONSTRAINT "picks_page_blocks_picks_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page_blocks_picks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_picks" ADD CONSTRAINT "picks_page_blocks_picks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_closing_doors" ADD CONSTRAINT "picks_page_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_faq_questions" ADD CONSTRAINT "picks_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_faq" ADD CONSTRAINT "picks_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "picks_page_blocks_text" ADD CONSTRAINT "picks_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."picks_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_product_hero_actions" ADD CONSTRAINT "_picks_page_v_blocks_product_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_product_hero_figures" ADD CONSTRAINT "_picks_page_v_blocks_product_hero_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v_blocks_product_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_product_hero" ADD CONSTRAINT "_picks_page_v_blocks_product_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_picks_tiers_picks_financials" ADD CONSTRAINT "_picks_page_v_blocks_picks_tiers_picks_financials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v_blocks_picks_tiers_picks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_picks_tiers_picks" ADD CONSTRAINT "_picks_page_v_blocks_picks_tiers_picks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v_blocks_picks_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_picks_tiers" ADD CONSTRAINT "_picks_page_v_blocks_picks_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v_blocks_picks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_picks" ADD CONSTRAINT "_picks_page_v_blocks_picks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_closing_doors" ADD CONSTRAINT "_picks_page_v_blocks_closing_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_faq_questions" ADD CONSTRAINT "_picks_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_faq" ADD CONSTRAINT "_picks_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_picks_page_v_blocks_text" ADD CONSTRAINT "_picks_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_picks_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_page_blocks_careers_intro" ADD CONSTRAINT "careers_page_blocks_careers_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_page_blocks_job_board" ADD CONSTRAINT "careers_page_blocks_job_board_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_page_blocks_careers_office" ADD CONSTRAINT "careers_page_blocks_careers_office_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "careers_page_blocks_careers_office" ADD CONSTRAINT "careers_page_blocks_careers_office_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_page_blocks_careers_resume" ADD CONSTRAINT "careers_page_blocks_careers_resume_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_page_blocks_faq_questions" ADD CONSTRAINT "careers_page_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_page_blocks_faq" ADD CONSTRAINT "careers_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_page_blocks_text" ADD CONSTRAINT "careers_page_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_page_v_blocks_careers_intro" ADD CONSTRAINT "_careers_page_v_blocks_careers_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_page_v_blocks_job_board" ADD CONSTRAINT "_careers_page_v_blocks_job_board_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_page_v_blocks_careers_office" ADD CONSTRAINT "_careers_page_v_blocks_careers_office_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_careers_page_v_blocks_careers_office" ADD CONSTRAINT "_careers_page_v_blocks_careers_office_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_page_v_blocks_careers_resume" ADD CONSTRAINT "_careers_page_v_blocks_careers_resume_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_page_v_blocks_faq_questions" ADD CONSTRAINT "_careers_page_v_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_page_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_page_v_blocks_faq" ADD CONSTRAINT "_careers_page_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_page_v_blocks_text" ADD CONSTRAINT "_careers_page_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "case_studies_financials_order_idx" ON "case_studies_financials" USING btree ("_order");
  CREATE INDEX "case_studies_financials_parent_id_idx" ON "case_studies_financials" USING btree ("_parent_id");
  CREATE INDEX "case_studies__order_idx" ON "case_studies" USING btree ("_order");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "openings_responsibilities_order_idx" ON "openings_responsibilities" USING btree ("_order");
  CREATE INDEX "openings_responsibilities_parent_id_idx" ON "openings_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "openings__order_idx" ON "openings" USING btree ("_order");
  CREATE INDEX "openings_updated_at_idx" ON "openings" USING btree ("updated_at");
  CREATE INDEX "openings_created_at_idx" ON "openings" USING btree ("created_at");
  CREATE INDEX "aif_page_blocks_product_hero_actions_order_idx" ON "aif_page_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_product_hero_actions_parent_id_idx" ON "aif_page_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_product_hero_figures_order_idx" ON "aif_page_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_product_hero_figures_parent_id_idx" ON "aif_page_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_product_hero_order_idx" ON "aif_page_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_product_hero_parent_id_idx" ON "aif_page_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_product_hero_path_idx" ON "aif_page_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "aif_page_blocks_aif_performance_order_idx" ON "aif_page_blocks_aif_performance" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_aif_performance_parent_id_idx" ON "aif_page_blocks_aif_performance" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_aif_performance_path_idx" ON "aif_page_blocks_aif_performance" USING btree ("_path");
  CREATE INDEX "aif_page_blocks_opportunity_steps_order_idx" ON "aif_page_blocks_opportunity_steps" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_opportunity_steps_parent_id_idx" ON "aif_page_blocks_opportunity_steps" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_opportunity_order_idx" ON "aif_page_blocks_opportunity" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_opportunity_parent_id_idx" ON "aif_page_blocks_opportunity" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_opportunity_path_idx" ON "aif_page_blocks_opportunity" USING btree ("_path");
  CREATE INDEX "aif_page_blocks_pooling_order_idx" ON "aif_page_blocks_pooling" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_pooling_parent_id_idx" ON "aif_page_blocks_pooling" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_pooling_path_idx" ON "aif_page_blocks_pooling" USING btree ("_path");
  CREATE INDEX "aif_page_blocks_structure_parties_order_idx" ON "aif_page_blocks_structure_parties" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_structure_parties_parent_id_idx" ON "aif_page_blocks_structure_parties" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_structure_order_idx" ON "aif_page_blocks_structure" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_structure_parent_id_idx" ON "aif_page_blocks_structure" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_structure_path_idx" ON "aif_page_blocks_structure" USING btree ("_path");
  CREATE INDEX "aif_page_blocks_approach_wheel_steps_order_idx" ON "aif_page_blocks_approach_wheel_steps" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_approach_wheel_steps_parent_id_idx" ON "aif_page_blocks_approach_wheel_steps" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_approach_wheel_order_idx" ON "aif_page_blocks_approach_wheel" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_approach_wheel_parent_id_idx" ON "aif_page_blocks_approach_wheel" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_approach_wheel_path_idx" ON "aif_page_blocks_approach_wheel" USING btree ("_path");
  CREATE INDEX "aif_page_blocks_key_terms_terms_order_idx" ON "aif_page_blocks_key_terms_terms" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_key_terms_terms_parent_id_idx" ON "aif_page_blocks_key_terms_terms" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_key_terms_order_idx" ON "aif_page_blocks_key_terms" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_key_terms_parent_id_idx" ON "aif_page_blocks_key_terms" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_key_terms_path_idx" ON "aif_page_blocks_key_terms" USING btree ("_path");
  CREATE INDEX "aif_page_blocks_closing_doors_order_idx" ON "aif_page_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_closing_doors_parent_id_idx" ON "aif_page_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_closing_doors_path_idx" ON "aif_page_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "aif_page_blocks_faq_questions_order_idx" ON "aif_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_faq_questions_parent_id_idx" ON "aif_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_faq_order_idx" ON "aif_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_faq_parent_id_idx" ON "aif_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_faq_path_idx" ON "aif_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "aif_page_blocks_text_order_idx" ON "aif_page_blocks_text" USING btree ("_order");
  CREATE INDEX "aif_page_blocks_text_parent_id_idx" ON "aif_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "aif_page_blocks_text_path_idx" ON "aif_page_blocks_text" USING btree ("_path");
  CREATE INDEX "aif_page__status_idx" ON "aif_page" USING btree ("_status");
  CREATE INDEX "_aif_page_v_blocks_product_hero_actions_order_idx" ON "_aif_page_v_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_product_hero_actions_parent_id_idx" ON "_aif_page_v_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_product_hero_figures_order_idx" ON "_aif_page_v_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_product_hero_figures_parent_id_idx" ON "_aif_page_v_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_product_hero_order_idx" ON "_aif_page_v_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_product_hero_parent_id_idx" ON "_aif_page_v_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_product_hero_path_idx" ON "_aif_page_v_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "_aif_page_v_blocks_aif_performance_order_idx" ON "_aif_page_v_blocks_aif_performance" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_aif_performance_parent_id_idx" ON "_aif_page_v_blocks_aif_performance" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_aif_performance_path_idx" ON "_aif_page_v_blocks_aif_performance" USING btree ("_path");
  CREATE INDEX "_aif_page_v_blocks_opportunity_steps_order_idx" ON "_aif_page_v_blocks_opportunity_steps" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_opportunity_steps_parent_id_idx" ON "_aif_page_v_blocks_opportunity_steps" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_opportunity_order_idx" ON "_aif_page_v_blocks_opportunity" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_opportunity_parent_id_idx" ON "_aif_page_v_blocks_opportunity" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_opportunity_path_idx" ON "_aif_page_v_blocks_opportunity" USING btree ("_path");
  CREATE INDEX "_aif_page_v_blocks_pooling_order_idx" ON "_aif_page_v_blocks_pooling" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_pooling_parent_id_idx" ON "_aif_page_v_blocks_pooling" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_pooling_path_idx" ON "_aif_page_v_blocks_pooling" USING btree ("_path");
  CREATE INDEX "_aif_page_v_blocks_structure_parties_order_idx" ON "_aif_page_v_blocks_structure_parties" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_structure_parties_parent_id_idx" ON "_aif_page_v_blocks_structure_parties" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_structure_order_idx" ON "_aif_page_v_blocks_structure" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_structure_parent_id_idx" ON "_aif_page_v_blocks_structure" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_structure_path_idx" ON "_aif_page_v_blocks_structure" USING btree ("_path");
  CREATE INDEX "_aif_page_v_blocks_approach_wheel_steps_order_idx" ON "_aif_page_v_blocks_approach_wheel_steps" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_approach_wheel_steps_parent_id_idx" ON "_aif_page_v_blocks_approach_wheel_steps" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_approach_wheel_order_idx" ON "_aif_page_v_blocks_approach_wheel" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_approach_wheel_parent_id_idx" ON "_aif_page_v_blocks_approach_wheel" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_approach_wheel_path_idx" ON "_aif_page_v_blocks_approach_wheel" USING btree ("_path");
  CREATE INDEX "_aif_page_v_blocks_key_terms_terms_order_idx" ON "_aif_page_v_blocks_key_terms_terms" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_key_terms_terms_parent_id_idx" ON "_aif_page_v_blocks_key_terms_terms" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_key_terms_order_idx" ON "_aif_page_v_blocks_key_terms" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_key_terms_parent_id_idx" ON "_aif_page_v_blocks_key_terms" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_key_terms_path_idx" ON "_aif_page_v_blocks_key_terms" USING btree ("_path");
  CREATE INDEX "_aif_page_v_blocks_closing_doors_order_idx" ON "_aif_page_v_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_closing_doors_parent_id_idx" ON "_aif_page_v_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_closing_doors_path_idx" ON "_aif_page_v_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "_aif_page_v_blocks_faq_questions_order_idx" ON "_aif_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_faq_questions_parent_id_idx" ON "_aif_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_faq_order_idx" ON "_aif_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_faq_parent_id_idx" ON "_aif_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_faq_path_idx" ON "_aif_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_aif_page_v_blocks_text_order_idx" ON "_aif_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_aif_page_v_blocks_text_parent_id_idx" ON "_aif_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_aif_page_v_blocks_text_path_idx" ON "_aif_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_aif_page_v_version_version__status_idx" ON "_aif_page_v" USING btree ("version__status");
  CREATE INDEX "_aif_page_v_created_at_idx" ON "_aif_page_v" USING btree ("created_at");
  CREATE INDEX "_aif_page_v_updated_at_idx" ON "_aif_page_v" USING btree ("updated_at");
  CREATE INDEX "_aif_page_v_latest_idx" ON "_aif_page_v" USING btree ("latest");
  CREATE INDEX "_aif_page_v_autosave_idx" ON "_aif_page_v" USING btree ("autosave");
  CREATE INDEX "pms_vs_aif_page_blocks_product_hero_actions_order_idx" ON "pms_vs_aif_page_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_product_hero_actions_parent_id_idx" ON "pms_vs_aif_page_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_product_hero_figures_order_idx" ON "pms_vs_aif_page_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_product_hero_figures_parent_id_idx" ON "pms_vs_aif_page_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_product_hero_order_idx" ON "pms_vs_aif_page_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_product_hero_parent_id_idx" ON "pms_vs_aif_page_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_product_hero_path_idx" ON "pms_vs_aif_page_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "pms_vs_aif_page_blocks_comparison_rows_order_idx" ON "pms_vs_aif_page_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_comparison_rows_parent_id_idx" ON "pms_vs_aif_page_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_comparison_links_order_idx" ON "pms_vs_aif_page_blocks_comparison_links" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_comparison_links_parent_id_idx" ON "pms_vs_aif_page_blocks_comparison_links" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_comparison_order_idx" ON "pms_vs_aif_page_blocks_comparison" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_comparison_parent_id_idx" ON "pms_vs_aif_page_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_comparison_path_idx" ON "pms_vs_aif_page_blocks_comparison" USING btree ("_path");
  CREATE INDEX "pms_vs_aif_page_blocks_explanation_order_idx" ON "pms_vs_aif_page_blocks_explanation" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_explanation_parent_id_idx" ON "pms_vs_aif_page_blocks_explanation" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_explanation_path_idx" ON "pms_vs_aif_page_blocks_explanation" USING btree ("_path");
  CREATE INDEX "pms_vs_aif_page_blocks_closing_doors_order_idx" ON "pms_vs_aif_page_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_closing_doors_parent_id_idx" ON "pms_vs_aif_page_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_closing_doors_path_idx" ON "pms_vs_aif_page_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "pms_vs_aif_page_blocks_faq_questions_order_idx" ON "pms_vs_aif_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_faq_questions_parent_id_idx" ON "pms_vs_aif_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_faq_order_idx" ON "pms_vs_aif_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_faq_parent_id_idx" ON "pms_vs_aif_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_faq_path_idx" ON "pms_vs_aif_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "pms_vs_aif_page_blocks_text_order_idx" ON "pms_vs_aif_page_blocks_text" USING btree ("_order");
  CREATE INDEX "pms_vs_aif_page_blocks_text_parent_id_idx" ON "pms_vs_aif_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pms_vs_aif_page_blocks_text_path_idx" ON "pms_vs_aif_page_blocks_text" USING btree ("_path");
  CREATE INDEX "pms_vs_aif_page__status_idx" ON "pms_vs_aif_page" USING btree ("_status");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_product_hero_actions_order_idx" ON "_pms_vs_aif_page_v_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_product_hero_actions_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_product_hero_figures_order_idx" ON "_pms_vs_aif_page_v_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_product_hero_figures_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_product_hero_order_idx" ON "_pms_vs_aif_page_v_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_product_hero_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_product_hero_path_idx" ON "_pms_vs_aif_page_v_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_comparison_rows_order_idx" ON "_pms_vs_aif_page_v_blocks_comparison_rows" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_comparison_rows_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_comparison_links_order_idx" ON "_pms_vs_aif_page_v_blocks_comparison_links" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_comparison_links_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_comparison_links" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_comparison_order_idx" ON "_pms_vs_aif_page_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_comparison_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_comparison_path_idx" ON "_pms_vs_aif_page_v_blocks_comparison" USING btree ("_path");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_explanation_order_idx" ON "_pms_vs_aif_page_v_blocks_explanation" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_explanation_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_explanation" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_explanation_path_idx" ON "_pms_vs_aif_page_v_blocks_explanation" USING btree ("_path");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_closing_doors_order_idx" ON "_pms_vs_aif_page_v_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_closing_doors_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_closing_doors_path_idx" ON "_pms_vs_aif_page_v_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_faq_questions_order_idx" ON "_pms_vs_aif_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_faq_questions_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_faq_order_idx" ON "_pms_vs_aif_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_faq_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_faq_path_idx" ON "_pms_vs_aif_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_text_order_idx" ON "_pms_vs_aif_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_text_parent_id_idx" ON "_pms_vs_aif_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_pms_vs_aif_page_v_blocks_text_path_idx" ON "_pms_vs_aif_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_pms_vs_aif_page_v_version_version__status_idx" ON "_pms_vs_aif_page_v" USING btree ("version__status");
  CREATE INDEX "_pms_vs_aif_page_v_created_at_idx" ON "_pms_vs_aif_page_v" USING btree ("created_at");
  CREATE INDEX "_pms_vs_aif_page_v_updated_at_idx" ON "_pms_vs_aif_page_v" USING btree ("updated_at");
  CREATE INDEX "_pms_vs_aif_page_v_latest_idx" ON "_pms_vs_aif_page_v" USING btree ("latest");
  CREATE INDEX "_pms_vs_aif_page_v_autosave_idx" ON "_pms_vs_aif_page_v" USING btree ("autosave");
  CREATE INDEX "our_philosophy_page_blocks_product_hero_actions_order_idx" ON "our_philosophy_page_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_product_hero_actions_parent_id_idx" ON "our_philosophy_page_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_product_hero_figures_order_idx" ON "our_philosophy_page_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_product_hero_figures_parent_id_idx" ON "our_philosophy_page_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_product_hero_order_idx" ON "our_philosophy_page_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_product_hero_parent_id_idx" ON "our_philosophy_page_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_product_hero_path_idx" ON "our_philosophy_page_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "our_philosophy_page_blocks_core_discs_stages_order_idx" ON "our_philosophy_page_blocks_core_discs_stages" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_core_discs_stages_parent_id_idx" ON "our_philosophy_page_blocks_core_discs_stages" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_core_discs_order_idx" ON "our_philosophy_page_blocks_core_discs" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_core_discs_parent_id_idx" ON "our_philosophy_page_blocks_core_discs" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_core_discs_path_idx" ON "our_philosophy_page_blocks_core_discs" USING btree ("_path");
  CREATE INDEX "our_philosophy_page_blocks_principles_principles_order_idx" ON "our_philosophy_page_blocks_principles_principles" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_principles_principles_parent_id_idx" ON "our_philosophy_page_blocks_principles_principles" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_principles_order_idx" ON "our_philosophy_page_blocks_principles" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_principles_parent_id_idx" ON "our_philosophy_page_blocks_principles" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_principles_path_idx" ON "our_philosophy_page_blocks_principles" USING btree ("_path");
  CREATE INDEX "our_philosophy_page_blocks_criteria_look_for_order_idx" ON "our_philosophy_page_blocks_criteria_look_for" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_criteria_look_for_parent_id_idx" ON "our_philosophy_page_blocks_criteria_look_for" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_criteria_dont_do_order_idx" ON "our_philosophy_page_blocks_criteria_dont_do" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_criteria_dont_do_parent_id_idx" ON "our_philosophy_page_blocks_criteria_dont_do" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_criteria_order_idx" ON "our_philosophy_page_blocks_criteria" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_criteria_parent_id_idx" ON "our_philosophy_page_blocks_criteria" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_criteria_path_idx" ON "our_philosophy_page_blocks_criteria" USING btree ("_path");
  CREATE INDEX "our_philosophy_page_blocks_risk_rings_risks_order_idx" ON "our_philosophy_page_blocks_risk_rings_risks" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_risk_rings_risks_parent_id_idx" ON "our_philosophy_page_blocks_risk_rings_risks" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_risk_rings_order_idx" ON "our_philosophy_page_blocks_risk_rings" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_risk_rings_parent_id_idx" ON "our_philosophy_page_blocks_risk_rings" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_risk_rings_path_idx" ON "our_philosophy_page_blocks_risk_rings" USING btree ("_path");
  CREATE INDEX "our_philosophy_page_blocks_closing_doors_order_idx" ON "our_philosophy_page_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_closing_doors_parent_id_idx" ON "our_philosophy_page_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_closing_doors_path_idx" ON "our_philosophy_page_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "our_philosophy_page_blocks_faq_questions_order_idx" ON "our_philosophy_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_faq_questions_parent_id_idx" ON "our_philosophy_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_faq_order_idx" ON "our_philosophy_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_faq_parent_id_idx" ON "our_philosophy_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_faq_path_idx" ON "our_philosophy_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "our_philosophy_page_blocks_text_order_idx" ON "our_philosophy_page_blocks_text" USING btree ("_order");
  CREATE INDEX "our_philosophy_page_blocks_text_parent_id_idx" ON "our_philosophy_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "our_philosophy_page_blocks_text_path_idx" ON "our_philosophy_page_blocks_text" USING btree ("_path");
  CREATE INDEX "our_philosophy_page__status_idx" ON "our_philosophy_page" USING btree ("_status");
  CREATE INDEX "_our_philosophy_page_v_blocks_product_hero_actions_order_idx" ON "_our_philosophy_page_v_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_product_hero_actions_parent_id_idx" ON "_our_philosophy_page_v_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_product_hero_figures_order_idx" ON "_our_philosophy_page_v_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_product_hero_figures_parent_id_idx" ON "_our_philosophy_page_v_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_product_hero_order_idx" ON "_our_philosophy_page_v_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_product_hero_parent_id_idx" ON "_our_philosophy_page_v_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_product_hero_path_idx" ON "_our_philosophy_page_v_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "_our_philosophy_page_v_blocks_core_discs_stages_order_idx" ON "_our_philosophy_page_v_blocks_core_discs_stages" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_core_discs_stages_parent_id_idx" ON "_our_philosophy_page_v_blocks_core_discs_stages" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_core_discs_order_idx" ON "_our_philosophy_page_v_blocks_core_discs" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_core_discs_parent_id_idx" ON "_our_philosophy_page_v_blocks_core_discs" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_core_discs_path_idx" ON "_our_philosophy_page_v_blocks_core_discs" USING btree ("_path");
  CREATE INDEX "_our_philosophy_page_v_blocks_principles_principles_order_idx" ON "_our_philosophy_page_v_blocks_principles_principles" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_principles_principles_parent_id_idx" ON "_our_philosophy_page_v_blocks_principles_principles" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_principles_order_idx" ON "_our_philosophy_page_v_blocks_principles" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_principles_parent_id_idx" ON "_our_philosophy_page_v_blocks_principles" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_principles_path_idx" ON "_our_philosophy_page_v_blocks_principles" USING btree ("_path");
  CREATE INDEX "_our_philosophy_page_v_blocks_criteria_look_for_order_idx" ON "_our_philosophy_page_v_blocks_criteria_look_for" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_criteria_look_for_parent_id_idx" ON "_our_philosophy_page_v_blocks_criteria_look_for" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_criteria_dont_do_order_idx" ON "_our_philosophy_page_v_blocks_criteria_dont_do" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_criteria_dont_do_parent_id_idx" ON "_our_philosophy_page_v_blocks_criteria_dont_do" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_criteria_order_idx" ON "_our_philosophy_page_v_blocks_criteria" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_criteria_parent_id_idx" ON "_our_philosophy_page_v_blocks_criteria" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_criteria_path_idx" ON "_our_philosophy_page_v_blocks_criteria" USING btree ("_path");
  CREATE INDEX "_our_philosophy_page_v_blocks_risk_rings_risks_order_idx" ON "_our_philosophy_page_v_blocks_risk_rings_risks" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_risk_rings_risks_parent_id_idx" ON "_our_philosophy_page_v_blocks_risk_rings_risks" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_risk_rings_order_idx" ON "_our_philosophy_page_v_blocks_risk_rings" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_risk_rings_parent_id_idx" ON "_our_philosophy_page_v_blocks_risk_rings" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_risk_rings_path_idx" ON "_our_philosophy_page_v_blocks_risk_rings" USING btree ("_path");
  CREATE INDEX "_our_philosophy_page_v_blocks_closing_doors_order_idx" ON "_our_philosophy_page_v_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_closing_doors_parent_id_idx" ON "_our_philosophy_page_v_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_closing_doors_path_idx" ON "_our_philosophy_page_v_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "_our_philosophy_page_v_blocks_faq_questions_order_idx" ON "_our_philosophy_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_faq_questions_parent_id_idx" ON "_our_philosophy_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_faq_order_idx" ON "_our_philosophy_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_faq_parent_id_idx" ON "_our_philosophy_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_faq_path_idx" ON "_our_philosophy_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_our_philosophy_page_v_blocks_text_order_idx" ON "_our_philosophy_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_our_philosophy_page_v_blocks_text_parent_id_idx" ON "_our_philosophy_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_our_philosophy_page_v_blocks_text_path_idx" ON "_our_philosophy_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_our_philosophy_page_v_version_version__status_idx" ON "_our_philosophy_page_v" USING btree ("version__status");
  CREATE INDEX "_our_philosophy_page_v_created_at_idx" ON "_our_philosophy_page_v" USING btree ("created_at");
  CREATE INDEX "_our_philosophy_page_v_updated_at_idx" ON "_our_philosophy_page_v" USING btree ("updated_at");
  CREATE INDEX "_our_philosophy_page_v_latest_idx" ON "_our_philosophy_page_v" USING btree ("latest");
  CREATE INDEX "_our_philosophy_page_v_autosave_idx" ON "_our_philosophy_page_v" USING btree ("autosave");
  CREATE INDEX "case_studies_page_blocks_product_hero_actions_order_idx" ON "case_studies_page_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "case_studies_page_blocks_product_hero_actions_parent_id_idx" ON "case_studies_page_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_blocks_product_hero_figures_order_idx" ON "case_studies_page_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "case_studies_page_blocks_product_hero_figures_parent_id_idx" ON "case_studies_page_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_blocks_product_hero_order_idx" ON "case_studies_page_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "case_studies_page_blocks_product_hero_parent_id_idx" ON "case_studies_page_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_blocks_product_hero_path_idx" ON "case_studies_page_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "case_studies_page_blocks_case_studies_order_idx" ON "case_studies_page_blocks_case_studies" USING btree ("_order");
  CREATE INDEX "case_studies_page_blocks_case_studies_parent_id_idx" ON "case_studies_page_blocks_case_studies" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_blocks_case_studies_path_idx" ON "case_studies_page_blocks_case_studies" USING btree ("_path");
  CREATE INDEX "case_studies_page_blocks_case_timeline_order_idx" ON "case_studies_page_blocks_case_timeline" USING btree ("_order");
  CREATE INDEX "case_studies_page_blocks_case_timeline_parent_id_idx" ON "case_studies_page_blocks_case_timeline" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_blocks_case_timeline_path_idx" ON "case_studies_page_blocks_case_timeline" USING btree ("_path");
  CREATE INDEX "case_studies_page_blocks_closing_doors_order_idx" ON "case_studies_page_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "case_studies_page_blocks_closing_doors_parent_id_idx" ON "case_studies_page_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_blocks_closing_doors_path_idx" ON "case_studies_page_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "case_studies_page_blocks_faq_questions_order_idx" ON "case_studies_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "case_studies_page_blocks_faq_questions_parent_id_idx" ON "case_studies_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_blocks_faq_order_idx" ON "case_studies_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "case_studies_page_blocks_faq_parent_id_idx" ON "case_studies_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_blocks_faq_path_idx" ON "case_studies_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "case_studies_page_blocks_text_order_idx" ON "case_studies_page_blocks_text" USING btree ("_order");
  CREATE INDEX "case_studies_page_blocks_text_parent_id_idx" ON "case_studies_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_blocks_text_path_idx" ON "case_studies_page_blocks_text" USING btree ("_path");
  CREATE INDEX "case_studies_page__status_idx" ON "case_studies_page" USING btree ("_status");
  CREATE INDEX "_case_studies_page_v_blocks_product_hero_actions_order_idx" ON "_case_studies_page_v_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_blocks_product_hero_actions_parent_id_idx" ON "_case_studies_page_v_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_blocks_product_hero_figures_order_idx" ON "_case_studies_page_v_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_blocks_product_hero_figures_parent_id_idx" ON "_case_studies_page_v_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_blocks_product_hero_order_idx" ON "_case_studies_page_v_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_blocks_product_hero_parent_id_idx" ON "_case_studies_page_v_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_blocks_product_hero_path_idx" ON "_case_studies_page_v_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "_case_studies_page_v_blocks_case_studies_order_idx" ON "_case_studies_page_v_blocks_case_studies" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_blocks_case_studies_parent_id_idx" ON "_case_studies_page_v_blocks_case_studies" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_blocks_case_studies_path_idx" ON "_case_studies_page_v_blocks_case_studies" USING btree ("_path");
  CREATE INDEX "_case_studies_page_v_blocks_case_timeline_order_idx" ON "_case_studies_page_v_blocks_case_timeline" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_blocks_case_timeline_parent_id_idx" ON "_case_studies_page_v_blocks_case_timeline" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_blocks_case_timeline_path_idx" ON "_case_studies_page_v_blocks_case_timeline" USING btree ("_path");
  CREATE INDEX "_case_studies_page_v_blocks_closing_doors_order_idx" ON "_case_studies_page_v_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_blocks_closing_doors_parent_id_idx" ON "_case_studies_page_v_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_blocks_closing_doors_path_idx" ON "_case_studies_page_v_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "_case_studies_page_v_blocks_faq_questions_order_idx" ON "_case_studies_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_blocks_faq_questions_parent_id_idx" ON "_case_studies_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_blocks_faq_order_idx" ON "_case_studies_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_blocks_faq_parent_id_idx" ON "_case_studies_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_blocks_faq_path_idx" ON "_case_studies_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_case_studies_page_v_blocks_text_order_idx" ON "_case_studies_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_blocks_text_parent_id_idx" ON "_case_studies_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_blocks_text_path_idx" ON "_case_studies_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_case_studies_page_v_version_version__status_idx" ON "_case_studies_page_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_page_v_created_at_idx" ON "_case_studies_page_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_page_v_updated_at_idx" ON "_case_studies_page_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_page_v_latest_idx" ON "_case_studies_page_v" USING btree ("latest");
  CREATE INDEX "_case_studies_page_v_autosave_idx" ON "_case_studies_page_v" USING btree ("autosave");
  CREATE INDEX "picks_page_blocks_product_hero_actions_order_idx" ON "picks_page_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_product_hero_actions_parent_id_idx" ON "picks_page_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_product_hero_figures_order_idx" ON "picks_page_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_product_hero_figures_parent_id_idx" ON "picks_page_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_product_hero_order_idx" ON "picks_page_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_product_hero_parent_id_idx" ON "picks_page_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_product_hero_path_idx" ON "picks_page_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "picks_page_blocks_picks_tiers_picks_financials_order_idx" ON "picks_page_blocks_picks_tiers_picks_financials" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_picks_tiers_picks_financials_parent_id_idx" ON "picks_page_blocks_picks_tiers_picks_financials" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_picks_tiers_picks_order_idx" ON "picks_page_blocks_picks_tiers_picks" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_picks_tiers_picks_parent_id_idx" ON "picks_page_blocks_picks_tiers_picks" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_picks_tiers_order_idx" ON "picks_page_blocks_picks_tiers" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_picks_tiers_parent_id_idx" ON "picks_page_blocks_picks_tiers" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_picks_order_idx" ON "picks_page_blocks_picks" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_picks_parent_id_idx" ON "picks_page_blocks_picks" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_picks_path_idx" ON "picks_page_blocks_picks" USING btree ("_path");
  CREATE INDEX "picks_page_blocks_closing_doors_order_idx" ON "picks_page_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_closing_doors_parent_id_idx" ON "picks_page_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_closing_doors_path_idx" ON "picks_page_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "picks_page_blocks_faq_questions_order_idx" ON "picks_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_faq_questions_parent_id_idx" ON "picks_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_faq_order_idx" ON "picks_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_faq_parent_id_idx" ON "picks_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_faq_path_idx" ON "picks_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "picks_page_blocks_text_order_idx" ON "picks_page_blocks_text" USING btree ("_order");
  CREATE INDEX "picks_page_blocks_text_parent_id_idx" ON "picks_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "picks_page_blocks_text_path_idx" ON "picks_page_blocks_text" USING btree ("_path");
  CREATE INDEX "picks_page__status_idx" ON "picks_page" USING btree ("_status");
  CREATE INDEX "_picks_page_v_blocks_product_hero_actions_order_idx" ON "_picks_page_v_blocks_product_hero_actions" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_product_hero_actions_parent_id_idx" ON "_picks_page_v_blocks_product_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_product_hero_figures_order_idx" ON "_picks_page_v_blocks_product_hero_figures" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_product_hero_figures_parent_id_idx" ON "_picks_page_v_blocks_product_hero_figures" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_product_hero_order_idx" ON "_picks_page_v_blocks_product_hero" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_product_hero_parent_id_idx" ON "_picks_page_v_blocks_product_hero" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_product_hero_path_idx" ON "_picks_page_v_blocks_product_hero" USING btree ("_path");
  CREATE INDEX "_picks_page_v_blocks_picks_tiers_picks_financials_order_idx" ON "_picks_page_v_blocks_picks_tiers_picks_financials" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_picks_tiers_picks_financials_parent_id_idx" ON "_picks_page_v_blocks_picks_tiers_picks_financials" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_picks_tiers_picks_order_idx" ON "_picks_page_v_blocks_picks_tiers_picks" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_picks_tiers_picks_parent_id_idx" ON "_picks_page_v_blocks_picks_tiers_picks" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_picks_tiers_order_idx" ON "_picks_page_v_blocks_picks_tiers" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_picks_tiers_parent_id_idx" ON "_picks_page_v_blocks_picks_tiers" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_picks_order_idx" ON "_picks_page_v_blocks_picks" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_picks_parent_id_idx" ON "_picks_page_v_blocks_picks" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_picks_path_idx" ON "_picks_page_v_blocks_picks" USING btree ("_path");
  CREATE INDEX "_picks_page_v_blocks_closing_doors_order_idx" ON "_picks_page_v_blocks_closing_doors" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_closing_doors_parent_id_idx" ON "_picks_page_v_blocks_closing_doors" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_closing_doors_path_idx" ON "_picks_page_v_blocks_closing_doors" USING btree ("_path");
  CREATE INDEX "_picks_page_v_blocks_faq_questions_order_idx" ON "_picks_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_faq_questions_parent_id_idx" ON "_picks_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_faq_order_idx" ON "_picks_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_faq_parent_id_idx" ON "_picks_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_faq_path_idx" ON "_picks_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_picks_page_v_blocks_text_order_idx" ON "_picks_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_picks_page_v_blocks_text_parent_id_idx" ON "_picks_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_picks_page_v_blocks_text_path_idx" ON "_picks_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_picks_page_v_version_version__status_idx" ON "_picks_page_v" USING btree ("version__status");
  CREATE INDEX "_picks_page_v_created_at_idx" ON "_picks_page_v" USING btree ("created_at");
  CREATE INDEX "_picks_page_v_updated_at_idx" ON "_picks_page_v" USING btree ("updated_at");
  CREATE INDEX "_picks_page_v_latest_idx" ON "_picks_page_v" USING btree ("latest");
  CREATE INDEX "_picks_page_v_autosave_idx" ON "_picks_page_v" USING btree ("autosave");
  CREATE INDEX "careers_page_blocks_careers_intro_order_idx" ON "careers_page_blocks_careers_intro" USING btree ("_order");
  CREATE INDEX "careers_page_blocks_careers_intro_parent_id_idx" ON "careers_page_blocks_careers_intro" USING btree ("_parent_id");
  CREATE INDEX "careers_page_blocks_careers_intro_path_idx" ON "careers_page_blocks_careers_intro" USING btree ("_path");
  CREATE INDEX "careers_page_blocks_job_board_order_idx" ON "careers_page_blocks_job_board" USING btree ("_order");
  CREATE INDEX "careers_page_blocks_job_board_parent_id_idx" ON "careers_page_blocks_job_board" USING btree ("_parent_id");
  CREATE INDEX "careers_page_blocks_job_board_path_idx" ON "careers_page_blocks_job_board" USING btree ("_path");
  CREATE INDEX "careers_page_blocks_careers_office_order_idx" ON "careers_page_blocks_careers_office" USING btree ("_order");
  CREATE INDEX "careers_page_blocks_careers_office_parent_id_idx" ON "careers_page_blocks_careers_office" USING btree ("_parent_id");
  CREATE INDEX "careers_page_blocks_careers_office_path_idx" ON "careers_page_blocks_careers_office" USING btree ("_path");
  CREATE INDEX "careers_page_blocks_careers_office_photo_idx" ON "careers_page_blocks_careers_office" USING btree ("photo_id");
  CREATE INDEX "careers_page_blocks_careers_resume_order_idx" ON "careers_page_blocks_careers_resume" USING btree ("_order");
  CREATE INDEX "careers_page_blocks_careers_resume_parent_id_idx" ON "careers_page_blocks_careers_resume" USING btree ("_parent_id");
  CREATE INDEX "careers_page_blocks_careers_resume_path_idx" ON "careers_page_blocks_careers_resume" USING btree ("_path");
  CREATE INDEX "careers_page_blocks_faq_questions_order_idx" ON "careers_page_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "careers_page_blocks_faq_questions_parent_id_idx" ON "careers_page_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "careers_page_blocks_faq_order_idx" ON "careers_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "careers_page_blocks_faq_parent_id_idx" ON "careers_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "careers_page_blocks_faq_path_idx" ON "careers_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "careers_page_blocks_text_order_idx" ON "careers_page_blocks_text" USING btree ("_order");
  CREATE INDEX "careers_page_blocks_text_parent_id_idx" ON "careers_page_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "careers_page_blocks_text_path_idx" ON "careers_page_blocks_text" USING btree ("_path");
  CREATE INDEX "careers_page__status_idx" ON "careers_page" USING btree ("_status");
  CREATE INDEX "_careers_page_v_blocks_careers_intro_order_idx" ON "_careers_page_v_blocks_careers_intro" USING btree ("_order");
  CREATE INDEX "_careers_page_v_blocks_careers_intro_parent_id_idx" ON "_careers_page_v_blocks_careers_intro" USING btree ("_parent_id");
  CREATE INDEX "_careers_page_v_blocks_careers_intro_path_idx" ON "_careers_page_v_blocks_careers_intro" USING btree ("_path");
  CREATE INDEX "_careers_page_v_blocks_job_board_order_idx" ON "_careers_page_v_blocks_job_board" USING btree ("_order");
  CREATE INDEX "_careers_page_v_blocks_job_board_parent_id_idx" ON "_careers_page_v_blocks_job_board" USING btree ("_parent_id");
  CREATE INDEX "_careers_page_v_blocks_job_board_path_idx" ON "_careers_page_v_blocks_job_board" USING btree ("_path");
  CREATE INDEX "_careers_page_v_blocks_careers_office_order_idx" ON "_careers_page_v_blocks_careers_office" USING btree ("_order");
  CREATE INDEX "_careers_page_v_blocks_careers_office_parent_id_idx" ON "_careers_page_v_blocks_careers_office" USING btree ("_parent_id");
  CREATE INDEX "_careers_page_v_blocks_careers_office_path_idx" ON "_careers_page_v_blocks_careers_office" USING btree ("_path");
  CREATE INDEX "_careers_page_v_blocks_careers_office_photo_idx" ON "_careers_page_v_blocks_careers_office" USING btree ("photo_id");
  CREATE INDEX "_careers_page_v_blocks_careers_resume_order_idx" ON "_careers_page_v_blocks_careers_resume" USING btree ("_order");
  CREATE INDEX "_careers_page_v_blocks_careers_resume_parent_id_idx" ON "_careers_page_v_blocks_careers_resume" USING btree ("_parent_id");
  CREATE INDEX "_careers_page_v_blocks_careers_resume_path_idx" ON "_careers_page_v_blocks_careers_resume" USING btree ("_path");
  CREATE INDEX "_careers_page_v_blocks_faq_questions_order_idx" ON "_careers_page_v_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "_careers_page_v_blocks_faq_questions_parent_id_idx" ON "_careers_page_v_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "_careers_page_v_blocks_faq_order_idx" ON "_careers_page_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_careers_page_v_blocks_faq_parent_id_idx" ON "_careers_page_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_careers_page_v_blocks_faq_path_idx" ON "_careers_page_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_careers_page_v_blocks_text_order_idx" ON "_careers_page_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_careers_page_v_blocks_text_parent_id_idx" ON "_careers_page_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_careers_page_v_blocks_text_path_idx" ON "_careers_page_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_careers_page_v_version_version__status_idx" ON "_careers_page_v" USING btree ("version__status");
  CREATE INDEX "_careers_page_v_created_at_idx" ON "_careers_page_v" USING btree ("created_at");
  CREATE INDEX "_careers_page_v_updated_at_idx" ON "_careers_page_v" USING btree ("updated_at");
  CREATE INDEX "_careers_page_v_latest_idx" ON "_careers_page_v" USING btree ("latest");
  CREATE INDEX "_careers_page_v_autosave_idx" ON "_careers_page_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_openings_fk" FOREIGN KEY ("openings_id") REFERENCES "public"."openings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_openings_id_idx" ON "payload_locked_documents_rels" USING btree ("openings_id");`)

  const context = { skipRevalidate: true }
  // The content plan's three case studies, in order, each keeping its anchor on the page.
  for (const study of CASE_STUDIES) {
    await payload.create({
      collection: 'case-studies',
      data: {
        name: study.name,
        mark: study.mark,
        drawing: study.drawing,
        business: study.business,
        edge: study.edge,
        growth: study.growth,
        financials: study.financials.map(({ year, revenue, ebidta, pat }) => ({ year, revenue, ebitda: ebidta, pat })),
        anchor: study.id,
      },
      req,
      context,
    })
  }
  // The eight sample roles, marked Sample so the page keeps saying they are not live vacancies.
  for (const role of CAREER_ROLES) {
    await payload.create({
      collection: 'openings',
      data: {
        title: role.title,
        status: role.status,
        team: role.team,
        location: role.location,
        employment: role.employment,
        summary: role.summary,
        responsibilities: role.responsibilities.map((line) => ({ line })),
        anchor: role.id,
      },
      req,
      context,
    })
  }
  // Today's pages, published, so they read the same on the day this ships.
  await payload.updateGlobal({ slug: 'our-philosophy-page', data: { sections: [...PHILOSOPHY_SECTIONS], _status: 'published' }, req, context })
  await payload.updateGlobal({ slug: 'pms-vs-aif-page', data: { sections: [...COMPARE_SECTIONS], _status: 'published' }, req, context })
  await payload.updateGlobal({ slug: 'aif-page', data: { sections: [...AIF_SECTIONS], _status: 'published' }, req, context })
  await payload.updateGlobal({ slug: 'case-studies-page', data: { sections: [...CASE_STUDIES_SECTIONS], _status: 'published' }, req, context })
  await payload.updateGlobal({ slug: 'picks-page', data: { sections: [...PICKS_SECTIONS], _status: 'published' }, req, context })
  await payload.updateGlobal({ slug: 'careers-page', data: { sections: [...CAREERS_SECTIONS], _status: 'published' }, req, context })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "case_studies_financials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "openings_responsibilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "openings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_aif_performance" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_opportunity_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_opportunity" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_pooling" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_structure_parties" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_structure" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_approach_wheel_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_approach_wheel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_key_terms_terms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_key_terms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "aif_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_aif_performance" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_opportunity_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_opportunity" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_pooling" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_structure_parties" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_structure" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_approach_wheel_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_approach_wheel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_key_terms_terms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_key_terms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_aif_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_comparison_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_comparison_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_comparison" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_explanation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pms_vs_aif_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_comparison_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_comparison_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_comparison" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_explanation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pms_vs_aif_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_core_discs_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_core_discs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_principles_principles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_principles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_criteria_look_for" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_criteria_dont_do" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_criteria" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_risk_rings_risks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_risk_rings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_philosophy_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_core_discs_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_core_discs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_principles_principles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_principles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_criteria_look_for" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_criteria_dont_do" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_criteria" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_risk_rings_risks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_risk_rings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_philosophy_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_blocks_case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_blocks_case_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_blocks_case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_blocks_case_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_picks_tiers_picks_financials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_picks_tiers_picks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_picks_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_picks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "picks_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_product_hero_actions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_product_hero_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_product_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_picks_tiers_picks_financials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_picks_tiers_picks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_picks_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_picks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_closing_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_picks_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_page_blocks_careers_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_page_blocks_job_board" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_page_blocks_careers_office" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_page_blocks_careers_resume" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_page_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_page_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_page_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_careers_page_v_blocks_careers_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_careers_page_v_blocks_job_board" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_careers_page_v_blocks_careers_office" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_careers_page_v_blocks_careers_resume" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_careers_page_v_blocks_faq_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_careers_page_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_careers_page_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_careers_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "case_studies_financials" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "openings_responsibilities" CASCADE;
  DROP TABLE "openings" CASCADE;
  DROP TABLE "aif_page_blocks_product_hero_actions" CASCADE;
  DROP TABLE "aif_page_blocks_product_hero_figures" CASCADE;
  DROP TABLE "aif_page_blocks_product_hero" CASCADE;
  DROP TABLE "aif_page_blocks_aif_performance" CASCADE;
  DROP TABLE "aif_page_blocks_opportunity_steps" CASCADE;
  DROP TABLE "aif_page_blocks_opportunity" CASCADE;
  DROP TABLE "aif_page_blocks_pooling" CASCADE;
  DROP TABLE "aif_page_blocks_structure_parties" CASCADE;
  DROP TABLE "aif_page_blocks_structure" CASCADE;
  DROP TABLE "aif_page_blocks_approach_wheel_steps" CASCADE;
  DROP TABLE "aif_page_blocks_approach_wheel" CASCADE;
  DROP TABLE "aif_page_blocks_key_terms_terms" CASCADE;
  DROP TABLE "aif_page_blocks_key_terms" CASCADE;
  DROP TABLE "aif_page_blocks_closing_doors" CASCADE;
  DROP TABLE "aif_page_blocks_faq_questions" CASCADE;
  DROP TABLE "aif_page_blocks_faq" CASCADE;
  DROP TABLE "aif_page_blocks_text" CASCADE;
  DROP TABLE "aif_page" CASCADE;
  DROP TABLE "_aif_page_v_blocks_product_hero_actions" CASCADE;
  DROP TABLE "_aif_page_v_blocks_product_hero_figures" CASCADE;
  DROP TABLE "_aif_page_v_blocks_product_hero" CASCADE;
  DROP TABLE "_aif_page_v_blocks_aif_performance" CASCADE;
  DROP TABLE "_aif_page_v_blocks_opportunity_steps" CASCADE;
  DROP TABLE "_aif_page_v_blocks_opportunity" CASCADE;
  DROP TABLE "_aif_page_v_blocks_pooling" CASCADE;
  DROP TABLE "_aif_page_v_blocks_structure_parties" CASCADE;
  DROP TABLE "_aif_page_v_blocks_structure" CASCADE;
  DROP TABLE "_aif_page_v_blocks_approach_wheel_steps" CASCADE;
  DROP TABLE "_aif_page_v_blocks_approach_wheel" CASCADE;
  DROP TABLE "_aif_page_v_blocks_key_terms_terms" CASCADE;
  DROP TABLE "_aif_page_v_blocks_key_terms" CASCADE;
  DROP TABLE "_aif_page_v_blocks_closing_doors" CASCADE;
  DROP TABLE "_aif_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_aif_page_v_blocks_faq" CASCADE;
  DROP TABLE "_aif_page_v_blocks_text" CASCADE;
  DROP TABLE "_aif_page_v" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_product_hero_actions" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_product_hero_figures" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_product_hero" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_comparison_rows" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_comparison_links" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_comparison" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_explanation" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_closing_doors" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_faq_questions" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_faq" CASCADE;
  DROP TABLE "pms_vs_aif_page_blocks_text" CASCADE;
  DROP TABLE "pms_vs_aif_page" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_product_hero_actions" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_product_hero_figures" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_product_hero" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_comparison_rows" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_comparison_links" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_comparison" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_explanation" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_closing_doors" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_faq" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v_blocks_text" CASCADE;
  DROP TABLE "_pms_vs_aif_page_v" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_product_hero_actions" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_product_hero_figures" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_product_hero" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_core_discs_stages" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_core_discs" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_principles_principles" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_principles" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_criteria_look_for" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_criteria_dont_do" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_criteria" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_risk_rings_risks" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_risk_rings" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_closing_doors" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_faq_questions" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_faq" CASCADE;
  DROP TABLE "our_philosophy_page_blocks_text" CASCADE;
  DROP TABLE "our_philosophy_page" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_product_hero_actions" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_product_hero_figures" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_product_hero" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_core_discs_stages" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_core_discs" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_principles_principles" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_principles" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_criteria_look_for" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_criteria_dont_do" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_criteria" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_risk_rings_risks" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_risk_rings" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_closing_doors" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_faq" CASCADE;
  DROP TABLE "_our_philosophy_page_v_blocks_text" CASCADE;
  DROP TABLE "_our_philosophy_page_v" CASCADE;
  DROP TABLE "case_studies_page_blocks_product_hero_actions" CASCADE;
  DROP TABLE "case_studies_page_blocks_product_hero_figures" CASCADE;
  DROP TABLE "case_studies_page_blocks_product_hero" CASCADE;
  DROP TABLE "case_studies_page_blocks_case_studies" CASCADE;
  DROP TABLE "case_studies_page_blocks_case_timeline" CASCADE;
  DROP TABLE "case_studies_page_blocks_closing_doors" CASCADE;
  DROP TABLE "case_studies_page_blocks_faq_questions" CASCADE;
  DROP TABLE "case_studies_page_blocks_faq" CASCADE;
  DROP TABLE "case_studies_page_blocks_text" CASCADE;
  DROP TABLE "case_studies_page" CASCADE;
  DROP TABLE "_case_studies_page_v_blocks_product_hero_actions" CASCADE;
  DROP TABLE "_case_studies_page_v_blocks_product_hero_figures" CASCADE;
  DROP TABLE "_case_studies_page_v_blocks_product_hero" CASCADE;
  DROP TABLE "_case_studies_page_v_blocks_case_studies" CASCADE;
  DROP TABLE "_case_studies_page_v_blocks_case_timeline" CASCADE;
  DROP TABLE "_case_studies_page_v_blocks_closing_doors" CASCADE;
  DROP TABLE "_case_studies_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_case_studies_page_v_blocks_faq" CASCADE;
  DROP TABLE "_case_studies_page_v_blocks_text" CASCADE;
  DROP TABLE "_case_studies_page_v" CASCADE;
  DROP TABLE "picks_page_blocks_product_hero_actions" CASCADE;
  DROP TABLE "picks_page_blocks_product_hero_figures" CASCADE;
  DROP TABLE "picks_page_blocks_product_hero" CASCADE;
  DROP TABLE "picks_page_blocks_picks_tiers_picks_financials" CASCADE;
  DROP TABLE "picks_page_blocks_picks_tiers_picks" CASCADE;
  DROP TABLE "picks_page_blocks_picks_tiers" CASCADE;
  DROP TABLE "picks_page_blocks_picks" CASCADE;
  DROP TABLE "picks_page_blocks_closing_doors" CASCADE;
  DROP TABLE "picks_page_blocks_faq_questions" CASCADE;
  DROP TABLE "picks_page_blocks_faq" CASCADE;
  DROP TABLE "picks_page_blocks_text" CASCADE;
  DROP TABLE "picks_page" CASCADE;
  DROP TABLE "_picks_page_v_blocks_product_hero_actions" CASCADE;
  DROP TABLE "_picks_page_v_blocks_product_hero_figures" CASCADE;
  DROP TABLE "_picks_page_v_blocks_product_hero" CASCADE;
  DROP TABLE "_picks_page_v_blocks_picks_tiers_picks_financials" CASCADE;
  DROP TABLE "_picks_page_v_blocks_picks_tiers_picks" CASCADE;
  DROP TABLE "_picks_page_v_blocks_picks_tiers" CASCADE;
  DROP TABLE "_picks_page_v_blocks_picks" CASCADE;
  DROP TABLE "_picks_page_v_blocks_closing_doors" CASCADE;
  DROP TABLE "_picks_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_picks_page_v_blocks_faq" CASCADE;
  DROP TABLE "_picks_page_v_blocks_text" CASCADE;
  DROP TABLE "_picks_page_v" CASCADE;
  DROP TABLE "careers_page_blocks_careers_intro" CASCADE;
  DROP TABLE "careers_page_blocks_job_board" CASCADE;
  DROP TABLE "careers_page_blocks_careers_office" CASCADE;
  DROP TABLE "careers_page_blocks_careers_resume" CASCADE;
  DROP TABLE "careers_page_blocks_faq_questions" CASCADE;
  DROP TABLE "careers_page_blocks_faq" CASCADE;
  DROP TABLE "careers_page_blocks_text" CASCADE;
  DROP TABLE "careers_page" CASCADE;
  DROP TABLE "_careers_page_v_blocks_careers_intro" CASCADE;
  DROP TABLE "_careers_page_v_blocks_job_board" CASCADE;
  DROP TABLE "_careers_page_v_blocks_careers_office" CASCADE;
  DROP TABLE "_careers_page_v_blocks_careers_resume" CASCADE;
  DROP TABLE "_careers_page_v_blocks_faq_questions" CASCADE;
  DROP TABLE "_careers_page_v_blocks_faq" CASCADE;
  DROP TABLE "_careers_page_v_blocks_text" CASCADE;
  DROP TABLE "_careers_page_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_studies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_openings_fk";
  
  DROP INDEX "payload_locked_documents_rels_case_studies_id_idx";
  DROP INDEX "payload_locked_documents_rels_openings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "openings_id";
  DROP TYPE "public"."enum_case_studies_drawing";
  DROP TYPE "public"."enum_openings_status";
  DROP TYPE "public"."enum_openings_team";
  DROP TYPE "public"."enum_aif_page_blocks_product_hero_mark";
  DROP TYPE "public"."enum_aif_page_blocks_key_terms_terms_drawing";
  DROP TYPE "public"."enum_aif_page_status";
  DROP TYPE "public"."enum__aif_page_v_blocks_product_hero_mark";
  DROP TYPE "public"."enum__aif_page_v_blocks_key_terms_terms_drawing";
  DROP TYPE "public"."enum__aif_page_v_version_status";
  DROP TYPE "public"."enum_pms_vs_aif_page_blocks_product_hero_mark";
  DROP TYPE "public"."enum_pms_vs_aif_page_blocks_comparison_rows_drawing";
  DROP TYPE "public"."enum_pms_vs_aif_page_status";
  DROP TYPE "public"."enum__pms_vs_aif_page_v_blocks_product_hero_mark";
  DROP TYPE "public"."enum__pms_vs_aif_page_v_blocks_comparison_rows_drawing";
  DROP TYPE "public"."enum__pms_vs_aif_page_v_version_status";
  DROP TYPE "public"."enum_our_philosophy_page_blocks_product_hero_mark";
  DROP TYPE "public"."enum_our_philosophy_page_status";
  DROP TYPE "public"."enum__our_philosophy_page_v_blocks_product_hero_mark";
  DROP TYPE "public"."enum__our_philosophy_page_v_version_status";
  DROP TYPE "public"."enum_case_studies_page_blocks_product_hero_mark";
  DROP TYPE "public"."enum_case_studies_page_status";
  DROP TYPE "public"."enum__case_studies_page_v_blocks_product_hero_mark";
  DROP TYPE "public"."enum__case_studies_page_v_version_status";
  DROP TYPE "public"."enum_picks_page_blocks_product_hero_mark";
  DROP TYPE "public"."enum_picks_page_status";
  DROP TYPE "public"."enum__picks_page_v_blocks_product_hero_mark";
  DROP TYPE "public"."enum__picks_page_v_version_status";
  DROP TYPE "public"."enum_careers_page_status";
  DROP TYPE "public"."enum__careers_page_v_version_status";`)
}
