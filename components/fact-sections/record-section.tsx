"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BODY, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Link from "@/components/transition/transition-link";
import LitRows from "@/components/motion/lit-rows";
import { RECORD, type RecordContent } from "@/lib/pages/home-content";
import { PMS_NAMES } from "@/lib/performance";
import { DECK_FIGURES, fillContent, monthYear, type PmsFigures, rupees } from "@/lib/site/tokens";
import { FRONT_FROM, FRONT_TO, onCircle, path, type Point } from "@/components/iso/geometry";

/*
 * Wealth creation, set like the intro under the hero: paragraphs beside a
 * figure, alternating sides row by row. Each figure draws itself when it
 * comes into view. The TWRR method note that used to sit under this section is
 * in the footer's legal lines. The words come from the Home page in /admin
 * and the figures from the latest published PMS fact sheet (lib/site/figures.ts);
 * without them, today's words and the deck's figures.
 */

/** The long periods, as the homepage shows them. */
const LONG_PERIODS = ["1 Year", "3 Years", "5 Years", "Since Inception"];

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
 * the picks pyramid's projection: Moneybee PMS in orange (28.85 in the deck),
 * the S&P BSE 500 TRI in grey (5.97). Once in view the discs drop in one at a
 * time at the same pace, so the index's stack finishes early and Moneybee's
 * keeps climbing.
 */
function WealthStacks({ wealth, asOf }: { wealth: PmsFigures["wealth"]; asOf: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const base = 452;
  const stacks = [
    { key: "index", name: "S&P BSE 500 TRI", value: wealth.benchmark, cx: 170, top: "#eeece8", wall: "#d8d6d1", edge: "rgba(0,0,0,.55)" },
    { key: "moneybee", name: "Moneybee PMS", value: wealth.ours, cx: 440, top: "#F6A11A", wall: "#d98c10", edge: "rgba(90,50,0,.7)" },
  ] as const;

  return (
    <div ref={ref} className="relative w-full max-w-[640px]">
      <svg
        viewBox="0 0 640 520"
        role="img"
        aria-label={`Rs. 1 Mn invested in August 2007: ${rupees(wealth.ours)} in Moneybee PMS by ${monthYear(asOf)}, against ${rupees(wealth.benchmark)} in the S&P BSE 500 TRI. One disc is Rs. 1 Mn.`}
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
        One disc is {rupees(wealth.start)}, August 2007 to {monthYear(asOf)}
      </p>
    </div>
  );
}

/** Wealth creation by Moneybee PMS: two rows, text and figure trading sides. */
export default function RecordSection({
  figures = DECK_FIGURES,
  content = fillContent(RECORD, figures),
}: {
  figures?: PmsFigures;
  content?: RecordContent;
}) {
  const { more = {} } = content;
  return (
    <section id="record" aria-labelledby="record-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-12 py-[100px] md:grid-cols-2`}>
        <Rise onView>
          <div className="flex flex-col gap-8">
            {content.eyebrow ? <span className={`${EYEBROW} text-black/60`}>{content.eyebrow}</span> : null}
            <h2 id="record-heading" className={SUBHEAD}>
              {content.heading}
            </h2>
            {content.lead ? <p className={BODY}>{content.lead}</p> : null}
          </div>
        </Rise>
        <WealthStacks wealth={figures.wealth} asOf={figures.asOf} />
      </div>
      <DashedRule />
      {/* The plan's performance highlight: the lit rows /pms opens with, for the long periods. */}
      <div className={`${COLUMN} py-[100px]`}>
        <LitRows rows={figures.rows.filter((row) => LONG_PERIODS.includes(row.period))} names={PMS_NAMES} />
        {more.label && more.link ? (
          <Link href={more.link} className="mt-10 inline-flex text-[15px] font-medium text-black underline decoration-[#F6A11A] decoration-2 underline-offset-[6px]">
            {more.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
