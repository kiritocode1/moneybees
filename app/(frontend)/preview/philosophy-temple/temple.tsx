"use client";

import { useInView, useMotionValueEvent } from "motion/react";
import { useRef, useState, useSyncExternalStore } from "react";
import FactSection, { Bloom, clamp, easeOut, type FigureState, LINE_GLOW, PanelTitle, r2, riseAt, SOLID_GLOW, useEased, useFigureClockValue } from "@/components/fact-sections/fact-section";
import { PERIOD_RETURNS, PILLARS } from "@/lib/insights";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * PREVIEW ONLY. The six pillars as a tholos drawn in the pyramid's language
 * (components/fact-sections/picks-section.tsx): paper faces, ink hairlines, one
 * orange element with the bloom behind it. Six plain columns stand on a
 * stepped base; as each principle reaches the trigger line the ring turns
 * that column to the front and lights it. The seventh panel lights all six and
 * lands a stepped roof, mirroring the base, labelled with the since-inception return.
 */

const COUNT = PILLARS.length;
/** Every column lit and the roof down. */
const ROOF = COUNT;

const RING = 138;
const STEPS = [
  { radius: 190, from: 0, to: 9 },
  { radius: 175, from: 9, to: 18 },
  { radius: 160, from: 18, to: 27 },
] as const;
const COLUMN = { base: [27, 34, 20], shaft: [34, 164, 14], neck: [164, 170, 18], abacus: [170, 177, 21] } as const;
/** The roof mirrors the base: three discs stepping in. */
const ROOF_STEPS = [
  { radius: 168, from: 177, to: 195 },
  { radius: 150, from: 195, to: 205 },
  { radius: 128, from: 205, to: 215 },
] as const;
const SPIN = 0.18;
/** A little higher than the pyramid's view, so front and back columns separate. */
const SQUASH = 0.42;
/** The lit column stops this far off the front, so no two columns ever line up. */
const OFFSET = Math.PI / 12;

const INK = "rgba(0,0,0,.72)";
const LIT_INK = "#9a6208";

const SINCE_INCEPTION = PERIOD_RETURNS.find((row) => row.period === "Since Inception");

/** Plan to screen, as the pyramid projects it: rotate the plan, squash it, lift by z. */
function project(x: number, y: number, z: number, rotation: number): [number, number] {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return [x * cos - y * sin, (x * sin + y * cos) * SQUASH - z];
}

const f = (value: number) => r2(value).toFixed(2);

/** For useSyncExternalStore: nothing to subscribe to, only the server and browser snapshots differ. */
const subscribeNever = () => () => {};

/** A vertical cylinder's side wall and top, centred on screen point (x, y) at ground level. */
function cylinder(x: number, y: number, radius: number, from: number, to: number) {
  const ry = radius * SQUASH;
  const top = y - to;
  const bottom = y - from;
  return {
    side: `M${f(x - radius)} ${f(top)}L${f(x - radius)} ${f(bottom)}A${f(radius)} ${f(ry)} 0 0 0 ${f(x + radius)} ${f(bottom)}L${f(x + radius)} ${f(top)}Z`,
    top: { cx: r2(x), cy: r2(top), rx: r2(radius), ry: r2(ry) },
  };
}

/** A square slab around plan point (px, py), turned with the ring: faces far to near, then the top. */
function slab(px: number, py: number, half: number, from: number, to: number, rotation: number) {
  const corners = [
    [half, half],
    [-half, half],
    [-half, -half],
    [half, -half],
  ].map(([dx, dy]) => [px + dx, py + dy] as const);
  const at = (z: number) => corners.map(([x, y]) => project(x, y, z, rotation));
  const low = at(from);
  const high = at(to);
  const sides = corners
    .map((_, side) => {
      const next = (side + 1) % 4;
      const quad = [high[side], high[next], low[next], low[side]];
      return { depth: (low[side][1] + low[next][1]) / 2, d: `M${quad.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z` };
    })
    .sort((a, b) => a.depth - b.depth);
  return { sides: sides.map((side) => side.d), top: `M${high.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z` };
}

function Gradients() {
  return (
    <defs>
      <Bloom id="temple-bloom" />
      <linearGradient id="temple-paper" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".55" stopColor="#f1f0ee" />
        <stop offset="1" stopColor="#d6d5d2" />
      </linearGradient>
      <linearGradient id="temple-lit" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#f8b443" />
        <stop offset=".55" stopColor="#F6A11A" />
        <stop offset="1" stopColor="#c98110" />
      </linearGradient>
    </defs>
  );
}

function Column({ index, rotation, lit, rise }: { index: number; rotation: number; lit: boolean; rise: number }) {
  const angle = (index * 2 * Math.PI) / COUNT;
  const px = RING * Math.cos(angle);
  const py = RING * Math.sin(angle);
  const [x, y] = project(px, py, 0, rotation);
  const fill = lit ? "url(#temple-lit)" : "url(#temple-paper)";
  const stroke = lit ? LIT_INK : INK;
  const parts = [COLUMN.base, COLUMN.shaft, COLUMN.neck].map(([from, to, radius]) => cylinder(x, y, radius, from, to));
  const abacus = slab(px, py, COLUMN.abacus[2], COLUMN.abacus[0], COLUMN.abacus[1], rotation);
  return (
    <g
      style={{
        opacity: rise,
        transform: `translateY(${r2((1 - rise) * -40)}px)`,
        filter: lit ? SOLID_GLOW : "none",
        transition: "filter 300ms ease",
      }}
    >
      {parts.map((part, i) => (
        <g key={i}>
          <path d={part.side} fill={fill} stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" />
          <ellipse {...part.top} fill={lit ? "#fbc56a" : "#fbfbfa"} stroke={stroke} strokeWidth="1.1" />
        </g>
      ))}
      {abacus.sides.map((d, i) => (
        <path key={i} d={d} fill={fill} stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" />
      ))}
      <path d={abacus.top} fill={lit ? "#fbc56a" : "#fbfbfa"} stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" />
    </g>
  );
}

export function TempleFigure({ progress, selected, onSelect }: FigureState) {
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef);
  const reduceMotion = useReducedMotion();
  // Trig output can differ in the last digit between server and browser, so the drawing waits for the browser.
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);

  const settled = progress > 0.8;
  const together = settled && selected === ROOF;
  // The lit column turns to the front: column i faces the viewer at rotation 90deg - 60deg * i, less the offset.
  const target = Math.PI / 2 + OFFSET - (Math.min(selected, COUNT - 1) * 2 * Math.PI) / COUNT;
  const turned = useEased(target, 3.2);
  const build = (1 - easeOut(clamp(progress / 0.82))) * Math.PI * 0.9;
  const clock = useFigureClockValue(together && inView && !reduceMotion);
  const [spin, setSpin] = useState(0);
  useMotionValueEvent(clock, "change", (seconds) => setSpin(seconds * SPIN));
  const rotation = turned + build + (together ? spin : 0);
  const roofDrop = useEased(together ? 0 : 1, 4);

  const order = PILLARS.map((_, index) => {
    const angle = (index * 2 * Math.PI) / COUNT;
    return { index, depth: project(RING * Math.cos(angle), RING * Math.sin(angle), 0, rotation)[1] };
  }).sort((a, b) => a.depth - b.depth);

  const labelY = -(ROOF_STEPS[0].from + ROOF_STEPS[0].to) / 2;
  const labelX = ROOF_STEPS[0].radius + 18;

  return (
    <svg ref={svgRef} viewBox="-215 -270 520 370" className="h-auto w-full overflow-visible" role="group" aria-label="Six pillars of our philosophy">
      <Gradients />
      {mounted && (
        <>
          <ellipse cx="0" cy="8" rx="226" ry="80" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1.2" strokeDasharray="2 9" strokeLinecap="round" />
          <ellipse
            cx="0"
            cy={-110}
            rx="170"
            ry="120"
            fill="url(#temple-bloom)"
            style={{ opacity: settled ? (together ? 1 : 0.55) : 0, transition: "opacity 500ms ease" }}
          />
          <g style={{ opacity: clamp(progress * 3) }}>
            {STEPS.map((step) => {
              const part = cylinder(0, 0, step.radius, step.from, step.to);
              return (
                <g key={step.radius}>
                  <path d={part.side} fill="url(#temple-paper)" stroke={INK} strokeWidth="1.1" />
                  <ellipse {...part.top} fill="#fbfbfa" stroke={INK} strokeWidth="1.1" />
                </g>
              );
            })}
          </g>
          {order.map(({ index }) => (
            <g
              key={index}
              role="button"
              tabIndex={settled ? 0 : -1}
              aria-label={PILLARS[index].name}
              aria-pressed={selected === index}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => event.key === "Enter" && onSelect(index)}
              className="cursor-pointer outline-none"
            >
              <Column index={index} rotation={rotation} lit={settled && (selected === index || together)} rise={riseAt(progress, index * 0.6 + 1)} />
            </g>
          ))}
          <g style={{ opacity: 1 - roofDrop, transform: `translateY(${r2(roofDrop * -70)}px)` }} aria-hidden="true">
            {ROOF_STEPS.map((step) => {
              const part = cylinder(0, 0, step.radius, step.from, step.to);
              return (
                <g key={step.radius}>
                  <path d={part.side} fill="url(#temple-paper)" stroke={INK} strokeWidth="1.1" />
                  <ellipse {...part.top} fill="#fbfbfa" stroke={INK} strokeWidth="1.1" />
                </g>
              );
            })}
            <path d={`M${ROOF_STEPS[0].radius + 6} ${labelY}H${labelX + 40}`} stroke="#F6A11A" strokeWidth="1" style={{ filter: LINE_GLOW }} />
            <text x={labelX + 46} y={labelY + 4} fontSize="12" fill="#000" fontFamily="ui-monospace, Menlo, monospace" letterSpacing=".04em">
              {SINCE_INCEPTION?.queenbee.toFixed(2)}% A YEAR
            </text>
          </g>
        </>
      )}
    </svg>
  );
}

function PillarPanel({ index }: { index: number }) {
  const pillar = PILLARS[index];
  return (
    <div>
      <PanelTitle size="medium">{pillar.name}</PanelTitle>
      <p className="mt-[24px] max-w-[34ch] border-t border-t-[rgba(0,0,0,.13)] pt-[18px] text-[clamp(1.1rem,1.4vw,1.35rem)] leading-[1.45] text-[rgba(0,0,0,.78)]">{pillar.text}</p>
    </div>
  );
}

function RoofPanel() {
  return (
    <div>
      {/* Group profile slide 11: "Robust strategy for consistent performance". */}
      <PanelTitle size="medium">Consistent performance</PanelTitle>
      <p className="mt-[24px] max-w-[34ch] border-t border-t-[rgba(0,0,0,.13)] pt-[18px] text-[clamp(1.1rem,1.4vw,1.35rem)] leading-[1.45] text-[rgba(0,0,0,.78)]">
        {SINCE_INCEPTION?.queenbee.toFixed(2)}% a year since August 2007, against {SINCE_INCEPTION?.benchmark.toFixed(2)}% for the S&amp;P BSE 500 TRI.
        The six principles carry every portfolio we run.
      </p>
    </div>
  );
}

/** The six pillars on /our-approach, after the returns. Heading is group profile slide 12's title. */
export function PillarsSection() {
  return (
    <FactSection
      id="pillars"
      label="Our philosophy"
      heading="Our investment philosophy"
      panels={[...PILLARS.map((_, index) => ({ part: index, content: <PillarPanel index={index} /> })), { part: ROOF, content: <RoofPanel /> }]}
      figure={TempleFigure}
    />
  );
}
