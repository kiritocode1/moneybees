"use client";

import { useRef } from "react";
import { SMALL_CAP_THESIS } from "@/lib/insights";
import { BracketLabel, SectionHeading } from "./fact-section";
import { Panel, SplitFrame, typedWords, useStageClock } from "./motion-language";

const PER_WORD = 0.06;
const GAP = 0.5;

/** When each panel starts typing: one after another, left to right. */
const STARTS = SMALL_CAP_THESIS.reduce<number[]>(
  (starts, item, index) => [...starts, index === 0 ? 0.2 : starts[index - 1] + SMALL_CAP_THESIS[index - 1].text.split(" ").length * PER_WORD + GAP],
  [],
);
const END = STARTS[STARTS.length - 1] + SMALL_CAP_THESIS[SMALL_CAP_THESIS.length - 1].text.split(" ").length * PER_WORD + 0.2;

/**
 * Why small caps, group profile slide 14, in the deck's three blocks. Each
 * panel's text types in after the one before it, the reference's typing
 * device, so the argument reads in the deck's order.
 */
export default function WhySmallCapsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useStageClock(ref, END);
  return (
    <section id="why-small-caps" aria-labelledby="why-small-caps-heading" className="bg-white">
      <SectionHeading id="why-small-caps" label="Why small caps" heading="Why we focus on small cap Indian equities" />
      <div ref={ref} className="mt-[72px]">
        <SplitFrame cols={3} cross={false}>
          {SMALL_CAP_THESIS.map((item, index) => {
            const { settled, newest } = typedWords(item.text, t, STARTS[index], PER_WORD);
            return (
              <Panel key={item.title} className="flex min-h-[420px] flex-col p-[36px] max-[600px]:p-[24px]">
                <span className="font-mono text-[11px] text-[rgba(0,0,0,.45)]">{String(index + 1).padStart(2, "0")}</span>
                <div className="mt-[18px]">
                  <BracketLabel>{item.title}</BracketLabel>
                </div>
                <p className="mt-auto pt-[40px] text-[clamp(1.2rem,1.7vw,1.6rem)] leading-[1.22] font-light tracking-[-.025em]" aria-label={item.text}>
                  <span aria-hidden="true">
                    {settled} {newest && <span className="text-[rgba(0,0,0,.35)]">{newest}</span>}
                  </span>
                </p>
              </Panel>
            );
          })}
        </SplitFrame>
      </div>
    </section>
  );
}
