"use client";

import { useInView } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { WHY_GLYPHS } from "@/components/pms-v2/why-glyphs";
import { PMS_INTRO_APPROACH, WHY_PMS } from "@/lib/pms-v2";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * Why Moneybee PMS? as Titan Gate's benefits split (reference/titangate/NOTES.md
 * §4 row 11): the seven points scroll past on the left, and a sticky pane on
 * the right swaps to the point crossing the middle of the screen, with a
 * rolling counter and the point's drawing. Below 768px it is a plain list.
 */

const MONO = "font-[family-name:var(--font-geist-mono)]";
/** Inactive names: #767676 is 4.5:1 on white; the brand grey #9D9EA1 is 2.7:1, under the 3:1 large-text minimum. */
const GREY = "#767676";

/** Placeholder until the client supplies a line per point. LOREM. */
const LINES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
] as const;

const pad = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Their card text swap: entering words blink in (.32s, 32ms apart, after
 * .125s), the leaving line fades out (.2s, 22ms apart). Grey stands in for
 * their lavender so the drawing keeps the only orange.
 */
const STYLES = `
@keyframes pv3-word-in{0%{color:${GREY};opacity:0}20%{opacity:1}35%{color:${GREY}}55%{opacity:.6}70%{color:inherit}85%{opacity:1}to{opacity:1}}
@keyframes pv3-word-out{from{opacity:1}to{opacity:0}}
.pv3-line .pv3-word{opacity:0}
.pv3-line[data-state=in] .pv3-word{opacity:1}
@media (prefers-reduced-motion:no-preference){
.pv3-line[data-state=in] .pv3-word{animation:pv3-word-in .32s cubic-bezier(.645,.045,.355,1) both;animation-delay:calc(var(--word)*32ms + .125s)}
.pv3-line[data-state=out] .pv3-word{animation:pv3-word-out .2s cubic-bezier(.645,.045,.355,1) both;animation-delay:calc(var(--word)*22ms)}
}
`;

/** Their L-shaped corner brackets, 25px arms of 1px, around a card inset by 10px. */
function Corners() {
  const arm = "absolute size-[25px] border-black";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <i className={`${arm} top-0 left-0 border-t border-l`} />
      <i className={`${arm} top-0 right-0 border-t border-r`} />
      <i className={`${arm} bottom-0 left-0 border-b border-l`} />
      <i className={`${arm} right-0 bottom-0 border-r border-b`} />
    </div>
  );
}

/** "01 / 07": a 1em-tall window over the column of numbers, which rolls to the active one. */
function Counter({ active }: { active: number }) {
  return (
    <div className={`${MONO} inline-flex items-center gap-[.7em] bg-white px-[14px] py-[9px] text-[12px] leading-none tracking-[.2em]`}>
      <span className="relative block h-[1em] overflow-hidden">
        <span
          className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateY(${-active}em)` }}
        >
          {WHY_PMS.map((point, index) => (
            <span key={point.name} className="block h-[1em] leading-none">
              {pad(index)}
            </span>
          ))}
        </span>
      </span>
      <span className="text-black/35">/ {pad(WHY_PMS.length - 1)}</span>
    </div>
  );
}

/** The sticky pane: counter, the active point's drawing, and its line. */
function Pane({ active, previous, drawn }: { active: number; previous: number; drawn: boolean }) {
  return (
    <div aria-hidden="true" className="relative w-full p-[10px]">
      <Corners />
      <div className="bg-[#F6F6F6] px-[clamp(24px,3vw,48px)] pt-[clamp(20px,2.2vw,32px)] pb-[clamp(28px,3vw,44px)]">
        <Counter active={active} />
        <div className="mt-[clamp(20px,2.5vw,40px)] grid [&>*]:[grid-area:1/1]">
          {WHY_PMS.map((point, index) => {
            const Glyph = WHY_GLYPHS[point.glyph];
            const current = index === active;
            return (
              <div
                key={point.name}
                className="transition-opacity ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none"
                style={{ opacity: current ? 1 : 0, transitionDuration: current ? "400ms" : "200ms" }}
              >
                <Glyph on={drawn && current} />
              </div>
            );
          })}
        </div>
        <div className="mt-[clamp(20px,2.5vw,36px)] grid [&>*]:[grid-area:1/1]">
          {LINES.map((line, index) => (
            <p key={line} data-state={index === active ? "in" : index === previous ? "out" : undefined} className="pv3-line m-0 max-w-[34ch] text-[17px] leading-[1.5] text-black/75">
              {line.split(" ").map((word, w) => (
                <span key={w} className="pv3-word" style={{ "--word": w } as CSSProperties}>
                  {word}{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Desktop: names on the left, one per 36svh, and the pane pinned on the right. */
function Split() {
  const reduce = useReducedMotion();
  const split = useRef<HTMLDivElement>(null);
  const reached = useInView(split, { once: true, amount: 0.15 });
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const [{ active, previous }, setState] = useState({ active: 0, previous: -1 });

  // The name covering a 1% band at the middle of the screen is the active one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          setState((state) => (state.active === index ? state : { active: index, previous: state.active }));
        }
      },
      { rootMargin: "-50% 0px -49% 0px" },
    );
    items.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={split} className={`${COLUMN} grid grid-cols-2 gap-[clamp(40px,5vw,96px)] max-md:hidden`}>
      <ol className="m-0 list-none py-[32svh] pl-0">
        {WHY_PMS.map((point, index) => (
          <li
            key={point.name}
            ref={(item) => {
              items.current[index] = item;
            }}
            data-index={index}
            aria-current={index === active ? "step" : undefined}
            className="flex h-[36svh] items-center"
          >
            <div>
              <h3
                className="m-0 font-serif text-[clamp(2.25rem,.9rem+2.8vw,3.8rem)] leading-[1.02] font-normal tracking-[-.02em] transition-colors duration-500 motion-reduce:transition-none"
                style={{ color: index === active ? "#000" : GREY }}
              >
                {point.name}
              </h3>
              <p className="sr-only">{LINES[index]}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="sticky top-0 flex h-svh items-center self-start">
        <Pane active={active} previous={previous} drawn={reached || reduce} />
      </div>
    </div>
  );
}

/** Phone: each point's drawing beside its name, drawn as the row scrolls in. */
function Row({ index }: { index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const point = WHY_PMS[index];
  const Glyph = WHY_GLYPHS[point.glyph];
  return (
    <li ref={ref} className="grid grid-cols-[128px_minmax(0,1fr)] items-center gap-5 border-b border-black/10 py-6">
      <div aria-hidden="true">
        <Glyph on={inView || reduce} />
      </div>
      <div>
        <span className={`${MONO} text-[11px] tracking-[.1em] text-black/55`}>{pad(index)}</span>
        <h3 className="mt-1 mb-0 font-serif text-[1.55rem] leading-[1.1] font-normal">{point.name}</h3>
      </div>
    </li>
  );
}

export function WhySection() {
  return (
    <section id="why" aria-labelledby="why-heading" className="scroll-mt-[96px] bg-white text-black">
      <style href="pms-v3-why" precedence="default">
        {STYLES}
      </style>
      <div className={`${COLUMN} grid grid-cols-1 items-end gap-8 pt-[120px] max-md:pt-[80px] md:grid-cols-2 md:gap-16`}>
        <div>
          <BracketLabel>Why Moneybee</BracketLabel>
          <h2 id="why-heading" className={`mt-[18px] ${SUBHEAD}`}>
            Why Moneybee PMS?
          </h2>
        </div>
        <p className={`m-0 text-black/70 ${BODY}`}>{PMS_INTRO_APPROACH}</p>
      </div>
      <Split />
      <div className={`${COLUMN} mt-10 pb-[80px] md:hidden`}>
        <ol className="m-0 list-none border-t border-black/10 p-0">
          {WHY_PMS.map((point, index) => (
            <Row key={point.name} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
