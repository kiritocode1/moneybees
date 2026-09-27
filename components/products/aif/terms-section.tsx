"use client";

import Image from "next/image";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { AIF_HEADINGS, AIF_TERMS } from "@/lib/aif";
import { TEAM } from "@/lib/insights";

/**
 * The two people the AIF deck names (p14): the fund manager and the compliance
 * officer. Each portrait sits on the deck's orange square frame, offset
 * behind it.
 */
export function FundTeamSection() {
  const people = TEAM.slice(0, 2);
  return (
    <section id="fund-team" aria-labelledby="fund-team-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} pt-[110px] pb-[120px]`}>
        <BracketLabel>The people behind the portfolio</BracketLabel>
        <h2 id="fund-team-heading" className={`mt-[18px] ${SUBHEAD}`}>
          Team profile
        </h2>
        <div className="mt-[64px] grid grid-cols-1 gap-[72px] md:grid-cols-2">
          {people.map((person, index) => (
            <Rise key={person.name} onView delay={index * 0.08}>
              <article className="grid grid-cols-[minmax(0,180px)_1fr] gap-[32px] max-[520px]:grid-cols-1">
                <div className="relative aspect-[4/5] w-full max-w-[180px]">
                  <i aria-hidden="true" className="absolute top-[12px] left-[12px] h-full w-full bg-[#F7A11A]" />
                  <Image src={person.photo} alt={person.name} fill sizes="180px" className="relative object-cover grayscale" />
                </div>
                <div>
                  <h3 className="font-serif text-[clamp(1.9rem,2.6vw,2.4rem)] leading-none font-normal">{person.name}</h3>
                  <p className={`${EYEBROW} mt-[12px] text-black/60`}>{person.role.replace(/ [-–] /, ", ")}</p>
                  <ul className="mt-[22px] grid list-none gap-[10px] border-t border-t-[rgba(0,0,0,.13)] pt-[18px]">
                    {person.points.map((point) => (
                      <li key={point} className="text-[15px] leading-[1.6] text-black/75">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Terms of Flyingbee (AIF presentation p9, every row, plus the scheme type
 * from p2 and the first close from p10), set as a term sheet: the heading and
 * the minimum held on the left while the terms run down the right, each row
 * rising in as it arrives.
 */
export default function TermsSection() {
  const [[minimumLabel, minimum], ...rest] = AIF_TERMS;
  return (
    <section id="terms" aria-labelledby="terms-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-start gap-12 py-[110px] md:grid-cols-[.85fr_1.15fr]`}>
        <div className="md:sticky md:top-[120px]">
          <BracketLabel>Terms</BracketLabel>
          <h2 id="terms-heading" className={`mt-[18px] ${SUBHEAD}`}>
            {AIF_HEADINGS.terms}
          </h2>
          <p className={`${EYEBROW} mt-[48px] text-black/60`}>{minimumLabel}</p>
          <p className="mt-[12px] font-serif text-[clamp(3rem,5.4vw,5.2rem)] leading-none text-[#F7A11A]">{minimum.replace(/ \(.*\)/, "")}</p>
          <p className={`${EYEBROW} mt-[12px] text-black/60`}>{minimum.match(/\((.*)\)/)?.[1]}</p>
        </div>
        <dl className="border-t border-t-black">
          {rest.map(([term, value], index) => (
            <Rise key={term} onView delay={(index % 4) * 0.05}>
              <div className="grid grid-cols-[190px_1fr] gap-[24px] border-b border-b-[rgba(0,0,0,.13)] py-[22px] max-[600px]:grid-cols-1 max-[600px]:gap-[8px]">
                <dt className={`${EYEBROW} pt-[6px] text-black/55`}>{term}</dt>
                <dd className="font-serif text-[clamp(1.35rem,1.8vw,1.7rem)] leading-[1.25]">{value}</dd>
              </div>
            </Rise>
          ))}
        </dl>
      </div>
    </section>
  );
}
