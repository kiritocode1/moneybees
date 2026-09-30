"use client";

import { useId, type ReactNode } from "react";
import { BOX, Draw, Hatch, ORANGE, OUT, RM, tr } from "@/components/drawing/plate";
import { hexPoints } from "@/components/pms-v2/shared";
import { CHAINS } from "@/lib/compare";

/*
 * The plan's two diagrams, in the engraved-plate language of
 * components/approach/glyphs.tsx. PMS → Investor → Securities: the holding
 * boundary closes round the one investor and the securities, so they sit in
 * the investor's own name. AIF → Fund → Investments: many investors' money
 * runs into one fund, the boundary closes round the fund and what it holds,
 * and the investors stay outside it. `on` plays each from its construction
 * (the nodes in outline) through arrows and holdings to the orange answer.
 */

const NODE_X = [90, 300, 510];
const Y = 112;
const INK = "#000";
const MONO = "var(--font-geist-mono)";

/** Seven cells in a small honeycomb around a point. */
const cluster = (cx: number, cy: number, r: number) => {
  const w = Math.sqrt(3) * r;
  return [
    [0, 0],
    [w, 0],
    [-w, 0],
    [w / 2, -1.5 * r],
    [-w / 2, -1.5 * r],
    [w / 2, 1.5 * r],
    [-w / 2, 1.5 * r],
  ].map(([dx, dy]) => [cx + dx, cy + dy] as const);
};

function Label({ x, y, children, anchor = "middle", size = 11, opacity = 0.6 }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; size?: number; opacity?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={INK} opacity={opacity} letterSpacing=".12em" fontFamily={MONO}>
      {children}
    </text>
  );
}

/** Fades a group in once `on`, after `delay`. */
const fade = (on: boolean, delay: number, ms = 280) => ({ opacity: on ? 1 : 0, ...tr("opacity", ms, delay) });

/** An arrow that draws itself on, its head landing after the shaft, with a verb above it. */
function Arrow({ from, to, on, delay, verb }: { from: number; to: number; on: boolean; delay: number; verb: string }) {
  return (
    <g>
      <Draw d={`M${from} ${Y}H${to}`} on={on} ms={420} delay={delay} stroke={INK} strokeWidth="1.4" />
      <path d={`M${to - 9} ${Y - 6}L${to} ${Y}L${to - 9} ${Y + 6}`} fill="none" stroke={INK} strokeWidth="1.4" className={RM} style={fade(on, delay + 380, 200)} />
      <g className={RM} style={fade(on, delay + 200)}>
        <Label x={(from + to) / 2} y={Y - 12}>
          {verb}
        </Label>
      </g>
    </g>
  );
}

/** The manager node: an engraved double hexagon with its name. */
function Manager({ name }: { name: string }) {
  return (
    <g>
      <polygon points={hexPoints(NODE_X[0], Y, 50)} fill="#fff" stroke={INK} strokeWidth="1.6" />
      <polygon points={hexPoints(NODE_X[0], Y, 43)} fill="none" stroke={INK} strokeWidth=".8" strokeOpacity=".5" />
      <Label x={NODE_X[0]} y={Y + 6} size={17} opacity={1}>
        {name}
      </Label>
    </g>
  );
}

/**
 * The holding boundary: draws on round what the holder owns, with its name
 * set into the line on a white knockout.
 */
function Boundary({ x, y, w, h, on, delay, name, inset = 12 }: { x: number; y: number; w: number; h: number; on: boolean; delay: number; name: string; inset?: number }) {
  return (
    <g>
      <Draw d={`M${x + 16} ${y}H${x + w}V${y + h}H${x}V${y}H${x + 16}`} on={on} ms={700} delay={delay} stroke={INK} strokeWidth="1" strokeOpacity=".7" />
      {[
        [x, y],
        [x + w, y],
        [x, y + h],
        [x + w, y + h],
      ].map(([cx, cy]) => (
        <path key={`${cx}-${cy}`} d={`M${cx - 5} ${cy}H${cx + 5}M${cx} ${cy - 5}V${cy + 5}`} stroke={INK} strokeWidth="1" className={RM} style={fade(on, delay + 500)} />
      ))}
      <g className={RM} style={fade(on, delay + 450)}>
        <rect x={x + inset} y={y - 8} width={name.length * 8.6 + 12} height="16" fill="#fff" />
        <Label x={x + inset + 6} y={y + 4} anchor="start" opacity={0.75}>
          {name}
        </Label>
      </g>
    </g>
  );
}

function Labels({ labels }: { labels: readonly string[] }) {
  return (
    <>
      {labels.map((label, index) => (
        <Label key={label} x={NODE_X[index]} y={240} size={15} opacity={1}>
          {label.toUpperCase()}
        </Label>
      ))}
    </>
  );
}

/** PMS → Investor → Securities. */
export function PmsChain({ on }: { on: boolean }) {
  const hatch = useId();
  const ix = NODE_X[1];
  return (
    <svg viewBox="0 0 600 250" className="block h-auto w-full overflow-visible" role="img" aria-label="PMS to Investor to Securities">
      <defs>
        <Hatch id={hatch} ink={INK} gap={3.4} opacity={0.6} />
      </defs>
      <Manager name="PMS" />
      <Arrow from={148} to={236} on={on} delay={0} verb="MANAGES" />
      {/* One investor: outline at rest, engraved once the arrow reaches it. */}
      <g>
        <circle cx={ix} cy={Y - 20} r="16" fill="#fff" stroke={INK} strokeWidth="1.4" />
        <path d={`M${ix - 30} ${Y + 34}c0-22 13-33 30-33s30 11 30 33Z`} fill="#fff" stroke={INK} strokeWidth="1.4" />
        <g className={RM} style={fade(on, 380, 420)}>
          <circle cx={ix} cy={Y - 20} r="16" fill={`url(#${hatch})`} />
          <path d={`M${ix - 30} ${Y + 34}c0-22 13-33 30-33s30 11 30 33Z`} fill={`url(#${hatch})`} />
        </g>
        <line x1={ix - 40} x2={ix + 40} y1={Y + 42} y2={Y + 42} stroke={INK} strokeWidth=".8" strokeOpacity=".4" />
      </g>
      <Arrow from={356} to={444} on={on} delay={560} verb="HOLDS" />
      {/* The securities: cell outlines at rest, filled in orange as they come into the investor's name. */}
      {cluster(NODE_X[2], Y, 17).map(([x, y], index) => (
        <g key={index}>
          <polygon points={hexPoints(x, y, 15)} fill="none" stroke={INK} strokeWidth="1" strokeOpacity=".45" />
          <polygon points={hexPoints(x, y, 15)} fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.6)", ...tr("opacity, transform", 380, 1450 + index * 60, OUT) }} />
        </g>
      ))}
      <Boundary x={246} y={46} w={330} h={122} on={on} delay={900} name="DIRECT HOLDING" />
      <Labels labels={CHAINS.pms} />
    </svg>
  );
}

/** AIF → Fund → Investments. */
export function AifChain({ on }: { on: boolean }) {
  const hatch = useId();
  const pool = useId();
  const contributors = [240, 270, 300, 330, 360];
  const fx = NODE_X[1];
  const fy = Y + 8;
  const r = 44;
  return (
    <svg viewBox="0 0 600 250" className="block h-auto w-full overflow-visible" role="img" aria-label="AIF to Fund to Investments">
      <defs>
        <Hatch id={hatch} ink={INK} gap={3.4} opacity={0.6} />
        <clipPath id={pool}>
          <circle cx={fx} cy={fy} r={r - 6} />
        </clipPath>
      </defs>
      <Manager name="AIF" />
      <Arrow from={148} to={246} on={on} delay={0} verb="MANAGES" />
      {/* Many investors, outside the fund's boundary, their money running into it. */}
      <Label x={222} y={20} anchor="end">
        INVESTORS
      </Label>
      {contributors.map((x, index) => (
        <g key={x}>
          <circle cx={x} cy="10" r="5" fill={`url(#${hatch})`} stroke={INK} strokeWidth="1" />
          <path d={`M${x - 8} 26c0-6 3.5-9 8-9s8 3 8 9Z`} fill={`url(#${hatch})`} stroke={INK} strokeWidth="1" />
          <Draw d={`M${x} 30L${fx + (x - fx) * 0.18} ${fy - r - 2}`} on={on} ms={380} delay={200 + index * 80} stroke={INK} strokeWidth=".9" strokeOpacity=".6" />
        </g>
      ))}
      {/* The fund: a vessel with a tick-marked side; the pooled money rises in it last. */}
      <circle cx={fx} cy={fy} r={r} fill="#fff" stroke={INK} strokeWidth="1.6" />
      <circle cx={fx} cy={fy} r={r - 6} fill="none" stroke={INK} strokeWidth=".8" strokeOpacity=".4" />
      {Array.from({ length: 5 }, (_, tick) => (
        <line key={tick} x1={fx + r} x2={fx + r + (tick % 2 ? 4 : 7)} y1={fy - 24 + tick * 12} y2={fy - 24 + tick * 12} stroke={INK} strokeWidth=".8" strokeOpacity=".6" />
      ))}
      <g clipPath={`url(#${pool})`}>
        <rect
          x={fx - r}
          y={fy - r + 24}
          width={r * 2}
          height={r * 2}
          fill={ORANGE}
          className={RM}
          style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 800, 1350) }}
        />
      </g>
      <Arrow from={354} to={444} on={on} delay={620} verb="HOLDS" />
      {/* The investments, held by the fund: engraved, not in any investor's name. */}
      {cluster(NODE_X[2], Y, 17).map(([x, y], index) => (
        <g key={index}>
          <polygon points={hexPoints(x, y, 15)} fill="none" stroke={INK} strokeWidth="1" strokeOpacity=".45" />
          <polygon points={hexPoints(x, y, 15)} fill={`url(#${hatch})`} stroke={INK} strokeWidth="1.1" className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.6)", ...tr("opacity, transform", 380, 1000 + index * 60) }} />
        </g>
      ))}
      <Boundary x={248} y={50} w={328} h={128} on={on} delay={900} name="FUND LEVEL" inset={176} />
      <Labels labels={CHAINS.aif} />
    </svg>
  );
}
