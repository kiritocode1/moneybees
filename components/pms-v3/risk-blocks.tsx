"use client";

import type { CSSProperties } from "react";
import { useShown } from "@/components/about-v2/shared";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { PMS_RISKS } from "@/lib/pms-v3-hero";
import { PERSON_HEIGHT, Standing } from "@/components/drawing/lookout";

/*
 * Risk Management as the measured stacked-blocks figure
 * (reference/visual-language/06/STUDY.md): four blocks in two-point
 * perspective, alternating sides, each with a leader
 * from its callout to the block's outer edge. Vertices are the study's
 * (06/moneybee.svg). The left callout column sits further left than the
 * study's so our type fits; the leaders keep their measured elbows.
 *
 * The callouts are HTML sized in container units, so they scale with the
 * drawing on desktop. Below md the drawing tightens around the tower with its
 * leaders and the callouts become a list under it.
 */

const LIT = "#F6A11A";
/** OKLCH L ×.8, C ×.8 of the orange. #8C5E22, the study's red-to-maroon step, read as a second, brown material. */
const SHADE = "#B77613";
const LEADER = "#9D9EA1";

const XL = 257.42;
const XR = 489.02;

type Side = "left" | "right";

/** Bottom block first. `start` and `elbow` are leader coordinates; `row` anchors the callout. */
const BLOCKS: readonly { lit: string; shade: string; side: Side; row: number; start: number; elbow: number }[] = [
  {
    lit: "257.42,567.30 373.24,590.16 373.24,610.78 257.42,586.92",
    shade: "257.42,567.30 372.62,552.33 489.02,567.22 489.02,586.93 373.24,610.78 373.24,590.16",
    side: "left",
    row: 435,
    start: 446.5,
    elbow: 576.85,
  },
  {
    lit: "257.42,508.10 373.24,518.55 373.24,560.04 257.42,542.13",
    shade: "257.42,508.10 371.21,496.69 489.02,508.15 489.02,542.20 373.24,560.04 373.24,518.55",
    side: "right",
    row: 435,
    start: 442.5,
    elbow: 524.9,
  },
  {
    lit: "257.42,366.45 373.24,351.15 373.24,498.99 257.42,492.47",
    shade: "373.24,351.15 489.02,366.26 489.02,492.57 373.24,498.99",
    side: "left",
    row: 195,
    start: 205.5,
    elbow: 376,
  },
  {
    lit: "257.42,167.03 373.24,124.52 373.24,330.18 257.42,349.92",
    shade: "373.24,124.52 489.02,167.01 489.02,349.84 371.48,361.72 257.42,349.92 373.24,330.18",
    side: "right",
    row: 195,
    start: 201,
    elbow: 283.4,
  },
];

/** The study's painter's order, D C A B: the eye level runs through B, so it paints last. */
const PAINT = [0, 1, 3, 2] as const;

/** Leader positions and the visible drawing area for each layout. */
const LAYOUTS = {
  wide: { left: 34, right: 533.8, viewBox: "0 88 746 536" },
  narrow: { left: 206, right: 540, viewBox: "176 88 395 536" },
} as const;

/** Bottom-up: block i rises 24 units into place, then its leader draws and its callout fades in. The figure on the roof comes last. */
const timing = (index: number) => ({ block: index * 120, leader: index * 120 + 450, callout: index * 120 + 550 });

function Tower({ layout, shown, t, className }: { layout: keyof typeof LAYOUTS; shown: boolean; t: (ms: number, delay?: number) => string; className: string }) {
  const { left, right, viewBox } = LAYOUTS[layout];
  const rise = (index: number): CSSProperties => ({
    transform: shown ? "none" : "translateY(24px)",
    opacity: shown ? 1 : 0,
    transition: `transform ${t(450, timing(index).block)}, opacity ${t(450, timing(index).block)}`,
  });
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false" className={className}>
      <g fill="none" stroke={LEADER} strokeWidth="1">
        {BLOCKS.map((block, index) => {
          const x = block.side === "left" ? left : right;
          return (
            <path
              key={index}
              d={`M${x},${block.start} V${block.elbow} H${block.side === "left" ? XL : XR}`}
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: shown ? 0 : 1, transition: `stroke-dashoffset ${t(300, timing(index).leader)}` }}
            />
          );
        })}
      </g>
      <g fill={SHADE}>
        {PAINT.map((index) => (
          <polygon key={index} points={BLOCKS[index].shade} style={rise(index)} />
        ))}
      </g>
      <g fill={LIT}>
        {PAINT.map((index) => (
          <polygon key={index} points={BLOCKS[index].lit} style={rise(index)} />
        ))}
      </g>
      {/* The study's plain standing figure on the roof, for scale. */}
      <g fill="#000" style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(400, timing(3).callout + 150)}` }}>
        {/* The study's 38-unit figure, feet at y 138.4 and centred on x 335. */}
        <g transform={`translate(337.2 138.4) scale(${(38 / PERSON_HEIGHT).toFixed(4)})`}>
          <Standing />
        </g>
      </g>
    </svg>
  );
}

/* Desktop text starts beside each vertical leader, in the wide drawing's units. */
const BOX: Record<Side, { left: string; width: string }> = {
  left: { left: `${(58 / 746) * 100}%`, width: `${(186 / 746) * 100}%` },
  right: { left: `${(557.8 / 746) * 100}%`, width: `${(188.2 / 746) * 100}%` },
};
const boxTop = (row: number) => `${((row - 0.84 * 24 - 88) / 536) * 100}%`;

export function RiskSection() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.35);
  return (
    <section id="risk" aria-labelledby="risk-heading" className="scroll-mt-[96px] bg-white text-black">
      <noscript>
        <style>{"[data-pv3-risk] [style]{opacity:1!important;transform:none!important;stroke-dashoffset:0!important}"}</style>
      </noscript>
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <BracketLabel>Risk management</BracketLabel>
        <h2 id="risk-heading" className={`mt-[18px] ${SUBHEAD}`}>
          Risk Management
        </h2>

        <div ref={ref} data-pv3-risk="" className="relative mx-auto mt-[56px] w-full max-w-[1000px] @container md:aspect-[746/536]">
          <Tower layout="wide" shown={shown} t={t} className="absolute inset-0 hidden h-full w-full md:block" />
          <Tower layout="narrow" shown={shown} t={t} className="mx-auto block h-auto w-full max-w-[420px] md:hidden" />

          <ol className="m-0 mt-10 list-none border-t border-black/10 p-0 md:mt-0 md:border-0">
            {PMS_RISKS.map((risk, index) => {
              const { side, row } = BLOCKS[index];
              return (
                <li
                  key={risk.name}
                  className="border-b border-black/10 py-[18px] md:absolute md:top-[var(--box-top)] md:left-[var(--box-left)] md:w-[var(--box-width)] md:border-0 md:py-0"
                  style={
                    {
                      "--box-left": BOX[side].left,
                      "--box-width": BOX[side].width,
                      "--box-top": boxTop(row),
                      opacity: shown ? 1 : 0,
                      transition: `opacity ${t(400, timing(index).callout)}`,
                    } as CSSProperties
                  }
                >
                  <h3 className="m-0 font-serif text-[22px] leading-[1.1] font-normal md:text-[2.279cqw]">{risk.name}</h3>
                  <p className="m-0 mt-[8px] text-[15px] leading-[1.5] text-black/70 md:text-[clamp(13px,1.45cqw,15px)]">{risk.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
