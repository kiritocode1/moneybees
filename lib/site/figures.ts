import config from "@payload-config";
import { getPayload } from "payload";
import { PERIODS } from "@/lib/figure-limits";
import { AIF_ROWS, type ReturnRow } from "@/lib/performance";
import { DECK_FIGURES, type PmsFigures } from "@/lib/site/tokens";

/**
 * Moneybee PMS's figures from its latest published fact sheet, cleared for
 * the public site. A sheet counts only when it carries the since-inception
 * return and both Rs. 1 Mn values, because the homepage draws all three;
 * otherwise, or without a database, the deck's figures stand.
 */
export async function pmsFigures(): Promise<PmsFigures> {
  if (!process.env.DATABASE_URL) return DECK_FIGURES;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "fact-sheets",
    where: { status: { equals: "published" }, "product.slug": { equals: "moneybee-pms" }, "product.showPerformancePublicly": { equals: true } },
    sort: "-asOf",
    limit: 1,
    depth: 0,
  });
  const sheet = docs[0];
  const since = sheet?.returns?.find((row) => row.period === "SI");
  if (!sheet || typeof since?.ours !== "number" || typeof sheet.wealth?.ours !== "number" || typeof sheet.wealth.benchmark !== "number") return DECK_FIGURES;
  return {
    rows: PERIODS.map(({ value, label }) => {
      const row = sheet.returns?.find((r) => r.period === value);
      return { period: label, short: value, ours: row?.ours ?? null, benchmark: row?.benchmark ?? null };
    }),
    wealth: { start: 1, ours: sheet.wealth.ours, benchmark: sheet.wealth.benchmark },
    asOf: sheet.asOf,
  };
}

/** Flyingbee's returns and the day they run to, for /aif. */
export type AifFigures = { rows: readonly ReturnRow[]; asOf: string };

/** The Flyingbee deck's figures (p10, as on 31 July 2026), used until a sheet may be shown. */
export const AIF_DECK_FIGURES: AifFigures = { rows: AIF_ROWS, asOf: "2026-07-31" };

/**
 * Flyingbee's returns from its latest published fact sheet, in the periods
 * /aif lists. Only once "Show performance publicly" is on for Flyingbee in
 * Products (SEBI bars AIF returns in marketing without the benchmarking
 * report); until then, or without a database, the deck's figures.
 */
export async function aifFigures(): Promise<AifFigures> {
  if (!process.env.DATABASE_URL) return AIF_DECK_FIGURES;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "fact-sheets",
    where: { status: { equals: "published" }, "product.slug": { equals: "flyingbee" }, "product.showPerformancePublicly": { equals: true } },
    sort: "-asOf",
    limit: 1,
    depth: 0,
  });
  const sheet = docs[0];
  if (!sheet?.returns?.length) return AIF_DECK_FIGURES;
  return {
    rows: AIF_ROWS.map(({ period, short }) => {
      const row = sheet.returns?.find((r) => r.period === short);
      return { period, short, ours: row?.ours ?? null, benchmark: row?.benchmark ?? null };
    }),
    asOf: sheet.asOf,
  };
}
