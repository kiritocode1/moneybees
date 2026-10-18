import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/*
 * The PMS introduction's Goes with (lib/files/library.ts refs): the newest
 * approved Moneybee PMS fact sheet, and the Disclosure Document card's PDF
 * when the card has one. These are the two documents the letter already
 * links to. Only a letter with no Goes with yet is filled, so compliance's
 * own choice is never replaced. Plain SQL, so a later change to Email
 * templates or Documents cannot break it on a fresh database.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  WITH letters AS (
    SELECT t.id FROM email_templates t
    WHERE t.purpose = 'pms_introduction' AND NOT EXISTS (SELECT 1 FROM email_templates_texts x WHERE x.parent_id = t.id AND x.path = 'goesWith')
  ), dd AS (
    SELECT file_id FROM documents WHERE title ILIKE 'Disclosure Document%' AND file_id IS NOT NULL ORDER BY id LIMIT 1
  )
  INSERT INTO email_templates_texts ("order", parent_id, path, text)
  SELECT 1, letters.id, 'goesWith', 'latest-fact-sheet:moneybee-pms' FROM letters
  UNION ALL
  SELECT 2, letters.id, 'goesWith', 'media:' || dd.file_id FROM letters, dd;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DELETE FROM email_templates_texts x USING email_templates t
  WHERE x.parent_id = t.id AND t.purpose = 'pms_introduction' AND x.path = 'goesWith';`)
}
