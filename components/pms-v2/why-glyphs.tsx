import type { JSX } from "react";
import type { WhyGlyph } from "@/lib/pms-v2";
import { hexPoints, ORANGE, T } from "./shared";

/*
 * One drawing per "Why Moneybee PMS?" point. `on` switches each from its
 * resting state to the state that shows what the point means.
 */

type GlyphProps = { on: boolean };
const FAINT = "rgba(0,0,0,.12)";
const LINE = "rgba(0,0,0,.3)";

/** Fundamental research: a lens moves over a report and finds the line that matters. */
function ResearchGlyph({ on }: GlyphProps) {
  const lines = [20, 32, 44, 56, 68];
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <rect x="22" y="8" width="70" height="76" fill="#fff" stroke={LINE} />
      {lines.map((y, index) => (
        <rect key={y} x="32" y={y} width={index === 2 ? 44 : 50 - index * 4} height="4" fill={index === 2 && on ? ORANGE : FAINT} className={T} style={{ transitionDelay: "300ms" }} />
      ))}
      <g className={T} style={{ transform: on ? "translate(0px, 0px)" : "translate(40px, -24px)" }}>
        <circle cx="64" cy="46" r="17" fill="none" stroke="#000" strokeWidth="2" />
        <path d="M76 58 94 76" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Small and mid-cap focus: companies by size, the smaller ones picked out. */
function SizeGlyph({ on }: GlyphProps) {
  const sizes = [30, 22, 16, 12, 9, 7];
  let x = 6;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1="4" x2="146" y1="80" y2="80" stroke={LINE} />
      {sizes.map((r, index) => {
        const cx = x + r;
        x += r * 2 + 4;
        const picked = index >= 2;
        return (
          <circle key={r} cx={cx} cy={80 - r} r={r} fill={picked && on ? ORANGE : on ? "rgba(0,0,0,.06)" : FAINT} stroke={picked && on ? "#000" : LINE} strokeWidth=".8" className={T} style={{ transitionDelay: `${index * 70}ms` }} />
        );
      })}
    </svg>
  );
}

/** Concentrated portfolio: a few cells out of a wide field. */
function ConcentratedGlyph({ on }: GlyphProps) {
  const r = 7;
  const w = Math.sqrt(3) * r;
  const held = new Set([10, 12, 23, 26, 38, 41, 52, 55]);
  const cells = Array.from({ length: 11 * 6 }, (_, index) => {
    const row = Math.floor(index / 11);
    const col = index % 11;
    return { x: 12 + col * w + (row % 2) * (w / 2), y: 12 + row * r * 1.5, index };
  });
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      {cells.map((cell) => {
        const isHeld = held.has(cell.index);
        return (
          <polygon
            key={cell.index}
            points={hexPoints(cell.x, cell.y + 8, r - 1)}
            fill={isHeld && on ? ORANGE : FAINT}
            opacity={on && !isHeld ? 0.45 : 1}
            className={T}
            style={{ transitionDelay: isHeld ? `${[...held].indexOf(cell.index) * 60}ms` : "0ms" }}
          />
        );
      })}
    </svg>
  );
}

/** Quality management: the leader at the top, and how it reaches the whole business. */
function ManagementGlyph({ on }: GlyphProps) {
  const reports = [30, 75, 120];
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      {reports.map((x, index) => (
        <path key={x} d={`M75 30V46H${x}V60`} fill="none" stroke="#000" strokeWidth="1.2" strokeDasharray="80" strokeDashoffset={on ? 0 : 80} className={T} style={{ transitionDelay: `${150 + index * 90}ms` }} />
      ))}
      <polygon points={hexPoints(75, 18, 13)} fill={on ? ORANGE : FAINT} stroke="#000" strokeWidth=".8" className={T} />
      {reports.map((x) => (
        <rect key={x} x={x - 12} y="60" width="24" height="18" fill="#fff" stroke={LINE} />
      ))}
    </svg>
  );
}

/** Long-term investment approach: a line that dips and recovers, read over five years. */
function LongTermGlyph({ on }: GlyphProps) {
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1="8" x2="146" y1="74" y2="74" stroke={LINE} />
      <path d="M8 66 C20 60 26 70 36 58 S52 64 60 50 S76 56 86 40 S104 46 114 28 S134 24 144 12" fill="none" stroke={ORANGE} strokeWidth="2.4" strokeDasharray="200" strokeDashoffset={on ? 0 : 200} className="transition-[stroke-dashoffset] duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:duration-0" />
      {["Y1", "Y2", "Y3", "Y4", "Y5"].map((year, index) => (
        <g key={year}>
          <line x1={22 + index * 29} x2={22 + index * 29} y1="74" y2="78" stroke={LINE} />
          <text x={22 + index * 29} y="87" textAnchor="middle" fontSize="7" fill="#000" opacity=".55" letterSpacing=".08em">
            {year}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Risk-reward based decisions: the downside kept small beside the upside. */
function RiskRewardGlyph({ on }: GlyphProps) {
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1="10" x2="140" y1="45" y2="45" stroke="#000" strokeWidth="1" />
      <rect x="40" y="45" width="26" height={on ? 16 : 30} fill="none" stroke="#000" strokeWidth="1.2" strokeDasharray="3 3" className={T} />
      <rect x="84" y={on ? 9 : 31} width="26" height={on ? 36 : 14} fill={ORANGE} className={T} />
      <text x="53" y="84" textAnchor="middle" fontSize="7" fill="#000" opacity=".6" letterSpacing=".08em">
        RISK
      </text>
      <text x="97" y="84" textAnchor="middle" fontSize="7" fill="#000" opacity=".6" letterSpacing=".08em">
        REWARD
      </text>
    </svg>
  );
}

/** Focus on overlooked opportunities: attention circles the crowded names; ours sits outside them. */
function OverlookedGlyph({ on }: GlyphProps) {
  const crowded = [
    [34, 36],
    [58, 58],
    [46, 22],
  ];
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      {crowded.map(([x, y], index) => (
        <g key={index}>
          <circle cx={x} cy={y} r={on ? 16 : 9} fill="none" stroke="#000" strokeOpacity=".35" strokeDasharray="2 3" className={T} />
          <polygon points={hexPoints(x, y, 8)} fill={FAINT} />
        </g>
      ))}
      <polygon points={hexPoints(116, 50, 10)} fill={on ? ORANGE : FAINT} className={T} style={{ transitionDelay: "250ms" }} />
      <circle cx="116" cy="50" r={on ? 16 : 32} fill="none" stroke="#000" strokeWidth="1.2" opacity={on ? 1 : 0} className={T} style={{ transitionDelay: "250ms" }} />
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
