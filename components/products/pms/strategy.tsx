"use client";

import { motion } from "motion/react";
import { EYEBROW } from "@/components/hero/editorial";
import { path, project } from "@/components/iso/geometry";
import { CLIENT_FIRST, PMS_HEADINGS, STRATEGY } from "@/lib/pms";
import { EDGE, MONO, ORANGE, PmsSection, PmsSectionHead, useReveal } from "./shared";

/*
 * Why Moneybee, group profile p11: the robust strategy and the client first
 * approach. The figure is the slide's "pyramiding approach in building
 * positions": a position laid down in steps, each added on top of the last.
 */

/** Plan sizes of the steps, base first, and each step's thickness. */
const STEPS = [168, 128, 90, 54] as const;
const THICK = 22;

function slab(size: number, z0: number, z1: number) {
  const a = -size / 2;
  const b = size / 2;
  return {
    top: path([project(a, a, z1), project(b, a, z1), project(b, b, z1), project(a, b, z1)]),
    right: path([project(b, a, z1), project(b, b, z1), project(b, b, z0), project(b, a, z0)]),
    left: path([project(a, b, z1), project(b, b, z1), project(b, b, z0), project(a, b, z0)]),
  };
}

const SLABS = STEPS.map((size, index) => ({ size, ...slab(size, index * THICK, (index + 1) * THICK) }));

function PositionSteps() {
  const { ref, run, at } = useReveal<HTMLDivElement>(0.4);
  const last = SLABS.length - 1;
  return (
    <div ref={ref} className="mx-auto w-full max-w-[440px]">
      <svg viewBox="-150 -140 300 210" className="block h-auto w-full overflow-visible" aria-hidden="true">
        <motion.ellipse
          cx="0"
          cy="0"
          rx="140"
          ry="49"
          fill="none"
          stroke="rgba(0,0,0,.3)"
          strokeDasharray="2 7"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: run ? 1 : 0 }}
          transition={at(0, 0.6)}
        />
        {SLABS.map(({ size, top, left, right }, index) => {
          const lit = index === last;
          return (
            <motion.g
              key={size}
              initial={{ opacity: 0, y: -40 }}
              animate={run ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
              transition={at(0.25 + index * 0.45, 0.6)}
            >
              <path d={left} fill={lit ? "#b87408" : "#e4e3e0"} stroke={lit ? "rgba(90,50,0,.75)" : EDGE} strokeWidth="0.9" strokeLinejoin="round" />
              <path d={right} fill={lit ? "#d98c10" : "#d6d5d2"} stroke={lit ? "rgba(90,50,0,.75)" : EDGE} strokeWidth="0.9" strokeLinejoin="round" />
              <path d={top} fill={lit ? ORANGE : "#fbfaf8"} stroke={lit ? "rgba(90,50,0,.75)" : EDGE} strokeWidth="0.9" strokeLinejoin="round" />
            </motion.g>
          );
        })}
      </svg>
      <motion.p
        className={`${EYEBROW} mt-[14px] text-center text-black/60`}
        initial={{ opacity: 0 }}
        animate={{ opacity: run ? 1 : 0 }}
        transition={at(0.25 + SLABS.length * 0.45, 0.5)}
      >
        Pyramiding approach
      </motion.p>
    </div>
  );
}

/** The robust strategy beside the steps, then the client first approach as three terms. */
export default function Strategy() {
  return (
    <PmsSection id="strategy">
      <PmsSectionHead id="strategy" label="Why Moneybee" heading={PMS_HEADINGS.strategy} />
      <div className="mt-[72px] grid grid-cols-[.9fr_1.1fr] items-center gap-[60px] max-[900px]:grid-cols-1">
        <PositionSteps />
        <ol className="list-none border-t border-t-black p-0">
          {STRATEGY.map((line, index) => (
            <li key={line} className="flex gap-[16px] border-b border-b-[rgba(0,0,0,.13)] py-[20px]">
              <span className={`${MONO} mt-[.35em] w-[22px] shrink-0 text-[11px]`} style={{ color: index === 3 ? ORANGE : "rgba(0,0,0,.5)" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[17px] leading-[1.45]">{line}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-[110px] grid grid-cols-[.9fr_1.1fr] gap-[60px] max-[900px]:mt-[72px] max-[900px]:grid-cols-1 max-[900px]:gap-[28px]">
        <h3 className="font-serif text-[clamp(1.9rem,2.6vw,2.4rem)] leading-[1.1] font-normal">{PMS_HEADINGS.clientFirst}</h3>
        <dl className="grid grid-cols-3 border-t border-t-black max-[700px]:grid-cols-1">
          {CLIENT_FIRST.map(([term, text]) => (
            <div key={term} className="border-b border-b-[rgba(0,0,0,.13)] py-[22px] pr-[24px] max-[700px]:pr-0">
              <dt className={`${EYEBROW} text-black/55`}>{term}</dt>
              <dd className={term === "Exit load" ? "mt-[12px] font-serif text-[2.4rem] leading-none text-[#F6A11A]" : "mt-[12px] text-[16px] leading-[1.5]"}>
                {text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </PmsSection>
  );
}
