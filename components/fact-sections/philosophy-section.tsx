"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { FRONT_FROM, FRONT_TO, path, type Point, project } from "@/components/iso/geometry";
import { HEADINGS, PILLARS } from "@/lib/insights";
import { BracketLabel, ORANGE, r2, SectionHeading, SOLID_GLOW, useFigureClock } from "./fact-section";
import IonicColumn, { ColumnGradients } from "./ionic-column";
import { Panel, SplitFrame, typedWords } from "./motion-language";

/*
 * Six Ionic columns (ionic-column.tsx) standing in a ring, a tholos seen in
 * the cards' axonometric projection. The ring turns as one rigid piece, so
 * each column turns on its own axis with it and its flutes, eggs and volutes
 * travel through the light. Whichever column is
 * nearest the viewer lights orange, and its pillar's name and sentence show
 * beside it, so the text follows the turn.
 */

const RING = 150;
const SPIN = 0.42;
const STYLOBATE = RING + 44;

const at = (cx: number, cy: number) => (x: number, y: number, z: number): Point => project(cx + x, cy + y, z);

/** The viewer-facing half of a disc's wall, and its top face, for a disc centred on (cx, cy). */
function disc(cx: number, cy: number, radius: number, bottom: number, top: number) {
  const p = at(cx, cy);
  const arc = (z: number, from: number, to: number) =>
    Array.from({ length: 21 }, (_, step) => {
      const angle = from + ((to - from) * step) / 20;
      return p(radius * Math.cos(angle), radius * Math.sin(angle), z);
    });
  const round = (z: number) =>
    Array.from({ length: 36 }, (_, step) => {
      const angle = (step / 36) * Math.PI * 2;
      return p(radius * Math.cos(angle), radius * Math.sin(angle), z);
    });
  return {
    wall: path([...arc(top, FRONT_FROM, FRONT_TO), ...arc(bottom, FRONT_TO, FRONT_FROM)]),
    top: path(round(top)),
  };
}

const STYLOBATE_DISC = disc(0, 0, STYLOBATE, -16, 0);

export default function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const turn = useFigureClock(inView && !reduceMotion) * SPIN;

  const columns = PILLARS.map((_, index) => {
    const angle = (index / PILLARS.length) * Math.PI * 2 + turn;
    const cx = RING * Math.cos(angle);
    const cy = RING * Math.sin(angle);
    return { index, cx, cy, depth: project(cx, cy, 0)[1] };
  });
  const front = columns.reduce((best, column) => (column.depth > best.depth ? column : best)).index;
  // Seconds this column has been at the front, so its sentence types from the moment it arrives.
  // The front of the ring is at 45 degrees in this projection; a column holds it for one step either side of half.
  const step = (Math.PI * 2) / PILLARS.length;
  const sinceArrival = (((front * step + turn - (Math.PI / 4 - step / 2)) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const arrived = sinceArrival / SPIN;
  const { settled, newest } = typedWords(PILLARS[front].text, reduceMotion ? 99 : arrived, 0.1, 0.07);

  return (
    <section id="philosophy-pillars" aria-labelledby="philosophy-pillars-heading" className="bg-white">
      <SectionHeading id="philosophy-pillars" label="Our philosophy" heading={HEADINGS.philosophy} />
      <div ref={ref} className="mt-[72px]">
        <SplitFrame>
          <Panel className="grid min-h-[560px] place-items-center">
            <svg viewBox="-232 -270 464 420" className="w-[min(94%,640px)]" role="img" aria-label="Six pillars of the investment philosophy, turning">
              <defs>
                <ColumnGradients id="ionic" />
                <radialGradient id="pillars-bloom">
                  <stop offset="0%" stopColor={ORANGE} stopOpacity="0.38" />
                  <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="0" cy="40" rx="220" ry="84" fill="none" stroke="rgba(0,0,0,.3)" strokeDasharray="2 9" strokeLinecap="round" />
              <path d={STYLOBATE_DISC.wall} fill="#efeeec" stroke="rgba(0,0,0,.7)" strokeWidth="1" />
              <path d={STYLOBATE_DISC.top} fill="#ffffff" stroke="rgba(0,0,0,.7)" strokeWidth="1" />
              {(() => {
                const lit = columns[front];
                const [bx, by] = project(lit.cx, lit.cy, 60);
                return <ellipse cx={r2(bx)} cy={r2(by)} rx="90" ry="130" fill="url(#pillars-bloom)" />;
              })()}
              {[...columns]
                .sort((a, b) => a.depth - b.depth)
                .map(({ index, cx, cy }) => (
                  <g key={index} style={{ filter: index === front ? SOLID_GLOW : "none", transition: "filter 300ms ease" }}>
                    <IonicColumn id="ionic" cx={cx} cy={cy} turn={turn} lit={index === front} />
                  </g>
                ))}
            </svg>
          </Panel>
          <Panel className="flex flex-col justify-center p-[48px] max-[600px]:p-[24px]">
            <ul className="list-none p-0">
              {PILLARS.map((pillar, index) => (
                <li
                  key={pillar.name}
                  className="flex items-center gap-[12px] py-[4px] text-[clamp(1rem,1.3vw,1.25rem)] font-light tracking-[-.02em]"
                  style={{ color: index === front ? "#000" : "rgba(0,0,0,.28)", transition: "color 300ms ease" }}
                >
                  <span className="font-mono text-[10px]">{String(index + 1).padStart(2, "0")}</span>
                  {pillar.name}
                  {index === front && <span className="h-[7px] w-[7px] bg-[#F7A11A]" />}
                </li>
              ))}
            </ul>
            <div className="mt-[34px]">
              <BracketLabel>{PILLARS[front].name}</BracketLabel>
              <p className="mt-[16px] min-h-[4.6em] max-w-[24ch] text-[clamp(1.5rem,2.3vw,2.4rem)] leading-[1.12] font-light tracking-[-.035em]">
                {settled} {newest && <span className="text-[rgba(0,0,0,.35)]">{newest}</span>}
              </p>
            </div>
          </Panel>
        </SplitFrame>
      </div>
    </section>
  );
}
