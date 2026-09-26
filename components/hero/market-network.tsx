"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * The hero figure, after antimetal.com's turning dot network: a 3D point cloud
 * that slowly rotates and re-forms, dots sized by depth, joined by thin grey
 * lines. Here the shapes tell the research funnel from the deck
 * (RESEARCH_STAGES): the listed universe as a loose cloud, the screen as a flat
 * band where most companies go grey, then a burst of spokes ending on the ~20
 * orange companies in the portfolio. Then it loops.
 *
 * Canvas 2D, no dependency. Drag turns it, as on the reference.
 */

type Vec = readonly [number, number, number];
type Stage = { label: string };

const STAGES: readonly Stage[] = [
  { label: "~6000 · Universe" },
  { label: "~1200 · Screened" },
  { label: "~20 · Portfolio" },
];

const COUNT = 130;
const PORTFOLIO = 20;
/** Survives the screen, roughly 1200 of 6000. Portfolio points are a subset. */
const SCREENED = 30;
const HOLD = 3.4;
const MORPH = 1.9;
const CYCLE = (HOLD + MORPH) * STAGES.length;

const INK = [0, 0, 0] as const;
const GREY = [157, 158, 161] as const;
const ORANGE = [247, 161, 26] as const;

/** Seeded so server and client agree and the figure is the same every visit. */
function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Point = {
  shapes: readonly [Vec, Vec, Vec];
  size: number;
  /** 0 screened out, 1 screened in, 2 in the portfolio. */
  tier: 0 | 1 | 2;
  neighbours: readonly number[];
};

function buildPoints(): Point[] {
  const rand = random(6000);
  const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
  const points: Omit<Point, "neighbours">[] = [];
  for (let i = 0; i < COUNT; i++) {
    const tier: Point["tier"] = i < PORTFOLIO ? 2 : i < SCREENED ? 1 : 0;
    // A tall, loose cloud, like the reference's opening shape.
    const cloud: Vec = [gauss() * 0.62, gauss() * 1.05, gauss() * 0.62];
    // The screen: a thin tilted band. Survivors sit near its centre line.
    const spread = tier === 0 ? 1.15 : 0.55;
    const angle = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * spread;
    const band: Vec = [Math.cos(angle) * r * 0.95, gauss() * 0.06, Math.sin(angle) * r * 0.9];
    // The burst: every point on a spoke from the centre, the portfolio at the tips.
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    const reach = tier === 2 ? 1 : 0.25 + rand() * 0.7;
    const burst: Vec = [
      Math.sin(phi) * Math.cos(theta) * reach,
      Math.cos(phi) * reach,
      Math.sin(phi) * Math.sin(theta) * reach * 0.6,
    ];
    // Most dots small, a few large, as on the reference.
    const roll = rand();
    const size = tier === 2 ? 3.4 + rand() * 2.6 : roll > 0.94 ? 6 + rand() * 6 : 1.4 + rand() * 2.8;
    points.push({ shapes: [cloud, band, burst], size, tier });
  }
  // Two nearest neighbours in the cloud give the loose web of grey lines.
  return points.map((p, i) => {
    const [x, y, z] = p.shapes[0];
    const neighbours = points
      .map((q, j) => {
        const [a, b, c] = q.shapes[0];
        return { j, d: (a - x) ** 2 + (b - y) ** 2 + (c - z) ** 2 };
      })
      .filter(({ j }) => j > i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .filter(({ d }) => d < 0.07)
      .map(({ j }) => j);
    return { ...p, neighbours };
  });
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where the loop is: the stage being left, the one arriving, and how far between. */
function phaseAt(seconds: number) {
  const local = seconds % CYCLE;
  const slot = HOLD + MORPH;
  // Float rounding can land local / slot on exactly STAGES.length at the very end of a loop.
  const from = Math.min(Math.floor(local / slot), STAGES.length - 1);
  const into = local - from * slot;
  const t = into < HOLD ? 0 : easeInOut((into - HOLD) / MORPH);
  return { from, to: (from + 1) % STAGES.length, t };
}

/** A point's colour at a stage: everything ink in the cloud, then the screen greys most. */
function colourAt(tier: Point["tier"], stage: number) {
  if (stage === 0) return INK;
  if (stage === 1) return tier === 0 ? GREY : INK;
  return tier === 2 ? ORANGE : tier === 1 ? INK : GREY;
}

export default function MarketNetwork({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillTextRef = useRef<HTMLSpanElement>(null);
  const leaderRef = useRef<SVGLineElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const points = buildPoints();
    // The pill labels one portfolio node, as the reference labels one of its nodes.
    const anchor = 3;

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let drag = 0;
    let dragging: number | null = null;
    const onDown = (e: PointerEvent) => {
      dragging = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (dragging === null) return;
      drag += (e.clientX - dragging) * 0.006;
      dragging = e.clientX;
    };
    const onUp = () => {
      dragging = null;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    let lastStage = -1;
    const draw = (seconds: number) => {
      // Reduced motion shows the finished portfolio, still.
      const { from, to, t } = reduceMotion ? { from: 2, to: 2, t: 0 } : phaseAt(seconds);
      const spin = (reduceMotion ? 0.6 : seconds * 0.11) + drag;
      const tilt = -0.28;
      const cosY = Math.cos(spin);
      const sinY = Math.sin(spin);
      const cosX = Math.cos(tilt);
      const sinX = Math.sin(tilt);
      const scale = Math.min(width, height) * 0.4;
      const cx = width / 2;
      const cy = height / 2;

      const projected = points.map((p) => {
        const a = p.shapes[from];
        const b = p.shapes[to];
        const x0 = mix(a[0], b[0], t);
        const y0 = mix(a[1], b[1], t);
        const z0 = mix(a[2], b[2], t);
        const x1 = x0 * cosY + z0 * sinY;
        const z1 = -x0 * sinY + z0 * cosY;
        const y1 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;
        const depth = 3 / (3 + z2);
        const ca = colourAt(p.tier, from);
        const cb = colourAt(p.tier, to);
        const colour = [mix(ca[0], cb[0], t), mix(ca[1], cb[1], t), mix(ca[2], cb[2], t)];
        // Screened-out dots shrink as they go grey, so the survivors read.
        const fade = (stage: number) => (p.tier === 0 && stage > 0 ? 0.55 : 1);
        const radius = p.size * depth * depth * mix(fade(from), fade(to), t);
        return { x: cx + x1 * scale * depth, y: cy + y1 * scale * depth, z: z2, radius, colour };
      });

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      // The web thins on the band, where its lines would stretch across, and
      // is gone by the burst, where the spokes take over.
      const web = (stage: number) => [1, 0.3, 0][stage];
      const spokes = (stage: number) => (stage === 2 ? 1 : 0);
      const webAlpha = mix(web(from), web(to), t);
      const spokeAlpha = mix(spokes(from), spokes(to), t);

      if (webAlpha > 0.01) {
        ctx.strokeStyle = `rgba(0,0,0,${0.16 * webAlpha})`;
        ctx.beginPath();
        points.forEach((p, i) => {
          for (const j of p.neighbours) {
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
          }
        });
        ctx.stroke();
      }
      if (spokeAlpha > 0.01) {
        ctx.strokeStyle = `rgba(0,0,0,${0.2 * spokeAlpha})`;
        ctx.beginPath();
        for (const q of projected) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
      }

      // Painter's order: far dots first.
      const order = projected.map((_, i) => i).sort((a, b) => projected[b].z - projected[a].z);
      for (const i of order) {
        const q = projected[i];
        ctx.fillStyle = `rgb(${q.colour[0]},${q.colour[1]},${q.colour[2]})`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, Math.max(q.radius, 0.6), 0, Math.PI * 2);
        ctx.fill();
      }

      // The pill: parked at the right edge, a dashed orange leader to its node.
      const pill = pillRef.current;
      const leader = leaderRef.current;
      if (pill && leader && pillTextRef.current) {
        const settled = reduceMotion ? 2 : t === 0 ? from : -1;
        if (settled !== lastStage) {
          lastStage = settled;
          if (settled >= 0) pillTextRef.current.textContent = STAGES[settled].label;
          pill.dataset.shown = settled >= 0 ? "true" : "false";
        }
        const node = projected[anchor];
        const top = Math.min(Math.max(node.y - 60, 40), height - 60);
        pill.style.transform = `translate(0, ${top}px)`;
        leader.setAttribute("x1", String(node.x));
        leader.setAttribute("y1", String(node.y));
        leader.setAttribute("x2", String(width - pill.offsetWidth));
        leader.setAttribute("y2", String(top + pill.offsetHeight / 2));
        leader.style.opacity = settled >= 0 ? "1" : "0";
      }
    };

    let raf = 0;
    let visible = true;
    let clock = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      clock += Math.min(now - previous, 50) / 1000;
      previous = now;
      draw(clock);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || reduceMotion) return;
      previous = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    // Only spend frames while the hero is on screen and the tab is visible.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden || !visible ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    // A resize clears the canvas, so a paused or still figure has to repaint.
    const observer = new ResizeObserver(() => {
      resize();
      if (!raf) draw(clock);
    });
    observer.observe(canvas);
    draw(0);

    return () => {
      stop();
      io.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <line
          ref={leaderRef}
          stroke="rgba(247,161,26,.8)"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="transition-opacity duration-300"
        />
      </svg>
      {/* .wv-pill from the pinned source, in our orange and on white. */}
      <div
        ref={pillRef}
        data-shown="false"
        className="pointer-events-none absolute top-0 right-0 flex min-h-[32px] origin-left scale-y-[.4] items-center gap-[12px] rounded-[7px] border border-[rgba(0,0,0,.08)] bg-[rgba(255,255,255,.55)] px-[18px] py-[9px] font-[family-name:var(--font-geist-mono)] text-[12px] font-medium tracking-[.1em] whitespace-nowrap text-black uppercase opacity-0 backdrop-blur-[14px] transition-[opacity,scale] duration-300 before:h-[13px] before:w-[13px] before:shrink-0 before:rounded-full before:bg-[#F7A11A] before:content-[''] data-[shown=true]:scale-y-100 data-[shown=true]:opacity-100 max-[600px]:text-[10px]"
      >
        <span ref={pillTextRef} />
      </div>
    </div>
  );
}
