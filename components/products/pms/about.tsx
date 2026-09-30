"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { r2 } from "@/components/fact-sections/fact-section";
import { BODY } from "@/components/hero/editorial";
import { ABOUT_PMS, PMS_HEADINGS } from "@/lib/pms";
import { MONO, ORANGE, PmsSection, PmsSectionHead, useReveal } from "./shared";

/*
 * About Moneybee PMS, group profile p9. The slide's hexagon, rebuilt: six
 * segments around a white centre, one per statement, in the slide's three
 * shades. The statements sit in two columns either side as on the slide, and
 * pointing at one lights its segment.
 */

const OUTER = 150;
const INNER = 60;
const GAP = 5;
/** Clockwise from the top: segment 0 is upper right, 3 is lower left. */
const SHADES = ["#E8842C", "#D9955B", "#F6A11A", "#E8842C", "#D9955B", "#F6A11A"] as const;
/** Statement order (left column top to bottom, then right) to segment. */
const SEGMENT_FOR = [5, 4, 3, 0, 1, 2] as const;

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const at = (radius: number, degrees: number, shift: readonly [number, number]) =>
  [r2(Math.cos(rad(degrees)) * radius + shift[0]), r2(Math.sin(rad(degrees)) * radius + shift[1])] as const;

const SEGMENTS = Array.from({ length: 6 }, (_, index) => {
  const from = -90 + index * 60;
  const to = from + 60;
  const mid = from + 30;
  const shift = [Math.cos(rad(mid)) * GAP, Math.sin(rad(mid)) * GAP] as const;
  const arc = Array.from({ length: 13 }, (_, step) => at(INNER + 4, to - (step * 60) / 12, shift));
  const points = [at(OUTER, from, shift), at(OUTER, to, shift), ...arc];
  // The slide's white dot sits between the ring's inner edge and the hexagon's edge.
  const dot = at((INNER + OUTER * Math.cos(rad(30))) / 2 + 4, mid, shift);
  return { index, d: `M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z`, dot };
});

function Hexagon({ active, onActive }: { active: number | null; onActive: (segment: number | null) => void }) {
  const { ref, run, at: timing } = useReveal<SVGSVGElement>(0.4);
  return (
    <svg ref={ref} viewBox="-170 -170 340 340" className="mx-auto block h-auto w-full max-w-[380px] overflow-visible" aria-hidden="true">
      {SEGMENTS.map(({ index, d, dot }) => {
        const statement = SEGMENT_FOR.indexOf(index as (typeof SEGMENT_FOR)[number]);
        const dim = active !== null && active !== statement;
        return (
          <motion.g
            key={index}
            style={{ transformOrigin: "0px 0px", transformBox: "view-box" }}
            initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
            animate={run ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.7, rotate: -12 }}
            transition={timing(0.1 + index * 0.09, 0.8)}
          >
            <g
              onMouseEnter={() => onActive(statement)}
              onMouseLeave={() => onActive(null)}
              style={{ opacity: dim ? 0.28 : 1, transition: "opacity 300ms ease" }}
            >
              <path d={d} fill={SHADES[index]} />
              <circle cx={dot[0]} cy={dot[1]} r="15" fill="#fff" />
              <text x={dot[0]} y={dot[1] + 3.5} textAnchor="middle" className={`${MONO} fill-black text-[10px]`}>
                {String(statement + 1).padStart(2, "0")}
              </text>
            </g>
          </motion.g>
        );
      })}
      <motion.circle
        r={INNER - 6}
        fill="#fff"
        stroke="rgba(0,0,0,.14)"
        strokeDasharray="2 5"
        strokeLinecap="round"
        initial={{ scale: 0 }}
        animate={{ scale: run ? 1 : 0 }}
        style={{ transformOrigin: "0px 0px", transformBox: "view-box" }}
        transition={timing(0.7, 0.6)}
      />
      <motion.text
        y="4"
        textAnchor="middle"
        className="fill-black font-serif text-[22px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: run ? 1 : 0 }}
        transition={timing(0.95, 0.5)}
      >
        PMS
      </motion.text>
    </svg>
  );
}

function Statement({ index, active, onActive }: { index: number; active: number | null; onActive: (statement: number | null) => void }) {
  const lit = active === index;
  return (
    <li
      onMouseEnter={() => onActive(index)}
      onMouseLeave={() => onActive(null)}
      className="flex gap-[16px] border-b border-b-[rgba(0,0,0,.13)] py-[20px] transition-opacity duration-300"
      style={{ opacity: active !== null && !lit ? 0.4 : 1 }}
    >
      <span className={`${MONO} mt-[.35em] w-[22px] shrink-0 text-[11px]`} style={{ color: lit ? ORANGE : "rgba(0,0,0,.5)" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-[17px] leading-[1.45]">{ABOUT_PMS[index]}</span>
    </li>
  );
}

/** About Moneybee PMS: the slide's banner line, then its hexagon between the two columns of statements. */
export default function AboutPms() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <PmsSection id="about-pms">
      <PmsSectionHead id="about-pms" label="About Moneybee PMS" heading={PMS_HEADINGS.about}>
        <p className={`max-w-[520px] text-black/70 ${BODY}`}>
          We look where the investment crowd is not looking. That is where we have found our gains.
        </p>
      </PmsSectionHead>
      <div className="mt-[80px] grid grid-cols-[1fr_minmax(260px,380px)_1fr] items-center gap-[48px] max-[1000px]:grid-cols-1 max-[1000px]:gap-[32px]">
        <ol className="list-none border-t border-t-black p-0 max-[1000px]:order-2">
          {[0, 1, 2].map((index) => (
            <Statement key={index} index={index} active={active} onActive={setActive} />
          ))}
        </ol>
        <div className="max-[1000px]:order-1 max-[1000px]:mx-auto max-[1000px]:w-[min(100%,320px)]">
          <Hexagon active={active} onActive={setActive} />
        </div>
        <ol start={4} className="list-none border-t border-t-black p-0 max-[1000px]:order-3 max-[1000px]:-mt-[32px] max-[1000px]:border-t-0">
          {[3, 4, 5].map((index) => (
            <Statement key={index} index={index} active={active} onActive={setActive} />
          ))}
        </ol>
      </div>
    </PmsSection>
  );
}
