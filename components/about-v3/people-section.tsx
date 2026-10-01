"use client";

import Image from "next/image";
import { useState } from "react";
import { hexPoints, ORANGE } from "@/components/about-v2/shared";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { PEOPLE, WORK, type Person } from "@/lib/about-v3";

const EASE = "ease-[cubic-bezier(.23,1,.32,1)]";
const FADE = `duration-300 ${EASE} motion-reduce:transition-none`;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";
const pad = (n: number) => String(n).padStart(2, "0");

/** A filled honeycomb cell, the mark beside each kind of work. */
function Cell({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="block shrink-0" aria-hidden="true">
      <polygon points={hexPoints(12, 12, 10.5)} fill={ORANGE} />
    </svg>
  );
}

/** The kinds of work a person is part of, each marked with a cell. */
function WorkList({ person, className = "" }: { person: Person; className?: string }) {
  return (
    <ul aria-label="Works on" className={`flex list-none flex-wrap gap-x-[16px] gap-y-2 p-0 ${EYEBROW} text-black/70 ${className}`}>
      {person.work.map((item) => (
        <li key={item} className="flex items-center gap-[8px]">
          <Cell />
          {WORK[item]}
        </li>
      ))}
    </ul>
  );
}

/**
 * Who does what, after the team lists on inspo.page (Telha Clarke, AUAR,
 * United Carriers): the names large down the left with each role beside it,
 * and one portrait that follows the name under the pointer, with that
 * person's line of what they do and the work they are part of. Every portrait
 * is mounted and cross-fades, so a swap never waits on a load. Below 768px
 * it is a plain list, a portrait beside each name.
 */
export default function PeopleSection() {
  const [active, setActive] = useState(0);
  const person = PEOPLE[active];
  return (
    <section id="people" aria-labelledby="people-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <BracketLabel>03 · Our team</BracketLabel>
        <h2 id="people-heading" className={`mt-[18px] ${SUBHEAD}`}>
          The people behind the portfolio
        </h2>

        <div className="mt-[64px] hidden grid-cols-12 items-start gap-x-6 md:grid">
          <ul className="col-span-7 list-none border-t border-black p-0 lg:col-span-6">
            {PEOPLE.map((entry, index) => {
              const on = index === active;
              return (
                <li key={entry.name} className="border-b border-black/10">
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-controls="person-panel"
                    onPointerEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className={`group flex w-full cursor-pointer items-baseline justify-between gap-6 py-[16px] text-left ${FOCUS}`}
                  >
                    <span className="flex items-baseline gap-[14px]">
                      <span className={`${EYEBROW} w-[20px] tabular-nums transition-colors ${FADE} ${on ? "text-[#C77800]" : "text-black/35"}`}>{pad(index + 1)}</span>
                      <span className={`font-serif text-[clamp(1.9rem,1.1rem+1.7vw,2.9rem)] leading-[1.05] tracking-[-.015em] transition-colors ${FADE} ${on ? "text-black" : "text-black/25 group-hover:text-black/55"}`}>
                        {entry.name}
                      </span>
                    </span>
                    <span className={`${EYEBROW} max-w-[22ch] text-right leading-[1.4] lg:max-w-none lg:whitespace-nowrap transition-colors ${FADE} ${on ? "text-black" : "text-black/40"}`}>{entry.role}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div id="person-panel" className="sticky top-[120px] col-span-5 col-start-8 flex gap-6">
            <div className="relative aspect-[4/5] w-[min(280px,48%)] shrink-0 overflow-hidden bg-[#EFEFEF]">
              {PEOPLE.map((entry, index) => (
                <Image
                  key={entry.name}
                  src={entry.photo}
                  alt={index === active ? entry.name : ""}
                  fill
                  sizes="280px"
                  className={`object-cover object-top grayscale contrast-[1.05] transition-[opacity,scale] ${FADE} ${index === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}
                />
              ))}
            </div>
            <div aria-live="polite" className="flex min-w-0 flex-1 flex-col self-stretch">
              <span className={`${EYEBROW} tabular-nums text-black/45`}>
                {pad(active + 1)} / {pad(PEOPLE.length)}
              </span>
              <p className={`mt-auto ${EYEBROW} leading-[1.5] text-black/60`}>
                {person.role}, {person.qualification}
              </p>
              <p className="mt-[12px] font-serif text-[clamp(1.25rem,1rem+.5vw,1.55rem)] leading-[1.2]">{person.does}</p>
              <WorkList person={person} className="mt-[18px] border-t border-black/10 pt-[14px]" />
            </div>
          </div>
        </div>

        <ul className="mt-10 list-none border-t border-black p-0 md:hidden">
          {PEOPLE.map((entry) => (
            <li key={entry.name} className="flex items-start gap-4 border-b border-black/10 py-6">
              <div className="relative h-[100px] w-[80px] shrink-0 overflow-hidden bg-[#EFEFEF]">
                <Image src={entry.photo} alt="" fill sizes="80px" className="object-cover object-top grayscale contrast-[1.05]" />
              </div>
              <div className="min-w-0">
                <span className="block font-serif text-[1.5rem] leading-[1.1]">{entry.name}</span>
                <span className="mt-[6px] block text-[13px] leading-[1.35] text-black/55">
                  {entry.role}, {entry.qualification}
                </span>
                <span className="mt-[10px] block text-[15px] leading-[1.45] text-black/80">{entry.does}</span>
                <WorkList person={entry} className="mt-[12px] text-[10px]" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
