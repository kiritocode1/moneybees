/**
 * Shared axonometric projection for the three insight figures.
 *
 * The reference does not use a true isometric. A true isometric maps a circle
 * to an ellipse tilted 45 degrees, and every circle in the reference (the pie
 * rim, the shadow ring, the beacon dial) has a horizontal major axis. What it
 * actually uses is a plan rotation followed by a vertical squash, which leaves
 * circles axis-aligned while still turning a square footprint into a rhombus.
 *
 * SQUASH is the ratio of an ellipse's minor to major axis. Measured off the
 * beacon dial, which is the only large clean circle in the capture: 232px
 * across against 83px tall. The cone's base ellipse agrees at this ratio
 * (43px across, closing 7 rows below its widest).
 */
export const PLAN_ROTATION = Math.PI / 4;
export const SQUASH = 0.35;

const COS_PLAN = Math.cos(PLAN_ROTATION);
const SIN_PLAN = Math.sin(PLAN_ROTATION);

/**
 * Plan angles of the half of a circle that faces the viewer.
 *
 * Because `project` rotates the plan before squashing it, a point's screen y is
 * proportional to sin(t + PLAN_ROTATION), so the front-most point is at
 * t = 90deg - PLAN_ROTATION rather than at 90deg. Sweeping 0..PI instead — the
 * obvious choice — returns an arc whose ends are not the silhouette edges, and
 * a cylinder built from it comes out a factor of cos(PLAN_ROTATION) too narrow.
 */
export const FRONT_FROM = Math.PI / 2 - PLAN_ROTATION - Math.PI / 2;
export const FRONT_TO = Math.PI / 2 - PLAN_ROTATION + Math.PI / 2;

export type Point = readonly [number, number];

/** Project a point from figure space (x, y in plan, z up) to screen space. */
export function project(x: number, y: number, z: number): Point {
  return [
    x * COS_PLAN - y * SIN_PLAN,
    (x * SIN_PLAN + y * COS_PLAN) * SQUASH - z,
  ];
}

/** A point on a circle of `radius` at plan angle `angle`, lifted to `z`. */
export function onCircle(radius: number, angle: number, z: number): Point {
  return project(radius * Math.cos(angle), radius * Math.sin(angle), z);
}

export function path(points: readonly Point[], close = true): string {
  if (points.length === 0) return "";
  const [head, ...rest] = points;
  const body = rest.map(([x, y]) => `L${x.toFixed(2)} ${y.toFixed(2)}`).join("");
  return `M${head[0].toFixed(2)} ${head[1].toFixed(2)}${body}${close ? "Z" : ""}`;
}

/**
 * Sample a plan-space arc as a polyline. Ellipse arcs could use SVG's own A
 * command, but the segments also need their end points in figure space to build
 * the extruded side walls, so sampling keeps one source of truth.
 */
export function arcPoints(
  radius: number,
  from: number,
  to: number,
  z: number,
  steps = 24,
): Point[] {
  const out: Point[] = [];
  for (let i = 0; i <= steps; i += 1) {
    out.push(onCircle(radius, from + ((to - from) * i) / steps, z));
  }
  return out;
}

/* ---------------------------------------------------------------- bars --- */

export type BarFaces = {
  top: string;
  left: string;
  right: string;
  /** Screen y of the footprint centre, used to sort near bars over far ones. */
  depth: number;
};

/**
 * One extruded box standing on the ground plane. Only three faces can ever be
 * seen from a fixed viewpoint, so the hidden three are never emitted.
 */
export function barFaces(
  originX: number,
  originY: number,
  size: number,
  height: number,
): BarFaces {
  const x0 = originX;
  const x1 = originX + size;
  const y0 = originY;
  const y1 = originY + size;

  const topFace = [
    project(x0, y0, height),
    project(x1, y0, height),
    project(x1, y1, height),
    project(x0, y1, height),
  ] as const;

  // With the plan rotated a quarter turn the two faces that face the viewer are
  // the +x wall and the +y wall; the other two are always behind the solid.
  const rightFace = [
    project(x1, y0, height),
    project(x1, y1, height),
    project(x1, y1, 0),
    project(x1, y0, 0),
  ] as const;

  const leftFace = [
    project(x0, y1, height),
    project(x1, y1, height),
    project(x1, y1, 0),
    project(x0, y1, 0),
  ] as const;

  return {
    top: path(topFace),
    right: path(rightFace),
    left: path(leftFace),
    depth: project(originX + size / 2, originY + size / 2, 0)[1],
  };
}

/* ----------------------------------------------------------------- pie --- */

export type PieFaces = {
  top: string;
  rim: string;
  cut: string;
  depth: number;
};

/**
 * One extruded pie wedge, offset outward along its own bisector.
 *
 * Which walls exist is decided by back-face culling rather than by a heuristic.
 * A wall is visible when its outward normal points toward the viewer, which in
 * this projection means sin(normal + PLAN_ROTATION) > 0. That matters at the
 * centre of the plate: a wedge turned toward the viewer shows BOTH of its
 * radial cuts, one turned away shows neither, and picking exactly one — as an
 * earlier version did — leaves a wall floating where the solid has none and
 * drops the wall that should be there.
 */
function facesViewer(normalAngle: number): boolean {
  return Math.sin(normalAngle + PLAN_ROTATION) > 0;
}

export function pieFaces(
  from: number,
  to: number,
  radius: number,
  thickness: number,
  explode: number,
  lift: number,
): PieFaces {
  const mid = (from + to) / 2;
  const offset = project(Math.cos(mid) * explode, Math.sin(mid) * explode, 0);
  const shift = (p: Point): Point => [p[0] + offset[0], p[1] + offset[1]];

  const top = lift + thickness;
  const apexTop = shift(project(0, 0, top));
  const apexLow = shift(project(0, 0, lift));

  const STEPS = 28;
  const angles = Array.from({ length: STEPS + 1 }, (_, i) => from + ((to - from) * i) / STEPS);
  const outerTop = angles.map((a) => shift(onCircle(radius, a, top)));
  const outerLow = angles.map((a) => shift(onCircle(radius, a, lift)));

  // Rim wall, emitted as one quad strip per run of consecutive viewer-facing
  // samples. A wedge can straddle the silhouette and produce two runs.
  const runs: number[][] = [];
  let run: number[] = [];
  angles.forEach((a, i) => {
    if (facesViewer(a)) {
      run.push(i);
    } else if (run.length) {
      runs.push(run);
      run = [];
    }
  });
  if (run.length) runs.push(run);

  const rim = runs
    .filter((r) => r.length > 1)
    .map((r) =>
      path([...r.map((i) => outerTop[i]), ...r.slice().reverse().map((i) => outerLow[i])]),
    )
    .join("");

  // The two radial cuts. Outward normals point a quarter turn away from the
  // wedge interior on each side.
  const cuts: string[] = [];
  if (facesViewer(from - Math.PI / 2)) {
    cuts.push(path([apexTop, outerTop[0], outerLow[0], apexLow]));
  }
  if (facesViewer(to + Math.PI / 2)) {
    const last = angles.length - 1;
    cuts.push(path([apexTop, outerTop[last], outerLow[last], apexLow]));
  }

  return {
    top: path([apexTop, ...outerTop]),
    rim,
    cut: cuts.join(""),
    depth: shift(onCircle(radius * 0.6, mid, 0))[1],
  };
}

/* --------------------------------------------------------------- beacon --- */

/**
 * The light cone leaving the lamp and landing on the dial. `spread` is its half
 * angle in plan. Returned as a triangle fan so the landing edge curves with the
 * dial rather than cutting straight across it.
 */
export function beamPath(
  lampX: number,
  lampY: number,
  lampZ: number,
  angle: number,
  spread: number,
  reach: number,
): string {
  const apex = project(lampX, lampY, lampZ);
  const landing = arcPoints(reach, angle - spread, angle + spread, 0, 10);
  return path([apex, ...landing]);
}

/** Ticks around the dial rim, as [inner, outer] screen-space pairs. */
export function dialTicks(
  radius: number,
  length: number,
  count: number,
): { d: string; angle: number }[] {
  const out: { d: string; angle: number }[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const inner = onCircle(radius - length, angle, 0);
    const outer = onCircle(radius, angle, 0);
    out.push({ d: path([inner, outer], false), angle });
  }
  return out;
}
