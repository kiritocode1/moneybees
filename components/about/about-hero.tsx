"use client";

import Link from "next/link";
import { useRef } from "react";
import { BODY, COLUMN, EYEBROW, HEADING, Rise } from "@/components/hero/editorial";
import { clamp, easeOut } from "@/components/fact-sections/fact-section";
import { ABOUT_INTRO, GROUP_BUSINESSES } from "@/lib/about";
import { useBuild } from "./use-build";

/**
 * The stripes down the left third of the group profile's cover (p1), read off
 * the cover image at 770px across: [colour, x, width]. O is the orange, K the
 * black, G the grey; the cream and white between them are the paper.
 */
const STRIPES: readonly (readonly ["O" | "K" | "G", number, number])[] = [
  ["O", 16, 29], ["G", 48, 2], ["O", 51, 9], ["K", 68, 43], ["O", 117, 5], ["O", 138, 5], ["O", 146, 4], ["O", 152, 8],
  ["O", 180, 6], ["K", 201, 9], ["K", 213, 6], ["O", 238, 3], ["K", 242, 6], ["G", 248, 16], ["O", 273, 22], ["G", 305, 10],
  ["O", 328, 9], ["O", 339, 2], ["K", 344, 13], ["O", 367, 4], ["K", 384, 2], ["K", 396, 2], ["G", 399, 4], ["O", 405, 7],
  ["G", 415, 2], ["O", 420, 2], ["O", 434, 10], ["O", 447, 3], ["K", 453, 16], ["O", 479, 2], ["O", 482, 2], ["O", 485, 2],
  ["O", 495, 2], ["K", 503, 3], ["K", 508, 2], ["K", 519, 2], ["G", 521, 6], ["O", 530, 8], ["K", 547, 17], ["O", 564, 3],
  ["K", 567, 8], ["O", 598, 5], ["K", 604, 7], ["G", 611, 20], ["O", 642, 28], ["G", 676, 10], ["O", 687, 2], ["O", 697, 7],
  ["O", 706, 2], ["K", 710, 11], ["O", 731, 3], ["K", 745, 2], ["K", 748, 2], ["G", 757, 5], ["O", 764, 6],
];
const FILL = { O: "#F6A11A", K: "#000000", G: "#9D9EA1" } as const;
/** Deterministic scatter for the order the stripes land in. */
const scatter = (seed: number) => {
  const value = Math.sin(seed * 91.7) * 43758.5453;
  return value - Math.floor(value);
};

/**
 * The cover's barcode, redrawn: each stripe drops from the top edge in a
 * scattered order until the band stands as it does on the deck's first page.
 */
function CoverStripes() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useBuild(ref, 1800, 0.2);
  return (
    <div ref={ref} aria-hidden="true" className="relative h-full w-full">
      <svg viewBox="0 0 770 1000" preserveAspectRatio="none" className="block h-full w-full">
        {STRIPES.map(([colour, x, width], index) => {
          const grown = easeOut(clamp((progress - scatter(index + 1) * 0.55) / 0.45));
          return <rect key={x} x={x} y={0} width={width} height={1000 * grown} fill={FILL[colour]} />;
        })}
      </svg>
    </div>
  );
}

/** The top of /about: who the group is, its businesses, and the cover's stripes beside them. */
export default function AboutHero() {
  return (
    <section aria-labelledby="about-heading" className="relative isolate w-full overflow-hidden bg-white text-black">
      <div className={`${COLUMN} relative z-10 pt-[150px] pb-[64px] md:pt-[220px] md:pb-[96px]`}>
        <div className="absolute top-[120px] right-[120px] bottom-0 w-[min(30vw,420px)] max-md:hidden">
          <CoverStripes />
        </div>
        <div className="max-w-[680px] md:max-w-[calc(100%_-_min(30vw,420px)_-_64px)]">
          <Rise>
            <span className={`${EYEBROW} text-black/60`}>About Moneybee</span>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="about-heading" className={`${HEADING} mt-[18px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,4.6rem)]`}>
              {ABOUT_INTRO.heading}
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className={`mt-8 max-w-[600px] text-black/70 ${BODY}`}>{ABOUT_INTRO.lead}</p>
          </Rise>
        </div>
      </div>
      {/* A phone gets the stripes as a band under the text instead of beside it. */}
      <div className="h-[120px] md:hidden">
        <CoverStripes />
      </div>
      <Rise delay={0.2}>
        <ul className={`${COLUMN} relative z-10 grid list-none grid-cols-3 gap-x-10 gap-y-8 border-t border-dashed border-black/10 pt-[32px] pb-[64px] max-md:grid-cols-1`}>
          {GROUP_BUSINESSES.map((business) => (
            <li key={business.name}>
              <Link
                href={business.href}
                {...(business.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group block text-black no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6A11A]"
              >
                <span className="block font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.05] transition-colors duration-200 group-hover:text-[#F6A11A]">
                  {business.name}
                </span>
                <span className={`${EYEBROW} mt-[12px] flex items-center gap-[10px] text-black/60`}>
                  {business.detail}
                  <span className="h-[2px] w-[14px] bg-[#F6A11A] transition-all duration-300 group-hover:w-[28px]" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Rise>
    </section>
  );
}
