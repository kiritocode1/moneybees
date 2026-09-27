"use client";

import { BracketLabel } from "@/components/fact-sections/fact-section";
import { PLAN_ROTATION, path, project, type Point } from "@/components/iso/geometry";
import { NAME_STORY, PMS_HEADINGS } from "@/lib/pms";
import { EDGE, PmsSection, useReveal, useTween } from "./shared";
import { BODY, Rise, SUBHEAD } from "@/components/hero/editorial";

/*
 * The name story, group profile p2: bees turn nectar into honey, Moneybee
 * turns money into wealth. Three cells of a comb in the page's projection,
 * filling one after another once in view.
 */

const R = 58;
const DEPTH = 120;
/** How full each cell ends, as a share of its depth. */
const FULL = 0.82;
const INSET = 4;

/** Flat-topped hexagon: corners at 0, 60, ... degrees in plan. */
const corner = (cx: number, cy: number, radius: number, k: number, z: number): Point => {
  const angle = (Math.PI / 3) * k;
  return project(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z);
};

/** Wall k runs from corner k to k + 1; its outward normal is halfway between. Visible when it faces the viewer. */
const faces = (k: number) => Math.sin((Math.PI / 3) * k + Math.PI / 6 + PLAN_ROTATION) > 0;
const light = (k: number) => (1 + Math.cos((Math.PI / 3) * k + Math.PI / 6 - Math.PI / 3)) / 2;

function prism(cx: number, cy: number, radius: number, z0: number, z1: number) {
  const walls = Array.from({ length: 6 }, (_, k) => ({
    k,
    front: faces(k),
    shade: light(k),
    d: path([corner(cx, cy, radius, k, z1), corner(cx, cy, radius, k + 1, z1), corner(cx, cy, radius, k + 1, z0), corner(cx, cy, radius, k, z0)]),
  }));
  return {
    front: walls.filter((wall) => wall.front),
    back: walls.filter((wall) => !wall.front),
    top: path(Array.from({ length: 6 }, (_, k) => corner(cx, cy, radius, k, z1))),
    floor: path(Array.from({ length: 6 }, (_, k) => corner(cx, cy, radius, k, z0))),
  };
}

/** Three neighbouring cells, far to near. */
const CELLS = [
  [0, 0],
  [1.5 * R, (Math.sqrt(3) / 2) * R],
  [0, Math.sqrt(3) * R],
]
  .map(([x, y]) => ({ x, y, depth: project(x, y, 0)[1] }))
  .sort((a, b) => a.depth - b.depth);

/** Honey from light to deep orange by angle to the light. */
const honey = (shade: number) => {
  const mix = (a: number, b: number) => Math.round(a + (b - a) * shade);
  return `rgb(${mix(184, 232)} ${mix(116, 146)} ${mix(8, 24)})`;
};

function Comb() {
  const { ref, run } = useReveal<HTMLDivElement>(0.4);
  const levels = [useTween(run, 1.6, 0.2), useTween(run, 1.6, 0.7), useTween(run, 1.6, 1.2)];
  return (
    <div ref={ref} className="mx-auto w-full max-w-[460px]">
      <svg viewBox="-110 -150 260 270" className="block h-auto w-full overflow-visible" aria-hidden="true">
        {CELLS.map(({ x, y }, index) => {
          const shell = prism(x, y, R, 0, DEPTH);
          const level = levels[index] * FULL * DEPTH;
          const fill = level > 0.5 ? prism(x, y, R - INSET, 0, level) : null;
          return (
            <g key={`${x}:${y}`}>
              {/* The inside of the cell: its far walls and floor, seen through the open top. */}
              {shell.back.map((wall) => (
                <path key={wall.k} d={wall.d} fill="#efeeeb" stroke={EDGE} strokeWidth="0.8" strokeLinejoin="round" />
              ))}
              <path d={shell.floor} fill="#e2e1de" />
              {fill && (
                <g>
                  {fill.front.map((wall) => (
                    <path key={wall.k} d={wall.d} fill={honey(wall.shade)} stroke="rgba(90,50,0,.6)" strokeWidth="0.7" strokeLinejoin="round" />
                  ))}
                  <path d={fill.top} fill="#F7A11A" stroke="rgba(90,50,0,.6)" strokeWidth="0.7" strokeLinejoin="round" />
                </g>
              )}
              {/* The near walls as glass, so the honey shows through them. */}
              {shell.front.map((wall) => (
                <path
                  key={wall.k}
                  d={wall.d}
                  fill={`rgba(255,255,255,${0.22 - wall.shade * 0.12})`}
                  stroke={EDGE}
                  strokeWidth="0.9"
                  strokeLinejoin="round"
                />
              ))}
              <path d={shell.top} fill="none" stroke={EDGE} strokeWidth="1" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Where the name comes from, and what it promises. */
export default function NameStory() {
  return (
    <PmsSection id="name">
      <div className="grid grid-cols-[1.1fr_1fr] items-center gap-12 max-[900px]:grid-cols-1">
        <Rise onView>
          <BracketLabel>The name</BracketLabel>
          <h2 id="name-heading" className={`mt-[18px] max-w-[18ch] ${SUBHEAD}`}>
            {PMS_HEADINGS.name}
          </h2>
          <p className={`mt-8 max-w-[520px] text-black/70 ${BODY}`}>{NAME_STORY}</p>
        </Rise>
        <Comb />
      </div>
    </PmsSection>
  );
}
