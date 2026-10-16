import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { TEMPLATES_EMAIL_DESK } from './data/templates-email-desk'

/*
 * Starter words for the letters the Emails page sends (welcome, account
 * details, notices, complaint letters, the updates), where a database has
 * none of that name. Separate from 20261016_154424_email_desk because
 * Postgres cannot use an enum value in the transaction that adds it.
 */

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const template of Object.values(TEMPLATES_EMAIL_DESK)) {
    const { totalDocs } = await payload.count({ collection: 'email-templates', where: { name: { equals: template.name } }, req })
    if (!totalDocs) await payload.create({ collection: 'email-templates', data: { ...template, purpose: template.purpose as never }, req })
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  for (const template of Object.values(TEMPLATES_EMAIL_DESK)) {
    const { docs } = await payload.find({ collection: 'email-templates', where: { name: { equals: template.name } }, limit: 1, depth: 0, req })
    if (docs[0] && docs[0].body === template.body) await payload.delete({ collection: 'email-templates', id: docs[0].id, req })
  }
}
