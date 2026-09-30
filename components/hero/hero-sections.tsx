import Link from "next/link";
import { HOME_PLAN, INTRODUCTION, PERIOD_RETURNS } from "@/lib/insights";
import CornerBrackets from "./corner-brackets";
import { BODY, BUTTON, COLUMN, DashedRule, EYEBROW, HEADING, Rise, SUBHEAD } from "./editorial";
import HeroPyramid from "./hero-pyramid";
import WealthChart from "./wealth-chart";

/**
 * The top of the homepage in antimetal.com's layout. Class values come from the
 * pinned source (reference/antimetal/source): the 1512px column with 120px
 * gutters, the type scale (.text-heading, .text-body, .text-eyebrow), the
 * dashed rule, the pill buttons and the corner-bracket box. Section order is
 * the source's minus its quote: hero, then the manifesto. Colours
 * are ours: white paper, black, #F6A11A and grey. A server component; the
 * pyramid, the chart and the Rise wrappers are the client parts.
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
      {/* The source's figure is centred about x 1120 and y 400 at 1440 wide. The
          pyramid's own centre sits 44% into its viewBox, so the box hangs right of that. */}
      <div className="absolute top-[400px] right-[max(24px,calc((100vw_-_1512px)/2_+_96px))] z-0 w-[min(42vw,600px)] -translate-y-1/2 max-md:relative max-md:top-0 max-md:right-0 max-md:order-last max-md:mx-auto max-md:w-[min(100%_-_48px,520px)] max-md:translate-y-0 max-md:pb-12">
        <HeroPyramid />
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
              <Link href="/contact" className={`${BUTTON} pointer-events-auto bg-[#F6A11A] text-black hover:bg-black hover:text-white`}>
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

export function WhoWeAreSection() {
  const [first, ...rest] = INTRODUCTION.lead;
  return (
    <>
      <DashedRule />
      <section id="about" aria-labelledby="why-heading" className={`w-full bg-white text-black`}>
        <div className={`${COLUMN} grid grid-cols-1 items-start gap-10 py-[80px] md:grid-cols-2 md:gap-12`}>
          <WealthChart />
          <Rise onView>
            <div className="flex flex-col gap-5">
              <h2 id="why-heading" className={SUBHEAD}>
                Why Moneybee
              </h2>
              <ul className="mb-3 list-none border-t border-t-black/15 p-0">
                {HOME_PLAN.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 border-b border-b-black/15 py-3 text-[15px] leading-[1.45]">
                    <span aria-hidden="true" className="mt-[.5em] h-[6px] w-[6px] shrink-0 bg-[#F6A11A]" />
                    {highlight.replace(/\.$/, "")}
                  </li>
                ))}
              </ul>
              <p className={BODY}>
                {/* The bracketed drop cap: two lines tall, floated, dashed box with corner marks. */}
                {/* Ink letter; the corner marks carry the orange. */}
                <span className="relative float-left mr-3 flex h-[2lh] items-center justify-center border border-dashed border-black/10 px-2 text-[#F6A11A]">
                  <span className="font-serif text-[50px] leading-none text-black">{first}</span>
                  <CornerBrackets />
                </span>
                {rest.join("")}
              </p>
              <p className={BODY}>{INTRODUCTION.advice}</p>
              <p className={BODY}>{INTRODUCTION.team}</p>
            </div>
          </Rise>
        </div>
      </section>
    </>
  );
}
