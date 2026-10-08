import Link from "@/components/transition/transition-link";
import { HOME_PLAN, PERIOD_RETURNS } from "@/lib/insights";
import CornerBrackets from "./corner-brackets";
import { BODY, BUTTON, COLUMN, EYEBROW, HEADING, Rise } from "./editorial";
import HeroTerrain from "./hero-terrain";
import { ENQUIRY_HREF } from "@/lib/contact-v2";

/**
 * The top of the homepage in antimetal.com's layout. Class values come from the
 * pinned source (reference/antimetal/source): the 1512px column with 120px
 * gutters, the type scale (.text-heading, .text-body, .text-eyebrow), the
 * pill buttons and the corner-bracket box. Only the hero is kept; the
 * "Why Moneybee" manifesto and its wealth chart left the homepage on
 * 2026-10-06. Colours are ours: white paper, black, #F6A11A and grey. A server
 * component; the terrain and the Rise wrappers are the client parts.
 */


const SINCE_INCEPTION = PERIOD_RETURNS.find((row) => row.period === "Since Inception");

/** The plan's key highlights that carry a figure, plus its small performance highlight. */
const HERO_FIGURES = [
  ["45+", "Years of experience of the founder"],
  ["Aug 2007", "PMS since"],
  [`${SINCE_INCEPTION?.queenbee.toFixed(2)}%`, `A year since 2007, against ${SINCE_INCEPTION?.benchmark.toFixed(2)}% for the S&P BSE 500 TRI`],
  ["Small & mid", "The Indian companies we focus on"],
] as const;

export function HeroSection() {
  return (
    <section aria-label="Hero" className="relative isolate w-full overflow-hidden bg-white text-black max-md:flex max-md:flex-col">
      {/* Keep the terrain in the hero's existing illustration container. */}
      <div className="absolute top-[400px] right-[max(24px,calc((100vw_-_1512px)/2_+_96px))] z-0 w-[min(42vw,600px)] -translate-y-1/2 max-md:relative max-md:top-0 max-md:right-0 max-md:order-last max-md:mx-auto max-md:w-[min(100%_-_48px,520px)] max-md:translate-y-0 max-md:pb-12">
        <HeroTerrain />
      </div>
      {/* 256px to the headline: the source's 76px header band plus its 180px top padding. */}
      <div className={`${COLUMN} pointer-events-none relative z-10 flex flex-col gap-10 pt-[140px] pb-10 md:flex-row md:items-start md:gap-12 md:pt-[220px] md:pb-[72px]`}>
        <div className="flex max-w-[738px] flex-1 flex-col">
          <Rise>
            <h1 className={`${HEADING} text-balance`}>{HOME_PLAN.heading}</h1>
          </Rise>
          <Rise delay={0.08}>
            <p className={`mt-6 max-w-[600px] text-black/70 md:mt-8 ${BODY}`}>{HOME_PLAN.introduction}</p>
          </Rise>
          <Rise delay={0.16}>
            <div className="mt-10 flex flex-wrap items-center gap-4 md:mt-20">
              <Link href={ENQUIRY_HREF} className={`${BUTTON} pointer-events-auto bg-[#F6A11A] text-black hover:bg-black hover:text-white`}>
                Get Started
              </Link>
              <Link
                href="/our-approach"
                className={`${BUTTON} pointer-events-auto border border-dashed border-black/10 text-black hover:bg-black/[.03]`}
              >
                Our Investment Approach
                <CornerBrackets />
              </Link>
            </div>
          </Rise>
        </div>
        {/* The source reserves the figure's footprint in the flow; the figure sits behind. */}
        <div aria-hidden="true" className="hidden h-[400px] w-[417px] md:block" />
      </div>
      {/* The label names each figure, so it is the <dt>; the figure is its value, shown above it.
          Figures are ink; a short orange rule marks the top of each. */}
      <dl className={`${COLUMN} relative z-10 grid grid-cols-4 gap-x-10 gap-y-10 pt-[40px] pb-[64px] max-md:order-last max-md:grid-cols-2`}>
        {HERO_FIGURES.map(([figure, label]) => (
          <div key={label} className="flex flex-col-reverse justify-end border-t border-black/15 pt-[22px]">
            <dt className={`${EYEBROW} mt-[12px] max-w-[26ch] leading-[1.5] text-black/60`}>{label}</dt>
            <dd className="relative m-0 font-serif text-[clamp(2.2rem,3.4vw,3.2rem)] leading-none text-black tabular-nums">
              <i aria-hidden="true" className="absolute top-[-24px] left-0 h-[3px] w-[24px] bg-[#F6A11A]" />
              {figure}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
