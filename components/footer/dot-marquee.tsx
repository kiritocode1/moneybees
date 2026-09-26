"use client";

import { useEffect, useRef } from "react";
import { hexagon, ROW_PITCH } from "./hexagon";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const STEP = 9;
/** Circumradius of each hexagonal cell. */
const DOT = 3.3;
const REACH = 110;
const PUSH = 24;
/** Pixels per second the line travels left. */
const SPEED = 42;
const ORANGE = [247, 161, 26] as const;
const INK = [0, 0, 0] as const;

type Dot = { hx: number; hy: number; hollow: boolean };

/**
 * A line of text in orange hexagonal dots, travelling left without end: the footer
 * wordmark's dot lattice (dot-wordmark.tsx) turned into a marquee. The text is
 * sampled once into one tile of dots, and the tile repeats across the width.
 * Idle, the rows carry the wordmark's ripple; the ring cursor pushes dots aside
 * and tints them ink. Under reduced motion it is drawn once and holds still.
 */
export default function DotMarquee({ text }: { text: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let dots: Dot[] = [];
    let tile = 1;
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = false;
    /** Eased displacement per dot per repeat of the tile, so pushed dots drift back. */
    let pushed = new Float32Array(0);
    let copies = 1;
    const pointer = { x: -9999, y: -9999, active: false };

    /** Rasterise one tile of the text at the canvas height and keep the lattice points that land on ink. */
    const layout = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const family = getComputedStyle(document.body).fontFamily;
      const size = height * 1.05;
      const measure = document.createElement("canvas").getContext("2d");
      if (!measure) return;
      measure.font = `700 ${size}px ${family}`;
      // One tile is the line plus a gap of half its height before it repeats.
      tile = Math.ceil(measure.measureText(text).width + size * 0.5);

      const probe = document.createElement("canvas");
      probe.width = tile;
      probe.height = height;
      const ink = probe.getContext("2d");
      if (!ink) return;
      ink.font = `700 ${size}px ${family}`;
      ink.textBaseline = "alphabetic";
      ink.fillText(text, 0, height * 0.86);
      const pixels = ink.getImageData(0, 0, tile, height).data;

      dots = [];
      // A honeycomb: rows a hexagon's height apart, every other row shifted by half a cell.
      for (let row = 0, y = STEP / 2; y < height; row += 1, y += STEP * ROW_PITCH) {
        for (let x = STEP / 2 + (row % 2) * (STEP / 2); x < tile; x += STEP) {
          if (pixels[(Math.floor(y) * tile + Math.floor(x)) * 4 + 3] > 120) {
            const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
            dots.push({ hx: x, hy: y, hollow: seed - Math.floor(seed) < 0.07 });
          }
        }
      }
      copies = Math.ceil(width / tile) + 1;
      pushed = new Float32Array(dots.length * copies * 2);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const offset = reduceMotion ? 0 : ((time / 1000) * SPEED) % tile;
      for (let copy = 0; copy < copies; copy += 1) {
        const left = copy * tile - offset;
        dots.forEach((dot, index) => {
          const hx = dot.hx + left;
          if (hx < -STEP || hx > width + STEP) return;
          const hy = dot.hy + (reduceMotion ? 0 : Math.sin(hx * 0.018 + time * 0.0016) * 1.1);
          let tx = 0;
          let ty = 0;
          let heat = 0;
          if (pointer.active) {
            const dx = hx - pointer.x;
            const dy = hy - pointer.y;
            const distance = Math.hypot(dx, dy) || 1;
            if (distance < REACH) {
              const force = (1 - distance / REACH) ** 2;
              tx = (dx / distance) * force * PUSH;
              ty = (dy / distance) * force * PUSH;
              heat = Math.min(1, force * 1.8);
            }
          }
          const slot = (copy * dots.length + index) * 2;
          pushed[slot] += (tx - pushed[slot]) * 0.18;
          pushed[slot + 1] += (ty - pushed[slot + 1]) * 0.18;
          const colour = ORANGE.map((channel, c) => Math.round(channel + (INK[c] - channel) * heat));
          context.beginPath();
          hexagon(context, hx + pushed[slot], hy + pushed[slot + 1], DOT);
          if (dot.hollow && heat < 0.2) {
            context.strokeStyle = "rgba(247,161,26,.6)";
            context.lineWidth = 1;
            context.stroke();
          } else {
            context.fillStyle = `rgb(${colour.join(" ")})`;
            context.fill();
          }
        });
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
      draw(performance.now());
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
    // The face has to be loaded before the text is sampled, or the fallback's shapes are used.
    void document.fonts.ready.then(start);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [text, reduceMotion]);

  return <canvas ref={canvasRef} className="block h-[clamp(120px,16vw,240px)] w-full cursor-none max-[600px]:cursor-auto" aria-label={text} role="img" />;
}
