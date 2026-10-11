"use client";

import { useEffect, useRef } from "react";

/*
 * The figure on each of the homepage's two product cards: investors at the top
 * drip money into what they own below.
 *
 * PMS: one investor, one portfolio of 19 cells (the deck's 15 to 20 stocks),
 * all listed. AIF: seven investors, one pooled fund of 49 cells, 25 listed
 * (solid) and 24 unlisted (hollow), the deck's 51% and 49%; the hollow cells
 * keep filling on the wave, companies going public.
 *
 * The motion is Whitespace's Pattern Cards, read from its source
 * (reference/whitespace-pattern-cards, NOTES.md there): every cell morphs
 * between solid and ring on one slow sine wave travelling diagonally, the
 * drops fall at a constant speed and fade, and near the pointer cells grow
 * while the rest make room, every change eased toward its target. A canvas
 * per card, drawing only while in view; reduced motion draws it at rest.
 */

type Kind = "pms" | "aif";

const ORANGE = "#F6A11A";
/** Investors are people, not holdings, so they are drawn in the ink. */
const INK = "#272727";
const S3 = Math.sqrt(3);

/** Whitespace's animation values. */
const WAVE = { speed: 0.16, phaseSpread: 2.25, easing: 3 };
/** Listed cells stay mostly solid, opening to a ring as the wave passes (Whitespace's bias is −0.34). */
const LISTED_BIAS = -0.6;
/** Unlisted cells sit the other way round: mostly hollow, filling as the wave passes, companies going public. */
const UNLISTED_BIAS = 0.6;
const RING_STROKE = 0.06;
const DROP = { rate: 0.6, jitter: 0.16, speed: 55, opacity: 0.5 };
/** Whitespace's pointer curve (scale 3.8 over 161 px for its 13 dots; gentler here for 19 and 49 cells). Its smoothing is 260 ms for position and 220 ms for scale; position leads here, so cells part before they grow. */
const POINTER = { scaleMax: 1.7, radius: 0.24, easing: 1.6, pushTau: 0.2, scaleTau: 0.26 };

/** Of the AIF's 49 cells, the 24 that are unlisted: 49% against the deck's "up to 49% unlisted". */
const UNLISTED = 24;

const hexCorners = Array.from({ length: 6 }, (_, k) => {
  const a = ((60 * k - 90) * Math.PI) / 180;
  return [Math.cos(a), Math.sin(a)] as const;
});

function hexPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  hexCorners.forEach(([cx, cy], k) => (k === 0 ? ctx.moveTo(x + cx * r, y + cy * r) : ctx.lineTo(x + cx * r, y + cy * r)));
  ctx.closePath();
}

/** Whitespace's fill: 0 is solid, 1 is a ring. */
function morph(t: number, phase: number, bias: number) {
  const g = Math.min(1, Math.max(0, (Math.sin(t * WAVE.speed * Math.PI * 2 + phase * WAVE.phaseSpread) + bias + 1) / 2));
  return g < 0.5 ? (2 * g) ** WAVE.easing / 2 : 1 - (2 * (1 - g)) ** WAVE.easing / 2;
}

function inPolygon(x: number, y: number, poly: readonly (readonly [number, number])[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Lattice positions in cell radii, around the glyph's centre: PMS a hexagon of 19, AIF the 49 inside its mark. */
function glyph(kind: Kind): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  if (kind === "pms") {
    for (let r = -2; r <= 2; r++)
      for (let q = -2; q <= 2; q++) if (Math.abs(q + r) <= 2) out.push({ x: S3 * (q + r / 2), y: 1.5 * r });
    return out;
  }
  // The AIF mark's seven cells (components/pms-v3/marks.tsx, radius 170) in 66-unit cells, measured to hold exactly 49 centres.
  const big = 170 / 66;
  const cells = [[0, 0], [-S3, 0], [S3, 0], [-S3 / 2, -1.5], [S3 / 2, -1.5], [-S3 / 2, 1.5], [S3 / 2, 1.5]].map(([x, y]) =>
    hexCorners.map(([cx, cy]) => [x * big + cx * big, y * big + cy * big] as const),
  );
  for (let row = -8; row <= 8; row++)
    for (let col = -8; col <= 8; col++) {
      const x = S3 * (col + (row & 1 ? 0.5 : 0));
      const y = 1.5 * row;
      if (cells.some((poly) => inPolygon(x, y, poly))) out.push({ x, y });
    }
  return out;
}

type Cell = { hx: number; hy: number; phase: number; bias: number; x: number; y: number; s: number; bump: number };
type Investor = { x: number; y: number; next: number; targets: number[]; turn: number };
type Drop = { x0: number; y0: number; x1: number; y1: number; age: number; life: number; target: number };

export function FundFigure({ kind }: { kind: Kind }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = glyph(kind);

    let W = 0;
    let H = 0;
    let rho = 10;
    let invR = 10;
    let dropR = 4;
    let cells: Cell[] = [];
    let investors: Investor[] = [];
    let drops: Drop[] = [];
    let pointer: { x: number; y: number } | null = null;
    let dropsAlpha = 1;
    let shown = 0;
    let time = 0;
    let last = 0;
    let raf = 0;
    let running = false;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Both glyphs cover the same area: the PMS hexagon is 8 radii tall at half the box, the AIF's cells are smaller by √(19/49).
      const pmsRho = (0.5 * H) / 8;
      rho = kind === "pms" ? pmsRho : pmsRho * Math.sqrt(19 / 49);
      invR = 0.5 * pmsRho;
      dropR = 0.32 * pmsRho;
      const cx = W / 2;
      const cy = 0.6 * H;
      // Unlisted cells are spread through the fund, every other one in reading order until 24 are taken.
      const order = points.map((p, i) => ({ i, key: p.y * 100 + p.x })).sort((a, b) => a.key - b.key);
      const unlisted = new Set(kind === "aif" ? order.filter((_, n) => n % 2 === 1).slice(0, UNLISTED).map((o) => o.i) : []);
      cells = points.map((p, i) => {
        const hx = cx + p.x * rho;
        const hy = cy + p.y * rho;
        return { hx, hy, phase: 0.45 * (p.y / 1.5) + 0.7 * (p.x / S3), bias: unlisted.has(i) ? UNLISTED_BIAS : LISTED_BIAS, x: hx, y: hy, s: 1, bump: 0 };
      });
      const count = kind === "pms" ? 1 : 7;
      const spacing = Math.min(0.11 * W, 2.6 * invR * 1.9);
      investors = Array.from({ length: count }, (_, n) => {
        const x = cx + (n - (count - 1) / 2) * spacing;
        const y = 0.16 * H;
        // Each investor's drops land on the fund's cells nearest to them.
        const targets = cells
          .map((c, i) => ({ i, d: Math.hypot(c.hx - x, c.hy - y) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, kind === "pms" ? 3 : 2)
          .map((o) => o.i);
        return { x, y, next: Math.random() / DROP.rate, targets, turn: 0 };
      });
      drops = [];
    };

    const step = (dt: number) => {
      time += dt;
      shown = Math.min(1, shown + dt / 0.6);

      // Drops leave each investor about every 1/rate seconds and fall straight to a cell at a constant speed.
      for (const inv of investors) {
        inv.next -= dt;
        if (inv.next > 0) continue;
        const period = 1 / DROP.rate;
        inv.next = period + (Math.random() - 0.5) * DROP.jitter * period;
        const target = inv.targets[inv.turn++ % inv.targets.length];
        const c = cells[target];
        const life = Math.hypot(c.hx - inv.x, c.hy - inv.y) / DROP.speed;
        drops.push({ x0: inv.x, y0: inv.y + invR, x1: c.hx, y1: c.hy, age: 0, life, target });
      }
      drops = drops.filter((d) => {
        d.age += dt;
        if (d.age < d.life) return true;
        cells[d.target].bump = 1;
        return false;
      });

      // Near the pointer cells grow by Whitespace's curve, s(d) = 1 + (S − 1)(1 − d/R)^e, and move out
      // to d' = ∫₀ᵈ s(u) du. Spacing then grows exactly as fast as the cells, so none overlap, and cells
      // past the lens shift out by the same amount, as Whitespace's packing spreads its glyph.
      const R = POINTER.radius * W;
      const S = POINTER.scaleMax;
      const e = POINTER.easing;
      const floor = 0.16 * H + invR * 1.6;
      const target = cells.map((c) => {
        if (!pointer) return { x: c.hx, y: c.hy, s: 1 };
        const dx = c.hx - pointer.x;
        const dy = c.hy - pointer.y;
        const d = Math.hypot(dx, dy);
        const inside = d < R ? 1 - d / R : 0;
        const scale = 1 + (S - 1) * inside ** e;
        const reach = d + ((S - 1) * R * (1 - inside ** (e + 1))) / (e + 1);
        const k = d > 1e-6 ? reach / d : 1;
        // Holdings stay below the investors.
        return { x: pointer.x + dx * k, y: Math.max(pointer.y + dy * k, floor + scale * rho * 0.86), s: scale };
      });
      const kPos = 1 - Math.exp(-dt / POINTER.pushTau);
      const kScale = 1 - Math.exp(-dt / POINTER.scaleTau);
      cells.forEach((c, i) => {
        c.x += (target[i].x - c.x) * kPos;
        c.y += (target[i].y - c.y) * kPos;
        c.s += (target[i].s - c.s) * kScale;
        c.bump *= Math.exp(-dt / 0.35);
      });
      dropsAlpha += ((pointer ? 0 : 1) - dropsAlpha) * kScale;
    };

    /** One cell as Whitespace draws a dot: the solid shrinks inside a ring that fades in. */
    const drawCell = (x: number, y: number, r: number, fill: number, alpha: number) => {
      const solid = r * (1 - fill);
      if (solid > 0.1) {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        hexPath(ctx, x, y, solid);
        ctx.fill();
      }
      if (fill > 0.01) {
        const stroke = Math.max(1, 2 * r * RING_STROKE);
        ctx.globalAlpha = alpha * fill;
        ctx.lineWidth = stroke;
        ctx.beginPath();
        hexPath(ctx, x, y, r - stroke / 2);
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const ease = 1 - (1 - shown) ** 3;
      ctx.fillStyle = INK;
      for (const inv of investors) drawCell(inv.x, inv.y, invR, 0, ease);
      ctx.fillStyle = ORANGE;
      ctx.strokeStyle = ORANGE;
      if (dropsAlpha > 0.01) {
        for (const d of drops) {
          const p = d.age / d.life;
          const x = d.x0 + (d.x1 - d.x0) * p;
          const y = d.y0 + (d.y1 - d.y0) * p;
          // In over the first fifth, out over the last quarter, as it sinks into the cell.
          const fade = Math.min(1, p / 0.2, (1 - p) / 0.25);
          drawCell(x, y, dropR, 0, DROP.opacity * fade * dropsAlpha * ease);
        }
      }
      for (const c of cells) drawCell(c.x, c.y, rho * 0.86 * c.s * (1 + 0.12 * c.bump), morph(time, c.phase, c.bias), ease);
      ctx.globalAlpha = 1;
    };

    const resize = new ResizeObserver(() => {
      layout();
      if (reduce) {
        // Reduced motion: the glyph at rest, no drops and no pointer.
        shown = 1;
        drops = [];
      }
      draw();
    });
    resize.observe(canvas);
    if (reduce) return () => resize.disconnect();

    const frame = (now: number) => {
      if (!running) return;
      step(Math.min((now - last) / 1000, 0.05));
      last = now;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const box = canvas.parentElement ?? canvas;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onLeave = () => (pointer = null);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      resize.disconnect();
      io.disconnect();
    };
  }, [kind]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
