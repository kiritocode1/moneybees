"use client";

import { useInView } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

/* Helpers shared by the /pms sections. */

export const ORANGE = "#F7A11A";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7A11A]";

/** The transition every drawing uses between its resting and explained state. */
export const T = "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:duration-0";

export const number = (index: number) => String(index + 1).padStart(2, "0");

export const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/** Plays a block's explained state once it is `amount` in view. */
export function useShown<T extends Element>(amount = 0.45) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

/** Holds its children in the resting state until `delay` ms after `on`, so a row plays in order. */
export function DelayedOn({ on, delay, children }: { on: boolean; delay: number; children: (ready: boolean) => ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [on, delay]);
  return children(ready);
}

/** The orange CTA, as LetsTalkSection draws its button. */
export function OrangeButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex w-fit items-center rounded-full bg-[#F7A11A] px-[26px] py-[14px] text-[15px] font-medium text-black no-underline transition-colors hover:bg-black hover:text-white ${FOCUS}`}
    >
      {children}
    </a>
  );
}
