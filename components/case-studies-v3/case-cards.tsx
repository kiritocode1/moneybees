"use client";

import { EYEBROW } from "@/components/hero/tokens";
import CardScroll from "@/components/motion/card-scroll";
import { CASE_STUDIES, type CaseStudyEntry } from "@/lib/case-studies";

/*
 * The three case studies (content plan §8) in the approved card scroll, one
 * card per company: its mark, number and name, and the plan's Business Model,
 * Competitive Edge and Growth Prospect lines.
 */

const TONES = ["light", "black", "orange"] as const;

/** The plan's three lines per company, in its order. */
const THESIS = [
  ["Business Model", "business"],
  ["Competitive Edge", "edge"],
  ["Growth Prospect", "growth"],
] as const;

/** The placeholder mark: the company's initials in a dashed square, until an approved logo is supplied. */
function Mark({ text, dark }: { text: string; dark: boolean }) {
  return (
    <span aria-hidden="true" className={`grid h-[64px] w-[64px] shrink-0 place-items-center border border-dashed font-[family-name:var(--font-geist-mono)] text-[15px] tracking-[.08em] ${dark ? "border-white/40 text-white" : "border-black/35 text-black"}`}>
      {text}
    </span>
  );
}

function CaseCard({ study, index, dark }: { study: CaseStudyEntry; index: number; dark: boolean }) {
  return (
    <div className="grid h-full grid-cols-1 content-between gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:content-stretch md:gap-12">
      <div className="flex flex-col justify-between gap-6">
        <div className="flex items-center gap-[18px]">
          <Mark text={study.mark} dark={dark} />
          <span aria-hidden="true" className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none opacity-20">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h2 className="font-serif text-[clamp(1.9rem,1.2rem+2.4vw,3.6rem)] leading-[1.02] font-normal text-balance">{study.name}</h2>
      </div>
      <dl className="m-0 grid content-end gap-0">
        {THESIS.map(([term, key]) => (
          <div key={term} className={`border-t py-[12px] md:py-[16px] ${dark ? "border-white/30" : "border-black/40"}`}>
            <dt className={`${EYEBROW} ${dark ? "text-white/65" : "text-black/60"}`}>{term}</dt>
            <dd className="mt-[6px] ml-0 font-serif text-[clamp(1.05rem,.95rem+.45vw,1.35rem)] leading-[1.25]">{study[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CaseCards() {
  return (
    <section aria-label="Case studies" className="bg-white text-black">
      <CardScroll
        label="Case studies"
        cards={CASE_STUDIES.map((study, index) => {
          const tone = TONES[index % TONES.length];
          return { key: study.id, tone, place: "md:col-[1/3] md:row-[1/3]", children: <CaseCard study={study} index={index} dark={tone === "black"} /> };
        })}
      />
    </section>
  );
}
