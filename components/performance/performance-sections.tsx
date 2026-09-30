"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
import { PageIndex, NoScriptReveal } from "@/components/pms-v2/shared";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * /performance, content plan §7: the PMS table beside a bar chart of the same
 * rows, the growth of Rs. 1 Mn drawn as unit squares, the AIF's two periods
 * with the unrun ones left empty, and the method drawn as chained sub-periods.
 * Figures are as of 31 July 2026 (lib/performance.ts).
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

/** The return table: period, ours, benchmark. Hovering or focusing a row lights the same row in the chart. */
function ReturnTable({ rows, names, active, onActive }: { rows: readonly ReturnRow[]; names: { ours: string; benchmark: string }; active: number | null; onActive: (index: number | null) => void }) {
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
      <tbody onMouseLeave={() => onActive(null)}>
        {rows.map((row, index) => {
          const lit = active === index;
          return (
            <tr
              key={row.period}
              tabIndex={0}
              onMouseEnter={() => onActive(index)}
              onFocus={() => onActive(index)}
              onBlur={() => onActive(null)}
              className="border-b border-black/12 transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
              style={{ backgroundColor: lit ? "rgba(246, 161, 26,.10)" : undefined }}
            >
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
          );
        })}
      </tbody>
    </table>
  );
}

/**
 * The same rows as paired horizontal bars around a zero line, so the one
 * negative period reads as falling left of it. A period with no data draws an
 * empty dashed slot marked N/A.
 */
function ReturnBars({ rows, shown, active, onActive }: { rows: readonly ReturnRow[]; shown: boolean; active: number | null; onActive: (index: number | null) => void }) {
  const values = rows.flatMap((row) => [row.ours, row.benchmark]).filter((value): value is number => value !== null);
  const min = Math.min(0, ...values);
  const max = Math.max(...values);
  const W = 380;
  const LABEL = 30;
  // Room left of the bars for a negative value's label.
  const NEG = min < 0 ? 52 : 0;
  const span = W - LABEL - NEG - 64;
  const x = (value: number) => LABEL + NEG + ((value - min) / (max - min)) * span;
  const zero = x(0);
  const ROW = 38;
  const H = rows.length * ROW + 14;
  return (
    <div>
      <div className={`${EYEBROW} mb-[14px] flex flex-wrap gap-x-[18px] gap-y-[6px] text-black/65`} aria-hidden="true">
        <span className="flex items-center gap-[8px]">
          <i className="h-[9px] w-[9px] bg-[#F6A11A]" />
          {PMS_NAMES.ours}
        </span>
        <span className="flex items-center gap-[8px]">
          <i className="h-[9px] w-[9px] bg-black" />
          {PMS_NAMES.benchmark}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={rows.map((row) => `${row.period}: ${PMS_NAMES.ours} ${formatReturn(row.ours)}, ${PMS_NAMES.benchmark} ${formatReturn(row.benchmark)}`).join(". ")} onMouseLeave={() => onActive(null)}>
        <line x1={zero} x2={zero} y1="0" y2={H} stroke="#000" strokeOpacity=".35" />
        {rows.map((row, index) => {
          const top = index * ROW + 6;
          const lit = active === null || active === index;
          const bar = (value: number | null, y: number, fill: string, delay: number) => {
            if (value === null) return <rect x={zero} y={y} width={span * 0.34} height="11" fill="none" stroke="#000" strokeOpacity=".3" strokeDasharray="3 3" />;
            const left = Math.min(zero, x(value));
            const width = Math.abs(x(value) - zero);
            return (
              <>
                <rect
                  x={left}
                  y={y}
                  width={Math.max(1, width)}
                  height="11"
                  fill={fill}
                  style={{ transformBox: "fill-box", transformOrigin: value < 0 ? "100% 50%" : "0% 50%", transform: `scaleX(${shown ? 1 : 0})`, transition: `transform 800ms ${EASE} ${delay}ms` }}
                  className="motion-reduce:!transition-none"
                />
                <text
                  x={value < 0 ? left - 6 : left + width + 6}
                  y={y + 9.5}
                  textAnchor={value < 0 ? "end" : "start"}
                  fontSize="10"
                  fill="#000"
                  fillOpacity=".75"
                  fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                  style={{ opacity: shown ? 1 : 0, transition: `opacity 300ms ease ${delay + 600}ms` }}
                >
                  {formatReturn(value)}
                </text>
              </>
            );
          };
          return (
            <g key={row.period} onMouseEnter={() => onActive(index)} style={{ opacity: lit ? 1 : 0.3, transition: "opacity 200ms ease" }}>
              <rect x="0" y={top - 4} width={W} height={ROW - 4} fill="transparent" />
              <text x="0" y={top + 16} fontSize="10.5" fill="#000" fillOpacity=".7" fontFamily="var(--font-geist-mono), ui-monospace, monospace" letterSpacing=".06em">
                {row.short}
              </text>
              {bar(row.ours, top, ORANGE, index * 70)}
              {bar(row.benchmark, top + 13, "#000", index * 70 + 40)}
              {row.ours === null && (
                <text x={zero + span * 0.34 + 8} y={top + 16} fontSize="10" fill="#000" fillOpacity=".65" fontFamily="var(--font-geist-mono), ui-monospace, monospace">
                  N/A
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function PmsPerformanceSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.25);
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="pms" aria-labelledby="pms-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <SectionHead id="pms" label="PMS" heading="PMS Performance" />
        <div className="mt-[40px]">
          <AsOf />
        </div>
        <div ref={ref} className="mt-[40px] grid grid-cols-1 gap-[56px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[72px]">
          <ReturnTable rows={PMS_ROWS} names={PMS_NAMES} active={active} onActive={setActive} />
          <div className="border border-black/15 p-[28px] max-[600px]:p-[18px]">
            <ReturnBars rows={PMS_ROWS} shown={shown} active={active} onActive={setActive} />
          </div>
        </div>
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

/**
 * The AIF's periods as vertical bar pairs. The fund has run 3 and 6 months;
 * the longer periods are empty dashed slots, drawn at the height they would
 * sit if filled, and marked N/A.
 */
function AifBars({ shown }: { shown: boolean }) {
  const W = 340;
  const H = 220;
  const BASE = 180;
  const values = AIF_ROWS.flatMap((row) => [row.ours ?? 0, row.benchmark ?? 0]);
  const max = Math.max(...values);
  const group = W / AIF_ROWS.length;
  const y = (value: number) => BASE - (value / max) * (BASE - 26);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={AIF_ROWS.map((row) => `${row.period}: ${AIF_NAMES.ours} ${formatReturn(row.ours)}, ${AIF_NAMES.benchmark} ${formatReturn(row.benchmark)}`).join(". ")}>
      <line x1="0" x2={W} y1={BASE} y2={BASE} stroke="#000" strokeOpacity=".4" />
      {AIF_ROWS.map((row, index) => {
        const cx = group * index + group / 2;
        const mono = "var(--font-geist-mono), ui-monospace, monospace";
        if (row.ours === null || row.benchmark === null) {
          return (
            <g key={row.period} style={{ opacity: shown ? 1 : 0, transition: `opacity 500ms ease ${500 + index * 120}ms` }}>
              <rect x={cx - 22} y={BASE - 70} width="44" height="70" fill="none" stroke="#000" strokeOpacity=".3" strokeDasharray="3 3" />
              <text x={cx} y={BASE - 31} textAnchor="middle" fontSize="10" fill="#000" fillOpacity=".65" fontFamily={mono}>
                N/A
              </text>
              <text x={cx} y={BASE + 22} textAnchor="middle" fontSize="11" fill="#000" fillOpacity=".7" fontFamily={mono} letterSpacing=".06em">
                {row.short}
              </text>
            </g>
          );
        }
        const pair = [
          { value: row.ours, fill: ORANGE, dx: -28 },
          { value: row.benchmark, fill: "#000", dx: 6 },
        ];
        return (
          <g key={row.period}>
            {pair.map((bar, b) => (
              <g key={b}>
                <rect
                  x={cx + bar.dx}
                  y={y(bar.value)}
                  width="22"
                  height={BASE - y(bar.value)}
                  fill={bar.fill}
                  style={{ transformBox: "fill-box", transformOrigin: "50% 100%", transform: `scaleY(${shown ? 1 : 0})`, transition: `transform 800ms ${EASE} ${index * 140 + b * 60}ms` }}
                  className="motion-reduce:!transition-none"
                />
                <text
                  x={cx + bar.dx + 11}
                  y={y(bar.value) - 7}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#000"
                  fillOpacity=".75"
                  fontFamily={mono}
                  style={{ opacity: shown ? 1 : 0, transition: `opacity 300ms ease ${index * 140 + 700}ms` }}
                >
                  {bar.value.toFixed(2)}%
                </text>
              </g>
            ))}
            <text x={cx} y={BASE + 22} textAnchor="middle" fontSize="11" fill="#000" fillOpacity=".7" fontFamily={mono} letterSpacing=".06em">
              {row.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function AifPerformanceSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="aif" aria-labelledby="aif-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <SectionHead id="aif" label="AIF" heading="AIF Performance" />
        <div className="mt-[40px]">
          <AsOf />
        </div>
        <div ref={ref} className="mt-[40px] grid grid-cols-1 gap-[2px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="bg-white p-[28px] max-[600px]:p-[18px]">
            <ReturnTable rows={AIF_ROWS} names={AIF_NAMES} active={active} onActive={setActive} />
          </div>
          <div className="bg-white p-[28px] max-[600px]:p-[18px]">
            <div className={`${EYEBROW} mb-[18px] flex flex-wrap gap-x-[18px] gap-y-[6px] text-black/65`} aria-hidden="true">
              <span className="flex items-center gap-[8px]">
                <i className="h-[9px] w-[9px] bg-[#F6A11A]" />
                {AIF_NAMES.ours}
              </span>
              <span className="flex items-center gap-[8px]">
                <i className="h-[9px] w-[9px] bg-black" />
                {AIF_NAMES.benchmark}
              </span>
            </div>
            <AifBars shown={shown} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Time-weighted return, drawn: the portfolio's line is cut at every inflow and
 * outflow, each piece keeps its own return, and the pieces are chained. So the
 * money moving in and out does not count as performance.
 */
function MethodGlyph({ on }: { on: boolean }) {
  const cuts = [120, 230];
  const flows = [
    { x: 120, inflow: true },
    { x: 230, inflow: false },
  ];
  const pieces = [
    { d: "M20 120 C 50 110, 80 104, 120 92", label: "r1", x: 70 },
    { d: "M120 92 C 150 100, 190 84, 230 76", label: "r2", x: 175 },
    { d: "M230 76 C 262 70, 300 56, 330 44", label: "r3", x: 280 },
  ];
  const mono = "var(--font-geist-mono), ui-monospace, monospace";
  return (
    <svg viewBox="0 0 350 200" className="block h-auto w-full" aria-hidden="true">
      <line x1="10" x2="340" y1="150" y2="150" stroke="#000" strokeOpacity=".3" />
      {cuts.map((x) => (
        <line key={x} x1={x} x2={x} y1="30" y2="150" stroke="#000" strokeOpacity={on ? 0.35 : 0} strokeDasharray="3 3" style={{ transition: "stroke-opacity 500ms ease 300ms" }} />
      ))}
      {flows.map((flow) => (
        <g key={flow.x} style={{ opacity: on ? 1 : 0, transition: "opacity 500ms ease 500ms" }}>
          <path d={flow.inflow ? `M${flow.x} 8V26M${flow.x - 5} 20l5 6 5-6` : `M${flow.x} 26V8M${flow.x - 5} 14l5-6 5 6`} fill="none" stroke="#000" strokeWidth="1.4" />
          <text x={flow.x + 9} y="20" fontSize="9" fill="#000" fillOpacity=".6" fontFamily={mono} letterSpacing=".06em">
            {flow.inflow ? "IN" : "OUT"}
          </text>
        </g>
      ))}
      {pieces.map((piece, index) => (
        <g key={piece.label}>
          <path
            d={piece.d}
            fill="none"
            stroke={ORANGE}
            strokeWidth="2.4"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={on ? 0 : 1}
            style={{ transition: `stroke-dashoffset 600ms ${EASE} ${700 + index * 350}ms` }}
            className="motion-reduce:!transition-none"
          />
          <text x={piece.x} y="140" textAnchor="middle" fontSize="11" fill="#000" fontFamily={mono} style={{ opacity: on ? 1 : 0, transition: `opacity 300ms ease ${900 + index * 350}ms` }}>
            {piece.label}
          </text>
        </g>
      ))}
      <text x="175" y="186" textAnchor="middle" fontSize="11" fill="#000" fontFamily={mono} style={{ opacity: on ? 1 : 0, transition: "opacity 400ms ease 1900ms" }}>
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
          <p className="mt-[20px] border-l-2 border-[#F6A11A] pl-[16px] font-serif text-[clamp(1.25rem,1rem+.7vw,1.6rem)] leading-[1.25]">{METHOD.caveat}</p>
        </div>
        <div className="self-center border border-black/15 p-[28px] max-[600px]:p-[18px]">
          <MethodGlyph on={shown} />
        </div>
      </div>
    </section>
  );
}
