"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BOX, Draw, MOVE, RM, tr } from "@/components/drawing/plate";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import {
  AIF_NAMES,
  AIF_ROWS,
  formatReturn,
  GROWTH,
  METHOD,
  PERFORMANCE,
  PERFORMANCE_LOREM,
  PERFORMANCE_PARTS,
  PMS_NAMES,
  PMS_ROWS,
  type ReturnRow,
} from "@/lib/performance";
import LitRows from "@/components/motion/lit-rows";
import { FigurePanel, PageIndex, NoScriptReveal } from "@/components/pms-v2/shared";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * /performance, content plan §7 and the section plan's §7: each fund's periods
 * as lit rows (components/motion/lit-rows.tsx) with the same figures as a plain
 * table under them, the growth of Rs. 1 Mn drawn as unit squares, and the
 * method drawn as chained sub-periods. Figures are as of 31 July 2026
 * (lib/performance.ts); a period the data does not carry prints N/A.
 */

const ORANGE = "#F6A11A";
const EASE = "cubic-bezier(.22,1,.36,1)";

function useShown<T extends Element>(amount = 0.35) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

/** The As-of label, an orange square beside the date. */
function AsOf({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`${EYEBROW} inline-flex items-center gap-[10px] border px-[12px] py-[7px] text-[11px] ${dark ? "border-white/25 text-white" : "border-black/20 text-black"}`}>
      <i className="h-[8px] w-[8px] bg-[#F6A11A]" aria-hidden="true" />
      {PERFORMANCE.asOf}
    </span>
  );
}

export function PerformanceHero() {
  return (
    <section aria-labelledby="performance-heading" className="bg-white text-black">
      <NoScriptReveal />
      <div className={`${COLUMN} grid grid-cols-1 items-end gap-14 pt-[150px] pb-[110px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:pt-[220px] max-md:pb-[72px]`}>
        <div>
          <Rise>
            <BracketLabel>Performance</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="performance-heading" className={`${HEADING} mt-[22px] text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {PERFORMANCE.heading}
            </h1>
          </Rise>
          <Rise delay={0.1}>
            <div className="mt-[22px]">
              <AsOf />
            </div>
          </Rise>
          <Rise delay={0.14}>
            <p className={`mt-8 max-w-[520px] text-black/70 ${BODY}`}>{PERFORMANCE.lead}</p>
          </Rise>
        </div>
        <Rise delay={0.2}>
          <PageIndex parts={PERFORMANCE_PARTS} />
        </Rise>
      </div>
    </section>
  );
}

/** Heading on the left, placeholder body on the right, as /our-approach opens its sections. */
function SectionHead({ id, label, heading, dark = false }: { id: string; label: string; heading: string; dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
      <div>
        <BracketLabel>{label}</BracketLabel>
        <h2 id={`${id}-heading`} className={`mt-[18px] ${SUBHEAD}`}>
          {heading}
        </h2>
      </div>
      <p className={`${dark ? "text-white/70" : "text-black/70"} ${BODY}`}>{PERFORMANCE_LOREM.long}</p>
    </div>
  );
}

/** The same rows as a plain table under the lit rows, for reading and screen readers. */
function ReturnTable({ rows, names }: { rows: readonly ReturnRow[]; names: { ours: string; benchmark: string } }) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className={`${EYEBROW} border-b border-black text-black/60`}>
          <th scope="col" className="py-[12px] pr-[12px] font-normal">
            Period
          </th>
          <th scope="col" className="py-[12px] pr-[12px] text-right font-normal">
            {names.ours}
          </th>
          <th scope="col" className="py-[12px] text-right font-normal">
            {names.benchmark}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.period} className="border-b border-black/12">
            <th scope="row" className="py-[14px] pr-[12px] text-[16px] font-normal whitespace-nowrap">
              {row.period}
            </th>
            <td className={`py-[14px] pr-[12px] text-right font-[family-name:var(--font-geist-mono)] text-[15px] tabular-nums ${row.ours === null ? "text-black/60" : "text-black"}`}>
              {formatReturn(row.ours)}
            </td>
            <td className={`py-[14px] text-right font-[family-name:var(--font-geist-mono)] text-[15px] tabular-nums ${row.benchmark === null ? "text-black/60" : "text-black/70"}`}>
              {formatReturn(row.benchmark)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A fund's lit rows in the figure panel, then the same figures as a table. */
function Returns({ rows, names }: { rows: readonly ReturnRow[]; names: { ours: string; benchmark: string } }) {
  return (
    <>
      <FigurePanel className="mt-[40px]">
        <LitRows rows={rows} names={names} />
      </FigurePanel>
      <div className="mt-[48px]">
        <ReturnTable rows={rows} names={names} />
      </div>
    </>
  );
}

export function PmsPerformanceSection() {
  return (
    <section id="pms" aria-labelledby="pms-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <SectionHead id="pms" label="PMS" heading="PMS Performance" />
        <div className="mt-[40px]">
          <AsOf />
        </div>
        <Returns rows={PMS_ROWS} names={PMS_NAMES} />
      </div>
    </section>
  );
}

/** Counts up to `target` once `on`, with two decimals; jumps straight there under reduced motion. */
function useCount(target: number, on: boolean, duration = 1600) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!on || reduce) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(target * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [on, target, reduce, duration]);
  return on && reduce ? target : value;
}

/** One square per Rs. 1 Mn, filled in order; the last square fills only as far as its fraction. */
function UnitGrid({ total, fill, on, columns = 10 }: { total: number; fill: string; on: boolean; columns?: number }) {
  const cells = Math.ceil(total);
  return (
    <div className="grid gap-[4px]" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} aria-hidden="true">
      {Array.from({ length: cells }, (_, index) => {
        const part = Math.min(1, total - index);
        return (
          <span key={index} className="relative block aspect-square border border-white/20">
            <span
              className="absolute inset-y-0 left-0 block motion-reduce:!transition-none"
              style={{
                width: `${part * 100}%`,
                backgroundColor: index === 0 ? "#fff" : fill,
                opacity: on ? 1 : 0,
                transform: `scale(${on ? 1 : 0.9})`,
                transformOrigin: "0 100%",
                transition: `opacity 300ms ${EASE} ${index * 30}ms, transform 300ms ${EASE} ${index * 30}ms`,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}

/** Rs. 1 Mn at inception and what it became in each, drawn as that many unit squares. */
export function WealthSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  const ours = useCount(GROWTH.ours, shown);
  const benchmark = useCount(GROWTH.benchmark, shown);
  const sides = [
    { name: PMS_NAMES.ours, value: ours, total: GROWTH.ours, fill: ORANGE, tone: "text-[#F6A11A]" },
    { name: PMS_NAMES.benchmark, value: benchmark, total: GROWTH.benchmark, fill: "rgba(255,255,255,.55)", tone: "text-white" },
  ];
  return (
    <section id="wealth" aria-labelledby="wealth-heading" className="scroll-mt-[96px] bg-black text-white">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <SectionHead id="wealth" label="Wealth growth" heading="Wealth Growth" dark />
        <div className="mt-[40px] flex flex-wrap items-center gap-x-[28px] gap-y-[14px]">
          <AsOf dark />
          <span className={`${EYEBROW} flex items-center gap-[10px] text-[11px] text-white/70`}>
            <i className="h-[12px] w-[12px] border border-white/40 bg-white" aria-hidden="true" />
            Rs. {GROWTH.start} Mn invested {GROWTH.from}
          </span>
        </div>
        <div ref={ref} className="mt-[48px] grid grid-cols-1 gap-[56px] md:grid-cols-2 md:gap-[72px]">
          {sides.map((side) => (
            <div key={side.name} className="flex flex-col">
              <span className={`${EYEBROW} text-white/60`}>{side.name}</span>
              <p className={`mt-[10px] text-[clamp(2.6rem,1.6rem+3vw,4.6rem)] leading-none font-light tracking-[-.05em] tabular-nums ${side.tone}`}>
                <span className="sr-only">
                  Rs. {GROWTH.start} Mn grew to Rs. {side.total} Mn by {GROWTH.to}
                </span>
                <span aria-hidden="true">Rs. {side.value.toFixed(2)} Mn</span>
              </p>
              <div className="mt-[28px]">
                <UnitGrid total={side.total} fill={side.fill} on={shown} />
              </div>
              <span className={`${EYEBROW} mt-[16px] text-white/60`}>
                {GROWTH.from} to {GROWTH.to}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AifPerformanceSection() {
  return (
    <section id="aif" aria-labelledby="aif-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <SectionHead id="aif" label="AIF" heading="AIF Performance" />
        <div className="mt-[40px]">
          <AsOf />
        </div>
        <Returns rows={AIF_ROWS} names={AIF_NAMES} />
      </div>
    </section>
  );
}

/**
 * Time-weighted return, drawn. The portfolio's value (the grey line) jumps
 * up at an inflow and drops at an outflow; those jumps are money moving, not
 * performance. So the line is cut at every flow, each piece keeps only its
 * own return, measured under it, and the pieces are chained in orange.
 */
function MethodGlyph({ on }: { on: boolean }) {
  const flows = [
    { x: 120, inflow: true },
    { x: 230, inflow: false },
  ];
  const pieces = [
    { d: "M20 120 C 50 110, 80 104, 120 92", label: "r1", from: 20, to: 120 },
    { d: "M120 92 C 150 100, 190 84, 230 76", label: "r2", from: 120, to: 230 },
    { d: "M230 76 C 262 70, 300 56, 330 44", label: "r3", from: 230, to: 330 },
  ];
  // The same value with the flows left in: up by the inflow at 120, down by the outflow at 230.
  const raw = "M20 120 C 50 110, 80 104, 120 92 V72 C 150 80, 190 64, 230 56 V86 C 262 80, 300 66, 330 54";
  const mono = "var(--font-geist-mono), ui-monospace, monospace";
  return (
    <svg viewBox="0 0 350 200" className="block h-auto w-full" aria-hidden="true">
      <line x1="10" x2="340" y1="150" y2="150" stroke="#000" strokeWidth=".6" strokeOpacity=".45" />
      {Array.from({ length: 12 }, (_, tick) => (
        <line key={tick} x1={20 + tick * 28.2} x2={20 + tick * 28.2} y1="150" y2={tick % 3 ? 152.5 : 154} stroke="#000" strokeWidth=".5" strokeOpacity=".45" />
      ))}
      <Draw d={raw} on={on} ms={900} ease={MOVE} stroke="#000" strokeWidth=".9" strokeOpacity=".4" strokeLinejoin="round" />
      {flows.map((flow, index) => (
        <g key={flow.x}>
          <line x1={flow.x} x2={flow.x} y1="30" y2="150" stroke="#000" strokeWidth=".6" strokeOpacity=".45" strokeDasharray="3 3" className={RM} style={{ ...BOX, transformOrigin: "50% 100%", transform: `scaleY(${on ? 1 : 0})`, ...tr("transform", 500, 500 + index * 120, MOVE) }} />
          <g className={RM} style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : flow.inflow ? -4 : 4}px)`, ...tr("opacity, transform", 360, 700 + index * 120) }}>
            <path d={flow.inflow ? `M${flow.x} 8V26M${flow.x - 4} 21l4 5 4-5` : `M${flow.x} 26V8M${flow.x - 4} 13l4-5 4 5`} fill="none" stroke="#000" strokeWidth="1" />
            <text x={flow.x + 8} y="19" fontSize="8" fill="#000" fillOpacity=".65" fontFamily={mono} letterSpacing=".12em">
              {flow.inflow ? "IN" : "OUT"}
            </text>
          </g>
        </g>
      ))}
      {pieces.map((piece, index) => {
        const at = 1000 + index * 260;
        return (
          <g key={piece.label}>
            <Draw d={piece.d} on={on} ms={520} delay={at} stroke={ORANGE} strokeWidth="2.4" />
            {/* Each piece's own span, measured under it. */}
            <Draw d={`M${piece.from + 3} 128H${piece.to - 3}`} on={on} ms={380} delay={at + 120} stroke="#000" strokeWidth=".6" />
            <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 260, at + 300) }}>
              <path d={`M${piece.from + 6} 125.8L${piece.from + 3} 128L${piece.from + 6} 130.2M${piece.to - 6} 125.8L${piece.to - 3} 128L${piece.to - 6} 130.2`} fill="none" stroke="#000" strokeWidth=".6" />
              <text x={(piece.from + piece.to) / 2} y="142" textAnchor="middle" fontSize="11" fill="#000" fontFamily={mono}>
                {piece.label}
              </text>
            </g>
          </g>
        );
      })}
      <text x="175" y="186" textAnchor="middle" fontSize="11" fill="#000" fontFamily={mono} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 400, 1900) }}>
        (1+r1)(1+r2)(1+r3) - 1
      </text>
    </svg>
  );
}

export function MethodologySection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.35);
  return (
    <section id="methodology" aria-labelledby="methodology-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div ref={ref} className={`${COLUMN} grid grid-cols-1 gap-[56px] py-[120px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-[72px] max-md:py-[80px]`}>
        <div>
          <BracketLabel>Methodology</BracketLabel>
          <h2 id="methodology-heading" className={`mt-[18px] ${SUBHEAD}`}>
            Methodology and Disclaimer
          </h2>
          <div className="mt-[28px]">
            <AsOf />
          </div>
          <p className="mt-[28px] text-[15px] leading-[1.6] text-black/70">{METHOD.text}</p>
          <p className="mt-[20px] border-l-2 border-[#F6A11A] pl-[16px] font-serif text-[clamp(1.25rem,1rem+.7vw,1.6rem)] leading-[1.25]">
            {METHOD.caveat} {METHOD.guarantee}
          </p>
        </div>
        <FigurePanel className="self-center">
          <MethodGlyph on={shown} />
        </FigurePanel>
      </div>
    </section>
  );
}
