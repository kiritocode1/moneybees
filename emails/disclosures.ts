import { RECORD_CAVEAT } from "@/lib/insights";
import { METHOD_NOTE } from "@/lib/pages/pms-content";
import type { ReturnRow as FigureRow } from "@/lib/performance";
export { AIF_NAMES, PMS_NAMES } from "@/lib/performance";
import type { SiteDetails } from "@/lib/site/details";
import { dayMonthYear } from "@/lib/site/tokens";
import type { ReturnRow } from "./blocks";

/*
 * What must travel with figures and with anything sent to prospects
 * (research: .plannotator/email-templates/research/sebi-communications.md).
 * Wording is the decks' or SEBI's own; nothing here is paraphrased.
 */

/** PMS Master Circular 4.5.3.6: in any material that shows performance. */
export const NOT_VERIFIED_BY_SEBI = "Performance related information provided herein is not verified by SEBI.";

/** The deck's method note (dated by the fact sheet), SEBI's sentence, the caveat, and the site's disclaimer. */
export function pmsDisclosure(asOf: string, site: Pick<SiteDetails, "disclaimer">) {
  return [METHOD_NOTE.replace("{asOfDay}", dayMonthYear(asOf)), `${NOT_VERIFIED_BY_SEBI} ${RECORD_CAVEAT}`, site.disclaimer];
}

/** Flyingbee deck p10, verbatim. */
export const AIF_PERFORMANCE_DISCLOSURE = [
  "Returns are calculated using the Time Weighted Rate of Return (“TWRR”) methodology and are adjusted for capital inflows and outflows. Performance shown is net of applicable management fees, expenses, and taxes, as on {asOf}.",
  "The performance of individual investors, classes, or series may vary from the returns presented herein due to differences in timing of capital contributions/redemptions, fee structures, expenses, and other adjustments.",
  "Performance-related information provided herein has not been independently verified or audited by any statutory auditor, regulator, or governmental authority. Returns disclosed herein are based on internal calculations and may be subject to revision upon finalization, audit, or regulatory review, if applicable.",
  "Past performance may or may not be sustained in the future and should not be construed as an indicator or guarantee of future results.",
] as const;

export const aifPerformanceDisclosure = (asOf: string) => AIF_PERFORMANCE_DISCLOSURE.map((line) => line.replace("{asOf}", dayMonthYear(asOf)));

/** AIF Master Circular 11.4.4, wherever an AIF NAV is shown. */
export const INDICATIVE_NAV = "Net Asset Value (NAV) being shown is on the basis of valuation methodology and accounting practice followed by your respective AIF. This is an indicative NAV. For more details, please refer to your statement of accounts and fund documents.";

/** For anything about Flyingbee sent to a prospect (AIF MC 3.2.1, 3.2.3; deck p15 and p16). */
export const AIF_PRIVATE_PLACEMENT = [
  "This email is confidential and intended only for the person to whom it is addressed. Flyingbee Investment Fund is a Category III Alternative Investment Fund under the SEBI (Alternative Investment Funds) Regulations, 2012, offered only on a private placement basis to eligible investors. Nothing in this email is an offer to the public, and it does not assure or guarantee any return.",
  "Investment in the Fund involves significant risks, including but not limited to political, legal, social, economic, and market risks. All prospective investors must read the detailed PPM of the Fund, particularly the section titled “Risk Factors”, before making any investment decision.",
] as const;

/** Rows for the email blocks from the site's figure rows; the four the /pms chart draws are picked by `chartRows`. */
export const emailRows = (rows: readonly FigureRow[]): ReturnRow[] => rows.filter((row) => row.ours !== null || row.benchmark !== null).map((row) => ({ period: row.period, ours: row.ours, benchmark: row.benchmark }));

const CHART = new Set(["1Y", "3Y", "5Y", "SI"]);
export const chartRows = (rows: readonly FigureRow[]): ReturnRow[] => emailRows(rows.filter((row) => CHART.has(row.short)));

