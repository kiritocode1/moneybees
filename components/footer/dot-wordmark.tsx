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
const ORANGE = [247, 161, 26] as const;

type Dot = { hx: number; hy: number; x: number; y: number; hollow: boolean };

/**
 * The footer's dot-matrix wordmark, after United Carriers on footer.design:
 * "MONEYBEE" set in the site face, sampled onto a honeycomb lattice and drawn as hexagons.
 * A ring cursor pushes the dots aside and tints the nearest ones orange; they
 * spring home when it leaves. Idle, the rows carry a faint ripple. Under
 * reduced motion it is drawn once and holds still.
 */
export default function DotWordmark({ word = "MONEYBEE" }: { word?: string }) {
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
    let raf = 0;
    let visible = false;
    const pointer = { x: -9999, y: -9999, active: false };

    /** Rasterise the word at the canvas's size and keep the lattice points that land on ink. */
    const layout = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const probe = document.createElement("canvas");
      probe.width = width;
      probe.height = height;
      const ink = probe.getContext("2d");
      if (!ink) return;
      const family = getComputedStyle(document.body).fontFamily;
      let size = height * 1.05;
      ink.font = `800 ${size}px ${family}`;
      const measured = ink.measureText(word).width;
      size *= Math.min(1, (width * 0.98) / measured);
      ink.font = `800 ${size}px ${family}`;
      ink.textBaseline = "alphabetic";
      ink.textAlign = "center";
      ink.fillText(word, width / 2, height * 0.9);
      const pixels = ink.getImageData(0, 0, width, height).data;

      dots = [];
      // A honeycomb: rows a hexagon's height apart, every other row shifted by half a cell.
      for (let row = 0, y = STEP / 2; y < height; row += 1, y += STEP * ROW_PITCH) {
        for (let x = STEP / 2 + (row % 2) * (STEP / 2); x < width; x += STEP) {
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
        let ty = dot.hy + (reduceMotion ? 0 : Math.sin(dot.hx * 0.018 + time * 0.0016) * 1.1);
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
        const colour = INK.map((channel, index) => Math.round(channel + (ORANGE[index] - channel) * heat));
        context.beginPath();
        hexagon(context, dot.x, dot.y, DOT);
        if (dot.hollow && heat < 0.2) {
          context.strokeStyle = "rgba(0,0,0,.35)";
          context.lineWidth = 1;
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
    void document.fonts.ready.then(start);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [word, reduceMotion]);

  return <canvas ref={canvasRef} className="block h-[clamp(120px,19vw,290px)] w-full cursor-none max-[600px]:cursor-auto" aria-label={word} role="img" />;
}
