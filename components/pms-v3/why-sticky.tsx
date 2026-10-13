"use client";

import { useInView } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { WHY_GLYPHS } from "@/components/pms-v2/why-glyphs";
import { PMS_WHY, type WhyContent } from "@/lib/pages/pms-content";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * Why Moneybee PMS? as Titan Gate's benefits split (reference/titangate/NOTES.md
 * §4 row 11): the seven points scroll past on the left, and a sticky pane on
 * the right swaps to the point crossing the middle of the screen, with a
 * the point's drawing. Below 768px it is a plain list. The points, their
 * drawings and lines come from the PMS page in /admin.
 */

type Point = NonNullable<WhyContent["points"]>[number];

/** Inactive names: #767676 is 4.5:1 on white; the brand grey #9D9EA1 is 2.7:1, under the 3:1 large-text minimum. */
const GREY = "#767676";

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

/** The sticky pane with the active point's drawing and its line. */
function Pane({ points, active, previous, drawn }: { points: Point[]; active: number; previous: number; drawn: boolean }) {
  return (
    <div aria-hidden="true" className="relative w-full p-[10px]">
      <Corners />
      <div className="bg-[#F6F6F6] px-[clamp(24px,3vw,48px)] pt-[clamp(20px,2.2vw,32px)] pb-[clamp(28px,3vw,44px)]">
        <div className="grid [&>*]:[grid-area:1/1]">
          {points.map((point, index) => {
            const Glyph = WHY_GLYPHS[point.drawing];
            const current = index === active;
            return (
              <div
                key={index}
                className="transition-opacity ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none"
                style={{ opacity: current ? 1 : 0, transitionDuration: current ? "400ms" : "200ms" }}
              >
                <Glyph on={drawn && current} />
              </div>
            );
          })}
        </div>
        <div className="mt-[clamp(20px,2.5vw,36px)] grid [&>*]:[grid-area:1/1]">
          {points.map(({ line }, index) => (
            <p key={index} data-state={index === active ? "in" : index === previous ? "out" : undefined} className="pv3-line m-0 max-w-[34ch] text-[17px] leading-[1.5] text-black/75">
              {(line ?? "").split(" ").map((word, w) => (
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
function Split({ points }: { points: Point[] }) {
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
        {points.map((point, index) => (
          <li
            key={index}
            ref={(item) => {
              items.current[index] = item;
            }}
            data-index={index}
            aria-current={index === active ? "step" : undefined}
            className="flex h-[36svh] items-center"
          >
            <div>
              <h3
                className="m-0 font-serif text-[clamp(2.25rem,.9rem+2.8vw,3.8rem)] leading-[1.02] font-semibold tracking-[-.02em] transition-colors duration-500 motion-reduce:transition-none"
                style={{ color: index === active ? "#000" : GREY }}
              >
                {point.name}
              </h3>
              {point.line ? <p className="sr-only">{point.line}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      <div className="sticky top-0 flex h-svh items-center self-start">
        <Pane points={points} active={active} previous={previous} drawn={reached || reduce} />
      </div>
    </div>
  );
}

/** Phone: each point's drawing beside its name, drawn as the row scrolls in. */
function Row({ point }: { point: Point }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const Glyph = WHY_GLYPHS[point.drawing];
  return (
    <li ref={ref} className="grid grid-cols-[128px_minmax(0,1fr)] items-center gap-5 border-b border-black/10 py-6">
      <div aria-hidden="true">
        <Glyph on={inView || reduce} />
      </div>
      <div>
        <h3 className="m-0 font-serif text-[1.55rem] leading-[1.1] font-semibold">{point.name}</h3>
      </div>
    </li>
  );
}

export function WhySection({ content = PMS_WHY }: { content?: WhyContent }) {
  const points = content.points ?? [];
  return (
    <section id="why" aria-labelledby="why-heading" className="scroll-mt-[96px] bg-white text-black">
      <style href="pms-v3-why" precedence="default">
        {STYLES}
      </style>
      <div className={`${COLUMN} grid grid-cols-1 items-end gap-8 pt-[120px] max-md:pt-[80px] md:grid-cols-2 md:gap-16`}>
        <div>
          {content.label ? <BracketLabel>{content.label}</BracketLabel> : null}
          <h2 id="why-heading" className={`mt-[18px] ${SUBHEAD}`}>
            {content.heading}
          </h2>
        </div>
        {content.intro ? <p className={`m-0 text-black/70 ${BODY}`}>{content.intro}</p> : null}
      </div>
      <Split points={points} />
      <div className={`${COLUMN} mt-10 pb-[80px] md:hidden`}>
        <ol className="m-0 list-none border-t border-black/10 p-0">
          {points.map((point, index) => (
            <Row key={index} point={point} />
          ))}
        </ol>
      </div>
    </section>
  );
}
