"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { ArrowRight } from "reicon-react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import FounderSection from "@/components/fact-sections/founder-section";
import PhilosophySection from "@/components/fact-sections/philosophy-section";
import ProductsSection from "@/components/fact-sections/products-section";
import PicksSection from "@/components/fact-sections/picks-section";
import RecordSection from "@/components/fact-sections/record-section";
import ResearchSection from "@/components/fact-sections/research-section";
import RiskSection from "@/components/fact-sections/risk-section";
import TeamSection from "@/components/fact-sections/team-section";
import WhySmallCapsSection from "@/components/fact-sections/why-small-caps-section";
import ChapterFigure from "@/components/option-one/chapter-figure";
import ChapterStack from "@/components/option-one/chapter-stack";
import FrameworkRow from "@/components/option-one/framework-row";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";
import { Materialize } from "@/components/pixel-reveal/materialize";
import { PixelRevealRoot } from "@/components/pixel-reveal/pixel-reveal";
import { AIF_PRODUCT, AUDIENCE, INTRODUCTION, PMS_APPROACH, RANKINGS, PMS_PRODUCT, PMS_VS_AIF, PROCESS_CHAPTERS } from "@/lib/insights";
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
 * A display heading revealed with Pixel Reveal's materialize preset. Lines stay
 * on their own lines; the hero's level-1 heading plays on load, the rest when
 * they scroll into view.
 */
function RisingHeading({
  lines,
  className = "",
  level = 2,
}: {
  lines: React.ReactNode[];
  className?: string;
  level?: 1 | 2;
  delay?: number;
  stagger?: number;
}) {
  return (
    <Materialize as={level === 1 ? "h1" : "h2"} trigger={level === 1 ? "load" : "inview"} className={className}>
      {lines.map((line, index) => (
        // A heading's lines are fixed content in a fixed order, so position is their identity.
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </Materialize>
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

  // Parallax for the hero photograph. The layer is taller than the section and
  // hangs off both edges, so it can drift against the scroll without ever
  // exposing a seam. Progress runs from the top of the page to the moment the
  // hero leaves the viewport.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroDrift = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);

  // React does not render the `muted` attribute into server markup, which can cost us
  // autoplay before hydration. Set it on the element directly, then start playback.
  const videoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      if (!el) return;
      el.muted = true;
      if (reduceMotion) {
        el.pause();
        return;
      }
      void el.play().catch(() => {});
    },
    [reduceMotion],
  );

  /* A single restrained reveal: a short fade and rise as a section arrives.
     Under reduced motion it must still resolve to the final state. Returning no
     props at all is not enough: the server renders before `useReducedMotion`
     can report, so the opacity-0 style is already on the element and nothing
     would ever clear it. `initial: false` adopts the target immediately. */
  const reveal = (delay = 0) =>
    reduceMotion
      ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.7, delay, ease: EASE_OUT },
        };

  /* The masked-line variant used by the philosophy display, which choreographs
     its own lines rather than delegating to `RisingHeading`. Same mechanics:
     overshoot the mask so the line is never caught sitting in the descender
     room, and collapse to an instant resolve under reduced motion. */
  const risingLine = (delay: number) => ({
    hidden: { y: reduceMotion ? 0 : "150%" },
    shown: {
      y: 0,
      transition: { duration: reduceMotion ? 0 : 1.05, delay: reduceMotion ? 0 : delay, ease: EASE_OUT },
    },
  });

  return (
    <SiteNavigation>
      <PixelRevealRoot>
      <main id="top" className="option-one overflow-clip bg-white text-[#000000]">
        <section ref={heroRef} className="relative flex min-h-svh flex-col overflow-hidden">
          <motion.div
            style={reduceMotion ? undefined : { y: heroDrift }}
            className="absolute inset-x-0 -top-[9%] h-[118%]"
          >
            <Image
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2200&q=90"
              alt="Contemporary office interior"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_42%]"
            />
          </motion.div>
          {/* The photograph is held back to a ghost so black type can sit on it.
              Heaviest at the left where the headline lands, and solid white at the
              foot so the regulatory line reads against paper rather than glass. */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.94)_0%,rgba(255,255,255,.84)_54%,rgba(255,255,255,.9)_100%),linear-gradient(to_top,#fff_0%,transparent_38%)]" />

          <div className="relative z-[2] mx-auto w-[min(100%_-_64px,1480px)] pt-[190px] max-[900px]:w-[calc(100%_-_36px)] max-[900px]:pt-[120px] max-[600px]:pt-[110px]">
            <RisingHeading
              level={1}
              lines={["Build, preserve, and", "grow your wealth"]}
              className="max-w-[850px] font-serif text-[clamp(4.5rem,7vw,7.4rem)] font-normal leading-[.94] tracking-[-.045em] max-[900px]:text-[clamp(3.5rem,11vw,6rem)] max-[600px]:text-[3.7rem]"
            />
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.24, ease: EASE_OUT }}
              className="mt-[66px] grid w-[440px] grid-cols-[94px_1fr] items-center gap-[22px] max-[600px]:w-full max-[600px]:grid-cols-[80px_1fr]"
            >
              <video
                ref={videoRef}
                src="/video/research-desk.mp4"
                poster="/video/research-desk.jpg"
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="A printed holdings statement being read and marked by hand"
                className="h-[68px] w-[94px] bg-[#9D9EA1] object-cover max-[600px]:h-[58px] max-[600px]:w-[80px]"
              />
              <p className="text-[12px] leading-[1.45] text-[rgba(0,0,0,.66)]">
                {INTRODUCTION.focus}
              </p>
            </motion.div>
          </div>
          {/* The hero's foot. Regulatory standing belongs near the top of the page,
              and putting it here gives the lower half of the frame something to hold
              instead of 300px of empty photograph. Every item is a fact; registration
              numbers stay out until the client supplies them. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.44, ease: EASE_OUT }}
            aria-label="Regulatory status"
            className="relative z-[2] mx-auto mt-auto flex w-[min(100%_-_64px,1480px)] flex-wrap items-end gap-x-[64px] gap-y-[22px] border-t border-t-[rgba(0,0,0,.14)] pt-[26px] pb-[46px] max-[900px]:w-[calc(100%_-_36px)] max-[900px]:gap-x-[40px] max-[600px]:gap-x-[32px] max-[600px]:gap-y-[18px] max-[600px]:pb-[30px]"
          >
            {[
              ["Portfolio Management Service", `SEBI ${PMS_PRODUCT.registration}`],
              ["Alternative Investment Fund", `SEBI ${AIF_PRODUCT.registration}`],
              ["Moneybee Securities Pvt Ltd", "Mumbai, Maharashtra, India"],
            ].map(([title, detail]) => (
              <span key={title} className="grid gap-[5px]">
                <b className="text-[12px] font-[550] tracking-[-.01em] text-[#000000]">{title}</b>
                <small className="text-[9px] uppercase tracking-[.06em] text-[rgba(0,0,0,.6)]">{detail}</small>
              </span>
            ))}
            <CornerLink href="#about" className="ml-auto">
              Scroll to explore
            </CornerLink>
          </motion.div>
        </section>

        <FrameworkRow />

        <section
          id="philosophy"
          className="relative flex min-h-[720px] flex-col items-center justify-center overflow-hidden bg-white px-[28px] py-[104px] max-[600px]:min-h-[500px] max-[600px]:py-[76px]"
        >
          <div className="absolute top-[40%] left-[55%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,161,26,.13)_0%,rgba(247,161,26,.05)_38%,transparent_70%)] blur-[4px]" />
          {/* The one place on the page where the motion is the point. The two outer
              lines rise out of their masks, the footage grows into the gap between
              them, and "where the market" slides in from the right to close the
              line. One viewport trigger on the parent drives all four, so the
              sequence reads as a single composed movement. */}
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.4 }}
            className="relative z-[1] w-[min(100%,1160px)] text-[clamp(4rem,7.3vw,7.8rem)] font-light leading-[.92] tracking-[-.06em] text-[#000000] max-[600px]:text-[3.25rem]"
          >
            <span className="block overflow-hidden pb-[.2em] -mb-[.2em]">
              <motion.span className="block" variants={risingLine(0)}>
                Finding value
              </motion.span>
            </span>
            <div className="flex items-center justify-end gap-[24px] max-[600px]:justify-start max-[600px]:gap-[12px]">
              <motion.video
                ref={videoRef}
                src="/video/desk-analysis.mp4"
                poster="/video/desk-analysis.jpg"
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="An analyst working through holdings data"
                variants={{
                  // Pure scale from the top-left corner: the frame opens out to the
                  // right and down into a slot the layout has already reserved, so
                  // nothing around it shifts. No opacity here on purpose, a fade
                  // reads as the footage appearing rather than growing.
                  hidden: { scale: reduceMotion ? 1 : 0 },
                  shown: {
                    scale: 1,
                    transition: { duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.3, ease: EASE_OUT },
                  },
                }}
                className="h-[82px] w-[150px] origin-top-left bg-[#9D9EA1] object-cover max-[900px]:h-[58px] max-[900px]:w-[100px] max-[600px]:h-[44px] max-[600px]:w-[75px]"
              />
              <motion.span
                variants={{
                  hidden: { x: reduceMotion ? 0 : 130, opacity: 0 },
                  shown: {
                    x: 0,
                    opacity: 1,
                    transition: { duration: reduceMotion ? 0 : 1.15, delay: reduceMotion ? 0 : 0.34, ease: EASE_OUT },
                  },
                }}
                className="inline-block"
              >
                where the market
              </motion.span>
            </div>
            <span className="block ml-[27%] overflow-hidden pb-[.2em] -mb-[.2em] max-[600px]:ml-[12%]">
              <motion.span className="block" variants={risingLine(0.52)}>
                is not looking
              </motion.span>
            </span>
          </motion.div>
          <motion.p
            {...reveal(0.78)}
            className="relative z-[1] mt-[46px] ml-[18%] max-w-[540px] text-[12px] leading-[1.55] text-[rgba(0,0,0,.64)] max-[600px]:ml-[12%]"
          >
            {PMS_APPROACH}
          </motion.p>
        </section>

        {/* 1 · Who we are. Group profile p4, p3 and p5, verbatim. */}
        <section id="about" className={`bg-white pt-[110px] pb-[100px] ${GUTTER} max-[600px]:px-[22px] max-[600px]:pt-[72px]`}>
          <BracketLabel>About Moneybee</BracketLabel>
          <div className="mt-[22px] grid grid-cols-[1fr_.8fr] items-end gap-[60px] max-[900px]:grid-cols-1 max-[900px]:gap-[28px]">
            <Materialize as="h2" className="text-[clamp(2.2rem,3.6vw,3.8rem)] font-light leading-[1.02] tracking-[-.045em]">
              {INTRODUCTION.lead}
            </Materialize>
            <motion.div {...reveal(0.12)} className="grid gap-[16px] text-[15px] leading-[1.6] text-[rgba(0,0,0,.76)]">
              <p>{INTRODUCTION.advice}</p>
              <p>{INTRODUCTION.team}</p>
            </motion.div>
          </div>
        </section>

        {/* Recognition, after Wonder Vision's: the one centred section, plain facts, no boast. */}
        <section aria-labelledby="recognition-heading" className={`bg-white pt-[40px] pb-[130px] text-center ${GUTTER} max-[600px]:px-[22px]`}>
          <Materialize as="h2" id="recognition-heading" className="text-[clamp(3rem,5.4vw,5.6rem)] leading-none font-light tracking-[-.05em] uppercase">
            Recognition
          </Materialize>
          <p className="mx-auto mt-[26px] max-w-[52ch] text-[16px] leading-[1.6] text-[rgba(0,0,0,.72)]">
            Ranked among India&rsquo;s top performing portfolio managers by PMS Bazaar, December 2024.
          </p>
          <dl className="mx-auto mt-[56px] grid max-w-[980px] grid-cols-3 border-y border-y-[#000] max-[600px]:grid-cols-1">
            {RANKINGS.map(([rank, period]) => (
              <div key={period} className="border-r border-r-[rgba(0,0,0,.13)] py-[34px] last:border-r-0 max-[600px]:border-r-0 max-[600px]:border-b max-[600px]:last:border-b-0">
                <dt className="text-[clamp(3.4rem,6vw,6rem)] leading-none font-light tracking-[-.05em]">{rank}</dt>
                <dd className="mt-[12px] text-[13px] uppercase tracking-[.06em] text-[rgba(0,0,0,.6)]">{period}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 2 · Why small caps */}
        <WhySmallCapsSection />
        {/* 3 · What we believe */}
        <PhilosophySection />
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
        <FounderSection />
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
      </PixelRevealRoot>
    </SiteNavigation>
  );
}
