"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import { type ComponentType, useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import {
  APPLY_STEPS,
  applyHref,
  CAREERS,
  CAREERS_LOREM,
  CULTURE,
  DISCIPLINES,
  LIFE,
  OPENING_PLACE,
  OPENING_TYPE,
  OPENINGS,
  RESUME_HREF,
  type Team,
  TEAM_NAMES,
} from "@/lib/careers";
import { CombGlyph, CULTURE_GLYPHS, ORANGE, TEAM_GLYPHS } from "./glyphs";

/*
 * /careers, content plan §10: the heading with both CTAs, the current
 * openings as clean cards, life at Moneybee around the team photograph, the
 * work culture beside the boardroom, and how to apply. Every section has a
 * drawing; the openings, culture and steps are placeholders until HR writes
 * them.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7A11A]";
const CTA = `inline-flex w-fit items-center rounded-full bg-[#F7A11A] px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-colors hover:bg-black hover:text-white ${FOCUS}`;
const number = (index: number) => String(index + 1).padStart(2, "0");

function useShown<T extends Element>(amount = 0.45) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

type GlyphComponent = ComponentType<{ on: boolean; ink?: string }>;

/** Holds a glyph in its resting state until `delay` has passed after `on`, so a row plays in turn. */
function DelayedGlyph({ Glyph, on, delay, ink }: { Glyph: GlyphComponent; on: boolean; delay: number; ink?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [on, delay]);
  return <Glyph on={ready} ink={ink} />;
}

/** Both CTAs: the openings on this page, and a resume by email. */
function Ctas() {
  return (
    <div className="flex flex-wrap gap-[12px]">
      <a href="#openings" className={CTA}>
        View Open Positions
      </a>
      <a href={RESUME_HREF} className={CTA}>
        Send Your Resume
      </a>
    </div>
  );
}

export function CareersHero() {
  const { ref, shown } = useShown<HTMLDivElement>(0.4);
  return (
    <section aria-labelledby="careers-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-14 pt-[150px] pb-[110px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:pt-[220px] max-md:pb-[72px]`}>
        <div>
          <Rise>
            <BracketLabel>Careers</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="careers-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {CAREERS.heading}
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className={`mt-8 max-w-[560px] text-black/70 ${BODY}`}>{CAREERS.lead}</p>
          </Rise>
          <Rise delay={0.18}>
            <div className="mt-10">
              <Ctas />
            </div>
          </Rise>
        </div>
        <Rise delay={0.2}>
          <div ref={ref} className="mx-auto w-full max-w-[520px]">
            <CombGlyph on={shown} labels={DISCIPLINES} />
          </div>
        </Rise>
      </div>
    </section>
  );
}

type Filter = Team | "all";

/** The openings as cards, each drawing its team; the chips narrow them to one team. */
export function OpeningsSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.2);
  const [filter, setFilter] = useState<Filter>("all");
  const teams = Object.keys(TEAM_NAMES) as Team[];
  const visible = OPENINGS.filter((opening) => filter === "all" || opening.team === filter);
  const chip = (value: Filter, label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={filter === value}
      onClick={() => setFilter(value)}
      className={`cursor-pointer rounded-full border px-[16px] py-[8px] text-[14px] transition-colors ${filter === value ? "border-black bg-black text-white" : "border-black/20 bg-white text-black hover:border-black"} ${FOCUS}`}
    >
      {label}
    </button>
  );
  return (
    <section id="openings" aria-labelledby="openings-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Current Openings</BracketLabel>
            <h2 id="openings-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Current Openings
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{CAREERS_LOREM.long}</p>
        </div>
        <div className="mt-[40px] flex flex-wrap gap-[8px]" role="group" aria-label="Filter openings by team">
          {chip("all", "All teams")}
          {teams.map((team) => chip(team, TEAM_NAMES[team]))}
        </div>
        <div ref={ref} className="mt-[24px] grid grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((opening, index) => {
            const Glyph = TEAM_GLYPHS[opening.team];
            return (
              <article key={opening.role} className="flex animate-[careers-in_450ms_cubic-bezier(.22,1,.36,1)_both] flex-col bg-white p-[28px] motion-reduce:animate-none max-[600px]:p-[22px]" style={{ animationDelay: `${index * 60}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <span className={`${EYEBROW} text-black/50`}>{TEAM_NAMES[opening.team]}</span>
                  <span className="block h-[48px] w-[64px] shrink-0">
                    <DelayedGlyph Glyph={Glyph} on={shown} delay={index * 180} />
                  </span>
                </div>
                <h3 className="mt-[18px] font-serif text-[clamp(1.5rem,1.1rem+.8vw,1.9rem)] leading-[1.1] font-normal">{opening.role}</h3>
                <p className="mt-[10px] text-[15px] leading-[1.55] text-black/65">{opening.text}</p>
                <dl className="mt-[22px] grid grid-cols-3 gap-3 border-t border-black/10 pt-[16px] text-[13px]">
                  {[
                    ["Location", OPENING_PLACE],
                    ["Type", OPENING_TYPE],
                    ["Experience", opening.experience],
                  ].map(([term, detail]) => (
                    <div key={term}>
                      <dt className={`${EYEBROW} text-black/45`}>{term}</dt>
                      <dd className="m-0 mt-[4px] leading-[1.35]">{detail}</dd>
                    </div>
                  ))}
                </dl>
                <a href={applyHref(opening.role)} className={`group mt-[22px] inline-flex w-fit items-center gap-[10px] text-[15px] font-medium text-black no-underline ${FOCUS}`}>
                  Apply
                  <span className="h-[2px] w-[18px] bg-[#F7A11A] transition-all duration-300 group-hover:w-[32px]" aria-hidden="true" />
                </a>
              </article>
            );
          })}
          {filter === "all" && (
            <article className="flex animate-[careers-in_450ms_cubic-bezier(.22,1,.36,1)_both] flex-col border border-dashed border-black/25 p-[28px] motion-reduce:animate-none max-[600px]:p-[22px]" style={{ animationDelay: `${visible.length * 60}ms` }}>
              <span className={`${EYEBROW} text-black/50`}>Any team</span>
              <svg viewBox="0 0 64 48" className="mt-[18px] h-[48px] w-[64px]" aria-hidden="true">
                <polygon points="32,4 52,15.5 52,38.5 32,50 12,38.5 12,15.5" transform="scale(.9) translate(3.5,0)" fill="none" stroke={ORANGE} strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              <h3 className="mt-[18px] font-serif text-[clamp(1.5rem,1.1rem+.8vw,1.9rem)] leading-[1.1] font-normal">Not listed here?</h3>
              <p className="mt-[10px] text-[15px] leading-[1.55] text-black/65">{CAREERS_LOREM.short}</p>
              <div className="mt-auto pt-[22px]">
                <a href={RESUME_HREF} className={CTA}>
                  Send Your Resume
                </a>
              </div>
            </article>
          )}
        </div>
      </div>
      <style>{"@keyframes careers-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}"}</style>
    </section>
  );
}

/** Life at Moneybee on black: the team photograph opens from the centre as the band comes into view. */
export function LifeSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="life" aria-labelledby="life-heading" className="scroll-mt-[96px] bg-black text-white">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Life at Moneybee</BracketLabel>
            <h2 id="life-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Life at Moneybee
            </h2>
          </div>
          <p className={`text-white/70 ${BODY}`}>{LIFE.text}</p>
        </div>
        <div ref={ref} className="relative mt-[56px] aspect-[16/9] w-full overflow-hidden bg-white/5 max-md:aspect-[4/3]">
          <div className="absolute inset-0" style={{ clipPath: shown ? "inset(0 0 0 0)" : "inset(18% 30% 18% 30%)", transition: "clip-path 1200ms cubic-bezier(.22,1,.36,1)" }}>
            <Image src="/people/moneybee-team.jpg" alt="The Moneybee team at the Lower Parel office" fill sizes="(max-width: 1512px) 100vw, 1272px" className="object-cover object-[50%_40%]" />
          </div>
        </div>
        <ol className="mt-[2px] grid list-none grid-cols-1 gap-[2px] p-0 md:grid-cols-3">
          {LIFE.notes.map((note, index) => (
            <li key={index} className="border-t-2 bg-white/[.04] p-[24px]" style={{ borderColor: shown ? ORANGE : "rgba(255,255,255,.15)", transition: `border-color 500ms ease ${900 + index * 200}ms` }}>
              <span className={`${EYEBROW} text-[#F7A11A]`}>{number(index)}</span>
              <p className="mt-[10px] text-[15px] leading-[1.55] text-white/65">{note}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Our work culture: the boardroom beside four drawn culture points. */
export function CultureSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="culture" aria-labelledby="culture-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Our Work Culture</BracketLabel>
            <h2 id="culture-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Our Work Culture
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{CAREERS_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-[2px] border border-black/10 bg-black/10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="relative min-h-[320px] overflow-hidden bg-white">
            <Image src="/people/moneybee-boardroom.jpg" alt="A meeting in the Moneybee boardroom" fill sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
          </div>
          <div className="grid grid-cols-1 gap-[2px] sm:grid-cols-2">
            {CULTURE.map((point, index) => {
              const Glyph = CULTURE_GLYPHS[point.glyph];
              return (
                <article key={point.name} className="flex flex-col bg-white p-[28px] max-[600px]:p-[22px]">
                  <span className={`${EYEBROW} text-black/50`}>{number(index)}</span>
                  <span className="mt-[16px] block h-[60px] w-[80px]">
                    <DelayedGlyph Glyph={Glyph} on={shown} delay={index * 260} />
                  </span>
                  <h3 className="mt-[18px] font-serif text-[clamp(1.4rem,1.1rem+.7vw,1.75rem)] leading-[1.1] font-normal">{point.name}</h3>
                  <p className="mt-[8px] text-[15px] leading-[1.55] text-black/65">{point.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/** How to apply: four steps on a track, a resume travelling along it to the last. */
export function ApplySection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.4);
  const last = APPLY_STEPS.length - 1;
  return (
    <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>How to Apply</BracketLabel>
            <h2 id="apply-heading" className={`mt-[18px] ${SUBHEAD}`}>
              How to Apply
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{CAREERS_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[64px]">
          {/* The track: a sheet moves from the first node to the last, lighting each it passes. */}
          <div className="relative h-[48px] max-lg:hidden">
            <div className="absolute top-1/2 left-[34px] h-[2px] w-[75%] -translate-y-1/2 bg-black/10" />
            <div className="absolute top-1/2 left-[34px] h-[2px] -translate-y-1/2 bg-[#F7A11A]" style={{ width: shown ? "75%" : "0%", transition: "width 2400ms cubic-bezier(.45,0,.2,1) 200ms" }} />
            {APPLY_STEPS.map((step, index) => (
              <span
                key={step.name}
                className="absolute top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{
                  left: `calc(${(index / APPLY_STEPS.length) * 100}% + 34px)`,
                  borderColor: shown ? ORANGE : "rgba(0,0,0,.25)",
                  backgroundColor: shown ? ORANGE : "#F7F7F8",
                  transition: `all 300ms ease ${200 + (index / last) * 2400}ms`,
                }}
              />
            ))}
            <svg viewBox="0 0 28 36" className="absolute top-1/2 h-[36px] w-[28px] -translate-x-1/2 -translate-y-[130%]" style={{ left: shown ? "calc(75% + 34px)" : "34px", transition: "left 2400ms cubic-bezier(.45,0,.2,1) 200ms" }} aria-hidden="true">
              <path d="M2 2h17l7 7v25H2Z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M19 2v7h7" fill="none" stroke="#000" strokeWidth="1.4" />
              <path d="M7 16h14M7 21h14M7 26h9" stroke={ORANGE} strokeWidth="1.8" />
            </svg>
          </div>
          <ol className="mt-[20px] grid list-none grid-cols-1 gap-[2px] p-0 sm:grid-cols-2 lg:grid-cols-4">
            {APPLY_STEPS.map((step, index) => (
              <li
                key={step.name}
                className="border-t-2 bg-white p-[28px] max-[600px]:p-[22px] lg:border-t-0"
                style={{ borderTopColor: shown ? ORANGE : "rgba(0,0,0,.1)", transition: `border-color 400ms ease ${200 + index * 450}ms` }}
              >
                <span className="text-[clamp(2.4rem,4vw,3.4rem)] leading-none font-light tracking-[-.05em] text-[#F7A11A] tabular-nums">{number(index)}</span>
                <h3 className="mt-[16px] font-serif text-[clamp(1.4rem,1.1rem+.7vw,1.75rem)] leading-[1.1] font-normal">{step.name}</h3>
                <p className="mt-[8px] text-[15px] leading-[1.55] text-black/65">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-[48px]">
            <Ctas />
          </div>
        </div>
      </div>
    </section>
  );
}
