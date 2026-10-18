import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_deals_lost_why" AS ENUM('elsewhere', 'minimum', 'not_eligible', 'not_now', 'stopped_replying', 'other');
  ALTER TABLE "deals" ADD COLUMN "lost_why" "enum_deals_lost_why";
  ALTER TABLE "deals" ADD COLUMN "invested_on" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "deals" DROP COLUMN "lost_why";
  ALTER TABLE "deals" DROP COLUMN "invested_on";
  DROP TYPE "public"."enum_deals_lost_why";`)
}
