"use client";

import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { PERIOD_RETURNS, RECORD_CAVEAT, RECORD_METHOD, WEALTH } from "@/lib/insights";
import { PERFORMANCE, PMS_LOREM } from "@/lib/pms-v2";
import { T, useShown } from "./shared";

/*
 * The PMS performance chart: Moneybee PMS beside the S&P BSE 500 TRI for every
 * period the deck gives, as paired bars from a shared zero, and the wealth
 * each grew Rs. 1 Mn into since August 2007. Figures are lib/insights.ts's,
 * as of 31 July 2026.
 */

const MIN = Math.min(0, ...PERIOD_RETURNS.flatMap((row) => [row.queenbee, row.benchmark]));
const MAX = Math.max(...PERIOD_RETURNS.flatMap((row) => [row.queenbee, row.benchmark]));
const LOW = Math.floor(MIN / 5) * 5;
// Headroom past the largest return so its label fits inside the track.
const HIGH = Math.ceil(MAX / 5) * 5 + 5;
const SPAN = HIGH - LOW;
const ZERO = (-LOW / SPAN) * 100;
const TICKS = Array.from({ length: SPAN / 5 + 1 }, (_, index) => LOW + index * 5);

/** "3 year" and "1 month" as the plan prints them: "3 Years", "1 Month". */
const periodLabel = (period: string) =>
  period.replace(/^(\d+) (month|year)s?$/i, (_, count: string, unit: string) => `${count} ${unit[0].toUpperCase()}${unit.slice(1)}${count === "1" ? "" : "s"}`);

const percent = (value: number) => `${value > 0 ? "" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(2)}%`;

/**
 * One return as a bar from zero, left for a loss and right for a gain. The bar
 * grows with scaleX from the zero line; its label names the series for screen
 * readers, since the colour alone carries it on screen.
 */
function Bar({ value, color, series, on, delay }: { value: number; color: string; series: string; on: boolean; delay: number }) {
  const size = (Math.abs(value) / SPAN) * 100;
  const left = value < 0 ? ZERO - size : ZERO;
  return (
    <div className="relative h-[12px]">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 transition-transform duration-700 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:!transition-none"
        style={{ left: `${left}%`, width: `${size}%`, transform: `scaleX(${on ? 1 : 0})`, transformOrigin: value < 0 ? "right" : "left", backgroundColor: color, transitionDelay: `${delay}ms` }}
      />
      <span
        className="absolute top-1/2 -translate-y-1/2 text-[12px] leading-none tabular-nums transition-opacity duration-300 motion-reduce:!transition-none"
        style={
          value < 0
            ? { right: `${100 - left + 1}%`, opacity: on ? 1 : 0, transitionDelay: `${delay + 300}ms` }
            : { left: `${ZERO + size + 1}%`, opacity: on ? 1 : 0, transitionDelay: `${delay + 300}ms` }
        }
      >
        <span className="sr-only">{series}: </span>
        {percent(value)}
      </span>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-black/70">
      <span className="flex items-center gap-2">
        <i className="h-[10px] w-[10px] bg-[#F6A11A]" />
        {PERFORMANCE.pms}
      </span>
      <span className="flex items-center gap-2">
        <i className="h-[10px] w-[10px] bg-black" />
        {PERFORMANCE.benchmark}
      </span>
    </div>
  );
}

export default function PerformanceChart() {
  const { ref, shown } = useShown<HTMLDivElement>(0.25);
  const wealthMax = Math.max(WEALTH.queenbee, WEALTH.benchmark);
  const columns = [
    { label: "Invested, Aug 2007", value: WEALTH.start, color: "rgba(0,0,0,.2)" },
    { label: PERFORMANCE.benchmark, value: WEALTH.benchmark, color: "#000" },
    { label: PERFORMANCE.pms, value: WEALTH.queenbee, color: "#F6A11A" },
  ];
  return (
    <section id="performance" aria-labelledby="performance-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
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
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-[2px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="bg-white p-[32px] max-[600px]:p-[18px]">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <Legend />
              <span className={`${EYEBROW} rounded-full border border-[#F6A11A] px-[10px] py-[4px] text-black`}>{PERFORMANCE.asOf}</span>
            </div>
            <div className="mt-[28px] grid grid-cols-[92px_minmax(0,1fr)] gap-x-4 max-[600px]:grid-cols-[72px_minmax(0,1fr)]">
              <span />
              <div className="relative h-[18px]" aria-hidden="true">
                {TICKS.map((tick) => (
                  <span key={tick} className={`absolute -translate-x-1/2 text-[11px] tabular-nums ${tick === 0 ? "text-black" : "text-black/60"}`} style={{ left: `${((tick - LOW) / SPAN) * 100}%` }}>
                    {tick}
                  </span>
                ))}
              </div>
              {PERIOD_RETURNS.map((row, index) => (
                <div key={row.period} className="contents">
                  <span className="border-t border-black/10 py-[14px] text-[13px] leading-[1.3] text-black/70">{periodLabel(row.period)}</span>
                  <div className="relative flex flex-col justify-center gap-[5px] border-t border-black/10 py-[14px]">
                    <span className="absolute inset-y-0 w-px bg-black/40" style={{ left: `${ZERO}%` }} />
                    <Bar value={row.queenbee} color="#F6A11A" series={PERFORMANCE.pms} on={shown} delay={index * 60} />
                    <Bar value={row.benchmark} color="#000" series={PERFORMANCE.benchmark} on={shown} delay={index * 60 + 40} />
                  </div>
                </div>
              ))}
            </div>
            <p className={`${EYEBROW} mt-[18px] text-black/60`}>Returns in %. Periods above 1 year are CAGR.</p>
            {/* The content plan (§7) requires the deck's methodology and disclaimer with any performance figures. */}
            <p className="mt-[18px] border-t border-black/10 pt-[14px] text-[12px] leading-[1.55] text-black/60">
              {RECORD_METHOD} {RECORD_CAVEAT}
            </p>
          </div>
          <div className="flex flex-col bg-white p-[32px] max-[600px]:p-[18px]">
            <span className={`${EYEBROW} text-black/60`}>Rs. 1 Mn from August 2007 to July 2026, in Rs. Mn</span>
            <div className="mt-[28px] grid min-h-[300px] flex-1 grid-cols-3 items-end gap-[14px] border-b border-black/40">
              {columns.map((column, index) => (
                <div key={column.label} className="flex h-full flex-col justify-end">
                  <span className={`text-[clamp(1.4rem,1rem+1.2vw,2.2rem)] leading-none tracking-[-.04em] tabular-nums ${index === 2 ? "font-normal" : "font-light"} ${T}`} style={{ opacity: shown ? 1 : 0, transitionDelay: `${500 + index * 120}ms` }}>
                    <span className="sr-only">{column.label}: Rs. </span>
                    {column.value.toFixed(2)}
                    <span className="sr-only"> Mn</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-[10px] block origin-bottom transition-transform duration-1000 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:!transition-none"
                    style={{ height: `${Math.max(1.5, (column.value / wealthMax) * 220)}px`, transform: `scaleY(${shown ? 1 : 0})`, backgroundColor: column.color, transitionDelay: `${index * 120}ms` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-[12px] grid grid-cols-3 gap-[14px]">
              {columns.map((column) => (
                <span key={column.label} aria-hidden="true" className="text-[12px] leading-[1.35] text-black/70">
                  {column.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
