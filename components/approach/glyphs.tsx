"use client";

import { useId } from "react";
import { BOX, Draw, Hatch, MOVE, ORANGE, OUT, RM, tr, type GlyphProps } from "@/components/drawing/plate";

export { ORANGE };

/*
 * The small explainer drawings on /our-approach (and the /pms risk rows). Each
 * one draws what its label means rather than decorating it.
 *
 * One drawing language for the set, after an engraved technical plate:
 * hairline construction lines draw on first, hatching stands in for flat grey,
 * dimension lines and tick-marked axes carry the measure, and orange arrives
 * last as the answer. `on` plays a drawing from its resting state (the
 * construction only) through to its explained state, in a short sequence.
 * Reduced motion jumps straight to the explained state.
 */

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/**
 * Undiscovered. The crowd's names are hatched, watched from every side; a
 * reticle leaves them, crosses to the quiet corner of the field and locks on
 * one unmarked cell, which turns orange.
 */
export function FoundGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const r = 10.4;
  const w = Math.sqrt(3) * r;
  const cells = Array.from({ length: 7 * 5 }, (_, index) => {
    const row = Math.floor(index / 7);
    const col = index % 7;
    return { x: 18 + col * w + (row % 2) * (w / 2), y: 13 + row * r * 1.5, row, col, index };
  });
  // The crowd sits top left, where everyone is already looking.
  const crowded = new Set([0, 1, 2, 7, 8, 9, 14, 15, 21]);
  const found = cells[26];
  const start = cells[8];
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} />
      </defs>
      {cells.map((cell) => (
        <polygon
          key={cell.index}
          points={hexPoints(cell.x, cell.y, r - 1.6)}
          fill={crowded.has(cell.index) ? `url(#${hatch})` : "none"}
          stroke={ink}
          strokeWidth=".6"
          strokeOpacity={crowded.has(cell.index) ? 0.55 : 0.22}
        />
      ))}
      {/* The find: fills after the reticle lands. */}
      <polygon
        points={hexPoints(found.x, found.y, r - 1.6)}
        fill={ORANGE}
        className={RM}
        style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.82)", ...tr("opacity, transform", 420, 1080) }}
      />
      {/* The reticle travels on two axes with different curves, so its path bends instead of running straight. */}
      <g className={RM} style={{ transform: `translateX(${on ? found.x : start.x}px)`, ...tr("transform", 1000, 80, MOVE) }}>
        <g className={RM} style={{ transform: `translateY(${on ? found.y : start.y}px)`, ...tr("transform", 1000, 80, OUT) }}>
          <circle r={on ? 12.5 : 15} fill="none" stroke={ink} strokeWidth=".9" className={RM} style={tr("r", 380, 1000)} />
          <circle r="16.5" fill="none" stroke={ink} strokeWidth=".5" strokeDasharray="1.2 2.2" strokeOpacity=".7" />
          {[0, 90, 180, 270].map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <line x1="0" y1="-13" x2="0" y2="-19" stroke={ink} strokeWidth=".9" className={RM} style={{ transform: on ? "translateY(3px)" : "translateY(0)", ...tr("transform", 380, 1000) }} />
            </g>
          ))}
          <circle r="1.1" fill={ink} />
        </g>
      </g>
    </svg>
  );
}

/** A report page seen face on, folded corner and a few lines of text. */
function Page({ x, y, ink, fill, lines = 3 }: { x: number; y: number; ink: string; fill: string; lines?: number }) {
  const w = 30;
  const h = 38;
  const fold = 6;
  return (
    <g>
      <path d={`M${x} ${y}h${w - fold}l${fold} ${fold}v${h - fold}h${-w}Z`} fill={fill} stroke={ink} strokeWidth=".7" />
      <path d={`M${x + w - fold} ${y}v${fold}h${fold}`} fill="none" stroke={ink} strokeWidth=".6" />
      {Array.from({ length: lines }, (_, line) => (
        <line key={line} x1={x + 5} x2={x + (line === lines - 1 ? 16 : 23)} y1={y + 14 + line * 5} y2={y + 14 + line * 5} stroke={ink} strokeWidth=".6" strokeOpacity=".6" />
      ))}
    </g>
  );
}

/**
 * Under-researched. On the crowded name the reports pile up, dropped one on
 * another; on ours there is a single note, our own, with its orange edge.
 */
export function CoverageGlyph({ on, ink = "#000" }: GlyphProps) {
  const pages = 7;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1="8" x2="146" y1="78" y2="78" stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {Array.from({ length: pages }, (_, index) => {
        const x = 12 + index * 4;
        const y = 34 - index * 3;
        return (
          <g
            key={index}
            className={RM}
            style={{ opacity: on ? 1 : index === 0 ? 1 : 0, transform: on || index === 0 ? "translateY(0)" : "translateY(-7px)", ...tr("opacity, transform", 360, 120 + index * 90) }}
          >
            <Page x={x} y={y + 6} ink={ink} fill="#fff" />
          </g>
        );
      })}
      <g className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(-7px)", ...tr("opacity, transform", 420, 120 + pages * 90 + 180) }}>
        <Page x={104} y={40} ink={ink} fill="#fff" lines={3} />
        <rect x="104" y="40" width="2.6" height="38" fill={ORANGE} />
      </g>
      <text x="36" y="87" textAnchor="middle" fontSize="5.6" fill={ink} opacity=".6" letterSpacing=".12em" fontFamily="var(--font-geist-mono)">
        CROWDED
      </text>
      <text x="119" y="87" textAnchor="middle" fontSize="5.6" fill={ink} opacity=".6" letterSpacing=".12em" fontFamily="var(--font-geist-mono)">
        OURS
      </text>
    </svg>
  );
}

/**
 * Under-estimated. The value is drawn as an engraved column; the price rises in
 * orange and stops short; a dimension line measures the gap between them.
 */
export function GapGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 74;
  const value = 12;
  const price = 42;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} opacity={0.45} />
      </defs>
      <line x1="8" x2="146" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {/* Value: outline draws on, hatching settles in behind it. */}
      <rect x="26" y={value} width="34" height={base - value} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 500, 380) }} />
      <Draw d={`M26 ${base}V${value}H60V${base}`} on={on} ms={620} stroke={ink} strokeWidth="1" />
      {/* Price: grows from the baseline and stops below the value. */}
      <rect
        x="84"
        y={price}
        width="34"
        height={base - price}
        fill={ORANGE}
        className={RM}
        style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0.04)", ...tr("transform", 700, 520) }}
      />
      {/* Extension lines and the dimension between the two tops. */}
      <Draw d={`M60 ${value}H136`} on={on} ms={420} delay={1150} stroke={ink} strokeWidth=".5" strokeDasharray="1.5 1.8" strokeOpacity=".7" />
      <Draw d={`M118 ${price}H136`} on={on} ms={300} delay={1150} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
      <Draw d={`M131 ${value + 1}V${price - 1}`} on={on} ms={380} delay={1450} stroke={ink} strokeWidth=".8" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 1750) }}>
        <path d={`M128.6 ${value + 4}L131 ${value}L133.4 ${value + 4}M128.6 ${price - 4}L131 ${price}L133.4 ${price - 4}`} fill="none" stroke={ink} strokeWidth=".8" />
        <text x="137.5" y={(value + price) / 2 + 2} fontSize="5.4" fill={ink} letterSpacing=".1em" fontFamily="var(--font-geist-mono)" transform={`rotate(90 137.5 ${(value + price) / 2})`} textAnchor="middle">
          MARGIN
        </text>
      </g>
      <text x="43" y="84" textAnchor="middle" fontSize="5.6" fill={ink} opacity=".6" letterSpacing=".12em" fontFamily="var(--font-geist-mono)">
        VALUE
      </text>
      <text x="101" y="84" textAnchor="middle" fontSize="5.6" fill={ink} opacity=".6" letterSpacing=".12em" fontFamily="var(--font-geist-mono)">
        PRICE
      </text>
    </svg>
  );
}

/**
 * Liquidity. Each day's volume rises as a hatched bar; the size we would need
 * to trade draws across as a dashed line; the part of every bar that clears it
 * turns orange, so the reader sees there is room to get in and out every day.
 */
export function LiquidityGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const clear = useId();
  const base = 76;
  const need = 50;
  const bars = [34, 46, 38, 54, 42, 50, 36, 48, 40, 52];
  const step = 12.6;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
        <clipPath id={clear}>
          <rect x="0" y="0" width="150" height={need} />
        </clipPath>
      </defs>
      {/* Day ticks on the time axis. */}
      <line x1="8" x2="146" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {bars.map((_, index) => (
        <line key={index} x1={17 + index * step} x2={17 + index * step} y1={base} y2={base + 2.6} stroke={ink} strokeWidth=".5" strokeOpacity=".45" />
      ))}
      {bars.map((height, index) => (
        <rect
          key={index}
          x={13 + index * step}
          y={base - height}
          width="8"
          height={height}
          fill={`url(#${hatch})`}
          stroke={ink}
          strokeWidth=".6"
          className={RM}
          style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 520, index * 55) }}
        />
      ))}
      <Draw d={`M8 ${need}H146`} on={on} ms={700} delay={620} stroke={ink} strokeWidth=".8" strokeDasharray="2.4 1.8" />
      <g clipPath={`url(#${clear})`}>
        {bars.map((height, index) => (
          <rect
            key={index}
            x={13 + index * step}
            y={base - height}
            width="8"
            height={height}
            fill={ORANGE}
            className={RM}
            style={{ opacity: on ? 1 : 0, ...tr("opacity", 300, 1200 + index * 50) }}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Valuation. What the business is worth runs as a hatched band; the price
 * wanders above and below it; we only buy where the price has dropped under
 * the band, and those are the orange marks, placed as the line reaches them.
 */
export function ValuationGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const top = 36;
  const bottom = 48;
  const points: [number, number][] = [
    [8, 40], [18, 30], [28, 42], [38, 58], [46, 52], [56, 28], [66, 22], [76, 36],
    [86, 62], [94, 55], [104, 34], [114, 26], [124, 40], [134, 60], [146, 46],
  ];
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join("");
  const draw = 1300;
  const span = points[points.length - 1][0] - points[0][0];
  // Only the local lows under the band: the moments the price was furthest below value.
  const buys = points.filter(([, y], index) => y > bottom + 6 && y >= (points[index - 1]?.[1] ?? 0) && y >= (points[index + 1]?.[1] ?? 0));
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} angle={-45} opacity={0.4} />
      </defs>
      <rect x="8" y={top} width="138" height={bottom - top} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0.5, ...tr("opacity", 400) }} />
      <line x1="8" x2="146" y1={top} y2={top} stroke={ink} strokeWidth=".5" strokeOpacity=".5" />
      <line x1="8" x2="146" y1={bottom} y2={bottom} stroke={ink} strokeWidth=".5" strokeOpacity=".5" />
      <text x="146" y={top - 3} textAnchor="end" fontSize="5.4" fill={ink} opacity=".6" letterSpacing=".12em" fontFamily="var(--font-geist-mono)">
        VALUE
      </text>
      <Draw d={line} on={on} ms={draw} delay={200} ease="linear" stroke={ink} strokeWidth="1" strokeLinejoin="round" />
      {buys.map(([x, y]) => (
        <g key={x} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, 200 + ((x - points[0][0]) / span) * draw) }}>
          <line x1={x} x2={x} y1={bottom} y2={y - 4} stroke={ORANGE} strokeWidth=".8" />
          <circle cx={x} cy={y} r="3.2" fill={ORANGE} stroke={ink} strokeWidth=".6" />
        </g>
      ))}
      <line x1="8" x2="146" y1="80" y2="80" stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
    </svg>
  );
}

/**
 * Market. The price is a jagged line that swings the whole way; the holding
 * line runs straight through it at an even pace, from the buy to where we are
 * still holding.
 */
export function MarketGlyph({ on, ink = "#000" }: GlyphProps) {
  const points: [number, number][] = [
    [10, 56], [17, 44], [23, 50], [30, 30], [37, 40], [44, 62], [51, 54], [58, 70], [66, 44],
    [73, 50], [80, 24], [88, 36], [95, 58], [102, 48], [110, 66], [118, 38], [125, 46], [133, 22], [140, 34], [146, 30],
  ];
  const wave = points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join("");
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1="8" x2="146" y1="80" y2="80" stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {Array.from({ length: 7 }, (_, index) => (
        <line key={index} x1={10 + index * 22.6} x2={10 + index * 22.6} y1="80" y2="83" stroke={ink} strokeWidth=".5" strokeOpacity=".45" />
      ))}
      <Draw d={wave} on={on} ms={1200} ease={MOVE} stroke={ink} strokeOpacity=".55" strokeWidth=".9" strokeLinejoin="round" />
      <Draw d="M10 56 L146 36" on={on} ms={1200} ease="linear" stroke={ORANGE} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="10" cy="56" r="2.6" fill="#fff" stroke={ink} strokeWidth=".8" />
      <circle cx="146" cy="36" r="3.2" fill={ORANGE} stroke={ink} strokeWidth=".7" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 1180) }} />
    </svg>
  );
}

/**
 * Concentration. The portfolio fills a ring slice by slice; a bracket outside
 * the ring marks the most any one holding may take, and the largest slice,
 * in orange, runs right up to it and no further.
 */
export function ConcentrationGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const slices = [22, 20, 18, 15, 13, 12];
  const cap = 22;
  const cx = 75;
  const cy = 44;
  const r = 26;
  const gap = 0.9;
  let start = 0;
  // A point on the ring's outside, `share` percent round from twelve o'clock.
  const at = (share: number, radius: number) => {
    const angle = (share / 100) * Math.PI * 2 - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)] as const;
  };
  const [bx0, by0] = at(0, r + 11);
  const [bx1, by1] = at(cap, r + 11);
  const [tx0, ty0] = at(0, r + 8);
  const [tx0b, ty0b] = at(0, r + 14);
  const [tx1, ty1] = at(cap, r + 8);
  const [tx1b, ty1b] = at(cap, r + 14);
  const [lx, ly] = at(cap / 2, r + 19);
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.7} />
      </defs>
      <circle cx={cx} cy={cy} r={r + 6.5} fill="none" stroke={ink} strokeWidth=".4" strokeOpacity=".35" />
      <circle cx={cx} cy={cy} r={r - 6.5} fill="none" stroke={ink} strokeWidth=".4" strokeOpacity=".35" />
      {slices.map((share, index) => {
        const offset = start;
        start += share;
        const stroke = index === 0 ? ORANGE : index % 2 ? ink : `url(#${hatch})`;
        return (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r={r}
            pathLength={100}
            fill="none"
            stroke={stroke}
            strokeWidth="12"
            strokeDasharray={`${on ? share - gap : 0} 100`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            className={RM}
            style={tr("stroke-dasharray", 460, 150 + index * 130)}
          />
        );
      })}
      {/* The cap: drawn first, so the orange slice visibly fills up to it. */}
      <Draw d={`M${bx0} ${by0}A${r + 11} ${r + 11} 0 0 1 ${bx1} ${by1}`} on={on} ms={420} stroke={ink} strokeWidth=".8" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 300) }}>
        <path d={`M${tx0} ${ty0}L${tx0b} ${ty0b}M${tx1} ${ty1}L${tx1b} ${ty1b}`} stroke={ink} strokeWidth=".8" />
        <text x={lx} y={ly} fontSize="5.4" fill={ink} letterSpacing=".12em" fontFamily="var(--font-geist-mono)" textAnchor="start">
          CAP
        </text>
      </g>
    </svg>
  );
}

export const RISK_GLYPHS = {
  liquidity: LiquidityGlyph,
  valuation: ValuationGlyph,
  market: MarketGlyph,
  concentration: ConcentrationGlyph,
} as const;

export const STAGE_GLYPHS = { found: FoundGlyph, coverage: CoverageGlyph, gap: GapGlyph } as const;
