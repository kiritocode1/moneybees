"use client";

import { useInView } from "motion/react";
import { type RefObject, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A figure's build, 0 to 1 over `seconds`, starting the first time `element`
 * comes into view. It reads 0 on the server and on the first client pass, so
 * hydration matches; under reduced motion it lands on 1 at once.
 */
export function useBuild(element: RefObject<Element | null>, seconds: number, amount = 0.35) {
  const inView = useInView(element, { once: true, amount });
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!inView || reduceMotion) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const next = Math.min(1, (now - start) / (seconds * 1000));
      setProgress(next);
      if (next < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, seconds]);
  return reduceMotion ? 1 : progress;
}

/** Share of a staggered part done at build `progress`: part `index` of `count` takes `span` of the build. */
export function stagger(progress: number, index: number, count: number, span = 0.4) {
  const start = count > 1 ? (index / (count - 1)) * (1 - span) : 0;
  const t = Math.min(1, Math.max(0, (progress - start) / span));
  return 1 - (1 - t) ** 3;
}
