"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { MOVE, OUT, RM, tr } from "@/components/drawing/plate";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { PROCESS_STEPS } from "@/lib/approach";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Person } from "@/components/drawing/lookout";

/*
 * Stock selection for /pms, after the converging-lines study
 * (reference/visual-language/05): twelve quadratic curves leave the text
 * column and meet at one point, from which the orange portfolio line runs to a
 * figure looking ahead. The four steps sit on the left as the reference sets
 * them. As each step enters, the curves still in play draw the next stretch
 * and the companies dropped at that step fade out where they stopped; the
 * survivors reach the point and the orange line draws last.
 */

/** Screen, Shortlist, Analyse and Decision Making; Monitor and Exit come after the portfolio is built. */
const STEPS = PROCESS_STEPS.slice(0, 4);

const ORANGE = "#F6A11A";
const CURVES = 12;
/** Where each stretch of the curves ends, as the curve parameter: one stretch per step, then the run into the point. */
const BREAKS = [0, 0.2, 0.36, 0.5, 0.62, 1] as const;
/** How many stretches each curve draws, top to bottom: 1 to 4 means dropped at that step, 5 reaches the point. */
const REACH = [1, 2, 5, 3, 1, 4, 5, 2, 3, 5, 2, 1] as const;
const LAST_STEP = STEPS.length;
/** A step counts as entered once its top passes this far down the viewport. */
const TRIGGER = 0.86;
/** The least time between one step's stretch and the next, so a fast scroll still plays them in order. */
const GAP = 760;

type Point = { x: number; y: number };
type Box = { w: number; h: number; top: number; bottom: number };

/** Measured ratios from the study, in units of the fan height H: shared control point, end point, figure. */
const CONTROL = 0.287;
const END = 0.76;
const FIGURE = 1.03;
const FIGURE_HEIGHT = 0.158;
/** Room right of the figure's feet for its telescope, in units of H. */
const FIGURE_REACH = 0.075;

const r2 = (value: number) => Math.round(value * 100) / 100;

/** The point at `u` and `v` on a quadratic's blossom; (t, t) is the curve, (a, b) a split's control point. */
const blossom = ([p0, p1, p2]: readonly [Point, Point, Point], u: number, v: number): Point => {
  const a = (1 - u) * (1 - v);
  const b = (1 - u) * v + u * (1 - v);
  const c = u * v;
  return { x: a * p0.x + b * p1.x + c * p2.x, y: a * p0.y + b * p1.y + c * p2.y };
};

/** One stretch of a quadratic, itself a quadratic, as path data. */
const stretch = (curve: readonly [Point, Point, Point], from: number, to: number) => {
  const start = blossom(curve, from, from);
  const control = blossom(curve, from, to);
  const end = blossom(curve, to, to);
  return `M${r2(start.x)} ${r2(start.y)}Q${r2(control.x)} ${r2(control.y)} ${r2(end.x)} ${r2(end.y)}`;
};

/** The whole drawing in pixels of the box it fills, so curve starts line up with the steps beside it. */
function layout({ w, top, bottom }: Box) {
  const H = bottom - top;
  const yc = (top + bottom) / 2;
  const stroke = Math.min(3.2, Math.max(1.4, H * 0.0052));
  const x0 = stroke / 2;
  // The study's proportions, stretched or squeezed along x to fill the width.
  const k = Math.min(1.35, Math.max(0.6, (w - x0) / ((FIGURE + FIGURE_REACH) * H)));
  const cx = x0 + CONTROL * H * k;
  const ex = x0 + END * H * k;
  const figureX = x0 + FIGURE * H * k;
  const curves = Array.from({ length: CURVES }, (_, i) => {
    const curve = [
      { x: x0, y: top + (i * H) / (CURVES - 1) },
      { x: cx, y: yc },
      { x: ex, y: yc },
    ] as const;
    return BREAKS.slice(1).map((to, part) => stretch(curve, BREAKS[part], to));
  });
  return { stroke, yc, ex, figureX, figureScale: (FIGURE_HEIGHT * H) / 98.4, curves };
}

/** A first guess for the server render, replaced by the measured box on the client. */
const GUESS: Box = { w: 640, h: 600, top: 6, bottom: 594 };

/** Outer curves first, moving inward, as the study's entrance. */
const inward = (i: number) => (5 - Math.floor(Math.abs(i - (CURVES - 1) / 2))) * 40;

function Lines({ box, stage }: { box: Box; stage: number }) {
  const { stroke, yc, ex, figureX, figureScale, curves } = layout(box);
  const final = stage >= LAST_STEP;
  // The orange line starts inside the black tip so no gap shows, and runs to the figure's front foot.
  const lineStart = ex - 12 * (stroke / 1.5);
  const lineEnd = figureX + 10.6 * figureScale;
  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="absolute inset-0 block h-full w-full overflow-visible" aria-hidden="true">
      {curves.map((parts, i) => {
        const reach = REACH[i];
        const dropped = reach <= LAST_STEP;
        return (
          <g
            key={i}
            data-dropped={dropped ? "" : undefined}
            fill="none"
            stroke="#000"
            strokeWidth={stroke}
            className={RM}
            style={{ opacity: dropped && stage >= reach ? 0.12 : 1, ...tr("opacity", 480, 720) }}
          >
            {parts.slice(0, reach).map((d, part) => {
              // The run into the point belongs to the last step, after its own stretch.
              const drawn = part < LAST_STEP ? stage > part : final;
              const delay = part < LAST_STEP ? inward(i) : 860;
              return (
                <path
                  key={part}
                  data-draw=""
                  d={d}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={drawn ? 0 : 1}
                  className={RM}
                  style={tr("stroke-dashoffset", part < LAST_STEP ? 620 : 720, delay, part < LAST_STEP ? OUT : MOVE)}
                />
              );
            })}
          </g>
        );
      })}
      <path
        data-draw=""
        d={`M${r2(lineStart)} ${r2(yc)}H${r2(lineEnd)}`}
        pathLength={1}
        fill="none"
        stroke={ORANGE}
        strokeWidth={stroke * 2}
        strokeDasharray="1 1"
        strokeDashoffset={final ? 0 : 1}
        className={RM}
        style={tr("stroke-dashoffset", 720, 1480, MOVE)}
      />
      <g transform={`translate(${r2(figureX)} ${r2(yc - stroke)}) scale(${r2(figureScale)})`}>
        <g data-late="" className={RM} style={{ opacity: final ? 1 : 0, ...tr("opacity", 420, 2050) }}>
          <Person />
        </g>
      </g>
    </svg>
  );
}

/**
 * Tracks which steps have entered and plays the drawing one step at a time up
 * to that point. Steps only ever advance. The drawing waits for the figure to
 * be in view, so on a phone, where the steps stack above it, it plays through
 * once the figure arrives.
 */
function useStage(figure: RefObject<HTMLElement | null>, steps: RefObject<(HTMLElement | null)[]>) {
  const [target, setTarget] = useState(0);
  const [stage, setStage] = useState(0);
  const lastAdvance = useRef(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * TRIGGER;
      const box = figure.current?.getBoundingClientRect();
      if (!box || box.top > line) return;
      const entered = steps.current.filter((step) => step && step.getBoundingClientRect().top < line).length;
      setTarget((current) => Math.max(current, entered));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [figure, steps]);

  useEffect(() => {
    if (stage >= target) return;
    const wait = Math.max(0, lastAdvance.current + GAP - performance.now());
    const timer = window.setTimeout(() => {
      lastAdvance.current = performance.now();
      setStage((current) => current + 1);
    }, wait);
    return () => window.clearTimeout(timer);
  }, [stage, target]);

  return stage;
}

/**
 * An element's top and bottom as laid out, without the transform of the rise
 * it sits in: a step still waiting to rise is drawn 12px low.
 */
function laidOut(element: HTMLElement) {
  const box = element.getBoundingClientRect();
  const item = element.closest("li");
  const rise = item?.firstElementChild;
  const shift = item && rise ? rise.getBoundingClientRect().top - item.getBoundingClientRect().top : 0;
  return { top: box.top - shift, bottom: box.bottom - shift };
}

/** Measures the figure's box and, beside the steps, where the first step starts and the last one ends. */
function useBox(figure: RefObject<HTMLElement | null>, list: RefObject<HTMLElement | null>) {
  const [box, setBox] = useState(GUESS);
  useEffect(() => {
    const cell = figure.current;
    const steps = list.current;
    if (!cell || !steps) return;
    const measure = () => {
      const area = cell.getBoundingClientRect();
      const numerals = steps.querySelectorAll<HTMLElement>("[data-numeral]");
      const ends = steps.querySelectorAll<HTMLElement>("[data-end]");
      const beside = window.matchMedia("(min-width: 768px)").matches;
      const first = numerals[0] && laidOut(numerals[0]);
      const last = ends[ends.length - 1] && laidOut(ends[ends.length - 1]);
      // Beside the steps the fan spans them: top curve at the first numeral's cap top, bottom curve through the last line.
      const top = beside && first ? first.top - area.top + 1 : area.height * 0.06;
      const bottom = beside && last ? last.bottom - area.top - 10 : area.height * 0.94;
      setBox({ w: Math.round(area.width), h: Math.round(area.height), top: r2(top), bottom: r2(bottom) });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(cell);
    observer.observe(steps);
    return () => observer.disconnect();
  }, [figure, list]);
  return box;
}

export function SelectionSection() {
  const reduceMotion = useReducedMotion();
  const figureRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const played = useStage(figureRef, stepRefs);
  const box = useBox(figureRef, listRef);
  const stage = reduceMotion ? LAST_STEP : played;

  return (
    <section id="selection" aria-labelledby="selection-heading" className="scroll-mt-[96px] bg-white text-black">
      {/* Without JavaScript nothing plays; show the drawing finished. */}
      <noscript>
        <style>{`#selection [data-draw]{stroke-dashoffset:0!important;transition:none!important}#selection [data-dropped]{opacity:.12!important}#selection [data-late]{opacity:1!important}`}</style>
      </noscript>
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <BracketLabel>Stock selection</BracketLabel>
        <h2 id="selection-heading" className={`mt-[18px] ${SUBHEAD}`}>
          Stock Selection
        </h2>

        <div className="mt-[64px] grid grid-cols-1 gap-y-[48px] md:mt-[96px] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-x-[clamp(24px,3vw,44px)]">
          <ol ref={listRef} className="m-0 grid list-none gap-y-[clamp(36px,4vw,56px)] p-0">
            {STEPS.map((step, index) => (
              <li
                key={step.name}
                ref={(element) => {
                  stepRefs.current[index] = element;
                }}
              >
                <Rise onView>
                  <div className="grid grid-cols-[clamp(44px,4.4vw,64px)_minmax(0,1fr)] gap-x-[12px]">
                    <span data-numeral="" className="font-serif text-[clamp(2rem,1.5rem+1.4vw,3rem)] leading-none tabular-nums [text-box:trim-both_cap_alphabetic]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-[clamp(1.4rem,1.1rem+.8vw,1.9rem)] leading-[1.1] font-normal [text-box:trim-both_cap_alphabetic]">{step.name}</h3>
                      <p data-end="" className="m-0 mt-[14px] max-w-[44ch] text-[15px] leading-[1.55] text-black/70">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Rise>
              </li>
            ))}
          </ol>
          <div ref={figureRef} className="relative max-md:aspect-[8/7]">
            <Lines box={box} stage={stage} />
          </div>
        </div>
      </div>
    </section>
  );
}
