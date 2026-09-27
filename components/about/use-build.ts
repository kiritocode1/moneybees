"use client";

import { useInView } from "motion/react";
import { type RefObject, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Build progress for a figure that draws itself once: 0 until `ref` comes into
 * view, then 0 to 1 over `durationMs`. It reads 0 on the server and the first
 * client pass alike, so hydration matches; under reduced motion it lands on 1
 * in the first frame after the figure is seen.
 */
export function useBuild(ref: RefObject<Element | null>, durationMs: number, amount = 0.35) {
  const inView = useInView(ref, { once: true, amount });
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const next = reduceMotion ? 1 : Math.min((now - start) / durationMs, 1);
      setProgress(next);
      if (next < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, durationMs]);

  return progress;
}

/** Hexagon corner points, flat top, circumradius `r`, as an SVG points string. */
export function hexPoints(x: number, y: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return `${(x + r * Math.cos(angle)).toFixed(2)},${(y + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}
