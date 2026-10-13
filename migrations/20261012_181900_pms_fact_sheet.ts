import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { PERIOD_RETURNS, PMS_PRODUCT, WEALTH } from '../lib/insights'

/*
 * Moneybee PMS's July 2026 figures (AIF presentation p12) as a published fact
 * sheet, so the homepage graphs draw from a record staff replace in /admin
 * (Publishing > Fact sheets) instead of numbers in code. Makes the product
 * first where a database lacks it. Skips when a sheet is already published.
 * It writes through Payload, which expects today's fact sheet fields, so it
 * runs after every migration that changes fact sheets (review_note, 181820).
 */

/** The deck's period labels, as fact sheets name them. The deck has no 2-year figure. */
const PERIOD = { '1 month': '1M', '3 months': '3M', '6 months': '6M', '1 year': '1Y', '3 year': '3Y', '5 year': '5Y', 'Since Inception': 'SI' } as const

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const found = await payload.find({ collection: 'products', where: { slug: { equals: 'moneybee-pms' } }, limit: 1, depth: 0, overrideAccess: true, req })
  const product =
    found.docs[0] ??
    (await payload.create({
      collection: 'products',
      data: { name: PMS_PRODUCT.name, slug: 'moneybee-pms', kind: 'pms', benchmark: 'S&P BSE 500 TRI', inception: '2007-08-01', registration: PMS_PRODUCT.registration, showPerformancePublicly: true },
      overrideAccess: true,
      req,
    }))
  const published = await payload.count({ collection: 'fact-sheets', where: { product: { equals: product.id }, status: { equals: 'published' } }, overrideAccess: true, req })
  if (published.totalDocs > 0) return
  await payload.create({
    collection: 'fact-sheets',
    data: {
      product: product.id,
      asOf: '2026-07-31',
      status: 'published',
      returns: PERIOD_RETURNS.map((row) => ({ period: PERIOD[row.period as keyof typeof PERIOD], ours: row.queenbee, benchmark: row.benchmark })),
      wealth: { ours: WEALTH.queenbee, benchmark: WEALTH.benchmark },
    },
    overrideAccess: true,
    req,
    context: { system: 'seed', skipRevalidate: true },
  })
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.delete({ collection: 'fact-sheets', where: { title: { equals: 'Moneybee PMS, July 2026' } }, overrideAccess: true, req })
}
