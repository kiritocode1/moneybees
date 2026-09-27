"use client";

import { animate } from "motion/react";
import { useEffect, useState } from "react";
import { clamp, easeOut, r2, riseAt } from "@/components/fact-sections/fact-section";
import { barFaces, path, project, type Point } from "@/components/iso/geometry";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const ORANGE = "#F7A11A";
const GREY = "#9D9EA1";

/** One block of the business park, in plan units: corner, footprint side and height. */
type Block = { x: number; y: number; size: number; height: number; office?: true };

/** A small business park with Tower A the tallest, in the site's axonometric projection. */
const BLOCKS: readonly Block[] = [
  { x: 18, y: 16, size: 48, height: 92 },
  { x: 88, y: 14, size: 40, height: 58 },
  { x: 150, y: 30, size: 36, height: 74 },
  { x: 16, y: 92, size: 42, height: 38 },
  { x: 82, y: 86, size: 56, height: 168, office: true },
  { x: 182, y: 100, size: 32, height: 46 },
  { x: 28, y: 152, size: 50, height: 28 },
];

const PLATE = 220;
const GRID = [0, 44, 88, 132, 176, 220];

/** Draws the ground in first, then raises the blocks in turn, Tower A last. */
const ORDER = [...BLOCKS].sort((a, b) => Number(a.office ?? 0) - Number(b.office ?? 0) || a.height - b.height);

/**
 * The office as an axonometric block model: the Peninsula Business Park set on
 * a dashed plan, Tower A raised last with its roof in orange and a marker on
 * it. It builds once on load; under reduced motion it starts built.
 */
export default function OfficeFigure() {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const controls = animate(0, 1, {
      duration: reduceMotion ? 0 : 1.9,
      delay: reduceMotion ? 0 : 0.25,
      ease: "linear",
      onUpdate: setProgress,
    });
    return () => controls.stop();
  }, [reduceMotion]);

  const ground = easeOut(clamp(progress / 0.3));
  const blocks = BLOCKS.map((block) => {
    const rise = riseAt(clamp((progress - 0.15) / 0.85), ORDER.indexOf(block));
    return { block, faces: barFaces(block.x, block.y, block.size, block.height * rise), rise };
  }).sort((a, b) => a.faces.depth - b.faces.depth);

  const office = BLOCKS.find((block) => block.office) ?? BLOCKS[0];
  const [roofX, roofY] = project(office.x + office.size / 2, office.y + office.size / 2, office.height).map(r2);
  const marker = easeOut(clamp((progress - 0.82) / 0.18));
  const plate: Point[] = [project(0, 0, 0), project(PLATE, 0, 0), project(PLATE, PLATE, 0), project(0, PLATE, 0)];

  return (
    <svg viewBox="-166 -172 334 300" className="block h-auto w-full overflow-visible" role="img" aria-label="303, Tower A, Peninsula Business Park, Lower Parel">
      {/* The plan: dashed plate and grid, fading in before anything rises. */}
      <g opacity={ground} fill="none">
        <path d={path(plate)} stroke="#000" strokeOpacity=".18" strokeDasharray="4 4" />
        {GRID.slice(1, -1).map((step) => (
          <g key={step} stroke="#000" strokeOpacity=".07">
            <path d={path([project(step, 0, 0), project(step, PLATE, 0)], false)} />
            <path d={path([project(0, step, 0), project(PLATE, step, 0)], false)} />
          </g>
        ))}
        {/* G. K. Marg along the front edge of the plan. */}
        <path d={path([project(-20, PLATE + 16, 0), project(PLATE + 20, PLATE + 16, 0)], false)} stroke={GREY} strokeWidth="1.2" strokeDasharray="10 6" />
      </g>

      {blocks.map(({ block, faces, rise }) => (
        <g key={`${block.x}-${block.y}`} opacity={rise > 0.001 ? 1 : 0} stroke="#000" strokeWidth="1" strokeLinejoin="round">
          <path d={faces.left} fill="#fff" />
          <path d={faces.right} fill={block.office ? "#FDF1DC" : "#EEEEEF"} />
          <path d={faces.top} fill={block.office ? ORANGE : "#fff"} />
        </g>
      ))}

      {/* The marker: a pulse on the roof and a pin that drops onto it. */}
      <g opacity={marker}>
        <ellipse
          cx={roofX}
          cy={roofY}
          rx="20"
          ry="7"
          fill="none"
          stroke="#000"
          className="origin-center animate-ping [animation-duration:2.4s] [transform-box:fill-box] motion-reduce:animate-none"
        />
        <g transform={`translate(${roofX.toFixed(2)} ${(roofY - (1 - marker) * 26).toFixed(2)})`}>
          <path d="M0 0 C-4 -10 -13 -17 -13 -27 A13 13 0 1 1 13 -27 C13 -17 4 -10 0 0 Z" fill="#000" />
          <circle cx="0" cy="-27" r="5" fill={ORANGE} />
        </g>
        <path d={`M${(roofX + 18).toFixed(2)} ${(roofY - 30).toFixed(2)} H${(roofX + 78).toFixed(2)}`} stroke="#000" strokeOpacity=".5" />
        <text
          x={(roofX + 84).toFixed(2)}
          y={(roofY - 27).toFixed(2)}
          className="fill-black font-[family-name:var(--font-geist-mono)] text-[9.5px] tracking-[.1em] uppercase"
        >
          303, Tower A
        </text>
      </g>
    </svg>
  );
}
