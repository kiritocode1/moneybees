"use client";

import { useRef } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { CATEGORY_III } from "@/lib/aif-v2";
import { stage, usePinnedProgress } from "./use-pinned-progress";

/*
 * "Why Category III AIF?", content plan §4, as a pinned scroll scene on black
 * in the Unit8 ring language (reference/visual-language/02). Two equal panels:
 * in the PMS each investor's securities land in their own demat account; in
 * the AIF the investors' money pools into one fund and each investor gets
 * units back. What the investor ends up holding is the orange element on
 * both sides, so neither product is lit over the other.
 */

const ORANGE = "#F6A11A";
const ROWS = [150, 280, 410] as const;
const INVESTOR = { x: 120, r: 36 };
const ACCOUNT = { x: 420, r: 54 };
const FUND = { x: 410, y: 280, r: 118 };
/** Four holdings per investor, as a 2 by 2 cluster. */
const CLUSTER = [
  [-12, -12],
  [12, -12],
  [-12, 12],
  [12, 12],
] as const;
/** The fund's pooled holdings, a 3 by 3 grid. */
const POOL = Array.from({ length: 9 }, (_, index) => [((index % 3) - 1) * 30, (Math.floor(index / 3) - 1) * 30] as const);
const MONO = "var(--font-geist-mono), ui-monospace, monospace";

/** Where the line from an investor meets the fund's ring. */
function fundEdge(y: number) {
  const dx = INVESTOR.x - FUND.x;
  const dy = y - FUND.y;
  const length = Math.hypot(dx, dy);
  return { x: FUND.x + (FUND.r * dx) / length, y: FUND.y + (FUND.r * dy) / length };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function ColumnLabel({ x, children }: { x: number; children: string }) {
  return (
    <text x={x} y={46} textAnchor="middle" fontSize={15} letterSpacing="0.12em" fill="#FFFFFF" fillOpacity={0.6} fontFamily={MONO}>
      {children}
    </text>
  );
}

/** A ring that draws itself on as `t` runs from 0 to 1. */
function DrawnRing({ cx, cy, r, t, width = 1.6 }: { cx: number; cy: number; r: number; t: number; width?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FFFFFF" strokeWidth={width} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} transform={`rotate(-90 ${cx} ${cy})`} />;
}

function PmsPanel({ p }: { p: number }) {
  return (
    <svg viewBox="0 0 600 520" className="block h-auto w-full md:h-[min(46vh,520px)] md:w-auto" aria-hidden="true">
      <ColumnLabel x={INVESTOR.x}>INVESTOR</ColumnLabel>
      <ColumnLabel x={ACCOUNT.x}>OWN DEMAT ACCOUNT</ColumnLabel>
      {ROWS.map((y, row) => {
        const ring = stage(p, 0.08 + row * 0.04, 0.3 + row * 0.04);
        const link = stage(p, 0.2 + row * 0.05, 0.42 + row * 0.05);
        const land = stage(p, 0.42 + row * 0.07, 0.66 + row * 0.07);
        return (
          <g key={y}>
            <DrawnRing cx={INVESTOR.x} cy={y} r={INVESTOR.r} t={ring} />
            <DrawnRing cx={ACCOUNT.x} cy={y} r={ACCOUNT.r} t={ring} />
            <line x1={INVESTOR.x + INVESTOR.r} y1={y} x2={ACCOUNT.x - ACCOUNT.r} y2={y} stroke="#FFFFFF" strokeWidth={1.2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - link} />
            {CLUSTER.map(([dx, dy]) => (
              <circle key={`${dx}${dy}`} cx={ACCOUNT.x + dx} cy={y + dy - 70 * (1 - land)} r={6} fill={ORANGE} opacity={land} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function AifPanel({ p }: { p: number }) {
  const fundRing = stage(p, 0.08, 0.32);
  const pooled = stage(p, 0.5, 0.66);
  return (
    <svg viewBox="0 0 600 520" className="block h-auto w-full md:h-[min(46vh,520px)] md:w-auto" aria-hidden="true">
      <ColumnLabel x={INVESTOR.x}>INVESTOR</ColumnLabel>
      <ColumnLabel x={FUND.x}>FUND</ColumnLabel>
      <DrawnRing cx={FUND.x} cy={FUND.y} r={FUND.r} t={fundRing} />
      {POOL.map(([dx, dy], index) => (
        <circle key={index} cx={FUND.x + dx} cy={FUND.y + dy} r={6 * pooled} fill="#FFFFFF" />
      ))}
      {ROWS.map((y, row) => {
        const edge = fundEdge(y);
        const ring = stage(p, 0.08 + row * 0.04, 0.3 + row * 0.04);
        const link = stage(p, 0.18 + row * 0.04, 0.38 + row * 0.04);
        // The investor's money travels in and is absorbed by the fund.
        const travel = stage(p, 0.3 + row * 0.04, 0.52 + row * 0.04);
        const absorbed = 1 - stage(p, 0.52 + row * 0.04, 0.6 + row * 0.04);
        // Units come back out to the investor.
        const units = stage(p, 0.66 + row * 0.06, 0.9 + row * 0.03);
        return (
          <g key={y}>
            <DrawnRing cx={INVESTOR.x} cy={y} r={INVESTOR.r} t={ring} />
            <line x1={INVESTOR.x + INVESTOR.r} y1={y} x2={edge.x} y2={edge.y} stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={1.2} strokeDasharray="2 6" strokeLinecap="round" opacity={link} />
            <circle cx={lerp(INVESTOR.x, FUND.x, travel)} cy={lerp(y, FUND.y, travel)} r={7} fill="#FFFFFF" opacity={travel > 0 ? absorbed : 0} />
            {CLUSTER.map(([dx, dy]) => (
              <circle key={`${dx}${dy}`} cx={lerp(FUND.x, INVESTOR.x + dx * 0.85, units)} cy={lerp(FUND.y, y + dy * 0.85, units)} r={5} fill={ORANGE} opacity={units > 0 ? 1 : 0} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/** The plan's explanation, filling from grey to white word by word as the scene plays. */
function FillingText({ text, p }: { text: string; p: number }) {
  const words = text.split(" ");
  return (
    <p className={`max-w-[560px] ${BODY}`}>
      {words.map((word, index) => (
        <span key={index} className="transition-colors duration-300" style={{ color: p >= 0.02 + (index / words.length) * 0.4 ? "#FFFFFF" : "#5A5A5A" }}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

export function PoolingSection() {
  const ref = useRef<HTMLElement>(null);
  const { progress: p } = usePinnedProgress(ref);
  return (
    <section ref={ref} id="category-iii" aria-labelledby="category-iii-heading" className="relative scroll-mt-[96px] bg-black text-white md:h-[300vh]">
      <div className="flex flex-col justify-center py-[96px] md:sticky md:top-0 md:h-screen md:overflow-hidden md:py-0">
        <div className={`${COLUMN} grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-x-6`}>
          <div className="md:col-span-5">
            <BracketLabel>Category III AIF</BracketLabel>
            <h2 id="category-iii-heading" className={`mt-[18px] ${SUBHEAD}`}>
              {CATEGORY_III.heading}
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <FillingText text={CATEGORY_III.text} p={p} />
          </div>
        </div>
        <div className={`${COLUMN} mt-12 grid grid-cols-1 md:mt-[min(6vh,64px)] md:grid-cols-2`}>
          {(
            [
              ["PMS", <PmsPanel key="pms" p={p} />],
              ["AIF", <AifPanel key="aif" p={p} />],
            ] as const
          ).map(([name, panel], index) => (
            <figure key={name} className={`m-0 flex flex-col items-center border-white/15 py-8 md:py-0 ${index ? "border-t md:border-t-0 md:border-l" : ""}`}>
              <figcaption className="w-full max-w-[600px] px-2 font-serif text-[clamp(2rem,1.4rem+1.6vw,3rem)] leading-none md:px-10">{name}</figcaption>
              <div className="mt-4 w-full max-w-[600px] md:flex md:justify-center">{panel}</div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
