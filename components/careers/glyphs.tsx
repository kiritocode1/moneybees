/*
 * The drawings on /careers. Each draws what its label means: five disciplines
 * drawn together into one comb with a cell left open, a drawing per team on
 * the job cards, and one per culture point. `on` switches a drawing from its
 * resting state to its explained state.
 */

import type { Team } from "@/lib/careers";

export const ORANGE = "#F6A11A";

/** Only the properties the drawings change; reduced motion shows the explained state at once. */
const T = "transition-[transform,opacity,fill,stroke-opacity,stroke-dashoffset,y,height] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:!transition-none";

type GlyphProps = { on: boolean; ink?: string };

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/**
 * The hero: the five disciplines start apart and draw in around one centre,
 * and the sixth cell stays open for the reader.
 */
export function CombGlyph({ on, labels }: { on: boolean; labels: readonly string[] }) {
  const r = 50;
  const cx = 190;
  const cy = 165;
  const step = Math.sqrt(3) * r + 4;
  const cells = Array.from({ length: 6 }, (_, index) => {
    const angle = ((60 * index - 120) * Math.PI) / 180;
    return { x: cx + step * Math.cos(angle), y: cy + step * Math.sin(angle), angle };
  });
  return (
    <svg viewBox="0 0 380 330" className="block h-auto w-full" aria-hidden="true">
      {cells.map((cell, index) => {
        const open = index === labels.length;
        const drift = on ? 0 : 34;
        const words = open ? ["You"] : (labels[index] ?? "").split(" ");
        return (
          <g
            key={index}
            className={T}
            style={{
              transform: `translate(${Math.cos(cell.angle) * drift}px, ${Math.sin(cell.angle) * drift}px)`,
              opacity: on ? 1 : 0.25,
              transitionDelay: `${index * 120}ms`,
            }}
          >
            <polygon points={hexPoints(cell.x, cell.y, r)} fill={open ? "none" : "#fff"} stroke={open ? ORANGE : "#000"} strokeWidth={open ? 2 : 1.2} strokeDasharray={open ? "4 4" : undefined} />
            {words.map((word, line) => (
              <text
                key={word}
                x={cell.x}
                y={cell.y + (line - (words.length - 1) / 2) * 14 + 4}
                textAnchor="middle"
                fontSize="12"
                fill="#000"
                fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                letterSpacing=".04em"
              >
                {word.toUpperCase()}
              </text>
            ))}
          </g>
        );
      })}
      <polygon points={hexPoints(cx, cy, r)} fill={ORANGE} className={T} style={{ transform: `scale(${on ? 1 : 0.6})`, transformOrigin: `${cx}px ${cy}px` }} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fill="#000" fontFamily="var(--font-geist-mono), ui-monospace, monospace" letterSpacing=".04em">
        MONEYBEE
      </text>
    </svg>
  );
}

/** Research: a magnifier moving over a row of bars, the one under it lit. */
function ResearchGlyph({ on, ink = "#000" }: GlyphProps) {
  const bars = [16, 24, 20, 30, 22];
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      {bars.map((height, index) => (
        <rect key={index} x={10 + index * 12} y={50 - height} width="8" height={height} fill={on && index === 3 ? ORANGE : ink} opacity={on && index === 3 ? 1 : 0.25} className={T} />
      ))}
      <g className={T} style={{ transform: `translateX(${on ? 0 : -30}px)` }}>
        <circle cx="50" cy="28" r="11" fill="none" stroke={ink} strokeWidth="1.8" />
        <path d="M58 36 68 46" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Portfolio management: a portfolio in slices, one weighted up. */
function PortfolioGlyph({ on, ink = "#000" }: GlyphProps) {
  const slices = [0.3, 0.25, 0.25, 0.2];
  let start = -Math.PI / 2;
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      {slices.map((share, index) => {
        const end = start + share * Math.PI * 2;
        const d = `M40 30 L${40 + 22 * Math.cos(start)} ${30 + 22 * Math.sin(start)} A22 22 0 0 1 ${40 + 22 * Math.cos(end)} ${30 + 22 * Math.sin(end)} Z`;
        const mid = (start + end) / 2;
        start = end;
        const push = on && index === 0 ? 5 : 0;
        return <path key={index} d={d} fill={index === 0 ? ORANGE : index % 2 ? ink : "#fff"} stroke={ink} strokeWidth=".8" className={T} style={{ transform: `translate(${Math.cos(mid) * push}px, ${Math.sin(mid) * push}px)` }} />;
      })}
    </svg>
  );
}

/** Advisory: a question and an answer across a table. */
function AdvisoryGlyph({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <circle cx="16" cy="22" r="7" fill="none" stroke={ink} strokeWidth="1.4" />
      <path d="M6 44c0-8 4-12 10-12s10 4 10 12" fill="none" stroke={ink} strokeWidth="1.4" />
      <circle cx="64" cy="22" r="7" fill={on ? ORANGE : "none"} stroke={ink} strokeWidth="1.4" className={T} />
      <path d="M54 44c0-8 4-12 10-12s10 4 10 12" fill="none" stroke={ink} strokeWidth="1.4" />
      <path d="M28 20h24" stroke={ink} strokeWidth="1.4" strokeDasharray="3 3" strokeDashoffset={on ? 0 : 24} className={T} />
      <path d="M8 50h64" stroke={ink} strokeOpacity=".3" />
    </svg>
  );
}

/** Compliance: a shield, ticked once checked. */
function ComplianceGlyph({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <path d="M40 6 60 13v15c0 13-9 21-20 26-11-5-20-13-20-26V13Z" fill={on ? ORANGE : "none"} stroke={ink} strokeWidth="1.4" strokeLinejoin="round" className={T} />
      <path d="M31 30l6 6 12-12" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="26" strokeDashoffset={on ? 0 : 26} className={T} style={{ transitionDelay: "200ms" }} />
    </svg>
  );
}

/** Financial services: a ledger of entries, the latest one posted. */
function ServicesGlyph({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <rect x="16" y="6" width="48" height="48" fill="none" stroke={ink} strokeWidth="1.4" />
      {[0, 1, 2].map((row) => (
        <path key={row} d={`M24 ${18 + row * 10}h20M50 ${18 + row * 10}h6`} stroke={ink} strokeOpacity=".35" strokeWidth="1.6" />
      ))}
      <path d="M24 48h20M50 48h6" stroke={ORANGE} strokeWidth="2.4" opacity={on ? 1 : 0} className={T} style={{ transform: `translateY(${on ? 0 : -6}px)` }} />
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

/** Long-term thinking: short swings fade, the long line holds. */
function LongGlyph({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <path d="M6 40l6-10 6 14 6-18 6 12 6-8 6 10 6-14 6 8 6-6 6 4" fill="none" stroke={ink} strokeOpacity={on ? 0.2 : 0.6} strokeWidth="1.2" className={T} />
      <path d="M6 46 74 14" stroke={ORANGE} strokeWidth="2.4" strokeDasharray="80" strokeDashoffset={on ? 0 : 80} className={T} />
    </svg>
  );
}

/** Ownership: one cell among many, taken on and filled. */
function OwnerGlyph({ on, ink = "#000" }: GlyphProps) {
  const r = 9;
  const w = Math.sqrt(3) * r;
  const cells = Array.from({ length: 10 }, (_, index) => ({ x: 12 + (index % 5) * w + Math.floor(index / 5) * (w / 2), y: 20 + Math.floor(index / 5) * r * 1.5 }));
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      {cells.map((cell, index) => (
        <polygon key={index} points={hexPoints(cell.x, cell.y, r - 1)} fill={index === 7 && on ? ORANGE : "none"} stroke={ink} strokeOpacity={index === 7 ? 1 : 0.3} className={T} />
      ))}
    </svg>
  );
}

/** Learning together: steps, each one built on the last. */
function LearnGlyph({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      {[0, 1, 2, 3].map((step) => (
        <rect key={step} x={10 + step * 15} y={on ? 50 - (step + 1) * 10 : 50} width="15" height={on ? (step + 1) * 10 : 0} fill={step === 3 ? ORANGE : "none"} stroke={ink} strokeWidth="1.2" className={T} style={{ transitionDelay: `${step * 90}ms` }} />
      ))}
      <path d="M6 50h68" stroke={ink} strokeOpacity=".3" />
    </svg>
  );
}

export const CULTURE_GLYPHS = { research: ResearchGlyph, long: LongGlyph, owner: OwnerGlyph, learn: LearnGlyph } as const;
