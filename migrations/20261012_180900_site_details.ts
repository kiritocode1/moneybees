import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { DEFAULT_DETAILS } from '../lib/site/details'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_details_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "site_details_desks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "site_details_registrations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"business" varchar NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "site_details" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company" varchar DEFAULT 'Moneybee Securities Pvt Ltd' NOT NULL,
  	"office_name" varchar DEFAULT 'Moneybee Group' NOT NULL,
  	"address_line1" varchar DEFAULT '303, Tower A, Peninsula Business Park,' NOT NULL,
  	"address_line2" varchar DEFAULT 'G.K. Marg, Lower Parel, Mumbai 400013' NOT NULL,
  	"pin_lat" numeric DEFAULT 18.9987 NOT NULL,
  	"pin_lon" numeric DEFAULT 72.82925 NOT NULL,
  	"email" varchar DEFAULT 'info@moneybee.in' NOT NULL,
  	"disclaimer" varchar DEFAULT 'Investments in securities are subject to market risk, including the loss of principal. Read all related documents carefully before investing. Registration with SEBI does not imply approval or endorsement of the portfolio manager by the Board. Past performance is not indicative of future results.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_details_phones" ADD CONSTRAINT "site_details_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_details_desks" ADD CONSTRAINT "site_details_desks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_details_registrations" ADD CONSTRAINT "site_details_registrations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_details"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_details_phones_order_idx" ON "site_details_phones" USING btree ("_order");
  CREATE INDEX "site_details_phones_parent_id_idx" ON "site_details_phones" USING btree ("_parent_id");
  CREATE INDEX "site_details_desks_order_idx" ON "site_details_desks" USING btree ("_order");
  CREATE INDEX "site_details_desks_parent_id_idx" ON "site_details_desks" USING btree ("_parent_id");
  CREATE INDEX "site_details_registrations_order_idx" ON "site_details_registrations" USING btree ("_order");
  CREATE INDEX "site_details_registrations_parent_id_idx" ON "site_details_registrations" USING btree ("_parent_id");`)

  // Today's details, so every page reads the same on the day this ships.
  await payload.updateGlobal({ slug: 'site-details', data: DEFAULT_DETAILS, req, context: { skipRevalidate: true } })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_details_phones" CASCADE;
  DROP TABLE "site_details_desks" CASCADE;
  DROP TABLE "site_details_registrations" CASCADE;
  DROP TABLE "site_details" CASCADE;`)
}
