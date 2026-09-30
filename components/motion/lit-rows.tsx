"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/ease";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * movin mv-04076's lit rows (reference/movin-04076/NOTES.md), for returns.
 * Each period is a row: a thin grey pill for the benchmark, and a Moneybee bar
 * that sweeps in from zero, transparent grey to orange, ending in a ringed
 * marker that carries the number. Measured cadence: rows enter 70ms apart,
 * the lit bar fills in 0.6s ease-out, the ring draws in about 0.53s, and the
 * number rises after. The reference's teal-to-yellow ramp is one hue here.
 * A loss fills leftward from zero in grey, never orange.
 */

export type LitRow = { period: string; ours: number | null; benchmark: number | null };

const ENTER = 0.07;
const FILL = 0.6;
const RING = 0.53;
const RING_SIZE = 44;

const pct = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

function Row({ row, index, max, zero, names, reduced }: { row: LitRow; index: number; max: number; zero: number; names: { ours: string; benchmark: string }; reduced: boolean }) {
  // Each row lights as it scrolls in, so tall lists on phones never fill off screen.
  // Rows that arrive together still step 70ms apart, capped so the last is not left waiting.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const shown = reduced || inView;
  const enter = reduced ? 0 : Math.min(index, 3) * ENTER;

  /** Share of the track, from the zero line, that a value covers. The track keeps a fixed right margin, so the number after the ring always fits. */
  const span = (value: number) => (Math.abs(value) / max) * (value < 0 ? zero : 1 - zero);
  const ours = row.ours;
  const loss = ours !== null && ours < 0;

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: enter, ease: EASE_OUT }}
      className="grid grid-cols-[120px_1fr] items-center gap-6 border-b border-b-black/10 py-5 max-[600px]:grid-cols-1 max-[600px]:gap-3"
    >
      <span className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[.1em] text-black/60 uppercase">{row.period}</span>
      <div className="relative mr-[118px] md:mr-[140px]">
        {/* Benchmark: a thin grey pill, the reference's dim row. */}
        <div className="relative h-[6px]">
          {row.benchmark !== null && (
            <motion.div
              initial={false}
              animate={{ scaleX: shown ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : FILL, delay: enter, ease: EASE_OUT }}
              className="absolute top-0 h-full rounded-full bg-[#9D9EA1]/60"
              style={{
                left: `${(row.benchmark < 0 ? zero - span(row.benchmark) : zero) * 100}%`,
                width: `${span(row.benchmark) * 100}%`,
                originX: row.benchmark < 0 ? 1 : 0,
              }}
            />
          )}
        </div>
        <p className="mt-1 text-[12px] text-black/55" style={{ paddingLeft: `${zero * 100}%` }}>
          {names.benchmark} {row.benchmark === null ? "N/A" : pct(row.benchmark)}
        </p>
        {/* Moneybee: the lit bar. */}
        <div className="relative mt-3 h-[44px]">
          {zero > 0 && <span aria-hidden="true" className="absolute top-[-8px] bottom-[-8px] w-px bg-black/15" style={{ left: `${zero * 100}%` }} />}
          {ours === null ? (
            <div
              className="absolute inset-y-0 right-0 flex items-center rounded-full border border-dashed border-black/20 px-5 text-[13px] whitespace-nowrap text-black/55"
              style={{ left: `${zero * 100}%` }}
            >
              {names.ours} N/A
            </div>
          ) : (
            <>
              <motion.div
                initial={false}
                animate={{ scaleX: shown ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : FILL, delay: enter + 0.2, ease: EASE_OUT }}
                className="absolute top-0 h-full rounded-full"
                style={{
                  left: `calc(${(loss ? zero - span(ours) : zero) * 100}% ${loss ? "" : `- ${RING_SIZE / 2}px`})`,
                  width: `calc(${span(ours) * 100}% + ${RING_SIZE / 2}px)`,
                  originX: loss ? 1 : 0,
                  background: loss
                    ? "linear-gradient(to left, rgba(157,158,161,0), rgba(157,158,161,.75))"
                    : "linear-gradient(to right, rgba(157,158,161,0), rgba(246,161,26,.35) 45%, #F6A11A)",
                }}
              />
              {/* The ringed marker at the bar's end. */}
              <div className="absolute top-0 flex h-full items-center" style={{ left: `calc(${(loss ? zero - span(ours) : zero + span(ours)) * 100}% - ${RING_SIZE / 2}px)` }}>
                <svg width={RING_SIZE} height={RING_SIZE} viewBox="0 0 44 44" aria-hidden="true">
                  <circle cx="22" cy="22" r="18" fill="#fff" />
                  <motion.circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke={loss ? "#9D9EA1" : "#F6A11A"}
                    strokeWidth="3"
                    initial={false}
                    animate={{ pathLength: shown ? 1 : 0 }}
                    transition={{ duration: reduced ? 0 : RING, delay: enter + 0.27, ease: EASE_OUT }}
                    style={{ rotate: -90, originX: "50%", originY: "50%" }}
                  />
                </svg>
              </div>
              {/* The number follows a gain's ring; a loss's number sits just right of the zero line, where there is room at any width. */}
              <motion.span
                initial={false}
                animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: reduced ? 0 : 0.5, delay: enter + 0.75, ease: EASE_OUT }}
                className={`absolute top-0 flex h-full items-center font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-none whitespace-nowrap tabular-nums ${loss ? "text-black/60" : ""}`}
                style={{ left: `calc(${(zero + (loss ? 0 : span(ours))) * 100}% + ${loss ? 14 : RING_SIZE / 2 + 12}px)` }}
              >
                {pct(ours)}
              </motion.span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * The rows. The scale is shared, so bars compare across periods. When any
 * value is negative, the zero line moves in from the left to make room.
 */
export default function LitRows({ rows, names }: { rows: readonly LitRow[]; names: { ours: string; benchmark: string } }) {
  const values = rows.flatMap((row) => [row.ours, row.benchmark]).filter((value): value is number => value !== null);
  const max = Math.max(...values.map(Math.abs));
  const zero = values.some((value) => value < 0) ? 0.2 : 0;
  const reduced = useReducedMotion();
  return (
    <div className="border-t border-t-black/10">
      {rows.map((row, index) => (
        <Row key={row.period} row={row} index={index} max={max} zero={zero} names={names} reduced={reduced} />
      ))}
    </div>
  );
}
