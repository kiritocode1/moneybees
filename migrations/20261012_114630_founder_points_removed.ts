import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_blocks_founder_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_blocks_founder_points" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_blocks_founder_points" CASCADE;
  DROP TABLE "_home_page_v_blocks_founder_points" CASCADE;
  ALTER TABLE "home_page_blocks_founder" ALTER COLUMN "credentials" SET DEFAULT 'Founder, Moneybee';
  ALTER TABLE "_home_page_v_blocks_founder" ALTER COLUMN "credentials" SET DEFAULT 'Founder, Moneybee';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_blocks_founder_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_founder_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"point" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "home_page_blocks_founder" ALTER COLUMN "credentials" SET DEFAULT 'FCA, GRAD CWA, LLB, M.COM';
  ALTER TABLE "_home_page_v_blocks_founder" ALTER COLUMN "credentials" SET DEFAULT 'FCA, GRAD CWA, LLB, M.COM';
  ALTER TABLE "home_page_blocks_founder_points" ADD CONSTRAINT "home_page_blocks_founder_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_founder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_founder_points" ADD CONSTRAINT "_home_page_v_blocks_founder_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_founder"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_blocks_founder_points_order_idx" ON "home_page_blocks_founder_points" USING btree ("_order");
  CREATE INDEX "home_page_blocks_founder_points_parent_id_idx" ON "home_page_blocks_founder_points" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_founder_points_order_idx" ON "_home_page_v_blocks_founder_points" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_founder_points_parent_id_idx" ON "_home_page_v_blocks_founder_points" USING btree ("_parent_id");`)
}
