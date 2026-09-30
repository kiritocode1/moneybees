import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import LitRows from "@/components/motion/lit-rows";
import { METHOD, PMS_NAMES, PMS_ROWS } from "@/lib/performance";
import { PERFORMANCE, PMS_LOREM } from "@/lib/pms-v2";
import { FigurePanel } from "./shared";

/*
 * PMS performance on /pms: the same lit rows as /performance, cut to the four
 * long periods. Figures are lib/performance.ts's, as of 31 July 2026.
 */

const PERIODS = new Set(["1Y", "3Y", "5Y", "SI"]);
const ROWS = PMS_ROWS.filter((row) => PERIODS.has(row.short));

export default function PerformanceChart() {
  return (
    <section id="performance" aria-labelledby="performance-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Performance</BracketLabel>
            <h2 id="performance-heading" className={`mt-[18px] ${SUBHEAD}`}>
              {PERFORMANCE.heading}
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{PMS_LOREM.long}</p>
        </div>
        <p className="mt-[40px]">
          <span className={`${EYEBROW} rounded-full border border-[#F6A11A] px-[10px] py-[4px] text-black`}>{PERFORMANCE.asOf}</span>
        </p>
        <FigurePanel className="mt-[32px]">
          <LitRows rows={ROWS} names={PMS_NAMES} />
        </FigurePanel>
        <p className={`${EYEBROW} mt-[18px] text-black/60`}>Returns in %. Periods above 1 year are CAGR.</p>
        {/* The content plan (§7) requires the deck's methodology and disclaimer with any performance figures. */}
        <p className="mt-[18px] max-w-[880px] border-t border-black/10 pt-[14px] text-[12px] leading-[1.55] text-black/60">
          {METHOD.text} {METHOD.caveat} {METHOD.guarantee}
        </p>
      </div>
    </section>
  );
}
