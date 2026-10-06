import type { CSSProperties } from "react";
import type { MarkKind } from "@/lib/pms-v3-hero";

/*
 * The two product marks, one family built from the site's honeycomb cell (the
 * pointy-top hexagon of components/about-v2/shared.ts). Like Tres Mares' marks
 * (reference/tresmares/source/marks), each is split on its horizontal centre
 * line and its halves are offset, top half left and bottom half right, the
 * same way the hero title steps. PMS is one cell, a single portfolio; AIF is
 * seven cells merged into one form, a pooled fund. The seven cells are sized
 * so both marks cover the same area (526k units²): PMS runs the artboard's
 * full height, AIF 850 of its 900.
 *
 * Every other page's header uses the same family: cells of the same hexagon,
 * arranged to say what the page is about, split on the same line and offset
 * the same way (see PAGE_CELLS).
 */

/** The artboard both marks are drawn on, the hero's 70vw × 100vh box at 1440 × 900. */
export const MARK_WIDTH = 1000;
export const MARK_HEIGHT = 900;
const CX = MARK_WIDTH / 2;
const CY = MARK_HEIGHT / 2;

type Point = readonly [number, number];

const SQRT3 = Math.sqrt(3);

/** Top half of one cell of radius 450: a roof over the upper halves of its sides. */
function pmsTop(): Point[] {
  const r = MARK_HEIGHT / 2;
  const w = SQRT3 * r;
  return [
    [-w / 2, 0],
    [-w / 2, -r / 2],
    [0, -r],
    [w / 2, -r / 2],
    [w / 2, 0],
  ];
}

/** Top half of seven cells of radius 170 merged into one outline: the middle row cut through its centres, two cells above it. */
function aifTop(): Point[] {
  const r = 170;
  const w = SQRT3 * r;
  return [
    [-1.5 * w, 0],
    [-1.5 * w, -r / 2],
    [-w, -r],
    [-w, -2 * r],
    [-w / 2, -2.5 * r],
    [0, -2 * r],
    [w / 2, -2.5 * r],
    [w, -2 * r],
    [w, -r],
    [1.5 * w, -r / 2],
    [1.5 * w, 0],
  ];
}

/** Both marks' halves slide this far apart, in artboard units, each half by `shift` in its own direction. */
const SHIFT = 110;

/** Each half reaches this far past the split line, so antialiasing leaves no hairline where the halves meet. */
const SEAM = 1.5;

const points = (outline: Point[], flip: 1 | -1) =>
  outline.map(([x, y]) => `${(CX + x).toFixed(1)},${(CY + flip * (y === 0 ? SEAM : y)).toFixed(1)}`).join(" ");

/** A pointy-top cell: centre x, centre y, radius, in artboard units. */
type Cell = readonly [x: number, y: number, r: number];

const cellOutline = ([x, y, r]: Cell): Point[] =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return [x + r * Math.cos(angle), y + r * Math.sin(angle)] as const;
  });

/** The part of a convex outline above (or below) the horizontal line `y`. */
function clipAt(outline: Point[], y: number, above: boolean): Point[] {
  const inside = ([, py]: Point) => (above ? py <= y : py >= y);
  const kept: Point[] = [];
  outline.forEach((point, index) => {
    const next = outline[(index + 1) % outline.length];
    if (inside(point)) kept.push(point);
    if (inside(point) !== inside(next)) {
      const t = (y - point[1]) / (next[1] - point[1]);
      kept.push([point[0] + t * (next[0] - point[0]), y]);
    }
  });
  return kept;
}

const toPoints = (outline: Point[]) => outline.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** The six cells around a centre cell, in the same grid as the AIF mark. */
const ring = (x: number, y: number, r: number): Cell[] => {
  const w = SQRT3 * r;
  return [
    [x - w, y, r],
    [x + w, y, r],
    [x - w / 2, y - 1.5 * r, r],
    [x + w / 2, y - 1.5 * r, r],
    [x - w / 2, y + 1.5 * r, r],
    [x + w / 2, y + 1.5 * r, r],
  ];
};

/**
 * Each page's cells. PMS vs AIF stands the PMS cell and the AIF cluster apart
 * at equal area (the cluster's radius is the cell's over √7), never touching.
 * Our approach grows three cells by a constant step, as the philosophy runs
 * undiscovered → under-researched → under-estimated. Performance climbs five
 * cells. The case studies bend three touching cells into a path. Careers is a
 * ring of six cells around an empty one.
 * Contact is a large cell meeting a small one. The investor centre stacks
 * three cells like filed documents.
 */
const PAGE_CELLS: Record<Exclude<MarkKind, "pms" | "aif">, Cell[]> = {
  compare: [[255, 450, 220], [745, 450, 220 / Math.sqrt(7)], ...ring(745, 450, 220 / Math.sqrt(7))],
  approach: [[115, 450, 120], [393, 450, 185], [801, 450, 270]],
  // Only the middle cell crosses the split, so no cell is cut into a sliver; the top cell stays below the header.
  performance: [0, 1, 2, 3, 4].map((step): Cell => [510 + (step - 2) * 161.5, 450 - (step - 2) * 119, 106]),
  cases: [[290, 600, 200], [290 + SQRT3 * 200, 600, 200], [290 + SQRT3 * 300, 300, 200]],
  careers: ring(500, 450, 150),
  contact: [[400, 450, 290], [400 + (SQRT3 / 2) * 420, 450, 130]],
  investor: [[500, 150, 150], [500, 450, 150], [500, 750, 150]],
};

/** Each mark's two halves, every cell cut on the centre line with the same seam overlap as the product marks. */
const MARKS: Record<MarkKind, { top: string[]; bottom: string[] }> = {
  pms: { top: [points(pmsTop(), 1)], bottom: [points(pmsTop(), -1)] },
  aif: { top: [points(aifTop(), 1)], bottom: [points(aifTop(), -1)] },
  ...(Object.fromEntries(
    Object.entries(PAGE_CELLS).map(([kind, cells]) => [
      kind,
      {
        top: cells.map((cell) => clipAt(cellOutline(cell), CY + SEAM, true)).filter((part) => part.length > 2).map(toPoints),
        bottom: cells.map((cell) => clipAt(cellOutline(cell), CY - SEAM, false)).filter((part) => part.length > 2).map(toPoints),
      },
    ]),
  ) as Record<Exclude<MarkKind, "pms" | "aif">, { top: string[]; bottom: string[] }>),
};

/**
 * A product mark in the brand orange, fitted to its box without distortion.
 * Each half carries its resting offset as an inline transform around the
 * artboard centre, so `halfClassName` can animate from any start to it.
 */
export function ProductMark({ kind, className, halfClassName }: { kind: MarkKind; className?: string; halfClassName?: string }) {
  const { top, bottom } = MARKS[kind];
  const half = (dx: number): CSSProperties => ({ transform: `translateX(${dx}px) scale(1)`, transformOrigin: `${CX}px ${CY}px` });
  return (
    <svg viewBox={`0 0 ${MARK_WIDTH} ${MARK_HEIGHT}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" className={className}>
      <g fill="#F6A11A">
        <g className={halfClassName} style={half(-SHIFT)}>
          {top.map((part) => (
            <polygon key={part} points={part} />
          ))}
        </g>
        <g className={halfClassName} style={half(SHIFT)}>
          {bottom.map((part) => (
            <polygon key={part} points={part} />
          ))}
        </g>
      </g>
    </svg>
  );
}
