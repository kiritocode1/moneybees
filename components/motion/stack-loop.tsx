"use client";

import { motion, useInView } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/ease";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * movin mv-04122's isometric stack (reference/movin-04122/NOTES.md), in
 * Moneybee's colours. Flat sheets sit docked in a 2:1 dimetric stack; one
 * sheet turns orange, slides out along the iso x axis, holds, and slides
 * back. Measured moves: out 1.2s ease-out, hold 1.7s, back 1.2s ease-in-out.
 * The reference rests 2.7s docked because it has one sheet; with several, the
 * next sheet starts 0.3s after the last one docks, so a lit sheet is never buried. Each sheet carries a drawing of what it stands for and
 * slides far enough to clear the stack, so the drawing reads. The words sit
 * beside the stack, the lit line in ink.
 */

export type StackSheet = {
  /** The line beside the stack. */
  text: string;
  /** A drawing on the sheet's top face, in plane units: a SIDE x SIDE square, origin at the far corner. */
  glyph: (colour: string) => ReactNode;
};

const CYCLE = 4.4;
/** Keyframe times: out ends 1.2s, hold ends 2.9s, back ends 4.1s, then 0.3s before the next sheet. */
const TIMES = [0, 1.2 / CYCLE, 2.9 / CYCLE, 4.1 / CYCLE, 1];
const EASES = [EASE_OUT, "linear", EASE_IN_OUT, "linear"] as const;

/** Sheet geometry in viewBox px: half width, half depth (2:1), edge thickness, docked gap. */
const W = 150;
const D = 75;
const T = 9;
const GAP = 34;
/** The top face as a plane square: its side, in plane units. */
export const SIDE = 168;
/** Far enough along the iso x axis that the lit sheet's face clears the stack. */
const OUT = { x: 200, y: 100 };

const GREY = "#DADADA";
const ORANGE = "#F6A11A";
const TINT = "#FDECD1";

const TOP = `M 0 ${-D} L ${W} 0 L 0 ${D} L ${-W} 0 Z`;
const EDGE = `M ${-W} 0 L 0 ${D} L ${W} 0 L ${W} ${T} L 0 ${D + T} L ${-W} ${T} Z`;
/** Maps plane units onto the top face, origin at its far (top) corner. */
const ON_PLANE = `translate(0 ${-D}) matrix(0.894 0.447 -0.894 0.447 0 0)`;

function Sheet({ sheet, lit }: { sheet: StackSheet; lit: boolean }) {
  return (
    <g>
      <path d={EDGE} fill={lit ? ORANGE : "#fff"} stroke={lit ? ORANGE : GREY} strokeWidth={1.5} strokeLinejoin="round" />
      <path d={TOP} fill={lit ? TINT : "#fff"} stroke={lit ? ORANGE : GREY} strokeWidth={1.5} strokeLinejoin="round" />
      <g transform={ON_PLANE}>{sheet.glyph(lit ? "#000" : "#C9C9CB")}</g>
    </g>
  );
}

/**
 * The stack and its list. With `lit` it holds that sheet out; without it the
 * lit sheet advances every 4.4s while on screen. Under reduced motion the
 * first sheet shows out and still.
 */
export default function StackLoop({ sheets, lit, label }: { sheets: readonly StackSheet[]; lit?: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [cycled, setCycled] = useState(0);
  const cycling = lit === undefined && !reduced;

  useEffect(() => {
    if (!cycling || !inView) return;
    const timer = window.setInterval(() => setCycled((current) => (current + 1) % sheets.length), CYCLE * 1000);
    return () => window.clearInterval(timer);
  }, [cycling, inView, sheets.length]);

  const active = lit ?? cycled;
  const top = D + 12;
  const height = top + (sheets.length - 1) * GAP + OUT.y + D + T + 12;
  const still = reduced || lit !== undefined || !inView;

  return (
    <div ref={ref} className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
      <svg viewBox={`${-W - 10} 0 ${2 * W + OUT.x + 20} ${height}`} role="img" aria-label={label} className="block h-auto w-full overflow-visible">
        {/* Top sheet drawn last so it sits over the rest. */}
        {sheets
          .map((sheet, index) => ({ sheet, index }))
          .reverse()
          .map(({ sheet, index }) => (
            <motion.g
              key={index === active && !still ? `${index}-${cycled}` : index}
              initial={false}
              animate={
                index !== active
                  ? { x: 0, y: 0 }
                  : still
                    ? { x: OUT.x, y: OUT.y }
                    : { x: [0, OUT.x, OUT.x, 0, 0], y: [0, OUT.y, OUT.y, 0, 0] }
              }
              transition={still ? { duration: reduced ? 0 : 1.2, ease: EASE_OUT } : { duration: CYCLE, times: TIMES, ease: [...EASES] }}
            >
              <g transform={`translate(0 ${top + index * GAP})`}>
                <Sheet sheet={sheet} lit={index === active} />
              </g>
            </motion.g>
          ))}
      </svg>
      <ol className="m-0 list-none border-t border-t-black/10 p-0">
        {sheets.map((sheet, index) => (
          <li
            key={sheet.text}
            className={`flex gap-4 border-b border-b-black/10 py-4 text-[16px] leading-[1.45] transition-colors duration-500 ${index === active ? "text-black" : "text-black/40"}`}
          >
            {sheet.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
