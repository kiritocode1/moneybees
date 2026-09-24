"use client";

import { useInView, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ORANGE } from "./fact-section";

/*
 * The time-based pieces taken from the movin.design split-frame reference
 * (reference/movin-03635/NOTES.md). Timings in this file are the ones measured
 * there, so a change here should be checked against those notes.
 */

/** Seconds since `element` first came into view. `loop` wraps it; under reduced motion it jumps to `settle`. */
export function useStageClock(element: React.RefObject<Element | null>, settle: number, loop?: number) {
  const inView = useInView(element, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [seconds, setSeconds] = useState(0);
  const started = useRef<number | null>(null);
  useEffect(() => {
    if (reduceMotion || !inView) return;
    let raf = 0;
    const tick = (now: number) => {
      started.current ??= now;
      const elapsed = (now - started.current) / 1000;
      setSeconds(loop ? elapsed % loop : Math.min(elapsed, settle));
      if (loop || elapsed < settle) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, settle, loop]);
  return reduceMotion ? settle : seconds;
}

/** Deterministic 0..1 noise, so server and client lay out the same field. */
const noise = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return Math.round((value - Math.floor(value)) * 1e4) / 1e4;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Words of `text` revealed at `perWord` seconds each from `from`. The newest word is returned separately so it can land grey. */
export function typedWords(text: string, seconds: number, from: number, perWord: number) {
  const words = text.split(" ");
  const count = Math.max(0, Math.min(words.length, Math.floor((seconds - from) / perWord) + 1));
  const done = count === words.length && seconds - from >= words.length * perWord;
  // The newest word lands grey and darkens when the next arrives; once the last has had its turn, all of it is ink.
  if (done) return { settled: text, newest: "", done };
  return { settled: words.slice(0, Math.max(0, count - 1)).join(" "), newest: count ? words[count - 1] : "", done };
}

const COLS = 21;
const ROWS = 12;
const PITCH = 30;
const DOT = 12;

/**
 * The dot field. A square lattice fills in random order around a band kept
 * clear for a sentence, which types in word by word; about one cell in twelve
 * is a hollow outline. Moneybee's version then culls the field: every dot but
 * `keep` falls away and the survivors turn orange, so the field shows the
 * narrowing the sentence states.
 *
 * Timeline (s): fill 0 to 1.1, typing from 0.1 at 150 ms a word, hold,
 * ripple at 2.3, cull 2.5 to 3.7.
 */
export function DotField({ sentence, keep }: { sentence: string; keep: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useStageClock(ref, 4);
  // The band is sized to the finished sentence from the first frame, as in the reference.
  const bandCols = Math.min(COLS - 2, Math.ceil((sentence.length * 8.4 + 36) / PITCH));
  const bandRow = 5;
  const cells: { id: number; row: number; col: number; appear: number; hollow: boolean; keeps: boolean; leave: number }[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const inBand = (row === bandRow || row === bandRow + 1) && col >= 1 && col < 1 + bandCols;
      if (inBand) continue;
      const id = row * COLS + col;
      cells.push({ id, row, col, appear: noise(id) * 1.1, hollow: noise(id + 3) < 0.085, keeps: false, leave: 2.5 + noise(id + 11) * 1.2 });
    }
  }
  // Exactly `keep` survivors, picked by a fixed noise order so they scatter across the field.
  [...cells].sort((a, b) => noise(a.id + 7) - noise(b.id + 7)).slice(0, keep).forEach((cell) => {
    cell.keeps = true;
  });
  const { settled, newest } = typedWords(sentence, t, 0.1, 0.15);

  return (
    <div ref={ref} className="relative aspect-[640/360] w-full overflow-hidden bg-[#F4F3F0] [container-type:inline-size]">
      <svg viewBox="0 0 640 360" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {cells.map((cell) => {
          if (t < cell.appear) return null;
          const gone = !cell.keeps && t > cell.leave;
          if (gone) {
            const out = clamp01((t - cell.leave) / 0.25);
            if (out >= 1) return null;
          }
          const shrink = gone ? 1 - clamp01((t - cell.leave) / 0.25) : 1;
          // A ripple bends the rows once before the cull, as the reference does on its exit.
          const ripple = t > 2.25 && t < 2.5 ? Math.sin((cell.col / COLS) * Math.PI * 2 + (t - 2.25) * 20) * 5 * (cell.row < bandRow ? 1 : 0) : 0;
          const lit = cell.keeps && t > 2.9;
          const cx = cell.col * PITCH + PITCH / 2 + 5;
          const cy = cell.row * PITCH + PITCH / 2 + ripple;
          return cell.hollow && !cell.keeps ? (
            <circle key={cell.id} cx={cx} cy={cy} r={DOT * shrink} fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="1" />
          ) : (
            <circle key={cell.id} cx={cx} cy={cy} r={DOT * shrink} fill={lit ? ORANGE : "#000"} style={{ transition: "fill 400ms ease" }} />
          );
        })}
      </svg>
      <p
        // Sized off the panel so the sentence fills the band the field keeps clear for it.
        className="absolute text-[2.75cqw] tracking-[-.015em] whitespace-nowrap text-[#000000]"
        style={{ left: `${(1.5 * PITCH) / 6.4}%`, top: `${((bandRow + 1) * PITCH) / 3.6}%`, transform: "translateY(-50%)" }}
      >
        {settled} {newest && <span className="text-[rgba(0,0,0,.4)]">{newest}</span>}
      </p>
    </div>
  );
}

/**
 * The bracket caption. A single dot, then a closed orange "[]" that opens,
 * then words added one at a time inside brackets that stay centred. From the
 * second word, grey copies tile behind in three staggered rows; their step is
 * the finished caption's width, so they close into a seamless ribbon exactly
 * as the last word lands.
 *
 * Timeline (s): dot 0 to 0.5, "[]" to 0.57, "[ ]" to 0.64, first word, then
 * 270 ms a word, hold 1.2, and repeat when `loop` is set.
 */
export function BracketCaption({ text, loop = false, className = "" }: { text: string; loop?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  const words = text.split(" ");
  const last = 0.64 + (words.length - 1) * 0.27;
  const t = useStageClock(ref, last, loop ? last + 1.4 : undefined);
  useLayoutEffect(() => {
    if (measure.current) setStep(measure.current.offsetWidth + 14);
  }, [text]);

  const count = t < 0.64 ? 0 : Math.min(words.length, Math.floor((t - 0.64) / 0.27) + 1);
  const shown = words.slice(0, count).join(" ");
  const echoes = count >= 2 ? clamp01((t - 0.64 - 0.27) / 0.15) : 0;
  const caption = (tone: "main" | "echo", body: string) => (
    <>
      <span style={{ color: tone === "main" ? ORANGE : undefined }}>[</span>
      {body ? ` ${body} ` : t < 0.57 ? "" : " "}
      <span style={{ color: tone === "main" ? ORANGE : undefined }}>]</span>
    </>
  );

  return (
    <div ref={ref} className={`relative h-[6em] overflow-hidden text-[clamp(16px,1.7vw,24px)] tracking-[-.015em] ${className}`} aria-label={text}>
      <span ref={measure} className="invisible absolute whitespace-nowrap" aria-hidden="true">
        [ {text} ]
      </span>
      {t < 0.5 ? (
        <span className="absolute top-1/2 left-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#000]" />
      ) : (
        <div aria-hidden="true">
          {[-1, 0, 1].map((row) =>
            [-3, -2, -1, 0, 1, 2, 3].map((k) => {
              const offset = k * step + (row === 0 ? 0 : step / 2) * (row === -1 ? -1 : 1);
              const main = row === 0 && k === 0;
              if (!main && echoes === 0) return null;
              return (
                <span
                  key={`${row}:${k}`}
                  className="absolute top-1/2 left-1/2 whitespace-nowrap"
                  style={{
                    transform: `translate(calc(-50% + ${offset}px), calc(-50% + ${row * 1.5}em))`,
                    color: main ? "#000" : "rgba(0,0,0,.2)",
                    opacity: main ? 1 : echoes,
                  }}
                >
                  {caption(main ? "main" : "echo", shown)}
                </span>
              );
            }),
          )}
        </div>
      )}
    </div>
  );
}

/**
 * The hairline split frame: panels on a 1px grid gap over ink, so every line
 * between neighbours is drawn by the gap, with a small orange square fixed
 * where the lines cross. It stands in for the reference's logo tile, using the
 * square from Moneybee's wordmark.
 */
export function SplitFrame({ children, cross = true }: { children: ReactNode; cross?: boolean }) {
  return (
    <div className="relative grid grid-cols-2 gap-px border-y border-y-[#000] bg-[#000] max-[900px]:grid-cols-1">
      {children}
      {cross && (
        <span className="pointer-events-none absolute top-1/2 left-1/2 z-[1] h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 bg-[#F7A11A] max-[900px]:hidden" />
      )}
    </div>
  );
}

/** One panel of a split frame. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`relative min-h-[380px] overflow-hidden bg-white ${className}`}>{children}</div>;
}
