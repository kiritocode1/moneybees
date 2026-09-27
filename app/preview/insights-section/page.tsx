import InsightCards from "@/components/insight-cards/insight-cards";
import "./light-cards.css";

/**
 * PREVIEW ONLY. The proposed homepage section, isolated so it can be reviewed
 * in Plannotator before anything in `app/page.tsx` changes. Growth, risk and
 * allocation still draw their old figures; the plan replaces those three.
 */
export default function InsightsSectionPreview() {
  return (
    <main className="option-one min-h-svh bg-white text-[#000000]">
      <section className="border-y border-y-[rgba(0,0,0,.13)] bg-[#9D9EA1] px-[max(32px,calc((100vw_-_1480px)/2))] pt-[96px] pb-[110px] max-[600px]:px-[22px] max-[600px]:pt-[64px]">
        <div className="grid grid-cols-[.42fr_1fr] items-end gap-[40px] max-[900px]:grid-cols-1">
          <span className="text-[9px] uppercase tracking-[.14em] text-[rgba(0,0,0,.6)]">The record, in figures</span>
          <div>
            <h2 className="text-[clamp(3.4rem,5.6vw,6rem)] font-light leading-[.92] tracking-[-.055em]">
              The numbers we
              <br />
              show investors
            </h2>
            <p className="mt-[28px] max-w-[460px] text-[11px] leading-[1.55] text-[rgba(0,0,0,.66)]">
              Taken from Moneybee&rsquo;s April and August 2026 investor presentations. Open any figure for the full
              data, the period it covers and how it was measured.
            </p>
          </div>
        </div>
        <div className="insights-light mt-[72px] flex justify-center">
          <InsightCards
            items={[
              { title: "Wealth since 2007", figure: "wealth" },
              { title: "Research selection", figure: "research" },
              { title: "Historical picks", figure: "pyramid" },
              { title: "KPI Green growth", figure: "growth" },
              { title: "Portfolio limits", figure: "risk" },
              { title: "Returns by period", figure: "allocation" },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
