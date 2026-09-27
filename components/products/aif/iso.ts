import { path, type Point, project } from "@/components/iso/geometry";

/**
 * Isometric helpers for the AIF figures, in the shared projection of
 * components/iso/geometry: boxes that are not square, and a box's wire edges.
 */

export type Box = { top: string; left: string; right: string; depth: number };

/** A w by d box of height h standing at plan (x, y) on z, offset to screen (ox, oy). Only the three visible faces. */
export function box(x: number, y: number, w: number, d: number, h: number, z = 0, ox = 0, oy = 0): Box {
  const p = (px: number, py: number, pz: number): Point => {
    const [sx, sy] = project(px, py, pz);
    return [ox + sx, oy + sy];
  };
  const x1 = x + w;
  const y1 = y + d;
  const top = z + h;
  return {
    top: path([p(x, y, top), p(x1, y, top), p(x1, y1, top), p(x, y1, top)]),
    right: path([p(x1, y, top), p(x1, y1, top), p(x1, y1, z), p(x1, y, z)]),
    left: path([p(x, y1, top), p(x1, y1, top), p(x1, y1, z), p(x, y1, z)]),
    depth: p(x + w / 2, y + d / 2, z)[1],
  };
}

/** Every edge of a box as one open path, for a wireframe drawn dashed. */
export function wireBox(x: number, y: number, w: number, d: number, h: number, ox = 0, oy = 0): string {
  const p = (px: number, py: number, pz: number): Point => {
    const [sx, sy] = project(px, py, pz);
    return [ox + sx, oy + sy];
  };
  const x1 = x + w;
  const y1 = y + d;
  const corners = (z: number) => [p(x, y, z), p(x1, y, z), p(x1, y1, z), p(x, y1, z)];
  const low = corners(0);
  const high = corners(h);
  return [path(low), path(high), ...low.map((corner, i) => path([corner, high[i]], false))].join("");
}

/** A plan point lifted to z, as screen coordinates with an offset. */
export function at(x: number, y: number, z: number, ox = 0, oy = 0): Point {
  const [sx, sy] = project(x, y, z);
  return [ox + sx, oy + sy];
}
