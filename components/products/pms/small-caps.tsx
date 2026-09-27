"use client";

import { motion } from "motion/react";
import { EYEBROW } from "@/components/hero/editorial";
import { SMALL_CAP_THESIS } from "@/lib/insights";
import { PMS_HEADINGS } from "@/lib/pms";
import { GREY, MONO, ORANGE, PmsSection, PmsSectionHead, useReveal } from "./shared";

/*
 * Why we focus on small cap Indian equities, group profile p14. The slide
 * expects small businesses to grow much faster than GDP; the figure draws that
 * expectation as two paths from one start. It is a diagram, not data: no axis
 * carries a value, because the slide gives none. The slide's index and
 * multibagger-share figures are left out (no source or date).
 */

const X0 = 40;
const X1 = 640;
const BASE = 280;
const economy = `M${X0} ${BASE} C 260 ${BASE - 30}, 460 ${BASE - 70}, ${X1} ${BASE - 108}`;
const smallCaps = `M${X0} ${BASE} C 220 ${BASE - 42}, 440 ${BASE - 120}, ${X1} ${BASE - 250}`;

function Diverge() {
  const { ref, run, at } = useReveal<HTMLDivElement>(0.4);
  return (
    <div ref={ref} className="relative w-full">
      <svg viewBox="0 0 680 310" className="block h-auto w-full overflow-visible" aria-hidden="true">
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: run ? 1 : 0 }} transition={at(0, 0.6)}>
          <line x1={X0} y1="10" x2={X0} y2={BASE} stroke="rgba(0,0,0,.34)" strokeDasharray="2 5" strokeLinecap="round" />
          <line x1={X0} y1={BASE} x2={X1 + 20} y2={BASE} stroke="rgba(0,0,0,.34)" strokeDasharray="2 5" strokeLinecap="round" />
        </motion.g>
        <motion.path
          d={economy}
          fill="none"
          stroke={GREY}
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: run ? 1 : 0 }}
          transition={{ ...at(0.3, 1.6), ease: [0.45, 0, 0.2, 1] }}
        />
        <motion.path
          d={smallCaps}
          fill="none"
          stroke={ORANGE}
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: run ? 1 : 0 }}
          transition={{ ...at(0.5, 1.8), ease: [0.45, 0, 0.2, 1] }}
        />
        {(
          [
            [BASE - 108, GREY, 1.9],
            [BASE - 250, ORANGE, 2.3],
          ] as const
        ).map(([y, fill, delay]) => (
          <motion.circle
            key={fill}
            cx={X1}
            cy={y}
            r="4.6"
            fill={fill}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            initial={{ scale: 0 }}
            animate={{ scale: run ? 1 : 0 }}
            transition={at(delay, 0.4)}
          />
        ))}
      </svg>
      <div aria-hidden="true" className="absolute inset-0">
        <motion.span
          className={`${EYEBROW} absolute bg-[#FDEFE2] px-[9px] py-[5px] whitespace-nowrap text-black`}
          style={{ right: `${((680 - X1 + 14) / 680) * 100}%`, top: `${((BASE - 250) / 310) * 100}%`, translate: "0 -50%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: run ? 1 : 0 }}
          transition={at(2.4, 0.4)}
        >
          Small businesses
        </motion.span>
        <motion.span
          className={`${EYEBROW} absolute bg-[#F7F7F8] px-[9px] py-[5px] whitespace-nowrap text-black`}
          style={{ right: `${((680 - X1 + 14) / 680) * 100}%`, top: `${((BASE - 108) / 310) * 100}%`, translate: "0 -50%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: run ? 1 : 0 }}
          transition={at(2, 0.4)}
        >
          GDP
        </motion.span>
      </div>
    </div>
  );
}

/** The thesis: the figure beside the slide's three reasons. */
export default function SmallCaps() {
  return (
    <PmsSection id="small-caps">
      <PmsSectionHead id="small-caps" label="Our focus" heading={PMS_HEADINGS.smallCaps} />
      <div className="mt-[72px] grid grid-cols-[1.15fr_.85fr] items-center gap-[64px] max-[900px]:grid-cols-1 max-[900px]:gap-[40px]">
        <Diverge />
        <ol className="list-none border-t border-t-black p-0">
          {SMALL_CAP_THESIS.map(({ title, text }, index) => (
            <li key={title} className="border-b border-b-[rgba(0,0,0,.13)] py-[22px]">
              <span className={`${MONO} text-[11px] text-black/50`}>{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-[8px] font-serif text-[clamp(1.4rem,1.8vw,1.7rem)] leading-[1.1] font-normal">{title}</h3>
              <p className="mt-[10px] text-[15px] leading-[1.55] text-black/70">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </PmsSection>
  );
}
