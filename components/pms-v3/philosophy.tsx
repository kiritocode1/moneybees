"use client";

import { Instrument_Serif } from "next/font/google";
import type { ComponentType } from "react";
import { useShown } from "@/components/about-v2/shared";
import { BOX, Draw, MOVE, OUT, RM, tr } from "@/components/drawing/plate";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { PHILOSOPHY_POINTS, PHILOSOPHY_WORDS } from "@/lib/pms-v2";

/*
 * Investment philosophy for /pms, in the Futerra glyph-column pattern
 * (reference/visual-language/03): three equal columns, each a small radial
 * glyph over a serif heading with its root in italic, then the plan's five
 * points as a list on the same column grid. Glyph geometry is the study's, in
 * units of a 21-radius glyph; the found dot in the first is the set's one
 * orange element.
 */

/** The root layout loads Instrument Serif upright only; the italic roots need the real italic. */
const serifItalic = Instrument_Serif({ weight: "400", style: "italic", subsets: ["latin"], display: "swap" });

const ORANGE = "#F6A11A";
/**
 * Study units to SVG units. Chrome measures path length coarsely at a
 * 21-unit radius, which leaves a gap where a drawn-on ring closes; at ten
 * times the size it closes cleanly.
 */
const U = 10;
const STROKE = 1.8 * U;

type GlyphProps = { on: boolean; delay: number };

/** Two decimals, so trig values render the same on the server and in the browser. */
const r2 = (value: number) => Math.round(value * 100) / 100;

/** A circle in study units as a path starting at the top and running clockwise, so it can draw on. */
const ring = (x: number, y: number, radius: number) => {
  const [cx, cy, r] = [x * U, y * U, radius * U].map(r2);
  return `M${cx} ${cy - r}A${r} ${r} 0 1 1 ${cx} ${cy + r}A${r} ${r} 0 1 1 ${cx} ${cy - r}`;
};

const FOUND = { x: 9, y: -9 };
const FIELD = Array.from({ length: 25 }, (_, cell) => ({ x: ((cell % 5) - 2) * 9, y: (Math.floor(cell / 5) - 2) * 9 })).filter(
  (dot) => dot.x !== FOUND.x || dot.y !== FOUND.y,
);

/** Undiscovered: a field of dots with one found. The field fades in outward from it; the orange dot lands last. */
function FoundGlyph({ on, delay }: GlyphProps) {
  return (
    <>
      {FIELD.map((dot) => {
        const distance = Math.hypot(dot.x - FOUND.x, dot.y - FOUND.y);
        return (
          <circle
            key={`${dot.x},${dot.y}`}
            data-reveal=""
            cx={dot.x * U}
            cy={dot.y * U}
            r={1.5 * U}
            fill="currentColor"
            className={RM}
            style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.3)", ...tr("opacity, transform", 420, delay + distance * 14) }}
          />
        );
      })}
      <Draw data-reveal="" d={ring(FOUND.x, FOUND.y, 6)} on={on} ms={520} delay={delay + 480} stroke="currentColor" strokeWidth={STROKE} />
      <circle
        data-reveal=""
        cx={FOUND.x * U}
        cy={FOUND.y * U}
        r={2.9 * U}
        fill={ORANGE}
        className={RM}
        style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(0)", ...tr("opacity, transform", 420, delay + 900) }}
      />
    </>
  );
}

/** The spokes present: every 30 degrees except the three on the lower right, where coverage stops. */
const SPOKES = [3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => {
  const angle = (k * 30 * Math.PI) / 180;
  const at = (r: number) => ({ x: r2(r * Math.cos(angle)), y: r2(r * Math.sin(angle)) });
  const from = at(5.5 * U);
  const to = at(16.6 * U);
  return { k, line: `M${from.x} ${from.y}L${to.x} ${to.y}`, tip: at(18.4) };
});

/** Under-researched: a burst of spokes with a gap. The spokes draw on clockwise and the gap stays empty. */
function CoverageGlyph({ on, delay }: GlyphProps) {
  return (
    <>
      <Draw data-reveal="" d={ring(0, 0, 4.6)} on={on} ms={420} delay={delay} stroke="currentColor" strokeWidth={STROKE} />
      {SPOKES.map(({ k, line, tip }, index) => (
        <g key={k}>
          <Draw data-reveal="" d={line} on={on} ms={300} delay={delay + 160 + index * 60} stroke="currentColor" strokeWidth={STROKE} />
          <Draw data-reveal="" d={ring(tip.x, tip.y, 1.8)} on={on} ms={260} delay={delay + 380 + index * 60} stroke="currentColor" strokeWidth={STROKE} />
        </g>
      ))}
    </>
  );
}

/** Under-estimated: the price inside the value. The ring draws on, the disc settles inside it, and the gap is measured. */
function GapGlyph({ on, delay }: GlyphProps) {
  return (
    <>
      <Draw data-reveal="" d={ring(0, 0, 19.75)} on={on} ms={760} delay={delay} ease={MOVE} stroke="currentColor" strokeWidth={STROKE} />
      <circle
        data-reveal=""
        r={11 * U}
        fill="currentColor"
        className={RM}
        style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.6)", ...tr("opacity, transform", 620, delay + 420, OUT) }}
      />
      <path
        data-reveal=""
        d="M126 0H182M126-26V26M182-26V26"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2 * U}
        className={RM}
        style={{ opacity: on ? 1 : 0, ...tr("opacity", 320, delay + 900) }}
      />
    </>
  );
}

/** Each word split where the study sets it: the prefix upright, the root in italic. */
const STAGES: readonly { word: string; upright: string; Glyph: ComponentType<GlyphProps> }[] = [
  { word: PHILOSOPHY_WORDS[0], upright: "Un", Glyph: FoundGlyph },
  { word: PHILOSOPHY_WORDS[1], upright: "Under-", Glyph: CoverageGlyph },
  { word: PHILOSOPHY_WORDS[2], upright: "Under-", Glyph: GapGlyph },
];

const number = (index: number) => String(index + 1).padStart(2, "0");

export function PhilosophySection() {
  const { ref, shown } = useShown<HTMLOListElement>(0.35);
  return (
    <section id="philosophy" aria-labelledby="philosophy-heading" className="scroll-mt-[96px] bg-black text-white">
      {/* Without JavaScript the glyphs never draw on; show them drawn. */}
      <noscript>
        <style>{`#philosophy [data-reveal]{stroke-dashoffset:0!important;opacity:1!important;transform:none!important;transition:none!important}`}</style>
      </noscript>
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <BracketLabel>Our philosophy</BracketLabel>
        <h2 id="philosophy-heading" className={`mt-[18px] ${SUBHEAD}`}>
          Investment Philosophy
        </h2>

        <ol ref={ref} className="m-0 mt-[72px] grid list-none grid-cols-1 gap-y-[36px] p-0 md:mt-[88px] md:grid-cols-3 md:gap-x-[clamp(32px,4.5vw,72px)]">
          {STAGES.map(({ word, upright, Glyph }, index) => (
            <li key={word}>
              <Rise onView delay={index * 0.12}>
                <div className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-x-[20px] md:block">
                  <svg viewBox="-220 -220 440 440" className="block h-auto w-[56px] overflow-visible md:w-[clamp(64px,6vw,88px)]" aria-hidden="true">
                    <Glyph on={shown} delay={index * 180} />
                  </svg>
                  <h3 className="font-serif text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] leading-[1.1] font-normal tracking-[-.01em] md:mt-[32px]">
                    {upright}
                    <em className={serifItalic.className}>{word.slice(upright.length)}</em>
                  </h3>
                </div>
              </Rise>
            </li>
          ))}
        </ol>

        {/* The five points on the same three-column grid: numbers on the first line, points from the second. */}
        <ol className="m-0 mt-[88px] grid list-none grid-cols-1 border-b border-white/20 p-0 md:mt-[112px] md:grid-cols-3 md:gap-x-[clamp(32px,4.5vw,72px)]">
          {PHILOSOPHY_POINTS.map((point, index) => (
            <li key={point} className="grid grid-cols-[44px_minmax(0,1fr)] items-baseline border-t border-white/20 py-[22px] md:col-span-3 md:grid-cols-subgrid md:py-[26px]">
              <span className={`${EYEBROW} text-white/55 tabular-nums`}>{number(index)}</span>
              <p className="m-0 font-serif text-[clamp(1.3rem,1rem+.8vw,1.85rem)] leading-[1.2] md:col-span-2">{point}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
