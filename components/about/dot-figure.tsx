"use client";

import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Lattice pitch and cell circumradius, the footer wordmark's proportions. */
const STEP = 9;
const DOT = 3.3;
const ROW = Math.sqrt(3) / 2;
const SWEEP_MS = 1400;

/** A pointy-top hexagon traced onto the current path. */
function hexagon(context: CanvasRenderingContext2D, x: number, y: number, r: number) {
  for (let i = 0; i < 6; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3;
    if (i === 0) context.moveTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
    else context.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
  }
  context.closePath();
}

/**
 * A short figure set in the footer's orange hexagon dots. The text is sampled
 * onto a honeycomb lattice; once in view the cells light from left to right.
 * The text is also in the markup for readers; the canvas is decoration.
 */
export default function DotFigure({ text, className = "" }: { text: string; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !inView) return;
    let raf = 0;
    let cells: { x: number; y: number; at: number }[] = [];
    let width = 0;
    let height = 0;

    const layout = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      cells = [];
      if (width < 1 || height < 1) return;
      const probe = document.createElement("canvas");
      probe.width = Math.ceil(width);
      probe.height = Math.ceil(height);
      const ink = probe.getContext("2d");
      if (!ink) return;
      ink.font = `700 ${height * 1.1}px ${getComputedStyle(document.body).fontFamily}`;
      ink.textBaseline = "middle";
      ink.fillText(text, 0, height * 0.54);
      const pixels = ink.getImageData(0, 0, probe.width, probe.height).data;
      cells = [];
      for (let row = 0; row * STEP * ROW < height; row += 1) {
        const y = row * STEP * ROW + STEP / 2;
        for (let x = (row % 2) * (STEP / 2) + STEP / 2; x < width; x += STEP) {
          const at = (Math.floor(y) * probe.width + Math.floor(x)) * 4 + 3;
          if (pixels[at] > 128) cells.push({ x, y, at: x / width });
        }
      }
    };

    const draw = (sweep: number) => {
      context.clearRect(0, 0, width, height);
      for (const cell of cells) {
        const lit = Math.min(1, Math.max(0, (sweep - cell.at) * 6));
        if (lit <= 0) continue;
        context.beginPath();
        hexagon(context, cell.x, cell.y, DOT * (0.4 + lit * 0.6));
        context.fillStyle = `rgba(246, 161, 26,${lit})`;
        context.fill();
      }
    };

    layout();
    const start = performance.now();
    const tick = (now: number) => {
      const sweep = reduceMotion ? 1.2 : ((now - start) / SWEEP_MS) * 1.2;
      draw(sweep);
      if (sweep < 1.2) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // The observer reports once on attach; only later resizes redraw the finished figure.
    let attached = false;
    const resize = new ResizeObserver(() => {
      if (!attached) {
        attached = true;
        return;
      }
      cancelAnimationFrame(raf);
      layout();
      draw(1.2);
    });
    resize.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
    };
  }, [inView, reduceMotion, text]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
    </div>
  );
}
