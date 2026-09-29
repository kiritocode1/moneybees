"use client";

import { hexPoints, ORANGE, T } from "@/components/pms-v2/shared";
import { CHAINS } from "@/lib/compare";

/*
 * The plan's two diagrams. PMS → Investor → Securities: one investor, and the
 * securities sit with that investor. AIF → Fund → Investments: many
 * investors' money pools in the fund, and the fund holds the investments.
 * `on` draws the arrows and fills the holdings; a dot keeps travelling each
 * arrow so the direction reads.
 */

const NODE_X = [90, 300, 510];
const Y = 120;
const INK = "#000";
const FAINT = "rgba(0,0,0,.12)";

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

function Arrow({ from, to, on, delay }: { from: number; to: number; on: boolean; delay: number }) {
  const length = to - from;
  return (
    <g>
      <path d={`M${from} ${Y}H${to}`} stroke={INK} strokeWidth="1.6" strokeDasharray={length} strokeDashoffset={on ? 0 : length} className={T} style={{ transitionDelay: `${delay}ms` }} />
      <path d={`M${to - 9} ${Y - 7}l9 7-9 7`} fill="none" stroke={INK} strokeWidth="1.6" opacity={on ? 1 : 0} className={T} style={{ transitionDelay: `${delay + 300}ms` }} />
      {on && (
        <circle r="4.5" fill={ORANGE} className="motion-reduce:hidden">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin={`${(delay + 600) / 1000}s`} path={`M${from} ${Y}H${to - 10}`} />
        </circle>
      )}
    </g>
  );
}

function Labels({ labels }: { labels: readonly string[] }) {
  return (
    <>
      {labels.map((label, index) => (
        <text key={label} x={NODE_X[index]} y="236" textAnchor="middle" fontSize="19" fill={INK} letterSpacing=".06em">
          {label.toUpperCase()}
        </text>
      ))}
    </>
  );
}

/** PMS → Investor → Securities. */
export function PmsChain({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 600 250" className="block h-auto w-full" role="img" aria-label="PMS to Investor to Securities">
      <polygon points={hexPoints(NODE_X[0], Y, 50)} fill="#fff" stroke={INK} strokeWidth="1.6" />
      <text x={NODE_X[0]} y={Y + 7} textAnchor="middle" fontSize="20" fill={INK} letterSpacing=".06em">
        PMS
      </text>
      <Arrow from={148} to={236} on={on} delay={0} />
      {/* One investor. */}
      <rect x={NODE_X[1] - 56} y={Y - 56} width="112" height="112" rx="4" fill="#fff" stroke={INK} strokeWidth="1.6" />
      <circle cx={NODE_X[1]} cy={Y - 14} r="15" fill={on ? ORANGE : FAINT} className={T} style={{ transitionDelay: "300ms" }} />
      <path d={`M${NODE_X[1] - 28} ${Y + 38}c0-20 12-30 28-30s28 10 28 30`} fill={on ? ORANGE : FAINT} className={T} style={{ transitionDelay: "300ms" }} />
      <Arrow from={364} to={446} on={on} delay={500} />
      {/* The securities, held in the investor's own name. */}
      <rect x={NODE_X[2] - 62} y={Y - 62} width="124" height="124" rx="4" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="4 4" />
      {cluster(NODE_X[2], Y, 17).map(([x, y], index) => (
        <polygon key={index} points={hexPoints(x, y, on ? 15 : 4)} fill={on ? INK : FAINT} className={T} style={{ transitionDelay: `${900 + index * 70}ms` }} />
      ))}
      <Labels labels={CHAINS.pms} />
    </svg>
  );
}

/** AIF → Fund → Investments. */
export function AifChain({ on }: { on: boolean }) {
  const contributors = [238, 268, 300, 332, 362];
  return (
    <svg viewBox="0 0 600 250" className="block h-auto w-full" role="img" aria-label="AIF to Fund to Investments">
      <polygon points={hexPoints(NODE_X[0], Y, 50)} fill="#fff" stroke={INK} strokeWidth="1.6" />
      <text x={NODE_X[0]} y={Y + 7} textAnchor="middle" fontSize="20" fill={INK} letterSpacing=".06em">
        AIF
      </text>
      <Arrow from={148} to={236} on={on} delay={0} />
      {/* Many investors' money, pooled in one fund. */}
      {contributors.map((x, index) => (
        <g key={x}>
          <circle cx={x} cy="14" r="6" fill={INK} opacity=".55" />
          <path d={`M${x} 22L${NODE_X[1]} ${Y - 46}`} stroke={INK} strokeOpacity=".35" strokeDasharray="60" strokeDashoffset={on ? 0 : 60} className={T} style={{ transitionDelay: `${200 + index * 80}ms` }} />
        </g>
      ))}
      <circle cx={NODE_X[1]} cy={Y + 10} r="56" fill="#fff" stroke={INK} strokeWidth="1.6" />
      <circle cx={NODE_X[1]} cy={Y + 10} r={on ? 44 : 6} fill={ORANGE} className={T} style={{ transitionDelay: "550ms" }} />
      <Arrow from={364} to={446} on={on} delay={700} />
      {/* The fund holds the investments. */}
      {cluster(NODE_X[2], Y, 17).map(([x, y], index) => (
        <polygon key={index} points={hexPoints(x, y, on ? 15 : 4)} fill={on ? INK : FAINT} className={T} style={{ transitionDelay: `${1100 + index * 70}ms` }} />
      ))}
      <Labels labels={CHAINS.aif} />
    </svg>
  );
}
