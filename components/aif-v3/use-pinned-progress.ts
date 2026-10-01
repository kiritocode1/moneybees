"use client";

import { type RefObject, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** The width from which the AIF sections pin and scrub; below it they stack and show their final state. */
const PIN_QUERY = "(min-width: 768px)";

/**
 * Scroll progress through a pinned section: 0 when its top reaches the top
 * of the viewport, 1 when its bottom reaches the bottom. Below 768px and
 * under reduced motion the section does not pin: `pinned` is false and
 * progress is 1, so the figure shows its end state. Read once per frame.
 */
export function usePinnedProgress(ref: RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(true);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const section = ref.current;
      if (!section) return;
      if (reduce || !window.matchMedia(PIN_QUERY).matches) {
        setPinned(false);
        setProgress(1);
        return;
      }
      setPinned(true);
      const rect = section.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      setProgress(span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, reduce]);
  return { progress, pinned };
}

/** Maps `progress` inside [from, to] onto 0 to 1, clamped, with an ease-out. */
export function stage(progress: number, from: number, to: number) {
  const t = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return 1 - Math.pow(1 - t, 3);
}
