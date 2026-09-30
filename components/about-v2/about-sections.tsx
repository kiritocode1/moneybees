"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import { ABOUT, FOUNDER, GROUP_AREAS, STORY, TIMELINE } from "@/lib/about-v2";
import { hexPoints, ORANGE, useShown } from "./shared";

/*
 * /about, content plan §2: the heading and company information beside a
 * drawing of the group and its four areas, the founder on a black band, a
 * timeline of the plan's dates on grey, and the Moneybee story as a drawing of
 * nectar into honey beside money into wealth.
 */

/** The group as a cell with its four areas around it, placed in turn. */
function GroupDrawing() {
  const { ref, shown, t } = useShown<SVGSVGElement>(0.35);
  const R = 60;
  const cx = 180;
  const cy = 165;
  // Neighbours of a pointy-top cell sit across its sloped sides: 60 degrees off the horizontal.
  const dx = 55;
  const dy = 95;
  const spots = [
    [cx - dx, cy - dy],
    [cx + dx, cy - dy],
    [cx - dx, cy + dy],
    [cx + dx, cy + dy],
  ] as const;
  return (
    <svg ref={ref} viewBox="60 0 240 330" className="block h-auto w-full max-w-[400px]" role="img" aria-label="Moneybee Group and its four areas: portfolio management, equity broking, investment advisory and related financial services">
      {spots.map(([x, y], index) => (
        <g key={index} style={{ opacity: shown ? 1 : 0, transform: `scale(${shown ? 1 : 0.85})`, transformOrigin: `${x}px ${y}px`, transition: `opacity ${t(600, 350 + index * 180)}, transform ${t(600, 350 + index * 180)}` }}>
          <polygon points={hexPoints(x, y, R - 3)} fill="#fff" stroke="#000" strokeWidth="1.2" />
          {GROUP_AREAS[index].map((word, line, words) => (
            <text key={word} x={x} y={y + 4 + (line - (words.length - 1) / 2) * 14} textAnchor="middle" fontSize="11" fill="#000" fontFamily="var(--font-geist-mono), ui-monospace, monospace">
              {word}
            </text>
          ))}
        </g>
      ))}
      <polygon points={hexPoints(cx, cy, R - 3)} fill="#000" />
      <polygon points={hexPoints(cx, cy, R + 2)} fill="none" stroke={ORANGE} strokeWidth="2" strokeDasharray="380" strokeDashoffset={shown ? 0 : 380} style={{ transition: `stroke-dashoffset ${t(1200, 1100)}` }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fill="#fff" className="font-serif">
        Moneybee Group
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="12" fill={ORANGE} fontFamily="var(--font-geist-mono), ui-monospace, monospace">
        2004
      </text>
    </svg>
  );
}

export function AboutHero() {
  return (
    <section aria-labelledby="about-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-14 pt-[150px] pb-[110px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:pt-[220px] max-md:pb-[72px]`}>
        <div>
          <Rise>
            <BracketLabel>About us</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="about-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {ABOUT.heading}
            </h1>
          </Rise>
          {ABOUT.company.map((paragraph, index) => (
            <Rise key={paragraph} delay={0.12 + index * 0.06}>
              <p className={`mt-8 max-w-[560px] text-black/70 ${BODY}`}>{paragraph}</p>
            </Rise>
          ))}
        </div>
        <Rise delay={0.2}>
          <div className="flex justify-center md:justify-end">
            <GroupDrawing />
          </div>
        </Rise>
      </div>
    </section>
  );
}

/** Counts up to `to` once `on` turns true. */
function CountUp({ to, on, instant }: { to: number; on: boolean; instant: boolean }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!on || instant) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [on, to, instant]);
  return <>{instant ? to : value}</>;
}

/** The founder on black: photograph, qualifications, the years counted up, and each point marked in turn. */
export function FounderSection() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.3);
  const instant = t(1) === "0ms";
  return (
    <section id="founder" aria-labelledby="founder-heading" className="scroll-mt-[96px] bg-black text-white">
      <div ref={ref} className={`${COLUMN} grid grid-cols-1 items-start gap-12 py-[120px] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20 max-md:py-[80px]`}>
        <div className="relative aspect-[868/824] w-full overflow-hidden bg-white/10">
          <Image src={FOUNDER.photo} alt={FOUNDER.name} fill sizes="(max-width: 768px) 100vw, 520px" className="object-cover" />
        </div>
        <div>
          <BracketLabel>01 · Founder</BracketLabel>
          <h2 id="founder-heading" className={`mt-[18px] ${SUBHEAD}`}>
            {FOUNDER.name}
          </h2>
          <p className={`mt-[10px] ${EYEBROW} text-[12px] text-[#F6A11A]`}>{FOUNDER.role}</p>
          <ul className="mt-[24px] flex list-none flex-wrap gap-[8px] p-0" aria-label="Qualifications">
            {FOUNDER.qualifications.map((item, index) => (
              <li
                key={item}
                className="rounded-full border border-white/30 px-[14px] py-[6px] text-[14px]"
                style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(500, 200 + index * 120)}` }}
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-[40px] flex items-end gap-[18px] border-t border-white/20 pt-[28px]">
            <span className="text-[clamp(4rem,8vw,7rem)] leading-[.85] font-light tracking-[-.05em] text-[#F6A11A] tabular-nums">
              <CountUp to={45} on={shown} instant={instant} />+
            </span>
            <span className={`${EYEBROW} pb-[6px] text-white/60`}>Years of experience</span>
          </div>
          <ol className="mt-[32px] list-none border-t border-white/40 p-0">
            {FOUNDER.points.map((point, index) => (
              <li key={point} className="grid grid-cols-[30px_minmax(0,1fr)] items-start gap-x-[14px] border-b border-white/15 py-[16px]">
                <svg viewBox="0 0 24 24" className="mt-[3px] h-[22px] w-[22px]" aria-hidden="true">
                  <polygon points={hexPoints(12, 12, 10.5)} fill={shown ? ORANGE : "transparent"} stroke={shown ? ORANGE : "rgba(255,255,255,.3)"} strokeWidth="1.2" style={{ transition: `fill ${t(400, 500 + index * 160)}, stroke ${t(400, 500 + index * 160)}` }} />
                </svg>
                <span className="font-serif text-[clamp(1.2rem,1rem+.6vw,1.5rem)] leading-[1.25]">{point}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/**
 * The plan's dates on one track: the founder's experience as a dashed run-up
 * with no date, then 2004 and August 2007 as cells that fill in turn.
 */
export function TimelineSection() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.35);
  return (
    <section id="timeline" aria-labelledby="timeline-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <span className={`${EYEBROW} text-black/60`}>02</span>
        <h2 id="timeline-heading" className={`mt-[14px] ${SUBHEAD}`}>
          Timeline
        </h2>
        <div ref={ref} className="relative mt-[64px]">
          {/* Desktop track: dashed before 2004, solid orange after. */}
          <div aria-hidden="true" className="absolute top-[22px] right-0 left-0 max-md:hidden">
            <div className="absolute left-0 h-[2px] w-[33.333%] bg-[repeating-linear-gradient(90deg,rgba(0,0,0,.35)_0_6px,transparent_6px_12px)]" style={{ clipPath: shown ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", transition: `clip-path ${t(900)}` }} />
            <div className="absolute left-[33.333%] h-[2px] w-[66.667%] origin-left bg-[#F6A11A]" style={{ transform: `scaleX(${shown ? 1 : 0})`, transition: `transform ${t(1100, 700)}` }} />
          </div>
          <ol className="relative m-0 grid list-none grid-cols-1 gap-10 p-0 md:grid-cols-3 md:gap-0">
            {TIMELINE.map((stop, index) => {
              const dated = stop.when !== null;
              const lit = shown;
              const delay = 500 + index * 450;
              return (
                <li key={stop.label} className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-[18px] md:block md:pr-[40px]">
                  {/* Phone track: each stop joined to the next, dashed before 2004. */}
                  {index < TIMELINE.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`absolute top-[22px] left-[21px] h-[calc(100%+40px)] w-[2px] md:hidden ${dated ? "bg-[#F6A11A]" : "bg-[repeating-linear-gradient(180deg,rgba(0,0,0,.35)_0_6px,transparent_6px_12px)]"}`}
                      style={{ clipPath: shown ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", transition: `clip-path ${t(700, index * 450)}` }}
                    />
                  )}
                  <span aria-hidden="true" className="relative z-[1] block h-[44px] w-[44px] bg-[#F7F7F8]">
                    <svg viewBox="0 0 44 44" className="block h-[44px] w-[44px]">
                      <polygon
                        points={hexPoints(22, 22, 19)}
                        fill={lit && dated ? ORANGE : "#F7F7F8"}
                        stroke={dated ? (lit ? ORANGE : "rgba(0,0,0,.3)") : "rgba(0,0,0,.45)"}
                        strokeWidth="1.5"
                        strokeDasharray={dated ? undefined : "3 3"}
                        style={{ transition: `fill ${t(400, delay)}, stroke ${t(400, delay)}` }}
                      />
                    </svg>
                  </span>
                  <div className="md:mt-[28px]" style={{ opacity: shown ? 1 : 0, transform: `translateY(${shown ? 0 : 10}px)`, transition: `opacity ${t(500, delay)}, transform ${t(500, delay)}` }}>
                    <span className={`block text-[clamp(2.4rem,1.6rem+2.4vw,3.6rem)] leading-none font-light tracking-[-.04em] ${dated ? "text-black" : "text-black/60"}`}>{stop.label}</span>
                    <p className="mt-[14px] max-w-[320px] font-serif text-[clamp(1.2rem,1rem+.6vw,1.5rem)] leading-[1.25]">{stop.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

const MONO = "var(--font-geist-mono), ui-monospace, monospace";
const DROP = "M50 30 C 50 30, 34 50, 34 62 a16 16 0 0 0 32 0 C 66 50, 50 30, 50 30Z";

/** Nectar travels into a cell that fills with honey. */
function NectarDrawing({ on, t }: { on: boolean; t: (ms: number, delay?: number) => string }) {
  return (
    <svg viewBox="0 0 280 130" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <clipPath id="about-honey-cell">
          <polygon points={hexPoints(220, 56, 38)} />
        </clipPath>
      </defs>
      <path d={DROP} fill="none" stroke="#000" strokeWidth="1.4" />
      <g style={{ transform: `translateX(${on ? 150 : 0}px) scale(${on ? 0.6 : 1})`, transformOrigin: "50px 62px", opacity: on ? 0 : 0.9, transition: `transform ${t(1100, 200)}, opacity ${t(300, 1100)}` }}>
        <path d={DROP} fill={ORANGE} />
      </g>
      <path d="M80 56H160M152 49l8 7-8 7" fill="none" stroke={ORANGE} strokeWidth="2" />
      <polygon points={hexPoints(220, 56, 38)} fill="#fff" stroke="#000" strokeWidth="1.4" />
      <g clipPath="url(#about-honey-cell)">
        <rect x="180" y="18" width="80" height="80" fill={ORANGE} style={{ transform: `translateY(${on ? 0 : 78}px)`, transition: `transform ${t(1000, 1000)}` }} />
      </g>
      <text x="50" y="120" textAnchor="middle" fontSize="9" letterSpacing=".1em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
        NECTAR
      </text>
      <text x="220" y="120" textAnchor="middle" fontSize="9" letterSpacing=".1em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
        HONEY
      </text>
    </svg>
  );
}

/** Money travels into a stack that grows into wealth. */
function MoneyDrawing({ on, t }: { on: boolean; t: (ms: number, delay?: number) => string }) {
  const discs = 7;
  return (
    <svg viewBox="0 0 280 130" className="block h-auto w-full" aria-hidden="true">
      <g style={{ transform: `translateX(${on ? 150 : 0}px) scale(${on ? 0.6 : 1})`, transformOrigin: "50px 56px", opacity: on ? 0 : 0.9, transition: `transform ${t(1100, 200)}, opacity ${t(300, 1100)}` }}>
        <circle cx="50" cy="56" r="20" fill={ORANGE} />
      </g>
      <circle cx="50" cy="56" r="20" fill="none" stroke="#000" strokeWidth="1.4" />
      <text x="50" y="62" textAnchor="middle" fontSize="17" fill="#000">
        ₹
      </text>
      <path d="M80 56H160M152 49l8 7-8 7" fill="none" stroke={ORANGE} strokeWidth="2" />
      <line x1="178" x2="262" y1="97" y2="97" stroke="#000" strokeOpacity=".3" />
      {Array.from({ length: discs }, (_, index) => (
        <rect
          key={index}
          x="190"
          y={88 - index * 11}
          width="60"
          height="8"
          rx="4"
          fill={index % 2 ? "#000" : ORANGE}
          style={{ opacity: on ? 1 : index === 0 ? 1 : 0, transition: `opacity ${t(250, 1000 + index * 130)}` }}
        />
      ))}
      <text x="50" y="120" textAnchor="middle" fontSize="9" letterSpacing=".1em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
        MONEY
      </text>
      <text x="220" y="120" textAnchor="middle" fontSize="9" letterSpacing=".1em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
        WEALTH
      </text>
    </svg>
  );
}

/** The plan's story line, drawn as its two halves side by side. */
export function StorySection() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.35);
  return (
    <section id="story" aria-labelledby="story-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <span className={`${EYEBROW} text-black/60`}>03</span>
        <h2 id="story-heading" className={`mt-[14px] ${SUBHEAD}`}>
          {STORY.heading}
        </h2>
        <blockquote className="mt-[40px] max-w-[980px] font-serif text-[clamp(1.9rem,1.2rem+2.4vw,3.4rem)] leading-[1.12] tracking-[-.015em]">
          <span className="text-[#F6A11A]">&ldquo;</span>
          {STORY.line}
          <span className="text-[#F6A11A]">&rdquo;</span>
        </blockquote>
        <div ref={ref} className="mt-[64px] grid grid-cols-1 gap-[2px] bg-black/10 md:grid-cols-2">
          <div className="bg-white p-[32px] max-[600px]:p-[20px]">
            <span className={`${EYEBROW} text-black/60`}>Bees</span>
            <div className="mx-auto mt-[18px] max-w-[440px]">
              <NectarDrawing on={shown} t={t} />
            </div>
          </div>
          <div className="bg-white p-[32px] max-[600px]:p-[20px]">
            <span className={`${EYEBROW} text-black`}>Moneybee</span>
            <div className="mx-auto mt-[18px] max-w-[440px]">
              <MoneyDrawing on={shown} t={t} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
