"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { BarsFigure, BeaconFigure, PieFigure } from "@/components/insight-cards/figures";
import styles from "@/components/insight-cards/insight-cards.module.css";

/**
 * The three reference card figures (bars, pie and the lighthouse), recoloured
 * for the chapter stack's grounds. The figures read their colours from the
 * card variables, so each tone sets those, plus its own glow gradients: on the
 * orange ground the light is white, since an orange glow would vanish into it.
 */
const TONES = {
  orange: {
    vars: {
      "--ink": "#000000",
      "--ink-dim": "rgba(0,0,0,.5)",
      "--stroke": "rgba(0,0,0,.72)",
      "--face": "#f9b449",
      "--face-lit": "#e8961b",
      "--accent": "#000000",
      "--accent-wall": "#2a2a2a",
      "--lamp": "#ffffff",
      "--bloom": "0.85",
    },
    glow: "#ffffff",
  },
  ink: {
    vars: {
      "--ink": "#ffffff",
      "--ink-dim": "rgba(255,255,255,.5)",
      "--stroke": "rgba(255,255,255,.6)",
      "--face": "#0f0f0f",
      "--face-lit": "#1c1c1c",
      "--accent": "#F7A11A",
      "--accent-wall": "#b3730d",
      "--lamp": "#F7A11A",
      "--bloom": "0.6",
    },
    glow: "#F7A11A",
  },
  grey: {
    vars: {
      "--ink": "#000000",
      "--ink-dim": "rgba(0,0,0,.5)",
      "--stroke": "rgba(0,0,0,.68)",
      "--face": "#b1b2b5",
      "--face-lit": "#8f9093",
      "--accent": "#F7A11A",
      "--accent-wall": "#c98110",
      "--lamp": "#F7A11A",
      "--bloom": "0.7",
    },
    glow: "#F7A11A",
  },
} as const;

const FIGURES = { bars: BarsFigure, pie: PieFigure, beacon: BeaconFigure } as const;

export default function ChapterFigure({ kind, tone }: { kind: keyof typeof FIGURES; tone: keyof typeof TONES }) {
  const ref = useRef<HTMLDivElement>(null);
  // The figures run on the cards' hover clock; here "hovered" means on screen.
  const active = useInView(ref, { amount: 0.4 });
  const Figure = FIGURES[kind];
  const { vars, glow } = TONES[tone];
  return (
    <div ref={ref} data-chapter-figure={tone} className="relative h-full w-full" style={vars as React.CSSProperties} aria-hidden="true">
      <svg className={styles.figure} viewBox="0 130 450 400">
        <defs>
          <radialGradient id={`chapter-${tone}-glow`}>
            <stop offset="0%" stopColor={glow} stopOpacity="0.5" />
            <stop offset="55%" stopColor={glow} stopOpacity="0.12" />
            <stop offset="100%" stopColor={glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`chapter-${tone}-bloom`}>
            <stop offset="0%" stopColor={glow} stopOpacity="0.5" />
            <stop offset="100%" stopColor={glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`chapter-${tone}-beam`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={glow} stopOpacity="0.6" />
            <stop offset="100%" stopColor={glow} stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <Figure active={active} />
      </svg>
    </div>
  );
}
