"use client";

import { INTRODUCTION } from "@/lib/insights";
import CornerBrackets from "./corner-brackets";
import { BODY, COLUMN, DashedRule, Rise } from "./editorial";
import HeroPyramid from "./hero-pyramid";
import WealthChart from "./wealth-chart";

/**
 * The top of the homepage in antimetal.com's layout. Class values come from the
 * pinned source (reference/antimetal/source): the 1512px column with 120px
 * gutters, the type scale (.text-heading, .text-body, .text-eyebrow), the
 * dashed rule, the pill buttons and the corner-bracket box. Section order is
 * the source's minus its quote: hero, then the manifesto. Colours
 * are ours: white paper, black, #F7A11A and grey.
 */

/** .text-heading. Tracking eased from -.037em: Instrument Serif is narrower than Signifier. */
const HEADING = "font-serif text-[clamp(2.5rem,1.0417rem+3.6458vw,3.375rem)] leading-[1.1] font-normal tracking-[-.02em]";
/** .text-button with the button shell. */
const BUTTON =
  "relative inline-flex cursor-pointer items-center justify-center rounded-full px-[24.5px] py-[12.5px] text-[14px] leading-[1.5] font-medium whitespace-nowrap no-underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7A11A]";

export function HeroSection() {
  return (
    <section aria-label="Hero" className="relative isolate w-full overflow-hidden bg-white text-black max-md:flex max-md:flex-col">
      {/* The source's figure is centred about x 1120 and y 400 at 1440 wide. The
          pyramid's own centre sits 44% into its viewBox, so the box hangs right of that. */}
      <div className="absolute top-[400px] right-[max(24px,calc((100vw_-_1512px)/2_+_96px))] z-0 w-[min(42vw,600px)] -translate-y-1/2 max-md:relative max-md:top-0 max-md:right-0 max-md:order-last max-md:mx-auto max-md:w-[min(100%_-_48px,520px)] max-md:translate-y-0 max-md:pb-12">
        <HeroPyramid />
      </div>
      {/* 256px to the headline: the source's 76px header band plus its 180px top padding. */}
      <div className={`${COLUMN} pointer-events-none relative z-10 flex flex-col gap-10 pt-[140px] pb-10 md:flex-row md:items-start md:gap-12 md:pt-[256px] md:pb-[200px]`}>
        <div className="flex max-w-[738px] flex-1 flex-col">
          <Rise>
            <h1 className={`${HEADING} text-balance`}>Finding value where the market is not looking</h1>
          </Rise>
          <Rise delay={0.08}>
            <p className={`mt-6 max-w-[600px] text-black/70 md:mt-8 ${BODY}`}>{INTRODUCTION.focus}</p>
          </Rise>
          <Rise delay={0.16}>
            <div className="mt-10 flex flex-wrap items-center gap-4 md:mt-20">
              <a href="#contact" className={`${BUTTON} pointer-events-auto bg-black text-white hover:bg-black/85`}>
                Schedule a conversation
              </a>
              <a
                href="#research"
                className={`${BUTTON} pointer-events-auto border border-dashed border-black/10 text-black hover:bg-black/[.03]`}
              >
                Our process
                <CornerBrackets />
              </a>
            </div>
          </Rise>
        </div>
        {/* The source reserves the figure's footprint in the flow; the figure sits behind. */}
        <div aria-hidden="true" className="hidden h-[400px] w-[417px] md:block" />
      </div>
    </section>
  );
}

export function WhoWeAreSection() {
  const [first, ...rest] = INTRODUCTION.lead;
  return (
    <>
      <DashedRule />
      <section id="about" aria-label="Who we are" className={`w-full bg-white text-black`}>
        <div className={`${COLUMN} grid grid-cols-1 items-start gap-10 py-[80px] md:grid-cols-2 md:gap-12`}>
          <WealthChart />
          <Rise onView>
            <div className="flex flex-col gap-5">
              <p className={BODY}>
                {/* The bracketed drop cap: two lines tall, floated, dashed box with corner marks. */}
                <span className="relative float-left mr-3 flex h-[2lh] items-center justify-center border border-dashed border-black/10 px-2">
                  <span className="font-serif text-[50px] leading-none text-[#F7A11A]">{first}</span>
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
