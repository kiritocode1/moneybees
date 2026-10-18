import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/*
 * Columns the seeds after this one read and write through Payload's API,
 * which always uses today's schema: a letter's Goes with
 * (email_templates_texts, from 20261016_184252) and a playbook step's Due
 * and Ticks itself when (from 20261017_054250). Placed before the hiring
 * seed so a fresh database has them in time; idempotent, because a database
 * that already ran those migrations has them too. Those two migrations no
 * longer create these.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "email_templates_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  DO $$ BEGIN
    ALTER TABLE "email_templates_texts" ADD CONSTRAINT "email_templates_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "email_templates_texts_order_parent" ON "email_templates_texts" USING btree ("order","parent_id");
  DO $$ BEGIN
    CREATE TYPE "public"."enum_playbooks_steps_when" AS ENUM('reply', 'next_day', 'three_days', 'week', 'rule');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_playbooks_steps_ticks_when" AS ENUM('reply', 'call', 'deal');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  ALTER TABLE "playbooks_steps" ADD COLUMN IF NOT EXISTS "when" "enum_playbooks_steps_when" DEFAULT 'reply' NOT NULL;
  ALTER TABLE "playbooks_steps" ADD COLUMN IF NOT EXISTS "ticks_when" "enum_playbooks_steps_ticks_when";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "email_templates_texts" CASCADE;
  ALTER TABLE "playbooks_steps" DROP COLUMN IF EXISTS "when";
  ALTER TABLE "playbooks_steps" DROP COLUMN IF EXISTS "ticks_when";
  DROP TYPE IF EXISTS "public"."enum_playbooks_steps_when";
  DROP TYPE IF EXISTS "public"."enum_playbooks_steps_ticks_when";`)
}
