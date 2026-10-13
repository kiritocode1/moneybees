import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import LitRows from "@/components/motion/lit-rows";
import { ReturnTable } from "@/components/performance/performance-sections";
import { PMS_PERFORMANCE, type PerformanceContent } from "@/lib/pages/pms-content";
import { PMS_NAMES } from "@/lib/performance";
import { DECK_FIGURES, dayMonthYear, fillContent, type PmsFigures } from "@/lib/site/tokens";
import { FigurePanel } from "./shared";

/*
 * PMS performance on /pms: lit rows cut to the four long periods, then every
 * period as a table. The words come from the PMS page in /admin; the figures
 * and their date from the latest published PMS fact sheet (lib/site/figures.ts),
 * or the deck's July 2026 figures without one.
 */

const PERIODS = new Set(["1Y", "3Y", "5Y", "SI"]);

export default function PerformanceChart({
  figures = DECK_FIGURES,
  content = fillContent(PMS_PERFORMANCE, figures),
}: {
  figures?: PmsFigures;
  content?: PerformanceContent;
}) {
  return (
    <section id="performance" aria-labelledby="performance-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            {content.label ? <BracketLabel>{content.label}</BracketLabel> : null}
            <h2 id="performance-heading" className={`mt-[18px] ${SUBHEAD}`}>
              {content.heading}
            </h2>
          </div>
          {content.lead ? <p className={`text-black/70 ${BODY}`}>{content.lead}</p> : null}
        </div>
        <p className="mt-[40px]">
          <span className={`${EYEBROW} rounded-full border border-[#F6A11A] px-[10px] py-[4px] text-black`}>As of {dayMonthYear(figures.asOf)}</span>
        </p>
        <FigurePanel className="mt-[32px]">
          <LitRows rows={figures.rows.filter((row) => PERIODS.has(row.short))} names={PMS_NAMES} />
        </FigurePanel>
        <div className="mt-[48px]">
          <ReturnTable rows={figures.rows} names={PMS_NAMES} />
        </div>
        {content.note ? <p className={`${EYEBROW} mt-[18px] text-black/60`}>{content.note}</p> : null}
        {/* The content plan (§7) requires the deck's methodology and disclaimer with any performance figures. */}
        {content.method ? <p className="mt-[18px] max-w-[880px] border-t border-black/10 pt-[14px] text-[12px] leading-[1.55] text-black/60">{content.method}</p> : null}
      </div>
    </section>
  );
}
