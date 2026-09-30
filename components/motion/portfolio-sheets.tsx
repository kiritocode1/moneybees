"use client";

import { PORTFOLIO_APPROACH } from "@/lib/pms-v2";
import StackLoop, { type StackSheet } from "./stack-loop";

/*
 * The plan's five Portfolio Approach lines as stack sheets, each with a
 * drawing of what the line means, laid on the sheet in plane units (a
 * 168 x 168 square, origin at the far corner).
 */

const stroke = (colour: string) => ({ fill: "none", stroke: colour, strokeWidth: 2, strokeLinecap: "round" as const });

/** 15 to 20 stocks: eighteen holdings. */
function Holdings(colour: string) {
  return Array.from({ length: 18 }, (_, index) => (
    <circle key={index} cx={34 + (index % 6) * 20} cy={64 + Math.floor(index / 6) * 20} r={5} fill={colour} />
  ));
}

/** At least three years: a line with a mark at each year. */
function Horizon(colour: string) {
  return (
    <g>
      <line x1={30} y1={84} x2={138} y2={84} {...stroke(colour)} />
      {[30, 66, 102, 138].map((x) => (
        <line key={x} x1={x} y1={76} x2={x} y2={92} {...stroke(colour)} />
      ))}
      <circle cx={138} cy={84} r={6} fill={colour} />
    </g>
  );
}

/** No sector above 30%: sector bars under a dashed cap. */
function Cap(colour: string) {
  return (
    <g>
      {[30, 44, 50, 38, 24].map((height, index) => (
        <rect key={index} x={32 + index * 22} y={128 - height} width={14} height={height} {...stroke(colour)} />
      ))}
      <line x1={24} y1={76} x2={144} y2={76} {...stroke(colour)} strokeDasharray="4 5" />
    </g>
  );
}

/** Quarterly review: a year in four, one quarter marked. */
function Quarters(colour: string) {
  return (
    <g>
      <path d="M 84 84 L 84 40 A 44 44 0 0 1 128 84 Z" fill={colour} />
      <circle cx={84} cy={84} r={44} {...stroke(colour)} />
      <line x1={84} y1={40} x2={84} y2={128} {...stroke(colour)} />
      <line x1={40} y1={84} x2={128} y2={84} {...stroke(colour)} />
    </g>
  );
}

/** Rebalancing and exits: a holding leaving the portfolio. */
function Exit(colour: string) {
  return (
    <g>
      <rect x={30} y={50} width={68} height={68} {...stroke(colour)} />
      <circle cx={64} cy={84} r={6} fill={colour} />
      <line x1={76} y1={84} x2={138} y2={84} {...stroke(colour)} />
      <path d="M 126 72 L 138 84 L 126 96" {...stroke(colour)} />
    </g>
  );
}

const PORTFOLIO_SHEETS: readonly StackSheet[] = [Holdings, Horizon, Cap, Quarters, Exit].map((glyph, index) => ({
  text: PORTFOLIO_APPROACH[index],
  glyph,
}));

/** The Portfolio Approach stack, cycling through the five lines. A client component so the drawings stay functions. */
export default function PortfolioStack() {
  return <StackLoop sheets={PORTFOLIO_SHEETS} label="The five portfolio approach rules" />;
}
