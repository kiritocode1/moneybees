"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BODY, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { HEADINGS, PERIOD_RETURNS, RECORD_LEAD, WEALTH } from "@/lib/insights";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { r2 } from "./fact-section";
import { useStageClock } from "./motion-language";

/*
 * Wealth creation, set like the intro under the hero: paragraphs beside a
 * figure, alternating sides row by row. Each figure draws itself when it
 * comes into view. The TWRR method note that used to sit under this section is
 * in the footer's legal lines.
 */

/** Rupees in millions, written the way the deck writes them: "Rs. 28.85 Mn". */
const rupees = (millions: number) => `Rs. ${millions.toFixed(2).replace(/\.00$/, "")} Mn`;
const pct = (value: number) => `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(2)}%`;

const byPeriod = (period: string) => {
  const row = PERIOD_RETURNS.find((item) => item.period === period);
  if (!row) throw new Error(`No "${period}" row in PERIOD_RETURNS`);
  return row;
};
const FIVE_YEAR = byPeriod("5 year");
const SINCE_INCEPTION = byPeriod("Since Inception");
const ONE_YEAR = byPeriod("1 year");

const RING_DOTS = 20;
const COUNT_FOR = 2.6;

/**
 * Dots on a tilted ellipse, turning, near dots larger than far ones and a few
 * hollow, one per holding in a typical portfolio. The figure in the middle
 * counts Rs. 1 Mn up to its July 2026 value once it is in view, then holds.
 */
function WealthRing() {
  const ref = useRef<HTMLDivElement>(null);
  const spin = useStageClock(ref, 0, 1000);
  const count = useStageClock(ref, COUNT_FOR);
  const eased = 1 - (1 - Math.min(1, count / COUNT_FOR)) ** 3;
  const value = WEALTH.start + (WEALTH.queenbee - WEALTH.start) * eased;
  const dots = Array.from({ length: RING_DOTS }, (_, index) => {
    const angle = (index / RING_DOTS) * Math.PI * 2 + spin * 0.35;
    const depth = (Math.sin(angle) + 1) / 2;
    return { index, x: r2(320 + Math.cos(angle) * 250), y: r2(200 + Math.sin(angle) * 110), r: r2(5 + depth * 10), depth };
  }).sort((a, b) => a.depth - b.depth);

  return (
    <div ref={ref} className="relative aspect-[640/400] w-full max-w-[640px]">
      <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {dots.map(({ index, x, y, r }) =>
          index % 7 === 3 ? (
            <circle key={index} cx={x} cy={y} r={r} fill="#fff" stroke="rgba(0,0,0,.35)" />
          ) : (
            <circle key={index} cx={x} cy={y} r={r} fill="#000" />
          ),
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[12px]">
        <span className={`${EYEBROW} text-black/55`}>{rupees(WEALTH.start)} in August 2007</span>
        <strong className="font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-none font-normal tabular-nums" aria-label={rupees(WEALTH.queenbee)}>
          {rupees(value)}
        </strong>
        <span className={`${EYEBROW} bg-[#F7F7F8] px-[9px] py-[5px] text-black`}>S&amp;P BSE 500 TRI: {rupees(WEALTH.benchmark)}</span>
      </div>
    </div>
  );
}

/** Short period names for the chart's axis. */
const SHORT: Record<string, string> = {
  "1 month": "1M",
  "3 months": "3M",
  "6 months": "6M",
  "1 year": "1Y",
  "3 year": "3Y",
  "5 year": "5Y",
  "Since Inception": "Since 2007",
};

const TOP = 36;
const BOTTOM = 372;
const LEFT = 64;
const RIGHT = 676;
const MAX = 20;
const MIN = -8;
const y = (value: number) => TOP + ((MAX - value) / (MAX - MIN)) * (BOTTOM - TOP);
const GROUP = (RIGHT - LEFT) / PERIOD_RETURNS.length;
const BAR = 24;

/**
 * Every period in the deck's table as a pair of bars, Moneybee PMS in orange
 * and the index in grey, growing out of the zero line once in view. The
 * one-year loss grows downward.
 */
function ReturnsBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const zero = y(0);

  const bar = (value: number, x: number, fill: string, delay: number) => (
    <motion.rect
      x={x}
      width={BAR}
      y={value >= 0 ? y(value) : zero}
      height={Math.abs(y(value) - zero)}
      fill={fill}
      style={{ transformBox: "fill-box", transformOrigin: value >= 0 ? "50% 100%" : "50% 0%" }}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: inView ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );

  return (
    <div ref={ref} className="w-full max-w-[680px]">
      <div className={`${EYEBROW} mb-[18px] flex gap-[20px] text-black/70`} aria-hidden="true">
        <span className="flex items-center gap-[8px]">
          <i className="h-[9px] w-[9px] bg-[#F7A11A]" />
          Moneybee PMS
        </span>
        <span className="flex items-center gap-[8px]">
          <i className="h-[9px] w-[9px] bg-[#9D9EA1]" />
          S&amp;P BSE 500 TRI
        </span>
      </div>
      <svg
        viewBox="0 0 680 420"
        role="img"
        aria-label={`Returns by period, Moneybee PMS against the S&P BSE 500 TRI: ${PERIOD_RETURNS.map((row) => `${row.period} ${pct(row.queenbee)} against ${pct(row.benchmark)}`).join(", ")}.`}
        className="block h-auto w-full overflow-visible"
      >
        {[20, 10, 0].map((tick) => (
          <g key={tick}>
            <line x1={LEFT} x2={RIGHT} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? "rgba(0,0,0,.5)" : "rgba(0,0,0,.18)"} strokeDasharray="2 5" strokeLinecap="round" />
            <text x={LEFT - 12} y={y(tick) + 4} textAnchor="end" className="fill-black/55 font-[family-name:var(--font-geist-mono)] text-[11px]">
              {tick}%
            </text>
          </g>
        ))}
        {PERIOD_RETURNS.map((row, index) => {
          const x = LEFT + GROUP * index + (GROUP - BAR * 2 - 4) / 2;
          const labelY = (value: number) => (value >= 0 ? y(value) - 8 : y(value) + 16);
          return (
            <g key={row.period}>
              {bar(row.queenbee, x, "#F7A11A", index * 0.08)}
              {bar(row.benchmark, x + BAR + 4, "#9D9EA1", index * 0.08 + 0.04)}
              <motion.text
                x={x + BAR / 2}
                y={labelY(row.queenbee)}
                textAnchor="middle"
                className="fill-black font-[family-name:var(--font-geist-mono)] text-[10px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.7 + index * 0.08 }}
              >
                {row.queenbee.toFixed(1)}
              </motion.text>
              <text
                x={x + BAR + 2}
                y={BOTTOM + 34}
                textAnchor="middle"
                className="fill-black/60 font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[.06em] uppercase"
              >
                {SHORT[row.period] ?? row.period}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Wealth creation by Moneybee PMS: two rows, text and figure trading sides. */
export default function RecordSection() {
  return (
    <section id="record" aria-labelledby="record-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-12 py-[100px] md:grid-cols-2`}>
        <Rise onView>
          <div className="flex flex-col gap-8">
            <h2 id="record-heading" className={SUBHEAD}>
              {HEADINGS.record}
            </h2>
            <p className={BODY}>{RECORD_LEAD}</p>
          </div>
        </Rise>
        <WealthRing />
      </div>
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-12 py-[100px] md:grid-cols-2`}>
        {/* Text first in the markup so phones read it before the chart; the chart takes the left on wide screens. */}
        <Rise onView>
          <div className="flex flex-col gap-5">
            <p className={BODY}>
              As on July 31, 2026, Moneybee PMS has returned {pct(FIVE_YEAR.queenbee)} a year over five years, against{" "}
              {pct(FIVE_YEAR.benchmark)} for the S&amp;P BSE 500 TRI. Since it began in August 2007, {pct(SINCE_INCEPTION.queenbee)} a year
              against {pct(SINCE_INCEPTION.benchmark)}.
            </p>
            <p className={BODY}>
              The last year was harder: down {pct(Math.abs(ONE_YEAR.queenbee))}, while the index rose {pct(ONE_YEAR.benchmark)}.
            </p>
          </div>
        </Rise>
        <div className="md:order-first">
          <ReturnsBars />
        </div>
      </div>
    </section>
  );
}
