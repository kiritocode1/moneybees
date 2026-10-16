import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { STARTER_TEMPLATES } from '../lib/crm/starter-content'
import { TEMPLATES_2026_10_14 } from './data/templates-2026-10-14'

/*
 * The starter templates become the letter's own words only (the emails in
 * emails/ now draw the greeting, facts, signature and disclosures), and the
 * one-to-one letters get starters. A row is moved on only if nobody has
 * edited it since 20261014_151509_hiring wrote it; an edited one keeps its
 * words and is named in the log, since its "Hello ... Moneybee" lines would
 * now print twice. Separate from 20261016_071849_email_letters because
 * Postgres cannot use an enum value in the transaction that adds it.
 */

type Template = { name: string; purpose: string; subject: string; body: string }
const BEFORE: Record<string, Template> = TEMPLATES_2026_10_14

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const [key, next] of Object.entries(STARTER_TEMPLATES)) {
    const before = BEFORE[key]
    const { docs } = await payload.find({ collection: 'email-templates', where: { name: { equals: before?.name ?? next.name } }, limit: 1, depth: 0, req })
    const row = docs[0]
    if (!row) {
      await payload.create({ collection: 'email-templates', data: { ...next, purpose: next.purpose as never }, req })
    } else if (before && row.subject === before.subject && row.body === before.body && !row.design) {
      await payload.update({ collection: 'email-templates', id: row.id, data: { ...next, purpose: next.purpose as never, html: null }, req })
    } else if (before) {
      payload.logger.warn({ msg: 'Email template edited since it was created; its words were left as they are. Remove its greeting and sign-off by hand.', template: row.name })
    }
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  for (const [key, next] of Object.entries(STARTER_TEMPLATES)) {
    const before = BEFORE[key]
    const { docs } = await payload.find({ collection: 'email-templates', where: { name: { equals: next.name } }, limit: 1, depth: 0, req })
    const row = docs[0]
    if (!row || row.body !== next.body) continue
    if (before) await payload.update({ collection: 'email-templates', id: row.id, data: { ...before, purpose: before.purpose as never }, req })
    else await payload.delete({ collection: 'email-templates', id: row.id, req })
  }
}
