"use client";

import { type JSX, type ReactNode, type SVGProps, useId } from "react";
import { BOX, Draw, Hatch, MOVE, ORANGE, OUT, RM, tr, type GlyphProps } from "@/components/drawing/plate";
import type { WhyGlyph } from "@/lib/pms-v2";
import { hexPoints } from "./shared";

/*
 * One drawing per "Why Moneybee PMS?" point, in the engraved-plate language of
 * components/approach/glyphs.tsx: hairline construction at rest, the data draws
 * on when `on`, and orange lands as the answer. Each drawing shows what its
 * point means, and no two in the set are the same picture.
 */

const MONO = "var(--font-geist-mono)";

function Label({ x, y, ink, anchor = "middle", opacity = 0.6, children }: { x: number | string; y: number | string; ink: string; anchor?: "start" | "middle" | "end"; opacity?: number; children: ReactNode }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="5.4" fill={ink} opacity={opacity} letterSpacing=".12em" fontFamily={MONO}>
      {children}
    </text>
  );
}

/** A full circle as a path, so it can draw itself on. */
const ring = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** Arrowheads for a horizontal dimension line from x0 (left) to x1 (right). */
const hHeads = (y: number, x0: number, x1: number) => `M${x0 + 3.6} ${y - 2.2}L${x0} ${y}L${x0 + 3.6} ${y + 2.2}M${x1 - 3.6} ${y - 2.2}L${x1} ${y}L${x1 - 3.6} ${y + 2.2}`;

/**
 * A dashed or dotted stroke that still draws itself on: the dashes sit under a
 * mask whose solid stroke draws on (a dasharray on `Draw` itself would replace
 * the draw-on dash).
 */
function DashDraw({ d, on, ms, delay = 0, ease = OUT, dash, ...rest }: { d: string; on: boolean; ms: number; delay?: number; ease?: string; dash: string } & SVGProps<SVGPathElement>) {
  const mask = useId();
  return (
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-10" y="-10" width="170" height="110">
        <Draw d={d} on={on} ms={ms} delay={delay} ease={ease} stroke="#fff" strokeWidth="4" />
      </mask>
      <path d={d} fill="none" strokeDasharray={dash} mask={`url(#${mask})`} {...rest} />
    </>
  );
}

const fade = (on: boolean, ms: number, delay: number) => ({ opacity: on ? 1 : 0, ...tr("opacity", ms, delay) });

/**
 * Fundamental research. A report draws on line by line; a lens travels in and
 * settles on one line, which reads larger under the glass; that line is the
 * one that matters, marked in orange with a note in the margin.
 */
function ResearchGlyph({ on, ink = "#000" }: GlyphProps) {
  const clip = useId();
  const x = 40;
  const y = 8;
  const w = 58;
  const h = 74;
  const fold = 8;
  const lines = [22, 29, 36, 43, 50, 57, 64, 71];
  const lengths = [44, 40, 46, 30, 42, 44, 36, 24];
  const target = 3;
  const ty = lines[target];
  const lens = { x: 62, y: ty };
  const start = { x: 132, y: 20 };
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx={lens.x} cy={lens.y} r="12.4" />
        </clipPath>
      </defs>
      <Draw d={`M${x} ${y}h${w - fold}l${fold} ${fold}v${h - fold}h${-w}Z`} on={on} ms={600} stroke={ink} strokeWidth=".8" />
      <Draw d={`M${x + w - fold} ${y}v${fold}h${fold}`} on={on} ms={260} delay={420} stroke={ink} strokeWidth=".6" />
      {lines.map((ly, index) => (
        <Draw key={ly} d={`M${x + 7} ${ly}h${lengths[index]}`} on={on} ms={320} delay={260 + index * 55} stroke={ink} strokeWidth=".6" strokeOpacity=".55" />
      ))}
      {/* Under the glass: the same lines, magnified about the lens centre. */}
      <g clipPath={`url(#${clip})`} className={RM} style={fade(on, 260, 1180)}>
        <circle cx={lens.x} cy={lens.y} r="12.4" fill="#fff" />
        <g transform={`translate(${lens.x} ${lens.y}) scale(1.6) translate(${-lens.x} ${-lens.y})`}>
          {lines.map((ly, index) => (
            <line key={ly} x1={x + 7} x2={x + 7 + lengths[index]} y1={ly} y2={ly} stroke={index === target ? ORANGE : ink} strokeWidth={index === target ? 1.6 : 0.5} strokeOpacity={index === target ? 1 : 0.5} />
          ))}
        </g>
      </g>
      {/* The line that matters, marked on the page and in the margin. */}
      <rect x={x + 7} y={ty - 1.1} width={lengths[target]} height="2.2" fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 420, 1320) }} />
      <g className={RM} style={fade(on, 260, 1420)}>
        <path d={`M${x - 4} ${ty - 5}h-2.4v10h2.4`} fill="none" stroke={ink} strokeWidth=".7" />
        <line x1={x - 6.4} x2={x - 14} y1={ty} y2={ty} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
      </g>
      {/* The lens: two axes on different curves, so it arrives on a bend. */}
      <g className={RM} style={{ transform: `translateX(${on ? lens.x : start.x}px)`, opacity: on ? 1 : 0, ...tr("transform, opacity", 900, 420, MOVE) }}>
        <g className={RM} style={{ transform: `translateY(${on ? lens.y : start.y}px)`, ...tr("transform", 900, 420, OUT) }}>
          <circle r="12.4" fill="none" stroke={ink} strokeWidth="1.1" />
          <circle r="14.2" fill="none" stroke={ink} strokeWidth=".45" strokeOpacity=".6" />
          <path d="M9.4 9.4L19 19" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Small and mid-cap focus. Companies are drawn to size along a baseline, the
 * largest first; a bracket marks off the large ones and a second marks the
 * small and mid end of the line, and that end fills orange.
 */
function SizeGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 78;
  const sizes = [20, 15, 11, 8.5, 6.5, 5];
  const large = 2;
  let cursor = 8;
  const circles = sizes.map((r) => {
    const cx = cursor + r;
    cursor += r * 2 + 1.6;
    return { cx, cy: base - r, r };
  });
  const bracket = 26;
  const smallFrom = circles[large].cx - circles[large].r;
  const smallTo = circles[circles.length - 1].cx + circles[circles.length - 1].r;
  const largeTo = circles[large - 1].cx + circles[large - 1].r;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} opacity={0.5} />
      </defs>
      <line x1="6" x2="146" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {circles.map(({ cx }, index) => (
        <line key={index} x1={cx} x2={cx} y1={base} y2={base + 2.6} stroke={ink} strokeWidth=".5" strokeOpacity=".45" />
      ))}
      {circles.map(({ cx, cy, r }, index) => (
        <g key={index}>
          {index < large && <circle cx={cx} cy={cy} r={r} fill={`url(#${hatch})`} className={RM} style={fade(on, 400, 260 + index * 90)} />}
          {index >= large && (
            <circle cx={cx} cy={cy} r={r} fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.8)", ...tr("opacity, transform", 380, 1150 + (index - large) * 80) }} />
          )}
          <Draw d={ring(cx, cy, r)} on={on} ms={420} delay={index * 90} stroke={ink} strokeWidth=".8" />
        </g>
      ))}
      {/* The two brackets: large, drawn faint; small and mid, drawn firm. */}
      <DashDraw d={`M8 ${bracket + 4}V${bracket}H${largeTo}V${bracket + 4}`} on={on} ms={380} delay={640} dash="1.4 1.6" stroke={ink} strokeWidth=".5" strokeOpacity=".55" />
      <Draw d={`M${smallFrom} ${bracket + 4}V${bracket}H${smallTo}V${bracket + 4}`} on={on} ms={420} delay={760} stroke={ink} strokeWidth=".8" />
      {circles.slice(large).map(({ cx, cy, r }, index) => (
        <Draw key={index} d={`M${cx} ${bracket + 4}V${cy - r - 1.5}`} on={on} ms={220} delay={960 + index * 50} stroke={ink} strokeWidth=".45" strokeOpacity=".6" />
      ))}
      <g className={RM} style={fade(on, 260, 860)}>
        <Label x={(8 + largeTo) / 2} y={bracket - 3} ink={ink}>
          LARGE
        </Label>
        <Label x={(smallFrom + smallTo) / 2} y={bracket - 3} ink={ink} opacity={0.85}>
          SMALL / MID
        </Label>
      </g>
    </svg>
  );
}

/**
 * Concentrated portfolio. A wide field of companies; a handful are picked out,
 * each draws a leader across to the portfolio column, and the few held slots
 * fill orange. Everything left in the field fades back.
 */
function ConcentratedGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const r = 5.4;
  const w = Math.sqrt(3) * r;
  const cols = 9;
  const rows = 7;
  const cells = Array.from({ length: cols * rows }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return { x: 12 + col * w + (row % 2) * (w / 2), y: 12 + row * r * 1.5, index };
  });
  const held = [3, 11, 24, 31, 46, 58].map((index) => cells[index]).sort((a, b) => a.y - b.y);
  const heldSet = new Set(held.map((cell) => cell.index));
  const slotX = 118;
  const slotY = (slot: number) => 13 + slot * 9.4;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2} opacity={0.7} />
      </defs>
      {cells.map((cell) => {
        const isHeld = heldSet.has(cell.index);
        return (
          <polygon
            key={cell.index}
            points={hexPoints(cell.x, cell.y, r - 0.9)}
            fill={isHeld && on ? `url(#${hatch})` : "none"}
            stroke={ink}
            strokeWidth={isHeld && on ? 0.8 : 0.5}
            strokeOpacity={isHeld && on ? 0.9 : on ? 0.14 : 0.28}
            className={RM}
            style={tr("stroke-opacity, stroke-width", 420, isHeld ? 120 + held.indexOf(cell) * 70 : 700)}
          />
        );
      })}
      {held.map((cell, slot) => (
        <Draw
          key={cell.index}
          d={`M${cell.x + r} ${cell.y}C${(cell.x + slotX) / 2 + 8} ${cell.y} ${(cell.x + slotX) / 2 + 4} ${slotY(slot) + 3.4} ${slotX - 1} ${slotY(slot) + 3.4}`}
          on={on}
          ms={620}
          delay={420 + slot * 80}
          ease={MOVE}
          stroke={ink}
          strokeWidth=".5"
          strokeOpacity=".7"
        />
      ))}
      {held.map((_, slot) => (
        <g key={slot}>
          <rect x={slotX} y={slotY(slot)} width="22" height="6.8" fill="none" stroke={ink} strokeWidth=".6" strokeOpacity=".55" strokeDasharray="1.4 1.4" />
          <rect
            x={slotX}
            y={slotY(slot)}
            width="22"
            height="6.8"
            fill={ORANGE}
            stroke={ink}
            strokeWidth=".6"
            className={RM}
            style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 380, 1020 + slot * 70) }}
          />
        </g>
      ))}
      <Label x={12 + (cols * w) / 2} y="87" ink={ink}>
        FIELD
      </Label>
      <Label x={slotX + 11} y="87" ink={ink}>
        HELD
      </Label>
    </svg>
  );
}

/**
 * Quality management. The leader sits at the top of the business; the line
 * from it runs down to every unit and on to every team below, and each part
 * is engraved as the line reaches it: good leadership shows up everywhere.
 */
function ManagementGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const units = [30, 75, 120];
  const lead = { x: 75, y: 15 };
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      {/* The leader: outline at rest, orange once it is in the chair, then its reach runs down. */}
      <polygon points={hexPoints(lead.x, lead.y, 9.5)} fill="none" stroke={ink} strokeWidth=".8" />
      <polygon points={hexPoints(lead.x, lead.y, 9.5)} fill={ORANGE} stroke={ink} strokeWidth=".8" className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.8)", ...tr("opacity, transform", 380, 80) }} />
      <DashDraw d={ring(lead.x, lead.y, 13)} on={on} ms={420} delay={200} dash="1 1.6" stroke={ink} strokeWidth=".45" strokeOpacity=".6" />
      {units.map((x, index) => (
        <g key={x}>
          <Draw d={`M${lead.x} ${lead.y + 9.5}V32H${x}V40`} on={on} ms={420} delay={380 + index * 70} ease={MOVE} stroke={ink} strokeWidth=".9" />
          <rect x={x - 13} y="40" width="26" height="13" fill={`url(#${hatch})`} className={RM} style={fade(on, 360, 720 + index * 70)} />
          <rect x={x - 13} y="40" width="26" height="13" fill="none" stroke={ink} strokeWidth=".7" strokeOpacity=".8" />
          {[-8, 8].map((dx, leaf) => (
            <g key={dx}>
              <Draw d={`M${x} 53V59H${x + dx}V65`} on={on} ms={300} delay={860 + index * 70 + leaf * 40} stroke={ink} strokeWidth=".6" />
              <rect x={x + dx - 5} y="65" width="10" height="8" fill={`url(#${hatch})`} className={RM} style={fade(on, 300, 1120 + index * 70 + leaf * 40)} />
              <rect x={x + dx - 5} y="65" width="10" height="8" fill="none" stroke={ink} strokeWidth=".55" strokeOpacity=".6" />
            </g>
          ))}
        </g>
      ))}
      <line x1="8" x2="146" y1="80" y2="80" stroke={ink} strokeWidth=".5" strokeOpacity=".35" />
    </svg>
  );
}

/**
 * Long-term investment approach. The price draws on across five years; a short
 * window caught at a dip reads as a loss, hatched; the long dimension across
 * the whole run reads the rise, and the end of the run lands in orange.
 */
function LongTermGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 76;
  const path = "M8 64 C16 58 22 70 30 66 S40 72 46 62 S58 50 66 56 S80 60 88 44 S100 50 110 34 S128 30 144 16";
  const draw = 1300;
  const start = 150;
  const top = 8;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2} opacity={0.55} />
      </defs>
      <line x1="8" x2="146" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {["Y1", "Y2", "Y3", "Y4", "Y5"].map((year, index) => {
        const x = 22 + index * 29;
        return (
          <g key={year}>
            <line x1={x} x2={x} y1={base} y2={base + 2.8} stroke={ink} strokeWidth=".5" strokeOpacity=".5" />
            <Label x={x} y={base + 10} ink={ink}>
              {year}
            </Label>
          </g>
        );
      })}
      {/* A short window, caught in the dip. */}
      <g className={RM} style={fade(on, 300, start + ((46 - 8) / 136) * draw)}>
        <rect x="24" y="54" width="22" height="20" fill={`url(#${hatch})`} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
        <Label x="35" y="50" ink={ink}>
          SHORT
        </Label>
      </g>
      <Draw d={path} on={on} ms={draw} delay={start} ease="linear" stroke={ink} strokeWidth="1" strokeLinejoin="round" />
      {/* The long dimension, from the first day to the last. */}
      <DashDraw d={`M8 60V${top}M144 12V${top}`} on={on} ms={260} delay={start + draw} dash="1.2 1.4" stroke={ink} strokeWidth=".45" strokeOpacity=".6" />
      <Draw d={`M8 ${top + 3}H63M89 ${top + 3}H144`} on={on} ms={420} delay={start + draw + 120} stroke={ink} strokeWidth=".7" />
      <g className={RM} style={fade(on, 240, start + draw + 400)}>
        <path d={hHeads(top + 3, 8, 144)} fill="none" stroke={ink} strokeWidth=".7" />
        <Label x="76" y={top + 5} ink={ink} opacity={0.85}>
          LONG
        </Label>
      </g>
      <circle cx="144" cy="16" r="3" fill={ORANGE} stroke={ink} strokeWidth=".7" className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.6)", ...tr("opacity, transform", 320, start + draw - 40) }} />
      <circle cx="8" cy="64" r="2.2" fill="#fff" stroke={ink} strokeWidth=".7" />
    </svg>
  );
}

/**
 * Risk-reward based decisions. The downside is measured first, hatched and
 * kept short below the line; the upside then rises in orange above it, and a
 * dimension on each side shows how much larger it is.
 */
function RiskRewardGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const axis = 50;
  const risk = 62;
  const reward = 14;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} opacity={0.6} />
      </defs>
      {/* Construction: the zero line and its ticks. */}
      {Array.from({ length: 14 }, (_, tick) => (
        <line key={tick} x1={10 + tick * 10} x2={10 + tick * 10} y1={axis} y2={axis + 2.4} stroke={ink} strokeWidth=".45" strokeOpacity=".4" />
      ))}
      {/* Risk first: small, hatched, measured. */}
      <rect x="36" y={axis} width="26" height={risk - axis} fill={`url(#${hatch})`} className={RM} style={fade(on, 360, 360)} />
      <Draw d={`M36 ${axis}V${risk}H62V${axis}`} on={on} ms={420} delay={100} stroke={ink} strokeWidth=".9" />
      <Draw d={`M29 ${axis + 0.5}V${risk}`} on={on} ms={260} delay={520} stroke={ink} strokeWidth=".6" />
      <g className={RM} style={fade(on, 220, 700)}>
        <path d={`M26.8 ${risk - 3.6}L29 ${risk}L31.2 ${risk - 3.6}`} fill="none" stroke={ink} strokeWidth=".6" />
        <line x1="26" x2="36" y1={risk} y2={risk} stroke={ink} strokeWidth=".45" strokeOpacity=".6" />
      </g>
      {/* Reward last: grows from the line, in orange, and is measured against the same line. */}
      <rect
        x="88"
        y={reward}
        width="26"
        height={axis - reward}
        fill={ORANGE}
        className={RM}
        style={{ ...BOX, transformOrigin: "bottom", opacity: on ? 1 : 0, transform: on ? "scaleY(1)" : "scaleY(0.03)", ...tr("transform", 760, 700, MOVE), transitionProperty: "transform, opacity" }}
      />
      <Draw d={`M121 ${axis - 0.5}V${reward}`} on={on} ms={380} delay={1380} stroke={ink} strokeWidth=".6" />
      <g className={RM} style={fade(on, 220, 1620)}>
        <path d={`M118.8 ${reward + 3.6}L121 ${reward}L123.2 ${reward + 3.6}`} fill="none" stroke={ink} strokeWidth=".6" />
        <line x1="114" x2="124" y1={reward} y2={reward} stroke={ink} strokeWidth=".45" strokeOpacity=".6" />
      </g>
      <line x1="10" x2="140" y1={axis} y2={axis} stroke={ink} strokeWidth=".9" />
      <Label x="49" y="84" ink={ink}>
        RISK
      </Label>
      <Label x="101" y="84" ink={ink}>
        REWARD
      </Label>
    </svg>
  );
}

/**
 * Focus on overlooked opportunities. The market's gaze fans out from one
 * point and every sightline lands on the same few names, hatched; the cone of
 * attention settles over them, and ours sits outside it in the dark, orange.
 */
function OverlookedGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const cone = useId();
  const eye = { x: 12, y: 30 };
  const crowd: [number, number][] = [
    [66, 18],
    [80, 30],
    [64, 40],
    [84, 12],
  ];
  const ours = { x: 118, y: 70 };
  // Every sightline aims at a crowded name; several aim at the same one.
  const aims = [0, 1, 1, 2, 3, 0, 2];
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.7} />
        <Hatch id={cone} ink={ink} gap={3.4} angle={-30} opacity={0.22} />
      </defs>
      {/* The cone of attention: its two edges draw, its shading settles in. */}
      <polygon points={`${eye.x},${eye.y} 104,0 104,54`} fill={`url(#${cone})`} className={RM} style={fade(on, 500, 700)} />
      <Draw d={`M${eye.x} ${eye.y}L104 0M${eye.x} ${eye.y}L104 54`} on={on} ms={520} delay={80} stroke={ink} strokeWidth=".5" strokeOpacity=".55" />
      {aims.map((target, index) => {
        const [tx, ty] = crowd[target];
        const spread = (index - 3) * 1.4;
        return <DashDraw key={index} d={`M${eye.x + 3} ${eye.y + spread * 0.2}L${tx - 5} ${ty + spread * 0.6}`} on={on} ms={420} delay={260 + index * 60} dash="1.6 1.2" stroke={ink} strokeWidth=".45" strokeOpacity=".7" />;
      })}
      {crowd.map(([x, y], index) => (
        <g key={index}>
          <polygon points={hexPoints(x, y, 6.4)} fill={`url(#${hatch})`} className={RM} style={fade(on, 360, 620 + index * 60)} />
          <polygon points={hexPoints(x, y, 6.4)} fill="none" stroke={ink} strokeWidth=".7" />
        </g>
      ))}
      {/* The observer. */}
      <circle cx={eye.x} cy={eye.y} r="3.4" fill="#fff" stroke={ink} strokeWidth=".8" />
      <circle cx={eye.x + 0.8} cy={eye.y} r="1.2" fill={ink} />
      {/* Ours, outside the cone. */}
      <polygon points={hexPoints(ours.x, ours.y, 8)} fill="none" stroke={ink} strokeWidth=".7" strokeDasharray="1.4 1.4" />
      <polygon
        points={hexPoints(ours.x, ours.y, 8)}
        fill={ORANGE}
        stroke={ink}
        strokeWidth=".8"
        className={RM}
        style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.8)", ...tr("opacity, transform", 420, 1250) }}
      />
      <Draw d={`M${ours.x - 12} ${ours.y + 12}L${ours.x - 20} ${ours.y + 12}`} on={on} ms={240} delay={1420} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
      <g className={RM} style={fade(on, 240, 1500)}>
        <path d={`M${ours.x - 12} ${ours.y + 12}L${ours.x - 5.6} ${ours.y + 5.6}`} fill="none" stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
        <Label x={ours.x - 22} y={ours.y + 14} ink={ink} anchor="end">
          OURS
        </Label>
      </g>
    </svg>
  );
}

export const WHY_GLYPHS: Record<WhyGlyph, (props: GlyphProps) => JSX.Element> = {
  research: ResearchGlyph,
  size: SizeGlyph,
  concentrated: ConcentratedGlyph,
  management: ManagementGlyph,
  longterm: LongTermGlyph,
  riskreward: RiskRewardGlyph,
  overlooked: OverlookedGlyph,
};
