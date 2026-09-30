"use client";

import { useInView } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Draw, Hatch, MOVE, OUT, RM, tr } from "@/components/drawing/plate";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import { AIF_LOREM, AIF_PARTS, APPROACH_STEPS, CATEGORY_III, FLYINGBEE, KEY_TERMS, STRUCTURE } from "@/lib/aif-v2";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { OrangeButton, NoScriptReveal } from "@/components/pms-v2/shared";
import { AifUnitsGlyph, FundGraphic, ORANGE, PmsHoldingGlyph, TERM_GLYPHS } from "./glyphs";

/*
 * /aif, content plan §4: the Flyingbee heading and fund graphic, why a
 * Category III AIF, the fund structure, the investment approach as a process,
 * and the key terms. Every section has a drawing that explains it; body copy
 * is placeholder until the client writes it.
 */

const number = (index: number) => String(index + 1).padStart(2, "0");
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

/** Plays its children's explained state once the block is `amount` in view. */
function useShown<T extends Element>(amount = 0.45) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

export function AifHero() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <section aria-labelledby="aif-heading" className="bg-white text-black">
      <NoScriptReveal />
      <div className={`${COLUMN} pt-[150px] pb-[96px] md:pt-[200px] max-md:pb-[64px]`}>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20">
          <div>
            <Rise>
              <BracketLabel>Category III AIF</BracketLabel>
            </Rise>
            <Rise delay={0.05}>
              <h1 id="aif-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
                {FLYINGBEE.heading}
              </h1>
            </Rise>
            <Rise delay={0.12}>
              <p className={`mt-8 max-w-[540px] text-black/70 ${BODY}`}>{FLYINGBEE.intro}</p>
            </Rise>
            <Rise delay={0.18}>
              <div className="mt-10 flex flex-wrap gap-3">
                <OrangeButton href={FLYINGBEE.explore.href}>{FLYINGBEE.explore.label}</OrangeButton>
                <OrangeButton href={FLYINGBEE.start.href} outline>
                  {FLYINGBEE.start.label}
                </OrangeButton>
              </div>
            </Rise>
          </div>
          <div className="mx-auto w-full max-w-[560px]">
            <FundGraphic on={on} />
          </div>
        </div>
        <Rise delay={0.25}>
          <nav aria-label="On this page" className="mt-[72px] max-md:mt-[48px]">
            <ol className="m-0 grid list-none grid-cols-1 border-t border-black p-0 sm:grid-cols-2 lg:grid-cols-4">
              {AIF_PARTS.map(([label, href], index) => (
                <li key={href} className="border-b border-black/15 lg:border-b-0">
                  <a href={href} className={`group flex items-baseline gap-[14px] py-[16px] pr-4 text-black no-underline ${FOCUS}`}>
                    <span className="font-[family-name:var(--font-geist-mono)] text-[13px] leading-none text-black/60 tabular-nums">{number(index)}</span>
                    <span className="text-[16px] text-black/75 transition-colors duration-200 group-hover:text-black">{label}</span>
                    <span aria-hidden="true" className="ml-auto h-[2px] w-[24px] origin-left scale-x-0 bg-[#F6A11A] transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
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

/** PMS holdings beside AIF units: the same investors, two ways of owning. */
export function CategoryThreeSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.35);
  return (
    <section id="category-iii" aria-labelledby="category-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Category III</BracketLabel>
            <h2 id="category-heading" className={`mt-[18px] ${SUBHEAD}`}>
              {CATEGORY_III.heading}
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{CATEGORY_III.text}</p>
        </div>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-[2px] md:grid-cols-2">
          {[
            { name: "PMS", Glyph: PmsHoldingGlyph, delay: 0 },
            { name: "AIF", Glyph: AifUnitsGlyph, delay: 700 },
          ].map(({ name, Glyph, delay }, index) => (
            <article key={name} className="bg-white p-[32px] max-[600px]:p-[22px]">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-[clamp(1.8rem,1.3rem+1.2vw,2.6rem)] leading-none font-normal">{name}</h3>
                <span className={`${EYEBROW} flex items-center gap-[8px] text-black/60`}>
                  {index === 1 && <i aria-hidden="true" className="h-[8px] w-[8px] bg-[#F6A11A]" />}
                  {index === 1 ? "Flyingbee" : "Direct"}
                </span>
              </div>
              <div className="mt-[24px] border-t border-black/10 pt-[20px]">
                <div className="mx-auto max-w-[420px]">
                  <Delayed on={shown} delay={delay}>
                    {(ready) => <Glyph on={ready} />}
                  </Delayed>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Delayed({ on, delay, children }: { on: boolean; delay: number; children: (ready: boolean) => React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [on, delay]);
  return children(ready);
}

/** A chain arrow that draws itself on, with a unit moving along it; on a phone it points down. */
function ChainArrow({ on, delay }: { on: boolean; delay: number }) {
  return (
    <div aria-hidden="true" className="flex items-center justify-center py-3 md:px-3 md:py-0">
      <svg viewBox="0 0 64 14" className="h-[14px] w-[64px] overflow-visible max-md:w-[40px] max-md:rotate-90">
        <line x1="0" x2="0" y1="3" y2="11" stroke="rgba(255,255,255,.4)" strokeWidth="1" />
        <Draw d="M0 7H60" on={on} ms={420} delay={delay} ease={MOVE} stroke="rgba(255,255,255,.6)" strokeWidth="1.2" />
        <path d="M55 2.5L60 7L55 11.5" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.2" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, delay + 380) }} />
        {on && <circle cx="4" cy="7" r="2.6" fill={ORANGE} className="animate-[aifv2-flow_2s_ease-in-out_infinite] motion-reduce:hidden" style={{ animationDelay: `${delay + 500}ms`, opacity: 0 }} />}
      </svg>
    </div>
  );
}

/**
 * Investors → Flyingbee Investment Fund → Moneybee Investment Manager, with the
 * trustee, custodian and fund accountant, registrar and transfer agent and
 * brokers wired to the fund. Hovering or focusing a party lights its line.
 */
export function StructureSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="structure" aria-labelledby="structure-heading" className="scroll-mt-[96px] bg-black text-white">
      <style>{`@keyframes aifv2-flow { 0% { transform: translateX(0); opacity: 0 } 20% { opacity: 1 } 80% { opacity: 1 } 100% { transform: translateX(48px); opacity: 0 } }`}</style>
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Structure</BracketLabel>
            <h2 id="structure-heading" className={`mt-[18px] ${SUBHEAD}`}>
              {STRUCTURE.heading}
            </h2>
          </div>
          <p className={`text-white/65 ${BODY}`}>{AIF_LOREM.long}</p>
        </div>

        <div ref={ref} className="mt-[72px] max-md:mt-[48px]">
          <ol className="m-0 grid list-none grid-cols-1 p-0 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
            {STRUCTURE.chain.map((name, index) => {
              const fund = index === 1;
              return (
                <li key={name} className="contents">
                  {index > 0 && <ChainArrow on={shown} delay={index * 350} />}
                  <div
                    className={`flex min-h-[132px] flex-col justify-between p-[24px] ${fund ? "border-2 border-[#F6A11A]" : "border border-white/25"}`}
                    style={{ opacity: shown ? 1 : 0.25, transition: `opacity 600ms ease ${index * 350}ms` }}
                  >
                    <span className={`${EYEBROW} ${fund ? "text-[#F6A11A]" : "text-white/60"}`}>{number(index)}</span>
                    <span className="mt-6 font-serif text-[clamp(1.4rem,1rem+1vw,2rem)] leading-[1.1]">{name}</span>
                  </div>
                  {/* Phone: the parties hang straight off the fund, before the arrow to the manager. */}
                  {fund && (
                    <div className="md:hidden">
                      <Parties shown={shown} active={active} setActive={setActive} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Desktop: the parties hang below the chain, under the fund. */}
          <div className="max-md:hidden">
            <Parties shown={shown} active={active} setActive={setActive} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** The four parties wired to the fund: a line down, a bus across, a drop to each (a rail on a phone). */
function Parties({ shown, active, setActive }: { shown: boolean; active: number | null; setActive: (index: number | null) => void }) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 h-[40px] w-px -translate-x-1/2 bg-white/35 max-md:left-[24px] max-md:h-[28px]" style={{ transform: `scaleY(${shown ? 1 : 0})`, transformOrigin: "top", transition: "transform 500ms ease 1100ms" }} />
      <div
        className="absolute top-[40px] right-[calc((100%_-_60px)/8)] left-[calc((100%_-_60px)/8)] h-px bg-white/35 max-md:hidden"
        style={{ transform: `scaleX(${shown ? 1 : 0})`, transition: "transform 600ms cubic-bezier(.22,1,.36,1) 1400ms" }}
      />
      <div className="absolute top-[28px] bottom-[48px] left-[24px] w-px bg-white/35 md:hidden" />
      <ul className="m-0 grid list-none grid-cols-1 gap-[14px] p-0 pt-[40px] md:grid-cols-4 md:gap-[20px] max-md:pt-[28px] max-md:pl-[48px]">
        {STRUCTURE.parties.map((party, index) => {
          const lit = active === index;
          return (
            <li key={party} className="relative flex flex-col">
              <span
                aria-hidden="true"
                className={`absolute transition-colors max-md:top-1/2 max-md:left-[-24px] max-md:h-px max-md:w-[24px] md:top-0 md:left-1/2 md:h-[28px] md:w-px ${lit ? "bg-[#F6A11A]" : "bg-white/35"}`}
              />
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(lit ? null : index)}
                aria-pressed={lit}
                className={`block w-full flex-1 border p-[20px] text-left md:mt-[28px] ${lit ? "border-[#F6A11A] bg-white/[.04]" : "border-white/20"} ${FOCUS}`}
                style={{ opacity: shown ? 1 : 0, transition: `opacity 500ms ease ${1600 + index * 150}ms, border-color 200ms ease, background-color 200ms ease` }}
              >
                <span className={`block font-serif text-[clamp(1.2rem,1rem+.5vw,1.45rem)] leading-[1.15] transition-colors ${lit ? "text-[#F6A11A]" : "text-white"}`}>{party}</span>
                <span className="mt-[10px] block text-[14px] leading-[1.5] text-white/65">{STRUCTURE.partyText}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Each step keeps fewer companies: the field narrows as the process runs. */
// A fixed shuffle, so each dot has a stable rank and the same ones survive every time.
const SCORES = Array.from({ length: 12 * 6 }, (_, index) => {
  let hash = Math.imul(index + 1, 2654435761) >>> 0;
  hash = Math.imul(hash ^ (hash >>> 15), 2246822519) >>> 0;
  return (hash ^ (hash >>> 13)) / 4294967296;
});
const ORDER = SCORES.map((score, index) => ({ score, index })).sort((a, b) => a.score - b.score);
const FIELD = SCORES.map((_, index) => ({
  x: 16 + (index % 12) * 15.3,
  y: 18 + Math.floor(index / 12) * 19,
  rank: ORDER.findIndex((entry) => entry.index === index),
  index,
}));
const KEEP = [72, 48, 32, 22, 14, 10, 6] as const;

/**
 * The field in the plate language: a company dropped at this step shrinks to
 * a hairline ring, one still in the running is engraved, and at the last step
 * the survivors turn orange under a reticle.
 */
function ProcessField({ step }: { step: number }) {
  const hatch = useId();
  const keep = KEEP[step];
  const growing = step >= 5;
  const decided = step >= 6;
  return (
    <svg viewBox="0 0 200 130" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={1.8} opacity={0.8} />
      </defs>
      {/* Construction: row and column ticks the field is read against. */}
      {Array.from({ length: 6 }, (_, row) => (
        <line key={`r${row}`} x1="2" x2="6" y1={18 + row * 19} y2={18 + row * 19} stroke="#000" strokeWidth=".5" strokeOpacity=".35" />
      ))}
      {Array.from({ length: 12 }, (_, col) => (
        <line key={`c${col}`} x1={16 + col * 15.3} x2={16 + col * 15.3} y1="126" y2="130" stroke="#000" strokeWidth=".5" strokeOpacity=".35" />
      ))}
      {FIELD.map((dot) => {
        const kept = dot.rank < keep;
        const r = kept ? (growing ? 4.6 : 3.4) : 1.8;
        return (
          <g key={dot.index}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r={r}
              fill={kept ? (decided ? ORANGE : `url(#${hatch})`) : "none"}
              stroke="#000"
              strokeWidth={kept ? 0.8 : 0.5}
              strokeOpacity={kept ? 0.9 : 0.28}
              className={RM}
              style={tr("r, stroke-opacity, stroke-width", 480, kept ? 0 : (dot.index % 12) * 18, OUT)}
            />
            {kept && decided && (
              <g className={RM} style={{ opacity: 1, ...tr("opacity", 300, 200) }}>
                <circle cx={dot.x} cy={dot.y} r="7.4" fill="none" stroke="#000" strokeWidth=".7" />
                {[0, 90, 180, 270].map((angle) => (
                  <line key={angle} x1={dot.x} x2={dot.x} y1={dot.y - 8.6} y2={dot.y - 10.6} stroke="#000" strokeWidth=".7" transform={`rotate(${angle} ${dot.x} ${dot.y})`} />
                ))}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * The seven points of the investment approach, run as a process: the list on
 * one side, and on the other a field of companies that each step narrows.
 * It plays through once on view; any step can be picked by hand.
 */
export function ApproachSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.4);
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!shown || manual || reduceMotion || step >= APPROACH_STEPS.length - 1) return;
    const timer = setTimeout(() => setStep((current) => current + 1), 1500);
    return () => clearTimeout(timer);
  }, [shown, manual, reduceMotion, step]);

  return (
    <section id="approach" aria-labelledby="approach-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Investment process</BracketLabel>
            <h2 id="approach-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Investment Approach
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{AIF_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
          <ol className="m-0 list-none border-t border-black p-0">
            {APPROACH_STEPS.map((name, index) => {
              const current = index === step;
              const passed = index < step;
              return (
                <li key={name} className="border-b border-black/15">
                  <button
                    type="button"
                    onClick={() => {
                      setManual(true);
                      setStep(index);
                    }}
                    aria-current={current ? "step" : undefined}
                    className={`group grid w-full grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-[14px] py-[14px] text-left ${FOCUS}`}
                  >
                    <span className={`text-[20px] leading-none font-light tracking-[-.04em] tabular-nums transition-colors ${current ? "text-black" : passed ? "text-black/60" : "text-black/40"}`}>{number(index)}</span>
                    <span className={`font-serif text-[clamp(1.2rem,1rem+.6vw,1.55rem)] leading-[1.2] transition-colors ${current ? "text-black" : "text-black/60 group-hover:text-black"}`}>{name}</span>
                    <span aria-hidden="true" className={`h-[2px] w-[28px] origin-left bg-[#F6A11A] transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)] ${current ? "scale-x-100" : "scale-x-0"}`} />
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="border border-black/15 p-[28px] max-md:order-first max-[600px]:p-[18px]">
            <div className="flex items-baseline justify-between gap-4">
              <span className={`${EYEBROW} text-black/60`}>
                Step {step + 1} of {APPROACH_STEPS.length}
              </span>
              <span className={`${EYEBROW} flex items-center gap-[8px] text-right text-black`}>
                <i aria-hidden="true" className="h-[8px] w-[8px] bg-[#F6A11A]" />
                {APPROACH_STEPS[step]}
              </span>
            </div>
            <div className="mt-[20px] border-t border-black/10 pt-[20px]">
              <ProcessField step={step} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The five key terms, each drawn, then the way in. */
export function KeyTermsSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="key-terms" aria-labelledby="terms-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Key terms</BracketLabel>
            <h2 id="terms-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Key Terms
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{AIF_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-5">
          {KEY_TERMS.map((term, index) => {
            const Glyph = TERM_GLYPHS[term.glyph];
            return (
              <article key={term.label} className="flex flex-col bg-white p-[24px] max-[600px]:p-[22px]">
                <span className={`${EYEBROW} text-black/60`}>{number(index)}</span>
                <div className="mt-[16px] border-b border-black/10 pb-[16px]">
                  <div className="max-w-[260px] max-sm:mx-auto">
                    <Delayed on={shown} delay={index * 80}>
                      {(ready) => <Glyph on={ready} />}
                    </Delayed>
                  </div>
                </div>
                <span className={`mt-[18px] ${EYEBROW} text-black/60`}>{term.label}</span>
                <p className="mt-[8px] font-serif text-[clamp(1.3rem,1.05rem+.5vw,1.6rem)] leading-[1.15]">{term.value}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-[56px] flex justify-start">
          <OrangeButton href={FLYINGBEE.start.href}>{FLYINGBEE.start.label}</OrangeButton>
        </div>
      </div>
    </section>
  );
}
