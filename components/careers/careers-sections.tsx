"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import { type ComponentType, useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import {
  applyHref,
  CAREERS,
  CAREERS_LOREM,
  CULTURE,
  DISCIPLINES,
  LIFE,
  OPENINGS,
  RESUME_HREF,
  type Team,
  TEAM_NAMES,
} from "@/lib/careers";
import ApplyStack from "./apply-stack";
import { CombGlyph, CULTURE_GLYPHS, ORANGE, TEAM_GLYPHS } from "./glyphs";

/*
 * /careers, content plan §10: the heading with both CTAs, the current
 * openings as the page's one card grid, life at Moneybee around the team
 * photograph, the work culture as a white and black split, and how to apply
 * as a stack of sheets. Photographs sit in faded-bottom panels. Every section has a drawing; the openings and culture
 * points are lorem until HR writes them.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";
const CTA = `inline-flex w-fit items-center rounded-full bg-[#F6A11A] px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-[color,background-color,transform,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:bg-black hover:text-white active:scale-[0.97] motion-reduce:transition-none ${FOCUS}`;
const CTA_OUTLINE = `inline-flex w-fit items-center rounded-full border border-black/25 px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-[border-color,transform,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] hover:border-black active:scale-[0.97] motion-reduce:transition-none ${FOCUS}`;
/** The kobbe panel photographs sit in: #F6F6F6, 10px radius, a hairline ring. */
const PANEL = "overflow-hidden rounded-[10px] bg-[#F6F6F6] ring-1 ring-black/[.06]";
/** The panel's bottom 15% fades to the white page. */
const PANEL_FADE = { maskImage: "linear-gradient(to bottom, #000 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 85%, transparent)" } as const;
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
      <a href={RESUME_HREF} className={CTA_OUTLINE}>
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
      className={`cursor-pointer rounded-full border px-[16px] py-[8px] text-[14px] transition-[color,background-color,border-color,transform,scale] duration-200 active:scale-[0.97] motion-reduce:transition-none ${filter === value ? "border-black bg-black text-white" : "border-black/20 bg-white text-black hover:border-black"} ${FOCUS}`}
    >
      {label}
    </button>
  );
  return (
    <section id="openings" aria-labelledby="openings-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <span className={`${EYEBROW} text-black/60`}>01</span>
            <h2 id="openings-heading" className={`mt-[14px] ${SUBHEAD}`}>
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
              <article key={opening.team} className="flex animate-[careers-in_450ms_cubic-bezier(.22,1,.36,1)_both] flex-col bg-white p-[28px] motion-reduce:animate-none max-[600px]:p-[22px]" style={{ animationDelay: `${index * 60}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <span className={`${EYEBROW} text-black/60`}>{TEAM_NAMES[opening.team]}</span>
                  <span className="block h-[48px] w-[64px] shrink-0">
                    <DelayedGlyph Glyph={Glyph} on={shown} delay={index * 180} />
                  </span>
                </div>
                <h3 className="mt-[18px] font-serif text-[clamp(1.5rem,1.1rem+.8vw,1.9rem)] leading-[1.1] font-normal">{opening.role}</h3>
                <p className="mt-[10px] text-[15px] leading-[1.55] text-black/65">{opening.text}</p>
                <dl className="mt-[22px] grid grid-cols-3 gap-3 border-t border-black/10 pt-[16px] text-[13px]">
                  {opening.details.map(([term, detail]) => (
                    <div key={term}>
                      <dt className={`${EYEBROW} text-black/60`}>{term}</dt>
                      <dd className="m-0 mt-[4px] leading-[1.35]">{detail}</dd>
                    </div>
                  ))}
                </dl>
                <a href={applyHref(TEAM_NAMES[opening.team])} className={`group mt-auto inline-flex w-fit items-center gap-[10px] pt-[22px] text-[15px] font-medium text-black no-underline ${FOCUS}`}>
                  Apply<span className="sr-only">, {TEAM_NAMES[opening.team]}</span>
                  <span className="h-[2px] w-[18px] bg-[#F6A11A] transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)] group-hover:translate-x-[4px] motion-reduce:transition-none" aria-hidden="true" />
                </a>
              </article>
            );
          })}
          {filter === "all" && (
            <article className="flex animate-[careers-in_450ms_cubic-bezier(.22,1,.36,1)_both] flex-col border border-dashed border-black/25 p-[28px] motion-reduce:animate-none max-[600px]:p-[22px]" style={{ animationDelay: `${visible.length * 60}ms` }}>
              <span className={`${EYEBROW} text-black/60`}>Any team</span>
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

/** Our work culture as a split: the heading and the boardroom on white, the four culture points drawn on black. */
export function CultureSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="culture" aria-labelledby="culture-heading" className="scroll-mt-[96px] bg-white text-black">
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-t border-black/10 py-[110px] pl-[max(120px,calc((100vw_-_1512px)/2_+_120px))] md:pr-[64px] max-md:px-6 max-md:py-[72px]">
          <span className={`${EYEBROW} text-black/60`}>03</span>
          <h2 id="culture-heading" className={`mt-[14px] ${SUBHEAD}`}>
            Our Work Culture
          </h2>
          <p className={`mt-[28px] max-w-[480px] text-black/70 ${BODY}`}>{CAREERS_LOREM.long}</p>
          <div className={`relative mt-[40px] aspect-[4/3] w-full ${PANEL}`} style={PANEL_FADE}>
            <Image src="/people/moneybee-boardroom.jpg" alt="A meeting in the Moneybee boardroom" fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
          </div>
        </div>
        <div className="bg-black py-[110px] pr-[max(120px,calc((100vw_-_1512px)/2_+_120px))] text-white md:pl-[64px] max-md:px-6 max-md:py-[72px]">
          <ol className="m-0 list-none border-t border-white/40 p-0">
            {CULTURE.map((point, index) => {
              const Glyph = CULTURE_GLYPHS[point.glyph];
              return (
                <li key={point.name} className="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-x-[24px] border-b border-white/15 py-[28px]">
                  <span className="block h-[60px] w-[80px]">
                    <DelayedGlyph Glyph={Glyph} on={shown} delay={index * 260} ink="#fff" />
                  </span>
                  <div>
                    <span className={`${EYEBROW} text-white/60`}>{number(index)}</span>
                    <h3 className="mt-[6px] font-serif text-[clamp(1.4rem,1.1rem+.7vw,1.75rem)] leading-[1.1] font-normal">{point.name}</h3>
                    <p className="mt-[8px] text-[15px] leading-[1.55] text-white/65">{point.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** How to apply: the heading and both CTAs over the four steps as a stack of sheets. */
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
        <div className="mt-[24px]">
          <Ctas />
        </div>
      </div>
    </section>
  );
}
