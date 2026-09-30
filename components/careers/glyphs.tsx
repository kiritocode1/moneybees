"use client";

import { useId } from "react";
import { BOX, Draw, Hatch, MOVE, ORANGE, OUT, RM, tr, type GlyphProps } from "@/components/drawing/plate";
import type { Team } from "@/lib/careers";

export { ORANGE };

/*
 * The drawings on /careers, in the engraved-plate language of
 * components/approach/glyphs.tsx: hairline construction first, hatching for
 * grey, orange last as the answer. The hero draws five disciplines closing
 * into one comb with a cell left open; each job card draws what its team does;
 * each culture point draws its idea on black. `on` plays a drawing from its
 * construction to its explained state; reduced motion jumps to the end.
 */

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  });

const hexAttr = (cx: number, cy: number, r: number) =>
  hexPoints(cx, cy, r)
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

const hexPath = (cx: number, cy: number, r: number) =>
  hexPoints(cx, cy, r)
    .map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join("") + "Z";

const MONO = "var(--font-geist-mono), ui-monospace, monospace";

/**
 * The hero. The six places of a comb are drawn as construction around one
 * centre; the five disciplines travel in from outside and lock into theirs;
 * the centre fills orange as Moneybee; the sixth place is drawn in orange last
 * and left open for the reader.
 */
export function CombGlyph({ on, labels }: { on: boolean; labels: readonly string[] }) {
  const hatch = useId();
  const ink = "#000";
  const r = 50;
  const cx = 190;
  const cy = 165;
  const step = Math.sqrt(3) * r + 4;
  const cells = Array.from({ length: 6 }, (_, index) => {
    const angle = ((60 * index - 120) * Math.PI) / 180;
    return { x: cx + step * Math.cos(angle), y: cy + step * Math.sin(angle), angle };
  });
  const open = labels.length;
  const settle = 150 + (labels.length - 1) * 110 + 900;
  return (
    <svg viewBox="0 0 380 330" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={3.2} opacity={0.5} />
      </defs>
      {/* Construction: the circle through every cell centre, its six stations, and the centre's crosshair. */}
      <Draw d={`M${cx} ${cy - step}A${step} ${step} 0 1 1 ${cx - 0.01} ${cy - step}`} on={on} ms={900} stroke={ink} strokeWidth=".6" strokeOpacity=".35" />
      {cells.map((cell, index) => (
        <polygon key={index} points={hexAttr(cell.x, cell.y, r - 1.5)} fill="none" stroke={ink} strokeWidth=".6" strokeOpacity=".3" strokeDasharray="2 3" />
      ))}
      <path d={`M${cx - 14} ${cy}H${cx + 14}M${cx} ${cy - 14}V${cy + 14}`} stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {/* The disciplines: each travels in along its own spoke and locks into place. */}
      {cells.slice(0, open).map((cell, index) => {
        const words = (labels[index] ?? "").split(" ");
        const drift = on ? 0 : 40;
        return (
          <g
            key={index}
            className={RM}
            style={{
              transform: `translate(${Math.cos(cell.angle) * drift}px, ${Math.sin(cell.angle) * drift}px)`,
              opacity: on ? 1 : 0,
              transitionProperty: "transform, opacity",
              transitionDuration: "900ms, 420ms",
              transitionDelay: `${150 + index * 110}ms`,
              transitionTimingFunction: `${MOVE}, ${OUT}`,
            }}
          >
            <polygon points={hexAttr(cell.x, cell.y, r - 1.5)} fill={`url(#${hatch})`} stroke={ink} strokeWidth="1.1" />
            <polygon points={hexAttr(cell.x, cell.y, r - 9)} fill="#fff" stroke={ink} strokeWidth=".6" />
            {words.map((word, line) => (
              <text
                key={word}
                x={cell.x}
                y={cell.y + (line - (words.length - 1) / 2) * 13 + 3.6}
                textAnchor="middle"
                fontSize="10.5"
                fill={ink}
                fontFamily={MONO}
                letterSpacing=".04em"
              >
                {word.toUpperCase()}
              </text>
            ))}
          </g>
        );
      })}
      {/* The centre fills once the five are in. */}
      <polygon
        points={hexAttr(cx, cy, r - 1.5)}
        fill={ORANGE}
        className={RM}
        style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.82)", ...tr("opacity, transform", 480, settle - 200) }}
      />
      <text x={cx} y={cy + 3.6} textAnchor="middle" fontSize="10.5" fill={ink} fontFamily={MONO} letterSpacing=".04em" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 300, settle) }}>
        MONEYBEE
      </text>
      {/* The open place, drawn last, in orange. */}
      <Draw d={hexPath(cells[open].x, cells[open].y, r - 1.5)} on={on} ms={700} delay={settle + 150} stroke={ORANGE} strokeWidth="2" strokeLinejoin="round" />
      <text x={cells[open].x} y={cells[open].y + 3.6} textAnchor="middle" fontSize="10.5" fill={ink} fontFamily={MONO} letterSpacing=".04em" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 300, settle + 600) }}>
        YOU
      </text>
    </svg>
  );
}

/**
 * Investment research. A row of names stands as hatched bars; a lens crosses
 * the row and stops on one; that one is measured, top to baseline, and turns
 * orange.
 */
function ResearchGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 50;
  const bars = [16, 24, 19, 30, 21];
  const x = (index: number) => 12 + index * 12;
  const pick = 3;
  const top = base - bars[pick];
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      <line x1="4" x2="76" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".5" />
      {bars.map((height, index) => (
        <g key={index}>
          <line x1={x(index) + 3.5} x2={x(index) + 3.5} y1={base} y2={base + 2.4} stroke={ink} strokeWidth=".5" strokeOpacity=".5" />
          <rect
            x={x(index)}
            y={base - height}
            width="7"
            height={height}
            fill={`url(#${hatch})`}
            stroke={ink}
            strokeWidth=".7"
            className={RM}
            style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 480, index * 55) }}
          />
        </g>
      ))}
      <rect x={x(pick)} y={top} width="7" height={bars[pick]} fill={ORANGE} stroke={ink} strokeWidth=".7" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 320, 1250) }} />
      {/* The measure: extension from the top, then the dimension with its arrowheads. */}
      <path d={`M${x(pick) + 7} ${top}H75`} stroke={ink} strokeWidth=".5" strokeDasharray="1.2 1.4" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 260, 1250) }} />
      <Draw d={`M72.5 ${top + 1}V${base - 1}`} on={on} ms={320} delay={1400} stroke={ink} strokeWidth=".7" />
      <path
        d={`M70.8 ${top + 3}L72.5 ${top}L74.2 ${top + 3}M70.8 ${base - 3}L72.5 ${base}L74.2 ${base - 3}`}
        fill="none"
        stroke={ink}
        strokeWidth=".7"
        className={RM}
        style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, 1650) }}
      />
      {/* The lens starts over the first name and crosses to the one worth measuring. */}
      <g className={RM} style={{ transform: `translateX(${on ? x(pick) + 3.5 : x(0) + 3.5}px)`, ...tr("transform", 900, 300, MOVE) }}>
        <circle cx="0" cy={top} r="8" fill="none" stroke={ink} strokeWidth="1.2" />
        <circle cx="0" cy={top} r="10.5" fill="none" stroke={ink} strokeWidth=".5" strokeDasharray="1 1.6" strokeOpacity=".7" />
        <path d={`M-5.8 ${top + 5.8}L-11 ${top + 11}`} stroke={ink} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * Portfolio management. Each holding has its target weight notched on the
 * plate; the holdings start off their marks and move to them; the one that
 * had furthest to go is the one in orange.
 */
function PortfolioGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 52;
  const targets = [26, 20, 32, 16, 28];
  const starts = [15, 30, 22, 25, 12];
  const x = (index: number) => 9 + index * 13.5;
  const far = targets.reduce((best, target, index) => (Math.abs(target - starts[index]) > Math.abs(targets[best] - starts[best]) ? index : best), 0);
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      <line x1="4" x2="76" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".5" />
      {targets.map((target, index) => (
        <g key={index}>
          {/* The target notch: construction, there from the start. */}
          <path d={`M${x(index) - 2} ${base - target}H${x(index) + 10}`} stroke={ink} strokeWidth=".6" strokeOpacity=".7" />
          {[false, index === far].map((orange, layer) =>
            layer === 1 && !orange ? null : (
              <rect
                key={layer}
                x={x(index)}
                y={base - target}
                width="8"
                height={target}
                fill={orange ? ORANGE : `url(#${hatch})`}
                stroke={ink}
                strokeWidth=".7"
                className={RM}
                style={{
                  ...BOX,
                  transformOrigin: "bottom",
                  transform: on ? "scaleY(1)" : `scaleY(${starts[index] / target})`,
                  opacity: orange ? (on ? 1 : 0) : 1,
                  transitionProperty: "transform, opacity",
                  transitionDuration: "820ms, 320ms",
                  transitionDelay: `${150 + index * 90}ms, 1250ms`,
                  transitionTimingFunction: `${MOVE}, ${OUT}`,
                }}
              />
            ),
          )}
        </g>
      ))}
    </svg>
  );
}

/**
 * Advisory. The client on one side, the choices on the other; every choice
 * is traced, one is drawn in firmly, and that one turns orange.
 */
function AdvisoryGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const client = [14, 30] as const;
  const options = [12, 30, 48];
  const pick = 1;
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      <circle cx={client[0]} cy={client[1]} r="6" fill={`url(#${hatch})`} stroke={ink} strokeWidth="1.1" />
      <circle cx={client[0]} cy={client[1]} r="9" fill="none" stroke={ink} strokeWidth=".5" strokeDasharray="1 1.6" strokeOpacity=".7" />
      {options.map((y, index) => (
        <g key={y}>
          <path d={`M${client[0] + 9} ${client[1]}L52 ${y}`} stroke={ink} strokeWidth=".5" strokeDasharray="1.4 1.4" className={RM} style={{ opacity: on ? 0.8 : 0, ...tr("opacity", 320, index * 110) }} />
          <rect x="52" y={y - 6} width="20" height="12" fill="#fff" fillOpacity="0" stroke={ink} strokeWidth=".9" />
          <path d={`M56 ${y - 1.5}h12M56 ${y + 2}h7`} stroke={ink} strokeWidth=".6" strokeOpacity=".6" />
        </g>
      ))}
      <Draw d={`M${client[0] + 6} ${client[1]}L52 ${options[pick]}`} on={on} ms={520} delay={650} stroke={ink} strokeWidth="1.3" />
      <rect x="52" y={options[pick] - 6} width="20" height="12" fill={ORANGE} stroke={ink} strokeWidth=".9" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 320, 1150) }} />
      <path d={`M56 ${options[pick] - 1.5}h12M56 ${options[pick] + 2}h7`} stroke="#000" strokeWidth=".6" className={RM} style={{ opacity: on ? 0.7 : 0, ...tr("opacity", 320, 1150) }} />
    </svg>
  );
}

/**
 * Compliance. A gate stands on the line with its limit measured; the work
 * travels up to it and passes under, and once through it is marked in orange.
 */
function ComplianceGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 50;
  const limit = 24;
  const block = { w: 10, h: 18 };
  const from = 6;
  const to = 60;
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      <line x1="2" x2="78" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".5" />
      {/* The gate: two posts and the hatched beam that sets the limit. */}
      <Draw d={`M34 ${base}V14M48 ${base}V14`} on={on} ms={420} stroke={ink} strokeWidth="1.1" />
      <rect x="32" y="14" width="18" height={base - limit - 14} fill={`url(#${hatch})`} stroke={ink} strokeWidth=".8" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 360, 250) }} />
      {/* The limit, measured beside the gate. */}
      <Draw d={`M50 ${limit}H57`} on={on} ms={200} delay={420} stroke={ink} strokeWidth=".5" strokeOpacity=".8" />
      <Draw d={`M54.5 ${limit + 1}V${base - 1}`} on={on} ms={320} delay={520} stroke={ink} strokeWidth=".7" />
      <path
        d={`M52.8 ${limit + 3}L54.5 ${limit}L56.2 ${limit + 3}M52.8 ${base - 3}L54.5 ${base}L56.2 ${base - 3}`}
        fill="none"
        stroke={ink}
        strokeWidth=".7"
        className={RM}
        style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, 780) }}
      />
      {/* The work: arrives on the left, passes under the beam, and lands orange on the far side. */}
      <g className={RM} style={{ transform: `translateX(${on ? to : from}px)`, ...tr("transform", 1000, 600, MOVE) }}>
        <rect x="0" y={base - block.h} width={block.w} height={block.h} fill="#fff" fillOpacity="0" stroke={ink} strokeWidth="1" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 260, 450) }} />
        <rect x="0" y={base - block.h} width={block.w} height={block.h} fill={ORANGE} stroke={ink} strokeWidth="1" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 300, 1600) }} />
      </g>
    </svg>
  );
}

/**
 * Financial services. A ledger's rows are posted one after another, the total
 * is ruled off twice beneath them, and the balance lands in orange.
 */
function ServicesGlyph({ on, ink = "#000" }: GlyphProps) {
  const rows = [18, 25, 32];
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <Draw d="M12 6H68V54H12Z" on={on} ms={520} stroke={ink} strokeWidth="1" />
      <Draw d="M12 12H68M50 6V54" on={on} ms={380} delay={150} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
      {rows.map((y, index) => (
        <g key={y}>
          <Draw d={`M17 ${y}H${index === 1 ? 38 : 44}`} on={on} ms={260} delay={400 + index * 130} stroke={ink} strokeWidth="1.2" strokeOpacity=".55" />
          <Draw d={`M54 ${y}H64`} on={on} ms={200} delay={480 + index * 130} stroke={ink} strokeWidth="1.2" strokeOpacity=".55" />
        </g>
      ))}
      {/* Ruled off: a double line under the amounts, then the total. */}
      <Draw d="M52 38.5H66M52 40.5H66" on={on} ms={260} delay={900} stroke={ink} strokeWidth=".6" />
      <rect x="54" y="45" width="10" height="3" fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "right", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 420, 1150) }} />
    </svg>
  );
}

export const TEAM_GLYPHS: Record<Team, typeof ResearchGlyph> = {
  research: ResearchGlyph,
  portfolio: PortfolioGlyph,
  advisory: AdvisoryGlyph,
  compliance: ComplianceGlyph,
  services: ServicesGlyph,
};

/**
 * Research, as a habit. A page is read line by line; one line is underlined
 * in orange and a note is pinned in the margin beside it.
 */
function ReadingGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const lines = [16, 22, 28, 34, 40, 46];
  const marked = 3;
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      <path d="M12 5H42L50 13V55H12Z" fill="none" stroke={ink} strokeWidth="1" />
      <path d="M42 5V13H50" fill="none" stroke={ink} strokeWidth=".6" />
      {lines.map((y, index) => (
        <Draw key={y} d={`M17 ${y}H${index === lines.length - 1 ? 33 : 45}`} on={on} ms={240} delay={index * 90} stroke={ink} strokeWidth=".7" strokeOpacity=".6" />
      ))}
      <rect x="17" y={lines[marked] + 1.4} width="28" height="1.8" fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 420, 700) }} />
      {/* The margin note: a leader out of the line, then the note itself. */}
      <Draw d={`M46 ${lines[marked]}H58`} on={on} ms={220} delay={1050} stroke={ink} strokeWidth=".6" />
      <g className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "translateX(0)" : "translateX(-3px)", ...tr("opacity, transform", 360, 1200) }}>
        <rect x="58" y={lines[marked] - 7} width="16" height="14" fill={`url(#${hatch})`} stroke={ink} strokeWidth=".8" />
        <circle cx="58" cy={lines[marked]} r="1.2" fill={ink} />
      </g>
    </svg>
  );
}

/**
 * Long-term thinking. The time axis runs the width of the plate; the short
 * view is a sliver at its start; the compounding line needs the whole axis to
 * turn upward, and lands in orange at its far end.
 */
function LongGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 50;
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.55} />
      </defs>
      <line x1="6" x2="76" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".6" />
      {Array.from({ length: 11 }, (_, index) => (
        <line key={index} x1={8 + index * 6.4} x2={8 + index * 6.4} y1={base} y2={base + (index % 5 === 0 ? 3.4 : 2)} stroke={ink} strokeWidth=".5" strokeOpacity=".6" />
      ))}
      {/* The short view: a hatched sliver at the start. */}
      <rect x="8" y="40" width="7" height={base - 40} fill={`url(#${hatch})`} stroke={ink} strokeWidth=".5" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 320, 100) }} />
      {/* The long view: a dimension across the whole axis. */}
      <Draw d="M9 56H71" on={on} ms={700} delay={250} stroke={ink} strokeWidth=".6" />
      <path d="M11 54.4L8 56L11 57.6M69 54.4L72 56L69 57.6" fill="none" stroke={ink} strokeWidth=".6" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, 900) }} />
      <Draw d="M8 46C30 45 46 40 56 31S68 16 72 9" on={on} ms={1000} delay={450} ease="cubic-bezier(.45,0,.55,1)" stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="72" cy="9" r="3" fill={ORANGE} stroke={ink} strokeWidth=".6" className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 320, 1420) }} />
    </svg>
  );
}

/**
 * Ownership. Among many cells, one is still dashed, nobody's yet; a line runs
 * from one person to it, the cell is drawn in firmly, and it fills orange
 * from the bottom up.
 */
function OwnerGlyph({ on, ink = "#000" }: GlyphProps) {
  const clip = useId();
  const r = 8.6;
  const w = Math.sqrt(3) * r;
  const cells = Array.from({ length: 10 }, (_, index) => ({ x: 16 + (index % 5) * w + Math.floor(index / 5) * (w / 2), y: 20 + Math.floor(index / 5) * r * 1.5 }));
  const pick = cells[7];
  const person = [8, 52] as const;
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <polygon points={hexAttr(pick.x, pick.y, r - 1)} />
        </clipPath>
      </defs>
      {cells.map((cell, index) =>
        index === 7 ? null : <polygon key={index} points={hexAttr(cell.x, cell.y, r - 1)} fill="none" stroke={ink} strokeWidth=".6" strokeOpacity=".35" />,
      )}
      <polygon points={hexAttr(pick.x, pick.y, r - 1)} fill="none" stroke={ink} strokeWidth=".6" strokeDasharray="1.4 1.4" />
      <rect x={pick.x - r} y={pick.y - r} width={r * 2} height={r * 2} fill={ORANGE} clipPath={`url(#${clip})`} className={RM} style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 620, 950) }} />
      <Draw d={hexPath(pick.x, pick.y, r - 1)} on={on} ms={420} delay={650} stroke={ink} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx={person[0]} cy={person[1]} r="2.4" fill={ink} />
      <Draw d={`M${person[0] + 2} ${person[1] - 1.4}L${pick.x} ${pick.y + r - 1}`} on={on} ms={520} delay={120} stroke={ink} strokeWidth=".7" />
    </svg>
  );
}

/**
 * Learning together. Each step is hatched and stands on the one before; the
 * rise of each is ticked off; a dotted line climbs them, and the newest step
 * is the orange one.
 */
function LearnGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 52;
  const steps = [0, 1, 2, 3];
  const x = (step: number) => 10 + step * 15;
  const top = (step: number) => base - (step + 1) * 10;
  const climb = steps.map((step) => `${step ? "L" : "M"}${x(step)} ${top(step)}H${x(step) + 15}`).join("");
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.55} />
      </defs>
      <line x1="4" x2="76" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".6" />
      {steps.map((step) => (
        <g key={step}>
          <rect
            x={x(step)}
            y={top(step)}
            width="15"
            height={base - top(step)}
            fill={step === 3 ? ORANGE : `url(#${hatch})`}
            stroke={ink}
            strokeWidth=".8"
            className={RM}
            style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 520, step * 140 + (step === 3 ? 260 : 0)) }}
          />
          <line x1={x(step) - 2.4} x2={x(step)} y1={top(step)} y2={top(step)} stroke={ink} strokeWidth=".5" className={RM} style={{ opacity: on ? 0.8 : 0, ...tr("opacity", 200, step * 140 + 380) }} />
        </g>
      ))}
      <path d={climb} fill="none" stroke={ink} strokeWidth=".6" strokeDasharray="1 1.6" transform="translate(0 -3)" className={RM} style={{ opacity: on ? 0.9 : 0, ...tr("opacity", 400, 900) }} />
    </svg>
  );
}

export const CULTURE_GLYPHS = { research: ReadingGlyph, long: LongGlyph, owner: OwnerGlyph, learn: LearnGlyph } as const;
