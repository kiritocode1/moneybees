"use client";

import { useRef } from "react";
import { barFaces, path, SQUASH, type Point } from "@/components/iso/geometry";
import { type FigureProps, useFigureFrame } from "./figures";

const CENTRE_X = 225;
const GROUND_Y = 430;
const easeInOut = (value: number) => (1 - Math.cos(Math.PI * value)) / 2;

function diamond(cx: number, cy: number, radiusX: number, radiusY: number) {
  return path([
    [cx, cy - radiusY],
    [cx + radiusX, cy],
    [cx, cy + radiusY],
    [cx - radiusX, cy],
  ]);
}

function slabFaces(cx: number, cy: number, radiusX: number, radiusY: number, depth: number) {
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

const RESEARCH_PLANES = [132, 108, 86, 66, 48, 29] as const;
const RESEARCH_COUNTS = [13, 10, 8, 6, 4, 1] as const;
const RESEARCH_Y = [216, 264, 311, 356, 399, 440] as const;

export function ResearchFigure({ active }: FigureProps) {
  const markerRef = useRef<SVGGElement | null>(null);
  const planesRef = useRef<(SVGPathElement | null)[]>([]);
  const dotGroupsRef = useRef<(SVGGElement | null)[]>([]);

  useFigureFrame(active, (time) => {
    const raw = (time / 1.05) % (RESEARCH_PLANES.length * 2 - 2);
    const position = raw < RESEARCH_PLANES.length ? raw : RESEARCH_PLANES.length * 2 - 2 - raw;
    const low = Math.floor(position);
    const high = Math.min(RESEARCH_PLANES.length - 1, low + 1);
    const blend = easeInOut(position - low);
    const y = RESEARCH_Y[low] + (RESEARCH_Y[high] - RESEARCH_Y[low]) * blend;
    markerRef.current?.setAttribute("transform", `translate(${CENTRE_X} ${y.toFixed(2)})`);

    planesRef.current.forEach((plane, index) => {
      if (!plane) return;
      plane.style.opacity = (0.25 + Math.max(0, 1 - Math.abs(position - index)) * 0.75).toFixed(3);
    });
    dotGroupsRef.current.forEach((group, index) => {
      if (!group) return;
      group.style.opacity = (0.22 + Math.max(0, 1 - Math.abs(position - index) * 0.6) * 0.58).toFixed(3);
    });
  });

  return (
    <g>
      <path className="fig-beam" d="M225 190L238 456L212 456Z" />
      {RESEARCH_PLANES.map((radius, stage) => {
        const y = RESEARCH_Y[stage];
        return (
          <g key={radius}>
            <path
              ref={(element) => {
                planesRef.current[stage] = element;
              }}
              className="fig-outline"
              d={diamond(CENTRE_X, y, radius, radius * SQUASH)}
            />
            <g
              ref={(element) => {
                dotGroupsRef.current[stage] = element;
              }}
            >
              {Array.from({ length: RESEARCH_COUNTS[stage] }, (_, index) => {
                const spread = Math.min(17, (radius * 1.5) / RESEARCH_COUNTS[stage]);
                return (
                  <circle
                    key={index}
                    className="fig-data-dot"
                    cx={CENTRE_X + (index - (RESEARCH_COUNTS[stage] - 1) / 2) * spread}
                    cy={y + (index % 2 === 0 ? -3 : 3)}
                    r="2"
                  />
                );
              })}
            </g>
          </g>
        );
      })}
      <g ref={markerRef} transform={`translate(${CENTRE_X} ${RESEARCH_Y[2]})`}>
        <circle className="fig-marker-glow" r="52" />
        <circle className="fig-marker" r="9" />
      </g>
      <text className="fig-label" x="67" y="220">~6,000</text>
      <text className="fig-label" x="281" y="447">~20</text>
    </g>
  );
}

/* ============================================================== pyramid === */

type PyramidTier = {
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
const PYRAMID_TIERS: PyramidTier[] = [
  { baseRadius: 132, topRadius: 106, bottomZ: 0, topZ: 36 },
  { baseRadius: 106, topRadius: 80, bottomZ: 36, topZ: 72 },
  { baseRadius: 80, topRadius: 54, bottomZ: 72, topZ: 108 },
  { baseRadius: 54, topRadius: 28, bottomZ: 108, topZ: 144 },
  { baseRadius: 28, topRadius: 0, bottomZ: 144, topZ: 184 },
];
const PYRAMID_NORMALS = [Math.PI / 2, Math.PI, -Math.PI / 2, 0] as const;
const PYRAMID_SPIN = 0.62;

function projectAt(x: number, y: number, z: number, rotation: number): Point {
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  return [x * cosine - y * sine, (x * sine + y * cosine) * SQUASH - z];
}

function squareCorners(radius: number, z: number, rotation: number) {
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
    // The only animated value is rotation. The shared hover clock advances at
    // a constant rate while active, then loses energy and freezes on leave.
    // Keeping the apex orange gives the turn a stable orientation marker.
    const rotation = Math.PI / 4 + time * PYRAMID_SPIN;
    PYRAMID_TIERS.forEach((tier, index) => {
      const group = tierRefs.current[index];
      if (!group) return;
      const bottom = squareCorners(tier.baseRadius, tier.bottomZ, rotation);
      const top = squareCorners(tier.topRadius, tier.topZ, rotation);
      const children = Array.from(group.children) as SVGPathElement[];
      const strength = index === PYRAMID_TIERS.length - 1 ? 1 : 0;
      const sides = PYRAMID_NORMALS.map((normal, side) => ({
        side,
        visible: Math.sin(normal + rotation) > 0,
        lit: Math.cos(normal + rotation) < 0,
        depth: (bottom[side][1] + bottom[(side + 1) % 4][1]) / 2,
      }))
        .filter((face) => face.visible)
        .sort((a, b) => a.depth - b.depth);

      for (let slot = 0; slot < 4; slot += 1) {
        const face = sides[slot];
        const neutral = children[slot];
        const accent = children[slot + 4];
        if (!face) {
          neutral.setAttribute("d", "");
          accent.setAttribute("d", "");
          continue;
        }
        const side = face.side;
        const d = path([top[side], top[(side + 1) % 4], bottom[(side + 1) % 4], bottom[side]]);
        neutral.setAttribute("d", d);
        neutral.setAttribute("class", face.lit ? "fig-face" : "fig-face fig-face--lit");
        accent.setAttribute("d", d);
        accent.style.opacity = strength.toFixed(3);
      }
      // The last two paths are neutral and orange copies of the visible half
      // of the shared boundary. Rear edges do not exist in either copy.
      const visibleBoundary = sides
        .map(({ side }) => path([top[side], top[(side + 1) % 4]], false))
        .join("");
      children[8].setAttribute("d", tier.topRadius === 0 ? "" : visibleBoundary);
      children[9].setAttribute("d", tier.topRadius === 0 ? "" : visibleBoundary);
      children[9].style.opacity = strength.toFixed(3);
    });

    const apexTier = PYRAMID_TIERS.at(-1);
    if (apexTier) {
      glowRef.current?.setAttribute("cy", (GROUND_Y - apexTier.topZ - 2).toFixed(2));
      glowRef.current?.setAttribute("rx", (apexTier.baseRadius * 0.9).toFixed(2));
    }
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
          <path /><path /><path /><path />
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
