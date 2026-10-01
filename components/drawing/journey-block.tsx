"use client";

import { useId } from "react";
import { useShown } from "@/components/about-v2/shared";

/*
 * Three steps as study 07 (reference/visual-language/07/STUDY.md): a solid of
 * three boxes meeting at a corner in a parallel dimetric projection at 20.6°,
 * lit top and lower-left faces, shaded lower-right faces, a figure walking
 * along the lowest box, and three numbered callouts tied to the solid by
 * one-elbow leaders. The walk runs from the low bar (step 1) past the arm
 * (step 2) to the tall column (step 3). The heights are the study's ratios
 * (3.30 : 1.87 : 1) and encode no figures. Used by the /about timeline.
 */

const W = 1000;
const H = 560;
/** The study's projection at 1.5×: one footprint unit is 51.5 × 1.5 units across, 19.35 × 1.5 down, 67.5 × 1.5 per unit of height. */
const UX = 77.25;
const UY = 29.03;
const UZ = 101.25;
const ORIGIN = [470, 340] as const;

type P3 = readonly [u: number, v: number, z: number];
const at = ([u, v, z]: P3) => [ORIGIN[0] + UX * (u - v), ORIGIN[1] + UY * (u + v) - UZ * z] as const;
const poly = (points: P3[]) => points.map((point) => at(point).map((value) => value.toFixed(1)).join(",")).join(" ");

const COLUMN = 3.09;
const ARM = 1.74;
const BAR = 0.93;
const BAR_END = 3.4;

/** Visible faces, back to front, from the study's face list. */
const FACES: { points: P3[]; lit: boolean }[] = [
  // Column: top, front-left (v = 1), right face above the arm.
  { lit: true, points: [[0, 0, COLUMN], [1, 0, COLUMN], [1, 1, COLUMN], [0, 1, COLUMN]] },
  { lit: true, points: [[0, 1, 0], [1, 1, 0], [1, 1, COLUMN], [0, 1, COLUMN]] },
  { lit: false, points: [[1, 0, ARM], [1, 1, ARM], [1, 1, COLUMN], [1, 0, COLUMN]] },
  // Arm: top beyond the column, front-left, end face.
  { lit: true, points: [[1, 0, ARM], [3, 0, ARM], [3, 1, ARM], [1, 1, ARM]] },
  { lit: true, points: [[1, 1, 0], [3, 1, 0], [3, 1, ARM], [1, 1, ARM]] },
  { lit: false, points: [[3, 0, 0], [3, 1, 0], [3, 1, ARM], [3, 0, ARM]] },
  // Bar, in front: top, end face (v = 3.4), long face (u = 2).
  { lit: true, points: [[1, 1, BAR], [2, 1, BAR], [2, BAR_END, BAR], [1, BAR_END, BAR]] },
  { lit: true, points: [[1, BAR_END, 0], [2, BAR_END, 0], [2, BAR_END, BAR], [1, BAR_END, BAR]] },
  { lit: false, points: [[2, 1, 0], [2, BAR_END, 0], [2, BAR_END, BAR], [2, 1, BAR]] },
];

const BAR_TOP: P3[] = [[1, 1, BAR], [2, 1, BAR], [2, BAR_END, BAR], [1, BAR_END, BAR]];

/**
 * Where each callout sits (its numeral's top-left, in artboard units) and the
 * silhouette edge its leader ends on, at the study's fraction down that edge.
 */
const CALLOUTS = [
  { left: 20, top: 262, width: 236, edge: [[1, BAR_END, BAR], [1, BAR_END, 0]] as const, down: 0.69 },
  { left: 752, top: 296, width: 236, edge: [[3, 0, ARM], [3, 0, 0]] as const, down: 0.92 },
  { left: 590, top: 26, width: 300, edge: [[1, 0, COLUMN], [1, 0, ARM]] as const, down: 0.72 },
] as const;

/** One callout: its large mark (07's numeral, or a year), an optional title beside it, and its text. */
export type JourneyStep = { mark: string; title?: string; text: string };

/** The leader's vertical runs this far right of the callout's left edge, under the numeral's centre. */
const LEADER_X = 16;
/** It starts this far below the callout's top, under the numeral. */
const LEADER_TOP = 50;

const target = (edge: readonly [P3, P3], down: number) => {
  const [a, b] = [at(edge[0]), at(edge[1])];
  return [a[0] + (b[0] - a[0]) * down, a[1] + (b[1] - a[1]) * down] as const;
};

/** A figure walking to the right, feet at the origin, 100 units tall. */
function Walker() {
  return (
    <g fill="#000">
      <circle cx="3" cy="-91" r="7.2" />
      <path d="M-4.5-82.5H8.5L7-49H-4Z" />
      <path d="M-4-51.5H1.5L-10.5-.5H-16.5Z" />
      <path d="M1-51.5H6.5L15.5-.5H9.5Z" />
      <path d="M-16.5-3H-8.5L-9.5 0H-17.5Z" />
      <path d="M9.5-3H18.5L19 0H9.8Z" />
      <path d="M-3-79-9-58" stroke="#000" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M7-79 12-59" stroke="#000" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  );
}

type Tone = "light" | "black" | "orange";

const PALETTE: Record<Tone, { lit: string; shade: string; ink: string; leader: string; muted: string }> = {
  light: { lit: "#F6A11A", shade: "#8C5E22", ink: "#000", leader: "rgba(0,0,0,.4)", muted: "text-black/60" },
  black: { lit: "#F6A11A", shade: "#8C5E22", ink: "#fff", leader: "rgba(255,255,255,.45)", muted: "text-white/65" },
  orange: { lit: "#FFFFFF", shade: "#B77613", ink: "#000", leader: "rgba(0,0,0,.45)", muted: "text-black/65" },
};

function Solid({ tone, shown, t, viewBox }: { tone: Tone; shown: boolean; t: (ms: number, delay?: number) => string; viewBox: string }) {
  const clip = useId();
  const colours = PALETTE[tone];
  const feet = at([1.37, 2.99, BAR]);
  // The study's figure is 0.77 of a unit tall; its shadow runs 1.24 figure heights at 15.5° below level.
  const tall = 0.767 * UX;
  const reach = tall * 1.24;
  return (
    <svg viewBox={viewBox} className="block h-full w-full overflow-visible" aria-hidden="true">
      <g style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(24px)", transition: `opacity ${t(500)}, transform ${t(900)}` }}>
        {FACES.map((face, index) => (
          <polygon key={index} points={poly(face.points)} fill={face.lit ? colours.lit : colours.shade} stroke={face.lit ? colours.lit : colours.shade} strokeWidth={0.6} strokeLinejoin="round" />
        ))}
      </g>
      <g style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(500, 900)}` }}>
        <clipPath id={clip}>
          <polygon points={poly(BAR_TOP)} />
        </clipPath>
        <path
          clipPath={`url(#${clip})`}
          d={`M${feet[0] - 3} ${feet[1] - 1.5}L${feet[0] + reach * 0.964} ${feet[1] + reach * 0.267 - 3}L${feet[0] + reach} ${feet[1] + reach * 0.267 + 3}L${feet[0] - 2} ${feet[1] + 2}Z`}
          fill={colours.shade}
        />
        <g transform={`translate(${feet[0]} ${feet[1]}) scale(${tall / 100})`}>
          <Walker />
        </g>
      </g>
    </svg>
  );
}

/** Desktop: the solid with all three callouts on a fixed artboard. Phones: the solid alone, the lines listed under it. */
export function JourneyBlock({ steps, tone }: { steps: readonly [JourneyStep, JourneyStep, JourneyStep]; tone: Tone }) {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.35);
  const colours = PALETTE[tone];
  return (
    <div ref={ref} className="h-full">
      {/* The artboard takes the largest 1000:560 box its slot allows, so the callouts stay on their leaders. */}
      <div className="hidden h-full w-full items-center justify-center [container-type:size] lg:flex">
      <div className="relative aspect-[1000/560] w-[min(100cqw,calc(100cqh*1000/560))] [container-type:inline-size]">
        <Solid tone={tone} shown={shown} t={t} viewBox={`0 0 ${W} ${H}`} />
        <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {CALLOUTS.map((callout, index) => {
            const [x, y] = target(callout.edge, callout.down);
            const vx = callout.left + LEADER_X;
            return (
              <path
                key={index}
                d={`M${vx} ${callout.top + LEADER_TOP}V${y.toFixed(1)}H${x.toFixed(1)}`}
                fill="none"
                stroke={colours.leader}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1 1"
                style={{ strokeDashoffset: shown ? 0 : 1, transition: `stroke-dashoffset ${t(700, 1100 + index * 180)}` }}
              />
            );
          })}
        </svg>
        <dl className="absolute inset-0 m-0">
          {CALLOUTS.map((callout, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: `${(callout.left / W) * 100}%`,
                top: `${(callout.top / H) * 100}%`,
                width: `${(callout.width / W) * 100}%`,
                opacity: shown ? 1 : 0,
                transition: `opacity ${t(500, 1000 + index * 180)}`,
              }}
            >
              <dt className="flex items-baseline gap-[.6em]">
                <span className="font-sans text-[clamp(18px,2.6cqw,32px)] leading-none font-semibold tracking-[-.02em] whitespace-nowrap">{steps[index].mark}</span>
                {steps[index].title ? <span className="text-[clamp(11px,1.15cqw,13px)] font-semibold">{steps[index].title}</span> : null}
              </dt>
              <dd className={`m-0 mt-[.8em] pl-[3.2cqw] text-[clamp(11px,1.35cqw,15px)] leading-[1.45] ${colours.muted}`}>{steps[index].text}</dd>
            </div>
          ))}
        </dl>
      </div>
      </div>
      <div className="lg:hidden">
        <div className="mx-auto h-[24svh] max-h-[220px]">
          <Solid tone={tone} shown={shown} t={t} viewBox="270 20 450 485" />
        </div>
        <dl className="m-0 mt-4">
          {steps.map((step) => (
            <div key={step.mark} className="border-t border-current/25 py-[9px]">
              <dt className="flex items-baseline gap-2 text-[12px] font-semibold">
                <span>{step.mark}</span>
                {step.title}
              </dt>
              <dd className={`m-0 mt-1 text-[13px] leading-[1.4] ${colours.muted}`}>{step.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
