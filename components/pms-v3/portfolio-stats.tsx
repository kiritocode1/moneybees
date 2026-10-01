"use client";

import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useInView } from "motion/react";
import { type CSSProperties, Fragment, type Ref, useEffect, useId, useRef } from "react";
import { COLUMN } from "@/components/hero/tokens";
import { PORTFOLIO_APPROACH } from "@/lib/pms-v2";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * Portfolio Approach as Titan Gate's "Access That Speaks for Itself" band
 * (reference/titangate/NOTES.md §5): a dashed guideline into and out of the
 * centred heading, the sector cap in a ring of ticks, the portfolio size over
 * three thin circles, then the remaining three rules sliding in from
 * alternate sides. Timings are read from vercel-app.custom.pretty.js L764–984.
 */

const ORANGE = "#F6A11A";
const MONO = "font-[family-name:var(--font-geist-mono)]";

/** The docx lines, by position in PORTFOLIO_APPROACH. */
const [CONCENTRATED, HORIZON, SECTOR, MONITORING, REBALANCING] = PORTFOLIO_APPROACH;

/** The sector cap the ring draws, from "Maximum sector allocation of 30%." */
const SECTOR_CAP = 30;

/*
 * The ring: Titan Gate's circle (r 252 in a 514 box, stroke 10), cut into 100
 * ticks instead of their 132 so one tick is one percent. Each tick sits in the
 * middle of its percent, so the lit arc ends in a gap, never across a tick.
 */
const R = 252;
const CIRCUMFERENCE = 2 * Math.PI * R;
const PERIOD = CIRCUMFERENCE / 100;
const TICK = 2;
const TICK_DASH = `${TICK} ${(PERIOD - TICK).toFixed(4)}`;
const TICK_OFFSET = (TICK / 2 - PERIOD / 2).toFixed(4);
const ARC = (CIRCUMFERENCE * SECTOR_CAP) / 100;

/** Their ScrambleText settings for every number. */
const SCRAMBLE = { chars: "0123456789", revealDelay: 0.25, speed: 0.8 } as const;
const SCRAMBLE_SIGN = { chars: "&=$?", revealDelay: 0.25, speed: 0.8 } as const;
/** `expoScale(…)` is not bundled on their site, so what renders is power1.out (NOTES §3.5). */
const EASE = "power1.out";

/** Their keyframes (vercel-main.css), with orange where they flash lavender. */
const STYLES = `
@keyframes pv3-blink{0%{opacity:1}20%{opacity:.3}35%{opacity:.85}55%{opacity:.2}70%{opacity:1}to{opacity:1}}
@keyframes pv3-char{0%{opacity:1}1%{color:${ORANGE};opacity:1}15%{opacity:.2}30%{opacity:.8}40%{color:${ORANGE};opacity:1}55%{opacity:1}70%{color:inherit;opacity:.7}85%{opacity:1}to{opacity:1}}
@keyframes pv3-flash{0%{color:#fff}11.25%{color:${ORANGE}}16.875%{color:#fff}37.5%,to{color:rgba(255,255,255,.32)}}
@keyframes pv3-crawl{to{stroke-dashoffset:-4px}}
@keyframes pv3-glint{from{background-position:0 200%}to{background-position:0 0}}
@keyframes pv3-slide{from{transform:translateX(var(--from));opacity:0}40%{opacity:1}to{transform:none;opacity:1}}
.pv3-flash{color:rgba(255,255,255,.32)}
.pv3-guide{background:linear-gradient(to bottom,transparent 20%,rgba(255,255,255,.45),transparent 80%) 0 0/100% 200%}
@media (prefers-reduced-motion:no-preference){
.pv3-guide{animation:pv3-crawl .45s linear infinite,pv3-glint 2.25s linear infinite;animation-delay:var(--delay)}
[data-flicker][data-on] .pv3-w{animation:pv3-blink .26s cubic-bezier(.215,.61,.355,1) both;animation-delay:calc(var(--word)*39ms + .175s)}
[data-flicker][data-on] .pv3-c{animation:pv3-char .32s cubic-bezier(.215,.61,.355,1) both;animation-delay:calc(var(--char)*28ms + .125s)}
[data-flash-on] .pv3-flash{animation:pv3-flash 3.2s linear infinite;animation-delay:var(--delay)}
[data-played] > .pv3-wrap{animation:pv3-blink .26s cubic-bezier(.215,.61,.355,1) both;animation-delay:var(--blink)}
@supports (animation-timeline:view()){
.pv3-slide{animation:pv3-slide cubic-bezier(.215,.61,.355,1) both;animation-duration:auto;animation-timeline:view();animation-range:cover 0 cover 60vh}
}
}
`;

/** Titan Gate's `.svg-guideline`: a 1px dashed line whose dashes crawl down while a light band slides over it; its last 30% fades into the band. */
function Guideline({ height, delay, className = "" }: { height: number; delay: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`relative w-px text-white/35 ${className}`} style={{ height }}>
      <svg viewBox={`0 0 1 ${height}`} width="1" height={height} fill="none" className="pv3-guide block h-full" style={{ "--delay": `${delay}s` } as CSSProperties}>
        <path d={`M.5 0v${height}`} stroke="currentColor" strokeDasharray="2 2" />
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_70%,#000)]" />
    </div>
  );
}

/** Their `data-text-fade-in` heading: words blink and characters flash orange once it scrolls in. */
function FlickerHeading({ id, text }: { id: string; text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const on = useInView(ref, { once: true, margin: "0px 0px -7.5% 0px" });
  const words = text.split(" ");
  const starts = words.map((_, index) => words.slice(0, index).join("").length);
  return (
    <h2
      ref={ref}
      id={id}
      data-flicker=""
      data-on={on ? "" : undefined}
      className="mx-auto max-w-[28rem] text-center font-serif text-[clamp(2.75rem,1.6rem+2.9vw,3.8rem)] leading-[.95] font-normal tracking-[-.02em] text-white"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={w}>
            {w > 0 && " "}
            <span className="pv3-w inline-block" style={{ "--word": w } as CSSProperties}>
              {[...word].map((char, c) => (
                <span key={c} className="pv3-c" style={{ "--char": starts[w] + c } as CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </h2>
  );
}

/** A figure's reveal: starts once its top passes 75% of the viewport, as their ScrollTrigger does. */
function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  return { ref, shown };
}

/** The display numerals both figures share: Instrument Serif at their 14vw, 20vw on a phone. */
const NUMBER = "relative z-[1] font-serif text-[min(14vw,212px)] leading-none font-normal tracking-[-.01em] whitespace-nowrap text-white tabular-nums max-md:text-[20vw]";

/** The caption under each figure. */
const CAPTION = `${MONO} max-w-[20rem] pt-6 text-center text-[15px] leading-[1.5] text-white/80`;

/** Micro-paragraph word order for the flash, and when each starts, so one word lights every .4s. */
const FLASH_DELAYS = [0.8, 0, 1.6, 0.4, 1.2];

/**
 * Left: the sector cap. 100 dim ticks, and the orange ones sweep clockwise
 * from 12 o'clock under a mask that stops at SECTOR_CAP percent of the ring.
 */
function SectorRing() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const reduce = useReducedMotion();
  const paragraph = useRef<HTMLParagraphElement>(null);
  const flashing = useInView(paragraph);
  const maskRef = useRef<SVGCircleElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const signRef = useRef<HTMLSpanElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const mask = useId();

  // The rendered HTML is the final state; with motion allowed, it is reset here and played on reveal.
  useEffect(() => {
    const arc = maskRef.current;
    const number = numberRef.current;
    const sign = signRef.current;
    if (reduce || !arc || !number || !sign) return;
    gsap.registerPlugin(ScrambleTextPlugin);
    number.textContent = "0";
    const context = gsap.context(() => {
      timeline.current = gsap
        .timeline({ paused: true })
        .fromTo(arc, { strokeDashoffset: ARC }, { strokeDashoffset: 0, duration: 1.65, ease: EASE }, 0.1)
        .to(sign, { duration: 0.75, scrambleText: { text: "%", ...SCRAMBLE_SIGN } }, 0.1)
        .to(number, { duration: 0.75, scrambleText: { text: String(SECTOR_CAP), ...SCRAMBLE } }, 0.1);
    });
    return () => {
      context.revert();
      timeline.current = null;
      number.textContent = String(SECTOR_CAP);
      sign.textContent = "%";
    };
  }, [reduce]);

  useEffect(() => {
    if (shown) timeline.current?.play();
  }, [shown, reduce]);

  const words = SECTOR.split(" ");
  return (
    <div className="relative left-[-2.5%] flex w-1/2 flex-col items-center px-12 max-md:left-0 max-md:w-full max-md:px-0">
      <div ref={ref} data-played={shown && !reduce ? "" : undefined} className="grid w-[90%] place-items-center">
        <div aria-hidden="true" className="pv3-wrap grid aspect-square w-full place-items-center [&>*]:[grid-area:1/1]" style={{ "--blink": ".175s" } as CSSProperties}>
          <p
            ref={paragraph}
            data-flash-on={flashing ? "" : undefined}
            className={`${MONO} m-0 max-w-[40%] self-start justify-self-end pt-[15.6%] pr-[7%] text-[9.6px] leading-[1.2] tracking-[.08rem] uppercase max-md:max-w-[44%]`}
          >
            {words.map((word, index) => (
              <Fragment key={index}>
                {index > 0 && " "}
                <span className="pv3-flash" style={{ "--delay": `${FLASH_DELAYS[index % FLASH_DELAYS.length]}s` } as CSSProperties}>
                  {word}
                </span>
              </Fragment>
            ))}
          </p>
          <svg viewBox="0 0 514 514" fill="none" className="w-[92%] -rotate-90">
            <circle cx="257" cy="257" r={R} stroke="#fff" strokeOpacity=".15" strokeWidth="10" strokeDasharray={TICK_DASH} strokeDashoffset={TICK_OFFSET} />
          </svg>
          <svg viewBox="0 0 514 514" fill="none" className="w-[92%] -rotate-90">
            <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="514" height="514">
              <circle ref={maskRef} data-ring-mask="" cx="257" cy="257" r={R} stroke="#fff" strokeWidth="16" strokeDasharray={`${ARC.toFixed(4)} ${CIRCUMFERENCE.toFixed(4)}`} strokeDashoffset="0" />
            </mask>
            <g mask={`url(#${mask})`}>
              <circle cx="257" cy="257" r={R} stroke={ORANGE} strokeWidth="10" strokeDasharray={TICK_DASH} strokeDashoffset={TICK_OFFSET} />
            </g>
          </svg>
          <div className={`${NUMBER} ml-[-.08em]`}>
            <span ref={numberRef}>{SECTOR_CAP}</span>
            <span ref={signRef}>%</span>
          </div>
        </div>
      </div>
      <p className={CAPTION}>{SECTOR}</p>
    </div>
  );
}

/** A thin circle, white fading left to right (theirs is #595959 to #222); `accent` draws it orange. */
function Circle({ className, accent = false, circleRef }: { className: string; accent?: boolean; circleRef: Ref<HTMLDivElement> }) {
  const gradient = useId();
  return (
    <div ref={circleRef} className={`absolute ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" className="block size-full overflow-visible">
        <defs>
          <linearGradient id={gradient} x1="0" x2="100" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity=".14" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="49.5" stroke={accent ? ORANGE : `url(#${gradient})`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/**
 * Right: the portfolio size over three circles. On reveal the outer two
 * slide apart from the middle and the centre one scales up; on a phone they
 * stack and slide on the vertical instead.
 */
function HoldingsCircles() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const reduce = useReducedMotion();
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const centre = useRef<HTMLDivElement>(null);
  const low = useRef<HTMLSpanElement>(null);
  const high = useRef<HTMLSpanElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const [a, b, c, from, to] = [left.current, right.current, centre.current, low.current, high.current];
    if (reduce || !a || !b || !c || !from || !to) return;
    gsap.registerPlugin(ScrambleTextPlugin);
    const phone = window.matchMedia("(max-width: 479px)").matches;
    from.textContent = "0";
    to.textContent = "0";
    const context = gsap.context(() => {
      timeline.current = gsap
        .timeline({ paused: true })
        .to(from, { duration: 0.75, scrambleText: { text: "15", ...SCRAMBLE } }, 0)
        .to(to, { duration: 0.75, scrambleText: { text: "20", ...SCRAMBLE } }, 0)
        .from(a, { duration: 0.8, opacity: 0, ease: EASE, ...(phone ? { yPercent: -35 } : { xPercent: 35 }) }, 0.15)
        .from(b, { duration: 0.8, opacity: 0, ease: EASE, ...(phone ? { yPercent: 35 } : { xPercent: -35 }) }, 0.3)
        .from(c, { duration: 0.8, opacity: 0, scale: 0.75, ease: EASE }, 0.4);
    });
    return () => {
      context.revert();
      timeline.current = null;
      from.textContent = "15";
      to.textContent = "20";
    };
  }, [reduce]);

  useEffect(() => {
    if (shown) timeline.current?.play();
  }, [shown, reduce]);

  return (
    <div className="relative left-[-2.5%] flex w-1/2 flex-col items-center px-12 max-md:left-0 max-md:mt-24 max-md:w-full max-md:px-0">
      <div ref={ref} data-played={shown && !reduce ? "" : undefined} className="grid w-[90%] place-items-center max-[479px]:my-[20%]">
        <div aria-hidden="true" className="pv3-wrap relative grid aspect-square w-full place-items-center" style={{ "--blink": ".245s" } as CSSProperties}>
          <Circle circleRef={left} className="top-[10%] left-[-10%] size-[80%] max-[479px]:top-[-17.5%] max-[479px]:left-[5%] max-[479px]:size-[90%]" />
          <Circle circleRef={right} className="top-[10%] left-[30%] size-[80%] max-[479px]:top-[27.5%] max-[479px]:left-[5%] max-[479px]:size-[90%]" />
          <Circle circleRef={centre} accent className="top-[30%] left-[30%] size-[40%]" />
          <div className={NUMBER}>
            <span ref={low}>15</span>–<span ref={high}>20</span>
          </div>
        </div>
      </div>
      <p className={`${CAPTION} mt-auto`}>{CONCENTRATED}</p>
    </div>
  );
}

/** The other three rules, on Titan Gate's ragged starts, alternating the side they slide in from. */
const RULES = [
  { text: HORIZON, from: "7.5rem", place: "md:col-start-2 md:col-end-12" },
  { text: MONITORING, from: "-7.5rem", place: "md:col-start-4 md:col-end-13" },
  { text: REBALANCING, from: "7.5rem", place: "md:col-start-3 md:col-end-12" },
] as const;

export function PortfolioApproachSection() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className="scroll-mt-[96px] overflow-x-clip bg-black pb-[14rem] text-white max-md:pb-[120px]">
      <style href="pms-v3-portfolio" precedence="default">
        {STYLES}
      </style>
      <div className="flex flex-col items-center">
        <Guideline height={240} delay={0.025} className="max-md:!h-[120px]" />
        <div className="py-6">
          <FlickerHeading id="portfolio-heading" text="Portfolio Approach" />
        </div>
        <Guideline height={240} delay={0.2} className="max-md:!h-[120px]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1512px] justify-between md:mt-[-10rem] max-md:flex-col max-md:px-6">
        <SectorRing />
        <HoldingsCircles />
      </div>

      <ul className={`${COLUMN} m-0 mt-[160px] list-none max-md:mt-[112px]`}>
        {RULES.map((rule) => (
          <li key={rule.text} className="grid grid-cols-12 border-t border-dashed border-white/20 py-[30px] last:border-b max-md:py-[24px]">
            <p
              className={`pv3-slide col-span-12 m-0 font-serif text-[clamp(1.75rem,1.1rem+1.9vw,2.9rem)] leading-[1.08] tracking-[-.015em] text-white ${rule.place}`}
              style={{ "--from": rule.from } as CSSProperties}
            >
              {rule.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
