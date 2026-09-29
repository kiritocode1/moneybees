"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export const ORANGE = "#F7A11A";
export const EASE = "cubic-bezier(.22,1,.36,1)";

/** Points of a pointy-top hexagon, the lattice cell used across the site. */
export const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/**
 * `shown` flips once the block is `amount` in view. `t(ms, delay)` builds a
 * transition timing that collapses to nothing under reduced motion.
 */
export function useShown<T extends Element>(amount = 0.4) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  const shown = inView || reduce;
  const t = (ms: number, delay = 0) => (reduce ? "0ms" : `${ms}ms ${EASE} ${delay}ms`);
  return { ref, shown, t };
}
