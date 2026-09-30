import type { CSSProperties, ReactNode } from "react";

/**
 * The editorial type and layout from antimetal.com's layout (pinned in
 * reference/antimetal/source), shared by the sections built in it: the intro
 * under the hero and the record section.
 */

export { BODY, BUTTON, COLUMN, EYEBROW, HEADING, SUBHEAD } from "./tokens";

export function DashedRule() {
  return <hr className="m-0 w-full border-0 border-t border-dashed border-black/10" />;
}

/**
 * The source's entrance: 12px rise and fade, 700ms on cubic-bezier(.22,1,.36,1).
 * CSS only (`.mb-rise` in app/globals.css), so the content is in the HTML and
 * visible without JavaScript. `onView` ties the rise to the element entering
 * the viewport where scroll-driven animations exist, and plays on load elsewhere.
 * Reduced motion drops it.
 */
export function Rise({ children, delay = 0, onView = false }: { children: ReactNode; delay?: number; onView?: boolean }) {
  return (
    <div className="mb-rise" data-on-view={onView ? "" : undefined} style={delay ? ({ "--rise-delay": `${delay}s` } as CSSProperties) : undefined}>
      {children}
    </div>
  );
}
