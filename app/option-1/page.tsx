"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback } from "react";
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
import OverlayMenu, { type MenuLink } from "@/components/ui/overlay-menu";
import { EASE_OUT } from "@/lib/ease";

/* Shared utility strings. These are whole literal class names so Tailwind's
   source scanner still finds them; never build a class from a variable. */
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-[#f0b443] focus-visible:outline-offset-4";
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

/** What investors can expect, made specific enough to be noticed if it stopped. */
const commitments = [
  ["A named relationship manager", "One person who knows your mandate and is reachable directly."],
  ["A quarterly portfolio review", "Holdings, changes, and the reasoning behind each of them."],
  ["Monthly holdings commentary", "What we bought, what we sold, and what we deliberately left alone."],
  ["A direct line to the desk", "Questions about a position reach the people who took it."],
] as const;

/** How risk is handled, stated while nothing is going wrong. */
const riskPractices = [
  ["Downside", "Protect first", "Position sizing and cash levels are set so that a poor year stays survivable, not so that a good year looks better."],
  ["Concentration", "Know each holding", "We hold few enough businesses that any one of them can be explained from memory, without notes."],
  ["Turnover", "Trade rarely", "Low turnover keeps costs down and keeps more of the return once tax has been accounted for."],
] as const;

const PRIMARY_LINKS: MenuLink[] = [
  { label: "Home", href: "#top" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "What we do", href: "#what-we-do" },
  { label: "Performance", href: "#performance" },
  { label: "Contact", href: "#contact" },
];

const SECONDARY_LINKS: MenuLink[] = [
  { label: "From the investment desk", href: "#desk" },
  { label: "Managing risk", href: "#risk" },
  { label: "What to expect", href: "#expect" },
  { label: "Investor login", href: "https://www.moneybee.in/register.php" },
];

function Wordmark({ light = true, tagline = false }: { light?: boolean; tagline?: boolean }) {
  return (
    <div className="flex items-center gap-[12px]">
      <a
        href="#top"
        aria-label="Moneybee home"
        className={`inline-flex w-max items-center gap-[8px] text-[15px] font-[650] tracking-[-.04em] no-underline ${light ? "text-white" : "text-[#10285f]"} ${FOCUS}`}
      >
        Moneybee <span className="h-[7px] w-[7px] bg-[#d79a32]" />
      </a>
      {tagline && (
        <small className="text-[8px] font-medium uppercase text-[rgba(255,255,255,.55)]">
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
      className={`group inline-flex items-center gap-[10px] text-[11px] text-white no-underline ${FOCUS} ${className}`}
    >
      <i className={`h-[28px] w-[28px] bg-[#ba7b28] ${ARROW_TILE}`}>
        <ArrowRightUp size={16} aria-hidden="true" />
      </i>
      {children}
    </a>
  );
}

export default function Option1() {
  const reduceMotion = useReducedMotion();

  // React does not render the `muted` attribute into server markup, which can cost us
  // autoplay before hydration. Set it on the element directly, then start playback.
  const heroVideoRef = useCallback(
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

  return (
    <OverlayMenu
      brand={<Wordmark tagline />}
      primaryLinks={PRIMARY_LINKS}
      secondaryLinks={SECONDARY_LINKS}
    >
      <main id="top" className="option-one overflow-clip bg-[#0c2a72] text-[#f7f8ff]">
        <section className="relative flex min-h-svh flex-col overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2200&q=90"
            alt="Contemporary office interior"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_42%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,57,.9)_0%,rgba(7,32,88,.62)_52%,rgba(6,26,72,.72)_100%),linear-gradient(to_top,#0c2a72_0%,transparent_34%)]" />

          <div className="relative z-[2] mx-auto w-[min(100%_-_64px,1480px)] pt-[190px] max-[900px]:w-[calc(100%_-_36px)] max-[900px]:pt-[120px] max-[600px]:pt-[110px]">
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.9, ease: EASE_OUT }}
              className="max-w-[850px] font-serif text-[clamp(4.5rem,7vw,7.4rem)] font-normal leading-[.94] tracking-[-.045em] max-[900px]:text-[clamp(3.5rem,11vw,6rem)] max-[600px]:text-[3.7rem]"
            >
              Build, preserve, and<br />grow your wealth
            </motion.h1>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.24, ease: EASE_OUT }}
              className="mt-[66px] grid w-[440px] grid-cols-[94px_1fr] items-center gap-[22px] max-[600px]:w-full max-[600px]:grid-cols-[80px_1fr]"
            >
              <video
                ref={heroVideoRef}
                src="/video/research-desk.mp4"
                poster="/video/research-desk.jpg"
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="A printed holdings statement being read and marked by hand"
                className="h-[68px] w-[94px] bg-[#0a1f4f] object-cover max-[600px]:h-[58px] max-[600px]:w-[80px]"
              />
              <p className="text-[12px] leading-[1.45] text-[rgba(255,255,255,.72)]">
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
            className="relative z-[2] mx-auto mt-auto flex w-[min(100%_-_64px,1480px)] flex-wrap items-end gap-x-[64px] gap-y-[22px] border-t border-t-[rgba(255,255,255,.18)] pt-[26px] pb-[46px] max-[900px]:w-[calc(100%_-_36px)] max-[900px]:gap-x-[40px] max-[600px]:gap-x-[32px] max-[600px]:gap-y-[18px] max-[600px]:pb-[30px]"
          >
            {[
              ["Portfolio Management Service", "SEBI-registered portfolio manager"],
              ["Alternative Investment Fund", "SEBI-registered fund"],
              ["Moneybee Securities Pvt Ltd", "Mumbai, Maharashtra, India"],
            ].map(([title, detail]) => (
              <span key={title} className="grid gap-[5px]">
                <b className="text-[12px] font-[550] tracking-[-.01em] text-[rgba(255,255,255,.92)]">{title}</b>
                <small className="text-[9px] uppercase tracking-[.06em] text-[rgba(255,255,255,.55)]">{detail}</small>
              </span>
            ))}
            <CornerLink href="#philosophy" className="ml-auto">
              Scroll to explore
            </CornerLink>
          </motion.div>
        </section>

        <section
          id="philosophy"
          className="relative flex min-h-[720px] flex-col items-center justify-center overflow-hidden bg-[#0c2a72] px-[28px] py-[104px] max-[600px]:min-h-[500px] max-[600px]:py-[76px]"
        >
          <div className="absolute top-[40%] left-[55%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(17,83,213,.56)_0%,rgba(15,67,175,.2)_35%,transparent_70%)] blur-[4px]" />
          <motion.div
            {...reveal()}
            className="relative z-[1] w-[min(100%,1160px)] text-[clamp(4rem,7.3vw,7.8rem)] font-light leading-[.92] tracking-[-.06em] text-[rgba(247,248,255,.84)] max-[600px]:text-[3.25rem]"
          >
            <span className="block">Finding value</span>
            <div className="flex items-center justify-end gap-[24px] max-[600px]:justify-start max-[600px]:gap-[12px]">
              <Image
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=360&q=85"
                alt="The Moneybee research team at work"
                width={150}
                height={82}
                className="h-[82px] w-[150px] object-cover max-[900px]:h-[58px] max-[900px]:w-[100px] max-[600px]:h-[44px] max-[600px]:w-[75px]"
              />
              <span>where the market</span>
            </div>
            <span className="block ml-[27%] max-[600px]:ml-[12%]">is not looking</span>
          </motion.div>
          <motion.p
            {...reveal(0.1)}
            className="relative z-[1] mt-[46px] ml-[18%] max-w-[540px] text-[12px] leading-[1.55] text-[rgba(255,255,255,.5)] max-[600px]:ml-[12%]"
          >
            Most portfolios are built from the same few hundred widely covered names. We work further down the market, among small and ultra-small businesses where fewer analysts look and where price and value drift furthest apart.
          </motion.p>
        </section>

        <section
          id="principles"
          aria-label="Investment principles"
          className="grid min-h-[840px] grid-cols-4 border-y border-y-[rgba(255,255,255,.16)] bg-[linear-gradient(180deg,#123b93_0%,#0c2a72_100%)] max-[900px]:min-h-0 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1"
        >
          {principles.map(([Icon, title, copy], index) => (
            <motion.article
              key={title}
              {...reveal(index * 0.08)}
              className="group flex min-h-[840px] flex-col border-r border-r-[rgba(255,255,255,.16)] px-[38px] pt-[30px] pb-[56px] last:border-r-0 max-[900px]:min-h-[390px] max-[600px]:min-h-[340px] max-[600px]:border-r-0 max-[600px]:border-b max-[600px]:border-b-[rgba(255,255,255,.16)]"
            >
              <span className="text-[9px] text-[rgba(255,255,255,.35)]">0{index + 1}</span>
              <i className="mt-[34px] grid h-[42px] w-[42px] place-items-center rounded-full border border-[rgba(126,178,255,.5)] text-[19px] not-italic text-[#78aaff] transition-colors duration-300 ease-[ease] group-hover:border-[rgba(126,178,255,.95)] group-hover:text-[#a9c9ff]">
                <Icon size={27} aria-hidden="true" />
              </i>
              <div className="mt-auto text-center">
                <h2 className="font-serif text-[24px] font-normal">{title}</h2>
                <p className="mx-auto mt-[16px] max-w-[230px] text-[10px] leading-[1.5] text-[rgba(255,255,255,.46)]">{copy}</p>
              </div>
            </motion.article>
          ))}
        </section>

        <section id="desk" className="relative min-h-[740px] overflow-hidden max-[600px]:min-h-[570px]">
          <Image
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=90"
            alt="The Moneybee office in Mumbai"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,50,.78),rgba(5,23,63,.22)_58%,rgba(7,32,83,.72)),linear-gradient(to_top,rgba(8,31,87,.92),transparent_48%)]" />
          <motion.div
            {...reveal()}
            className="absolute right-0 bottom-[108px] left-0 z-[2] mx-auto grid w-[min(100%_-_64px,1480px)] grid-cols-[1.5fr_.7fr_auto] items-end gap-[48px] max-[900px]:w-[calc(100%_-_36px)] max-[900px]:grid-cols-1"
          >
            <h2 className="font-serif text-[clamp(3.2rem,5.2vw,5.6rem)] font-normal leading-[.94] max-[600px]:text-[2.9rem]">
              From the<br />investment desk
            </h2>
            <p className="max-w-[340px] text-[11px] leading-[1.5] text-[rgba(255,255,255,.7)]">
              The clearest evidence of how a manager thinks is what they publish when they are not selling anything.
            </p>
            <CornerLink href="#desk">Read the latest letter</CornerLink>
          </motion.div>
          <div className="absolute right-[32px] bottom-[22px] left-[32px] z-[2] grid grid-cols-3 gap-[24px] text-[9px] text-[rgba(255,255,255,.56)]">
            {[
              ["Quarterly", "Letter to investors"],
              ["Sector note", "Small and ultra-small caps"],
              ["Commentary", "What we own and why"],
            ].map(([label, title]) => (
              <span
                key={label}
                className="flex justify-between gap-[20px] border-b border-b-[rgba(195,143,68,.5)] pb-[14px] uppercase transition-colors duration-300 ease-[ease] hover:border-b-[rgba(195,143,68,.95)]"
              >
                <small className="text-[9px] text-[rgba(255,255,255,.78)]">{label}</small>
                {title}
              </span>
            ))}
          </div>
        </section>

        <section
          id="what-we-do"
          className={`relative grid min-h-[880px] grid-cols-[.32fr_1fr] gap-[50px] overflow-hidden bg-[#0c2a72] py-[68px] ${GUTTER} max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[600px]:px-[22px] max-[600px]:py-[60px]`}
        >
          <div className="absolute top-[27%] left-[61%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(17,83,213,.56)_0%,rgba(15,67,175,.2)_35%,transparent_70%)] blur-[4px]" />
          <p className="relative z-[2] max-w-[210px] text-[10px] leading-[1.5] text-[rgba(255,255,255,.48)] max-[900px]:mb-[20px]">
            A PMS holds securities in your own name. An AIF pools capital under a single strategy.
          </p>
          <div className="relative z-[2]">
            <motion.h2
              {...reveal()}
              className="max-w-[900px] text-center text-[clamp(4.5rem,7vw,7.5rem)] font-light leading-[.91] tracking-[-.06em] text-[rgba(255,255,255,.82)] max-[600px]:text-[3.7rem]"
            >
              Two products.<br />One research<br />process.
            </motion.h2>
            <div className="mt-[40px] ml-[20%] grid grid-cols-[1fr_310px] items-end gap-[60px] max-[900px]:ml-0 max-[600px]:mt-[36px] max-[600px]:grid-cols-1">
              <p className="max-w-[400px] text-[11px] leading-[1.55] text-[rgba(255,255,255,.5)]">
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
            <div className="mt-[40px] ml-[20%] border-t border-t-[rgba(255,255,255,.16)] max-[900px]:ml-0">
              {offerings.map(([title, meta]) => (
                <a
                  href="#contact"
                  key={title}
                  className={`group grid min-h-[56px] grid-cols-[1fr_auto_34px] items-center gap-[24px] border-b border-b-[rgba(255,255,255,.16)] text-[13px] text-[rgba(255,255,255,.76)] no-underline transition-colors duration-200 ease-[ease] hover:text-white max-[600px]:grid-cols-[1fr_25px] max-[600px]:gap-x-[18px] max-[600px]:gap-y-[5px] max-[600px]:py-[18px] ${FOCUS}`}
                >
                  <span className="max-[600px]:col-start-1 max-[600px]:row-start-1">{title}</span>
                  <small className="whitespace-nowrap text-[10px] tracking-[.02em] text-[rgba(255,255,255,.46)] max-[600px]:col-start-1 max-[600px]:row-start-2 max-[600px]:whitespace-normal">
                    {meta}
                  </small>
                  <i className={`h-[25px] w-[25px] bg-[#b67627] text-[10px] ${ARROW_TILE} max-[600px]:col-start-2 max-[600px]:row-[1/3] max-[600px]:self-center`}>
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

        <section id="expect" className="grid min-h-[740px] grid-cols-2 bg-[#eef1fb] text-[#173064] max-[900px]:grid-cols-1">
          <div className="px-[max(44px,calc((100vw_-_1480px)/2))] py-[64px] max-[600px]:px-[24px] max-[600px]:py-[52px]">
            <motion.h2
              {...reveal()}
              className="max-w-[610px] font-serif text-[clamp(2rem,3.3vw,3.8rem)] font-normal leading-[1.03]"
            >
              Everything we commit to is specific enough that you would notice if we stopped.
            </motion.h2>
            <a
              href="#contact"
              className={`group mt-[26px] inline-flex gap-[22px] text-[10px] text-[#2e58a2] no-underline transition-colors duration-200 ease-[ease] hover:text-[#123d86] ${FOCUS}`}
            >
              Speak with our team
              <ArrowRightUp
                size={14}
                aria-hidden="true"
                className="transition-transform duration-200 ease-[ease] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
              />
            </a>
            <dl className="mt-[64px] grid grid-cols-2 gap-x-[48px] gap-y-[36px] max-[600px]:mt-[48px] max-[600px]:gap-x-[20px] max-[600px]:gap-y-[28px]">
              {commitments.map(([term, detail], index) => (
                <motion.div key={term} {...reveal(index * 0.06)}>
                  <dt className="text-[17px] font-[550]">{term}</dt>
                  <dd className="mt-[9px] max-w-[190px] text-[9px] leading-[1.45] text-[#6c7897]">{detail}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
          <div className="relative min-h-[740px] max-[900px]:min-h-[480px]">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1500&q=90"
              alt="Advisers reviewing a client portfolio"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </section>

        <section
          id="risk"
          className={`relative min-h-[880px] overflow-hidden bg-[#0c2a72] pt-[44px] pb-[40px] ${GUTTER} max-[900px]:min-h-0 max-[600px]:px-[22px] max-[600px]:pt-[52px] max-[600px]:pb-[44px]`}
        >
          <div className="absolute top-[28%] left-[48%] h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(17,83,213,.56)_0%,rgba(15,67,175,.2)_35%,transparent_70%)] blur-[4px]" />
          <p className="relative z-[2] max-w-[340px] text-[10px] leading-[1.5] text-[rgba(255,255,255,.45)]">
            Most firms discuss risk only once it has arrived. We set ours out while nothing is going wrong.
          </p>
          <motion.h2
            {...reveal()}
            className="relative z-[2] mt-[16px] text-center text-[clamp(4.4rem,7.6vw,8rem)] font-light leading-[.9] tracking-[-.065em] text-[rgba(255,255,255,.82)] max-[600px]:text-[3.6rem]"
          >
            How we<br />think about{" "}
            <span className="inline-block h-[82px] w-[170px] align-middle max-[600px]:h-[50px] max-[600px]:w-[100px]">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=330&q=85"
                alt="A Moneybee portfolio manager"
                width={170}
                height={82}
                className="h-full w-full object-cover"
              />
            </span>
            <br />risk
          </motion.h2>
          <div className="relative z-[2] mx-auto mt-[24px] grid max-w-[610px] grid-cols-[1fr_42px] items-center gap-[40px]">
            <p className="max-w-[440px] text-[11px] leading-[1.55] text-[rgba(255,255,255,.46)]">
              Every investment carries risk. Managing it is our responsibility, and this is how we go about it.
            </p>
            <i className="grid h-[42px] w-[42px] place-items-center bg-[#145de6] not-italic text-[#9fc0ff] shadow-[0_0_35px_rgba(20,93,230,.65)]">
              <Shield size={22} aria-hidden="true" />
            </i>
          </div>
          <div className="relative z-[2] mt-[28px] border-t border-t-[rgba(255,255,255,.16)]">
            {riskPractices.map(([label, headline, copy], index) => (
              <motion.div
                key={label}
                {...reveal(index * 0.07)}
                className="grid min-h-[68px] grid-cols-[.55fr_.7fr_1fr] items-center gap-[40px] border-b border-b-[rgba(255,255,255,.16)] max-[600px]:grid-cols-[.5fr_.7fr] max-[600px]:gap-[16px] max-[600px]:py-[20px]"
              >
                <span className="text-[10px] text-[rgba(255,255,255,.45)]">{label}</span>
                <strong className="max-w-[20ch] text-[clamp(1.9rem,2.9vw,3.3rem)] font-normal leading-[.98] tracking-[-.035em]">{headline}</strong>
                <p className="max-w-[410px] text-[10px] leading-[1.45] text-[rgba(255,255,255,.45)] max-[600px]:col-start-2">{copy}</p>
              </motion.div>
            ))}
          </div>
          <div className="relative z-[2] mt-[28px] grid grid-cols-2 max-[600px]:grid-cols-1">
            <motion.article
              {...reveal()}
              className="grid min-h-[132px] grid-cols-[70px_1fr] items-center gap-[22px] bg-[#0f5fe5] p-[36px]"
            >
              <i className="text-[42px] font-[200] not-italic"><Eye size={46} aria-hidden="true" /></i>
              <div>
                <h3 className="font-serif text-[23px] font-normal">Nothing hidden</h3>
                <p className="mt-[10px] max-w-[390px] text-[9px] leading-[1.5] text-[rgba(255,255,255,.54)]">
                  Holdings, changes, costs and mistakes are reported the same way in a weak quarter as in a strong one.
                </p>
              </div>
            </motion.article>
            <motion.article
              {...reveal(0.08)}
              className="grid min-h-[132px] grid-cols-[70px_1fr] items-center gap-[22px] bg-[#98652f] p-[36px]"
            >
              <i className="text-[42px] font-[200] not-italic"><HandHeart size={46} aria-hidden="true" /></i>
              <div>
                <h3 className="font-serif text-[23px] font-normal">Capital held in trust</h3>
                <p className="mt-[10px] max-w-[390px] text-[9px] leading-[1.5] text-[rgba(255,255,255,.54)]">
                  A mandate belongs to the family that gave it to us. Every decision behind it stays open to question.
                </p>
              </div>
            </motion.article>
          </div>
        </section>

        <section
          id="performance"
          className={`relative min-h-[900px] overflow-hidden bg-[#0c2a72] pt-[104px] pb-[72px] ${GUTTER} max-[900px]:min-h-0 max-[600px]:px-[20px] max-[600px]:pt-[72px] max-[600px]:pb-[52px]`}
        >
          <div className="absolute top-[30px] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full border border-[rgba(70,128,255,.12)] shadow-[inset_0_0_80px_rgba(28,87,217,.12),0_0_70px_rgba(28,87,217,.1)] before:absolute before:inset-[13%] before:rounded-full before:border before:border-[rgba(70,128,255,.14)] before:content-[''] after:absolute after:inset-[30%] after:rounded-full after:border after:border-[rgba(70,128,255,.14)] after:shadow-[0_0_90px_rgba(29,87,220,.35)] after:content-['']" />
          <motion.h2
            {...reveal()}
            className="relative z-[2] text-center text-[clamp(4rem,6.5vw,7rem)] font-light leading-none tracking-[-.055em] text-[rgba(255,255,255,.7)] max-[600px]:text-[3.6rem]"
          >
            Returns matter.<br />So does the path.
          </motion.h2>
          <div className="relative z-[2] mt-[72px] grid grid-cols-2 gap-[24px] max-[900px]:mt-[56px] max-[600px]:mt-[48px] max-[600px]:grid-cols-1">
            <motion.article {...reveal()} className="flex min-h-[452px] flex-col bg-[#dce3f7] p-[36px] text-[#173064]">
              <div className="grid grid-cols-[1fr_auto] items-center gap-[20px] text-[9px]">
                <span>How performance is measured</span>
                <small className="text-[8px] text-[#7785aa]">Methodology</small>
              </div>
              <blockquote className="mt-auto max-w-[580px] font-serif text-[clamp(1.5rem,2.4vw,2.6rem)] leading-[1.04]">
                Time-weighted returns, measured against the benchmark, net of every fee.
              </blockquote>
              <p className="mt-[34px] text-[8px] text-[#7785aa]">Rolling returns and drawdowns, never a single headline number</p>
            </motion.article>
            <motion.article {...reveal(0.08)} className="flex min-h-[452px] flex-col bg-[#dce3f7] p-[36px] text-[#173064]">
              <div className="grid grid-cols-[1fr_auto] items-center gap-[20px] text-[9px]">
                <span>Where the figures live</span>
                <small className="text-[8px] text-[#7785aa]">Reviewed before publication</small>
              </div>
              <blockquote className="mt-auto max-w-[620px] font-sans text-[18px] font-[550] leading-[1.25]">
                Performance is published in the Disclosure Document and the monthly factsheet, after review by our compliance officer. Every figure carries the method used to calculate it and the benchmark it is measured against.
              </blockquote>
              <p className="mt-[34px] text-[9px] uppercase leading-[1.55] text-[#173064]">
                Moneybee Securities Pvt Ltd<br />Mumbai, Maharashtra, India
              </p>
            </motion.article>
          </div>
        </section>

        <section className="relative min-h-svh overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2200&q=90"
            alt="Market data on a trading screen"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(5,26,75,.72),rgba(7,34,91,.88))]" />
          <Image
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85"
            alt="An analyst at work"
            width={520}
            height={300}
            className="absolute top-0 left-0 z-[2] h-[236px] w-[376px] object-cover max-[900px]:h-[140px] max-[900px]:w-[210px] max-[600px]:h-[100px] max-[600px]:w-[145px]"
          />
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=85"
            alt="A portfolio discussion"
            width={350}
            height={220}
            className="absolute top-0 right-[11%] z-[2] h-[180px] w-[290px] object-cover max-[900px]:h-[140px] max-[900px]:w-[210px] max-[600px]:h-[100px] max-[600px]:w-[145px]"
          />
          <Image
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85"
            alt="The Moneybee office"
            width={650}
            height={360}
            className="absolute right-0 bottom-0 z-[2] h-[268px] w-[506px] object-cover max-[900px]:h-[140px] max-[900px]:w-[210px] max-[600px]:h-[100px] max-[600px]:w-[145px]"
          />
          <div className="relative z-[3] flex min-h-svh flex-col items-center justify-center text-center max-[600px]:px-[24px]">
            <motion.h2
              {...reveal()}
              className="max-w-[1100px] font-serif text-[clamp(2.4rem,4vw,4.6rem)] font-normal leading-[1.02] max-[600px]:text-[2.4rem]"
            >
              Every meaningful investment<br />relationship begins with<br />a conversation
            </motion.h2>
            <span className="mt-[20px] max-w-[470px] text-[11px] leading-[1.5] text-[rgba(255,255,255,.74)]">
              We would like to understand your objectives before discussing ours.
            </span>
            <CornerLink className="mt-[36px]">Schedule a conversation</CornerLink>
          </div>
        </section>

        <footer
          id="contact"
          className="mx-auto mb-[32px] min-h-[560px] w-[calc(100%_-_64px)] bg-[#eef1fb] px-[54px] pt-[60px] pb-[30px] text-[#173064] max-[600px]:w-[calc(100%_-_24px)] max-[600px]:px-[24px] max-[600px]:pt-[42px] max-[600px]:pb-[20px]"
        >
          <div className="grid grid-cols-[1fr_auto_60px] items-start gap-[28px] pb-[56px] max-[600px]:grid-cols-[1fr_auto] max-[600px]:gap-[32px]">
            <Wordmark light={false} />
            <div className="text-right uppercase max-[600px]:col-[1/-1] max-[600px]:row-start-2 max-[600px]:text-left">
              <p className="text-[10px] font-[650] leading-[1.35]">“Small steps,<br />Big Outcomes.”</p>
              <small className="mt-[12px] block text-[8px] text-[#6b789c]">Moneybee</small>
            </div>
            <a
              href="#contact"
              aria-label="Schedule a conversation"
              className={`group grid h-[54px] w-[54px] justify-self-end place-items-center bg-[#155bec] text-white no-underline transition-transform duration-200 ease-[ease] hover:translate-x-[2px] hover:-translate-y-[2px] max-[600px]:col-start-2 max-[600px]:row-start-1 ${FOCUS}`}
            >
              <ArrowRightUp size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="grid grid-cols-[1.3fr_repeat(4,1fr)] gap-[50px] pt-[48px] pb-[72px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-2 max-[600px]:gap-x-[20px] max-[600px]:gap-y-[42px]">
            <div>
              <span className="mb-[20px] block text-[8px] text-[#8b96b4]">Our approach</span>
              <p className="mt-[8px] block text-[10px] leading-[1.5] text-[#173064]">Fundamental research.<br />Long-term ownership.</p>
            </div>
            <div>
              <span className="mb-[20px] block text-[8px] text-[#8b96b4]">Office</span>
              <p className="mt-[8px] block text-[10px] leading-[1.5] text-[#173064]">Mumbai, Maharashtra<br />India</p>
            </div>
            {[
              ["Explore", [["Philosophy", "#philosophy"], ["What we do", "#what-we-do"], ["Investment desk", "#desk"], ["Managing risk", "#risk"], ["Performance", "#performance"]]],
              ["Regulatory", [["Investor Charter", "#contact"], ["Disclosure Document", "#contact"], ["Grievance redressal", "#contact"], ["SEBI SCORES", "#contact"]]],
              ["Investors", [["Investor login", "https://www.moneybee.in/register.php"], ["Speak with our team", "#contact"]]],
            ].map(([heading, links]) => (
              <div key={heading as string}>
                <span className="mb-[20px] block text-[8px] text-[#8b96b4]">{heading as string}</span>
                {(links as string[][]).map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className={`mt-[8px] block text-[10px] leading-[1.5] text-[#173064] no-underline transition-colors duration-200 ease-[ease] hover:text-[#155bec] ${FOCUS}`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-[50px] border-t border-t-[#c8d0e5] pt-[24px] max-[600px]:flex-col">
            <p className="max-w-[760px] text-[8px] leading-[1.5] text-[#7c88a6]">
              Investments in securities are subject to market risk, including the loss of principal. Read all related documents carefully before investing. Registration with SEBI does not imply approval or endorsement of the portfolio manager by the Board. Past performance is not indicative of future results.
            </p>
            <div className="flex gap-[22px]">
              {[["Privacy", "#top"], ["Terms", "#top"], ["Back to top ↑", "#top"]].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className={`text-[8px] text-[#173064] no-underline transition-colors duration-200 ease-[ease] hover:text-[#155bec] ${FOCUS}`}
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
