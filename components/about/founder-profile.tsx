"use client";

import Image from "next/image";
import { COLUMN, DashedRule, EYEBROW, HEADING, Rise } from "@/components/hero/editorial";
import { FOUNDER } from "@/lib/insights";
import { FOUNDER_PROFILE } from "@/lib/about";
import DotFigure from "./dot-figure";

/**
 * The founder, group profile p3: his portrait at the size the source photo
 * holds, and beside it his years in the footer's dot lettering, his
 * credentials and the slide's points.
 */
export default function FounderProfile() {
  return (
    <section id="founder" aria-labelledby="founder-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-[minmax(0,420px)_1fr] items-start gap-[80px] py-[110px] max-[900px]:grid-cols-1 max-[900px]:gap-[48px] max-md:py-[80px]`}>
        <Rise onView>
          <div className="relative aspect-[868/824] w-full overflow-hidden bg-[#F4F3F0]">
            <Image src="/people/dhiren-shah.jpg" alt={FOUNDER_PROFILE.name} fill sizes="(max-width: 900px) 100vw, 420px" className="object-cover" />
          </div>
        </Rise>
        <div>
          <Rise onView>
            <span className={`${EYEBROW} text-black/60`}>{FOUNDER_PROFILE.role}</span>
            <h2 id="founder-heading" className={`${HEADING} mt-[14px]`}>
              {FOUNDER_PROFILE.name}
            </h2>
            <p className={`${EYEBROW} mt-[12px] text-[#c98110]`}>{FOUNDER.credentials}</p>
          </Rise>
          <div className="mt-[44px] flex items-end gap-[28px] border-t border-t-black pt-[28px] max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-[14px]">
            <p className="sr-only">{FOUNDER_PROFILE.years}</p>
            <DotFigure text={FOUNDER_PROFILE.years} className="h-[132px] w-[250px] shrink-0 max-[600px]:h-[104px] max-[600px]:w-[200px]" />
            <p className={`${EYEBROW} max-w-[22ch] pb-[10px] leading-[1.5] text-black/60`}>{FOUNDER_PROFILE.yearsLabel}</p>
          </div>
          <Rise onView delay={0.1}>
            <ul className="mt-[36px] grid list-none gap-0 border-t border-t-[rgba(0,0,0,.13)] p-0">
              {FOUNDER_PROFILE.points.map((point) => (
                <li key={point} className="flex gap-[14px] border-b border-b-[rgba(0,0,0,.13)] py-[16px] text-[17px] leading-[1.5] text-black/80">
                  <span className="mt-[.55em] h-[6px] w-[6px] shrink-0 bg-[#F6A11A]" />
                  {point}
                </li>
              ))}
            </ul>
          </Rise>
        </div>
      </div>
    </section>
  );
}
