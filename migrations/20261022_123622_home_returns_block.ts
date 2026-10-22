import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_blocks_returns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"more_label" varchar DEFAULT 'Performance',
  	"more_link" varchar DEFAULT '/pms#performance',
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_returns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"more_label" varchar DEFAULT 'Performance',
  	"more_link" varchar DEFAULT '/pms#performance',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "home_page_blocks_record" ALTER COLUMN "lead" SET DEFAULT 'Rs. 10 Lakh put into Moneybee PMS in August 2007 was worth {wealthOurs} by {asOfMonth}. The same amount in the S&P BSE 500 TRI grew to {wealthBenchmark}.';
  ALTER TABLE "_home_page_v_blocks_record" ALTER COLUMN "lead" SET DEFAULT 'Rs. 10 Lakh put into Moneybee PMS in August 2007 was worth {wealthOurs} by {asOfMonth}. The same amount in the S&P BSE 500 TRI grew to {wealthBenchmark}.';
  ALTER TABLE "home_page_blocks_returns" ADD CONSTRAINT "home_page_blocks_returns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_returns" ADD CONSTRAINT "_home_page_v_blocks_returns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_blocks_returns_order_idx" ON "home_page_blocks_returns" USING btree ("_order");
  CREATE INDEX "home_page_blocks_returns_parent_id_idx" ON "home_page_blocks_returns" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_returns_path_idx" ON "home_page_blocks_returns" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_returns_order_idx" ON "_home_page_v_blocks_returns" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_returns_parent_id_idx" ON "_home_page_v_blocks_returns" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_returns_path_idx" ON "_home_page_v_blocks_returns" USING btree ("_path");

  -- One Returns block directly after each Performance block, carrying its link.
  UPDATE "home_page_blocks_hero" AS block SET "_order" = block."_order" + 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_two_ways" AS block SET "_order" = block."_order" + 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_founder" AS block SET "_order" = block."_order" + 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_get_started" AS block SET "_order" = block."_order" + 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_faq" AS block SET "_order" = block."_order" + 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_text" AS block SET "_order" = block."_order" + 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_hero" AS block SET "_order" = block."_order" + 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_two_ways" AS block SET "_order" = block."_order" + 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_founder" AS block SET "_order" = block."_order" + 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_get_started" AS block SET "_order" = block."_order" + 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_faq" AS block SET "_order" = block."_order" + 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_text" AS block SET "_order" = block."_order" + 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  INSERT INTO "home_page_blocks_returns" ("_order", "_parent_id", "_path", "id", "hidden", "more_label", "more_link")
  SELECT record."_order" + 1, record."_parent_id", record."_path", substr(md5(record."id" || ':returns'), 1, 24), record."hidden", record."more_label", record."more_link"
  FROM "home_page_blocks_record" AS record;
  INSERT INTO "_home_page_v_blocks_returns" ("_order", "_parent_id", "_path", "hidden", "more_label", "more_link", "_uuid")
  SELECT record."_order" + 1, record."_parent_id", record."_path", record."hidden", record."more_label", record."more_link", substr(md5(record."_uuid" || ':returns'), 1, 24)
  FROM "_home_page_v_blocks_record" AS record;

  ALTER TABLE "home_page_blocks_record" DROP COLUMN "more_label";
  ALTER TABLE "home_page_blocks_record" DROP COLUMN "more_link";
  ALTER TABLE "_home_page_v_blocks_record" DROP COLUMN "more_label";
  ALTER TABLE "_home_page_v_blocks_record" DROP COLUMN "more_link";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_blocks_record" ADD COLUMN "more_label" varchar DEFAULT 'Performance';
  ALTER TABLE "home_page_blocks_record" ADD COLUMN "more_link" varchar DEFAULT '/pms#performance';
  ALTER TABLE "_home_page_v_blocks_record" ADD COLUMN "more_label" varchar DEFAULT 'Performance';
  ALTER TABLE "_home_page_v_blocks_record" ADD COLUMN "more_link" varchar DEFAULT '/pms#performance';
  UPDATE "home_page_blocks_record" AS record SET "more_label" = returns."more_label", "more_link" = returns."more_link" FROM "home_page_blocks_returns" AS returns WHERE returns."_parent_id" = record."_parent_id" AND returns."_order" = record."_order" + 1;
  UPDATE "_home_page_v_blocks_record" AS record SET "more_label" = returns."more_label", "more_link" = returns."more_link" FROM "_home_page_v_blocks_returns" AS returns WHERE returns."_parent_id" = record."_parent_id" AND returns."_order" = record."_order" + 1;
  UPDATE "home_page_blocks_hero" AS block SET "_order" = block."_order" - 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_two_ways" AS block SET "_order" = block."_order" - 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_founder" AS block SET "_order" = block."_order" - 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_get_started" AS block SET "_order" = block."_order" - 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_faq" AS block SET "_order" = block."_order" - 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "home_page_blocks_text" AS block SET "_order" = block."_order" - 1 FROM "home_page_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_hero" AS block SET "_order" = block."_order" - 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_two_ways" AS block SET "_order" = block."_order" - 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_founder" AS block SET "_order" = block."_order" - 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_get_started" AS block SET "_order" = block."_order" - 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_faq" AS block SET "_order" = block."_order" - 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  UPDATE "_home_page_v_blocks_text" AS block SET "_order" = block."_order" - 1 FROM "_home_page_v_blocks_record" AS record WHERE block."_parent_id" = record."_parent_id" AND block."_order" > record."_order";
  ALTER TABLE "home_page_blocks_returns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_blocks_returns" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_blocks_returns" CASCADE;
  DROP TABLE "_home_page_v_blocks_returns" CASCADE;
  ALTER TABLE "home_page_blocks_record" ALTER COLUMN "lead" SET DEFAULT 'Rs. 1 Mn put into Moneybee PMS in August 2007 was worth {wealthOurs} by {asOfMonth}. The same amount in the S&P BSE 500 TRI grew to {wealthBenchmark}.';
  ALTER TABLE "_home_page_v_blocks_record" ALTER COLUMN "lead" SET DEFAULT 'Rs. 1 Mn put into Moneybee PMS in August 2007 was worth {wealthOurs} by {asOfMonth}. The same amount in the S&P BSE 500 TRI grew to {wealthBenchmark}.';`)
}
