"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";
import { Materialize } from "@/components/pixel-reveal/materialize";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-[#F7A11A] focus-visible:outline-offset-4";
export const ORANGE = "#F7A11A";
/** The card's `fig-route--active` glow, for lit lines. */
export const LINE_GLOW = "drop-shadow(0 0 7px color-mix(in srgb, #F7A11A 65%, transparent))";
/** The glow the card's highlighted solids carry. */
export const SOLID_GLOW = "drop-shadow(0 0 14px rgba(247,161,26,.55))";

export const clamp = (value: number) => Math.min(1, Math.max(0, value));
/**
 * Two decimals, for any trig-derived value rendered on the server. Math.sin and
 * Math.cos can differ in the last digit between server and browser, which React
 * reports as a hydration mismatch.
 */
export const r2 = (value: number) => Math.round(value * 100) / 100;
export const easeOut = (value: number) => 1 - (1 - value) ** 3;

/** How far a staggered part has risen into place at build `progress`. */
export const riseAt = (progress: number, index: number) => easeOut(clamp((progress - index * 0.13) / 0.22));

/**
 * The card's `insight-bloom` in the site orange. Each figure renders one with
 * its own id, since several figures can share a page.
 */
export function Bloom({ id }: { id: string }) {
  return (
    <radialGradient id={id}>
      <stop offset="0%" stopColor={ORANGE} stopOpacity="0.42" />
      <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
    </radialGradient>
  );
}

/**
 * A clock that runs while `running`, eased in the way the cards spin up and
 * kept when it pauses so nothing snaps back. Returns seconds of motion.
 */
export function useFigureClock(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  const total = useRef(0);
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let energy = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      energy += (1 - energy) * Math.min(1, dt / 0.4);
      total.current += dt * energy;
      setSeconds(total.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return seconds;
}

/**
 * A number that glides toward `target` instead of jumping, so a figure moves
 * between the states its panels select. Under reduced motion it jumps.
 */
export function useEased(target: number, rate = 5) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      current.current += (target - current.current) * Math.min(1, dt * rate);
      if (Math.abs(target - current.current) < 0.001) current.current = target;
      setValue(current.current);
      if (current.current !== target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, rate, reduceMotion]);
  return reduceMotion ? target : value;
}

export type FigureState = {
  /** 0 to 1 while the figure builds, ahead of the first panel. */
  progress: number;
  /** The part lit by the panel on the trigger line. */
  selected: number;
  /** Scrolls to the panel for a part, for clicks on the figure. */
  onSelect: (part: number) => void;
};

/**
 * The one section label used across the page, after Wonder Vision: a small
 * solid square and an uppercase label. It inherits the text colour, so it
 * reads on the dark bands as well as on paper.
 */
export function BracketLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[10px] text-[13px] font-[550] uppercase tracking-[.03em]">
      <i className="h-[10px] w-[10px] shrink-0 bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}

/** The heading block every fact section opens with. */
export function SectionHeading({ id, label, heading, lead }: { id: string; label: string; heading: string; lead?: ReactNode }) {
  return (
    <div className="px-[max(32px,calc((100vw_-_1480px)/2))] pt-[120px] max-[600px]:px-[22px] max-[600px]:pt-[72px]">
      <BracketLabel>{label}</BracketLabel>
      <div className="mt-[18px] grid grid-cols-[1fr_.8fr] items-end gap-[60px] max-[900px]:grid-cols-1 max-[900px]:gap-[28px]">
        {/* Deck lines run from three words to a full sentence; a long one steps down a size so it holds four lines at most. */}
        <Materialize
          as="h2"
          id={`${id}-heading`}
          className={`font-light tracking-[-.055em] ${
            heading.length > 56 ? "text-[clamp(2.4rem,4.2vw,4.6rem)] leading-[.98]" : "text-[clamp(3.6rem,6.4vw,7rem)] leading-[.92]"
          }`}
        >
          {heading}
        </Materialize>
        {lead && <p className="max-w-[440px] text-[13px] leading-[1.6] text-[rgba(0,0,0,.7)]">{lead}</p>}
      </div>
    </div>
  );
}

/** Small uppercase label, the homepage's eyebrow style. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="text-[9px] uppercase tracking-[.14em] text-[rgba(0,0,0,.6)]">{children}</span>;
}

/** The large light line a panel opens with. `medium` suits a sentence rather than a figure. */
export function PanelTitle({ children, size = "large" }: { children: ReactNode; size?: "large" | "medium" }) {
  return (
    <strong
      className={`mt-[6px] block font-light tracking-[-.05em] ${
        size === "large"
          ? "text-[clamp(3.2rem,5vw,5.2rem)] leading-[.9]"
          : "max-w-[16ch] text-[clamp(2.2rem,3.2vw,3.4rem)] leading-[.98]"
      }`}
    >
      {children}
    </strong>
  );
}

/** Label and copy rows under a panel title. */
export function DetailRows({ rows }: { rows: readonly (readonly [string, ReactNode])[] }) {
  return (
    <div className="mt-[26px] grid gap-[14px] border-t border-t-[rgba(0,0,0,.13)] pt-[18px] text-[11px] leading-[1.55] text-[rgba(0,0,0,.72)]">
      {rows.map(([label, copy]) => (
        <p key={label} className="grid grid-cols-[96px_1fr] gap-[16px]">
          <span className="text-[9px] uppercase tracking-[.1em] text-[rgba(0,0,0,.5)]">{label}</span>
          <span>{copy}</span>
        </p>
      ))}
    </div>
  );
}

/**
 * The scroll pattern every fact section shares: text first, then the figure
 * pinned (beside the panels on desktop, above them on a phone) while one panel
 * per part scrolls past. The figure builds as the panels arrive, and the panel
 * covering a line 44% down the screen lights its part. That line is the middle
 * on desktop and sits just under the pinned figure on a phone, so a part's name
 * is in view the moment it lights. Clicking a part scrolls to its panel.
 */
export default function FactSection({
  id,
  label,
  heading,
  lead,
  intro,
  panels,
  figure: Figure,
  after,
}: {
  id: string;
  label: string;
  /** Omitted when the host section already carries a heading. */
  heading?: string;
  lead?: ReactNode;
  /** Time-based content between the heading and the pinned figure. */
  intro?: ReactNode;
  /** In scroll order. `part` is the figure part each panel lights. */
  panels: readonly { part: number; content: ReactNode }[];
  /** Rendered as a component so its callbacks stay out of render. */
  figure: ComponentType<FigureState>;
  /** Plain content after the panels, before the source line. */
  after?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const panelsRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  // The build runs while the panel column scrolls up to a third of the screen,
  // so the figure is standing before the first panel reaches the trigger line.
  const { scrollYProgress } = useScroll({ target: panelsRef, offset: ["start end", "start 0.3"] });
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState(panels[0].part);
  useMotionValueEvent(scrollYProgress, "change", (value) => setProgress(clamp(value)));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSelected(Number((entry.target as HTMLElement).dataset.part));
        }
      },
      { rootMargin: "-44% 0px -55% 0px" },
    );
    panelRefs.current.forEach((panel) => panel && observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  const onSelect = (part: number) =>
    panelRefs.current[panels.findIndex((panel) => panel.part === part)]?.scrollIntoView({
      block: "center",
      behavior: reduceMotion ? "auto" : "smooth",
    });

  return (
    <section id={id} aria-labelledby={heading ? `${id}-heading` : undefined} aria-label={heading ? undefined : label} className="bg-white">
      {heading && <SectionHeading id={id} label={label} heading={heading} lead={lead} />}
      {intro}

      <div className="grid grid-cols-[1.15fr_.85fr] gap-[60px] px-[max(32px,calc((100vw_-_1480px)/2))] max-[900px]:grid-cols-1 max-[900px]:gap-0 max-[600px]:px-[22px]">
        <div className="sticky top-0 flex h-svh items-center self-start max-[900px]:z-[2] max-[900px]:h-[42svh] max-[900px]:bg-white max-[900px]:pt-[64px]">
          <Figure progress={reduceMotion ? 1 : progress} selected={selected} onSelect={onSelect} />
        </div>
        <div ref={panelsRef} className="pt-[30svh] pb-[35svh] max-[900px]:pt-[4svh]">
          {panels.map(({ part, content }, index) => (
            <article
              key={part}
              ref={(element) => {
                panelRefs.current[index] = element;
              }}
              data-part={part}
              aria-current={selected === part}
              className="flex min-h-[88svh] items-center py-[40px] max-[900px]:min-h-[70svh] max-[900px]:items-start"
              style={{ opacity: selected === part ? 1 : 0.28, transition: "opacity 400ms ease" }}
            >
              <div className="w-full">{content}</div>
            </article>
          ))}
        </div>
      </div>

      {after}
    </section>
  );
}
