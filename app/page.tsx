"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { ArrowRight } from "reicon-react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import FounderSection from "@/components/fact-sections/founder-section";
import PhilosophyFlythrough from "@/components/philosophy/philosophy-flythrough";
import ProductsSection from "@/components/fact-sections/products-section";
import PicksSection from "@/components/fact-sections/picks-section";
import RecordSection from "@/components/fact-sections/record-section";
import ResearchSection from "@/components/fact-sections/research-section";
import RiskSection from "@/components/fact-sections/risk-section";
import TeamSection from "@/components/fact-sections/team-section";
import ChapterFigure from "@/components/option-one/chapter-figure";
import ChapterStack from "@/components/option-one/chapter-stack";
import { HeroSection, WhoWeAreSection } from "@/components/hero/hero-sections";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";
import { AUDIENCE, PMS_VS_AIF, PROCESS_CHAPTERS } from "@/lib/insights";
import { EASE_OUT } from "@/lib/ease";

/* Shared utility strings. These are whole literal class names so Tailwind's
   source scanner still finds them; never build a class from a variable. */
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-[#F7A11A] focus-visible:outline-offset-4";
/** Horizontal page gutter that collapses to the 1480px content column. */
const GUTTER = "px-[max(32px,calc((100vw_-_1480px)/2))]";
/** The orange arrow tile, which nudges on hover of its parent `group`. */
const ARROW_TILE =
  "grid place-items-center not-italic transition-transform duration-200 ease-[ease] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]";

/** Group profile p9 and p17, AIF presentation p9, as printed. The download rows are site actions. */
const offerings = [
  ["Moneybee PMS", "15 to 20 stocks"],
  ["Flyingbee Investment Fund", "Rs. 1 crore minimum"],
  ["Disclosure Document and PPM", "Download"],
  ["Fee structure and illustration", "Download"],
] as const;

/**
 * A display heading whose lines rise out of a mask instead of fading in place.
 *
 * Each line gets its own `overflow-hidden` wrapper, so the type appears to be
 * uncovered from the baseline up. The wrapper needs vertical room for
 * descenders or `g` and `y` would sit clipped once the line has landed: the em
 * padding opens the clip box and the equal negative margin takes that room back
 * out of the flow, leaving line spacing exactly as `<br />` left it.
 *
 * The viewport trigger sits on the heading rather than on each line, so all
 * lines are driven by one intersection and the stagger stays deterministic no
 * matter how the heading happens to wrap.
 */
function RisingHeading({
  lines,
  className = "",
  level = 2,
  delay = 0,
  stagger = 0.1,
}: {
  lines: React.ReactNode[];
  className?: string;
  level?: 1 | 2;
  delay?: number;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = level === 1 ? motion.h1 : motion.h2;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      {lines.map((line, index) => (
        <span
          // A heading's lines are fixed content in a fixed order, and a line may be a
          // node rather than a string, so position is the only stable identity here.
          key={index}
          className="block overflow-hidden pb-[.2em] -mb-[.2em]"
        >
          <motion.span
            className="block"
            variants={{
              // Overshoot the mask height so no part of the line is ever visible
              // in the descender room below it before the rise begins.
              hidden: { y: "150%" },
              shown: {
                y: 0,
                transition: {
                  duration: reduceMotion ? 0 : 1.05,
                  delay: reduceMotion ? 0 : delay + index * stagger,
                  ease: EASE_OUT,
                },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function CornerLink({
  children,
  href = "#contact",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-[10px] text-[11px] text-[#000000] no-underline ${FOCUS} ${className}`}
    >
      <i className={`h-[28px] w-[28px] bg-[#F7A11A] text-white ${ARROW_TILE}`}>
        <ArrowRight size={16} aria-hidden="true" />
      </i>
      {children}
    </a>
  );
}

/**
 * The Moneybee homepage. Facts come from the client decks (lib/insights.ts):
 * headings are deck lines, paragraphs are rewritten plainly from deck facts.
 */
export default function Home() {
  const reduceMotion = useReducedMotion();

  /* A single restrained reveal: a short fade and rise as a section arrives.
     The props are the same with and without reduced motion, because the server
     cannot know the setting and any difference breaks hydration. Reduced motion
     only drops the duration, so the section still resolves to its final state
     the moment it is in view. */
  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.7, delay, ease: EASE_OUT },
  });

  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-[#000000]">
        {/* Hero and 1 · Who we are, in antimetal.com's layout (components/hero). */}
        <HeroSection />
        <WhoWeAreSection />

        {/* 2 · Who runs it, and why small caps: the founder in his own words */}
        <FounderSection />
        {/* 3 · What we believe */}
        <PhilosophyFlythrough />
        {/* 4 · How we choose */}
        <ResearchSection />
        {/* 5 · How we protect */}
        <RiskSection />
        {/* 6 · What it has produced */}
        <PicksSection />
        <div id="performance">
          <RecordSection />
        </div>
        {/* 7 · What you can invest in */}
        <section
          id="what-we-do"
          className={`relative grid min-h-[880px] grid-cols-[.32fr_1fr] gap-[50px] overflow-hidden bg-white py-[68px] ${GUTTER} max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[600px]:px-[22px] max-[600px]:py-[60px]`}
        >
          <div className="absolute top-[27%] left-[61%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,161,26,.13)_0%,rgba(247,161,26,.05)_38%,transparent_70%)] blur-[4px]" />
          <p className="relative z-[2] max-w-[210px] text-[10px] leading-[1.5] text-[rgba(0,0,0,.6)] max-[900px]:mb-[20px]">
            {PMS_VS_AIF}
          </p>
          <div className="relative z-[2]">
            <RisingHeading
              lines={["Specialising in", "small and mid-cap", "Indian equities"]}
              className="max-w-[900px] text-center text-[clamp(4.5rem,7vw,7.5rem)] font-light leading-[.91] tracking-[-.06em] text-[#000000] max-[600px]:text-[3.7rem]"
            />
            <div className="mt-[40px] ml-[20%] grid grid-cols-[1fr_310px] items-end gap-[60px] max-[900px]:ml-0 max-[600px]:mt-[36px] max-[600px]:grid-cols-1">
              <p className="max-w-[400px] text-[11px] leading-[1.55] text-[rgba(0,0,0,.64)]">
                Long-only Indian equities, mostly small and mid caps. Flyingbee, our AIF, can also own companies before they list.
              </p>
              <Image
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=90"
                alt="A portfolio review in progress"
                width={310}
                height={220}
                className="h-[184px] w-[310px] object-cover max-[600px]:h-[200px] max-[600px]:w-full"
              />
            </div>
            <div className="mt-[40px] ml-[20%] border-t border-t-[rgba(0,0,0,.13)] max-[900px]:ml-0">
              {offerings.map(([title, meta]) => (
                <a
                  href="#contact"
                  key={title}
                  className={`group grid min-h-[56px] grid-cols-[1fr_auto_34px] items-center gap-[24px] border-b border-b-[rgba(0,0,0,.13)] text-[13px] text-[rgba(0,0,0,.78)] no-underline transition-colors duration-200 ease-[ease] hover:text-[#000000] max-[600px]:grid-cols-[1fr_25px] max-[600px]:gap-x-[18px] max-[600px]:gap-y-[5px] max-[600px]:py-[18px] ${FOCUS}`}
                >
                  <span className="transition-transform duration-300 ease-[ease] group-hover:translate-x-[8px] max-[600px]:col-start-1 max-[600px]:row-start-1">
                    {title}
                  </span>
                  <small className="whitespace-nowrap text-[10px] tracking-[.02em] text-[rgba(0,0,0,.6)] max-[600px]:col-start-1 max-[600px]:row-start-2 max-[600px]:whitespace-normal">
                    {meta}
                  </small>
                  <i className={`h-[25px] w-[25px] bg-[#F7A11A] text-[10px] text-white ${ARROW_TILE} max-[600px]:col-start-2 max-[600px]:row-[1/3] max-[600px]:self-center`}>
                    <ArrowRight size={14} aria-hidden="true" />
                  </i>
                </a>
              ))}
            </div>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=85"
            alt="Research notes and holdings data"
            width={280}
            height={190}
            className="absolute bottom-[44px] left-[max(32px,calc((100vw_-_1480px)/2))] h-[168px] w-[248px] object-cover max-[900px]:hidden"
          />
        </section>
        <ProductsSection bare />
        {/* 8 · Who manages it */}
        <TeamSection />
        {/* 9 · What we publish, and how to begin */}
        <ChapterStack
          content={{
            "The letter": PROCESS_CHAPTERS.monitor,
            "The method": PROCESS_CHAPTERS.diligence,
            "The record": PROCESS_CHAPTERS.sectors,
          }}
          figures={{
            "The letter": <ChapterFigure kind="beacon" tone="orange" />,
            "The method": <ChapterFigure kind="bars" tone="ink" />,
            "The record": <ChapterFigure kind="pie" tone="grey" />,
          }}
        />
        <section className={`bg-white py-[140px] ${GUTTER} max-[600px]:px-[22px] max-[600px]:py-[90px]`}>
          <BracketLabel>Who we work with</BracketLabel>
          <RisingHeading
            lines={[AUDIENCE.pms]}
            className="mt-[22px] max-w-[1100px] text-[clamp(2.6rem,5vw,5.4rem)] font-light leading-[.98] tracking-[-.05em]"
          />
          <motion.p {...reveal(0.2)} className="mt-[26px] text-[13px] text-[rgba(0,0,0,.66)]">
            {AUDIENCE.aif}
          </motion.p>
          <motion.div {...reveal(0.3)}>
            <CornerLink className="mt-[40px]">Schedule a conversation</CornerLink>
          </motion.div>
        </section>

        <SiteFooter
          explore={[
            ["About Moneybee", "#about"],
            ["Our philosophy", "#philosophy-pillars"],
            ["Our process", "#research"],
            ["Performance", "#performance"],
            ["Our strategies", "#what-we-do"],
            ["Team", "#team"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
