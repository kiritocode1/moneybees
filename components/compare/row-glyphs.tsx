import type { JSX, ReactNode } from "react";
import { hexPoints, ORANGE, T } from "@/components/pms-v2/shared";
import type { ComparisonGlyph } from "@/lib/compare";

/*
 * A pair of drawings per comparison row, drawn for the black band: the PMS
 * side and the AIF side of the same idea. `on` plays each into its explained
 * state.
 */

type GlyphProps = { on: boolean };
type Pair = { pms: (props: GlyphProps) => JSX.Element; aif: (props: GlyphProps) => JSX.Element };

const WHITE = "#fff";
const DIM = "rgba(255,255,255,.3)";
const VIEW = "0 0 120 64";

function Person({ x, y, fill = WHITE }: { x: number; y: number; fill?: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 9} r="6" fill={fill} />
      <path d={`M${x - 11} ${y + 12}c0-8 5-13 11-13s11 5 11 13Z`} fill={fill} />
    </g>
  );
}

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={VIEW} className="block h-auto w-full max-w-[150px]" aria-hidden="true">
      {children}
    </svg>
  );
}

const cells = (cx: number, cy: number, r: number) => {
  const w = Math.sqrt(3) * r;
  return [
    [cx, cy],
    [cx + w, cy],
    [cx + w / 2, cy - 1.5 * r],
    [cx + w / 2, cy + 1.5 * r],
  ] as const;
};

const PAIRS: Record<ComparisonGlyph, Pair> = {
  /** Holds securities; receives units. */
  holding: {
    pms: ({ on }) => (
      <Svg>
        <Person x={26} y={34} />
        {cells(66, 32, 9).map(([x, y], index) => (
          <polygon key={index} points={hexPoints(on ? x : 30, on ? y : 34, 8)} fill={ORANGE} opacity={on ? 1 : 0} className={T} style={{ transitionDelay: `${index * 80}ms` }} />
        ))}
      </Svg>
    ),
    aif: ({ on }) => (
      <Svg>
        <Person x={26} y={34} />
        <g className={T} style={{ transform: on ? "translate(0px,0px)" : "translate(-30px,0px)", opacity: on ? 1 : 0 }}>
          <rect x="54" y="18" width="46" height="30" rx="3" fill="none" stroke={ORANGE} strokeWidth="1.6" />
          <text x="77" y="38" textAnchor="middle" fontSize="12" fill={ORANGE} letterSpacing=".1em">
            UNITS
          </text>
        </g>
      </Svg>
    ),
  },
  /** Managed for one client; pooled from many. */
  money: {
    pms: ({ on }) => (
      <Svg>
        <circle cx="16" cy="32" r="6" fill={WHITE} />
        <path d="M26 32H80" stroke={WHITE} strokeWidth="1.4" strokeDasharray="54" strokeDashoffset={on ? 0 : 54} className={T} />
        <rect x="84" y="16" width="30" height="32" rx="3" fill={on ? ORANGE : "none"} stroke={ORANGE} strokeWidth="1.4" className={T} style={{ transitionDelay: "300ms" }} />
      </Svg>
    ),
    aif: ({ on }) => (
      <Svg>
        {[10, 24, 40, 54].map((y, index) => (
          <g key={y}>
            <circle cx="14" cy={y} r="4.5" fill={WHITE} />
            <path d={`M22 ${y}L84 32`} stroke={WHITE} strokeWidth="1.1" strokeDasharray="66" strokeDashoffset={on ? 0 : 66} className={T} style={{ transitionDelay: `${index * 80}ms` }} />
          </g>
        ))}
        <circle cx="98" cy="32" r="16" fill={on ? ORANGE : "none"} stroke={ORANGE} strokeWidth="1.4" className={T} style={{ transitionDelay: "400ms" }} />
      </Svg>
    ),
  },
  /** One portfolio of one's own; one fund shared by many. */
  structure: {
    pms: ({ on }) => (
      <Svg>
        <rect x="30" y="8" width="60" height="48" rx="3" fill="none" stroke={WHITE} strokeWidth="1.4" />
        {cells(52, 32, 8).map(([x, y], index) => (
          <polygon key={index} points={hexPoints(x, y, 7)} fill={on ? ORANGE : DIM} className={T} style={{ transitionDelay: `${index * 80}ms` }} />
        ))}
      </Svg>
    ),
    aif: ({ on }) => (
      <Svg>
        <rect x="10" y="8" width="100" height="48" rx="3" fill="none" stroke={WHITE} strokeWidth="1.4" />
        {[0, 1, 2, 3].map((slot) => (
          <rect key={slot} x={16 + slot * 23} y="14" width="19" height="36" fill={on ? (slot === 0 ? ORANGE : "rgba(247,161,26,.45)") : DIM} className={T} style={{ transitionDelay: `${slot * 80}ms` }} />
        ))}
      </Svg>
    ),
  },
  /** The PMS strategies; the one fund. */
  product: {
    pms: ({ on }) => (
      <Svg>
        {[0, 1, 2].map((tile) => (
          <rect key={tile} x={20 + tile * 28} y={on ? 18 : 26} width="22" height="28" rx="2" fill={tile === 1 && on ? ORANGE : "none"} stroke={WHITE} strokeWidth="1.3" className={T} style={{ transitionDelay: `${tile * 90}ms` }} />
        ))}
      </Svg>
    ),
    aif: ({ on }) => (
      <Svg>
        <path d="M42 30c-14-16-30-10-26 2s18 8 26-2Z M78 30c14-16 30-10 26 2s-18 8-26-2Z" fill="none" stroke={WHITE} strokeWidth="1.3" opacity={on ? 1 : 0} className={T} style={{ transitionDelay: "300ms" }} />
        <polygon points={hexPoints(60, 32, 20)} fill={on ? ORANGE : "none"} stroke={ORANGE} strokeWidth="1.4" className={T} />
      </Svg>
    ),
  },
  /** Securities in the investor's own demat account; investments held at the fund. */
  account: {
    pms: ({ on }) => (
      <Svg>
        <Person x={18} y={34} />
        <path d="M34 32H46" stroke={WHITE} strokeWidth="1.4" />
        <rect x="48" y="10" width="64" height="44" rx="3" fill="none" stroke={ORANGE} strokeWidth="1.4" />
        <text x="80" y="24" textAnchor="middle" fontSize="8" fill={ORANGE} letterSpacing=".12em">
          DEMAT
        </text>
        {[0, 1, 2].map((cell) => (
          <polygon key={cell} points={hexPoints(62 + cell * 18, 40, 7)} fill={on ? WHITE : DIM} className={T} style={{ transitionDelay: `${cell * 90}ms` }} />
        ))}
      </Svg>
    ),
    aif: ({ on }) => (
      <Svg>
        <Person x={18} y={34} />
        <path d="M34 32H46" stroke={WHITE} strokeWidth="1.4" strokeDasharray="3 3" />
        <rect x="48" y="10" width="64" height="44" rx="3" fill="none" stroke={ORANGE} strokeWidth="1.4" />
        <text x="80" y="24" textAnchor="middle" fontSize="8" fill={ORANGE} letterSpacing=".12em">
          FUND
        </text>
        {[0, 1, 2].map((cell) => (
          <polygon key={cell} points={hexPoints(62 + cell * 18, 40, 7)} fill={on ? WHITE : DIM} className={T} style={{ transitionDelay: `${cell * 90}ms` }} />
        ))}
      </Svg>
    ),
  },
};

export const ROW_GLYPHS = PAIRS;
