"use client";

import type { CSSProperties, SVGProps } from "react";

/*
 * The shared drawing kit for the site's explainer drawings: one engraved,
 * technical-plate language. Hairline construction draws on first, hatching
 * stands in for flat grey, dimension lines and tick-marked axes carry the
 * measure, and orange arrives last as the answer. components/approach/glyphs.tsx
 * is the reference set.
 */

export const ORANGE = "#F6A11A";

/** Strong ease-out for things arriving; ease-in-out for things travelling across the plate. */
export const OUT = "cubic-bezier(.23,1,.32,1)";
export const MOVE = "cubic-bezier(.77,0,.175,1)";

/** Lets `motion-reduce` win over the inline transitions below. */
export const RM = "motion-reduce:!transition-none motion-reduce:!animate-none";

/** An inline transition for the listed properties, so each element can carry its own delay. */
export const tr = (props: string, ms: number, delay = 0, ease = OUT): CSSProperties => ({
  transitionProperty: props,
  transitionDuration: `${ms}ms`,
  transitionDelay: `${delay}ms`,
  transitionTimingFunction: ease,
});

/** Scale transforms on SVG children measure from their own box, not the canvas origin. */
export const BOX: CSSProperties = { transformBox: "fill-box" };

export type GlyphProps = { on: boolean; ink?: string; faint?: string };

/** Diagonal engraving lines, used wherever the old drawings had a flat grey fill. */
export function Hatch({ id, ink, gap = 2.6, angle = 45, opacity = 0.55 }: { id: string; ink: string; gap?: number; angle?: number; opacity?: number }) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <line x1="0" y1="0" x2="0" y2={gap} stroke={ink} strokeWidth=".55" strokeOpacity={opacity} />
    </pattern>
  );
}

/** A stroke that draws itself on when `on`; pathLength=1 means no length has to be measured. */
export function Draw({ d, on, ms, delay = 0, ease = OUT, ...rest }: { d: string; on: boolean; ms: number; delay?: number; ease?: string } & SVGProps<SVGPathElement>) {
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      strokeDasharray="1 1"
      strokeDashoffset={on ? 0 : 1}
      className={RM}
      style={tr("stroke-dashoffset", ms, delay, ease)}
      {...rest}
    />
  );
}

