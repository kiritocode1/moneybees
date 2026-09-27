"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import MumbaiClock from "@/components/footer/mumbai-clock";
import CornerBrackets from "@/components/hero/corner-brackets";
import { BUTTON, COLUMN, DashedRule, EYEBROW, HEADING, Rise, SUBHEAD } from "@/components/hero/editorial";
import { CARD_EMAIL, DESKS, ENTITIES, GENERAL_EMAIL, GRIEVANCE_STEPS, GROUP, lineHref, OFFICERS, PHONES, telHref } from "@/lib/contact";
import { CONTACT } from "@/lib/insights";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import OfficeFigure from "./office-figure";

/*
 * The /contact sections, in the homepage's editorial layout: the 1512px
 * column, serif headings, mono eyebrows, dashed rules and orange accents.
 * Facts come from lib/contact.ts.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7A11A]";
/** An inline contact link: turns orange and draws an orange underline on hover. */
const LINK = `bg-[linear-gradient(#F7A11A,#F7A11A)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-[2px] text-black no-underline transition-[background-size,color] duration-300 hover:bg-[length:100%_1px] hover:text-[#F7A11A] ${FOCUS}`;

/** The page opens on how to reach us, the office model to the right and the office's details at its foot. */
export function ContactHero() {
  return (
    <section aria-labelledby="contact-heading" className="relative isolate w-full overflow-hidden bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-[1fr_minmax(0,500px)] items-center gap-12 pt-[200px] pb-[64px] max-md:grid-cols-1 max-md:pt-[140px] max-md:pb-10`}>
        <div className="flex flex-col">
          <Rise>
            <h1 id="contact-heading" className={`${HEADING} text-[clamp(3rem,1.6rem+4.6vw,5.4rem)]`}>
              How to reach us
            </h1>
          </Rise>
          <Rise delay={0.08}>
            <p className={`${EYEBROW} mt-10 text-black/60 md:mt-16`}>Call or write to us at</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a href={`mailto:${GENERAL_EMAIL}`} className={`${BUTTON} bg-black text-white hover:bg-[#F7A11A] hover:text-black`}>
                {GENERAL_EMAIL}
              </a>
              <a href={telHref(PHONES[0])} className={`${BUTTON} border border-dashed border-black/15 text-black hover:bg-black/[.03]`}>
                {PHONES[0]}
                <CornerBrackets />
              </a>
            </div>
          </Rise>
        </div>
        <Rise delay={0.12}>
          <div className="mx-auto w-full max-w-[500px] max-md:max-w-[420px]">
            <OfficeFigure />
          </div>
        </Rise>
      </div>

      <div className={`${COLUMN} grid grid-cols-[1.4fr_1fr_1.2fr_.8fr] gap-x-10 gap-y-10 border-t border-dashed border-black/10 pt-[32px] pb-[72px] max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1`}>
        <address className="not-italic">
          <p className={`${EYEBROW} text-black/60`}>Office</p>
          <p className="mt-[12px] text-[16px] leading-[1.5] tracking-[-.015em]">
            {ENTITIES.map((entity) => (
              <b key={entity} className="block font-[550]">
                {entity}
              </b>
            ))}
            <span className="mt-[8px] block">{CONTACT.address[0]}</span>
            <span className="block">{CONTACT.address[1]}</span>
          </p>
        </address>
        <div>
          <p className={`${EYEBROW} text-black/60`}>Telephone</p>
          <ul className="mt-[12px] grid list-none gap-[6px] p-0 text-[16px] leading-[1.5] tabular-nums">
            {PHONES.map((phone) => (
              <li key={phone}>
                <a href={telHref(phone)} className={LINK}>
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={`${EYEBROW} text-black/60`}>Email</p>
          <ul className="mt-[12px] grid list-none gap-[6px] p-0 text-[16px] leading-[1.5]">
            {[GENERAL_EMAIL, CARD_EMAIL].map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className={LINK}>
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <MumbaiClock />
      </div>
    </section>
  );
}

/** Who to write to, one card per business, every line a mailto or tel link. */
export function DesksSection() {
  return (
    <section aria-labelledby="desks-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} py-[100px] max-md:py-[72px]`}>
        <Rise onView>
          <BracketLabel>Write to us</BracketLabel>
          <h2 id="desks-heading" className={`mt-[18px] ${SUBHEAD}`}>
            Who to write to
          </h2>
        </Rise>
        <div className="mt-[48px] grid grid-cols-2 gap-[24px] max-[900px]:grid-cols-1">
          {DESKS.map((desk, index) => (
            <Rise key={desk.id} onView delay={index * 0.08}>
              <article className="h-full border border-[rgba(0,0,0,.14)] p-[36px] transition-colors duration-300 hover:border-[#F7A11A] max-[600px]:p-[22px]">
                <p className={`${EYEBROW} text-black/60`}>{desk.business}</p>
                <h3 className="mt-[16px] font-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1.05] font-normal">{desk.name}</h3>
                <ul className="mt-[28px] list-none border-t border-t-black p-0">
                  {desk.lines.map((line) => (
                    <li key={line.value} className="border-b border-b-[rgba(0,0,0,.13)]">
                      <a
                        href={lineHref(line)}
                        className={`group grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-baseline gap-[16px] py-[16px] text-black no-underline transition-colors duration-300 hover:bg-[#F7A11A]/[.07] max-[600px]:grid-cols-1 max-[600px]:gap-[4px] ${FOCUS}`}
                      >
                        <span className={`${EYEBROW} flex items-center gap-[10px] text-black/60`}>
                          <span className="h-[6px] w-[6px] shrink-0 bg-black/20 transition-colors duration-300 group-hover:bg-[#F7A11A]" />
                          {line.label}
                        </span>
                        <span className="text-[16px] leading-[1.4] tracking-[-.01em] break-words transition-colors duration-300 group-hover:text-[#F7A11A] tabular-nums">
                          {line.value}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The PMS's Principal Officer and Compliance Officer, each with a direct line. */
export function OfficersSection() {
  return (
    <section aria-labelledby="officers-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-[.8fr_1.2fr] gap-12 py-[100px] max-[900px]:grid-cols-1 max-md:py-[72px]`}>
        <Rise onView>
          <BracketLabel>Officers</BracketLabel>
          <h2 id="officers-heading" className={`mt-[18px] ${SUBHEAD}`}>
            Portfolio Management Services
          </h2>
        </Rise>
        <dl className="grid grid-cols-2 border-t border-t-black max-[600px]:grid-cols-1">
          {OFFICERS.map((officer, index) => (
            <Rise key={officer.role} onView delay={index * 0.08}>
              <div className="border-b border-b-[rgba(0,0,0,.13)] py-[28px] pr-[24px]">
                <dt className={`${EYEBROW} text-black/60`}>{officer.role}</dt>
                <dd className="mt-[14px]">
                  <span className="block font-serif text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[1.05]">{officer.name}</span>
                  <a href={telHref(officer.phone)} className={`${LINK} mt-[14px] inline-block text-[16px] tabular-nums`}>
                    {officer.phone}
                  </a>
                </dd>
              </div>
            </Rise>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Where each step's card starts below the staircase, in px: each one a tread higher. */
const TREAD_TOP = ["md:mt-[150px]", "md:mt-[95px]", "md:mt-[40px]"] as const;
/**
 * The staircase in px down from the top of the 120px band and in % across it,
 * as the order it draws: tread, riser, tread, riser, tread. A riser grows up
 * from the lower tread. Nodes sit at the start of each tread.
 */
const SEGMENTS = [
  { left: 0, top: 110, width: 100 / 3, height: 0 },
  { left: 100 / 3, top: 60, width: 0, height: 50 },
  { left: 100 / 3, top: 60, width: 100 / 3, height: 0 },
  { left: 200 / 3, top: 10, width: 0, height: 50 },
  { left: 200 / 3, top: 10, width: 100 / 3, height: 0 },
] as const;
const NODES = [
  [0, 110],
  [100 / 3, 60],
  [200 / 3, 10],
] as const;
/** Seconds each staircase segment takes to draw. */
const SEGMENT_TIME = 0.32;

/**
 * The grievance path as a staircase: write to us, then SEBI SCORES, then
 * Smart ODR. The line draws in on view and each step rises onto its tread.
 * Under reduced motion it appears drawn.
 */
export function GrievanceSection() {
  const reduceMotion = useReducedMotion();
  // Watched on the unscaled container: a scale-0 line has no area to intersect.
  const pathRef = useRef<HTMLDivElement>(null);
  const inView = useInView(pathRef, { once: true, amount: 0.2 });
  const draw = { duration: reduceMotion ? 0 : 5 * SEGMENT_TIME, ease: EASE };
  return (
    <section aria-labelledby="grievance-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} py-[100px] max-md:py-[72px]`}>
        <Rise onView>
          <BracketLabel>Grievance redressal</BracketLabel>
          <h2 id="grievance-heading" className={`mt-[18px] ${SUBHEAD}`}>
            Investor grievance
          </h2>
        </Rise>

        <div ref={pathRef} className="relative mt-[56px]">
          {/* The staircase, desktop: five strokes drawn in turn, left to right. */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[120px] max-md:hidden">
            {SEGMENTS.map((segment, index) => {
              const tread = segment.height === 0;
              return (
                <motion.span
                  key={index}
                  className={`absolute bg-[#F7A11A] ${tread ? "h-[2px] origin-left" : "w-[2px] origin-bottom"}`}
                  style={{
                    left: `calc(${segment.left}% - 1px)`,
                    top: tread ? segment.top - 1 : segment.top,
                    ...(tread ? { width: `calc(${segment.width}% + 2px)` } : { height: segment.height }),
                  }}
                  initial={tread ? { scaleX: 0 } : { scaleY: 0 }}
                  animate={inView ? (tread ? { scaleX: 1 } : { scaleY: 1 }) : undefined}
                  transition={{ duration: reduceMotion ? 0 : SEGMENT_TIME, delay: reduceMotion ? 0 : index * SEGMENT_TIME, ease: "easeInOut" }}
                />
              );
            })}
            {NODES.map(([left, top], index) => (
              <motion.span
                key={left}
                className="absolute h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F7A11A] bg-white"
                style={{ left: `${left}%`, top }}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : undefined}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 2 * SEGMENT_TIME, ease: EASE }}
              />
            ))}
          </div>

          {/* Mobile: the same path as a line down the left edge. */}
          <motion.span
            aria-hidden="true"
            className="absolute top-[8px] bottom-[8px] left-[6px] w-[2px] origin-top bg-[#F7A11A] md:hidden"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : undefined}
            transition={draw}
          />

          <ol className="grid list-none grid-cols-3 items-start gap-[24px] p-0 max-md:grid-cols-1 max-md:gap-[40px] max-md:pl-[36px]">
            {GRIEVANCE_STEPS.map((step, index) => (
              <li key={step.title} className={`relative ${TREAD_TOP[index]}`}>
                <span aria-hidden="true" className="absolute top-[10px] -left-[36px] h-[14px] w-[14px] rounded-full border-2 border-[#F7A11A] bg-white md:hidden" />
                <Rise onView delay={index * 2 * SEGMENT_TIME}>
                  <span className="font-serif text-[clamp(2.4rem,3.4vw,3.4rem)] leading-none text-[#F7A11A] tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-[16px] font-serif text-[clamp(1.6rem,2.2vw,2rem)] leading-[1.1] font-normal">{step.title}</h3>
                  <p className="mt-[10px] max-w-[34ch] text-[16px] leading-[1.55] text-black/70">{step.text}</p>
                  <ul className="mt-[18px] grid list-none gap-[8px] p-0 text-[16px] leading-[1.4]">
                    {step.links.map((link) => (
                      <li key={link.href} className="flex flex-wrap items-baseline gap-x-[10px]">
                        {link.tag && <span className={`${EYEBROW} w-[3ch] text-black/60`}>{link.tag}</span>}
                        <a
                          href={link.href}
                          className={`${LINK} break-all`}
                          {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Rise>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** The group's other businesses, on black before the footer. */
export function GroupSection() {
  return (
    <section aria-labelledby="group-heading" className="bg-black text-white">
      <div className={`${COLUMN} grid grid-cols-[.8fr_1.2fr] items-start gap-12 py-[100px] max-[900px]:grid-cols-1 max-md:py-[72px]`}>
        <Rise onView>
          <h2 id="group-heading" className="font-serif text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[1.02] font-normal">
            The Moneybee group
          </h2>
        </Rise>
        <ul className="list-none border-t border-t-white/30 p-0">
          {GROUP.map(([business, domain, href], index) => (
            <li key={href} className="border-b border-b-white/15">
              <Rise onView delay={index * 0.08}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-wrap items-baseline justify-between gap-x-[24px] gap-y-[6px] py-[24px] max-[600px]:flex-col text-white no-underline ${FOCUS}`}
                >
                  <span className={`${EYEBROW} text-white/60`}>{business}</span>
                  <span className="flex items-center gap-[14px] font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none transition-colors duration-300 group-hover:text-[#F7A11A]">
                    {domain}
                    <span className="h-[2px] w-[18px] bg-[#F7A11A] transition-all duration-300 group-hover:w-[36px]" />
                  </span>
                </a>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
