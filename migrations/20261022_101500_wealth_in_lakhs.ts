import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/*
 * The homepage performance paragraph names the starting amount. The deck
 * says Rs. 1 Mn; the site says Rs. 10 Lakh, which is the same money. The
 * ending amounts stay tokens, and rupees() prints them in lakhs. Only a
 * paragraph still worded as the old sentence changes.
 */

const BEFORE =
  'Rs. 1 Mn put into Moneybee PMS in August 2007 was worth {wealthOurs} by {asOfMonth}. The same amount in the S&P BSE 500 TRI grew to {wealthBenchmark}.'
const AFTER =
  'Rs. 10 Lakh put into Moneybee PMS in August 2007 was worth {wealthOurs} by {asOfMonth}. The same amount in the S&P BSE 500 TRI grew to {wealthBenchmark}.'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`UPDATE home_page_blocks_record SET lead = ${AFTER} WHERE lead = ${BEFORE}`)
  await db.execute(sql`UPDATE _home_page_v_blocks_record SET lead = ${AFTER} WHERE lead = ${BEFORE}`)
  await db.execute(sql.raw(`ALTER TABLE home_page_blocks_record ALTER COLUMN lead SET DEFAULT '${AFTER}'`))
  await db.execute(sql.raw(`ALTER TABLE _home_page_v_blocks_record ALTER COLUMN lead SET DEFAULT '${AFTER}'`))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`UPDATE home_page_blocks_record SET lead = ${BEFORE} WHERE lead = ${AFTER}`)
  await db.execute(sql`UPDATE _home_page_v_blocks_record SET lead = ${BEFORE} WHERE lead = ${AFTER}`)
  await db.execute(sql.raw(`ALTER TABLE home_page_blocks_record ALTER COLUMN lead SET DEFAULT '${BEFORE}'`))
  await db.execute(sql.raw(`ALTER TABLE _home_page_v_blocks_record ALTER COLUMN lead SET DEFAULT '${BEFORE}'`))
}
