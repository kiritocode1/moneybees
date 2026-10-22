"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef } from "react";
import { hexagon, ROW_PITCH } from "./hexagon";

const STEP = 9;
/** Circumradius of each hexagonal cell. */
const DOT = 3.3;
const REACH = 120;
const PUSH = 28;
const INK = [0, 0, 0] as const;
const ORANGE = [246, 161, 26] as const;

type Dot = { hx: number; hy: number; x: number; y: number; hollow: boolean };

/**
 * The footer's closing line, after United Carriers on footer.design: the quote
 * set in the site face, sampled onto a honeycomb lattice and drawn as hexagons.
 * The line is fitted to the width and does not travel. A ring cursor pushes the
 * dots aside and tints the nearest ones; they spring home when it leaves. Idle,
 * the rows carry a faint ripple. Under reduced motion it is drawn once and holds still.
 */
export default function DotWordmark({ word = "Know Venture. Know Gain.", tone = "orange" }: { word?: string; tone?: "orange" | "ink" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dotScale = 1;
    let raf = 0;
    let visible = false;
    const pointer = { x: -9999, y: -9999, active: false };

    /** Rasterise the quote at a size that fits the width, and keep the lattice points that land on ink. */
    const layout = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      // Not laid out yet (or collapsed): getImageData throws on a 0-sized probe.
      // The ResizeObserver calls layout again once the canvas has a size.
      if (width === 0) {
        dots = [];
        return;
      }

      const family = getComputedStyle(document.body).fontFamily;
      const measure = document.createElement("canvas").getContext("2d");
      if (!measure) return;
      measure.font = `800 100px ${family}`;
      const at100 = measure.measureText(word).width || 1;
      // Fit the whole line. A short canvas would crop it; the height follows the type.
      const size = Math.min(140, (width * 0.94 * 100) / at100);
      // Keep the lattice dense enough to describe the letters on narrow screens.
      dotScale = Math.min(1, size / 100);
      const step = STEP * dotScale;
      // Room above and below the em box, plus the hex radius, so the dots are not cut off.
      const nextHeight = Math.max(88, Math.ceil(size * 1.55));
      if (Math.abs(canvas.clientHeight - nextHeight) > 1) {
        canvas.style.height = `${nextHeight}px`;
        return;
      }
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const probe = document.createElement("canvas");
      probe.width = width;
      probe.height = height;
      const ink = probe.getContext("2d");
      if (!ink) return;
      ink.font = `800 ${size}px ${family}`;
      ink.textBaseline = "middle";
      ink.textAlign = "center";
      ink.fillText(word, width / 2, height / 2);
      const pixels = ink.getImageData(0, 0, width, height).data;

      dots = [];
      // A honeycomb: rows a hexagon's height apart, every other row shifted by half a cell.
      for (let row = 0, y = step / 2; y < height; row += 1, y += step * ROW_PITCH) {
        for (let x = step / 2 + (row % 2) * (step / 2); x < width; x += step) {
          if (pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] > 120) {
            const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
            dots.push({ hx: x, hy: y, x, y, hollow: seed - Math.floor(seed) < 0.07 });
          }
        }
      }
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      for (const dot of dots) {
        let tx = dot.hx;
        let ty = dot.hy + (reduceMotion ? 0 : Math.sin(dot.hx * 0.018 + time * 0.0016) * 1.1 * dotScale);
        let heat = 0;
        if (pointer.active) {
          const dx = dot.hx - pointer.x;
          const dy = dot.hy - pointer.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < REACH) {
            const force = (1 - distance / REACH) ** 2;
            tx += (dx / distance) * force * PUSH;
            ty += (dy / distance) * force * PUSH;
            heat = Math.min(1, force * 1.8);
          }
        }
        // Ease toward the target rather than snapping, so dots drift back when the ring moves on.
        dot.x += (tx - dot.x) * 0.18;
        dot.y += (ty - dot.y) * 0.18;
        const resting = tone === "orange" ? ORANGE : INK;
        const hot = tone === "orange" ? INK : ORANGE;
        const colour = resting.map((channel, index) => Math.round(channel + (hot[index] - channel) * heat));
        context.beginPath();
        hexagon(context, dot.x, dot.y, DOT * dotScale);
        if (dot.hollow && heat < 0.2) {
          context.strokeStyle = tone === "orange" ? "rgba(246, 161, 26,.6)" : "rgba(0,0,0,.35)";
          context.lineWidth = dotScale;
          context.stroke();
        } else {
          context.fillStyle = `rgb(${colour.join(" ")})`;
          context.fill();
        }
      }
      if (pointer.active) {
        context.beginPath();
        context.arc(pointer.x, pointer.y, 30, 0, Math.PI * 2);
        context.strokeStyle = "#000";
        context.lineWidth = 1;
        context.stroke();
        context.beginPath();
        context.arc(pointer.x, pointer.y, 2.5, 0, Math.PI * 2);
        context.fillStyle = "#000";
        context.fill();
      }
    };

    const loop = (time: number) => {
      draw(time);
      if (visible && !reduceMotion) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      layout();
      draw(0);
      if (visible && !reduceMotion) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduceMotion) raf = requestAnimationFrame(loop);
    });
    observer.observe(canvas);
    const resize = new ResizeObserver(start);
    resize.observe(canvas);

    const move = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.active = true;
    };
    const leave = () => {
      pointer.active = false;
    };
    if (!reduceMotion) {
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerleave", leave);
    }
    // The face has to be loaded before the word is sampled, or the fallback's shapes are used.
    let alive = true;
    void document.fonts.ready.then(() => {
      if (alive) start();
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [word, tone, reduceMotion]);

  return <canvas ref={canvasRef} className="block h-[96px] w-full" aria-label={word} role="img" />;
}
