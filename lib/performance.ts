/**
 * Copy and figures for /performance, Content & Visual Plan §7. The plan's own
 * figures are blank, so the numbers come from the repo's July 31, 2026 set:
 * PERIOD_RETURNS, WEALTH, RECORD_METHOD and RECORD_CAVEAT in lib/insights.ts
 * (AIF presentation p12) and AIF_RETURNS in lib/aif.ts. The plan asks for
 * "As of 31 August 2026"; the data is as of 31 July 2026, so that is the label.
 * A period the data does not carry is null and prints N/A.
 */

import { AIF_RETURNS } from "@/lib/aif";
import { PERIOD_RETURNS, RECORD_CAVEAT, RECORD_METHOD, WEALTH } from "@/lib/insights";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const PERFORMANCE = {
  heading: "Performance",
  asOf: "As of 31 July 2026",
  /** LOREM */
  lead: LOREM,
} as const;

export type ReturnRow = { period: string; short: string; ours: number | null; benchmark: number | null };

/** Looks a period up in PERIOD_RETURNS by the label insights.ts prints. */
const pms = (label: string) => PERIOD_RETURNS.find((row) => row.period === label);

/** The plan's eight PMS periods, in its order and wording. 2 Years is not in the data. */
export const PMS_ROWS: readonly ReturnRow[] = (
  [
    ["1 Month", "1M", "1 month"],
    ["3 Months", "3M", "3 months"],
    ["6 Months", "6M", "6 months"],
    ["1 Year", "1Y", "1 year"],
    ["2 Years", "2Y", null],
    ["3 Years", "3Y", "3 year"],
    ["5 Years", "5Y", "5 year"],
    ["Since Inception", "SI", "Since Inception"],
  ] as const
).map(([period, short, source]) => {
  const row = source ? pms(source) : undefined;
  return { period, short, ours: row?.queenbee ?? null, benchmark: row?.benchmark ?? null };
});

/** The AIF periods lib/aif.ts carries; only 3 and 6 months have run. */
export const AIF_ROWS: readonly ReturnRow[] = AIF_RETURNS.map((row) => ({
  period: row.period.replace(/^(\d) year$/, (_, years: string) => (years === "1" ? "1 Year" : `${years} Years`)),
  short: row.short,
  ours: row.fund,
  benchmark: row.benchmark,
}));

export const PMS_NAMES = { ours: "Moneybee", benchmark: "S&P BSE 500 TRI" } as const;
export const AIF_NAMES = { ours: "Flyingbee Investment Fund", benchmark: "S&P BSE 500" } as const;

/** Rs. 1 Mn at inception (August 2007) and its value on July 31, 2026, in Rs. Mn. */
export const GROWTH = {
  start: WEALTH.start,
  ours: WEALTH.queenbee,
  benchmark: WEALTH.benchmark,
  from: "Aug 2007",
  to: "Jul 2026",
} as const;

export const METHOD = { text: RECORD_METHOD, caveat: RECORD_CAVEAT } as const;

/** The page's parts, for the hero's index. */
export const PERFORMANCE_PARTS = [
  ["PMS Performance", "#pms"],
  ["Wealth growth", "#wealth"],
  ["AIF Performance", "#aif"],
  ["Methodology", "#methodology"],
] as const;

export const PERFORMANCE_LOREM = { long: LOREM, short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." } as const;

/** A return as the table prints it: signed to two places, or N/A. */
export const formatReturn = (value: number | null) => (value === null ? "N/A" : `${value > 0 ? "+" : ""}${value.toFixed(2)}%`);
