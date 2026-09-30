"use client";

import { useEffect, useId, useState } from "react";
import { BOX, Draw, Hatch, MOVE, RM, tr } from "@/components/drawing/plate";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { FUNNEL_STAGES, PMS_LOREM } from "@/lib/pms-v2";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { FOCUS, number, ORANGE, useShown } from "./shared";

/*
 * The stock-selection funnel, drawn flat: five bands narrowing from the whole
 * universe to the portfolio. Converging lines run through every band, so the
 * drawing shows the field narrowing without implying any count of companies
 * (the deck gives none). The stage in focus lights its band; the funnel steps
 * through them on its own until the reader picks one.
 */

const WIDTH = 600;
const TOP = 560;
const BOTTOM = 150;
const BAND = 74;
const GAP = 10;
const HEIGHT = FUNNEL_STAGES.length * (BAND + GAP) - GAP;
/** Streamlines drawn through the funnel: a texture, not a count. */
const LINES = 13;

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

/** One converging line from the funnel's mouth to its neck, inset from the walls. */
function streamline(line: number) {
  const t = (line + 0.5) / LINES;
  const top = WIDTH / 2 - (TOP - 40) / 2 + t * (TOP - 40);
  const bottom = WIDTH / 2 - (BOTTOM - 40) / 2 + t * (BOTTOM - 40);
  return `M${top.toFixed(1)} 0L${bottom.toFixed(1)} ${HEIGHT}`;
}

const BANDS = FUNNEL_STAGES.map((_, index) => bandPoints(index));
const STREAMS = Array.from({ length: LINES }, (_, line) => streamline(line));

const MONO = "var(--font-geist-mono)";
const INK = "#fff";
const RAIL = 22;
const c = WIDTH / 2;
const bandTop = (index: number) => index * (BAND + GAP);
const half = (y: number) => widthAt(y) / 2;

/**
 * The plate itself. Construction at rest: the funnel's outline in hairline.
 * Once in view the walls draw down, each stage's band is cut off in turn, the
 * flow lines settle in, the mouth and the neck are measured, and the last
 * band, the portfolio, lands in orange. The stage in focus is hatched.
 */
function FunnelPlate({ shown, active }: { shown: boolean; active: number }) {
  const hatch = useId();
  const clip = useId();
  const last = FUNNEL_STAGES.length - 1;
  const mouth = -22;
  const neck = HEIGHT + 22;
  return (
    <svg viewBox={`-10 -44 ${WIDTH + 20} ${HEIGHT + 88}`} className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={INK} gap={6} opacity={0.5} />
        <clipPath id={clip}>
          {BANDS.map((points, index) => (
            <polygon key={index} points={points} />
          ))}
        </clipPath>
      </defs>
      <style>{`@keyframes funnel-flow { to { stroke-dashoffset: -16; } }`}</style>

      {/* Construction: every band in hairline, and the rail its stages are read against. */}
      {BANDS.map((points, index) => (
        <polygon key={index} points={points} fill="none" stroke={INK} strokeWidth="1" strokeOpacity=".16" />
      ))}
      <line x1={RAIL} x2={RAIL} y1="0" y2={HEIGHT} stroke={INK} strokeWidth="1" strokeOpacity=".3" />
      <line x1={c} x2={c} y1={mouth + 8} y2={neck - 8} stroke={INK} strokeWidth="1" strokeOpacity=".14" strokeDasharray="10 5 2 5" />

      {/* The stage in focus, hatched; the portfolio, orange. */}
      {BANDS.map((points, index) => {
        const final = index === last;
        const current = index === active;
        return (
          <g key={index}>
            {!final && <polygon points={points} fill={`url(#${hatch})`} className={RM} style={{ opacity: shown && current ? 1 : 0, ...tr("opacity", 320) }} />}
            {final && (
              <polygon
                points={points}
                fill={ORANGE}
                className={RM}
                style={{ ...BOX, transformOrigin: "center", opacity: shown ? 1 : 0, transform: shown ? "scaleX(1)" : "scaleX(.2)", ...tr("opacity, transform", 620, 1500, MOVE) }}
              />
            )}
          </g>
        );
      })}

      {/* Flow lines through every band: a texture, not a count. */}
      <g clipPath={`url(#${clip})`} className={RM} style={{ opacity: shown ? 1 : 0, ...tr("opacity", 700, 700) }}>
        {STREAMS.map((d, line) => (
          <path key={line} d={d} stroke={INK} strokeOpacity=".22" strokeWidth="1" strokeDasharray="2 6" className="animate-[funnel-flow_1.6s_linear_infinite] motion-reduce:animate-none" />
        ))}
      </g>

      {/* The walls draw down; each stage is cut off as they pass it. */}
      <Draw d={`M${c - TOP / 2} 0L${c - BOTTOM / 2} ${HEIGHT}`} on={shown} ms={900} delay={80} ease={MOVE} stroke={INK} strokeWidth="1.6" />
      <Draw d={`M${c + TOP / 2} 0L${c + BOTTOM / 2} ${HEIGHT}`} on={shown} ms={900} delay={80} ease={MOVE} stroke={INK} strokeWidth="1.6" />
      {FUNNEL_STAGES.map((_, index) => {
        const y0 = bandTop(index);
        const y1 = y0 + BAND;
        const current = index === active;
        return (
          <g key={index}>
            <Draw d={`M${c - half(y0)} ${y0}H${c + half(y0)}`} on={shown} ms={420} delay={200 + index * 110} stroke={INK} strokeWidth={index === 0 ? 1.4 : 1} strokeOpacity=".75" />
            <Draw d={`M${c - half(y1)} ${y1}H${c + half(y1)}`} on={shown} ms={420} delay={260 + index * 110} stroke={INK} strokeWidth={index === last ? 1.4 : 1} strokeOpacity=".75" />
            {/* Rail: a tick at each edge, the stage number between, and a leader to the band. */}
            <g className={RM} style={{ opacity: shown ? 1 : 0, ...tr("opacity", 300, 500 + index * 110) }}>
              <line x1={RAIL - 6} x2={RAIL + 6} y1={y0} y2={y0} stroke={INK} strokeWidth="1" strokeOpacity=".55" />
              <line x1={RAIL - 6} x2={RAIL + 6} y1={y1} y2={y1} stroke={INK} strokeWidth="1" strokeOpacity=".55" />
              <text x={RAIL - 12} y={y0 + BAND / 2 + 4} textAnchor="end" fontSize="12" fill={current ? ORANGE : INK} opacity={current ? 1 : 0.55} letterSpacing=".12em" fontFamily={MONO} className="transition-[fill,opacity] duration-300">
                {number(index)}
              </text>
              <line x1={RAIL + 10} x2={c - half(y0 + BAND / 2) - 8} y1={y0 + BAND / 2} y2={y0 + BAND / 2} stroke={INK} strokeWidth="1" strokeOpacity={current ? 0.7 : 0.18} strokeDasharray="2 4" className="transition-[stroke-opacity] duration-300" />
            </g>
          </g>
        );
      })}

      {/* Mouth and neck, measured: wide in, narrow out. */}
      {[
        { y: mouth, w: TOP, edge: 0, label: "UNIVERSE", delay: 1000 },
        { y: neck, w: BOTTOM, edge: HEIGHT, label: "PORTFOLIO", delay: 1250 },
      ].map(({ y, w, edge, label, delay }) => {
        const x0 = c - w / 2;
        const x1 = c + w / 2;
        const up = y < edge;
        const gap = label.length * 8.6 + 22;
        return (
          <g key={label}>
            <Draw d={`M${x0} ${edge + (up ? -4 : 4)}V${y + (up ? -5 : 5)}M${x1} ${edge + (up ? -4 : 4)}V${y + (up ? -5 : 5)}`} on={shown} ms={260} delay={delay} stroke={INK} strokeWidth=".8" strokeOpacity=".55" />
            <Draw d={`M${x0} ${y}H${c - gap / 2}M${c + gap / 2} ${y}H${x1}`} on={shown} ms={420} delay={delay + 140} stroke={INK} strokeWidth="1" strokeOpacity=".85" />
            <g className={RM} style={{ opacity: shown ? 1 : 0, ...tr("opacity", 260, delay + 420) }}>
              <path d={`M${x0 + 7} ${y - 4}L${x0} ${y}L${x0 + 7} ${y + 4}M${x1 - 7} ${y - 4}L${x1} ${y}L${x1 - 7} ${y + 4}`} fill="none" stroke={INK} strokeWidth="1" />
              <text x={c} y={y + 4} textAnchor="middle" fontSize="11" fill={INK} opacity=".7" letterSpacing=".12em" fontFamily={MONO}>
                {label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

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
                    <span className={`text-[20px] leading-none font-light tracking-[-.04em] transition-colors ${current ? "text-[#F6A11A]" : "text-white/50"}`}>{number(index)}</span>
                    <span>
                      <span className={`block font-serif text-[clamp(1.25rem,1rem+.7vw,1.6rem)] leading-[1.2] transition-colors ${current ? "text-white" : "text-white/60"}`}>{stage.name}</span>
                      <span className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:!transition-none ${current ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <span className="overflow-hidden">
                          <span className="block pt-[6px] text-[14px] leading-[1.5] text-white/65">{stage.text}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mx-auto w-full max-w-[640px]">
            <FunnelPlate shown={shown} active={active} />
            <div className="mt-[18px] flex justify-end">
              <span className={`${EYEBROW} text-[#F6A11A]`}>
                Step {active + 1} of {FUNNEL_STAGES.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
