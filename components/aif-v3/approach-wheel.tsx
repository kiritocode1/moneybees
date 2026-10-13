"use client";

import { useRef } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { AIF_APPROACH, type ApproachWheelContent } from "@/lib/pages/aif-content";
import { usePinnedProgress } from "./use-pinned-progress";

/*
 * "Investment Approach", content plan §4: the seven points as the rounded
 * wedge wheel of reference/visual-language/01 (pie sectors with their apexes
 * rounded off, parallel gaps), pinned while the reader scrolls. The points are
 * not data, so every wedge is the same length; scrolling lights them in turn,
 * the lit wedge is the one orange element, and the point takes the stage.
 * The points are edited in /admin; the wheel has one wedge per point.
 */

const ORANGE = "#F6A11A";
const CENTRE = 320;
const OUTER = 300;
const HOLE = 58;
/** Corner radius of every wedge, drawn as a round-joined stroke around an inset path. */
const CORNER = 18;
const GAP = 8;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const point = (radius: number, degrees: number) => `${(CENTRE + radius * Math.cos(toRadians(degrees))).toFixed(2)} ${(CENTRE + radius * Math.sin(toRadians(degrees))).toFixed(2)}`;

/**
 * One wedge, inset by the corner radius plus half the gap. The straight edges
 * stay parallel to the sector's radial edges, so the gap between wedges is
 * even from the hole to the rim.
 */
function wedgePath(index: number, count: number) {
  const sweep = 360 / count;
  // The first wedge is centred at twelve o'clock.
  const from = -90 - sweep / 2 + index * sweep;
  const to = from + sweep;
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

function Wheel({ steps, active }: { steps: readonly string[]; active: number | null }) {
  return (
    <svg viewBox="0 0 640 640" className="block h-auto w-full" role="img" aria-label={`Investment approach: ${steps.join(", ")}`}>
      {steps.map((_, index) => wedgePath(index, steps.length)).map((d, index) => {
        const state = active === null || index < active ? "done" : index === active ? "active" : "next";
        const fill = state === "active" ? ORANGE : state === "done" ? "#000000" : "#EDEDED";
        return (
          <g key={index}>
            <path d={d} fill={fill} stroke={fill} strokeWidth={CORNER * 2} strokeLinejoin="round" className="transition-[fill,stroke] duration-500 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none" />
          </g>
        );
      })}
    </svg>
  );
}

export function ApproachWheelSection({ content = AIF_APPROACH }: { content?: ApproachWheelContent }) {
  const steps = (content.steps ?? []).map(({ step }) => step);
  const ref = useRef<HTMLElement>(null);
  const { progress: p, pinned } = usePinnedProgress(ref);
  // Unpinned (phones, reduced motion) the wheel rests with every wedge complete and none lit.
  const active = Math.max(0, Math.min(steps.length - 1, Math.floor(p * steps.length)));
  return (
    <section ref={ref} id="approach" aria-labelledby="approach-heading" className="relative scroll-mt-[96px] bg-white text-black md:h-[380vh]">
      <div className="py-[96px] md:sticky md:top-0 md:flex md:h-screen md:items-center md:py-0">
        <div className={`${COLUMN} grid w-full grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-x-6`}>
          <div className="md:col-span-6">
            <div className="mx-auto w-full max-w-[min(72vh,600px)]">
              <Wheel steps={steps} active={pinned ? active : null} />
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            {content.label ? <BracketLabel>{content.label}</BracketLabel> : null}
            <h2 id="approach-heading" className={`${content.label ? "mt-[18px] " : ""}${SUBHEAD}`}>
              {content.heading}
            </h2>
            {/* Desktop: the lit point takes the stage. */}
            <div className="mt-[min(8vh,72px)] hidden md:block" aria-live="polite">
              <p key={active} className=" font-serif text-[clamp(2.6rem,1.4rem+2.8vw,4.6rem)] leading-[1.02] tracking-[-.02em] motion-safe:animate-[av3-rise_.6s_cubic-bezier(.23,1,.32,1)]">
                {steps[active]}
              </p>
              {content.line ? <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.5] text-black/70">{content.line}</p> : null}
            </div>
            <ol className="mt-[min(7vh,64px)] list-none border-t border-black/15 p-0">
              {steps.map((step, index) => (
                <li key={index} className={`flex items-baseline gap-4 border-b border-black/10 py-[10px] ${EYEBROW} transition-colors duration-300 ${pinned && index !== active ? "md:text-black/45" : ""} text-black`}>
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
