"use client";

import { useInView } from "motion/react";
import Link from "@/components/transition/transition-link";
import { type ReactNode, useEffect, useRef, useState } from "react";

/* Helpers shared by the /pms sections. */

export const ORANGE = "#F6A11A";

/** Focus ring in the text colour: ink on white, white on the black bands. */
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

/**
 * The transition every drawing uses between its resting and explained state.
 * The property list is explicit (no `all`): opacity, paint, dash offset and
 * transform, plus the SVG geometry properties a few glyphs still move.
 */
export const T =
  "transition-[opacity,fill,stroke,fill-opacity,stroke-opacity,stroke-dashoffset,transform,x,y,width,height,r,cx,cy] duration-700 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:!transition-none";

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

/** Press feedback and colour change, shared by every button on the product pages. */
export const PRESS = "transition-[background-color,color,border-color,transform,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] active:scale-[0.97] motion-reduce:active:scale-100";

/** The orange CTA, as LetsTalkSection draws its button. `outline` is the quiet partner button. */
export function OrangeButton({ href, children, outline = false, onDark = false }: { href: string; children: ReactNode; outline?: boolean; onDark?: boolean }) {
  const look = outline ? "border border-current bg-transparent text-current hover:bg-black hover:text-white hover:border-black" : `bg-[#F6A11A] text-black ${onDark ? "hover:bg-white" : "hover:bg-black hover:text-white"}`;
  return (
    <Link href={href} className={`inline-flex w-fit items-center rounded-full px-[26px] py-[14px] text-[15px] font-medium no-underline ${look} ${PRESS} ${FOCUS} ${onDark ? "focus-visible:outline-white" : ""}`}>
      {children}
    </Link>
  );
}

/** The kobbe figure panel every explainer sits in: grey fill, 10px radius, hairline ring. */
export function FigurePanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[10px] bg-[#F6F6F6] px-[clamp(16px,5vw,72px)] py-[clamp(24px,4vw,56px)] ring-1 ring-black/[.06] ${className}`}>{children}</div>;
}

/**
 * The hero's "On this page" index, shared by the five product routes. Numbers
 * stay ink (orange text on white fails contrast); the orange is the rule that
 * grows in on hover.
 */
export function PageIndex({ parts }: { parts: readonly (readonly [string, string])[] }) {
  return (
    <nav aria-label="On this page">
      <ol className="m-0 list-none border-t border-black p-0">
        {parts.map(([label, href], index) => (
          <li key={href} className="border-b border-black/15">
            <a href={href} className={`group flex items-baseline gap-[18px] py-[14px] text-black no-underline ${FOCUS}`}>
              <span className="w-[34px] font-[family-name:var(--font-geist-mono)] text-[13px] leading-none tracking-[.04em] text-black/60 tabular-nums">{number(index)}</span>
              <span className="text-[17px] text-black/75 transition-colors duration-200 group-hover:text-black">{label}</span>
              <span className="ml-auto h-[2px] w-[28px] origin-left scale-x-0 bg-[#F6A11A] transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Without JavaScript the scroll reveals never run, so everything they hold at
 * opacity 0 or scale 0 would stay hidden. This noscript stylesheet shows the
 * explained state instead. Rendered once per page, from each product hero.
 */
export function NoScriptReveal() {
  return (
    <noscript>
      <style>{`main [style*="opacity:0;"],main [style$="opacity:0"],main [opacity="0"]{opacity:1!important;transition:none!important}main [style*="scale(0)"],main [style*="scaleX(0)"],main [style*="scaleY(0)"],main [style*="scale(0.9)"],main [style*="translateX(-16px)"]{transform:none!important;transition:none!important}`}</style>
    </noscript>
  );
}
