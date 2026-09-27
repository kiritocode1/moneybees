"use client";

import { motion } from "motion/react";
import { r2 } from "@/components/fact-sections/fact-section";
import { BODY } from "@/components/hero/editorial";
import { barFaces, project } from "@/components/iso/geometry";
import { PMS_HEADINGS, SECTORS } from "@/lib/pms";
import { EDGE, MONO, PmsSection, PmsSectionHead, useReveal, useTween } from "./shared";

/*
 * Top 5 - Sector Allocation (%), group profile p19. The slide's bar chart,
 * lowest to highest left to right as it prints them, as solids in the page's
 * projection. Each bar grows to its share once in view; the tallest is orange.
 */

const ASCENDING = [...SECTORS].reverse();
const SIZE = 46;
const STEP = 80;
/** Screen units per percentage point. */
const UNIT = 15;

/** A sector name on two lines when it has more than one word. */
const lines = (name: string) => {
  const words = name.split(" ");
  if (words.length < 2) return words;
  const half = Math.ceil(words.length / 2);
  return [words.slice(0, half).join(" "), words.slice(half).join(" ")];
};

function SectorBars() {
  const { ref, run, at } = useReveal<HTMLDivElement>(0.4);
  const grow = [useTween(run, 1.1, 0.1), useTween(run, 1.1, 0.22), useTween(run, 1.1, 0.34), useTween(run, 1.1, 0.46), useTween(run, 1.1, 0.58)];
  const last = ASCENDING.length - 1;
  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox="-70 -235 660 300"
        role="img"
        aria-label={`Top five sectors by allocation: ${SECTORS.map(([name, value]) => `${name} ${value}%`).join(", ")}.`}
        className="block h-auto w-full overflow-visible"
      >
        {ASCENDING.map(([name, value], index) => {
          const x = index * STEP;
          const y = -index * STEP;
          const lit = index === last;
          const faces = barFaces(x, y, SIZE, Math.max(0.5, value * UNIT * grow[index]));
          const [tx, ty] = project(x + SIZE / 2, y + SIZE / 2, value * UNIT * grow[index]);
          const [bx, by] = project(x + SIZE, y + SIZE, 0);
          const stroke = lit ? "rgba(90,50,0,.75)" : EDGE;
          return (
            <g key={name}>
              <path d={faces.left} fill={lit ? "#b87408" : "#e4e3e0"} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />
              <path d={faces.right} fill={lit ? "#d98c10" : "#d6d5d2"} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />
              <path d={faces.top} fill={lit ? "#F7A11A" : "#fbfaf8"} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />
              <motion.text
                x={r2(tx)}
                y={r2(ty) - 18}
                textAnchor="middle"
                className="fill-black font-serif text-[24px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: run ? 1 : 0 }}
                transition={at(0.9 + index * 0.12, 0.4)}
              >
                {value}
              </motion.text>
              <text x={r2(bx) - 16} y={r2(by) + 26} textAnchor="middle" className={`${MONO} fill-black/60 text-[10px] tracking-[.08em] uppercase max-[700px]:hidden`}>
                {lines(name).map((line, row) => (
                  <tspan key={line} x={r2(bx) - 16} dy={row ? 14 : 0}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** The five largest sectors in the portfolio. */
export default function Sectors() {
  return (
    <PmsSection id="sectors">
      <PmsSectionHead id="sectors" label="Where the portfolio sits" heading={PMS_HEADINGS.sectors}>
        <p className={`max-w-[480px] text-black/70 ${BODY}`}>
          The five largest sectors in the portfolio, as a share of it. No sector is allowed above 30%.
        </p>
      </PmsSectionHead>
      <div className="mt-[72px] overflow-hidden">
        <SectorBars />
      </div>
      {/* On a phone the bar labels would be too small to read, so the names sit in a list under the bars. */}
      <ol className="mt-[28px] hidden list-none border-t border-t-black p-0 max-[700px]:block">
        {SECTORS.map(([name, value]) => (
          <li key={name} className="flex items-baseline justify-between border-b border-b-[rgba(0,0,0,.13)] py-[12px]">
            <span className="text-[15px]">{name}</span>
            <span className={`${MONO} text-[13px]`}>{value}%</span>
          </li>
        ))}
      </ol>
    </PmsSection>
  );
}
