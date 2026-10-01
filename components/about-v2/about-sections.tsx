"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Draw, Hatch, MOVE, OUT, RM, tr } from "@/components/drawing/plate";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { FOUNDER, STORY } from "@/lib/about-v2";
import { hexPoints, ORANGE, useShown } from "./shared";

/*
 * The two /about sections kept from the first build, content plan §2: the
 * founder on a black band, and the Moneybee story as a drawing of nectar into
 * honey beside money into wealth. The rest of the page is in components/about-v3.
 */

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

const MONO = "var(--font-geist-mono), ui-monospace, monospace";
const DROP = "M50 30 C 50 30, 34 50, 34 62 a16 16 0 0 0 32 0 C 66 50, 50 30, 50 30Z";

function PlateLabel({ x, children }: { x: number; children: string }) {
  return (
    <text x={x} y="124" textAnchor="middle" fontSize="7" letterSpacing=".12em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
      {children}
    </text>
  );
}

/**
 * Nectar into honey. The drop is hatched; a small measure of it leaves along
 * a bent path and falls into the cell, and the cell fills with honey against
 * a tick-marked scale, its pointer rising with the level.
 */
function NectarDrawing({ on }: { on: boolean; t: (ms: number, delay?: number) => string }) {
  const hatch = useId();
  const cell = useId();
  const top = 18;
  const bottom = 94;
  return (
    <svg viewBox="0 0 280 130" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2.4} opacity={0.6} />
        <clipPath id={cell}>
          <polygon points={hexPoints(220, 56, 38)} />
        </clipPath>
      </defs>
      <line x1="8" x2="272" y1="104" y2="104" stroke="#000" strokeWidth=".6" strokeOpacity=".45" />
      <path d={DROP} fill={`url(#${hatch})`} stroke="#000" strokeWidth="1" />
      {/* The route: out of the drop, over and down into the cell. */}
      <path d="M62 44 C 104 8, 168 4, 214 24" fill="none" stroke="#000" strokeWidth=".6" strokeOpacity=".7" strokeDasharray="1.6 2.4" />
      <g className={RM} style={{ transform: `translateX(${on ? 164 : 0}px)`, ...tr("transform", 900, 350, MOVE) }}>
        <g className={RM} style={{ transform: `translateY(${on ? -26 : 0}px)`, opacity: on ? 0 : 1, transitionProperty: "transform, opacity", transitionDuration: "900ms, 200ms", transitionDelay: "350ms, 1150ms", transitionTimingFunction: `${OUT}, ${OUT}` }}>
          <path d={DROP} transform="translate(50 50) scale(.32) translate(-50 -62)" fill={`url(#${hatch})`} stroke="#000" strokeWidth="2.6" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, 300) }} />
        </g>
      </g>
      <g clipPath={`url(#${cell})`}>
        <rect x="180" y={top} width="80" height={bottom - top} fill={ORANGE} className={RM} style={{ transform: `translateY(${on ? 0 : bottom - top}px)`, ...tr("transform", 800, 1150) }} />
      </g>
      <polygon points={hexPoints(220, 56, 38)} fill="none" stroke="#000" strokeWidth="1.1" strokeLinejoin="round" />
      <polygon points={hexPoints(220, 56, 33)} fill="none" stroke="#000" strokeWidth=".5" strokeOpacity=".4" />
      {/* The level scale beside the cell, and its pointer. */}
      <line x1="268" x2="268" y1={top} y2={bottom} stroke="#000" strokeWidth=".6" strokeOpacity=".6" />
      {Array.from({ length: 11 }, (_, tick) => (
        <line key={tick} x1={tick % 5 ? 265.5 : 263.5} x2="268" y1={top + tick * 7.6} y2={top + tick * 7.6} stroke="#000" strokeWidth=".5" strokeOpacity=".6" />
      ))}
      <g className={RM} style={{ transform: `translateY(${on ? 0 : bottom - top}px)`, ...tr("transform", 800, 1150) }}>
        <path d={`M270 ${top}l4 -2.4v4.8Z`} fill="#000" />
      </g>
      <PlateLabel x={50}>NECTAR</PlateLabel>
      <PlateLabel x={220}>HONEY</PlateLabel>
    </svg>
  );
}

/**
 * Money into wealth. The coin is struck with its rim; coins leave it across
 * the plate and are laid one on another, the last in orange, and a dimension
 * line measures how far the stack has grown.
 */
function MoneyDrawing({ on }: { on: boolean; t: (ms: number, delay?: number) => string }) {
  const hatch = useId();
  const discs = 7;
  const base = 97;
  const step = 11;
  const land = 800;
  const gap = 75;
  const stackTop = base - discs * step + 2;
  const dimension = land + (discs - 1) * gap + 250;
  return (
    <svg viewBox="0 0 280 130" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2.2} opacity={0.6} />
      </defs>
      <line x1="8" x2="272" y1="104" y2="104" stroke="#000" strokeWidth=".6" strokeOpacity=".45" />
      <circle cx="50" cy="56" r="20" fill="#fff" stroke="#000" strokeWidth="1.1" />
      <circle cx="50" cy="56" r="16.5" fill="none" stroke="#000" strokeWidth=".5" strokeOpacity=".5" strokeDasharray="1 1.6" />
      <text x="50" y="62" textAnchor="middle" fontSize="17" fill="#000">
        ₹
      </text>
      <path d="M74 56H182" stroke="#000" strokeWidth=".6" strokeOpacity=".7" strokeDasharray="1.6 2.4" />
      {/* One coin crosses, edge on, to where the stack will stand. */}
      <g className={RM} style={{ transform: `translateX(${on ? 150 : 0}px)`, opacity: on ? 0 : 1, transitionProperty: "transform, opacity", transitionDuration: "800ms, 200ms", transitionDelay: `150ms, ${land - 60}ms`, transitionTimingFunction: `${MOVE}, ${OUT}` }}>
        <rect x="42" y="52" width="16" height="8" rx="4" fill={`url(#${hatch})`} stroke="#000" strokeWidth=".7" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 160, 100) }} />
      </g>
      <line x1="182" x2="258" y1={base + 0.5} y2={base + 0.5} stroke="#000" strokeWidth=".8" />
      {Array.from({ length: discs }, (_, index) => {
        const last = index === discs - 1;
        return (
          <rect
            key={index}
            x="190"
            y={base - 9 - index * step}
            width="60"
            height="8"
            rx="4"
            fill={last ? ORANGE : index % 2 ? "#fff" : `url(#${hatch})`}
            stroke="#000"
            strokeWidth=".8"
            className={RM}
            style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(-8px)", ...tr("opacity, transform", 360, land + index * gap) }}
          />
        );
      })}
      {/* The stack's height, measured once it is laid. */}
      <Draw d={`M252 ${stackTop}H270`} on={on} ms={260} delay={dimension} stroke="#000" strokeWidth=".5" strokeOpacity=".7" />
      <Draw d={`M266 ${stackTop + 1}V${base - 1}`} on={on} ms={380} delay={dimension + 160} stroke="#000" strokeWidth=".8" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, dimension + 460) }}>
        <path d={`M263.6 ${stackTop + 4}L266 ${stackTop}L268.4 ${stackTop + 4}M263.6 ${base - 4}L266 ${base}L268.4 ${base - 4}`} fill="none" stroke="#000" strokeWidth=".8" />
      </g>
      <line x1="252" x2="270" y1={base + 0.5} y2={base + 0.5} stroke="#000" strokeWidth=".5" strokeOpacity=".7" />
      <PlateLabel x={50}>MONEY</PlateLabel>
      <PlateLabel x={220}>WEALTH</PlateLabel>
    </svg>
  );
}

/** The plan's story line, drawn as its two halves side by side. `index` is its number in the page's order. */
export function StorySection({ index = "03" }: { index?: string }) {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.35);
  return (
    <section id="story" aria-labelledby="story-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <span className={`${EYEBROW} text-black/60`}>{index}</span>
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
