"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BODY, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { HEADINGS, PERIOD_RETURNS, RECORD_LEAD, WEALTH } from "@/lib/insights";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { FRONT_FROM, FRONT_TO, onCircle, path, type Point } from "@/components/iso/geometry";

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

/** Disc size in figure space. Every disc is Rs. 1 Mn; the top disc of a stack is cut to its fraction. */
const DISC_R = 62;
const DISC_H = 8.4;
const DROP = 0.05;

/** One disc's visible front wall and top face, centred on (cx, cy) in screen space. */
function disc(cx: number, cy: number, bottom: number, top: number) {
  const at = (angle: number, z: number): Point => {
    const [x, y] = onCircle(DISC_R, angle, z);
    return [cx + x, cy + y];
  };
  const front = (z: number) => Array.from({ length: 25 }, (_, i) => at(FRONT_FROM + ((FRONT_TO - FRONT_FROM) * i) / 24, z));
  return {
    wall: path([...front(top), ...front(bottom).reverse()]),
    top: path(Array.from({ length: 40 }, (_, i) => at((i / 40) * Math.PI * 2, top))),
  };
}

/** Whole discs, then the remaining fraction as a thinner last disc. */
function discHeights(value: number) {
  const whole = Math.floor(value);
  const rest = Math.round((value - whole) * 100) / 100;
  return [...Array.from({ length: whole }, () => 1), ...(rest > 0 ? [rest] : [])];
}

/**
 * Rs. 1 Mn from August 2007 as two stacks of discs, one disc per Rs. 1 Mn, in
 * the picks pyramid's projection: Moneybee PMS in orange rising to 28.85, the
 * S&P BSE 500 TRI in grey stopping at 5.97. Once in view the discs drop in one
 * at a time at the same pace, so the index's stack finishes early and
 * Moneybee's keeps climbing.
 */
function WealthStacks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const base = 452;
  const stacks = [
    { key: "index", name: "S&P BSE 500 TRI", value: WEALTH.benchmark, cx: 170, top: "#eeece8", wall: "#d8d6d1", edge: "rgba(0,0,0,.55)" },
    { key: "moneybee", name: "Moneybee PMS", value: WEALTH.queenbee, cx: 440, top: "#F7A11A", wall: "#d98c10", edge: "rgba(90,50,0,.7)" },
  ] as const;

  return (
    <div ref={ref} className="relative w-full max-w-[640px]">
      <svg
        viewBox="0 0 640 520"
        role="img"
        aria-label={`Rs. 1 Mn invested in August 2007: ${rupees(WEALTH.queenbee)} in Moneybee PMS by July 2026, against ${rupees(WEALTH.benchmark)} in the S&P BSE 500 TRI. One disc is Rs. 1 Mn.`}
        className="block h-auto w-full overflow-visible"
      >
        {stacks.map((stack) => {
          const heights = discHeights(stack.value);
          let z = 0;
          const discs = heights.map((height, index) => {
            const bottom = z;
            z += height * DISC_H;
            return { index, ...disc(stack.cx, base, bottom, z) };
          });
          const [, labelY] = onCircle(DISC_R, -Math.PI / 2, z);
          return (
            <g key={stack.key}>
              {/* Ground ring under each stack, as the pyramid sits on its own. */}
              <path
                d={path(Array.from({ length: 48 }, (_, i) => {
                  const [x, y] = onCircle(DISC_R + 26, (i / 48) * Math.PI * 2, 0);
                  return [stack.cx + x, base + y] as Point;
                }))}
                fill="none"
                stroke="rgba(0,0,0,.3)"
                strokeDasharray="2 7"
                strokeLinecap="round"
              />
              {discs.map(({ index, wall, top }) => (
                <motion.g
                  key={index}
                  initial={{ opacity: 0, y: -26 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -26 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : index * DROP, ease: [0.22, 1, 0.36, 1] }}
                >
                  <path d={wall} fill={stack.wall} stroke={stack.edge} strokeWidth="0.9" strokeLinejoin="round" />
                  <path d={top} fill={stack.top} stroke={stack.edge} strokeWidth="0.9" strokeLinejoin="round" />
                </motion.g>
              ))}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : heights.length * DROP + 0.2 }}
              >
                <text x={stack.cx} y={base + labelY - 52} textAnchor="middle" className="fill-black font-serif text-[34px]">
                  {rupees(stack.value)}
                </text>
                <text
                  x={stack.cx}
                  y={base + labelY - 30}
                  textAnchor="middle"
                  className="fill-black/60 font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[.1em] uppercase"
                >
                  {stack.name}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>
      <p className={`${EYEBROW} mt-[10px] text-center text-black/55`} aria-hidden="true">
        One disc is {rupees(WEALTH.start)}, August 2007 to July 2026
      </p>
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
        <WealthStacks />
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
