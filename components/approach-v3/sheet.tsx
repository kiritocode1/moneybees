"use client";

import type { CSSProperties } from "react";
import { useShown } from "@/components/about-v2/shared";

/*
 * The process-sheet kit, from study 09 (reference/visual-language/09/STUDY.md):
 * hairline rings, dotted relations and boxes, open chevrons, filled nodes,
 * and one orange element per figure. A diagram is data (nodes placed in
 * artboard units, edges between them) so each step of /our-approach can be
 * drawn from its own sentence, with a separate arrangement for phones.
 *
 * Measured rules kept here: chain rings interlock by 6.8% of their diameter,
 * Venn rings sit on an equilateral triangle of side 1.52 r with a start dot
 * where all of them overlap, chevrons open at 42°, the targeting ring is
 * 2.47 r, and a dotted line is a 1:1 pattern at the ink weight.
 */

export type Pt = readonly [x: number, y: number];

export type SheetNode =
  /** A hairline ring, optionally filled: `ink` is the sheet's filled node, `accent` the figure's one orange element. */
  | { id: string; kind: "ring"; at: Pt; r: number; label?: readonly string[]; fill?: "ink" | "accent"; dotted?: boolean }
  /** A dotted box holding a centred list. */
  | { id: string; kind: "box"; at: Pt; w: number; h: number; items: readonly string[] }
  /** The filled square a flow ends on, always the accent. */
  | { id: string; kind: "square"; at: Pt; s: number; label: string }
  /** A dotted ring filled with a field of small dots, one per company; `accent` makes the dots orange. */
  | { id: string; kind: "field"; at: Pt; r: number; accent?: boolean }
  /** A dotted ring with a chevron on it: something tracked round and round. */
  | { id: string; kind: "cycle"; at: Pt; r: number }
  /** A bare point, where a connector starts inside overlapping rings. */
  | { id: string; kind: "point"; at: Pt }
  /** Text on its own, for a label set inside overlapping rings. */
  | { id: string; kind: "label"; at: Pt; lines: readonly string[] };

export type SheetEdge = { from: string; to: string; dotted?: boolean };

/** A small mono tag set beside a figure, as the sheet labels its targeting ring. */
export type SheetTag = { at: Pt; text: string; anchor?: "start" | "middle" | "end" };

export type SheetSpec = { nodes: readonly SheetNode[]; edges: readonly SheetEdge[]; tags?: readonly SheetTag[]; font: number };

const ORANGE = "#F6A11A";
const INK = "#FFFFFF";
const PAPER = "#000000";
const LINE = 1.25;
const DOTS = "1.6 2";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";
/** How far an arrow's apex stops short of the shape it points at. */
const GAP = 7;
const CHEVRON = 8;
const CHEVRON_ANGLE = (42 * Math.PI) / 180;

const byId = (spec: SheetSpec) => new Map(spec.nodes.map((node) => [node.id, node]));

/** Where the line from a node's centre towards `toward` leaves its outline. */
function rim(node: SheetNode, toward: Pt): Pt {
  const [x, y] = node.at;
  const dx = toward[0] - x;
  const dy = toward[1] - y;
  const length = Math.hypot(dx, dy) || 1;
  switch (node.kind) {
    case "point":
    case "label":
      return node.at;
    case "box":
    case "square": {
      const hw = node.kind === "box" ? node.w / 2 : node.s / 2;
      const hh = node.kind === "box" ? node.h / 2 : node.s / 2;
      const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
      return [x + dx * t, y + dy * t];
    }
    default:
      return [x + (dx / length) * node.r, y + (dy / length) * node.r];
  }
}

function extent(node: SheetNode): [number, number, number, number] {
  const [x, y] = node.at;
  if (node.kind === "point" || node.kind === "label") return [x, y, x, y];
  if (node.kind === "box") return [x - node.w / 2, y - node.h / 2, x + node.w / 2, y + node.h / 2];
  if (node.kind === "square") return [x - node.s / 2, y - node.s / 2, x + node.s / 2, y + node.s / 2];
  return [x - node.r, y - node.r, x + node.r, y + node.r];
}

/** The figure's bounds with room for strokes and tags. */
function viewBox(spec: SheetSpec) {
  const boxes = spec.nodes.map(extent);
  for (const tag of spec.tags ?? []) {
    const half = tag.text.length * spec.font * 0.42;
    const left = tag.anchor === "start" ? 0 : tag.anchor === "end" ? half * 2 : half;
    boxes.push([tag.at[0] - left, tag.at[1] - spec.font, tag.at[0] + half * 2 - left, tag.at[1] + 4]);
  }
  const pad = 6;
  const x0 = Math.min(...boxes.map((box) => box[0])) - pad;
  const y0 = Math.min(...boxes.map((box) => box[1])) - pad;
  const x1 = Math.max(...boxes.map((box) => box[2])) + pad;
  const y1 = Math.max(...boxes.map((box) => box[3])) + pad;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** Points along a hex grid inside radius `r`, one dot per company. */
function field(at: Pt, r: number): Pt[] {
  const pitch = 13;
  const rowStep = pitch * 0.866;
  const reach = r * 0.74;
  const points: Pt[] = [];
  for (let row = -Math.floor(reach / rowStep); row * rowStep <= reach; row += 1) {
    const offset = row % 2 ? pitch / 2 : 0;
    for (let col = -Math.ceil(reach / pitch); col * pitch <= reach; col += 1) {
      const x = col * pitch + offset;
      const y = row * rowStep;
      if (Math.hypot(x, y) <= reach) points.push([at[0] + x, at[1] + y]);
    }
  }
  return points;
}

const chevron = (tip: Pt, from: Pt) => {
  const angle = Math.atan2(tip[1] - from[1], tip[0] - from[0]);
  const arm = (side: 1 | -1) => [tip[0] - CHEVRON * Math.cos(angle - side * CHEVRON_ANGLE), tip[1] - CHEVRON * Math.sin(angle - side * CHEVRON_ANGLE)] as const;
  const [a, b] = [arm(1), arm(-1)];
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${tip[0].toFixed(1)} ${tip[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
};

/** Centred lines of text about a point. */
function Lines({ at, lines, font, fill, lineHeight = 1.25 }: { at: Pt; lines: readonly string[]; font: number; fill: string; lineHeight?: number }) {
  return (
    <text x={at[0]} textAnchor="middle" fontSize={font} fill={fill} className="font-sans">
      {lines.map((line, index) => (
        <tspan key={line} x={at[0]} y={at[1] + (index - (lines.length - 1) / 2) * font * lineHeight} dominantBaseline="central">
          {line}
        </tspan>
      ))}
    </text>
  );
}

type Motion = { shown: boolean; t: (ms: number, delay?: number) => string };

/** A stroke that draws itself on, for solid outlines and connectors. */
const drawn = ({ shown, t }: Motion, delay: number): CSSProperties => ({ strokeDasharray: "1 1", strokeDashoffset: shown ? 0 : 1, transition: `stroke-dashoffset ${t(760, delay)}` });
const faded = ({ shown, t }: Motion, delay: number, ms = 480): CSSProperties => ({ opacity: shown ? 1 : 0, transition: `opacity ${t(ms, delay)}` });
const landed = ({ shown, t }: Motion, delay: number): CSSProperties => ({ opacity: shown ? 1 : 0, transform: shown ? "none" : "scale(.6)", transformBox: "fill-box", transformOrigin: "center", transition: `opacity ${t(420, delay)}, transform ${t(620, delay)}` });

function Node({ node, font, motion, delay }: { node: SheetNode; font: number; motion: Motion; delay: number }) {
  const [x, y] = node.at;
  switch (node.kind) {
    case "point":
      return <circle cx={x} cy={y} r={2.2} fill={INK} style={faded(motion, delay)} />;
    case "label":
      return (
        <g style={faded(motion, delay + 320)}>
          <Lines at={node.at} lines={node.lines} font={font} fill={INK} />
        </g>
      );
    case "ring": {
      const filled = node.fill === "accent" ? ORANGE : node.fill === "ink" ? INK : undefined;
      return (
        <g>
          {filled ? (
            <circle cx={x} cy={y} r={node.r} fill={filled} style={landed(motion, delay + 260)} />
          ) : node.dotted ? (
            <circle cx={x} cy={y} r={node.r} fill="none" stroke={INK} strokeWidth={LINE} strokeDasharray={DOTS} style={faded(motion, delay)} />
          ) : (
            <circle cx={x} cy={y} r={node.r} fill="none" stroke={INK} strokeWidth={LINE} pathLength={1} transform={`rotate(-90 ${x} ${y})`} style={drawn(motion, delay)} />
          )}
          {node.label ? (
            <g style={faded(motion, delay + (filled ? 520 : 320))}>
              <Lines at={node.at} lines={node.label} font={font} fill={filled ? PAPER : INK} />
            </g>
          ) : null}
        </g>
      );
    }
    case "box":
      return (
        <g style={faded(motion, delay)}>
          <rect x={x - node.w / 2} y={y - node.h / 2} width={node.w} height={node.h} fill="none" stroke={INK} strokeWidth={LINE} strokeDasharray={DOTS} />
          <Lines at={node.at} lines={node.items} font={font} fill={INK} lineHeight={1.75} />
        </g>
      );
    case "square":
      return (
        <g style={landed(motion, delay + 260)}>
          <rect x={x - node.s / 2} y={y - node.s / 2} width={node.s} height={node.s} fill={ORANGE} />
          <Lines at={node.at} lines={[node.label]} font={font} fill={PAPER} />
        </g>
      );
    case "field":
      return (
        <g>
          <circle cx={x} cy={y} r={node.r} fill="none" stroke={INK} strokeWidth={LINE} strokeDasharray={DOTS} style={faded(motion, delay)} />
          {field(node.at, node.r).map(([px, py], index) => (
            <circle key={index} cx={px} cy={py} r={2.4} fill={node.accent ? ORANGE : INK} style={faded(motion, delay + 300 + (index % 7) * 60, 360)} />
          ))}
        </g>
      );
    case "cycle": {
      // A chevron at the top of the ring, pointing clockwise.
      const tip: Pt = [x + 4, y - node.r];
      return (
        <g style={faded(motion, delay)}>
          <circle cx={x} cy={y} r={node.r} fill="none" stroke={INK} strokeWidth={LINE} strokeDasharray={DOTS} />
          <path d={chevron(tip, [x - 6, y - node.r])} fill="none" stroke={INK} strokeWidth={LINE} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    }
  }
}

function Edge({ edge, nodes, motion, delay }: { edge: SheetEdge; nodes: Map<string, SheetNode>; motion: Motion; delay: number }) {
  const from = nodes.get(edge.from);
  const to = nodes.get(edge.to);
  if (!from || !to) return null;
  const start = rim(from, to.at);
  const end = rim(to, from.at);
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy) || 1;
  const lead = from.kind === "point" ? 0 : GAP;
  const a: Pt = [start[0] + (dx / length) * lead, start[1] + (dy / length) * lead];
  const tip: Pt = [end[0] - (dx / length) * GAP, end[1] - (dy / length) * GAP];
  const d = `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${tip[0].toFixed(1)} ${tip[1].toFixed(1)}`;
  return (
    <g>
      {edge.dotted ? (
        <path d={d} fill="none" stroke={INK} strokeWidth={LINE} strokeDasharray={DOTS} style={faded(motion, delay)} />
      ) : (
        <path d={d} fill="none" stroke={INK} strokeWidth={LINE} pathLength={1} style={drawn(motion, delay)} />
      )}
      <path d={chevron(tip, a)} fill="none" stroke={INK} strokeWidth={LINE} strokeLinecap="round" strokeLinejoin="round" style={faded(motion, delay + 420)} />
    </g>
  );
}

/**
 * One diagram at a fixed pixel scale, so type sits at the same size in every
 * figure; it shrinks only when its column is narrower. Nodes draw in the
 * order listed, each edge after the later of its two ends, and filled
 * elements land last.
 */
export function SheetDiagram({ spec, scale, className, shown, t }: { spec: SheetSpec; scale: number; className?: string } & Motion) {
  const nodes = byId(spec);
  const order = new Map(spec.nodes.map((node, index) => [node.id, index]));
  const box = viewBox(spec);
  const motion = { shown, t };
  return (
    <svg viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} width={box.w * scale} className={`block h-auto max-w-full overflow-visible ${className ?? ""}`} aria-hidden="true">
      {spec.edges.map((edge) => (
        <Edge key={`${edge.from}-${edge.to}`} edge={edge} nodes={nodes} motion={motion} delay={Math.max(order.get(edge.from) ?? 0, order.get(edge.to) ?? 0) * 90 + 380} />
      ))}
      {spec.nodes.map((node, index) => (
        <Node key={node.id} node={node} font={spec.font} motion={motion} delay={index * 90} />
      ))}
      {spec.tags?.map((tag) => (
        <text key={tag.text} x={tag.at[0]} y={tag.at[1]} textAnchor={tag.anchor ?? "middle"} fontSize={spec.font * 0.78} letterSpacing={spec.font * 0.1} fill={INK} fillOpacity={0.6} fontFamily={MONO} style={faded(motion, 200)}>
          {tag.text.toUpperCase()}
        </text>
      ))}
    </svg>
  );
}

/** A desktop and a phone arrangement of the same figure, the right one shown by width, both drawn when scrolled into view. */
export function SheetFigure({ wide, narrow }: { wide: SheetSpec; narrow: SheetSpec }) {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.35);
  return (
    <div ref={ref}>
      <SheetDiagram spec={wide} scale={1.3} className="max-md:hidden" shown={shown} t={t} />
      <SheetDiagram spec={narrow} scale={1.08} className="mx-auto md:hidden" shown={shown} t={t} />
    </div>
  );
}
