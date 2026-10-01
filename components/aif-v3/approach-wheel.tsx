"use client";

import { useRef } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { AIF_LOREM, APPROACH_STEPS } from "@/lib/aif-v2";
import { usePinnedProgress } from "./use-pinned-progress";

/*
 * "Investment Approach", content plan §4: the seven points as the rounded
 * wedge wheel of reference/visual-language/01 (pie sectors with their apexes
 * rounded off, parallel gaps), pinned while the reader scrolls. The points are
 * not data, so every wedge is the same length; scrolling lights them in turn,
 * the lit wedge is the one orange element, and the point takes the stage.
 */

const ORANGE = "#F6A11A";
const CENTRE = 320;
const OUTER = 300;
const HOLE = 58;
/** Corner radius of every wedge, drawn as a round-joined stroke around an inset path. */
const CORNER = 18;
const GAP = 8;
const SWEEP = 360 / APPROACH_STEPS.length;
/** The first wedge is centred at twelve o'clock. */
const START = -90 - SWEEP / 2;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const point = (radius: number, degrees: number) => `${(CENTRE + radius * Math.cos(toRadians(degrees))).toFixed(2)} ${(CENTRE + radius * Math.sin(toRadians(degrees))).toFixed(2)}`;

/**
 * One wedge, inset by the corner radius plus half the gap. The straight edges
 * stay parallel to the sector's radial edges, so the gap between wedges is
 * even from the hole to the rim.
 */
function wedgePath(index: number) {
  const from = START + index * SWEEP;
  const to = from + SWEEP;
  const inset = CORNER + GAP / 2;
  const inner = HOLE + CORNER;
  const outer = OUTER - CORNER;
  const shift = (radius: number) => (Math.asin(inset / radius) * 180) / Math.PI;
  return [
    `M${point(inner, from + shift(inner))}`,
    `L${point(outer, from + shift(outer))}`,
    `A${outer} ${outer} 0 0 1 ${point(outer, to - shift(outer))}`,
    `L${point(inner, to - shift(inner))}`,
    `A${inner} ${inner} 0 0 0 ${point(inner, from + shift(inner))}`,
    "Z",
  ].join(" ");
}

const WEDGES = APPROACH_STEPS.map((_, index) => wedgePath(index));
const number = (index: number) => String(index + 1).padStart(2, "0");

function Wheel({ active }: { active: number | null }) {
  return (
    <svg viewBox="0 0 640 640" className="block h-auto w-full" role="img" aria-label={`Investment approach: ${APPROACH_STEPS.join(", ")}`}>
      {WEDGES.map((d, index) => {
        const state = active === null || index < active ? "done" : index === active ? "active" : "next";
        const fill = state === "active" ? ORANGE : state === "done" ? "#000000" : "#EDEDED";
        const ink = state === "active" ? "#000000" : state === "done" ? "#FFFFFF" : "#767676";
        const mid = START + (index + 0.5) * SWEEP;
        return (
          <g key={index}>
            <path d={d} fill={fill} stroke={fill} strokeWidth={CORNER * 2} strokeLinejoin="round" className="transition-[fill,stroke] duration-500 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none" />
            <text x={CENTRE + 206 * Math.cos(toRadians(mid))} y={CENTRE + 206 * Math.sin(toRadians(mid)) + 6} textAnchor="middle" fontSize={17} letterSpacing="0.08em" fill={ink} fontFamily="var(--font-geist-mono), ui-monospace, monospace" className="transition-[fill] duration-500">
              {number(index)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ApproachWheelSection() {
  const ref = useRef<HTMLElement>(null);
  const { progress: p, pinned } = usePinnedProgress(ref);
  // Unpinned (phones, reduced motion) the wheel rests with every wedge complete and none lit.
  const active = Math.min(APPROACH_STEPS.length - 1, Math.floor(p * APPROACH_STEPS.length));
  return (
    <section ref={ref} id="approach" aria-labelledby="approach-heading" className="relative scroll-mt-[96px] bg-white text-black md:h-[380vh]">
      <div className="py-[96px] md:sticky md:top-0 md:flex md:h-screen md:items-center md:py-0">
        <div className={`${COLUMN} grid w-full grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-x-6`}>
          <div className="md:col-span-6">
            <div className="mx-auto w-full max-w-[min(72vh,600px)]">
              <Wheel active={pinned ? active : null} />
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <BracketLabel>Flyingbee</BracketLabel>
            <h2 id="approach-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Investment Approach
            </h2>
            {/* Desktop: the lit point takes the stage. */}
            <div className="mt-[min(8vh,72px)] hidden md:block" aria-live="polite">
              <p className={`${EYEBROW} tabular-nums text-black/55`}>
                <span className="text-black">{number(active)}</span> / {number(APPROACH_STEPS.length - 1)}
              </p>
              <p key={active} className="mt-4 font-serif text-[clamp(2.6rem,1.4rem+2.8vw,4.6rem)] leading-[1.02] tracking-[-.02em] motion-safe:animate-[av3-rise_.6s_cubic-bezier(.23,1,.32,1)]">
                {APPROACH_STEPS[active]}
              </p>
              <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.5] text-black/70">{AIF_LOREM.short}</p>
            </div>
            <ol className="mt-[min(7vh,64px)] list-none border-t border-black/15 p-0">
              {APPROACH_STEPS.map((step, index) => (
                <li key={step} className={`flex items-baseline gap-4 border-b border-black/10 py-[10px] ${EYEBROW} transition-colors duration-300 ${pinned && index !== active ? "md:text-black/45" : ""} text-black`}>
                  <span className="w-6 tabular-nums">{number(index)}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <style>{"@keyframes av3-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}"}</style>
    </section>
  );
}
