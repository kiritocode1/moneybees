import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { AIF_NAMES, formatReturn, type ReturnRow } from "@/lib/performance";
import { AIF_PERFORMANCE, type AifPerformanceContent } from "@/lib/pages/aif-content";
import { AIF_DECK_FIGURES, type AifFigures } from "@/lib/site/figures";
import { dayMonthYear } from "@/lib/site/tokens";
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
function AsOf({ asOf, dark = false }: { asOf: string; dark?: boolean }) {
  return (
    <span className={`${EYEBROW} inline-flex items-center gap-[10px] border px-[12px] py-[7px] text-[11px] ${dark ? "border-white/25 text-white" : "border-black/20 text-black"}`}>
      <i className="h-[8px] w-[8px] bg-[#F6A11A]" aria-hidden="true" />
      As of {dayMonthYear(asOf)}
    </span>
  );
}

/** Heading on the left, placeholder body on the right, as /our-philosophy opens its sections. */
function SectionHead({ id, label, heading, lead, dark = false }: { id: string; label?: string | null; heading: string; lead?: string | null; dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
      <div>
        {label ? <BracketLabel>{label}</BracketLabel> : null}
        <h2 id={`${id}-heading`} className={`${label ? "mt-[18px] " : ""}${SUBHEAD}`}>
          {heading}
        </h2>
      </div>
      {lead ? <p className={`${dark ? "text-white/70" : "text-black/70"} ${BODY}`}>{lead}</p> : null}
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

/**
 * Flyingbee's periods against the S&P BSE 500, directly under the /aif hero.
 * The words are edited in /admin (the method by compliance only); the figures
 * come from Flyingbee's fact sheets once they may be shown (lib/site/figures.ts).
 */
export function AifPerformanceSection({ content = AIF_PERFORMANCE, figures = AIF_DECK_FIGURES }: { content?: AifPerformanceContent; figures?: AifFigures }) {
  return (
    <section id="performance" aria-labelledby="performance-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <SectionHead id="performance" label={content.label} heading={content.heading} lead={content.lead} />
        <div className="mt-[40px]">
          <AsOf asOf={figures.asOf} />
        </div>
        <Returns rows={figures.rows} names={AIF_NAMES} />
        {/* The content plan (§7) requires a method and disclaimer beside any performance figures. */}
        {content.method ? <p className="mt-[18px] max-w-[880px] border-t border-black/10 pt-[14px] text-[12px] leading-[1.55] text-black/60">{content.method}</p> : null}
      </div>
    </section>
  );
}
