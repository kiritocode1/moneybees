"use client";

import { useRef } from "react";
import { PERIOD_RETURNS, RECORD_METHOD, RECORD_SOURCE, WEALTH } from "@/lib/insights";
import { BracketLabel, Eyebrow, r2, SectionFooter, SectionHeading } from "./fact-section";
import { Panel, SplitFrame, useStageClock } from "./motion-language";

/** ₹ in lakh, written the way the deck writes it: lakh below a crore, crore above. */
function rupees(lakh: number) {
  if (lakh >= 100) return `₹${(lakh / 100).toFixed(3)} crore`;
  return `₹${lakh.toFixed(1).replace(/\.0$/, "")} lakh`;
}

const pct = (value: number) => `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(2)}%`;
const pp = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(2)} pp`;

const RING_DOTS = 20;
const COUNT_FOR = 2.6;

/**
 * The reference's ring: dots on a tilted ellipse, turning, near dots larger
 * than far ones and a few hollow or white. Twenty of them, one per holding in
 * a typical portfolio. The figure in the middle counts the ₹10 lakh up to its
 * July 2026 value once, then holds, while the ring keeps turning.
 */
function RingPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const spin = useStageClock(ref, 0, 1000);
  const count = useStageClock(ref, COUNT_FOR);
  const eased = 1 - (1 - Math.min(1, count / COUNT_FOR)) ** 3;
  const value = WEALTH.start + (WEALTH.queenbee - WEALTH.start) * eased;
  const dots = Array.from({ length: RING_DOTS }, (_, index) => {
    const angle = (index / RING_DOTS) * Math.PI * 2 + spin * 0.35;
    const depth = (Math.sin(angle) + 1) / 2;
    return { index, x: r2(320 + Math.cos(angle) * 210), y: r2(190 + Math.sin(angle) * 92), r: r2(5 + depth * 9), depth };
  }).sort((a, b) => a.depth - b.depth);

  return (
    <div ref={ref} className="h-full">
      <div className="relative z-[1] p-[28px] max-[600px]:p-[20px]">
        <BracketLabel>Queenbee PMS, 1 August 2007 to 31 July 2026</BracketLabel>
      </div>
      <svg viewBox="0 0 640 380" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {dots.map(({ index, x, y, r }) =>
          index % 7 === 3 ? (
            <circle key={index} cx={x} cy={y} r={r} fill="#fff" stroke="rgba(0,0,0,.35)" />
          ) : (
            <circle key={index} cx={x} cy={y} r={r} fill="#000" />
          ),
        )}
      </svg>
      <div className="absolute inset-x-0 top-1/2 -translate-y-[40%] text-center">
        <strong className="block text-[clamp(1.6rem,2.6vw,2.6rem)] font-light tracking-[-.04em] tabular-nums">{rupees(value)}</strong>
        <span className="mt-[6px] block text-[10px] text-[rgba(0,0,0,.55)]">from ₹10 lakh</span>
      </div>
      <p className="absolute right-[28px] bottom-[22px] left-[28px] flex justify-between gap-[20px] text-[11px] text-[rgba(0,0,0,.65)] max-[600px]:flex-col max-[600px]:gap-[4px]">
        <span>The same ₹10 lakh in the S&amp;P BSE 500 TRI: {rupees(WEALTH.benchmark)}</span>
        <span className="text-[#000000]">{(WEALTH.queenbee / WEALTH.benchmark).toFixed(2)}× the index</span>
      </p>
    </div>
  );
}

const PER_ROW = 1.3;

/**
 * The reference's ticker: return figures too large for the panel, cropped at
 * its right edge, each new period landing on top and pushing the others down.
 * The period and the benchmark sit on the status line beside it. Every period
 * in the table comes through, the one-year loss included.
 */
function TickerPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useStageClock(ref, 0, PER_ROW * PERIOD_RETURNS.length);
  const current = Math.floor(t / PER_ROW) % PERIOD_RETURNS.length;
  const settle = Math.min(1, (t % PER_ROW) / 0.35);
  const push = 1 - (1 - settle) ** 3;
  const rows = [0, 1, 2].map((back) => PERIOD_RETURNS[(current - back + PERIOD_RETURNS.length) % PERIOD_RETURNS.length]);
  const { period, benchmark } = PERIOD_RETURNS[current];

  return (
    <div ref={ref} className="h-full">
      <div className="relative z-[1] grid gap-[10px] p-[28px] max-[600px]:p-[20px]">
        <BracketLabel>{period}</BracketLabel>
        <span className="text-[11px] text-[rgba(0,0,0,.6)]">S&amp;P BSE 500 TRI over the same period: {pct(benchmark)}</span>
      </div>
      <div className="absolute right-[-0.3em] bottom-[-0.1em] text-right" aria-hidden="true">
        {rows.map((row, depth) => (
          <strong
            key={`${row.period}:${depth}`}
            className="block text-[clamp(4.4rem,8.6vw,8.8rem)] leading-[.96] font-normal tracking-[-.05em] tabular-nums whitespace-nowrap"
            style={{
              opacity: depth === 0 ? push : 1 - depth * 0.3,
              transform: `translateY(${(1 - push) * -40}%)`,
            }}
          >
            {pct(row.queenbee)}
          </strong>
        ))}
      </div>
    </div>
  );
}

function PeriodTable() {
  return (
    <table className="w-full border-collapse text-left text-[13px]">
      <thead>
        <tr className="border-b border-b-[rgba(0,0,0,.25)] text-[9px] uppercase tracking-[.1em] text-[rgba(0,0,0,.55)]">
          <th className="py-[10px] font-normal">Period</th>
          <th className="py-[10px] text-right font-normal">Queenbee</th>
          <th className="py-[10px] text-right font-normal">S&amp;P BSE 500 TRI</th>
          <th className="py-[10px] text-right font-normal">Difference</th>
        </tr>
      </thead>
      <tbody>
        {PERIOD_RETURNS.map(({ period, queenbee, benchmark }) => (
          <tr key={period} className="border-b border-b-[rgba(0,0,0,.13)]">
            <td className="py-[12px]">{period}</td>
            <td className="py-[12px] text-right tabular-nums">{pct(queenbee)}</td>
            <td className="py-[12px] text-right tabular-nums text-[rgba(0,0,0,.6)]">{pct(benchmark)}</td>
            <td className="py-[12px] text-right tabular-nums">{pp(queenbee - benchmark)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Section D, time-based. The ring counts the ₹10 lakh to its July 2026 value
 * beside the returns ticker, then the full table and the method sit below as
 * plain content. Sits before the chapter stack and takes over its third card.
 */
export default function RecordSection() {
  return (
    <section id="record" aria-labelledby="record-heading" className="bg-white">
      <SectionHeading
        id="record"
        label="The record"
        heading="What ₹10 lakh became"
        lead="Queenbee, Moneybee's PMS, measured against the S&P BSE 500 TRI. It compounded at 19.44% a year against 9.90%."
      />
      <div className="mt-[72px]">
        <SplitFrame>
          <Panel className="min-h-[440px]">
            <RingPanel />
          </Panel>
          <Panel className="min-h-[440px]">
            <TickerPanel />
          </Panel>
        </SplitFrame>
      </div>
      <div className="grid grid-cols-[1fr_.7fr] gap-[80px] px-[max(32px,calc((100vw_-_1480px)/2))] pt-[72px] pb-[90px] max-[900px]:grid-cols-1 max-[900px]:gap-[40px] max-[600px]:px-[22px]">
        <div>
          <Eyebrow>Every period, as at 31 July 2026</Eyebrow>
          <div className="mt-[18px]">
            <PeriodTable />
          </div>
        </div>
        <div>
          <Eyebrow>How the figures are measured</Eyebrow>
          <p className="mt-[18px] text-[13px] leading-[1.6] text-[rgba(0,0,0,.72)]">{RECORD_METHOD}</p>
        </div>
      </div>
      <SectionFooter
        caveat="Past performance is not indicative of future results. These are the figures of Queenbee PMS, not of the Flyingbee AIF, which declared its first close in October 2025."
        source={RECORD_SOURCE}
      />
    </section>
  );
}
