"use client";

import { useId } from "react";
import { useShown } from "@/components/about-v2/shared";
import { Person, PERSON_HEIGHT } from "@/components/drawing/lookout";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { GROWTH, PERFORMANCE, PERFORMANCE_LOREM, PMS_NAMES } from "@/lib/performance";

/*
 * Wealth growth (content plan §7, "Wealth-growth illustration") in study 08's
 * language (reference/visual-language/08/STUDY.md): discs on one axis with
 * 2.24-unit gaps, a white arrow from each disc's left edge to its centre with
 * a fixed-size 45° chevron, the lookout standing just inside the top of the
 * result, its shadow cast right and clipped to the disc, and a text column
 * under each disc starting 0.9 of the first radius left of that disc's centre.
 *
 * Unlike the reference, sizes are area-true: Rs. 1 Mn, and what it became in
 * the S&P BSE 500 TRI and in Moneybee PMS by July 2026 (lib/insights WEALTH).
 * They are two outcomes of the same Rs. 1 Mn, so they are two progressions on
 * one axis, each starting from its own Rs. 1 Mn disc, and never one chain.
 */

const D0 = 60;
const GAP = 2.24;
/** Room between the two progressions on the shared axis. */
const BETWEEN = 96;
const CHEVRON = 12;
const GREY = "#9D9EA1";
const ORANGE = "#F6A11A";

type Disc = { key: string; x: number; r: number; fill: string; value: number; name: string; date: string };

const radius = (value: number) => (D0 / 2) * Math.sqrt(value / GROWTH.start);

/** A Rs. 1 Mn disc at `left`, then its outcome beside it. */
function progression(key: string, left: number, value: number, name: string, fill: string): Disc[] {
  const r = radius(value);
  return [
    { key: `${key}-start`, x: left + D0 / 2, r: D0 / 2, fill: GREY, value: GROWTH.start, name: "Invested", date: GROWTH.from },
    { key: `${key}-end`, x: left + D0 + GAP + r, r, fill, value, name, date: GROWTH.to },
  ];
}

const benchmark = (left: number) => progression("benchmark", left, GROWTH.benchmark, PMS_NAMES.benchmark, "#000");
const ours = (left: number) => progression("ours", left, GROWTH.ours, PMS_NAMES.ours, ORANGE);

const BENCHMARK = benchmark(0);
/** Desktop: both progressions on one axis. */
const WIDE = [...BENCHMARK, ...ours(BENCHMARK[1].x + BENCHMARK[1].r + BETWEEN)];

const NARROW = [BENCHMARK, ours(0)];

const label = (disc: Disc) => `Rs. ${disc.value} Mn`;

function frame(discs: Disc[]) {
  const right = Math.max(...discs.map((disc) => disc.x + disc.r));
  const tallest = Math.max(...discs.map((disc) => disc.r));
  const figure = discs.some((disc) => disc.fill === ORANGE) ? tallest * 0.5 : 0;
  return { x: -4, y: -tallest - figure - 4, w: right + 8, h: tallest * 2 + figure + 8 };
}

const NARROW_WIDTH = Math.max(...NARROW.map((discs) => frame(discs).w));

type Motion = { shown: boolean; t: (ms: number, delay?: number) => string };

function Discs({ discs, motion, className }: { discs: Disc[]; motion: Motion; className?: string }) {
  const clip = useId();
  const box = frame(discs);
  const { shown, t } = motion;
  return (
    <svg viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} className={`block h-auto w-full overflow-visible ${className ?? ""}`} aria-hidden="true">
      {discs.map((disc, index) => {
        const delay = index * 220;
        const tip = disc.x - 0.7;
        const result = disc.fill === ORANGE;
        // 08: the lookout is 21% of its disc's diameter, feet 6.3% of r left of centre and 7.4% of r inside the top.
        const scale = (disc.r * 2 * 0.21) / PERSON_HEIGHT;
        const feet = [disc.x - disc.r * 0.063, -disc.r + disc.r * 0.074] as const;
        const shadow = disc.r * 2 * 0.21 * 1.7;
        return (
          <g key={disc.key}>
            <circle cx={disc.x} cy={0} r={disc.r} fill={disc.fill} style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "scale(.2)", transformBox: "fill-box", transformOrigin: "center", transition: `opacity ${t(380, delay)}, transform ${t(820, delay)}` }} />
            <path d={`M${disc.x - disc.r} 0H${tip}`} fill="none" stroke="#fff" strokeWidth={1} pathLength={1} strokeDasharray="1 1" style={{ strokeDashoffset: shown ? 0 : 1, transition: `stroke-dashoffset ${t(520, delay + 520)}` }} />
            <path d={`M${tip - CHEVRON} ${-CHEVRON}L${tip} 0L${tip - CHEVRON} ${CHEVRON}`} fill="none" stroke="#fff" strokeWidth={1} style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(240, delay + 960)}` }} />
            {result ? (
              <g style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(500, discs.length * 220 + 900)}` }}>
                <clipPath id={clip}>
                  <circle cx={disc.x} cy={0} r={disc.r} />
                </clipPath>
                {/* The shadow runs 1.7 figure heights to the right, about 9° below level, a thin streak ending in the telescope's blob, clipped to the disc. */}
                <g clipPath={`url(#${clip})`} fill="#000" fillOpacity={0.85}>
                  <path d={`M${feet[0] - 1} ${feet[1] - 0.6}L${feet[0] + shadow * 0.988} ${feet[1] + shadow * 0.156 - 0.5}L${feet[0] + shadow * 0.988} ${feet[1] + shadow * 0.156 + 1.1}L${feet[0] - 1} ${feet[1] + 1.4}Z`} />
                  <ellipse cx={feet[0] + shadow} cy={feet[1] + shadow * 0.158 + 0.3} rx={disc.r * 0.035} ry={disc.r * 0.012} />
                </g>
                <g transform={`translate(${feet[0]} ${feet[1]}) scale(${scale})`}>
                  <Person />
                </g>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** The text column under each disc, starting 0.9 of the first radius left of the disc's centre. */
function Columns({ discs, motion }: { discs: Disc[]; motion: Motion }) {
  const box = frame(discs);
  const { shown, t } = motion;
  return (
    <div className="relative mt-8 h-[124px]">
      {discs.map((disc, index) => (
        <div
          key={disc.key}
          className="absolute top-0"
          style={{ left: `${((disc.x - 0.9 * (D0 / 2) - box.x) / box.w) * 100}%`, opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(8px)", transition: `opacity ${t(420, 700 + index * 120)}, transform ${t(600, 700 + index * 120)}` }}
        >
          <p className={`m-0 font-serif leading-none tracking-[-.02em] whitespace-nowrap ${disc.fill === GREY ? "text-[clamp(1.25rem,1rem+.8vw,1.75rem)]" : "text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)]"}`}>{label(disc)}</p>
          <p className="m-0 mt-3 text-[14px] leading-[1.35] whitespace-nowrap text-black/80">{disc.name}</p>
          <p className={`${EYEBROW} m-0 mt-2 text-black/60`}>{disc.date}</p>
        </div>
      ))}
    </div>
  );
}

export function WealthDiscs() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.3);
  const motion = { shown, t };
  return (
    <section id="wealth" aria-labelledby="wealth-heading" className="scroll-mt-[96px] bg-[#F6F6F6] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Wealth growth</BracketLabel>
            <h2 id="wealth-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Wealth Growth
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{PERFORMANCE_LOREM.long}</p>
        </div>
        <p className="mt-[40px]">
          <span className={`${EYEBROW} inline-flex items-center gap-[10px] border border-black/20 px-[12px] py-[7px] text-[11px] text-black`}>
            <i className="h-[8px] w-[8px] bg-[#F6A11A]" aria-hidden="true" />
            {PERFORMANCE.asOf}
          </span>
        </p>
        <div
          ref={ref}
          role="img"
          aria-label={`Rs. ${GROWTH.start} Mn invested in ${GROWTH.from} was worth Rs. ${GROWTH.ours} Mn in ${PMS_NAMES.ours} and Rs. ${GROWTH.benchmark} Mn in the ${PMS_NAMES.benchmark} by ${GROWTH.to}.`}
          className="mt-16"
        >
          <div className="mx-auto max-w-[940px] max-md:hidden">
            <Discs discs={WIDE} motion={motion} />
            <Columns discs={WIDE} motion={motion} />
          </div>
          {/* Phones: one progression per row, both at the same scale so the areas still compare. */}
          <div className="flex flex-col gap-14 md:hidden">
            {NARROW.map((discs) => (
              <div key={discs[1].key} style={{ width: `${(frame(discs).w / NARROW_WIDTH) * 100}%` }}>
                <Discs discs={discs} motion={motion} />
                <Columns discs={discs} motion={motion} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
