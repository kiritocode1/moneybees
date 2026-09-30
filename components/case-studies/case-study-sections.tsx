"use client";

import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import { CASE_DISCLAIMER, CASE_LOREM, CASE_PARTS, CASE_STUDIES, CASE_STUDIES_PAGE, type CaseStudyEntry } from "@/lib/case-studies";
import { PageIndex, NoScriptReveal } from "@/components/pms-v2/shared";
import { DRAWINGS } from "./drawings";

/*
 * /case-studies, content plan §8: three past picks, each with the plan's
 * business model, edge and growth lines, a drawing of what the business does,
 * and its Revenue, EBITDA and PAT for FY20 to FY24. A closing timeline sets the
 * three side by side, above the plan's disclaimer. Past examples, not advice.
 */

const ORANGE = "#F6A11A";
const EASE = "cubic-bezier(.22,1,.36,1)";
const number = (index: number) => String(index + 1).padStart(2, "0");

function useShown<T extends Element>(amount = 0.3) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

export function CaseStudiesHero() {
  return (
    <section aria-labelledby="cases-heading" className="bg-white text-black">
      <NoScriptReveal />
      <div className={`${COLUMN} grid grid-cols-1 items-end gap-14 pt-[150px] pb-[110px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:pt-[220px] max-md:pb-[72px]`}>
        <div>
          <Rise>
            <BracketLabel>Case studies</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="cases-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {CASE_STUDIES_PAGE.heading}
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className={`mt-8 max-w-[520px] text-black/70 ${BODY}`}>{CASE_STUDIES_PAGE.lead}</p>
          </Rise>
        </div>
        <Rise delay={0.2}>
          <PageIndex parts={CASE_PARTS} />
        </Rise>
      </div>
    </section>
  );
}

type Tone = "white" | "black" | "grey";

const SERIES = [
  { key: "revenue", name: "Revenue" },
  { key: "ebidta", name: "EBITDA" },
  { key: "pat", name: "PAT" },
] as const;

const seriesFill = (key: (typeof SERIES)[number]["key"], dark: boolean) => (key === "pat" ? ORANGE : key === "revenue" ? (dark ? "#fff" : "#000") : dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.28)");

/**
 * Revenue, EBITDA and PAT per year as grouped bars on one Rs. crore axis. The
 * year under the pointer (or the last year, at rest) is read out above the
 * chart, so the values stay legible on a phone.
 */
function FinancialsChart({ study, dark, shown }: { study: CaseStudyEntry; dark: boolean; shown: boolean }) {
  const rows = study.financials;
  const [picked, setPicked] = useState<number | null>(null);
  const year = picked ?? rows.length - 1;
  const max = Math.max(...rows.map((row) => row.revenue));
  const muted = dark ? "text-white/65" : "text-black/60";
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-[28px] gap-y-[14px]" aria-live="polite">
        <div className={`${EYEBROW} ${muted}`}>
          {rows[year].year} <span className="ml-[6px]">Rs. crore</span>
        </div>
        <dl className="flex flex-wrap gap-x-[24px] gap-y-[8px]">
          {SERIES.map((series) => (
            <div key={series.key} className="flex items-baseline gap-[8px]">
              <dt className={`${EYEBROW} flex items-center gap-[7px] ${muted}`}>
                <i className="h-[9px] w-[9px]" style={{ background: seriesFill(series.key, dark) }} aria-hidden="true" />
                {series.name}
              </dt>
              <dd className="font-[family-name:var(--font-geist-mono)] text-[17px] tabular-nums">{rows[year][series.key]}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div
        role="img"
        aria-label={`${study.name}, FY20 to FY24, Rs. crore. ${SERIES.map((series) => `${series.name}: ${rows.map((row) => row[series.key]).join(", ")}`).join(". ")}.`}
        className="mt-[24px] grid grid-cols-5"
        onMouseLeave={() => setPicked(null)}
      >
        {rows.map((row, index) => {
          const lit = index === year;
          return (
            <button
              key={row.year}
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onMouseEnter={() => setPicked(index)}
              onClick={() => setPicked(index)}
              className={`flex cursor-pointer flex-col items-stretch px-[6%] transition-colors duration-150 ${lit ? (dark ? "bg-white/[.06]" : "bg-black/[.035]") : ""}`}
            >
              <span className={`flex h-[260px] items-end justify-center gap-[6%] border-b pt-[12px] max-md:h-[180px] ${dark ? "border-white/40" : "border-black/40"}`}>
                {SERIES.map((series, s) => (
                  <span
                    key={series.key}
                    className="block w-[28%] max-w-[40px] motion-reduce:!transition-none"
                    style={{
                      height: `${(row[series.key] / max) * 100}%`,
                      minHeight: 1,
                      background: seriesFill(series.key, dark),
                      transformOrigin: "50% 100%",
                      transform: `scaleY(${shown ? 1 : 0})`,
                      transition: `transform 800ms ${EASE} ${index * 110 + s * 60}ms`,
                    }}
                  />
                ))}
              </span>
              <span className={`block py-[10px] text-center font-[family-name:var(--font-geist-mono)] text-[12px] tracking-[.06em] ${lit ? (dark ? "text-white" : "text-black") : muted}`}>
                <span className={`border-b-2 pb-[3px] ${lit ? "border-[#F6A11A]" : "border-transparent"}`}>{row.year}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** The placeholder mark: the company's initials in a dashed square, until an approved logo is supplied. */
function Mark({ text, dark }: { text: string; dark: boolean }) {
  return (
    <span aria-hidden="true" className={`grid h-[64px] w-[64px] shrink-0 place-items-center border border-dashed font-[family-name:var(--font-geist-mono)] text-[15px] tracking-[.08em] ${dark ? "border-white/40 text-white" : "border-black/35 text-black"}`}>
      {text}
    </span>
  );
}

const TONES: Record<Tone, { section: string; card: string; line: string; body: string }> = {
  white: { section: "border-t border-dashed border-black/10 bg-white text-black", card: "border border-black/15", line: "border-black/15", body: "text-black/75" },
  black: { section: "bg-black text-white", card: "border border-white/20", line: "border-white/20", body: "text-white/80" },
  grey: { section: "bg-[#F7F7F8] text-black", card: "bg-white", line: "border-black/15", body: "text-black/75" },
};

/**
 * One case, read in three steps: who (the company and its mark), the thesis
 * (the business model as the lead sentence, with the edge and the growth
 * prospect under it, beside the drawing of the business) and the outcome (the
 * multiple it reached and its PAT from FY20 to FY24), then the financials.
 */
export function CaseStudySection({ study, index, tone }: { study: CaseStudyEntry; index: number; tone: Tone }) {
  const { ref, shown } = useShown<HTMLDivElement>(0.2);
  const dark = tone === "black";
  const look = TONES[tone];
  const Drawing = DRAWINGS[study.drawing];
  const label = dark ? "text-white/65" : "text-black/60";
  const first = study.financials[0];
  const last = study.financials[study.financials.length - 1];
  const support = [
    ["Competitive Edge", study.edge],
    ["Growth Prospect", study.growth],
  ] as const;
  return (
    <section id={study.id} aria-labelledby={`${study.id}-heading`} className={`scroll-mt-[96px] ${look.section}`}>
      <div ref={ref} className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        {/* Who, and the outcome. */}
        <div className={`grid grid-cols-1 items-end gap-10 border-b pb-[40px] md:grid-cols-[minmax(0,1fr)_auto] ${look.line}`}>
          <div>
            <BracketLabel>Case study {number(index)}</BracketLabel>
            <div className="mt-[22px] flex items-center gap-[22px]">
              <Mark text={study.mark} dark={dark} />
              <h2 id={`${study.id}-heading`} className={`${HEADING} text-balance text-[clamp(2.4rem,1.2rem+3.4vw,4.25rem)] leading-[1.02]`}>
                {study.name}
              </h2>
            </div>
          </div>
          <div className="md:text-right">
            <span className={`${EYEBROW} ${label}`}>Multibagger</span>
            <p className={`mt-[6px] text-[clamp(2.4rem,1.6rem+2.4vw,3.6rem)] leading-none font-light tracking-[-.05em] tabular-nums ${dark ? "text-[#F6A11A]" : ""}`}>{study.multiple}</p>
            {!dark && <span aria-hidden="true" className="mt-[10px] block h-[3px] w-[56px] bg-[#F6A11A] md:ml-auto" />}
            <p className={`mt-[12px] font-[family-name:var(--font-geist-mono)] text-[12px] tracking-[.04em] ${label}`}>
              PAT Rs. {first.pat} crore in {first.year} to Rs. {last.pat} crore in {last.year}
            </p>
          </div>
        </div>

        {/* The thesis, beside the drawing of the business. */}
        <div className="mt-[48px] grid grid-cols-1 gap-[48px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-[72px]">
          <div>
            <span className={`${EYEBROW} ${label}`}>Business Model</span>
            <p className={`mt-[14px] ${SUBHEAD} text-[clamp(1.6rem,1.1rem+1.6vw,2.4rem)] leading-[1.15]`}>{study.business}</p>
            <dl className="m-0 mt-[40px] grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {support.map(([term, text]) => (
                <div key={term} className={`border-t py-[18px] ${dark ? "border-white/40" : "border-black"}`}>
                  <dt className={`${EYEBROW} ${label}`}>{term}</dt>
                  <dd className={`mt-[10px] ml-0 font-serif text-[clamp(1.1rem,1rem+.4vw,1.3rem)] leading-[1.3] ${look.body}`}>{text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={`self-start p-[28px] max-[600px]:p-[18px] ${look.card}`}>
            <Drawing on={shown} dark={dark} />
          </div>
        </div>

        <div className={`mt-[48px] p-[28px] max-[600px]:p-[18px] ${look.card}`}>
          <FinancialsChart study={study} dark={dark} shown={shown} />
        </div>
      </div>
    </section>
  );
}

/**
 * The three companies on one FY20 to FY24 line: each year's PAT as a disc
 * sized by its value, drawn in left to right, ending on the multiple the
 * company reached. The plan's disclaimer closes the section.
 */
export function TimelineSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  const years = CASE_STUDIES[0].financials.map((row) => row.year);
  const maxPat = Math.max(...CASE_STUDIES.flatMap((study) => study.financials.map((row) => row.pat)));
  const size = (pat: number) => Math.max(6, Math.sqrt(pat / maxPat) * 44);
  return (
    <section id="timeline" aria-labelledby="timeline-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Timeline</BracketLabel>
            <h2 id="timeline-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Historical Investment Timeline
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{CASE_LOREM.long}</p>
        </div>

        <div ref={ref} className="mt-[56px]">
          <div className={`${EYEBROW} grid grid-cols-[minmax(0,180px)_repeat(5,minmax(0,1fr))_72px] items-end border-b border-black pb-[12px] text-black/60 max-md:grid-cols-[repeat(5,minmax(0,1fr))_56px]`}>
            <span className="max-md:hidden">PAT, Rs. crore</span>
            {years.map((year) => (
              <span key={year} className="text-center">
                {year}
              </span>
            ))}
            <span className="text-right">Multiple</span>
          </div>
          {CASE_STUDIES.map((study, row) => (
            <div key={study.id} className="border-b border-black/15 py-[22px]">
              <a href={`#${study.id}`} className="font-serif text-[clamp(1.2rem,1rem+.6vw,1.5rem)] leading-[1.2] text-black no-underline md:hidden">
                {study.name}
              </a>
              <div className="grid grid-cols-[minmax(0,180px)_repeat(5,minmax(0,1fr))_72px] items-center max-md:mt-[12px] max-md:grid-cols-[repeat(5,minmax(0,1fr))_56px]">
                <a href={`#${study.id}`} className="pr-4 font-serif text-[clamp(1.2rem,1rem+.6vw,1.5rem)] leading-[1.2] text-black no-underline max-md:hidden">
                  {study.name}
                </a>
                {study.financials.map((point, index) => {
                  const delay = row * 160 + index * 70;
                  return (
                    <div key={point.year} className="relative flex h-[76px] flex-col items-center justify-center">
                      {index > 0 && (
                        <span
                          aria-hidden="true"
                          className="absolute top-[30px] right-1/2 h-[1.5px] w-full origin-left bg-black/25 motion-reduce:!transition-none"
                          style={{ transform: `scaleX(${shown ? 1 : 0})`, transition: `transform 400ms ${EASE} ${delay - 100}ms` }}
                        />
                      )}
                      <span className="relative grid h-[60px] place-items-center">
                        <span
                          aria-hidden="true"
                          className="block rounded-full motion-reduce:!transition-none"
                          style={{
                            width: size(point.pat),
                            height: size(point.pat),
                            backgroundColor: index === study.financials.length - 1 ? ORANGE : "#000",
                            opacity: shown ? 1 : 0,
                            transform: `scale(${shown ? 1 : 0.9})`,
                            transition: `opacity 400ms ${EASE} ${delay}ms, transform 400ms ${EASE} ${delay}ms`,
                          }}
                        />
                      </span>
                      <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-black/60 tabular-nums">{point.pat}</span>
                    </div>
                  );
                })}
                <span
                  className="text-right text-[clamp(1.2rem,1rem+.8vw,1.7rem)] leading-none font-normal tracking-[-.04em] tabular-nums motion-reduce:!transition-none"
                  style={{ opacity: shown ? 1 : 0, transition: `opacity 400ms ease ${row * 160 + 500}ms` }}
                >
                  {study.multiple}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[64px] grid grid-cols-[34px_minmax(0,1fr)] gap-x-[14px] border-t border-black pt-[24px]">
          <span className="mt-[4px] grid h-[24px] w-[24px] place-items-center border border-black/30" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M6 2v5M6 9.2v.8" fill="none" stroke="#000" strokeWidth="1.8" />
            </svg>
          </span>
          <div>
            <span className={`${EYEBROW} text-black/60`}>Disclaimer</span>
            <p className="mt-[10px] max-w-[880px] font-serif text-[clamp(1.2rem,1rem+.6vw,1.5rem)] leading-[1.3] text-black/80">{CASE_DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CaseStudyList() {
  const tones: readonly Tone[] = ["white", "black", "grey"];
  return (
    <>
      {CASE_STUDIES.map((study, index) => (
        <CaseStudySection key={study.id} study={study} index={index} tone={tones[index % tones.length]} />
      ))}
    </>
  );
}
