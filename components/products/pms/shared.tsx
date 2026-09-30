"use client";

import { useInView } from "motion/react";
import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, DashedRule, Rise, SUBHEAD } from "@/components/hero/editorial";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export const ORANGE = "#F6A11A";
export const GREY = "#9D9EA1";
export const MONO = "font-[family-name:var(--font-geist-mono)]";
/** The pyramid's ink edge, shared by every solid on the page. */
export const EDGE = "rgba(0,0,0,.72)";
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Whether a figure has come into view (once), and a transition builder that
 * zeroes every duration and delay under reduced motion. The render output never
 * branches on the motion setting, so the server and first client render match;
 * a reduced-motion viewer simply sees the finished state the moment it is in view.
 */
export function useReveal<T extends Element>(amount = 0.35): {
  ref: RefObject<T | null>;
  run: boolean;
  at: (delay: number, duration?: number) => { duration: number; delay: number; ease: typeof EASE };
  reduceMotion: boolean;
} {
  const ref = useRef<T>(null);
  const run = useInView(ref, { once: true, amount });
  const reduceMotion = useReducedMotion();
  const at = (delay: number, duration = 0.7) => ({
    duration: reduceMotion ? 0 : duration,
    delay: reduceMotion ? 0 : delay,
    ease: EASE,
  });
  return { ref, run, at, reduceMotion };
}

/** A section's opening on the page column: the square label, the deck line as the heading, and an optional lead. */
export function PmsSectionHead({
  id,
  label,
  heading,
  wide = false,
  children,
}: {
  id: string;
  label: string;
  heading: string;
  /** For a heading that is a full sentence, so it holds three lines rather than five. */
  wide?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_.8fr] items-end gap-x-[60px] gap-y-[28px] max-[900px]:grid-cols-1">
      <Rise onView>
        <BracketLabel>{label}</BracketLabel>
        <h2 id={`${id}-heading`} className={`mt-[18px] ${wide ? "max-w-[26ch]" : "max-w-[18ch]"} ${SUBHEAD}`}>
          {heading}
        </h2>
      </Rise>
      {children && (
        <Rise onView delay={0.08}>
          {children}
        </Rise>
      )}
    </div>
  );
}

/** One section on the page column, opened by a dashed rule. */
export function PmsSection({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`bg-white text-black ${className}`}>
      <DashedRule />
      <div className={`${COLUMN} py-[110px] max-md:py-[72px]`}>{children}</div>
    </section>
  );
}

/**
 * 0 to 1 over `duration` seconds after `delay`, eased out, starting once `run`
 * is true. For figures whose geometry (not just a transform) follows the
 * animation. Under reduced motion it reads 1 as soon as `run` is true.
 */
export function useTween(run: boolean, duration: number, delay = 0) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run || reduceMotion) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      const t = Math.min(1, Math.max(0, ((now - start) / 1000 - delay) / duration));
      setValue(1 - (1 - t) ** 3);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduceMotion, duration, delay]);
  return run && reduceMotion ? 1 : value;
}
