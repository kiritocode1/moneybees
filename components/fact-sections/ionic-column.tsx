import { FRONT_FROM, path, type Point, project, SQUASH } from "@/components/iso/geometry";
import { r2 } from "./fact-section";

/*
 * An Ionic column in the cards' axonometric projection, built as real solids
 * so it holds up while it turns: a square plinth, an Attic base (two tori and
 * a scotia), a fluted shaft with entasis, an astragal, an egg-and-dart
 * echinus, two volute bolsters with mirrored spirals on their faces, and a
 * square abacus. Every part is placed in the column's own frame (u, v, z),
 * rotated by `turn` and projected, so the whole column spins as one piece.
 * Shading is lit from a fixed direction (upper left), so it stays put while
 * the flutes, eggs, volutes and square slabs move through it.
 */

/**
 * Heights (z) and radii of the parts, in figure units, set to classical Ionic
 * proportions: a shaft about eight lower diameters tall with a slight
 * taper, volutes about a third of the capital's width, a thin abacus.
 */
const PLINTH = { half: 15.5, z0: 0, z1: 5 };
const LATHE = {
  lowerTorus: { z0: 5, z1: 9.5, r: 14.2 },
  scotia: { z0: 9.5, z1: 12, r: 11.6 },
  upperTorus: { z0: 12, z1: 15.5, r: 12.8 },
  fillet: { z0: 15.5, z1: 17, r: 11.6 },
  astragal: { z0: 164, z1: 167, r: 11 },
  echinus: { z0: 167, z1: 173, r: 12.4 },
};
const SHAFT = { z0: 17, z1: 164, rBottom: 11, rTop: 9.4, flutes: 20 };
const EGGS = 14;
const VOLUTE = { u: 14.5, depth: 9.5, r: 8.2, z: 174 };
const ABACUS = { half: 15.5, z0: 179.5, z1: 182 };

const INK = "rgba(0,0,0,.55)";
const HAIR = 0.6;

type Project = (u: number, v: number, z: number) => Point;

/** Brightness 0..1 of a surface whose outward plan normal points at `angle`, lit from the upper left of the screen. */
function light(angle: number) {
  // The light sits front-left; normals turned toward it are brightest.
  return 0.5 + 0.5 * Math.cos(angle - (FRONT_FROM + Math.PI * 0.62));
}

function shade(brightness: number, lit: boolean) {
  const b = Math.max(0, Math.min(1, brightness));
  const mix = (dark: number, bright: number) => Math.round(dark + (bright - dark) * b);
  return lit ? `rgb(${mix(196, 252)} ${mix(120, 176)} ${mix(10, 60)})` : `rgb(${mix(168, 250)} ${mix(166, 249)} ${mix(162, 246)})`;
}

/** Signed area of a projected polygon: negative faces the viewer. */
function winding(points: readonly Point[]) {
  return points.reduce((sum, [x, y], i) => {
    const [nx, ny] = points[(i + 1) % points.length];
    return sum + x * ny - nx * y;
  }, 0);
}

function ellipsePoints(center: Point, r: number, from: number, to: number, steps = 24): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = from + ((to - from) * i) / steps;
    return [r2(center[0] + r * Math.cos(t)), r2(center[1] + r * SQUASH * Math.sin(t))] as Point;
  });
}

/**
 * A turned band from z0 to z1 with its widest radius r at mid-height (a torus
 * when `bulge`, a straight drum otherwise). Its screen shape is the front half
 * of the lower rim, the silhouette up both sides, and the top rim; its shading
 * is a horizontal gradient, which is how a surface of revolution reads under
 * a fixed light.
 */
function Lathe({ at, z0, z1, r, rTop, fill, bulge = false }: { at: Project; z0: number; z1: number; r: number; rTop?: number; fill: string; bulge?: boolean }) {
  const top = rTop ?? r;
  const base = at(0, 0, z0);
  const cap = at(0, 0, z1);
  const steps = 8;
  const radiusAt = (k: number) => {
    const t = k / steps;
    if (bulge) return r * (0.86 + 0.14 * Math.sin(Math.PI * t));
    return r + (top - r) * t;
  };
  const right: Point[] = [];
  const left: Point[] = [];
  for (let k = 0; k <= steps; k += 1) {
    const t = k / steps;
    const x = base[0] + (cap[0] - base[0]) * t;
    const y = base[1] + (cap[1] - base[1]) * t;
    const rad = radiusAt(k);
    right.push([r2(x + rad), r2(y)]);
    left.push([r2(x - rad), r2(y)]);
  }
  const rBottom = radiusAt(0);
  const rCap = radiusAt(steps);
  const outline = [
    ...ellipsePoints(base, rBottom, Math.PI, 0),
    ...right,
    ...ellipsePoints(cap, rCap, 0, -Math.PI),
    ...left.reverse(),
  ];
  return (
    <>
      <path d={path(outline)} fill={fill} stroke={INK} strokeWidth={HAIR} strokeLinejoin="round" />
      <path d={path(ellipsePoints(cap, rCap, 0, Math.PI), false)} fill="none" stroke={INK} strokeWidth={HAIR * 0.8} />
    </>
  );
}

/** An upright square slab (plinth or abacus): its visible sides, shaded by their facing, then its top. */
function Slab({ at, half, z0, z1, turn, lit }: { at: Project; half: number; z0: number; z1: number; turn: number; lit: boolean }) {
  const corners: [number, number][] = [
    [half, half],
    [-half, half],
    [-half, -half],
    [half, -half],
  ];
  const sides = corners
    .map(([u, v], i) => {
      const [nu, nv] = corners[(i + 1) % 4];
      const face = [at(u, v, z1), at(nu, nv, z1), at(nu, nv, z0), at(u, v, z0)];
      const normal = Math.atan2(v + nv, u + nu) + turn;
      return { face, visible: winding(face) < 0, bright: light(normal), depth: (face[2][1] + face[3][1]) / 2 };
    })
    .filter((s) => s.visible)
    .sort((a, b) => a.depth - b.depth);
  const top = corners.map(([u, v]) => at(u, v, z1));
  return (
    <>
      {sides.map((s, i) => (
        <path key={i} d={path(s.face)} fill={shade(s.bright * 0.9, lit)} stroke={INK} strokeWidth={HAIR} strokeLinejoin="round" />
      ))}
      <path d={path(top)} fill={shade(0.97, lit)} stroke={INK} strokeWidth={HAIR} strokeLinejoin="round" />
    </>
  );
}

/** One volute bolster: the cushion running front to back, and whichever end face is toward the viewer, carrying its spiral. */
function Volute({ at, side, turn, lit }: { at: Project; side: 1 | -1; turn: number; lit: boolean }) {
  const { depth, r, z } = VOLUTE;
  const u = VOLUTE.u * side;
  const ring = (v: number, radius: number, steps = 36) =>
    Array.from({ length: steps }, (_, i) => {
      const t = (i / steps) * Math.PI * 2;
      return at(u + radius * Math.cos(t), v, z + radius * Math.sin(t));
    });
  // The cushion: the hull of both end rims, pinched at the waist the way an Ionic bolster is.
  const front = ring(depth, r);
  const back = ring(-depth, r);
  const waist = ring(0, r * 0.82);
  const hull = convexHull([...front, ...back, ...waist]);
  // Whichever end faces the viewer shows its spiral; the end normal points along ±v.
  const normalFront = turn + Math.PI / 2;
  const frontFacing = Math.sin(normalFront + Math.PI / 4) > 0;
  const endV = frontFacing ? depth : -depth;
  const endNormal = frontFacing ? normalFront : normalFront + Math.PI;
  const facing = Math.abs(Math.sin(endNormal + Math.PI / 4));
  const end = ring(endV, r);
  // Mirrored spirals: the two volutes of a face wind in opposite directions, so the capital stays symmetric.
  const spiral: Point[] = [];
  const turns = 2.6;
  for (let i = 0; i <= 140; i += 1) {
    const t = i / 140;
    const radius = r * (0.93 - 0.78 * t);
    const theta = side * (Math.PI / 2 + t * turns * Math.PI * 2) * (frontFacing ? 1 : -1);
    spiral.push(at(u + radius * Math.cos(theta), endV, z + radius * Math.sin(theta)));
  }
  const eye = ring(endV, r * 0.14, 16);
  return (
    <>
      <path d={path(hull)} fill={shade(light(turn + (side > 0 ? 0 : Math.PI)) * 0.85 + 0.1, lit)} stroke={INK} strokeWidth={HAIR} strokeLinejoin="round" />
      <path d={path(waist.slice(0, 19), false)} fill="none" stroke={INK} strokeWidth={HAIR * 0.7} opacity={0.6} />
      {facing > 0.12 && (
        <g opacity={Math.min(1, facing * 2.2)}>
          <path d={path(end)} fill={shade(light(endNormal) * 0.4 + 0.6, lit)} stroke={INK} strokeWidth={HAIR} />
          <path d={path(spiral, false)} fill="none" stroke={lit ? "#7a4a06" : "rgba(0,0,0,.6)"} strokeWidth={0.9} strokeLinecap="round" />
          <path d={path(eye)} fill={lit ? "#7a4a06" : "rgba(0,0,0,.55)"} />
        </g>
      )}
    </>
  );
}

function convexHull(points: Point[]) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Point, a: Point, b: Point) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Point[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Point[] = [];
  for (const p of pts.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** The fluted shaft: a tapered drum, then one groove per flute on the visible half, each as wide as it is foreshortened. */
function Shaft({ at, turn, lit, gradient }: { at: Project; turn: number; lit: boolean; gradient: string }) {
  const { z0, z1, rBottom, rTop, flutes } = SHAFT;
  const base = at(0, 0, z0);
  const cap = at(0, 0, z1);
  const grooves = [];
  const width = (Math.PI * 2) / flutes;
  for (let k = 0; k < flutes; k += 1) {
    const a = k * width + turn;
    const screenAngle = a + Math.PI / 4;
    const facing = Math.sin(screenAngle);
    if (facing <= 0.02) continue;
    const edge = (angle: number, radius: number, point: Point): Point => [r2(point[0] + radius * Math.cos(angle + Math.PI / 4)), r2(point[1] + radius * SQUASH * Math.sin(angle + Math.PI / 4))];
    const a0 = a - width * 0.3;
    const a1 = a + width * 0.3;
    const groove = [edge(a0, rBottom, base), edge(a1, rBottom, base), edge(a1, rTop, cap), edge(a0, rTop, cap)];
    const bright = light(a);
    grooves.push(
      <g key={k}>
        <path d={path(groove)} fill={shade(bright * 0.72, lit)} opacity={0.9} />
        <path d={path([edge(a0, rBottom, base), edge(a0, rTop, cap)], false)} stroke={INK} strokeWidth={HAIR * 0.5} opacity={0.5 + facing * 0.3} />
      </g>,
    );
  }
  return (
    <>
      <Lathe at={at} z0={z0} z1={z1} r={rBottom} rTop={rTop} fill={gradient} />
      {grooves}
    </>
  );
}

/** Egg-and-dart on the echinus: the eggs on the visible half, foreshortened toward the sides, with a dart between each. */
function EggAndDart({ at, turn, lit }: { at: Project; turn: number; lit: boolean }) {
  const { r } = LATHE.echinus;
  const z = (LATHE.echinus.z0 + LATHE.echinus.z1) / 2;
  const centre = at(0, 0, z);
  const out = [];
  for (let k = 0; k < EGGS; k += 1) {
    const a = (k / EGGS) * Math.PI * 2 + turn;
    const facing = Math.sin(a + Math.PI / 4);
    if (facing <= 0.1) continue;
    const x = r2(centre[0] + r * 0.98 * Math.cos(a + Math.PI / 4));
    const y = r2(centre[1] + r * SQUASH * Math.sin(a + Math.PI / 4));
    const rx = r2(2.1 * facing);
    const dx = r2(centre[0] + r * Math.cos(a + Math.PI / EGGS + Math.PI / 4));
    const dy = r2(centre[1] + r * SQUASH * Math.sin(a + Math.PI / EGGS + Math.PI / 4));
    out.push(
      <g key={k}>
        <ellipse cx={x} cy={y} rx={r2(rx + 0.9 * facing)} ry={2.9} fill="none" stroke={lit ? "#7a4a06" : "rgba(0,0,0,.45)"} strokeWidth={0.5} />
        <ellipse cx={x} cy={y + 0.3} rx={rx} ry={2.2} fill={shade(light(a) * 0.5 + 0.45, lit)} stroke={INK} strokeWidth={0.4} />
        {Math.sin(a + Math.PI / EGGS + Math.PI / 4) > 0.1 && <path d={`M${dx} ${r2(dy - 3)}L${dx} ${r2(dy + 3)}`} stroke={INK} strokeWidth={0.6} />}
      </g>,
    );
  }
  return <>{out}</>;
}

/** The front or back face of the capital between the volutes (the canalis), whichever faces the viewer. */
function Canalis({ at, turn, lit }: { at: Project; turn: number; lit: boolean }) {
  const { u, depth, z, r } = VOLUTE;
  const normalFront = turn + Math.PI / 2;
  const frontFacing = Math.sin(normalFront + Math.PI / 4) > 0;
  const v = frontFacing ? depth : -depth;
  const face = [at(-u, v, z - r * 0.2), at(u, v, z - r * 0.2), at(u, v, z + r), at(-u, v, z + r)];
  const channel = [at(-u, v, z + r * 0.45), at(u, v, z + r * 0.45)];
  const facing = Math.abs(Math.sin(normalFront + Math.PI / 4));
  if (facing < 0.08) return null;
  return (
    <g opacity={Math.min(1, facing * 2.2)}>
      <path d={path(face)} fill={shade(0.86, lit)} stroke={INK} strokeWidth={HAIR} strokeLinejoin="round" />
      <path d={path(channel, false)} stroke={INK} strokeWidth={HAIR * 0.8} opacity={0.6} />
    </g>
  );
}

export default function IonicColumn({ cx, cy, turn, lit, id }: { cx: number; cy: number; turn: number; lit: boolean; id: string }) {
  const cos = Math.cos(turn);
  const sin = Math.sin(turn);
  const at: Project = (u, v, z) => {
    const [x, y] = project(cx + u * cos - v * sin, cy + u * sin + v * cos, z);
    return [r2(x), r2(y)];
  };
  // Volutes are drawn far to near: the one whose centre projects higher on screen is behind.
  const volutes = ([1, -1] as const)
    .map((side) => ({ side, depth: at(VOLUTE.u * side, 0, 0)[1] }))
    .sort((a, b) => a.depth - b.depth);
  const gradient = `url(#${id}-${lit ? "lit" : "stone"})`;
  return (
    <g>
      <Slab at={at} half={PLINTH.half} z0={PLINTH.z0} z1={PLINTH.z1} turn={turn} lit={lit} />
      <Lathe at={at} {...LATHE.lowerTorus} fill={gradient} bulge />
      <Lathe at={at} {...LATHE.scotia} fill={shade(0.55, lit)} />
      <Lathe at={at} {...LATHE.upperTorus} fill={gradient} bulge />
      <Lathe at={at} {...LATHE.fillet} fill={gradient} />
      <Shaft at={at} turn={turn} lit={lit} gradient={gradient} />
      <Lathe at={at} {...LATHE.astragal} fill={gradient} bulge />
      <Lathe at={at} {...LATHE.echinus} fill={gradient} />
      <EggAndDart at={at} turn={turn} lit={lit} />
      {volutes.map(({ side }) => (
        <Volute key={side} at={at} side={side} turn={turn} lit={lit} />
      ))}
      <Canalis at={at} turn={turn} lit={lit} />
      <Slab at={at} half={ABACUS.half} z0={ABACUS.z0} z1={ABACUS.z1} turn={turn} lit={lit} />
    </g>
  );
}

/** The horizontal gradients that shade every turned part, lit from the left. One pair per figure. */
export function ColumnGradients({ id }: { id: string }) {
  const stops = (colours: string[]) => colours.map((c, i) => <stop key={i} offset={`${(i / (colours.length - 1)) * 100}%`} stopColor={c} />);
  return (
    <>
      <linearGradient id={`${id}-stone`} x1="0" x2="1" y1="0" y2="0">
        {stops(["#d6d5d2", "#f7f6f4", "#ffffff", "#ecebe8", "#cfcecb", "#b3b2af"])}
      </linearGradient>
      <linearGradient id={`${id}-lit`} x1="0" x2="1" y1="0" y2="0">
        {stops(["#e08f12", "#fbb03d", "#fcc262", "#f4a31f", "#d98a0f", "#b87208"])}
      </linearGradient>
    </>
  );
}

