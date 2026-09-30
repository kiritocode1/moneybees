"use client";

import { type ReactNode, useId } from "react";
import { BOX, Draw, Hatch, MOVE, ORANGE, OUT, RM, tr, type GlyphProps } from "@/components/drawing/plate";

/*
 * The drawings on /aif, in the engraved-plate language of
 * components/approach/glyphs.tsx: hairline construction at rest, the data
 * draws on when `on`, and orange lands last as the answer. The fund as one
 * cell fed by listed and unlisted companies; securities in your own demat
 * beside units of a pooled fund; and one drawing per key term.
 */

export { ORANGE };

export const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

const MONO = "var(--font-geist-mono)";

function Label({ x, y, ink = "#000", size = 5.4, anchor = "middle", opacity = 0.6, children }: { x: number; y: number; ink?: string; size?: number; anchor?: "start" | "middle" | "end"; opacity?: number; children: ReactNode }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={ink} opacity={opacity} letterSpacing=".12em" fontFamily={MONO}>
      {children}
    </text>
  );
}

const fade = (on: boolean, ms: number, delay: number) => ({ opacity: on ? 1 : 0, ...tr("opacity", ms, delay) });
const pop = (on: boolean, ms: number, delay: number, from = 0.8) => ({
  ...BOX,
  transformOrigin: "center",
  opacity: on ? 1 : 0,
  transform: on ? "scale(1)" : `scale(${from})`,
  ...tr("opacity, transform", ms, delay),
});

/** A centre cell and its six neighbours, pointy-top. */
function cluster(cx: number, cy: number, r: number) {
  const w = Math.sqrt(3) * r;
  return [
    [cx, cy],
    [cx + w, cy],
    [cx - w, cy],
    [cx + w / 2, cy - 1.5 * r],
    [cx - w / 2, cy - 1.5 * r],
    [cx + w / 2, cy + 1.5 * r],
    [cx - w / 2, cy + 1.5 * r],
  ] as const;
}

/**
 * The Flyingbee fund graphic. Both wings are laid out in hairline first; the
 * listed companies are engraved solid, the pre-IPO and unlisted ones stay
 * dashed (not yet on an exchange); feed lines draw in from both wings, and
 * the fund in the middle lands in orange with a steady trickle arriving.
 */
export function FundGraphic({ on }: { on: boolean }) {
  const hatch = useId();
  const ink = "#000";
  const r = 24;
  const cy = 160;
  const listed = cluster(104, cy, r);
  const unlisted = cluster(376, cy, r);
  const w = Math.sqrt(3) * r;
  const edgeL = 104 + w + r * 0.9;
  const edgeR = 376 - w - r * 0.9;
  const fund = 46;
  const ring = fund + 10;
  const base = 244;
  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={5.2} opacity={0.6} />
      </defs>
      <style>{`
        @keyframes aifv2-feed-l { 0% { transform: translateX(0); opacity: 0 } 15% { opacity: 1 } 80% { opacity: 1 } 100% { transform: translateX(${240 - ring - edgeL - 6}px); opacity: 0 } }
        @keyframes aifv2-feed-r { 0% { transform: translateX(0); opacity: 0 } 15% { opacity: 1 } 80% { opacity: 1 } 100% { transform: translateX(${-(edgeR - 240 - ring - 6)}px); opacity: 0 } }
      `}</style>

      {/* Construction: every cell and the fund in hairline, on one centre line. */}
      <line x1="16" x2="464" y1={cy} y2={cy} stroke={ink} strokeWidth=".8" strokeOpacity=".14" strokeDasharray="12 5 2 5" />
      {[...listed, ...unlisted].map(([x, y], index) => (
        <polygon key={index} points={hexPoints(x, y, r - 2)} fill="none" stroke={ink} strokeWidth=".9" strokeOpacity=".18" />
      ))}
      <polygon points={hexPoints(240, cy, fund)} fill="none" stroke={ink} strokeWidth=".9" strokeOpacity=".25" />

      {/* Listed: engraved and solid-edged. */}
      {listed.map(([x, y], index) => (
        <g key={`l${index}`} className={RM} style={pop(on, 460, 80 + index * 70, 0.86)}>
          <polygon points={hexPoints(x, y, r - 2)} fill={`url(#${hatch})`} stroke={ink} strokeWidth="1.6" />
        </g>
      ))}
      {/* Pre-IPO and unlisted: dashed, not yet on an exchange. */}
      {unlisted.map(([x, y], index) => (
        <g key={`u${index}`} className={RM} style={pop(on, 460, 320 + index * 70, 0.86)}>
          <polygon points={hexPoints(x, y, r - 2)} fill="#fff" stroke={ink} strokeWidth="1.6" strokeDasharray="5 3.4" />
        </g>
      ))}

      {/* Feed lines into the fund. */}
      <Draw d={`M${edgeL} ${cy}H${240 - ring - 1}`} on={on} ms={520} delay={820} ease={MOVE} stroke={ink} strokeWidth="1.4" />
      <Draw d={`M${edgeR} ${cy}H${240 + ring + 1}`} on={on} ms={520} delay={820} ease={MOVE} stroke={ink} strokeWidth="1.4" />
      <g className={RM} style={fade(on, 240, 1260)}>
        <path d={`M${240 - ring - 9} ${cy - 5}L${240 - ring - 1} ${cy}L${240 - ring - 9} ${cy + 5}M${240 + ring + 9} ${cy - 5}L${240 + ring + 1} ${cy}L${240 + ring + 9} ${cy + 5}`} fill="none" stroke={ink} strokeWidth="1.4" />
      </g>
      {on && (
        <g className="motion-reduce:hidden">
          <polygon points={hexPoints(edgeL, cy, 4)} fill={ORANGE} stroke={ink} strokeWidth=".8" className="animate-[aifv2-feed-l_2.6s_cubic-bezier(.77,0,.175,1)_1.8s_infinite] motion-reduce:hidden" style={{ opacity: 0 }} />
          <polygon points={hexPoints(edgeR, cy, 4)} fill={ORANGE} stroke={ink} strokeWidth=".8" className="animate-[aifv2-feed-r_2.6s_cubic-bezier(.77,0,.175,1)_3.1s_infinite] motion-reduce:hidden" style={{ opacity: 0 }} />
        </g>
      )}

      {/* The fund. */}
      <Draw d={`M${240 - ring} ${cy}a${ring} ${ring} 0 1 0 ${2 * ring} 0a${ring} ${ring} 0 1 0 ${-2 * ring} 0`} on={on} ms={700} delay={1000} stroke={ink} strokeWidth=".8" strokeOpacity=".5" />
      <polygon points={hexPoints(240, cy, fund)} fill={ORANGE} stroke={ink} strokeWidth="1.6" className={RM} style={pop(on, 520, 1320, 0.86)} />
      <g className={RM} style={fade(on, 300, 1520)}>
        <Label x={240} y={cy - 2} size={10} opacity={1}>
          FLYINGBEE
        </Label>
        <Label x={240} y={cy + 13} size={7.5} opacity={0.75}>
          CAT III AIF
        </Label>
      </g>

      {/* The two wings, bracketed and named. */}
      {[
        { x0: 104 - w - r * 0.9, x1: edgeL, label: "LISTED", delay: 520 },
        { x0: edgeR, x1: 376 + w + r * 0.9, label: "PRE-IPO / UNLISTED", delay: 760 },
      ].map(({ x0, x1, label, delay }) => (
        <g key={label}>
          <Draw d={`M${x0} ${base - 8}V${base}H${x1}V${base - 8}`} on={on} ms={460} delay={delay} stroke={ink} strokeWidth="1" strokeOpacity=".7" />
          <Draw d={`M${(x0 + x1) / 2} ${base}V${base + 8}`} on={on} ms={180} delay={delay + 380} stroke={ink} strokeWidth="1" strokeOpacity=".7" />
          <g className={RM} style={fade(on, 260, delay + 460)}>
            <Label x={(x0 + x1) / 2} y={base + 24} size={9} opacity={0.7}>
              {label}
            </Label>
          </g>
        </g>
      ))}
    </svg>
  );
}

const INVESTORS = [50, 120, 190] as const;

/** An investor, drawn as a hairline bust. */
function Investor({ x, y, ink = "#000" }: { x: number; y: number; ink?: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 6} r="5.6" fill="#fff" stroke={ink} strokeWidth="1" />
      <path d={`M${x - 11} ${y + 12}a11 10 0 0 1 22 0`} fill="#fff" stroke={ink} strokeWidth="1" />
      <line x1={x - 13} x2={x + 13} y1={y + 12} y2={y + 12} stroke={ink} strokeWidth="1" />
    </g>
  );
}

/**
 * PMS. Each investor's line runs to that investor's own demat account; the
 * securities drop into it, engraved; and each account is tagged in orange
 * with its owner's name: the holdings are yours, directly.
 */
export function PmsHoldingGlyph({ on }: { on: boolean }) {
  const hatch = useId();
  const ink = "#000";
  return (
    <svg viewBox="0 0 240 190" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.6} opacity={0.75} />
      </defs>
      {INVESTORS.map((x, column) => (
        <g key={x}>
          <Investor x={x} y={30} />
          <Draw d={`M${x} 46V92`} on={on} ms={420} delay={column * 160} stroke={ink} strokeWidth="1" />
          <g className={RM} style={fade(on, 200, 360 + column * 160)}>
            <path d={`M${x - 3} 87L${x} 92L${x + 3} 87`} fill="none" stroke={ink} strokeWidth="1" />
          </g>
          {/* The account: its own box, one per investor. */}
          <rect x={x - 28} y="94" width="56" height="58" fill="none" stroke={ink} strokeWidth="1.2" />
          <line x1={x - 28} x2={x + 28} y1="104" y2="104" stroke={ink} strokeWidth=".6" strokeOpacity=".4" />
          {[0, 1, 2].map((tile) => (
            <rect
              key={tile}
              x={x - 20 + tile * 14}
              y="126"
              width="10"
              height="20"
              fill={`url(#${hatch})`}
              stroke={ink}
              strokeWidth=".8"
              className={RM}
              style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(-14px)", ...tr("opacity, transform", 420, 500 + column * 160 + tile * 80) }}
            />
          ))}
          {/* In your name: the orange tag on the account. */}
          <rect x={x - 28} y="94" width="56" height="10" fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 420, 1200 + column * 110) }} />
          <line x1={x - 28} x2={x + 28} y1="104" y2="104" stroke={ink} strokeWidth=".8" />
          <Label x={x} y={170} size={7} opacity={0.6}>
            YOUR DEMAT
          </Label>
        </g>
      ))}
    </svg>
  );
}

/**
 * AIF. The same investors' lines converge on one pooled fund, which holds the
 * securities itself; then units of the fund, in orange, travel back up and
 * come to rest beside each investor.
 */
export function AifUnitsGlyph({ on }: { on: boolean }) {
  const hatch = useId();
  const ink = "#000";
  const pool = { x: 120, y: 126, r: 34 };
  return (
    <svg viewBox="0 0 240 190" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.6} opacity={0.75} />
      </defs>
      {INVESTORS.map((x, index) => (
        <g key={x}>
          <Investor x={x} y={30} />
          <Draw d={`M${x} 46L${pool.x + (x - pool.x) * 0.2} ${pool.y - pool.r + 4}`} on={on} ms={520} delay={index * 140} ease={MOVE} stroke={ink} strokeWidth="1" />
        </g>
      ))}
      {/* The pool: outline at rest; the securities sit inside it, held by the fund. */}
      <polygon points={hexPoints(pool.x, pool.y, pool.r)} fill="#fff" stroke={ink} strokeWidth="1.2" />
      <polygon points={hexPoints(pool.x, pool.y, pool.r - 5)} fill="none" stroke={ink} strokeWidth=".5" strokeOpacity=".4" />
      {[0, 1, 2, 3, 4, 5].map((tile) => (
        <rect
          key={tile}
          x={106 + (tile % 3) * 10}
          y={114 + Math.floor(tile / 3) * 13}
          width="7"
          height="10"
          fill={`url(#${hatch})`}
          stroke={ink}
          strokeWidth=".7"
          className={RM}
          style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(-8px)", ...tr("opacity, transform", 380, 560 + tile * 60) }}
        />
      ))}
      {/* Units travel back up to each investor: across on one curve, up on another, so they arc. */}
      {INVESTORS.map((x, index) => {
        const tx = x + 20;
        const ty = 34;
        const delay = 1000 + index * 130;
        return (
          <g key={x} className={RM} style={{ transform: `translateX(${on ? tx : pool.x}px)`, opacity: on ? 1 : 0, ...tr("transform, opacity", 760, delay, MOVE) }}>
            <g className={RM} style={{ transform: `translateY(${on ? ty : pool.y - 10}px)`, ...tr("transform", 760, delay, OUT) }}>
              <polygon points={hexPoints(0, 0, 5.4)} fill={ORANGE} stroke={ink} strokeWidth=".8" />
            </g>
          </g>
        );
      })}
      <g className={RM} style={fade(on, 260, 1800)}>
        <Label x={210} y={56} size={6.4} opacity={0.6}>
          UNITS
        </Label>
      </g>
      <Label x={120} y={180} size={7} opacity={0.6}>
        ONE POOLED FUND
      </Label>
    </svg>
  );
}

/**
 * Minimum investment. A dashed line marks Rs. 1 crore; a commitment rises
 * from the baseline to meet it, measured from the side, and the orange cap
 * lands where it clears the line.
 */
function MinimumGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 80;
  const line = 24;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} opacity={0.55} />
      </defs>
      <line x1="8" x2="146" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {Array.from({ length: 14 }, (_, tick) => (
        <line key={tick} x1={10 + tick * 10} x2={10 + tick * 10} y1={base} y2={base + 2.4} stroke={ink} strokeWidth=".45" strokeOpacity=".4" />
      ))}
      <line x1="8" x2="146" y1={line} y2={line} stroke={ink} strokeWidth=".7" strokeDasharray="2.4 1.8" strokeOpacity=".75" />
      <Label x={146} y={line - 4} anchor="end">
        RS. 1 CR
      </Label>
      {/* The commitment rises and meets the line. */}
      <g className={RM} style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0.06)", ...tr("transform", 820, 120, MOVE) }}>
        <rect x="64" y={line} width="26" height={base - line} fill={`url(#${hatch})`} stroke={ink} strokeWidth=".9" />
      </g>
      <rect x="62" y={line - 1.8} width="30" height="3.6" fill={ORANGE} stroke={ink} strokeWidth=".6" className={RM} style={pop(on, 320, 980, 0.6)} />
      {/* Its dimension, from the baseline up. */}
      <Draw d={`M50 ${base - 0.5}V${line + 0.5}`} on={on} ms={520} delay={400} stroke={ink} strokeWidth=".7" />
      <g className={RM} style={fade(on, 220, 880)}>
        <path d={`M47.8 ${line + 3.6}L50 ${line}L52.2 ${line + 3.6}M47.8 ${base - 3.6}L50 ${base}L52.2 ${base - 3.6}`} fill="none" stroke={ink} strokeWidth=".7" />
      </g>
    </svg>
  );
}

/**
 * Time frame. A five-year axis; the first three years hatched as too short;
 * the stretch from three to five sweeps in orange, and a dimension above it
 * measures the span.
 */
function HorizonGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const x = (year: number) => 14 + year * 24.4;
  const axis = 52;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.4} />
      </defs>
      <rect x={x(0)} y={axis - 6} width={x(3) - x(0)} height="12" fill={`url(#${hatch})`} className={RM} style={fade(on, 420, 200)} />
      <line x1={x(0)} x2={x(5)} y1={axis} y2={axis} stroke={ink} strokeWidth=".8" strokeOpacity=".6" />
      {[0, 1, 2, 3, 4, 5].map((year) => (
        <g key={year}>
          <line x1={x(year)} x2={x(year)} y1={axis - 5} y2={axis + 5} stroke={ink} strokeWidth={year >= 3 ? 0.8 : 0.5} strokeOpacity={year >= 3 ? 0.9 : 0.45} />
          <Label x={x(year)} y={axis + 16} opacity={year >= 3 ? 0.85 : 0.45}>
            {year}
          </Label>
        </g>
      ))}
      <rect x={x(3)} y={axis - 6} width={x(5) - x(3)} height="12" fill={ORANGE} stroke={ink} strokeWidth=".6" className={RM} style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 760, 520, MOVE) }} />
      {/* The span, measured. */}
      <Draw d={`M${x(3)} ${axis - 8}V${axis - 26}M${x(5)} ${axis - 8}V${axis - 26}`} on={on} ms={300} delay={1100} stroke={ink} strokeWidth=".45" strokeOpacity=".6" />
      <Draw d={`M${x(3) + 0.5} ${axis - 22}H${x(5) - 0.5}`} on={on} ms={380} delay={1250} stroke={ink} strokeWidth=".7" />
      <g className={RM} style={fade(on, 220, 1550)}>
        <path d={`M${x(3) + 3.6} ${axis - 24.2}L${x(3)} ${axis - 22}L${x(3) + 3.6} ${axis - 19.8}M${x(5) - 3.6} ${axis - 24.2}L${x(5)} ${axis - 22}L${x(5) - 3.6} ${axis - 19.8}`} fill="none" stroke={ink} strokeWidth=".7" />
      </g>
      <Label x={x(0)} y={axis - 20} anchor="start" opacity={0.5}>
        YEARS
      </Label>
    </svg>
  );
}

/**
 * Investment in. A company's life runs left to right, cut by the listing: on
 * one side the pre-IPO and unlisted names, dashed; on the other the listed
 * ones, engraved. The fund's reach, in orange, spans the cut.
 */
function UniverseGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const cut = 76;
  const axis = 44;
  const early: [number, number][] = [
    [20, 34], [32, 52], [44, 30], [52, 50], [64, 38],
  ];
  const later: [number, number][] = [
    [88, 30], [98, 50], [112, 36], [124, 52], [136, 32],
  ];
  const reach = 74;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2} opacity={0.7} />
      </defs>
      <line x1="8" x2="146" y1={axis} y2={axis} stroke={ink} strokeWidth=".5" strokeOpacity=".35" />
      <path d="M142 41.6L146 44L142 46.4" fill="none" stroke={ink} strokeWidth=".5" strokeOpacity=".5" />
      <line x1={cut} x2={cut} y1="14" y2={reach - 6} stroke={ink} strokeWidth=".7" strokeDasharray="2 1.6" />
      <Label x={cut} y={10}>
        IPO
      </Label>
      {early.map(([x, y], index) => (
        <polygon key={x} points={hexPoints(x, y, 5.4)} fill="#fff" stroke={ink} strokeWidth=".8" strokeDasharray="1.6 1.2" className={RM} style={pop(on, 360, 100 + index * 70)} />
      ))}
      {later.map(([x, y], index) => (
        <polygon key={x} points={hexPoints(x, y, 5.4)} fill={`url(#${hatch})`} stroke={ink} strokeWidth=".8" className={RM} style={pop(on, 360, 480 + index * 70)} />
      ))}
      {/* The reach: spreads out from the cut to both ends. */}
      <Draw d={`M14 ${reach - 5}V${reach + 3}M138 ${reach - 5}V${reach + 3}`} on={on} ms={260} delay={920} stroke={ink} strokeWidth=".5" strokeOpacity=".6" />
      <rect x="14" y={reach - 2} width="124" height="4" fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "center", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 700, 1060, MOVE) }} />
      <Label x={45} y={86}>
        UNLISTED
      </Label>
      <Label x={107} y={86}>
        LISTED
      </Label>
    </svg>
  );
}

/**
 * Benchmark. The index draws across a gridded field as the yardstick; its
 * area settles in beneath it, and the reading at the end is carried across
 * to the scale and marked in orange.
 */
function BenchmarkGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const points: [number, number][] = [
    [10, 64], [22, 58], [34, 62], [46, 50], [58, 54], [70, 44], [82, 48], [94, 36], [106, 40], [118, 30], [130, 32], [138, 24],
  ];
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join("");
  const base = 76;
  const [ex, ey] = points[points.length - 1];
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.4} angle={-45} opacity={0.35} />
      </defs>
      {[24, 40, 56].map((y) => (
        <line key={y} x1="10" x2="138" y1={y} y2={y} stroke={ink} strokeWidth=".4" strokeOpacity=".18" />
      ))}
      <line x1="10" x2="138" y1={base} y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {Array.from({ length: 12 }, (_, tick) => (
        <line key={tick} x1={10 + tick * 11.6} x2={10 + tick * 11.6} y1={base} y2={tick % 4 === 0 ? base + 4 : base + 2.4} stroke={ink} strokeWidth=".45" strokeOpacity=".45" />
      ))}
      {/* The scale on the right. */}
      <line x1="144" x2="144" y1="14" y2={base} stroke={ink} strokeWidth=".6" strokeOpacity=".45" />
      {Array.from({ length: 8 }, (_, tick) => (
        <line key={tick} x1="144" x2={tick % 2 ? 146 : 147.5} y1={base - tick * 8.4} y2={base - tick * 8.4} stroke={ink} strokeWidth=".45" strokeOpacity=".45" />
      ))}
      <path d={`${line}L${ex} ${base}L10 ${base}Z`} fill={`url(#${hatch})`} className={RM} style={fade(on, 500, 900)} />
      <Draw d={line} on={on} ms={1100} delay={100} ease="linear" stroke={ink} strokeWidth="1.1" strokeLinejoin="round" />
      <Draw d={`M${ex + 3} ${ey}H144`} on={on} ms={200} delay={1260} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
      <g className={RM} style={fade(on, 220, 1420)}>
        <path d={`M140.4 ${ey - 2.2}L144 ${ey}L140.4 ${ey + 2.2}`} fill="none" stroke={ink} strokeWidth=".6" />
      </g>
      <circle cx={ex} cy={ey} r="3" fill={ORANGE} stroke={ink} strokeWidth=".7" className={RM} style={pop(on, 300, 1180, 0.6)} />
      <Label x={10} y={16} anchor="start" opacity={0.5}>
        INDEX
      </Label>
    </svg>
  );
}

/**
 * Exit load. The barrier on the way out lifts; the holding travels through
 * the gate, and a dimension over it on each side shows it leaves the same
 * size it came in: nothing is taken at the gate.
 */
function ExitGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const ground = 72;
  const cy = 60;
  const r = 9;
  const from = 26;
  const to = 124;
  const gate = 74;
  const span = (x: number) => `M${x - r * 0.87 + 0.5} 44H${x + r * 0.87 - 0.5}`;
  const heads = (x: number) => `M${x - r * 0.87 + 3.2} 42L${x - r * 0.87} 44L${x - r * 0.87 + 3.2} 46M${x + r * 0.87 - 3.2} 42L${x + r * 0.87} 44L${x + r * 0.87 - 3.2} 46`;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.45} />
      </defs>
      <rect x="8" y={ground} width="138" height="6" fill={`url(#${hatch})`} />
      <line x1="8" x2="146" y1={ground} y2={ground} stroke={ink} strokeWidth=".7" strokeOpacity=".7" />
      {/* Where it enters: a dashed ghost and its width. */}
      <polygon points={hexPoints(from, cy, r)} fill="none" stroke={ink} strokeWidth=".6" strokeDasharray="1.4 1.2" strokeOpacity=".7" />
      <path d={span(from)} stroke={ink} strokeWidth=".6" />
      <path d={heads(from)} fill="none" stroke={ink} strokeWidth=".6" />
      {/* The gate. */}
      <rect x={gate - 2.5} y="40" width="5" height={ground - 40} fill={`url(#${hatch})`} stroke={ink} strokeWidth=".8" />
      <g className={RM} style={{ transformOrigin: `${gate}px 42px`, transform: on ? "rotate(-72deg)" : "rotate(0deg)", ...tr("transform", 620, 80, MOVE) }}>
        <rect x={gate} y="40.5" width="42" height="3" fill="#fff" stroke={ink} strokeWidth=".7" />
        {[0, 1, 2, 3].map((stripe) => (
          <rect key={stripe} x={gate + 6 + stripe * 9} y="40.5" width="4.5" height="3" fill={ink} />
        ))}
      </g>
      <circle cx={gate} cy="42" r="2.6" fill="#fff" stroke={ink} strokeWidth=".8" />
      {/* The holding goes through. */}
      <g className={RM} style={{ opacity: on ? 1 : 0, transform: on ? `translateX(${to - from}px)` : "translateX(0)", ...tr("transform", 1000, 520, MOVE), transitionProperty: "transform, opacity" }}>
        <polygon points={hexPoints(from, cy, r)} fill={ORANGE} stroke={ink} strokeWidth=".8" />
      </g>
      {/* Where it leaves: the same width. */}
      <Draw d={span(to)} on={on} ms={300} delay={1500} stroke={ink} strokeWidth=".6" />
      <g className={RM} style={fade(on, 220, 1700)}>
        <path d={heads(to)} fill="none" stroke={ink} strokeWidth=".6" />
      </g>
      <Label x={from} y={87}>
        IN
      </Label>
      <Label x={to} y={87}>
        OUT
      </Label>
    </svg>
  );
}

export const TERM_GLYPHS = {
  minimum: MinimumGlyph,
  horizon: HorizonGlyph,
  universe: UniverseGlyph,
  benchmark: BenchmarkGlyph,
  exit: ExitGlyph,
} as const;
