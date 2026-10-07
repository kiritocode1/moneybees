"use client";

import { useShown } from "@/components/about-v2/shared";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN } from "@/components/hero/tokens";
import { TIMELINE_STOPS } from "@/lib/about-v3";

/*
 * The plan's "simple company timeline" (§2) as one ruled line with a stop per
 * date: the line draws left to right as the section comes into view, and each
 * stop's orange square lands as the line reaches it. Below 768px the line
 * runs down the left edge instead. The isometric solid that once carried these
 * dates is on /aif now.
 */
export function TimelineSection() {
  const { ref, shown, t } = useShown<HTMLOListElement>(0.35);
  return (
    <section id="timeline" aria-labelledby="timeline-heading" className="scroll-mt-[96px] bg-[#F6F6F6] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <h2 id="timeline-heading">
          <BracketLabel>Timeline</BracketLabel>
        </h2>
        <ol ref={ref} className="relative mt-[56px] grid list-none grid-cols-1 gap-y-[40px] p-0 max-md:pl-[28px] md:grid-cols-3 md:gap-x-6">
          {/* The line: across the top from md, down the left edge below it. */}
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 h-px w-full origin-left bg-black max-md:h-full max-md:w-px max-md:origin-top"
            style={{ transform: shown ? "none" : "scale(0)", transition: `transform ${t(1400)}` }}
          />
          {TIMELINE_STOPS.map((stop, index) => (
            <li key={stop.label} className="relative md:pt-[36px]">
              <span
                aria-hidden="true"
                className="absolute top-[-5px] left-0 h-[11px] w-[11px] bg-[#F6A11A] max-md:top-[10px] max-md:left-[-33px]"
                style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "scale(.4)", transition: `opacity ${t(300, 250 + index * 420)}, transform ${t(500, 250 + index * 420)}` }}
              />
              <p
                className="m-0 font-serif text-[clamp(2.4rem,1.6rem+2.6vw,4.2rem)] leading-none tracking-[-.02em]"
                style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(14px)", transition: `opacity ${t(600, 350 + index * 420)}, transform ${t(800, 350 + index * 420)}` }}
              >
                {stop.label}
              </p>
              <p
                className="mt-[16px] max-w-[28ch] text-[17px] leading-[1.5] text-black/75"
                style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(600, 480 + index * 420)}` }}
              >
                {stop.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
