"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { PROCESS_STEPS } from "@/lib/approach";
import { ORANGE } from "./glyphs";

/*
 * The plan's "six-step orange-and-black investment process". The band pins
 * while the reader scrolls through it: a track of six hexagons fills in
 * orange, and the step it reaches takes the stage with its own drawing. Every
 * node is a button, so the steps can be read in any order.
 */

const STEPS = PROCESS_STEPS.length;
const DIM = "rgba(255,255,255,.18)";
const MID = "rgba(255,255,255,.5)";

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/** A 12 by 7 field of companies, the universe every drawing starts from. */
const FIELD = Array.from({ length: 12 * 7 }, (_, index) => ({ x: 14 + (index % 12) * 15.6, y: 16 + Math.floor(index / 12) * 18, index }));
const SHORTLIST = new Set([5, 14, 22, 31, 40, 47, 53, 58, 66, 71, 76, 81]);

/** One drawing per step, each showing what the step does to the field. */
function StepGlyph({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <svg viewBox="0 0 200 150" className="h-auto w-full" aria-hidden="true">
          {FIELD.map((dot) => (
            <circle key={dot.index} cx={dot.x} cy={dot.y} r="3" fill={MID} />
          ))}
          <rect x="4" y="4" width="10" height="126" fill={ORANGE} opacity=".9" className="animate-[approach-scan_2.4s_ease-in-out_infinite] motion-reduce:animate-none" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 200 150" className="h-auto w-full" aria-hidden="true">
          {FIELD.map((dot) => (
            <g key={dot.index}>
              <circle cx={dot.x} cy={dot.y} r="3" fill={SHORTLIST.has(dot.index) ? ORANGE : DIM} />
              {SHORTLIST.has(dot.index) && <circle cx={dot.x} cy={dot.y} r="7" fill="none" stroke={ORANGE} strokeWidth="1" />}
            </g>
          ))}
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 200 150" className="h-auto w-full" aria-hidden="true">
          <polygon points={hexPoints(84, 70, 50)} fill="none" stroke={MID} strokeWidth="1.2" />
          {[0, 1, 2, 3, 4].map((bar) => (
            <rect key={bar} x={58 + bar * 11} y={96 - (bar + 1) * 9} width="7" height={(bar + 1) * 9} fill={bar === 4 ? ORANGE : "#fff"} />
          ))}
          <circle cx="132" cy="96" r="24" fill="none" stroke={ORANGE} strokeWidth="2.4" />
          <path d="M149 113 172 136" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 200 150" className="h-auto w-full" aria-hidden="true">
          <path d="M100 30V128M70 128h60" stroke="#fff" strokeWidth="1.6" />
          <g className="origin-[100px_40px] animate-[approach-weigh_3s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
            <path d="M40 40H160" stroke="#fff" strokeWidth="1.6" />
            <path d="M40 40 26 78h28Z M160 40l-14 38h28Z" fill="none" stroke={MID} strokeWidth="1" />
            <path d="M24 78a16 7 0 0 0 32 0Z" fill={DIM} />
            <path d="M144 78a16 7 0 0 0 32 0Z" fill={ORANGE} />
          </g>
          <text x="40" y="100" textAnchor="middle" fontSize="8" fill={MID} letterSpacing=".1em">
            RISK
          </text>
          <text x="160" y="100" textAnchor="middle" fontSize="8" fill={ORANGE} letterSpacing=".1em">
            REWARD
          </text>
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 200 150" className="h-auto w-full" aria-hidden="true">
          <path d="M8 90h36l8-22 10 44 10-58 10 36h36l8-18 10 30 8-12h40" fill="none" stroke={ORANGE} strokeWidth="2" strokeDasharray="420" className="animate-[approach-draw_2.6s_linear_infinite] motion-reduce:animate-none" />
          {["Q1", "Q2", "Q3", "Q4"].map((quarter, index) => (
            <g key={quarter}>
              <line x1={30 + index * 46} x2={30 + index * 46} y1="124" y2="130" stroke={MID} />
              <text x={30 + index * 46} y="142" textAnchor="middle" fontSize="8" fill={MID} letterSpacing=".08em">
                {quarter}
              </text>
            </g>
          ))}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 150" className="h-auto w-full" aria-hidden="true">
          <rect x="16" y="30" width="96" height="90" fill="none" stroke={MID} strokeWidth="1.2" strokeDasharray="3 4" />
          {[0, 1, 2, 3].map((cell) => (
            <polygon key={cell} points={hexPoints(38 + (cell % 2) * 26, 58 + Math.floor(cell / 2) * 34, 11)} fill="#fff" />
          ))}
          <g className="animate-[approach-exit_2.4s_cubic-bezier(.22,1,.36,1)_infinite] motion-reduce:animate-none">
            <polygon points={hexPoints(90, 75, 11)} fill={ORANGE} />
          </g>
          <path d="M122 75h56M170 67l8 8-8 8" fill="none" stroke={ORANGE} strokeWidth="2" />
        </svg>
      );
  }
}

export default function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => setProgress(value));
  const active = Math.min(STEPS - 1, Math.floor(progress * STEPS));
  const step = PROCESS_STEPS[active];

  /** Scrolls the page to the middle of a step's stretch of the pin. */
  const goTo = (index: number) => {
    const node = ref.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY;
    const travel = node.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((index + 0.5) / STEPS) * travel, behavior: "smooth" });
  };

  return (
    <section id="process" aria-labelledby="process-heading" className="scroll-mt-0 bg-black text-white">
      <div ref={ref} className="relative h-[520svh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className={`${COLUMN} pt-[72px]`}>
            <div className="flex items-end justify-between gap-8">
              <div>
                <BracketLabel>Our process</BracketLabel>
                <h2 id="process-heading" className={`mt-[14px] ${SUBHEAD}`}>
                  Stock Selection Process
                </h2>
              </div>
              <span className={`${EYEBROW} shrink-0 text-white/50 max-md:hidden`}>
                Step {active + 1} of {STEPS}
              </span>
            </div>

            {/* The track: six nodes on a line that fills orange up to the step in view. */}
            <div className="relative mt-[48px] max-md:mt-[32px]">
              <div className="absolute top-1/2 right-[18px] left-[18px] h-[2px] -translate-y-1/2 bg-white/15" />
              <div
                className="absolute top-1/2 left-[18px] h-[2px] -translate-y-1/2 bg-[#F7A11A]"
                style={{ width: `calc((100% - 36px) * ${active / (STEPS - 1)})`, transition: "width 500ms cubic-bezier(.22,1,.36,1)" }}
              />
              <ol className="relative m-0 flex list-none justify-between p-0">
                {PROCESS_STEPS.map((item, index) => {
                  const passed = index < active;
                  const current = index === active;
                  return (
                    <li key={item.name} className="flex flex-col items-center">
                      <button type="button" onClick={() => goTo(index)} aria-current={current ? "step" : undefined} aria-label={`Step ${index + 1}, ${item.name}`} className="block">
                        <svg viewBox="0 0 36 36" className="h-[36px] w-[36px]">
                          <polygon
                            points={hexPoints(18, 18, 16)}
                            fill={current ? ORANGE : passed ? "#000" : "#000"}
                            stroke={current || passed ? ORANGE : "rgba(255,255,255,.3)"}
                            strokeWidth="1.5"
                            style={{ transition: "fill 300ms ease, stroke 300ms ease" }}
                          />
                          <text x="18" y="22" textAnchor="middle" fontSize="11" fill={current ? "#000" : passed ? ORANGE : "rgba(255,255,255,.6)"} fontFamily="var(--font-geist-mono), ui-monospace, monospace">
                            {index + 1}
                          </text>
                        </svg>
                      </button>
                      <span className={`mt-[10px] text-[13px] transition-colors max-md:hidden ${current ? "text-white" : "text-white/45"}`}>{item.name}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* The stage: the step in view, its words beside its drawing. */}
            <div key={step.name} className="mt-[56px] grid animate-[approach-count_500ms_cubic-bezier(.22,1,.36,1)] grid-cols-1 items-center gap-10 motion-reduce:animate-none md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-16 max-md:mt-[36px] max-md:gap-6">
              <div>
                <div className="flex items-baseline gap-[18px]">
                  <span className="text-[clamp(3.4rem,7vw,6.4rem)] leading-none font-light tracking-[-.05em] text-[#F7A11A] tabular-nums">{String(active + 1).padStart(2, "0")}</span>
                  <h3 className="font-serif text-[clamp(2.2rem,1.4rem+2.6vw,4rem)] leading-none font-normal tracking-[-.02em]">{step.name}</h3>
                </div>
                <p className={`mt-[24px] max-w-[560px] text-white/75 ${BODY}`}>{step.text}</p>
              </div>
              <div className="mx-auto w-full max-w-[420px] border border-white/15 p-[28px] max-md:max-w-[280px] max-md:p-[18px]">
                <StepGlyph step={active} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
