"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The editorial type and layout from antimetal.com's layout (pinned in
 * reference/antimetal/source), shared by the sections built in it: the intro
 * under the hero and the record section.
 */

export { BODY, BUTTON, COLUMN, EYEBROW, HEADING, SUBHEAD } from "./tokens";

export function DashedRule() {
  return <hr className="m-0 w-full border-0 border-t border-dashed border-black/10" />;
}

/** The source's entrance: 12px rise and fade, 700ms on cubic-bezier(.22,1,.36,1). */
export function Rise({ children, delay = 0, onView = false }: { children: ReactNode; delay?: number; onView?: boolean }) {
  const reduceMotion = useReducedMotion();
  const shown = { opacity: 1, y: 0 };
  return (
    <motion.div
      // The same starting state on the server and client; reduced motion only drops the duration.
      initial={{ opacity: 0, y: 12 }}
      {...(onView ? { whileInView: shown, viewport: { once: true, amount: 0.2 } } : { animate: shown })}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
