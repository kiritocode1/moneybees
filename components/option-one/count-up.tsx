"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "@/lib/ease";

/**
 * A figure that counts up once, the first time it is scrolled into view.
 *
 * The number is held in a MotionValue rather than React state so the tween runs
 * off the main render loop: sixty state updates a second would re-render the
 * whole stat panel, and the panel sits inside a sticky container that is already
 * being composited every frame.
 *
 * Server markup renders the target, not zero. A visitor without JavaScript, or
 * one who lands mid-page with the section already past, still sees the real
 * figure rather than a permanent "0". The effect resets it to zero and animates
 * only once it knows the element is both hydrated and on screen.
 */
export default function CountUp({
  to,
  duration = 1.7,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(to);
  // en-IN so a five-figure number would group as 1,00,000 rather than 100,000.
  const shown = useTransform(count, (value) => Math.round(value).toLocaleString("en-IN"));

  useEffect(() => {
    if (reduceMotion) {
      count.set(to);
      return;
    }
    if (!inView) {
      // Hold at zero until the section arrives, so the roll is not spent
      // off-screen on a visitor who scrolls past quickly.
      count.set(0);
      return;
    }
    const controls = animate(count, to, { duration, ease: EASE_OUT });
    return () => controls.stop();
  }, [count, duration, inView, reduceMotion, to]);

  return (
    <motion.span ref={ref} className={className}>
      {shown}
    </motion.span>
  );
}
