"use client";

import { useRef, useState } from "react";
import styles from "./insight-cards.module.css";
import { BarsFigure, BeaconFigure, PieFigure } from "./figures";
import {
  AllocationFigure,
  GrowthFigure,
  PyramidFigure,
  ResearchFigure,
  RiskFigure,
  WealthFigure,
} from "./moneybee-figures";

type FigureKind =
  | "bars"
  | "pie"
  | "beacon"
  | "wealth"
  | "research"
  | "pyramid"
  | "growth"
  | "risk"
  | "allocation";

export type InsightCard = {
  title: string;
  figure: FigureKind;
};

const FIGURES = {
  bars: BarsFigure,
  pie: PieFigure,
  beacon: BeaconFigure,
  wealth: WealthFigure,
  research: ResearchFigure,
  pyramid: PyramidFigure,
  growth: GrowthFigure,
  risk: RiskFigure,
  allocation: AllocationFigure,
} satisfies Record<FigureKind, React.ComponentType<{ active: boolean }>>;

/**
 * Fixed speckle field behind each figure. Seeded so it never shifts on render,
 * and rounded because Math.sin's last float digit differs between the server
 * and the browser, which React reports as a hydration mismatch.
 */
const SPECKS = Array.from({ length: 34 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    x: round(60 + (a - Math.floor(a)) * 330),
    y: round(145 + (b - Math.floor(b)) * 350),
    r: i % 7 === 0 ? 1.5 : 1,
  };
});

function Card({ title, figure, index }: InsightCard & { index: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const [lit, setLit] = useState(false);
  const Figure = FIGURES[figure];

  /**
   * The hovered card tilts toward the pointer. Measured off the capture: the
   * left and right edges converge in opposite directions and so do the top and
   * bottom, which is perspective rather than a 2D rotation, and the card's
   * width and height do not change, so there is no scale in it.
   */
  const track = (event: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 2 - 1;
    const y = ((event.clientY - box.top) / box.height) * 2 - 1;
    el.style.setProperty("--tilt-x", x.toFixed(3));
    el.style.setProperty("--tilt-y", y.toFixed(3));
  };

  const release = () => {
    const el = ref.current;
    setLit(false);
    if (!el) return;
    el.style.setProperty("--tilt-x", "0");
    el.style.setProperty("--tilt-y", "0");
  };

  return (
    <article
      ref={ref}
      className={styles.card}
      data-lit={lit}
      tabIndex={0}
      onFocus={() => setLit(true)}
      onBlur={release}
      onPointerEnter={() => setLit(true)}
      onPointerMove={track}
      onPointerLeave={release}
    >
      <svg className={styles.figure} viewBox="0 0 450 561" aria-hidden="true">
        <defs>
          <radialGradient id="insight-glow">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="insight-bloom">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.42" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="insight-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.16" />
          </linearGradient>
        </defs>
        {SPECKS.map((s, i) => (
          <circle key={i} className={styles.speck} cx={s.x} cy={s.y} r={s.r} />
        ))}
        <Figure active={lit} />
      </svg>

      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.index}>{String(index).padStart(3, "0")}</span>
      </header>

      <i className={styles.bracket} data-corner="tl" />
      <i className={styles.bracket} data-corner="tr" />
      <i className={styles.bracket} data-corner="bl" />
      <i className={styles.bracket} data-corner="br" />
    </article>
  );
}

export default function InsightCards({ items }: { items: InsightCard[] }) {
  return (
    <div className={styles.row}>
      {items.map((item, i) => (
        <Card key={item.title} {...item} index={i + 1} />
      ))}
    </div>
  );
}
