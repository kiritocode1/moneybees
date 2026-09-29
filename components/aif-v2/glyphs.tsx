/*
 * The drawings on /aif. Each one draws what its words mean: the fund as one
 * cell fed by listed and unlisted companies, securities in your own demat
 * beside units of a pooled fund, and one small drawing per key term. `on`
 * switches a drawing from its resting state to its explained state.
 */

export const ORANGE = "#F7A11A";

export const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

const T = "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";

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
 * The Flyingbee fund graphic: the fund is the orange cell in the middle, and
 * the two wings are what it invests in, listed companies on one side and
 * pre-IPO/unlisted companies on the other.
 */
export function FundGraphic({ on }: { on: boolean }) {
  const r = 24;
  const listed = cluster(104, 170, r);
  const unlisted = cluster(376, 170, r);
  return (
    <svg viewBox="0 0 480 330" className="block h-auto w-full" aria-hidden="true">
      <style>{`
        @keyframes aifv2-pulse { 0% { transform: scale(1); opacity: .7 } 100% { transform: scale(1.7); opacity: 0 } }
        @keyframes aifv2-feed-l { 0% { transform: translate(0, 0); opacity: 0 } 15% { opacity: 1 } 85% { opacity: 1 } 100% { transform: translate(92px, 0); opacity: 0 } }
        @keyframes aifv2-feed-r { 0% { transform: translate(0, 0); opacity: 0 } 15% { opacity: 1 } 85% { opacity: 1 } 100% { transform: translate(-92px, 0); opacity: 0 } }
      `}</style>
      {/* Wing links into the fund. */}
      <path d="M150 170H200M280 170H330" stroke="#000" strokeWidth="1.2" strokeDasharray="3 4" opacity={on ? 0.6 : 0} className={T} style={{ transitionDelay: "900ms" }} />
      {on && (
        <g className="motion-reduce:hidden">
          <circle cx="146" cy="170" r="3.5" fill={ORANGE} className="animate-[aifv2-feed-l_2.6s_ease-in-out_infinite]" />
          <circle cx="334" cy="170" r="3.5" fill={ORANGE} className="animate-[aifv2-feed-r_2.6s_ease-in-out_1.3s_infinite]" />
        </g>
      )}
      {listed.map(([x, y], index) => (
        <polygon
          key={`l${index}`}
          points={hexPoints(x, y, r - 2)}
          fill="#000"
          style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(10px)", transitionDelay: `${index * 70}ms` }}
          className={T}
        />
      ))}
      {unlisted.map(([x, y], index) => (
        <polygon
          key={`u${index}`}
          points={hexPoints(x, y, r - 2)}
          fill="#fff"
          stroke="#000"
          strokeWidth="1.4"
          strokeDasharray="4 3"
          style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(10px)", transitionDelay: `${300 + index * 70}ms` }}
          className={T}
        />
      ))}
      <g style={{ transformOrigin: "240px 170px" }}>
        {on && <polygon points={hexPoints(240, 170, 46)} fill="none" stroke={ORANGE} strokeWidth="1.5" style={{ transformOrigin: "240px 170px" }} className="animate-[aifv2-pulse_2.6s_ease-out_infinite] motion-reduce:hidden" />}
        <polygon points={hexPoints(240, 170, 46)} fill={ORANGE} style={{ opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.6)", transformOrigin: "240px 170px", transitionDelay: "600ms" }} className={T} />
        <text x="240" y="167" textAnchor="middle" fontSize="10" fill="#000" letterSpacing=".12em" fontFamily={MONO} opacity={on ? 1 : 0} className={T} style={{ transitionDelay: "800ms" }}>
          FLYINGBEE
        </text>
        <text x="240" y="181" textAnchor="middle" fontSize="7" fill="#000" letterSpacing=".12em" fontFamily={MONO} opacity={on ? 0.7 : 0} className={T} style={{ transitionDelay: "800ms" }}>
          CAT III AIF
        </text>
      </g>
      <text x="104" y="262" textAnchor="middle" fontSize="9" fill="#000" letterSpacing=".12em" fontFamily={MONO} opacity={on ? 0.65 : 0} className={T} style={{ transitionDelay: "500ms" }}>
        LISTED
      </text>
      <text x="376" y="262" textAnchor="middle" fontSize="9" fill="#000" letterSpacing=".12em" fontFamily={MONO} opacity={on ? 0.65 : 0} className={T} style={{ transitionDelay: "800ms" }}>
        PRE-IPO / UNLISTED
      </text>
    </svg>
  );
}

const INVESTORS = [50, 120, 190] as const;

function Investor({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y - 6} r="6" fill="#000" />
      <path d={`M${x - 11} ${y + 12}a11 10 0 0 1 22 0Z`} fill="#000" />
    </g>
  );
}

/** PMS: each investor's securities land in that investor's own demat account. */
export function PmsHoldingGlyph({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 240 200" className="block h-auto w-full" aria-hidden="true">
      {INVESTORS.map((x, column) => (
        <g key={x}>
          <Investor x={x} y={30} />
          <path d={`M${x} 48V90`} stroke="#000" strokeWidth="1" strokeOpacity=".4" />
          <rect x={x - 28} y="92" width="56" height="62" fill="none" stroke="#000" strokeWidth="1.2" />
          {[0, 1, 2].map((tile) => (
            <rect
              key={tile}
              x={x - 20 + tile * 14}
              y={on ? 130 : 96}
              width="10"
              height="16"
              fill={tile === column ? ORANGE : "#000"}
              style={{ opacity: on ? 1 : 0, transitionDelay: `${column * 220 + tile * 90}ms` }}
              className={T}
            />
          ))}
          <text x={x} y="172" textAnchor="middle" fontSize="7" fill="#000" opacity=".55" letterSpacing=".1em" fontFamily={MONO}>
            DEMAT
          </text>
        </g>
      ))}
      <text x="120" y="194" textAnchor="middle" fontSize="8" fill="#000" letterSpacing=".12em" fontFamily={MONO}>
        SECURITIES IN YOUR NAME
      </text>
    </svg>
  );
}

/** AIF: investors pool into one fund, which holds the securities and issues each of them units. */
export function AifUnitsGlyph({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 240 200" className="block h-auto w-full" aria-hidden="true">
      <style>{`
        @keyframes aifv2-unit { 0% { transform: translate(0, 0); opacity: 0 } 15% { opacity: 1 } 80% { opacity: 1 } 100% { transform: translate(var(--dx), -62px); opacity: 0 } }
      `}</style>
      {INVESTORS.map((x, index) => (
        <g key={x}>
          <Investor x={x} y={30} />
          <path d={`M${x} 48L120 ${104}`} stroke="#000" strokeWidth="1" strokeOpacity=".4" strokeDasharray="90" strokeDashoffset={on ? 0 : 90} style={{ transitionDelay: `${index * 150}ms` }} className={T} />
          {on && (
            <g className="motion-reduce:hidden" style={{ ["--dx" as string]: `${x - 120}px` }}>
              <polygon points={hexPoints(120, 110, 5)} fill={ORANGE} className="animate-[aifv2-unit_2.4s_ease-in-out_infinite]" style={{ animationDelay: `${900 + index * 500}ms`, opacity: 0 }} />
            </g>
          )}
        </g>
      ))}
      <polygon points={hexPoints(120, 128, 34)} fill="#000" style={{ opacity: on ? 1 : 0.2, transitionDelay: "450ms" }} className={T} />
      {[0, 1, 2, 3, 4, 5].map((tile) => (
        <rect key={tile} x={106 + (tile % 3) * 10} y={118 + Math.floor(tile / 3) * 12} width="7" height="9" fill={tile === 4 ? ORANGE : "#fff"} style={{ opacity: on ? 1 : 0, transitionDelay: `${600 + tile * 60}ms` }} className={T} />
      ))}
      <text x="120" y="182" textAnchor="middle" fontSize="7" fill="#000" opacity=".55" letterSpacing=".1em" fontFamily={MONO}>
        ONE POOLED FUND
      </text>
      <text x="120" y="194" textAnchor="middle" fontSize="8" fill="#000" letterSpacing=".12em" fontFamily={MONO}>
        UNITS OF THE FUND
      </text>
    </svg>
  );
}

type GlyphProps = { on: boolean };

/** Minimum investment: a commitment rising until it meets the ₹1 Crore line. */
function MinimumGlyph({ on }: GlyphProps) {
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1="10" x2="146" y1="80" y2="80" stroke="#000" strokeOpacity=".3" />
      <line x1="10" x2="146" y1="24" y2="24" stroke="#000" strokeDasharray="3 3" strokeOpacity=".6" />
      <text x="146" y="18" textAnchor="end" fontSize="7" fill="#000" opacity=".6" letterSpacing=".08em" fontFamily={MONO}>
        ₹1 CR
      </text>
      {[22, 34, 46].map((height, index) => (
        <rect key={index} x={22 + index * 22} y={80 - height} width="14" height={height} fill="#000" opacity=".15" />
      ))}
      <rect x="96" y={on ? 24 : 70} width="22" height={on ? 56 : 10} fill={ORANGE} className={T} />
    </svg>
  );
}

/** Time frame: a five-year line with the three to five year stretch marked. */
function HorizonGlyph({ on }: GlyphProps) {
  const x = (year: number) => 14 + year * 25;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1={x(0)} x2={x(5)} y1="50" y2="50" stroke="#000" strokeOpacity=".3" strokeWidth="1.2" />
      <rect x={x(3)} y="42" height="16" width={on ? x(5) - x(3) : 0} fill={ORANGE} className={T} />
      {[0, 1, 2, 3, 4, 5].map((year) => (
        <g key={year}>
          <line x1={x(year)} x2={x(year)} y1="44" y2="56" stroke="#000" strokeOpacity={year >= 3 ? 0.9 : 0.35} />
          <text x={x(year)} y="72" textAnchor="middle" fontSize="7" fill="#000" opacity={year >= 3 ? 0.8 : 0.4} fontFamily={MONO}>
            {year}
          </text>
        </g>
      ))}
      <text x={x(0)} y="30" fontSize="7" fill="#000" opacity=".5" letterSpacing=".08em" fontFamily={MONO}>
        YEARS
      </text>
    </svg>
  );
}

/** Investment in: the listed cells and the pre-IPO/unlisted cells, side by side. */
function UniverseGlyph({ on }: GlyphProps) {
  const r = 10;
  const left = cluster(44, 44, r);
  const right = cluster(106, 44, r);
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      {left.map(([x, y], index) => (
        <polygon key={`l${index}`} points={hexPoints(x, y, r - 1.2)} fill="#000" style={{ opacity: on ? 1 : 0.12, transitionDelay: `${index * 50}ms` }} className={T} />
      ))}
      {right.map(([x, y], index) => (
        <polygon
          key={`r${index}`}
          points={hexPoints(x, y, r - 1.2)}
          fill={index === 0 && on ? ORANGE : "#fff"}
          stroke="#000"
          strokeWidth=".9"
          strokeDasharray="2.5 2"
          style={{ opacity: on ? 1 : 0.2, transitionDelay: `${350 + index * 50}ms` }}
          className={T}
        />
      ))}
      <text x="44" y="86" textAnchor="middle" fontSize="6.5" fill="#000" opacity=".55" letterSpacing=".08em" fontFamily={MONO}>
        LISTED
      </text>
      <text x="106" y="86" textAnchor="middle" fontSize="6.5" fill="#000" opacity=".55" letterSpacing=".08em" fontFamily={MONO}>
        PRE-IPO
      </text>
    </svg>
  );
}

/** Benchmark: the index drawn as the yardstick the fund is measured against. */
function BenchmarkGlyph({ on }: GlyphProps) {
  const line = "M10 66 L30 58 L48 62 L66 46 L84 50 L102 36 L120 40 L140 24";
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <path d={line} fill="none" stroke="#000" strokeWidth="1.6" strokeDasharray="170" strokeDashoffset={on ? 0 : 170} className={T} style={{ transitionDuration: "1200ms" }} />
      <circle cx="140" cy="24" r="3.5" fill={ORANGE} opacity={on ? 1 : 0} className={T} style={{ transitionDelay: "900ms" }} />
      <line x1="10" x2="146" y1="80" y2="80" stroke="#000" strokeOpacity=".3" />
      {Array.from({ length: 14 }, (_, tick) => (
        <line key={tick} x1={10 + tick * 10} x2={10 + tick * 10} y1="80" y2={tick % 5 === 0 ? 72 : 76} stroke="#000" strokeOpacity=".4" />
      ))}
    </svg>
  );
}

/** Exit load: the barrier on the way out lifts, nothing is taken at the gate. */
function ExitGlyph({ on }: GlyphProps) {
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1="10" x2="146" y1="72" y2="72" stroke="#000" strokeOpacity=".3" />
      <rect x="71" y="44" width="5" height="28" fill="#000" />
      <rect x="73.5" y="44" width="40" height="3" rx="1.5" fill="#000" style={{ transformOrigin: "73.5px 45.5px", transform: on ? "rotate(-60deg)" : "rotate(0deg)" }} className={T} />
      <circle cx="73.5" cy="45.5" r="3.5" fill="#000" />
      <path d="M14 62h118" stroke="#000" strokeOpacity=".25" strokeDasharray="3 4" />
      <g style={{ transform: on ? "translateX(96px)" : "translateX(0)", transitionDelay: "350ms", transitionDuration: "1100ms" }} className={T}>
        <polygon points={hexPoints(28, 62, 9)} fill={ORANGE} />
      </g>
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
