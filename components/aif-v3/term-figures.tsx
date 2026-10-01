"use client";

import type { ReactNode } from "react";
import type { KEY_TERMS } from "@/lib/aif-v2";

type TermGlyph = typeof KEY_TERMS[number]["glyph"];

/** Exact illustration geometry from reference/visual-language/04/moneybee.svg. */
const ART: Record<TermGlyph, { viewBox: string; drawing: ReactNode }> = {
  minimum: { viewBox: "68.5 198.5 100 100", drawing: <>
    <rect x="84.7" y="214.6" width="67.60000000000001" height="67.79999999999998" rx="13" fill="none" stroke="#FFFFFF" strokeWidth="1.35" />
    <ellipse cx="118.5" cy="230.6" rx="21.35" ry="5.8" fill="none" stroke="#FFFFFF" strokeWidth="1.36" />
    <path d="M97.15 230.60 V266.21 M139.85 230.60 V266.21" stroke="#FFFFFF" strokeWidth="1.36" fill="none" />
    <path d="M97.15 242.47 A21.35 5.8 0 0 0 139.85 242.47" stroke="#FFFFFF" strokeWidth="1.36" fill="none" />
    <path d="M97.15 254.34 A21.35 5.8 0 0 0 139.85 254.34" stroke="#FFFFFF" strokeWidth="1.36" fill="none" />
    <path d="M97.15 266.21 A21.35 5.8 0 0 0 139.85 266.21" stroke="#F6A11A" strokeWidth="1.36" fill="none" />
  </> },
  horizon: { viewBox: "234.6 198.5 100 100", drawing: <>
    <path d="M239.60000000000002 248.5 H329.6" stroke="#FFFFFF" strokeWidth="1.36" />
    <path d="M239.60 243.5 V253.5" stroke="#FFFFFF" strokeWidth="1.36" />
    <path d="M257.60 243.5 V253.5" stroke="#FFFFFF" strokeWidth="1.36" />
    <path d="M275.60 243.5 V253.5" stroke="#FFFFFF" strokeWidth="1.36" />
    <path d="M293.60 243.5 V253.5" stroke="#FFFFFF" strokeWidth="1.36" />
    <path d="M311.60 243.5 V253.5" stroke="#FFFFFF" strokeWidth="1.36" />
    <path d="M329.60 243.5 V253.5" stroke="#FFFFFF" strokeWidth="1.36" />
    <path d="M293.60 248.5 H329.60" stroke="#F6A11A" strokeWidth="4" strokeLinecap="round" />
  </> },
  universe: { viewBox: "395.7 198.5 110 100", drawing: <>
    <rect x="398.44999999999993" y="236.25" width="24.5" height="24.5" rx="6" fill="#F6A11A" />
    <rect x="460.40" y="219.20" width="16.6" height="16.6" rx="3.2" fill="none" stroke="#FFFFFF" strokeWidth="1.1" />
    <rect x="482.40" y="240.20" width="16.6" height="16.6" rx="3.2" fill="none" stroke="#FFFFFF" strokeWidth="1.1" />
    <rect x="444.40" y="256.20" width="16.6" height="16.6" rx="3.2" fill="none" stroke="#FFFFFF" strokeWidth="1.1" strokeDasharray="2.2 2" />
    <path d="M423.20 241.90 L453.01 231.12" stroke="#FFFFFF" strokeWidth="1.1" fill="none" />
    <path d="M423.20 248.50 L474.30 248.50" stroke="#FFFFFF" strokeWidth="1.1" fill="none" />
    <path d="M423.20 254.90 L436.10 259.33" stroke="#FFFFFF" strokeWidth="1.1" fill="none" />
  </> },
  benchmark: { viewBox: "577.3 198.5 100 100", drawing: <>
    <g fill="none" stroke="#FFFFFF" strokeWidth="1.0"><path d="M601.3 248.5 C639.3 248.5 621.3 209.25 665.3 209.25 L671.3 209.25" /><path d="M601.3 248.5 C639.3 248.5 621.3 223.62 665.3 223.62 L671.3 223.62" /><path d="M601.3 248.5 C639.3 248.5 621.3 235.52 665.3 235.52 L671.3 235.52" /><path d="M601.3 248.5 C639.3 248.5 621.3 261.52 665.3 261.52 L671.3 261.52" /><path d="M601.3 248.5 C639.3 248.5 621.3 273.40 665.3 273.40 L671.3 273.40" /><path d="M601.3 248.5 C639.3 248.5 621.3 287.71 665.3 287.71 L671.3 287.71" /></g>
    <path d="M582.9 248.5 L671.3 248.5" stroke="#F6A11A" strokeWidth="1.3" fill="none" />
    <path d="M582.3 248.5 L586.3 245.9 L586.3 251.1 Z" fill="#F6A11A" />
  </> },
  exit: { viewBox: "739.9 198.5 100 100", drawing: <>
    <path d="M802.9 239.5 V231.5 A11 11 0 0 0 791.9 220.5 H757.9 A11 11 0 0 0 746.9 231.5 V265.5 A11 11 0 0 0 757.9 276.5 H791.9 A11 11 0 0 0 802.9 265.5 V257.5" fill="none" stroke="#FFFFFF" strokeWidth="1.36" />
    <circle cx="762.9" cy="248.5" r="2.2" fill="#FFFFFF" />
    <g stroke="#F6A11A" fill="#F6A11A"><path d="M766.90 248.50 L819.90 248.50" stroke="#F6A11A" strokeWidth="1.6" fill="none" /><path d="M824.90 248.50 L819.90 251.70 L819.90 245.30 Z" fill="#F6A11A" /></g>
  </> },
};

/**
 * One term's line drawing from study 04, wiped on from the left once its card
 * is in view; static under reduced motion.
 */
export function TermFigure({ glyph, on }: { glyph: TermGlyph; on: boolean }) {
  const art = ART[glyph];
  return (
    <svg
      viewBox={art.viewBox}
      aria-hidden="true"
      focusable="false"
      className="block w-full overflow-visible transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none motion-reduce:[clip-path:none]"
      style={{ clipPath: on ? "inset(-10% -10% -10% -10%)" : "inset(-10% 110% -10% -10%)" }}
    >
      {art.drawing}
    </svg>
  );
}
