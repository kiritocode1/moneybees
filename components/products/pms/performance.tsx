"use client";

import { motion } from "motion/react";
import { BODY, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { PERIOD_RETURNS, RECORD_LEAD, WEALTH } from "@/lib/insights";
import { PMS_HEADINGS } from "@/lib/pms";
import { GREY, MONO, ORANGE, PmsSection, useReveal, useTween } from "./shared";

/*
 * Wealth creation and returns, AIF presentation p12 (returns as on July 31,
 * 2026 as per APMI), which supersedes the group profile's April figures on p19
 * and the undated ones on p11. Three figures: Rs. 1 Mn as a grid of Rs. 1 Mn
 * cells, the since-inception CAGR as two counting bars, and every period as a
 * pair of dots joined by the gap between them.
 */

const pct = (value: number) => `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(2)}%`;
const rupees = (millions: number) => `Rs. ${millions.toFixed(2)} Mn`;
const byPeriod = (period: string) => {
  const row = PERIOD_RETURNS.find((item) => item.period === period);
  if (!row) throw new Error(`No "${period}" row in PERIOD_RETURNS`);
  return row;
};
const SINCE = byPeriod("Since Inception");
const FIVE_YEAR = byPeriod("5 year");
const ONE_YEAR = byPeriod("1 year");

/** Whole cells, then the remaining fraction as a narrower last cell. */
const cellsFor = (value: number) => {
  const whole = Math.floor(value);
  const rest = Math.round((value - whole) * 100) / 100;
  return [...Array.from({ length: whole }, () => 1), ...(rest > 0 ? [rest] : [])];
};

/** One cell per Rs. 1 Mn, ten to a row, dropping in at one pace so the index finishes early. */
function WealthGrid() {
  const { ref, run, at } = useReveal<HTMLDivElement>(0.35);
  const rows = [
    { key: "moneybee", name: "Moneybee PMS", value: WEALTH.queenbee, fill: ORANGE },
    { key: "index", name: "S&P BSE 500 TRI", value: WEALTH.benchmark, fill: GREY },
  ] as const;
  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Rs. 1 Mn invested on August 1, 2007 was worth ${rupees(WEALTH.queenbee)} in Moneybee PMS on July 31, 2026, against ${rupees(WEALTH.benchmark)} in the S&P BSE 500 TRI. One cell is Rs. 1 Mn.`}
      className="grid gap-[44px]"
    >
      {rows.map((row) => {
        const cells = cellsFor(row.value);
        return (
          <div key={row.key}>
            <div className="flex items-baseline justify-between gap-4">
              <span className={`${EYEBROW} text-black/60`}>{row.name}</span>
              <motion.span
                className="font-serif text-[clamp(2rem,3vw,2.8rem)] leading-none"
                style={{ color: row.key === "moneybee" ? ORANGE : "#000" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: run ? 1 : 0 }}
                transition={at(cells.length * 0.045 + 0.2, 0.5)}
              >
                {rupees(row.value)}
              </motion.span>
            </div>
            <div className="mt-[14px] grid grid-cols-10 gap-[5px]">
              {cells.map((share, index) => (
                <motion.span
                  key={index}
                  className="block aspect-square"
                  style={{ background: `linear-gradient(90deg, ${row.fill} ${share * 100}%, transparent ${share * 100}%)` }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: run ? 1 : 0, scale: run ? 1 : 0.4 }}
                  transition={at(index * 0.045, 0.35)}
                />
              ))}
            </div>
          </div>
        );
      })}
      <p className={`${EYEBROW} text-black/50`} aria-hidden="true">
        One cell is {rupees(WEALTH.start).replace(".00", "")}
      </p>
    </div>
  );
}

/** Since-inception CAGR: two bars on one scale, with the figures counting up as they grow. */
function SinceInception() {
  const { ref, run } = useReveal<HTMLDivElement>(0.5);
  const grow = useTween(run, 1.6, 0.1);
  const max = Math.max(SINCE.queenbee, SINCE.benchmark);
  const rows = [
    { name: "Moneybee PMS", value: SINCE.queenbee, fill: ORANGE },
    { name: "S&P BSE 500 TRI", value: SINCE.benchmark, fill: GREY },
  ];
  return (
    <div ref={ref} role="img" aria-label={`Since inception in August 2007, ${pct(SINCE.queenbee)} a year against ${pct(SINCE.benchmark)} for the S&P BSE 500 TRI.`}>
      {rows.map((row) => (
        <div key={row.name} className="grid grid-cols-[1fr_auto] items-end gap-x-6 border-b border-b-[rgba(0,0,0,.13)] py-[18px]">
          <div>
            <span className={`${EYEBROW} text-black/60`}>{row.name}</span>
            <div className="mt-[12px] h-[14px] bg-[#f4f3f1]">
              <div className="h-full" style={{ width: `${(row.value / max) * 100 * grow}%`, background: row.fill }} />
            </div>
          </div>
          <span className="w-[4.2ch] text-right font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-none tabular-nums">
            {(row.value * grow).toFixed(2)}
            <span className="text-[.5em]">%</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const SHORT: Record<string, string> = {
  "1 month": "1 month",
  "3 months": "3 months",
  "6 months": "6 months",
  "1 year": "1 year",
  "3 year": "3 years",
  "5 year": "5 years",
  "Since Inception": "Since inception",
};

const LO = -10;
const HI = 22;
/** A value's position along a track, in percent. */
const at = (value: number) => ((value - LO) / (HI - LO)) * 100;
const TICKS = [-10, 0, 10, 20] as const;

/**
 * Every period in the table as two dots on one axis, the line between them
 * drawn from the index to Moneybee. Built in HTML rather than one SVG so the
 * labels stay readable at phone width, where the track drops under them.
 */
function PeriodDumbbells() {
  const { ref, run, at: timing } = useReveal<HTMLDivElement>(0.3);
  const track = "relative h-[22px]";
  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Returns as on July 31, 2026, Moneybee PMS against the S&P BSE 500 TRI: ${PERIOD_RETURNS.map((row) => `${row.period} ${pct(row.queenbee)} against ${pct(row.benchmark)}`).join(", ")}.`}
      className="w-full"
    >
      <div className={`${EYEBROW} mb-[18px] flex gap-[20px] text-black/70`} aria-hidden="true">
        <span className="flex items-center gap-[8px]">
          <i className="h-[9px] w-[9px] rounded-full bg-[#F6A11A]" />
          Moneybee PMS
        </span>
        <span className="flex items-center gap-[8px]">
          <i className="h-[9px] w-[9px] rounded-full bg-[#9D9EA1]" />
          S&amp;P BSE 500 TRI
        </span>
      </div>
      <div aria-hidden="true" className="relative">
        {PERIOD_RETURNS.map((row, index) => {
          const delay = 0.15 + index * 0.12;
          const since = row.period === "Since Inception";
          const up = row.queenbee >= row.benchmark;
          const from = Math.min(row.queenbee, row.benchmark);
          const to = Math.max(row.queenbee, row.benchmark);
          return (
            <div
              key={row.period}
              className="grid grid-cols-[120px_1fr_150px] items-center gap-x-[16px] border-b border-b-[rgba(0,0,0,.08)] py-[12px] max-[700px]:grid-cols-[1fr_auto] max-[700px]:gap-y-[8px]"
            >
              <span className={`${MONO} text-[11px] tracking-[.06em] text-black/70 uppercase`}>{SHORT[row.period] ?? row.period}</span>
              <div className={`${track} max-[700px]:order-3 max-[700px]:col-span-2`}>
                {TICKS.map((tick) => (
                  <i
                    key={tick}
                    className="absolute top-[-12px] bottom-[-12px] border-l border-dashed"
                    style={{ left: `${at(tick)}%`, borderColor: tick === 0 ? "rgba(0,0,0,.45)" : "rgba(0,0,0,.12)" }}
                  />
                ))}
                <motion.i
                  className="absolute top-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: `${at(from)}%`,
                    width: `${at(to) - at(from)}%`,
                    height: since ? 4 : 2,
                    background: up ? ORANGE : "#000",
                    transformOrigin: up ? "0% 50%" : "100% 50%",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: run ? 1 : 0 }}
                  transition={timing(delay + 0.2, 0.6)}
                />
                <motion.i
                  className="absolute top-1/2 h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${at(row.benchmark)}%`, background: GREY }}
                  initial={{ scale: 0 }}
                  animate={{ scale: run ? 1 : 0 }}
                  transition={timing(delay, 0.35)}
                />
                <motion.i
                  className="absolute top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${at(row.queenbee)}%`, background: ORANGE, boxShadow: since ? "0 0 0 1.5px #000" : undefined }}
                  initial={{ scale: 0 }}
                  animate={{ scale: run ? 1 : 0 }}
                  transition={timing(delay + 0.75, 0.35)}
                />
              </div>
              <motion.span
                className={`${MONO} text-right text-[12px] tabular-nums`}
                initial={{ opacity: 0 }}
                animate={{ opacity: run ? 1 : 0 }}
                transition={timing(delay + 0.9, 0.4)}
              >
                {pct(row.queenbee)}
                <span className="text-black/45"> / {pct(row.benchmark)}</span>
              </motion.span>
            </div>
          );
        })}
        <div className="grid grid-cols-[120px_1fr_150px] gap-x-[16px] pt-[10px] max-[700px]:grid-cols-1">
          <span className="max-[700px]:hidden" />
          <div className="relative h-[14px]">
            {TICKS.map((tick) => (
              <span key={tick} className={`${MONO} absolute -translate-x-1/2 text-[11px] text-black/50`} style={{ left: `${at(tick)}%` }}>
                {tick}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Wealth creation by Moneybee PMS, then its returns by period. */
export default function Performance() {
  return (
    <>
      <PmsSection id="performance">
        <div className="grid grid-cols-[1fr_1.1fr] items-start gap-[72px] max-[900px]:grid-cols-1 max-[900px]:gap-[48px]">
          <Rise onView>
            <BracketLabel>Performance</BracketLabel>
            <h2 id="performance-heading" className={`mt-[18px] max-w-[16ch] ${SUBHEAD}`}>
              {PMS_HEADINGS.performance}
            </h2>
            <p className={`mt-8 max-w-[520px] text-black/70 ${BODY}`}>{RECORD_LEAD}</p>
            <div className="mt-[48px] max-w-[520px]">
              <span className={`${EYEBROW} text-black/55`}>CAGR since inception, August 2007</span>
              <div className="mt-[10px] border-t border-t-black">
                <SinceInception />
              </div>
            </div>
          </Rise>
          <WealthGrid />
        </div>
      </PmsSection>
      <PmsSection id="returns">
        <div className="grid grid-cols-[.8fr_1.2fr] items-start gap-[72px] max-[900px]:grid-cols-1 max-[900px]:gap-[40px]">
          <Rise onView>
            <BracketLabel>Returns</BracketLabel>
            <h2 id="returns-heading" className={`mt-[18px] max-w-[14ch] ${SUBHEAD}`}>
              {PMS_HEADINGS.returns}
            </h2>
            <p className={`mt-8 max-w-[460px] text-black/70 ${BODY}`}>
              Returns as on July 31, 2026, as per APMI. Over five years, {pct(FIVE_YEAR.queenbee)} a year against{" "}
              {pct(FIVE_YEAR.benchmark)}. The last year was harder: {pct(ONE_YEAR.queenbee)}, while the index rose{" "}
              {pct(ONE_YEAR.benchmark)}.
            </p>
          </Rise>
          <PeriodDumbbells />
        </div>
      </PmsSection>
    </>
  );
}
