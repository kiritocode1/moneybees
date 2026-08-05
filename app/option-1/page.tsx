"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useCallback, useRef } from "react";
import {
  ArrowRightUp,
  Compass,
  Eye,
  HandHeart,
  Hourglass,
  Search,
  Shield,
  TagPrice,
} from "reicon-react";
import ChapterStack from "@/components/option-one/chapter-stack";
import FrameworkRow from "@/components/option-one/framework-row";
import InterviewCarousel from "@/components/option-one/interview-carousel";
import PinnedStats from "@/components/option-one/pinned-stats";
import QuotePanel from "@/components/option-one/quote-panel";
import OverlayMenu, { type MenuLink } from "@/components/ui/overlay-menu";
import { EASE_OUT } from "@/lib/ease";

/* Shared utility strings. These are whole literal class names so Tailwind's
   source scanner still finds them; never build a class from a variable. */
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-[#b8862f] focus-visible:outline-offset-4";
/** Horizontal page gutter that collapses to the 1480px content column. */
const GUTTER = "px-[max(32px,calc((100vw_-_1480px)/2))]";
/** The orange arrow tile, which nudges on hover of its parent `group`. */
const ARROW_TILE =
  "grid place-items-center not-italic transition-transform duration-200 ease-[ease] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]";

/** The four investment principles. See docs/direction.md, "The narrative". */
const principles = [
  [Search, "Fundamental research", "We understand the business before we value the security. Annual reports, unit economics, and the history of the people running it."],
  [Compass, "Independent thinking", "Conviction comes from evidence we have gathered ourselves. Consensus is a starting point, never a reason to own something."],
  [Hourglass, "Long-term ownership", "Business performance drives returns over years. Market noise drives them over weeks. We are invested in the first."],
  [TagPrice, "Valuation discipline", "A good company is not a good investment at every price. Price is a decision in itself, not a detail of one."],
] as const;

/** Pure-play PMS and AIF. The two figures are SEBI statutory minimums, not Moneybee data. */
const offerings = [
  ["Portfolio Management Service", "₹50 lakh minimum"],
  ["Alternative Investment Fund", "₹1 crore minimum"],
  ["Disclosure Document and PPM", "Download"],
  ["Fee structure and illustration", "Download"],
] as const;

/** How risk is handled, stated while nothing is going wrong. */
const riskPractices = [
  ["Downside", "Protect first", "Position sizing and cash levels are set so that a poor year stays survivable, not so that a good year looks better."],
  ["Concentration", "Know each holding", "We hold few enough businesses that any one of them can be explained from memory, without notes."],
  ["Turnover", "Trade rarely", "Low turnover keeps costs down and keeps more of the return once tax has been accounted for."],
] as const;

const PRIMARY_LINKS: MenuLink[] = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "What we do", href: "#what-we-do" },
  { label: "Performance", href: "#performance" },
  { label: "Contact", href: "#contact" },
];

const SECONDARY_LINKS: MenuLink[] = [
  { label: "From the investment desk", href: "#desk" },
  { label: "Managing risk", href: "#risk" },
  { label: "Investor login", href: "https://www.moneybee.in/register.php" },
];

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
      initial={reduceMotion ? false : "hidden"}
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

/**
 * A photograph that settles rather than arrives: it enters slightly overscaled
 * and eases back to its natural size behind a fixed frame. The frame does the
 * clipping so the surrounding layout never moves.
 */
function SettlingImage({
  className = "",
  children,
  amount = 0.25,
}: {
  className?: string;
  children: React.ReactNode;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={reduceMotion ? false : { scale: 1.16 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduceMotion ? 0 : 1.6, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* Every ground the wordmark sits on is now white or near-white, including the
   washed photograph behind the fixed header, so it no longer needs a light and
   a dark variant. */
function Wordmark({ tagline = false }: { tagline?: boolean }) {
  return (
    <div className="flex items-center gap-[12px]">
      <a
        href="#top"
        aria-label="Moneybee home"
        className={`inline-flex w-max items-center gap-[8px] text-[15px] font-[650] tracking-[-.04em] text-[#111111] no-underline ${FOCUS}`}
      >
        Moneybee <span className="h-[7px] w-[7px] bg-[#b8862f]" />
      </a>
      {tagline && (
        <small className="text-[8px] font-medium uppercase text-[rgba(17,17,17,.6)]">
          Small steps, Big Outcomes
        </small>
      )}
    </div>
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
      className={`group inline-flex items-center gap-[10px] text-[11px] text-[#111111] no-underline ${FOCUS} ${className}`}
    >
      <i className={`h-[28px] w-[28px] bg-[#b8862f] text-white ${ARROW_TILE}`}>
        <ArrowRightUp size={16} aria-hidden="true" />
      </i>
      {children}
    </a>
  );
}

export default function Option1() {
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
    <OverlayMenu
      brand={<Wordmark tagline />}
      primaryLinks={PRIMARY_LINKS}
      secondaryLinks={SECONDARY_LINKS}
      /* The curtain stays dark on purpose: it is a momentary overlay, and a black
         one against a white page is the sharpest thing a monochrome palette can
         do. Only the blue is gone. The toggler bars are ink so they read against
         the washed hero, and a scoped rule in globals.css flips them to white for
         as long as the curtain is open. */
      panelColors={["#8c8c88", "#141414", "#4a4a46", "#242422"]}
      menuColor="#141414"
      togglerColor="#111111"
    >
      <main id="top" className="option-one overflow-clip bg-white text-[#111111]">
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
                className="h-[68px] w-[94px] bg-[#e9e9e6] object-cover max-[600px]:h-[58px] max-[600px]:w-[80px]"
              />
              <p className="text-[12px] leading-[1.45] text-[rgba(17,17,17,.66)]">
                Finding value where the market is not looking. Fundamental, bottom-up research into businesses that most portfolios never reach.
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
            className="relative z-[2] mx-auto mt-auto flex w-[min(100%_-_64px,1480px)] flex-wrap items-end gap-x-[64px] gap-y-[22px] border-t border-t-[rgba(17,17,17,.14)] pt-[26px] pb-[46px] max-[900px]:w-[calc(100%_-_36px)] max-[900px]:gap-x-[40px] max-[600px]:gap-x-[32px] max-[600px]:gap-y-[18px] max-[600px]:pb-[30px]"
          >
            {[
              ["Portfolio Management Service", "SEBI-registered portfolio manager"],
              ["Alternative Investment Fund", "SEBI-registered fund"],
              ["Moneybee Securities Pvt Ltd", "Mumbai, Maharashtra, India"],
            ].map(([title, detail]) => (
              <span key={title} className="grid gap-[5px]">
                <b className="text-[12px] font-[550] tracking-[-.01em] text-[#111111]">{title}</b>
                <small className="text-[9px] uppercase tracking-[.06em] text-[rgba(17,17,17,.6)]">{detail}</small>
              </span>
            ))}
            <CornerLink href="#philosophy" className="ml-auto">
              Scroll to explore
            </CornerLink>
          </motion.div>
        </section>

        <FrameworkRow />

        <section
          id="philosophy"
          className="relative flex min-h-[720px] flex-col items-center justify-center overflow-hidden bg-white px-[28px] py-[104px] max-[600px]:min-h-[500px] max-[600px]:py-[76px]"
        >
          <div className="absolute top-[40%] left-[55%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,134,47,.13)_0%,rgba(184,134,47,.05)_38%,transparent_70%)] blur-[4px]" />
          {/* The one place on the page where the motion is the point. The two outer
              lines rise out of their masks, the footage grows into the gap between
              them, and "where the market" slides in from the right to close the
              line. One viewport trigger on the parent drives all four, so the
              sequence reads as a single composed movement. */}
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.4 }}
            className="relative z-[1] w-[min(100%,1160px)] text-[clamp(4rem,7.3vw,7.8rem)] font-light leading-[.92] tracking-[-.06em] text-[#111111] max-[600px]:text-[3.25rem]"
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
                className="h-[82px] w-[150px] origin-top-left bg-[#e9e9e6] object-cover max-[900px]:h-[58px] max-[900px]:w-[100px] max-[600px]:h-[44px] max-[600px]:w-[75px]"
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
            className="relative z-[1] mt-[46px] ml-[18%] max-w-[540px] text-[12px] leading-[1.55] text-[rgba(17,17,17,.64)] max-[600px]:ml-[12%]"
          >
            Most portfolios are built from the same few hundred widely covered names. We work further down the market, among small and ultra-small businesses where fewer analysts look and where price and value drift furthest apart.
          </motion.p>
        </section>

        <section
          id="principles"
          aria-label="Investment principles"
          className="grid min-h-[840px] grid-cols-4 border-y border-y-[rgba(17,17,17,.13)] bg-[#fafaf9] max-[900px]:min-h-0 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1"
        >
          {principles.map(([Icon, title, copy], index) => (
            <motion.article
              key={title}
              {...reveal(index * 0.08)}
              className="group flex min-h-[840px] flex-col border-r border-r-[rgba(17,17,17,.13)] px-[38px] pt-[30px] pb-[56px] transition-colors duration-500 ease-[ease] last:border-r-0 hover:bg-[rgba(17,17,17,.03)] max-[900px]:min-h-[390px] max-[600px]:min-h-[340px] max-[600px]:border-r-0 max-[600px]:border-b max-[600px]:border-b-[rgba(17,17,17,.13)]"
            >
              <span className="text-[9px] text-[rgba(17,17,17,.62)]">0{index + 1}</span>
              <i className="mt-[34px] grid h-[42px] w-[42px] place-items-center rounded-full border border-[rgba(184,134,47,.45)] text-[19px] not-italic text-[#b8862f] transition-[color,border-color,transform] duration-500 ease-[ease] group-hover:-translate-y-[5px] group-hover:scale-110 group-hover:border-[rgba(184,134,47,.95)] group-hover:text-[#8f6722]">
                <Icon size={27} aria-hidden="true" />
              </i>
              <div className="mt-auto text-center">
                <h2 className="font-serif text-[24px] font-normal">{title}</h2>
                <p className="mx-auto mt-[16px] max-w-[230px] text-[10px] leading-[1.5] text-[rgba(17,17,17,.6)]">{copy}</p>
              </div>
            </motion.article>
          ))}
        </section>

        <PinnedStats />

        {/* The written introduction, held off the left edge so the white space
            on that side does the work a rule would otherwise have to. Lead
            paragraph first, then the detail underneath it at reading size. */}
        <section
          id="about"
          className={`bg-white pt-[110px] pb-[130px] ${GUTTER} max-[600px]:px-[22px] max-[600px]:pt-[72px] max-[600px]:pb-[80px]`}
        >
          <div className="ml-[42%] max-w-[760px] max-[900px]:ml-0">
            <motion.h2
              {...reveal()}
              className="text-[clamp(1.5rem,2.4vw,2.2rem)] font-[550] leading-[1.16] tracking-[-.03em] text-[#111111]"
            >
              Moneybee is a pure-play investment manager. A Portfolio Management Service and an Alternative
              Investment Fund, both run off one research process.
            </motion.h2>
            <motion.div
              {...reveal(0.12)}
              className="mt-[38px] grid gap-[22px] text-[15px] leading-[1.6] text-[rgba(17,17,17,.76)] max-[600px]:text-[14px]"
            >
              <p>
                We are not a broker and we do not distribute other people&rsquo;s products. The only way the firm earns
                is by managing money, which puts our incentive and yours on the same side of the table: the quality
                of the portfolio, not the number of transactions in it.
              </p>
              <p>
                The research is bottom-up and mostly unglamorous. Annual reports, unit economics, and the history of
                the people running the business. Much of it is spent among small and ultra-small companies, where
                fewer analysts look and where price and value drift furthest apart.
              </p>
              <p>
                Risk is set out in the same plain terms, while nothing is going wrong. Position sizing, cash levels
                and turnover are decisions taken before a weak quarter rather than during one.{" "}
                <a
                  href="#desk"
                  className={`text-[#111111] underline underline-offset-[5px] transition-colors duration-200 ease-[ease] hover:text-[#b8862f] ${FOCUS}`}
                >
                  Read what the desk publishes.
                </a>
              </p>
            </motion.div>
          </div>
        </section>

        <section
          id="what-we-do"
          className={`relative grid min-h-[880px] grid-cols-[.32fr_1fr] gap-[50px] overflow-hidden bg-white py-[68px] ${GUTTER} max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[600px]:px-[22px] max-[600px]:py-[60px]`}
        >
          <div className="absolute top-[27%] left-[61%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,134,47,.13)_0%,rgba(184,134,47,.05)_38%,transparent_70%)] blur-[4px]" />
          <p className="relative z-[2] max-w-[210px] text-[10px] leading-[1.5] text-[rgba(17,17,17,.6)] max-[900px]:mb-[20px]">
            A PMS holds securities in your own name. An AIF pools capital under a single strategy.
          </p>
          <div className="relative z-[2]">
            <RisingHeading
              lines={["Two products.", "One research", "process."]}
              className="max-w-[900px] text-center text-[clamp(4.5rem,7vw,7.5rem)] font-light leading-[.91] tracking-[-.06em] text-[#111111] max-[600px]:text-[3.7rem]"
            />
            <div className="mt-[40px] ml-[20%] grid grid-cols-[1fr_310px] items-end gap-[60px] max-[900px]:ml-0 max-[600px]:mt-[36px] max-[600px]:grid-cols-1">
              <p className="max-w-[400px] text-[11px] leading-[1.55] text-[rgba(17,17,17,.64)]">
                A Portfolio Management Service and an Alternative Investment Fund. What differs between them is structure, eligibility, and the kind of capital each is built to hold. The research behind both is the same.
              </p>
              <Image
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=90"
                alt="A portfolio review in progress"
                width={310}
                height={220}
                className="h-[184px] w-[310px] object-cover max-[600px]:h-[200px] max-[600px]:w-full"
              />
            </div>
            <div className="mt-[40px] ml-[20%] border-t border-t-[rgba(17,17,17,.13)] max-[900px]:ml-0">
              {offerings.map(([title, meta]) => (
                <a
                  href="#contact"
                  key={title}
                  className={`group grid min-h-[56px] grid-cols-[1fr_auto_34px] items-center gap-[24px] border-b border-b-[rgba(17,17,17,.13)] text-[13px] text-[rgba(17,17,17,.78)] no-underline transition-colors duration-200 ease-[ease] hover:text-[#111111] max-[600px]:grid-cols-[1fr_25px] max-[600px]:gap-x-[18px] max-[600px]:gap-y-[5px] max-[600px]:py-[18px] ${FOCUS}`}
                >
                  <span className="transition-transform duration-300 ease-[ease] group-hover:translate-x-[8px] max-[600px]:col-start-1 max-[600px]:row-start-1">
                    {title}
                  </span>
                  <small className="whitespace-nowrap text-[10px] tracking-[.02em] text-[rgba(17,17,17,.6)] max-[600px]:col-start-1 max-[600px]:row-start-2 max-[600px]:whitespace-normal">
                    {meta}
                  </small>
                  <i className={`h-[25px] w-[25px] bg-[#b8862f] text-[10px] text-white ${ARROW_TILE} max-[600px]:col-start-2 max-[600px]:row-[1/3] max-[600px]:self-center`}>
                    <ArrowRightUp size={14} aria-hidden="true" />
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

        <section
          id="risk"
          className={`relative min-h-[880px] overflow-hidden bg-white pt-[44px] pb-[40px] ${GUTTER} max-[900px]:min-h-0 max-[600px]:px-[22px] max-[600px]:pt-[52px] max-[600px]:pb-[44px]`}
        >
          <div className="absolute top-[28%] left-[48%] h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,134,47,.13)_0%,rgba(184,134,47,.05)_38%,transparent_70%)] blur-[4px]" />
          <p className="relative z-[2] max-w-[340px] text-[10px] leading-[1.5] text-[rgba(17,17,17,.6)]">
            Most firms discuss risk only once it has arrived. We set ours out while nothing is going wrong.
          </p>
          <RisingHeading
            className="relative z-[2] mt-[16px] text-center text-[clamp(4.4rem,7.6vw,8rem)] font-light leading-[.9] tracking-[-.065em] text-[#111111] max-[600px]:text-[3.6rem]"
            lines={[
              "How we",
              <>
                think about{" "}
                <span className="inline-block h-[82px] w-[170px] align-middle max-[600px]:h-[50px] max-[600px]:w-[100px]">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=330&q=85"
                    alt="A Moneybee portfolio manager"
                    width={170}
                    height={82}
                    className="h-full w-full object-cover"
                  />
                </span>
              </>,
              "risk",
            ]}
          />
          <div className="relative z-[2] mx-auto mt-[24px] grid max-w-[610px] grid-cols-[1fr_42px] items-center gap-[40px]">
            <p className="max-w-[440px] text-[11px] leading-[1.55] text-[rgba(17,17,17,.6)]">
              Every investment carries risk. Managing it is our responsibility, and this is how we go about it.
            </p>
            <i className="grid h-[42px] w-[42px] place-items-center bg-[#111111] not-italic text-white shadow-[0_0_28px_rgba(17,17,17,.18)]">
              <Shield size={22} aria-hidden="true" />
            </i>
          </div>
          <div className="relative z-[2] mt-[28px] border-t border-t-[rgba(17,17,17,.13)]">
            {riskPractices.map(([label, headline, copy], index) => (
              <motion.div
                key={label}
                {...reveal(index * 0.07)}
                className="grid min-h-[68px] grid-cols-[.55fr_.7fr_1fr] items-center gap-[40px] border-b border-b-[rgba(17,17,17,.13)] max-[600px]:grid-cols-[.5fr_.7fr] max-[600px]:gap-[16px] max-[600px]:py-[20px]"
              >
                <span className="text-[10px] text-[rgba(17,17,17,.6)]">{label}</span>
                <strong className="max-w-[20ch] text-[clamp(1.9rem,2.9vw,3.3rem)] font-normal leading-[.98] tracking-[-.035em]">{headline}</strong>
                <p className="max-w-[410px] text-[10px] leading-[1.45] text-[rgba(17,17,17,.6)] max-[600px]:col-start-2">{copy}</p>
              </motion.div>
            ))}
          </div>
          <div className="relative z-[2] mt-[28px] grid grid-cols-2 max-[600px]:grid-cols-1">
            <motion.article
              {...reveal()}
              className="grid min-h-[132px] grid-cols-[70px_1fr] items-center gap-[22px] bg-[#111111] p-[36px] text-white"
            >
              <i className="text-[42px] font-[200] not-italic"><Eye size={46} aria-hidden="true" /></i>
              <div>
                <h3 className="font-serif text-[23px] font-normal">Nothing hidden</h3>
                <p className="mt-[10px] max-w-[390px] text-[9px] leading-[1.5] text-white">
                  Holdings, changes, costs and mistakes are reported the same way in a weak quarter as in a strong one.
                </p>
              </div>
            </motion.article>
            <motion.article
              {...reveal(0.08)}
              className="grid min-h-[132px] grid-cols-[70px_1fr] items-center gap-[22px] bg-[#96692a] p-[36px] text-white"
            >
              <i className="text-[42px] font-[200] not-italic"><HandHeart size={46} aria-hidden="true" /></i>
              <div>
                <h3 className="font-serif text-[23px] font-normal">Capital held in trust</h3>
                <p className="mt-[10px] max-w-[390px] text-[9px] leading-[1.5] text-white">
                  A mandate belongs to the family that gave it to us. Every decision behind it stays open to question.
                </p>
              </div>
            </motion.article>
          </div>
        </section>

        {/* The desk, in three parts: what it believes, then what it publishes
            and how the figures behind that are produced. The chapter cards carry
            the content the standalone performance section used to hold. */}
        <div id="desk">
          <QuotePanel />
        </div>
        <div id="performance">
          <ChapterStack />
        </div>

        <InterviewCarousel />

        <section className="relative min-h-svh overflow-hidden">
          <SettlingImage className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2200&q=90"
              alt="Market data on a trading screen"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </SettlingImage>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,.93))]" />
          {/* The three pinned frames drop in from their own edges, so the collage
              assembles itself around the closing line rather than arriving whole. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -46 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: EASE_OUT }}
            className="absolute top-0 left-0 z-[2] h-[236px] w-[376px] max-[900px]:h-[140px] max-[900px]:w-[210px] max-[600px]:h-[100px] max-[600px]:w-[145px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85"
              alt="An analyst at work"
              width={520}
              height={300}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -46 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.12, ease: EASE_OUT }}
            className="absolute top-0 right-[11%] z-[2] h-[180px] w-[290px] max-[900px]:h-[140px] max-[900px]:w-[210px] max-[600px]:h-[100px] max-[600px]:w-[145px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=85"
              alt="A portfolio discussion"
              width={350}
              height={220}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 46 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.24, ease: EASE_OUT }}
            className="absolute right-0 bottom-0 z-[2] h-[268px] w-[506px] max-[900px]:h-[140px] max-[900px]:w-[210px] max-[600px]:h-[100px] max-[600px]:w-[145px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85"
              alt="The Moneybee office"
              width={650}
              height={360}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="relative z-[3] flex min-h-svh flex-col items-center justify-center text-center max-[600px]:px-[24px]">
            <RisingHeading
              lines={["Every meaningful investment", "relationship begins with", "a conversation"]}
              className="max-w-[1100px] font-serif text-[clamp(2.4rem,4vw,4.6rem)] font-normal leading-[1.02] max-[600px]:text-[2.4rem]"
            />
            <motion.span
              {...reveal(0.34)}
              className="mt-[20px] block max-w-[470px] text-[11px] leading-[1.5] text-[rgba(17,17,17,.66)]"
            >
              We would like to understand your objectives before discussing ours.
            </motion.span>
            <motion.div {...reveal(0.42)}>
              <CornerLink className="mt-[36px]">Schedule a conversation</CornerLink>
            </motion.div>
          </div>
        </section>

        <footer
          id="contact"
          className="mx-auto mb-[32px] min-h-[560px] w-[calc(100%_-_64px)] bg-[#f4f4f2] px-[54px] pt-[60px] pb-[30px] text-[#111111] max-[600px]:w-[calc(100%_-_24px)] max-[600px]:px-[24px] max-[600px]:pt-[42px] max-[600px]:pb-[20px]"
        >
          <div className="grid grid-cols-[1fr_auto_60px] items-start gap-[28px] pb-[56px] max-[600px]:grid-cols-[1fr_auto] max-[600px]:gap-[32px]">
            <Wordmark />
            <div className="text-right uppercase max-[600px]:col-[1/-1] max-[600px]:row-start-2 max-[600px]:text-left">
              <p className="text-[10px] font-[650] leading-[1.35]">“Small steps,<br />Big Outcomes.”</p>
              <small className="mt-[12px] block text-[8px] text-[rgba(17,17,17,.62)]">Moneybee</small>
            </div>
            <a
              href="#contact"
              aria-label="Schedule a conversation"
              className={`group grid h-[54px] w-[54px] justify-self-end place-items-center bg-[#111111] text-white no-underline transition-transform duration-200 ease-[ease] hover:translate-x-[2px] hover:-translate-y-[2px] max-[600px]:col-start-2 max-[600px]:row-start-1 ${FOCUS}`}
            >
              <ArrowRightUp size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="grid grid-cols-[1.3fr_repeat(4,1fr)] gap-[50px] pt-[48px] pb-[72px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-2 max-[600px]:gap-x-[20px] max-[600px]:gap-y-[42px]">
            <div>
              <span className="mb-[20px] block text-[8px] text-[rgba(17,17,17,.62)]">Our approach</span>
              <p className="mt-[8px] block text-[10px] leading-[1.5] text-[#111111]">Fundamental research.<br />Long-term ownership.</p>
            </div>
            <div>
              <span className="mb-[20px] block text-[8px] text-[rgba(17,17,17,.62)]">Office</span>
              <p className="mt-[8px] block text-[10px] leading-[1.5] text-[#111111]">Mumbai, Maharashtra<br />India</p>
            </div>
            {[
              ["Explore", [["Philosophy", "#philosophy"], ["What we do", "#what-we-do"], ["Investment desk", "#desk"], ["Managing risk", "#risk"], ["Performance", "#performance"]]],
              ["Regulatory", [["Investor Charter", "#contact"], ["Disclosure Document", "#contact"], ["Grievance redressal", "#contact"], ["SEBI SCORES", "#contact"]]],
              ["Investors", [["Investor login", "https://www.moneybee.in/register.php"], ["Speak with our team", "#contact"]]],
            ].map(([heading, links]) => (
              <div key={heading as string}>
                <span className="mb-[20px] block text-[8px] text-[rgba(17,17,17,.62)]">{heading as string}</span>
                {(links as string[][]).map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className={`mt-[8px] block text-[10px] leading-[1.5] text-[#111111] no-underline transition-colors duration-200 ease-[ease] hover:text-[#b8862f] ${FOCUS}`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-[50px] border-t border-t-[rgba(17,17,17,.14)] pt-[24px] max-[600px]:flex-col">
            <p className="max-w-[760px] text-[8px] leading-[1.5] text-[rgba(17,17,17,.62)]">
              Investments in securities are subject to market risk, including the loss of principal. Read all related documents carefully before investing. Registration with SEBI does not imply approval or endorsement of the portfolio manager by the Board. Past performance is not indicative of future results.
            </p>
            <div className="flex gap-[22px]">
              {[["Privacy", "#top"], ["Terms", "#top"], ["Back to top ↑", "#top"]].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className={`text-[8px] text-[#111111] no-underline transition-colors duration-200 ease-[ease] hover:text-[#b8862f] ${FOCUS}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </OverlayMenu>
  );
}
