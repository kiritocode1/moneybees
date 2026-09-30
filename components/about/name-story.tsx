"use client";

import { useRef } from "react";
import CornerBrackets from "@/components/hero/corner-brackets";
import { BODY, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { clamp, easeOut } from "@/components/fact-sections/fact-section";
import { PLAN_ROTATION, path, project, type Point } from "@/components/iso/geometry";
import { NAME_STORY, TAGLINE } from "@/lib/about";
import { useBuild } from "./use-build";

/** Plan radius of one cell, the gap between cells, and the wax wall's height. */
const R = 30;
const GAP = 0.9;
const WAX = 16;
/** Honey stands a little proud of the wax once a cell is full. */
const HONEY = 7;
/** Light comes from the back left in plan, so front-right walls fall into shade. */
const LIGHT = -Math.PI * 0.8;

/** The comb: axial cells within two steps of the centre, nineteen in all. */
const CELLS = (() => {
  const cells: { x: number; y: number; ring: number; order: number }[] = [];
  for (let q = -2; q <= 2; q += 1) {
    for (let r = Math.max(-2, -q - 2); r <= Math.min(2, -q + 2); r += 1) {
      const ring = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
      cells.push({ x: 1.5 * R * q, y: Math.sqrt(3) * R * (r + q / 2), ring, order: 0 });
    }
  }
  // Honey fills in a spiral-ish order: by ring, then round each ring.
  const ranked = [...cells].sort((a, b) => a.ring - b.ring || Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));
  ranked.forEach((cell, index) => {
    cell.order = index / (cells.length - 1);
  });
  // Far cells first, so near prisms paint over them.
  return cells.sort((a, b) => project(a.x, a.y, 0)[1] - project(b.x, b.y, 0)[1]);
})();

/** Walls that face the viewer, with a shade from 0 (dark) to 1 (lit), and the top face. */
function prism(cx: number, cy: number, radius: number, height: number) {
  const corner = (k: number, z: number): Point => {
    const angle = (Math.PI / 3) * k;
    return project(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z);
  };
  const walls = Array.from({ length: 6 }, (_, k) => {
    const normal = (Math.PI / 3) * k + Math.PI / 6;
    return {
      k,
      visible: Math.sin(normal + PLAN_ROTATION) > 0,
      shade: (1 + Math.cos(normal - LIGHT)) / 2,
      d: path([corner(k, height), corner(k + 1, height), corner(k + 1, 0), corner(k, 0)]),
    };
  }).filter((wall) => wall.visible);
  return { walls, top: path(Array.from({ length: 6 }, (_, k) => corner(k, height))) };
}

type Rgb = readonly [number, number, number];
const channel = (from: number, to: number, t: number) => from + (to - from) * t;
const lerp = (from: Rgb, to: Rgb, t: number): Rgb => [channel(from[0], to[0], t), channel(from[1], to[1], t), channel(from[2], to[2], t)];
const rgb = (colour: Rgb) => `rgb(${colour.map(Math.round).join(" ")})`;
const PAPER: Rgb = [255, 255, 255];
const WAX_SHADE: Rgb = [214, 212, 208];
const HONEY_TOP: Rgb = [246, 161, 26];
const HONEY_SHADE: Rgb = [201, 129, 16];

/**
 * The name story as a comb: nineteen wax cells rise from the ground ring, then
 * honey fills them one at a time, from the centre outward, until the whole
 * comb is orange.
 */
function Honeycomb() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useBuild(ref, 3600);
  const rise = easeOut(clamp(progress / 0.3));

  return (
    <div ref={ref} className="w-full max-w-[560px]">
      <svg viewBox="-190 -120 380 190" aria-hidden="true" className="block h-auto w-full overflow-visible">
        <ellipse cx="0" cy="4" rx="178" ry="64" fill="none" stroke="rgba(0,0,0,.3)" strokeDasharray="2 7" strokeLinecap="round" />
        {CELLS.map((cell) => {
          // Each cell rises in turn by ring, then fills with honey in its place in the order.
          const up = easeOut(clamp(rise * 1.6 - cell.ring * 0.3));
          const honey = easeOut(clamp((progress - 0.32 - cell.order * 0.55) / 0.12));
          const { walls, top } = prism(cell.x, cell.y, R * GAP, WAX * up + HONEY * honey);
          return (
            <g key={`${cell.x}:${cell.y}`} style={{ opacity: up }}>
              {walls.map((wall) => (
                <path
                  key={wall.k}
                  d={wall.d}
                  fill={rgb(lerp(lerp(WAX_SHADE, PAPER, wall.shade), lerp(HONEY_SHADE, HONEY_TOP, wall.shade), honey))}
                  stroke={honey > 0.5 ? "#9a6208" : "rgba(0,0,0,.7)"}
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              ))}
              <path d={top} fill={rgb(lerp(PAPER, HONEY_TOP, honey))} stroke={honey > 0.5 ? "#9a6208" : "rgba(0,0,0,.7)"} strokeWidth="1" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Group profile p2: where the name comes from, set in the slide's dashed corner box, beside the comb. */
export default function NameStory() {
  return (
    <section aria-labelledby="name-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-16 py-[110px] md:grid-cols-2 max-md:py-[80px]`}>
        <Rise onView>
          <div className="relative border border-dashed border-black/10 p-[36px] max-md:p-[24px]">
            <CornerBrackets />
            <span className={`${EYEBROW} text-black/60`}>{TAGLINE}</span>
            <h2 id="name-heading" className={`${SUBHEAD} mt-[18px]`}>
              {NAME_STORY.heading}
            </h2>
            <p className={`${BODY} mt-[28px] text-[#F6A11A]`}>{NAME_STORY.line}</p>
          </div>
        </Rise>
        <Honeycomb />
      </div>
    </section>
  );
}
