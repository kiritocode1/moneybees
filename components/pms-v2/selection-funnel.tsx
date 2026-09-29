"use client";

import { useEffect, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { FUNNEL_STAGES, PMS_LOREM } from "@/lib/pms-v2";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { FOCUS, hexPoints, number, ORANGE, T, useShown } from "./shared";

/*
 * The stock-selection funnel, drawn flat: five bands narrowing from the whole
 * universe to the 15 to 20 stocks held. Each band holds fewer companies than
 * the one above; the last band's companies are the portfolio. The stage in
 * focus lights its band; the funnel steps through them on its own until the
 * reader picks one.
 */

const WIDTH = 600;
const TOP = 560;
const BOTTOM = 150;
const BAND = 74;
const GAP = 10;
const HEIGHT = FUNNEL_STAGES.length * (BAND + GAP) - GAP;
/** Companies drawn in each band. Illustrative: the deck gives no counts. */
const COUNTS = [96, 52, 32, 24, 18];

const widthAt = (y: number) => TOP - ((TOP - BOTTOM) * y) / HEIGHT;

/** A band's outline, a trapezoid cut from the funnel. */
function bandPoints(index: number) {
  const y0 = index * (BAND + GAP);
  const y1 = y0 + BAND;
  const half0 = widthAt(y0) / 2;
  const half1 = widthAt(y1) / 2;
  const c = WIDTH / 2;
  return `${c - half0},${y0} ${c + half0},${y0} ${c + half1},${y1} ${c - half1},${y1}`;
}

/** Evenly spaced companies inside a band, in as many rows as fit. */
function bandDots(index: number) {
  const y0 = index * (BAND + GAP);
  const rows = index === FUNNEL_STAGES.length - 1 ? 2 : 3;
  const count = COUNTS[index];
  const perRow = Math.ceil(count / rows);
  return Array.from({ length: count }, (_, dot) => {
    const row = Math.floor(dot / perRow);
    const col = dot % perRow;
    const y = y0 + ((row + 1) * BAND) / (rows + 1);
    const span = widthAt(y) - 44;
    const x = WIDTH / 2 - span / 2 + (perRow === 1 ? span / 2 : (col * span) / (perRow - 1));
    return { x, y, dot };
  });
}

const BANDS = FUNNEL_STAGES.map((_, index) => ({ points: bandPoints(index), dots: bandDots(index) }));

export default function SelectionFunnel() {
  const { ref, shown } = useShown<HTMLDivElement>(0.35);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);

  // Step through the stages once in view, until the reader picks one.
  useEffect(() => {
    if (!shown || picked || reduceMotion) return;
    const timer = setInterval(() => setActive((current) => (current + 1) % FUNNEL_STAGES.length), 2400);
    return () => clearInterval(timer);
  }, [shown, picked, reduceMotion]);

  const choose = (index: number) => {
    setPicked(true);
    setActive(index);
  };

  const last = FUNNEL_STAGES.length - 1;

  return (
    <section id="selection" aria-labelledby="selection-heading" className="scroll-mt-[96px] bg-black text-white">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Stock selection</BracketLabel>
            <h2 id="selection-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Stock Selection
            </h2>
          </div>
          <p className={`text-white/70 ${BODY}`}>{PMS_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[64px] grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-16">
          <ol className="m-0 list-none border-t border-white/40 p-0 max-md:order-2">
            {FUNNEL_STAGES.map((stage, index) => {
              const current = index === active;
              return (
                <li key={stage.name} className="border-b border-white/15">
                  <button type="button" onClick={() => choose(index)} aria-pressed={current} className={`grid w-full grid-cols-[34px_minmax(0,1fr)] items-baseline gap-x-[14px] py-[16px] text-left ${FOCUS}`}>
                    <span className={`text-[20px] leading-none font-light tracking-[-.04em] transition-colors ${current ? "text-[#F7A11A]" : "text-white/40"}`}>{number(index)}</span>
                    <span>
                      <span className={`block font-serif text-[clamp(1.25rem,1rem+.7vw,1.6rem)] leading-[1.2] transition-colors ${current ? "text-white" : "text-white/55"}`}>{stage.name}</span>
                      <span className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:duration-0 ${current ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <span className="overflow-hidden">
                          <span className="block pt-[6px] text-[14px] leading-[1.5] text-white/55">{stage.text}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mx-auto w-full max-w-[640px]">
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full" aria-hidden="true">
              {BANDS.map((band, index) => {
                const current = index === active;
                const final = index === last;
                return (
                  <g key={index} opacity={shown ? 1 : 0} className={T} style={{ transitionDelay: `${index * 140}ms` }}>
                    <polygon points={band.points} fill={current ? "rgba(247,161,26,.1)" : "transparent"} stroke={current ? ORANGE : "rgba(255,255,255,.25)"} strokeWidth={current ? 1.6 : 1} className={T} />
                    {band.dots.map((dot) =>
                      final ? (
                        <polygon key={dot.dot} points={hexPoints(dot.x, dot.y, 6)} fill={ORANGE} opacity={current ? 1 : 0.7} className={T} />
                      ) : (
                        <circle key={dot.dot} cx={dot.x} cy={dot.y} r="3.2" fill={current ? "#fff" : "rgba(255,255,255,.35)"} className={T} />
                      ),
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="mt-[18px] flex justify-between">
              <span className={`${EYEBROW} text-white/45`}>Illustration</span>
              <span className={`${EYEBROW} text-[#F7A11A]`}>
                Step {active + 1} of {FUNNEL_STAGES.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
