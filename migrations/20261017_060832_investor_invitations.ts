import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "investors" ADD COLUMN "invited_at" timestamp(3) with time zone;
  ALTER TABLE "investors" ADD COLUMN "invited_by_id" integer;
  ALTER TABLE "investors" ADD COLUMN "last_sign_in_at" timestamp(3) with time zone;
  ALTER TABLE "investors" ADD CONSTRAINT "investors_invited_by_id_users_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "investors_invited_by_idx" ON "investors" USING btree ("invited_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "investors" DROP CONSTRAINT "investors_invited_by_id_users_id_fk";
  
  DROP INDEX "investors_invited_by_idx";
  ALTER TABLE "investors" DROP COLUMN "invited_at";
  ALTER TABLE "investors" DROP COLUMN "invited_by_id";
  ALTER TABLE "investors" DROP COLUMN "last_sign_in_at";`)
}
