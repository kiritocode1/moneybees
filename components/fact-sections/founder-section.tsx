"use client";

import Image from "next/image";
import { useRef } from "react";
import { FOUNDER, FOUNDER_SOURCE } from "@/lib/insights";
import { BracketLabel, SectionFooter } from "./fact-section";
import { Panel, SplitFrame, typedWords, useStageClock } from "./motion-language";

const PER_WORD = 0.11;
const WORDS = FOUNDER.quote.split(" ").length;
const TYPED = 0.2 + WORDS * PER_WORD;

/**
 * The founder in the reference's split frame: his portrait from the deck on
 * one side, and on the other his line typing in word by word, the newest word
 * grey until the next lands. His credentials follow once the line is done.
 * Replaces the homepage's placeholder quote panel.
 */
export default function FounderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useStageClock(ref, TYPED + 1);
  const { settled, newest, done } = typedWords(FOUNDER.quote, t, 0.2, PER_WORD);

  return (
    <section id="founder" aria-label="About the founder" className="bg-white pt-[40px]">
      <div ref={ref}>
        <SplitFrame>
          <Panel className="min-h-[560px]">
            <Image src="/people/dhiren-shah.jpg" alt={FOUNDER.name} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover object-[50%_30%]" />
          </Panel>
          <Panel className="flex min-h-[560px] flex-col p-[40px] max-[600px]:p-[24px]">
            <BracketLabel>About the founder</BracketLabel>
            <blockquote className="mt-[36px] text-[clamp(1.5rem,2.3vw,2.4rem)] leading-[1.14] font-light tracking-[-.035em]" aria-label={FOUNDER.quote}>
              <span aria-hidden="true">
                {settled} {newest && <span className="text-[rgba(0,0,0,.35)]">{newest}</span>}
              </span>
            </blockquote>
            <div className="mt-auto pt-[32px]" style={{ opacity: done ? 1 : 0, transition: "opacity 600ms ease" }}>
              <b className="block text-[15px] font-[550] tracking-[-.02em]">{FOUNDER.name}</b>
              <small className="mt-[4px] block text-[11px] tracking-[.04em] text-[#F7A11A]">{FOUNDER.credentials}</small>
              <ul className="mt-[18px] grid list-none gap-[8px] border-t border-t-[rgba(0,0,0,.13)] p-0 pt-[16px] text-[12px] leading-[1.5] text-[rgba(0,0,0,.7)]">
                {FOUNDER.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </Panel>
        </SplitFrame>
      </div>
      <SectionFooter source={FOUNDER_SOURCE} />
    </section>
  );
}
