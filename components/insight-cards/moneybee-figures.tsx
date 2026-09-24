"use client";

import { useRef } from "react";
import { barFaces, path, SQUASH, type Point } from "@/components/iso/geometry";
import { type FigureProps, useFigureFrame } from "./figures";

export const CENTRE_X = 225;
export const GROUND_Y = 430;
export const easeInOut = (value: number) => (1 - Math.cos(Math.PI * value)) / 2;

export function diamond(cx: number, cy: number, radiusX: number, radiusY: number) {
  return path([
    [cx, cy - radiusY],
    [cx + radiusX, cy],
    [cx, cy + radiusY],
    [cx - radiusX, cy],
  ]);
}

export function slabFaces(cx: number, cy: number, radiusX: number, radiusY: number, depth: number) {
  return {
    top: diamond(cx, cy, radiusX, radiusY),
    wall: path([
      [cx - radiusX, cy],
      [cx, cy + radiusY],
      [cx + radiusX, cy],
      [cx + radiusX, cy + depth],
      [cx, cy + radiusY + depth],
      [cx - radiusX, cy + depth],
    ]),
  };
}

/* =============================================================== wealth === */

const PMS_PLATES = 13;
const BENCHMARK_PLATES = 4;

export function WealthFigure({ active }: FigureProps) {
  const accentsRef = useRef<(SVGGElement | null)[]>([]);
  const glowRef = useRef<SVGEllipseElement | null>(null);
  const bracketRef = useRef<SVGPathElement | null>(null);

  useFigureFrame(active, (time) => {
    const cursor = (time * 1.45) % PMS_PLATES;
    accentsRef.current.forEach((plate, index) => {
      if (!plate) return;
      plate.style.opacity = Math.max(0, 1 - Math.abs(cursor - index) * 0.72).toFixed(3);
    });
    glowRef.current?.setAttribute("cy", (GROUND_Y - cursor * 12 - 3).toFixed(2));
    if (bracketRef.current) {
      bracketRef.current.style.opacity = (0.5 + Math.sin(time * 2.2) * 0.18).toFixed(3);
    }
  });

  return (
    <g>
      <ellipse className="fig-ground" cx={CENTRE_X} cy={GROUND_Y + 16} rx="150" ry="52" strokeDasharray="2 9" />
      <ellipse ref={glowRef} className="fig-bloom" cx="145" rx="74" ry="48" />
      {Array.from({ length: PMS_PLATES }, (_, index) => {
        const faces = slabFaces(145, GROUND_Y - index * 12, 39, 14, 5);
        return (
          <g key={`pms-${index}`}>
            <path className="fig-face fig-face--lit" d={faces.wall} />
            <path className="fig-face" d={faces.top} />
            <g
              ref={(element) => {
                accentsRef.current[index] = element;
              }}
              style={{ opacity: index === PMS_PLATES - 1 ? 1 : 0 }}
            >
              <path className="fig-accent-wall" d={faces.wall} />
              <path className="fig-accent-face" d={faces.top} />
            </g>
          </g>
        );
      })}
      {Array.from({ length: BENCHMARK_PLATES }, (_, index) => {
        const faces = slabFaces(302, GROUND_Y - index * 12, 35, 12, 5);
        return (
          <g key={`benchmark-${index}`}>
            <path className="fig-face fig-face--lit" d={faces.wall} />
            <path className="fig-face" d={faces.top} />
          </g>
        );
      })}
      <path ref={bracketRef} className="fig-outline" d="M191 286h18v109h-18M258 395h-18" />
      <text className="fig-label fig-label--strong" x="214" y="336">4.83×</text>
      <text className="fig-label" x="108" y="475">₹2.885 cr</text>
      <text className="fig-label" x="276" y="475">₹59.7 L</text>
    </g>
  );
}

/* ============================================================= research === */

export const RESEARCH_PLANES = [132, 108, 86, 66, 48, 29] as const;
export const RESEARCH_COUNTS = [13, 10, 8, 6, 4, 1] as const;
export const RESEARCH_Y = [216, 264, 311, 356, 399, 440] as const;
const RESEARCH_LAST = RESEARCH_PLANES.length - 1;
const RESEARCH_STEP = 0.85;
const RESEARCH_HOLD = 1.1;
const RESEARCH_FADE = 0.5;
const RESEARCH_CYCLE = RESEARCH_LAST * RESEARCH_STEP + RESEARCH_HOLD + RESEARCH_FADE;
export const RESEARCH_DOT = 2;
export const RESEARCH_FINAL_DOT = 9;

/** Screen position of dot `index` on layer `stage`, matching the static layer dots. */
export function researchDot(stage: number, index: number): Point {
  const count = RESEARCH_COUNTS[stage];
  const spread = Math.min(17, (RESEARCH_PLANES[stage] * 1.5) / count);
  return [
    CENTRE_X + (index - (count - 1) / 2) * spread,
    RESEARCH_Y[stage] + (count === 1 ? 0 : index % 2 === 0 ? -3 : 3),
  ];
}

/**
 * Where each of the top layer's dots lands on every layer below. A layer with
 * fewer dots takes several arrivals on one position, so the dots merge as they
 * fall until all 13 share the single dot on the last layer.
 */
export const RESEARCH_PATHS = Array.from({ length: RESEARCH_COUNTS[0] }, (_, particle) =>
  RESEARCH_COUNTS.map((count, stage) =>
    researchDot(stage, Math.round((particle * (count - 1)) / (RESEARCH_COUNTS[0] - 1))),
  ),
);

export function ResearchFigure({ active }: FigureProps) {
  const markerRef = useRef<SVGGElement | null>(null);
  const planesRef = useRef<(SVGPathElement | null)[]>([]);
  const particlesRef = useRef<(SVGCircleElement | null)[]>([]);

  useFigureFrame(active, (time) => {
    const phase = time % RESEARCH_CYCLE;
    const travel = RESEARCH_LAST * RESEARCH_STEP;
    const step = Math.min(RESEARCH_LAST, phase / RESEARCH_STEP);
    const low = Math.min(RESEARCH_LAST - 1, Math.floor(step));
    const blend = easeInOut(step - low);
    const position = low + blend;
    // Fade in at the top, hold the merged dot at the bottom, fade out, repeat.
    const fadeIn = Math.min(1, phase / 0.25);
    const fadeOut = 1 - Math.max(0, (phase - travel - RESEARCH_HOLD) / RESEARCH_FADE);
    const visibility = Math.min(fadeIn, fadeOut);

    particlesRef.current.forEach((particle, index) => {
      if (!particle) return;
      const route = RESEARCH_PATHS[index];
      const [x0, y0] = route[low];
      const [x1, y1] = route[low + 1];
      particle.setAttribute("cx", (x0 + (x1 - x0) * blend).toFixed(2));
      particle.setAttribute("cy", (y0 + (y1 - y0) * blend).toFixed(2));
      particle.setAttribute("r", (RESEARCH_DOT + position * 0.5).toFixed(2));
      particle.style.opacity = visibility.toFixed(3);
    });

    // The orange dot grows as the last merge arrives, then fades with the cycle.
    const arrival = Math.max(0, position - (RESEARCH_LAST - 1));
    markerRef.current?.setAttribute(
      "transform",
      `translate(${CENTRE_X} ${RESEARCH_Y[RESEARCH_LAST]}) scale(${(arrival * fadeOut).toFixed(3)})`,
    );

    planesRef.current.forEach((plane, index) => {
      if (!plane) return;
      plane.style.opacity = (0.25 + Math.max(0, 1 - Math.abs(position - index)) * 0.75).toFixed(3);
    });
  });

  return (
    <g>
      <path className="fig-beam" d="M225 190L238 456L212 456Z" />
      {RESEARCH_PLANES.map((radius, stage) => (
        <g key={radius}>
          <path
            ref={(element) => {
              planesRef.current[stage] = element;
            }}
            className="fig-outline"
            d={diamond(CENTRE_X, RESEARCH_Y[stage], radius, radius * SQUASH)}
          />
          <g opacity="0.28">
            {Array.from({ length: RESEARCH_COUNTS[stage] }, (_, index) => {
              const [cx, cy] = researchDot(stage, index);
              return <circle key={index} className="fig-data-dot" cx={cx} cy={cy} r={RESEARCH_DOT} />;
            })}
          </g>
        </g>
      ))}
      {RESEARCH_PATHS.map((route, index) => (
        <circle
          key={index}
          ref={(element) => {
            particlesRef.current[index] = element;
          }}
          className="fig-data-dot"
          cx={route[0][0]}
          cy={route[0][1]}
          r={RESEARCH_DOT}
        />
      ))}
      <g ref={markerRef} transform={`translate(${CENTRE_X} ${RESEARCH_Y[RESEARCH_LAST]}) scale(0)`}>
        <circle className="fig-marker-glow" r="52" />
        <circle className="fig-marker" r={RESEARCH_FINAL_DOT} />
      </g>
      <text className="fig-label" x="67" y="220">~6,000</text>
      <text className="fig-label" x="281" y="447">~20</text>
    </g>
  );
}

/* ============================================================== pyramid === */

export type PyramidTier = {
  baseRadius: number;
  topRadius: number;
  bottomZ: number;
  topZ: number;
};

/**
 * Five contiguous bands cut from one square pyramid. Adjacent bands share the
 * same radius and z at their boundary, so the outside remains one uninterrupted
 * slope from the 132-unit base to the apex. There are no horizontal caps or
 * separated slabs.
 */
export const PYRAMID_TIERS: PyramidTier[] = [
  { baseRadius: 132, topRadius: 106, bottomZ: 0, topZ: 36 },
  { baseRadius: 106, topRadius: 80, bottomZ: 36, topZ: 72 },
  { baseRadius: 80, topRadius: 54, bottomZ: 72, topZ: 108 },
  { baseRadius: 54, topRadius: 28, bottomZ: 108, topZ: 144 },
  { baseRadius: 28, topRadius: 0, bottomZ: 144, topZ: 184 },
];
export const PYRAMID_NORMALS = [Math.PI / 2, Math.PI, -Math.PI / 2, 0] as const;
export const PYRAMID_SPIN = 0.9;
const PYRAMID_APEX_TIER = PYRAMID_TIERS[PYRAMID_TIERS.length - 1];

export function projectAt(x: number, y: number, z: number, rotation: number): Point {
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  return [x * cosine - y * sine, (x * sine + y * cosine) * SQUASH - z];
}

/** Twice the signed area of a projected polygon; negative faces the viewer. */
export function winding(points: readonly Point[]) {
  return points.reduce((sum, [x, y], index) => {
    const [nextX, nextY] = points[(index + 1) % points.length];
    return sum + x * nextY - nextX * y;
  }, 0);
}

export function squareCorners(radius: number, z: number, rotation: number) {
  return [
    projectAt(radius, radius, z, rotation),
    projectAt(-radius, radius, z, rotation),
    projectAt(-radius, -radius, z, rotation),
    projectAt(radius, -radius, z, rotation),
  ];
}

export function PyramidFigure({ active }: FigureProps) {
  const tierRefs = useRef<(SVGGElement | null)[]>([]);
  const glowRef = useRef<SVGEllipseElement | null>(null);

  useFigureFrame(active, (time) => {
    // Rotation is the only animated value. Faces are culled by the winding of
    // their projected outline rather than by their plan normal: the slopes lean
    // back toward the viewer, so a face stays visible for a while after its
    // plan normal turns side-on, and hiding it there made the silhouette jump.
    // Shade follows each face's angle to the light continuously.
    const rotation = Math.PI / 4 + time * PYRAMID_SPIN;
    PYRAMID_TIERS.forEach((tier, index) => {
      const group = tierRefs.current[index];
      if (!group) return;
      const bottom = squareCorners(tier.baseRadius, tier.bottomZ, rotation);
      const top = squareCorners(tier.topRadius, tier.topZ, rotation);
      const children = Array.from(group.children) as SVGPathElement[];
      const strength = tier === PYRAMID_APEX_TIER ? 1 : 0;
      // Culling uses the whole face, apex to base, so the apex tier's
      // zero-width top does not make the test degenerate.
      const apex = projectAt(0, 0, PYRAMID_APEX_TIER.topZ, rotation);
      const base = squareCorners(PYRAMID_TIERS[0].baseRadius, 0, rotation);
      const sides = PYRAMID_NORMALS.map((normal, side) => ({
        side,
        visible: winding([apex, base[(side + 1) % 4], base[side]]) < 0,
        shade: (1 + Math.cos(normal + rotation)) / 2,
        depth: (bottom[side][1] + bottom[(side + 1) % 4][1]) / 2,
      }))
        .filter((face) => face.visible)
        .sort((a, b) => a.depth - b.depth);

      for (let slot = 0; slot < 4; slot += 1) {
        const face = sides[slot];
        const neutral = children[slot];
        const shade = children[slot + 4];
        const accent = children[slot + 8];
        if (!face) {
          neutral.setAttribute("d", "");
          shade.setAttribute("d", "");
          accent.setAttribute("d", "");
          continue;
        }
        const side = face.side;
        const d = path([top[side], top[(side + 1) % 4], bottom[(side + 1) % 4], bottom[side]]);
        neutral.setAttribute("d", d);
        shade.setAttribute("d", d);
        shade.style.opacity = face.shade.toFixed(3);
        accent.setAttribute("d", d);
        accent.style.opacity = strength.toFixed(3);
      }
      // The last two paths are neutral and orange copies of the visible half
      // of the shared boundary. Rear edges do not exist in either copy.
      const visibleBoundary = sides
        .map(({ side }) => path([top[side], top[(side + 1) % 4]], false))
        .join("");
      children[12].setAttribute("d", tier.topRadius === 0 ? "" : visibleBoundary);
      children[13].setAttribute("d", tier.topRadius === 0 ? "" : visibleBoundary);
      children[13].style.opacity = strength.toFixed(3);
    });

    glowRef.current?.setAttribute("cy", (GROUND_Y - PYRAMID_APEX_TIER.topZ - 2).toFixed(2));
    glowRef.current?.setAttribute("rx", (PYRAMID_APEX_TIER.baseRadius * 0.9).toFixed(2));
  });

  return (
    <g>
      <ellipse className="fig-ground" cx={CENTRE_X} cy={GROUND_Y + 10} rx="150" ry="52" strokeDasharray="2 9" />
      <ellipse ref={glowRef} className="fig-bloom" cx={CENTRE_X} rx="75" ry="48" />
      {PYRAMID_TIERS.map((tier, index) => (
        <g
          key={tier.baseRadius}
          ref={(element) => {
            tierRefs.current[index] = element;
          }}
          transform={`translate(${CENTRE_X} ${GROUND_Y})`}
        >
          <path className="fig-face" /><path className="fig-face" />
          <path className="fig-face" /><path className="fig-face" />
          <path className="fig-face fig-face--lit" /><path className="fig-face fig-face--lit" />
          <path className="fig-face fig-face--lit" /><path className="fig-face fig-face--lit" />
          <path className="fig-accent-wall" /><path className="fig-accent-wall" />
          <path className="fig-accent-wall" /><path className="fig-accent-wall" />
          <path className="fig-outline" />
          <path className="fig-route fig-route--active" />
        </g>
      ))}
      <text className="fig-label fig-label--strong" x="203" y="198">100×</text>
    </g>
  );
}

/* ================================================================ growth === */

const GROWTH_VALUES = [59, 102, 230, 644, 1024] as const;
const GROWTH_HEIGHTS = GROWTH_VALUES.map((value) => 34 + (value / 1024) * 168);
const GROWTH_X = [-124, -62, 0, 62, 124] as const;

export function GrowthFigure({ active }: FigureProps) {
  const accentsRef = useRef<(SVGGElement | null)[]>([]);
  const markerRef = useRef<SVGGElement | null>(null);

  useFigureFrame(active, (time) => {
    const raw = (time / 0.78) % (GROWTH_VALUES.length * 2 - 2);
    const position = raw < GROWTH_VALUES.length ? raw : GROWTH_VALUES.length * 2 - 2 - raw;
    const low = Math.floor(position);
    const high = Math.min(GROWTH_VALUES.length - 1, low + 1);
    const blend = easeInOut(position - low);
    const x = GROWTH_X[low] + (GROWTH_X[high] - GROWTH_X[low]) * blend;
    const height = GROWTH_HEIGHTS[low] + (GROWTH_HEIGHTS[high] - GROWTH_HEIGHTS[low]) * blend;
    markerRef.current?.setAttribute("transform", `translate(${CENTRE_X + x} ${GROUND_Y - height - 26})`);
    accentsRef.current.forEach((accent, index) => {
      if (accent) accent.style.opacity = Math.max(0, 1 - Math.abs(position - index) * 1.35).toFixed(3);
    });
  });

  const markerPath = GROWTH_X.map((x, index) => [CENTRE_X + x, GROUND_Y - GROWTH_HEIGHTS[index] - 26] as Point);

  return (
    <g>
      <path className="fig-ground" d={`M71 ${GROUND_Y + 7}H379`} strokeDasharray="2 8" />
      {GROWTH_HEIGHTS.map((height, index) => {
        const faces = barFaces(0, 0, 27, height);
        const x = CENTRE_X + GROWTH_X[index] - 13.5;
        return (
          <g key={GROWTH_VALUES[index]} transform={`translate(${x} ${GROUND_Y})`}>
            <path className="fig-face fig-face--lit" d={faces.left} />
            <path className="fig-face fig-face--lit" d={faces.right} />
            <path className="fig-face" d={faces.top} />
            <g
              ref={(element) => {
                accentsRef.current[index] = element;
              }}
              style={{ opacity: index === GROWTH_VALUES.length - 1 ? 1 : 0 }}
            >
              <path className="fig-accent-wall" d={faces.left} />
              <path className="fig-accent-wall" d={faces.right} />
              <path className="fig-accent-face" d={faces.top} />
            </g>
          </g>
        );
      })}
      <path className="fig-outline" d={path(markerPath, false)} />
      {markerPath.map(([x, y], index) => <circle key={index} className="fig-data-dot" cx={x} cy={y} r="3" />)}
      <g ref={markerRef} transform={`translate(${markerPath.at(-1)?.join(" ")})`}>
        <circle className="fig-marker-glow" r="42" />
        <circle className="fig-marker" r="8" />
      </g>
      <text className="fig-label" x="83" y="470">FY20 · 59</text>
      <text className="fig-label" x="293" y="470">FY24 · 1,024</text>
    </g>
  );
}

/* ================================================================== risk === */

const RISK_RADII = [132, 104, 77, 52] as const;

export function RiskFigure({ active }: FigureProps) {
  const framesRef = useRef<(SVGPathElement | null)[]>([]);
  const coreRef = useRef<SVGGElement | null>(null);
  const glowRef = useRef<SVGEllipseElement | null>(null);

  useFigureFrame(active, (time) => {
    const position = (time / 0.78) % (RISK_RADII.length + 1);
    framesRef.current.forEach((frame, index) => {
      if (!frame) return;
      const strength = Math.max(0, 1 - Math.abs(position - index) * 1.4);
      frame.setAttribute("class", strength > 0.45 ? "fig-route fig-route--active" : "fig-route");
      frame.style.opacity = (0.3 + strength * 0.7).toFixed(3);
    });
    const coreStrength = Math.max(0, 1 - Math.abs(position - RISK_RADII.length));
    if (coreRef.current) coreRef.current.style.opacity = (0.62 + coreStrength * 0.38).toFixed(3);
    if (glowRef.current) glowRef.current.style.opacity = (coreStrength * 0.72).toFixed(3);
  });

  const core = slabFaces(CENTRE_X, 335, 34, 12, 72);
  return (
    <g>
      <ellipse className="fig-ground" cx={CENTRE_X} cy="401" rx="145" ry="51" strokeDasharray="2 9" />
      {RISK_RADII.map((radius, index) => (
        <path
          key={radius}
          ref={(element) => {
            framesRef.current[index] = element;
          }}
          className="fig-route"
          d={diamond(CENTRE_X, 382 - index * 30, radius, radius * SQUASH)}
        />
      ))}
      <ellipse ref={glowRef} className="fig-bloom" cx={CENTRE_X} cy="290" rx="76" ry="56" />
      <g ref={coreRef}>
        <path className="fig-accent-wall" d={core.wall} />
        <path className="fig-accent-face" d={core.top} />
      </g>
      {[
        [355, 382, "L"],
        [225, 427, "V"],
        [95, 382, "M"],
        [225, 337, "C"],
      ].map(([x, y, label]) => (
        <g key={String(label)}>
          <circle className="fig-face" cx={Number(x)} cy={Number(y)} r="11" />
          <text className="fig-label" x={Number(x) - 3} y={Number(y) + 4}>{label}</text>
        </g>
      ))}
    </g>
  );
}

/* ============================================================= allocation === */

const ALLOCATION_UNITS = 100;
const ALLOCATION_STATES = [51, 75, 100] as const;

export function AllocationFigure({ active }: FigureProps) {
  const accentRefs = useRef<(SVGGElement | null)[]>([]);
  const glowRef = useRef<SVGEllipseElement | null>(null);

  useFigureFrame(active, (time) => {
    const raw = (time / 2.1) % (ALLOCATION_STATES.length * 2 - 2);
    const position = raw < ALLOCATION_STATES.length ? raw : ALLOCATION_STATES.length * 2 - 2 - raw;
    const low = Math.floor(position);
    const high = Math.min(ALLOCATION_STATES.length - 1, low + 1);
    const blend = easeInOut(position - low);
    const boundary = ALLOCATION_STATES[low] + (ALLOCATION_STATES[high] - ALLOCATION_STATES[low]) * blend;
    accentRefs.current.forEach((accent, index) => {
      if (accent) accent.style.opacity = Math.max(0, Math.min(1, boundary - index)).toFixed(3);
    });
    const row = Math.floor(Math.min(99, boundary) / 10);
    const column = Math.min(9, Math.floor(boundary) % 10);
    glowRef.current?.setAttribute("cx", (CENTRE_X + (column - row) * 15).toFixed(2));
    glowRef.current?.setAttribute("cy", (300 + (column + row) * 6.2).toFixed(2));
  });

  return (
    <g>
      <ellipse className="fig-ground" cx={CENTRE_X} cy="394" rx="167" ry="70" strokeDasharray="2 9" />
      <ellipse ref={glowRef} className="fig-bloom" rx="70" ry="48" />
      {Array.from({ length: ALLOCATION_UNITS }, (_, index) => {
        const row = Math.floor(index / 10);
        const column = index % 10;
        const x = CENTRE_X + (column - row) * 15;
        const y = 300 + (column + row) * 6.2;
        const faces = slabFaces(x, y, 13, 4.6, 5);
        return (
          <g key={index}>
            <path className="fig-face fig-face--lit" d={faces.wall} />
            <path className="fig-face" d={faces.top} />
            <g
              ref={(element) => {
                accentRefs.current[index] = element;
              }}
              style={{ opacity: index < 51 ? 1 : 0 }}
            >
              <path className="fig-accent-wall" d={faces.wall} />
              <path className="fig-accent-face" d={faces.top} />
            </g>
          </g>
        );
      })}
      <path className="fig-outline" d="M74 369C153 403 237 405 316 372" />
      <text className="fig-label" x="72" y="445">51% listed</text>
      <text className="fig-label" x="297" y="445">49% unlisted</text>
    </g>
  );
}
