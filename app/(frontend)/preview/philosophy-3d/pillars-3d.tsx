"use client";

import { useEffect, useRef } from "react";
import FactSection, { type FigureState, PanelTitle } from "@/components/fact-sections/fact-section";
import { PERIOD_RETURNS, PILLARS } from "@/lib/insights";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { TholosState } from "./tholos-scene";

/*
 * PREVIEW ONLY. The six pillars on /our-approach after the returns, with the
 * rebuilt 3D tholos pinned in the figure slot and each principle scrolling
 * beside it, so no text ever sits over the columns.
 */

const ROOF = PILLARS.length;
const SINCE_INCEPTION = PERIOD_RETURNS.find((row) => row.period === "Since Inception");

/** The canvas in the figure slot. three.js loads only once this mounts. */
function TholosFigure({ progress, selected, onSelect }: FigureState) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef<TholosState>({ progress, selected });
  const pick = useRef(onSelect);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    state.current = { progress, selected };
    pick.current = onSelect;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};
    void import("./tholos-scene").then(({ createTholos }) => {
      if (disposed) return;
      const tholos = createTholos(canvas, (index) => pick.current(index));
      const size = () => tholos.resize(canvas.clientWidth, canvas.clientHeight);
      size();
      const resizer = new ResizeObserver(size);
      resizer.observe(canvas);
      let raf = 0;
      let previous = performance.now();
      const tick = (now: number) => {
        tholos.frame(state.current, Math.min(now - previous, 50) / 1000, reduceMotion);
        previous = now;
        raf = requestAnimationFrame(tick);
      };
      // Only render while the figure is on screen.
      const io = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) {
          previous = performance.now();
          raf = requestAnimationFrame(tick);
        }
      });
      io.observe(canvas);
      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        resizer.disconnect();
        tholos.dispose();
      };
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [reduceMotion]);

  return (
    <div className="relative h-[82svh] w-full max-[900px]:h-full">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full cursor-pointer" />
    </div>
  );
}

const BODY = "mt-[24px] max-w-[34ch] border-t border-t-[rgba(0,0,0,.13)] pt-[18px] text-[clamp(1.1rem,1.4vw,1.35rem)] leading-[1.45] text-[rgba(0,0,0,.78)]";

function PillarPanel({ index }: { index: number }) {
  const pillar = PILLARS[index];
  return (
    <div>
      <PanelTitle size="medium">{pillar.name}</PanelTitle>
      <p className={BODY}>{pillar.text}</p>
    </div>
  );
}

function RoofPanel() {
  return (
    <div>
      {/* Group profile slide 11: "Robust strategy for consistent performance". */}
      <PanelTitle size="medium">Consistent performance</PanelTitle>
      <p className={BODY}>
        {SINCE_INCEPTION?.queenbee.toFixed(2)}% a year since August 2007, against {SINCE_INCEPTION?.benchmark.toFixed(2)}% for the S&amp;P BSE 500 TRI.
        The six principles carry every portfolio we run.
      </p>
    </div>
  );
}

export function Pillars3DSection() {
  return (
    <FactSection
      id="pillars"
      label="Our philosophy"
      heading="Our investment philosophy"
      panels={[...PILLARS.map((_, index) => ({ part: index, content: <PillarPanel index={index} /> })), { part: ROOF, content: <RoofPanel /> }]}
      figure={TholosFigure}
    />
  );
}
