"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { BracketLabel, r2 } from "@/components/fact-sections/fact-section";
import { COLUMN, DashedRule, EYEBROW, SUBHEAD } from "@/components/hero/editorial";
import { AIF_HEADINGS, AIF_PROCESS } from "@/lib/aif";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * The deck's stock selection ribbon (AIF presentation p5): six steps along an
 * S-curve, the colour stepping from deep orange at the first to pale peach at
 * the last, each with a hexagon badge. Here scroll draws the ribbon one step
 * at a time and the step it reaches opens its points below.
 */

const STEPS = AIF_PROCESS.length;
/** Where each step sits along the wave, in wave units; the wave runs 0 to END. */
const AT = [0.06, 0.3, 0.5, 0.7, 0.9, 1.06];
const END = 1.12;
/** Segment edges: halfway between steps, so each step owns the stretch around it. */
const EDGES = [0, ...AT.slice(1).map((u, i) => (u + AT[i]) / 2), END];
const COLOURS = ["#b8650a", "#d98c10", "#F7A11A", "#f9b84a", "#fbcb7e", "#fddfb0"];

type Layout = { width: number; height: number; stroke: number; point: (u: number) => readonly [number, number] };

/** The wave across a wide screen: steps alternate high and low the way the slide's do. */
const WIDE: Layout = {
  width: 1200,
  height: 400,
  stroke: 40,
  point: (u) => [r2(70 + (u / END) * 1060), r2(200 - 118 * Math.cos(Math.PI * 2 * 1.25 * u))],
};
/** The same wave stood upright for a phone. */
const TALL: Layout = {
  width: 360,
  height: 520,
  stroke: 34,
  point: (u) => [r2(180 - 104 * Math.cos(Math.PI * 2 * 1.25 * u)), r2(34 + (u / END) * 452)],
};

const trace = (layout: Layout, from: number, to: number) =>
  Array.from({ length: 41 }, (_, i) => {
    const [x, y] = layout.point(from + ((to - from) * i) / 40);
    return `${i ? "L" : "M"}${x} ${y}`;
  }).join("");

const hexagon = (x: number, y: number, radius: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = (Math.PI / 3) * corner;
    return `${r2(x + radius * Math.cos(angle))},${r2(y + radius * Math.sin(angle))}`;
  }).join(" ");

function Ribbon({ layout, fills, active, labels }: { layout: Layout; fills: readonly number[]; active: number; labels: boolean }) {
  return (
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="block h-full w-full overflow-visible" aria-hidden="true">
      <path d={trace(layout, 0, END)} fill="none" stroke="#f1efea" strokeWidth={layout.stroke} />
      {EDGES.slice(0, -1).map((from, index) => (
        <path
          key={from}
          d={trace(layout, from, EDGES[index + 1])}
          fill="none"
          stroke={COLOURS[index]}
          strokeWidth={layout.stroke}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - fills[index]}
        />
      ))}
      {AT.map((u, index) => {
        const [x, y] = layout.point(u);
        const reached = fills[index] > 0.5;
        const on = index === active;
        const high = y < layout.height / 2;
        return (
          <g key={u}>
            <polygon
              points={hexagon(x, y, on ? 25 : 21)}
              fill={on ? "#000" : "#fff"}
              stroke={reached ? "#000" : "rgba(0,0,0,.25)"}
              strokeWidth="1.2"
              style={{ transition: "fill 300ms ease" }}
            />
            <text
              x={x}
              y={y + 5}
              textAnchor="middle"
              className={`font-[family-name:var(--font-geist-mono)] text-[14px] ${on ? "fill-white" : reached ? "fill-black" : "fill-black/35"}`}
            >
              {index + 1}
            </text>
            {labels && (
              <text
                x={x}
                y={high ? y - 44 : y + 58}
                textAnchor="middle"
                className={`font-[family-name:var(--font-geist-mono)] text-[12px] tracking-[.1em] uppercase ${on ? "fill-black" : "fill-black/40"}`}
              >
                {AIF_PROCESS[index].name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Stock selection process, told on scroll. The track is one screen per step;
 * inside it the ribbon and the open step stay pinned. Under reduced motion the
 * ribbon is drawn in full from the start and only the open step follows scroll.
 */
export default function ProcessSection() {
  const track = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProgress);

  // Each step's stretch fills in the first half of its screen, then holds while its points are read.
  const fills = AIF_PROCESS.map((_, index) => (reduceMotion ? 1 : Math.min(1, Math.max(0, (progress * STEPS - index) / 0.5))));
  const active = Math.min(STEPS - 1, Math.floor(progress * STEPS));

  return (
    <section id="process" aria-labelledby="process-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} pt-[110px]`}>
        <BracketLabel>Our process</BracketLabel>
        <h2 id="process-heading" className={`mt-[18px] ${SUBHEAD}`}>
          {AIF_HEADINGS.process}
        </h2>
      </div>

      <div ref={track} style={{ height: `${STEPS * 75 + 25}svh` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center gap-[40px] max-md:justify-start max-md:gap-[20px] max-md:pt-[84px]">
          <div className={`${COLUMN}`}>
            <div className="max-md:hidden">
              <Ribbon layout={WIDE} fills={fills} active={active} labels />
            </div>
            <div className="mx-auto h-[min(46svh,380px)] w-full max-w-[300px] md:hidden">
              <Ribbon layout={TALL} fills={fills} active={active} labels={false} />
            </div>
          </div>

          {/* One panel per step, stacked in place; the open one fades up. */}
          <ol className={`${COLUMN} relative grid list-none`}>
            {AIF_PROCESS.map((step, index) => {
              const open = index === active;
              return (
                <li
                  key={step.name}
                  aria-current={open ? "step" : undefined}
                  className="col-start-1 row-start-1 grid grid-cols-[.8fr_1.2fr] gap-[40px] border-t border-t-black pt-[26px] max-md:grid-cols-1 max-md:gap-[14px] max-md:pt-[16px]"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: `translateY(${open ? 0 : 10}px)`,
                    transition: reduceMotion ? "none" : "opacity 400ms ease, transform 400ms ease",
                    visibility: open ? "visible" : "hidden",
                  }}
                >
                  <div className="flex items-baseline gap-[18px]">
                    <span className={`${EYEBROW} text-black/55`}>{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="font-serif text-[clamp(2rem,3.4vw,3.2rem)] leading-none font-normal">{step.name}</h3>
                  </div>
                  <ul className="grid list-none grid-cols-2 gap-x-[32px] gap-y-[10px] max-md:grid-cols-1 max-md:gap-y-[6px]">
                    {step.points.map((point) => (
                      <li key={point} className="flex gap-[12px] text-[16px] leading-[1.45] text-black/75 max-md:text-[14px]">
                        <i className="mt-[.5em] h-[6px] w-[6px] shrink-0" style={{ background: COLOURS[index] }} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
