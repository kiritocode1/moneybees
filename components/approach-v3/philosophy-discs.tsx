"use client";

import { useId } from "react";
import { useShown } from "@/components/about-v2/shared";
import { Person, PERSON_HEIGHT } from "@/components/drawing/lookout";
import { BODY, COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { APPROACH_LOREM, PHILOSOPHY_STAGES } from "@/lib/approach";

/*
 * The core philosophy (content plan §6, UNDISCOVERED → UNDER-RESEARCHED →
 * UNDER-ESTIMATED) as study 08 (reference/visual-language/08/STUDY.md):
 * discs on one axis growing by the study's constant 35.47-unit step, 2.24
 * apart, a white arrow from each left edge to its centre with a fixed 45°
 * chevron, the lookout on the last disc with its shadow, and a column under
 * each disc starting 31.3 units left of that disc's centre. The discs grow as
 * a company moves from unnoticed to undervalued; the lookout stands where the
 * market is not yet looking. Nothing here is data, so the linear step stands.
 */

const DIAMETERS = [104.72, 140.19, 175.68];
const GAP = 2.24;
const CHEVRON = 16.5;
const DISCS = DIAMETERS.map((d, index) => ({ r: d / 2, x: DIAMETERS.slice(0, index).reduce((sum, value) => sum + value + GAP, 0) + d / 2 }));
const LAST = DISCS[DISCS.length - 1];
const BOX = { x: -4, y: -LAST.r - 0.21 * LAST.r * 2 - 14, w: LAST.x + LAST.r + 8, h: LAST.r * 2 + 0.42 * LAST.r + 18 };

function Discs({ shown, t }: { shown: boolean; t: (ms: number, delay?: number) => string }) {
  const clip = useId();
  const tall = LAST.r * 2 * 0.21;
  const feet = [LAST.x - 5.5, -LAST.r + 6.5] as const;
  const shadow = tall * 1.7;
  return (
    <svg viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
      {DISCS.map((disc, index) => {
        const tip = disc.x - 0.7;
        const delay = index * 180;
        return (
          <g key={disc.x}>
            <circle cx={disc.x} cy={0} r={disc.r} fill="#F6A11A" style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "scale(.2)", transformBox: "fill-box", transformOrigin: "center", transition: `opacity ${t(380, delay)}, transform ${t(800, delay)}` }} />
            <path d={`M${disc.x - disc.r} 0H${tip}`} stroke="#fff" strokeWidth={0.95} pathLength={1} strokeDasharray="1 1" style={{ strokeDashoffset: shown ? 0 : 1, transition: `stroke-dashoffset ${t(460, delay + 480)}` }} />
            <path d={`M${tip - CHEVRON} ${-CHEVRON}L${tip} 0L${tip - CHEVRON} ${CHEVRON}`} fill="none" stroke="#fff" strokeWidth={0.95} style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(240, delay + 880)}` }} />
          </g>
        );
      })}
      <g style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(500, 1500)}` }}>
        <clipPath id={clip}>
          <circle cx={LAST.x} cy={0} r={LAST.r} />
        </clipPath>
        <g clipPath={`url(#${clip})`} fill="#000" fillOpacity={0.85}>
          <path d={`M${feet[0] - 1} ${feet[1] - 0.5}L${feet[0] + shadow * 0.988} ${feet[1] + shadow * 0.156 - 0.4}L${feet[0] + shadow * 0.988} ${feet[1] + shadow * 0.156 + 0.9}L${feet[0] - 1} ${feet[1] + 1.2}Z`} />
          <ellipse cx={feet[0] + shadow} cy={feet[1] + shadow * 0.158 + 0.2} rx={3} ry={1} />
        </g>
        <g transform={`translate(${feet[0]} ${feet[1]}) scale(${tall / PERSON_HEIGHT})`}>
          <Person />
        </g>
      </g>
    </svg>
  );
}

export function PhilosophyDiscs() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="philosophy" aria-labelledby="philosophy-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <h2 id="philosophy-heading" className={`m-0 ${SUBHEAD}`}>
            Core Philosophy
          </h2>
          <p className={`text-black/70 ${BODY}`}>{APPROACH_LOREM.long}</p>
        </div>
        <div ref={ref} className="mx-auto mt-[64px] max-w-[860px]">
          <Discs shown={shown} t={t} />
          {/* Desktop: a column under each disc, from 31.3 units left of its centre. Phones: one list. */}
          <ol className="relative m-0 mt-8 hidden h-[130px] list-none p-0 md:block">
            {PHILOSOPHY_STAGES.map((stage, index) => (
              <li
                key={stage.word}
                className="absolute top-0 pr-3"
                // Each column runs to the next one, so it inherits the disc spacing as 08's columns do.
                style={{ left: `${((DISCS[index].x - 31.3 - BOX.x) / BOX.w) * 100}%`, width: `${(((DISCS[index + 1]?.x ?? DISCS[index].x + 150) - DISCS[index].x) / BOX.w) * 100}%`, opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(8px)", transition: `opacity ${t(420, 900 + index * 120)}, transform ${t(600, 900 + index * 120)}` }}
              >
                <h3 className=" font-serif text-[clamp(1.4rem,1.1rem+.7vw,1.8rem)] leading-[1.1] font-normal">{stage.word}</h3>
                <p className="mt-2 text-[13px] leading-[1.5] text-black/60">{stage.text}</p>
              </li>
            ))}
          </ol>
          <ol className="m-0 mt-8 list-none p-0 md:hidden">
            {PHILOSOPHY_STAGES.map((stage) => (
              <li key={stage.word} className="border-t border-black/15 py-4">
                <div>
                  <h3 className="font-serif text-[22px] leading-[1.1] font-normal">{stage.word}</h3>
                  <p className="mt-1 text-[13px] leading-[1.5] text-black/60">{stage.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
