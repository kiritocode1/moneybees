"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { CAREERS_LOREM, LIFE, RESUME_HREF } from "@/lib/careers";
import ApplyStack from "./apply-stack";

/*
 * /careers, content plan §10: Life at Moneybee around the team photograph,
 * in a faded-bottom panel, and how to apply as the stack loop with both CTAs.
 * The openings and culture are the study-04 and 03 sections in
 * components/careers-v3.
 */

/** The kobbe panel photographs sit in: #F6F6F6, 10px radius, a hairline ring. */
const PANEL = "overflow-hidden rounded-[10px] bg-[#F6F6F6] ring-1 ring-black/[.06]";
/** The panel's bottom 15% fades to the white page. */
const PANEL_FADE = { maskImage: "linear-gradient(to bottom, #000 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 85%, transparent)" } as const;
const number = (index: number) => String(index + 1).padStart(2, "0");
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";
const CTA = `inline-flex w-fit items-center rounded-full bg-[#F6A11A] px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-[color,background-color,transform,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-black hover:text-white active:scale-[0.97] motion-reduce:transition-none ${FOCUS}`;
const CTA_OUTLINE = `inline-flex w-fit items-center rounded-full border border-black/25 px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-[border-color,transform,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:border-black active:scale-[0.97] motion-reduce:transition-none ${FOCUS}`;

function useShown<T extends Element>(amount = 0.45) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

/** Life at Moneybee on white: the team photograph opens from the centre as the section comes into view. */
export function LifeSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="life" aria-labelledby="life-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <span className={`${EYEBROW} text-black/60`}>02</span>
            <h2 id="life-heading" className={`mt-[14px] ${SUBHEAD}`}>
              Life at Moneybee
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{LIFE.text}</p>
        </div>
        <div ref={ref} className={`relative mt-[56px] aspect-[16/9] w-full max-md:aspect-[4/3] ${PANEL}`} style={PANEL_FADE}>
          <div
            className="absolute inset-0 motion-reduce:!transition-none"
            style={{ clipPath: shown ? "inset(0 0 0 0)" : "inset(18% 30% 18% 30%)", transition: "clip-path 1200ms cubic-bezier(.22,1,.36,1)" }}
          >
            <Image src="/people/moneybee-team.jpg" alt="The Moneybee team at the Lower Parel office" fill sizes="(max-width: 1512px) 100vw, 1272px" className="object-cover object-[50%_40%]" />
          </div>
        </div>
        <ol className="mt-[32px] grid list-none grid-cols-1 gap-x-10 gap-y-6 p-0 md:grid-cols-3">
          {LIFE.notes.map((note, index) => (
            <li key={index} className="relative pt-[18px]">
              <span aria-hidden="true" className="absolute top-0 left-0 h-[2px] w-full bg-black/10" />
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-[2px] w-full origin-left bg-[#F6A11A] motion-reduce:!transition-none"
                style={{ transform: `scaleX(${shown ? 1 : 0})`, transition: `transform 600ms cubic-bezier(.23,1,.32,1) ${900 + index * 80}ms` }}
              />
              <span className={`${EYEBROW} text-black/60`}>{number(index)}</span>
              <p className="mt-[10px] text-[15px] leading-[1.55] text-black/65">{note}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** How to apply: the heading and both CTAs over the four steps as the stack loop. */
export function ApplySection() {
  return (
    <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <span className={`${EYEBROW} text-black/60`}>04</span>
            <h2 id="apply-heading" className={`mt-[14px] ${SUBHEAD}`}>
              How to Apply
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{CAREERS_LOREM.long}</p>
        </div>
        <div className="mt-[56px]">
          <ApplyStack />
        </div>
        <div className="mt-[24px] flex flex-wrap gap-[12px]">
          <a href="#openings" className={CTA}>
            View Open Positions
          </a>
          <a href={RESUME_HREF} className={CTA_OUTLINE}>
            Send Your Resume
          </a>
        </div>
      </div>
    </section>
  );
}
