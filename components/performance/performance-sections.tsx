import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { AIF_DATES } from "@/lib/aif";
import { AIF_NAMES, AIF_ROWS, formatReturn, METHOD, PERFORMANCE, PERFORMANCE_LOREM, type ReturnRow } from "@/lib/performance";
import LitRows from "@/components/motion/lit-rows";
import { FigurePanel } from "@/components/pms-v2/shared";

/*
 * Returns as lit rows (components/motion/lit-rows.tsx) with the same figures
 * as a plain table under them. AifPerformanceSection opens /aif under its
 * hero; ReturnTable also sits under the PMS chart on /pms
 * (components/pms-v2/performance-chart.tsx). Figures are as of 31 July 2026
 * (lib/performance.ts); a period the data does not carry prints N/A.
 */

/** The As-of label, an orange square beside the date. */
function AsOf({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`${EYEBROW} inline-flex items-center gap-[10px] border px-[12px] py-[7px] text-[11px] ${dark ? "border-white/25 text-white" : "border-black/20 text-black"}`}>
      <i className="h-[8px] w-[8px] bg-[#F6A11A]" aria-hidden="true" />
      {PERFORMANCE.asOf}
    </span>
  );
}

/** Heading on the left, placeholder body on the right, as /our-approach opens its sections. */
function SectionHead({ id, label, heading, dark = false }: { id: string; label: string; heading: string; dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
      <div>
        <BracketLabel>{label}</BracketLabel>
        <h2 id={`${id}-heading`} className={`mt-[18px] ${SUBHEAD}`}>
          {heading}
        </h2>
      </div>
      <p className={`${dark ? "text-white/70" : "text-black/70"} ${BODY}`}>{PERFORMANCE_LOREM.long}</p>
    </div>
  );
}

/** The same rows as a plain table under the lit rows, for reading and screen readers. */
export function ReturnTable({ rows, names }: { rows: readonly ReturnRow[]; names: { ours: string; benchmark: string } }) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className={`${EYEBROW} border-b border-black text-black/60`}>
          <th scope="col" className="py-[12px] pr-[12px] font-normal">
            Period
          </th>
          <th scope="col" className="py-[12px] pr-[12px] text-right font-normal">
            {names.ours}
          </th>
          <th scope="col" className="py-[12px] text-right font-normal">
            {names.benchmark}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.period} className="border-b border-black/12">
            <th scope="row" className="py-[14px] pr-[12px] text-[16px] font-normal whitespace-nowrap">
              {row.period}
            </th>
            <td className={`py-[14px] pr-[12px] text-right font-[family-name:var(--font-geist-mono)] text-[15px] tabular-nums ${row.ours === null ? "text-black/60" : "text-black"}`}>
              {formatReturn(row.ours)}
            </td>
            <td className={`py-[14px] text-right font-[family-name:var(--font-geist-mono)] text-[15px] tabular-nums ${row.benchmark === null ? "text-black/60" : "text-black/70"}`}>
              {formatReturn(row.benchmark)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A fund's lit rows in the figure panel, then the same figures as a table. */
function Returns({ rows, names }: { rows: readonly ReturnRow[]; names: { ours: string; benchmark: string } }) {
  return (
    <>
      <FigurePanel className="mt-[40px]">
        <LitRows rows={rows} names={names} />
      </FigurePanel>
      <div className="mt-[48px]">
        <ReturnTable rows={rows} names={names} />
      </div>
    </>
  );
}

/** Flyingbee's periods against the S&P BSE 500, directly under the /aif hero. */
export function AifPerformanceSection() {
  return (
    <section id="performance" aria-labelledby="performance-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <SectionHead id="performance" label="Performance" heading="AIF Performance" />
        <div className="mt-[40px]">
          <AsOf />
        </div>
        <Returns rows={AIF_ROWS} names={AIF_NAMES} />
        {/* The content plan (§7) requires a method and disclaimer beside any performance figures. RECORD_METHOD is the PMS's, so the fund's own facts (deck p10) stand in for it. */}
        <p className="mt-[18px] max-w-[880px] border-t border-black/10 pt-[14px] text-[12px] leading-[1.55] text-black/60">
          Returns in %, time-weighted (TWRR). N/A marks a period that has not run since the fund&apos;s first close on {AIF_DATES.firstClose}. {METHOD.caveat} {METHOD.guarantee}
        </p>
      </div>
    </section>
  );
}
