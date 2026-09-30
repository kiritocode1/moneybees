"use client";

import { motion } from "motion/react";
import { r2 } from "@/components/fact-sections/fact-section";
import { EYEBROW } from "@/components/hero/editorial";
import { CONSTRUCTION, type ConstructionRule, PMS_HEADINGS } from "@/lib/pms";
import { GREY, ORANGE, PmsSection, PmsSectionHead, useReveal } from "./shared";

/*
 * Portfolio construction, group profile p17. The slide sets its five rules on
 * half rings, alternately arched and cupped; here each ring also carries its
 * rule: twenty segments with fifteen filled, three year segments, a 30% cap,
 * a spread of sector shades, and a ring that fills and lets its last piece go.
 */

const RADIUS = 58;
const STROKE = 16;

const point = (degrees: number) => {
  const angle = (degrees * Math.PI) / 180;
  return `${r2(Math.cos(angle) * RADIUS)} ${r2(Math.sin(angle) * RADIUS)}`;
};

/**
 * `count` pieces across a half ring, counted from the left, with a small gap
 * between them. An arched ring runs over the top (180 to 360 degrees, 90 is
 * down); a cupped ring runs under the bottom (180 back to 0).
 */
const pieces = (count: number, dome: boolean, gap = 2.4) => {
  const direction = dome ? 1 : -1;
  const step = 180 / count;
  return Array.from({ length: count }, (_, index) => {
    const from = 180 + direction * (index * step + gap / 2);
    const to = 180 + direction * ((index + 1) * step - gap / 2);
    return `M${point(from)} A${RADIUS} ${RADIUS} 0 0 ${dome ? 1 : 0} ${point(to)}`;
  });
};

type Segment = { d: string; stroke: string; dashed?: boolean };

function segmentsFor(key: ConstructionRule["key"], dome: boolean): Segment[] {
  switch (key) {
    case "allocation":
      return pieces(20, dome, 3).map((d, index) => ({ d, stroke: index < 15 ? ORANGE : GREY, dashed: index >= 15 }));
    case "horizon":
      return pieces(3, dome, 4).map((d) => ({ d, stroke: ORANGE }));
    case "diversification": {
      const [capped, rest] = [pieces(10, dome, 0).slice(0, 3), pieces(10, dome, 0).slice(3)];
      return [...capped.map((d) => ({ d, stroke: ORANGE })), ...rest.map((d) => ({ d, stroke: "#e4e3e0" }))];
    }
    case "mitigation":
      return pieces(6, dome, 3).map((d, index) => ({ d, stroke: ["#F6A11A", "#E8842C", "#D9955B"][index % 3] }));
    case "rebalancing":
      return pieces(8, dome, 2).map((d) => ({ d, stroke: ORANGE }));
  }
}

function Ring({ rule, index }: { rule: ConstructionRule; index: number }) {
  const dome = index % 2 === 0;
  const { ref, run, at } = useReveal<SVGSVGElement>(0.5);
  const segments = segmentsFor(rule.key, dome);
  const exit = rule.key === "rebalancing";
  return (
    <svg
      ref={ref}
      viewBox={dome ? "-80 -80 160 92" : "-80 -12 160 92"}
      className="block h-auto w-full max-w-[190px] overflow-visible"
      aria-hidden="true"
    >
      {segments.map(({ d, stroke, dashed }, piece) => {
        const last = exit && piece === segments.length - 1;
        return (
          <motion.path
            key={piece}
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={dashed ? 1.4 : STROKE}
            strokeDasharray={dashed ? "2 3" : undefined}
            initial={{ pathLength: 0, opacity: 0, x: 0, y: 0 }}
            animate={
              run
                ? { pathLength: 1, opacity: 1, ...(last ? { x: 22, y: dome ? 18 : -18 } : {}) }
                : { pathLength: 0, opacity: 0, x: 0, y: 0 }
            }
            transition={{
              pathLength: at(0.1 + piece * (0.9 / segments.length), 0.35),
              opacity: at(0.1 + piece * (0.9 / segments.length), 0.1),
              x: at(1.5, 0.8),
              y: at(1.5, 0.8),
            }}
          />
        );
      })}
    </svg>
  );
}

/** The five rules in a row, arched and cupped in turn as on the slide. */
export default function Construction() {
  return (
    <PmsSection id="construction">
      <PmsSectionHead id="construction" label="Managing the portfolio" heading={PMS_HEADINGS.construction} />
      <ol className="mt-[80px] grid list-none grid-cols-5 gap-[32px] p-0 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1 max-[600px]:gap-[56px]">
        {CONSTRUCTION.map((rule, index) => (
          <li key={rule.key} className={`flex flex-col ${index % 2 === 1 ? "min-[1101px]:mt-[120px]" : ""}`}>
            <div className={`flex ${index % 2 === 1 ? "min-[1101px]:order-2 min-[1101px]:mt-[22px]" : "mb-[22px]"}`}>
              <Ring rule={rule} index={index} />
            </div>
            <div>
              <span className={`${EYEBROW} text-black/55`}>{rule.name}</span>
              <strong className="mt-[8px] block font-serif text-[clamp(2rem,2.6vw,2.6rem)] leading-none font-normal text-[#F6A11A]">
                {rule.figure}
              </strong>
              <p className="mt-[14px] text-[15px] leading-[1.55] text-black/70">{rule.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </PmsSection>
  );
}
