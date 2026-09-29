"use client";

import { useInView } from "motion/react";
import { type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import { APPROACH, APPROACH_LOREM, APPROACH_PARTS, DONT_DO, LOOK_FOR, PHILOSOPHY_STAGES, RISKS } from "@/lib/approach";
import { ORANGE, RISK_GLYPHS, STAGE_GLYPHS } from "./glyphs";

/*
 * /our-approach, content plan §6: the heading, the core philosophy, the six
 * step process (process-steps.tsx), what we look for and don't do, and the
 * four risks. Every section has a drawing that explains it; body copy is
 * placeholder until the client writes it.
 */

const number = (index: number) => String(index + 1).padStart(2, "0");

/** Plays its children's explained state once the block is half in view. */
function useShown<T extends Element>(amount = 0.45) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

export function ApproachHero() {
  return (
    <section aria-labelledby="approach-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 items-end gap-14 pt-[150px] pb-[110px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:pt-[220px] max-md:pb-[72px]`}>
        <div>
          <Rise>
            <BracketLabel>Our approach</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="approach-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {APPROACH.heading}
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className={`mt-8 max-w-[520px] text-black/70 ${BODY}`}>{APPROACH.lead}</p>
          </Rise>
        </div>
        <Rise delay={0.2}>
          <nav aria-label="On this page">
            <ol className="list-none border-t border-black p-0">
              {APPROACH_PARTS.map(([label, href], index) => (
                <li key={href} className="border-b border-black/15">
                  <a href={href} className="group flex items-baseline gap-[18px] py-[14px] text-black no-underline">
                    <span className="w-[34px] text-[22px] leading-none font-light tracking-[-.04em] text-[#F7A11A]">{number(index)}</span>
                    <span className="text-[17px] text-black/75 transition-colors group-hover:text-black">{label}</span>
                    <span className="ml-auto h-[2px] w-0 bg-[#F7A11A] transition-all duration-300 group-hover:w-[28px]" />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Rise>
      </div>
    </section>
  );
}

/** A plain horizontal arrow between stages; on a phone it turns to point down. */
function StageArrow({ on, delay }: { on: boolean; delay: number }) {
  return (
    <div aria-hidden="true" className="flex items-center justify-center max-md:py-2 md:px-2">
      <svg viewBox="0 0 48 14" className="h-[14px] w-[48px] max-md:rotate-90" style={{ opacity: on ? 1 : 0, transition: `opacity 500ms ease ${delay}ms` }}>
        <path d="M0 7H44M38 1l6 6-6 6" fill="none" stroke={ORANGE} strokeWidth="2" />
      </svg>
    </div>
  );
}

/** Undiscovered → Under-researched → Under-estimated: three cards, each drawing what its word means, played in order. */
export function PhilosophySection() {
  const { ref, shown } = useShown<HTMLDivElement>();
  return (
    <section id="philosophy" aria-labelledby="philosophy-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Philosophy</BracketLabel>
            <h2 id="philosophy-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Core Philosophy
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{APPROACH_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[64px] grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
          {PHILOSOPHY_STAGES.map((stage, index) => {
            const Glyph = STAGE_GLYPHS[stage.glyph];
            const on = shown;
            return (
              <div key={stage.word} className="contents">
                {index > 0 && <StageArrow on={on} delay={index * 450 - 150} />}
                <div className="border border-black/15 p-[28px] max-[600px]:p-[22px]" style={{ opacity: on ? 1 : 0.35, transition: `opacity 600ms ease ${index * 450}ms` }}>
                  <span className={`${EYEBROW} text-[#F7A11A]`}>{number(index)}</span>
                  <h3 className="mt-[10px] text-[clamp(1.5rem,1rem+1.6vw,2.3rem)] leading-none font-light tracking-[-.04em] uppercase md:min-h-[2em]">{stage.word}</h3>
                  <div className="mt-[28px] border-y border-black/10 py-[18px]">
                    <DelayedGlyph Glyph={Glyph} on={on} delay={index * 450 + 200} />
                  </div>
                  <p className="mt-[18px] text-[15px] leading-[1.55] text-black/65">{stage.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type GlyphComponent = ComponentType<{ on: boolean; ink?: string; faint?: string }>;

/** Holds a glyph in its resting state until `delay` has passed after `on`, so a row plays left to right. */
function DelayedGlyph({ Glyph, on, delay }: { Glyph: GlyphComponent; on: boolean; delay: number }) {
  return <DelayedOn on={on} delay={delay}>{(ready) => <Glyph on={ready} />}</DelayedOn>;
}

function DelayedOn({ on, delay, children }: { on: boolean; delay: number; children: (ready: boolean) => ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [on, delay]);
  return children(ready);
}

/**
 * What we look for beside what we don't do, as one split: on white each quality
 * is ticked in turn, on black each habit is struck through in turn.
 */
export function ListsSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="look-for" aria-label="What we look for and what we don't do" className="scroll-mt-[96px] bg-white text-black">
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-t border-black/10 pl-[max(120px,calc((100vw_-_1512px)/2_+_120px))] py-[110px] md:pr-[64px] max-md:px-6 max-md:py-[72px]">
          <BracketLabel>What we look for</BracketLabel>
          <h2 className={`mt-[18px] ${SUBHEAD}`}>What We Look For</h2>
          <ol className="mt-[40px] list-none border-t border-black p-0">
            {LOOK_FOR.map((item, index) => (
              <li key={item} className="grid grid-cols-[34px_minmax(0,1fr)] items-start gap-x-[14px] border-b border-black/15 py-[16px]">
                <span
                  className="mt-[4px] grid h-[24px] w-[24px] place-items-center"
                  style={{ backgroundColor: shown ? ORANGE : "rgba(0,0,0,.08)", transition: `background-color 400ms ease ${index * 160}ms` }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2 6.4 4.8 9 10 3" fill="none" stroke="#000" strokeWidth="1.8" strokeDasharray="14" strokeDashoffset={shown ? 0 : 14} style={{ transition: `stroke-dashoffset 400ms ease ${index * 160 + 150}ms` }} />
                  </svg>
                </span>
                <div>
                  <span className="font-serif text-[clamp(1.25rem,1rem+.7vw,1.6rem)] leading-[1.2]">{item}</span>
                  <p className="mt-[6px] text-[14px] leading-[1.5] text-black/55">{APPROACH_LOREM.short}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-black pr-[max(120px,calc((100vw_-_1512px)/2_+_120px))] py-[110px] text-white md:pl-[64px] max-md:px-6 max-md:py-[72px]">
          <BracketLabel>What we don&rsquo;t do</BracketLabel>
          <h2 className={`mt-[18px] ${SUBHEAD}`}>What We Don&rsquo;t Do</h2>
          <ol className="mt-[40px] list-none border-t border-white/40 p-0">
            {DONT_DO.map((item, index) => (
              <li key={item} className="grid grid-cols-[34px_minmax(0,1fr)] items-start gap-x-[14px] border-b border-white/15 py-[16px]">
                <span className="mt-[4px] grid h-[24px] w-[24px] place-items-center border border-white/30">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2 2 10 10M10 2 2 10" fill="none" stroke={ORANGE} strokeWidth="1.8" strokeDasharray="12" strokeDashoffset={shown ? 0 : 12} style={{ transition: `stroke-dashoffset 400ms ease ${900 + index * 160}ms` }} />
                  </svg>
                </span>
                <div>
                  <span className="relative inline font-serif text-[clamp(1.25rem,1rem+.7vw,1.6rem)] leading-[1.2]">
                    {item}
                    <span
                      aria-hidden="true"
                      className="absolute top-[55%] left-0 h-[1.5px] bg-[#F7A11A]"
                      style={{ width: shown ? "100%" : "0%", transition: `width 500ms cubic-bezier(.22,1,.36,1) ${1000 + index * 160}ms` }}
                    />
                  </span>
                  <p className="mt-[6px] text-[14px] leading-[1.5] text-white/50">{APPROACH_LOREM.short}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** The four risks, each card drawing its risk, played in turn. */
export function RiskSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="risk" aria-labelledby="risk-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Risk management</BracketLabel>
            <h2 id="risk-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Risk Management
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{APPROACH_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-4">
          {RISKS.map((risk, index) => {
            const Glyph = RISK_GLYPHS[risk.glyph];
            return (
              <article key={risk.name} className="flex flex-col bg-white p-[28px] max-[600px]:p-[22px]">
                <span className={`${EYEBROW} text-[#F7A11A]`}>{number(index)}</span>
                <div className="mt-[18px] border-b border-black/10 pb-[18px]">
                  <DelayedGlyph Glyph={Glyph} on={shown} delay={index * 260} />
                </div>
                <h3 className="mt-[20px] font-serif text-[clamp(1.5rem,1.1rem+.8vw,1.9rem)] leading-[1.1] font-normal">{risk.name}</h3>
                <p className="mt-[10px] text-[15px] leading-[1.55] text-black/65">{risk.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
