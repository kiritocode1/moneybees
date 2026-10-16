import { WEALTH } from "@/lib/insights";
import { AIF_ROWS, PMS_ROWS, type ReturnRow } from "@/lib/performance";

/**
 * Numbers in editable site text. Staff write a word in braces, such as
 * {sinceInception}, and the page prints the figure from the latest published
 * fact sheet, so a sentence never goes stale when the numbers change. Safe on
 * the client; lib/site/figures.ts reads the fact sheet on the server.
 */

/** The PMS figures a page prints: the returns table, Rs. 1 Mn since inception, and the day they run to. */
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

/** Rupees in millions, written the way the deck writes them: "Rs. 28.85 Mn". */
export const rupees = (millions: number) => `Rs. ${millions.toFixed(2).replace(/\.00$/, "")} Mn`;

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
  wealthOurs: { means: "what Rs. 1 Mn in Moneybee PMS grew to", value: (f: PmsFigures) => rupees(f.wealth.ours) },
  wealthBenchmark: { means: "what Rs. 1 Mn in the benchmark grew to", value: (f: PmsFigures) => rupees(f.wealth.benchmark) },
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
