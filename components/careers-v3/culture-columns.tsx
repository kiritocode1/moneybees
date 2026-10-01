"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useShown } from "@/components/about-v2/shared";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { CAREERS_LOREM, CULTURE } from "@/lib/careers";

/*
 * Our Work Culture (content plan §10) as study 03's glyph columns
 * (reference/visual-language/03-futerra-glyph-columns.png): a dark card on
 * black, a small label at the top left and a mark at the top right, equal
 * columns each with a solid white glyph of about 40px, a heading with one
 * word in italic, and a short body. Each glyph carries one orange element.
 * The culture points are placeholders until HR supplies them (lib/careers.ts).
 */

const ORANGE = "#F6A11A";

const GLYPHS: Record<(typeof CULTURE)[number]["glyph"], ReactNode> = {
  // Four marks closing on a point.
  research: (
    <>
      <circle r="9" fill="none" stroke="#fff" strokeWidth="2.6" />
      {[0, 90, 180, 270].map((angle) => (
        <path key={angle} d="M0-22 4.5-15H-4.5Z" fill="#fff" transform={`rotate(${angle})`} />
      ))}
      <circle r="3.6" fill={ORANGE} />
    </>
  ),
  // 03's ring with a body inside and a dot in orbit.
  long: (
    <>
      <circle r="17" fill="none" stroke="#fff" strokeWidth="2.6" />
      <circle cx="-1.5" cy="1" r="11" fill="#fff" />
      <circle cx="12.2" cy="11.8" r="3.2" fill={ORANGE} />
    </>
  ),
  // 03's triangles set round a centre.
  owner: (
    <>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <path key={angle} d="M0-21 5.2-12H-5.2Z" fill="#fff" transform={`rotate(${angle + 30})`} />
      ))}
      <circle r="4" fill={ORANGE} />
    </>
  ),
  // 03's burst of stems ending in dots.
  learn: (
    <>
      {Array.from({ length: 10 }, (_, index) => (
        <g key={index} transform={`rotate(${index * 36})`}>
          <path d="M0-6.5V-15" stroke="#fff" strokeWidth="2" />
          <circle cy="-18" r="3" fill="none" stroke="#fff" strokeWidth="2" />
        </g>
      ))}
      <circle r="4.2" fill={ORANGE} />
    </>
  ),
};

/** The heading with its last word in italic, as 03 sets one word of each heading. */
function Heading({ text }: { text: string }) {
  const words = text.split(" ");
  const last = words.pop();
  return (
    <>
      {words.length ? `${words.join(" ")} ` : null}
      <em className="italic">{last}</em>
    </>
  );
}

export function CultureColumns() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.25);
  return (
    <section id="culture" aria-labelledby="culture-heading" className="scroll-mt-[96px] bg-black text-white">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <span className={`${EYEBROW} text-white/60`}>03</span>
            <h2 id="culture-heading" className={`mt-[14px] ${SUBHEAD}`}>
              Our Work Culture
            </h2>
            <p className={`mt-[28px] max-w-[480px] text-white/70 ${BODY}`}>{CAREERS_LOREM.long}</p>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[6px] bg-[#141414]">
            <Image src="/people/moneybee-boardroom.jpg" alt="A meeting in the Moneybee boardroom" fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover" />
          </div>
        </div>
        <div ref={ref} className="relative mt-[64px] rounded-[6px] bg-[#141414] px-[clamp(24px,3.4vw,48px)] pt-[22px] pb-[clamp(32px,4vw,56px)] ring-1 ring-white/[.08]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] tracking-[.02em] text-white/80">Moneybee</span>
            <svg viewBox="-10 -10 20 20" className="h-[12px] w-[12px]" aria-hidden="true">
              <polygon points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5" fill={ORANGE} />
            </svg>
          </div>
          <ol className="m-0 mt-[clamp(40px,5vw,72px)] grid list-none grid-cols-1 gap-x-[clamp(24px,3vw,48px)] gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {CULTURE.map((point, index) => (
              <li key={point.name} style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(16px)", transition: `opacity ${t(500, index * 120)}, transform ${t(700, index * 120)}` }}>
                <svg viewBox="-24 -24 48 48" className="h-[52px] w-[52px]" aria-hidden="true">
                  {GLYPHS[point.glyph]}
                </svg>
                <h3 className="mt-[22px] font-serif text-[clamp(1.6rem,1.3rem+.8vw,2.1rem)] leading-[1.08] font-normal">
                  <Heading text={point.name} />
                </h3>
                <p className="mt-[16px] max-w-[30ch] text-[14px] leading-[1.55] text-white/65">{point.text}</p>
              </li>
            ))}
          </ol>
          <span aria-hidden="true" className={`${EYEBROW} mt-[clamp(40px,5vw,72px)] block text-white/50`}>
            03
          </span>
        </div>
      </div>
    </section>
  );
}
