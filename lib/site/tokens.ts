import { WEALTH } from "@/lib/insights";
import { AIF_ROWS, PMS_ROWS, type ReturnRow } from "@/lib/performance";

/**
 * Numbers in editable site text. Staff write a word in braces, such as
 * {sinceInception}, and the page prints the figure from the latest published
 * fact sheet, so a sentence never goes stale when the numbers change. Safe on
 * the client; lib/site/figures.ts reads the fact sheet on the server.
 */

/** The PMS figures a page prints: the returns table, growth of Rs. 10 Lakh since inception, and the day they run to. */
export type PmsFigures = {
  rows: readonly ReturnRow[];
  wealth: { start: number; ours: number; benchmark: number };
  asOf: string;
};

/** The deck's figures (lib/insights.ts, as on 31 July 2026), used until a PMS fact sheet is published. */
export const DECK_FIGURES: PmsFigures = {
  rows: PMS_ROWS,
  wealth: { start: WEALTH.start, ours: WEALTH.queenbee, benchmark: WEALTH.benchmark },
  asOf: "2026-07-31",
};

/** Flyingbee's returns and the day they run to, for /aif and the investor update. */
export type AifFigures = { rows: readonly ReturnRow[]; asOf: string };

/** The Flyingbee deck's figures (p10, as on 31 July 2026), used until a sheet may be shown. */
export const AIF_DECK_FIGURES: AifFigures = { rows: AIF_ROWS, asOf: "2026-07-31" };

/** One million rupees is ten lakh. Growth figures are stored in millions, one per disc. */
export const LAKHS_PER_MILLION = 10;

/** 100 lakh is one crore. A printed amount at or above this is crore. Rs. 10 Lakh, the amount invested, stays in lakh. */
export const LAKHS_PER_CRORE = 100;

export type RupeeUnit = "Lakh" | "Crore";

/** Stored millions as lakhs. 28.85 becomes 288.5. */
export const millionsToLakhs = (millions: number) => Math.round(millions * LAKHS_PER_MILLION * 100) / 100;

/** Lakhs back to stored millions. 288.5 becomes 28.85. */
export const lakhsToMillions = (lakhs: number) => Math.round((lakhs / LAKHS_PER_MILLION) * 100) / 100;

/**
 * Stored millions as the amount and unit to print. Under 100 lakh stays in
 * lakh, so the Rs. 10 Lakh invested and a Rs. 59.7 Lakh result stay put.
 * 288.5 lakh is Rs. 2.885 Crore.
 */
export function wealthDisplay(millions: number): { amount: number; unit: RupeeUnit } {
  const lakhs = millionsToLakhs(millions);
  if (lakhs >= LAKHS_PER_CRORE) return { amount: Math.round((lakhs / LAKHS_PER_CRORE) * 1000) / 1000, unit: "Crore" };
  return { amount: lakhs, unit: "Lakh" };
}

/** A growth-box amount, in the unit beside the box, back to stored millions. 2.885 crore is 28.85. */
export function wealthToMillions(amount: number, unit: RupeeUnit): number {
  const lakhs = unit === "Crore" ? Math.round(amount * LAKHS_PER_CRORE * 100) / 100 : amount;
  return lakhsToMillions(lakhs);
}

/** Rupees for the site and admin. The argument is stored millions: rupees(28.85) is "Rs. 2.885 Crore", rupees(1) is "Rs. 10 Lakh". */
export const rupees = (millions: number) => {
  const { amount, unit } = wealthDisplay(millions);
  return `Rs. ${amount} ${unit}`;
};

const percent = (value: number | null | undefined) => (value === null || value === undefined ? "N/A" : `${value.toFixed(2)}%`);

/** "July 2026", in India's time zone. */
export const monthYear = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

/** "31 July 2026", in India's time zone. */
export const dayMonthYear = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

/** "Jul 2026", for the short date under a figure. */
export const shortMonth = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

/** Every word staff can put in braces, what it prints, and how. Admin field descriptions list these. */
export const TOKENS = {
  sinceInception: { means: "Moneybee PMS's yearly return since inception", value: (f: PmsFigures) => percent(f.rows.find((row) => row.short === "SI")?.ours) },
  benchmarkSinceInception: { means: "the benchmark's yearly return since inception", value: (f: PmsFigures) => percent(f.rows.find((row) => row.short === "SI")?.benchmark) },
  wealthOurs: { means: "what Rs. 10 Lakh in Moneybee PMS grew to", value: (f: PmsFigures) => rupees(f.wealth.ours) },
  wealthBenchmark: { means: "what Rs. 10 Lakh in the benchmark grew to", value: (f: PmsFigures) => rupees(f.wealth.benchmark) },
  asOfMonth: { means: "the month the figures run to", value: (f: PmsFigures) => monthYear(f.asOf) },
  asOfDay: { means: "the day the figures run to, such as 31 July 2026", value: (f: PmsFigures) => dayMonthYear(f.asOf) },
} as const satisfies Record<string, { means: string; value: (figures: PmsFigures) => string }>;

export type TokenName = keyof typeof TOKENS;

/** One line for an admin description: "Words in braces print ...: {sinceInception} is ...; {asOfMonth} is ...". */
export const TOKEN_HELP = `Words in braces print the latest fact sheet's figures: ${Object.entries(TOKENS)
  .map(([name, token]) => `{${name}} is ${token.means}`)
  .join("; ")}.`;

/** Replaces each {name} in `text` with its figure. An unknown name stays as written, so a typo shows on the page instead of vanishing. */
export function fillTokens(text: string, figures: PmsFigures): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in TOKENS ? TOKENS[name as TokenName].value(figures) : match));
}

/** The same, through every string of a section's content. */
export function fillContent<T>(content: T, figures: PmsFigures): T {
  if (typeof content === "string") return fillTokens(content, figures) as T;
  if (Array.isArray(content)) return content.map((item) => fillContent(item, figures)) as T;
  if (content && typeof content === "object") return Object.fromEntries(Object.entries(content).map(([key, item]) => [key, fillContent(item, figures)])) as T;
  return content;
}
