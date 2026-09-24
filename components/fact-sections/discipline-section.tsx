"use client";

import { useRef } from "react";
import { DISCIPLINE_LEAD, EXIT_TRIGGERS, HEADINGS, RED_FLAGS, WHAT_WE_DONT_DO, WHAT_WE_LOOK_FOR } from "@/lib/insights";
import { BracketLabel, ORANGE, SectionHeading } from "./fact-section";
import { Panel, SplitFrame, useStageClock } from "./motion-language";

const STEP = 0.55;
const REST = 1.8;

/**
 * One list in the reference's stacked style: items arrive one at a time, the
 * newest with a solid bullet, earlier ones dropping to hollow bullets and grey.
 * Each panel runs its own clock with its own offset, so the four panels never
 * change together, the way the reference's panels cut independently.
 */
export function StackedList({ title, items, offset, accent }: { title: string; items: readonly string[]; offset: number; accent?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const period = items.length * STEP + REST;
  const t = (useStageClock(ref, period - 0.01, period) + offset) % period;
  const current = Math.min(items.length - 1, Math.floor(t / STEP));
  return (
    <div ref={ref} className="flex h-full flex-col p-[32px] max-[600px]:p-[22px]">
      <BracketLabel>{title}</BracketLabel>
      <ul className="mt-auto list-none p-0 pt-[40px]">
        {items.map((item, index) => {
          const shown = index <= current;
          const newest = index === current;
          return (
            <li
              key={item}
              className="flex items-start gap-[12px] py-[6px] text-[clamp(1.05rem,1.5vw,1.4rem)] leading-[1.2] font-light tracking-[-.025em]"
              style={{
                opacity: shown ? 1 : 0,
                transform: `translateY(${shown ? 0 : 8}px)`,
                color: newest ? "#000" : "rgba(0,0,0,.4)",
                transition: "opacity 300ms ease, transform 300ms ease, color 300ms ease",
              }}
            >
              <span
                className="mt-[.45em] h-[8px] w-[8px] shrink-0 rounded-full"
                style={{
                  background: newest ? (accent ? ORANGE : "#000") : "transparent",
                  border: newest ? "none" : "1px solid rgba(0,0,0,.35)",
                }}
              />
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** What Moneybee looks for, what it will not do, what rules a company out, and when it sells. AIF presentation p5 to 6. */
export default function DisciplineSection() {
  return (
    <section id="discipline" aria-labelledby="discipline-heading" className="bg-white">
      <SectionHeading id="discipline" label="Our professional discipline" heading={HEADINGS.discipline} lead={DISCIPLINE_LEAD} />
      <div className="mt-[72px]">
        <SplitFrame>
          <Panel className="min-h-[440px]">
            <StackedList title="What we look for" items={WHAT_WE_LOOK_FOR} offset={0} />
          </Panel>
          <Panel className="min-h-[440px]">
            <StackedList title="What we don't do" items={WHAT_WE_DONT_DO} offset={1.1} />
          </Panel>
          <Panel className="min-h-[340px]">
            <StackedList title="Red flags" items={RED_FLAGS} offset={2.3} accent />
          </Panel>
          <Panel className="min-h-[340px]">
            <StackedList title="Exit" items={EXIT_TRIGGERS} offset={0.6} />
          </Panel>
        </SplitFrame>
      </div>
    </section>
  );
}
