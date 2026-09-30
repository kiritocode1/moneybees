/*
 * The small explainer drawings on /our-approach. Each one draws what its label
 * means rather than decorating it: a cell found in a field, coverage that thins
 * out, a price below its value. `on` switches a drawing from its resting state
 * to its explained state, so a section can play them in turn.
 */

export const ORANGE = "#F6A11A";

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/** Only the properties the drawings change; reduced motion jumps straight to the explained state. */
const T = "transition-[fill,opacity,r,x,y,height,transform,stroke-opacity,stroke-dashoffset] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";

type GlyphProps = { on: boolean; ink?: string; faint?: string };

/** Undiscovered: a field of cells, and one of them found. */
export function FoundGlyph({ on, ink = "#000", faint = "rgba(0,0,0,.12)" }: GlyphProps) {
  const r = 11;
  const w = Math.sqrt(3) * r;
  const cells = Array.from({ length: 7 * 5 }, (_, index) => {
    const row = Math.floor(index / 7);
    const col = index % 7;
    return { x: 16 + col * w + (row % 2) * (w / 2), y: 16 + row * r * 1.5, index };
  });
  const found = 23;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      {cells.map((cell) => (
        <polygon key={cell.index} points={hexPoints(cell.x, cell.y, r - 1.5)} fill={cell.index === found && on ? ORANGE : faint} className={T} />
      ))}
      <circle cx={cells[found].x} cy={cells[found].y} r={on ? 17 : 40} fill="none" stroke={ink} strokeDasharray="2 3" opacity={on ? 1 : 0} className={T} />
    </svg>
  );
}

/** Under-researched: a stack of reports on the crowded name, one sheet on ours. */
export function CoverageGlyph({ on, ink = "#000", faint = "rgba(0,0,0,.12)" }: GlyphProps) {
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => (
        <rect key={index} x={18 + index * 2.4} y={14 + index * 6.4} width="44" height="8" fill={faint} stroke={ink} strokeOpacity=".25" strokeWidth=".6" style={{ opacity: on ? 1 : 0.35, transitionDelay: `${index * 50}ms` }} className={T} />
      ))}
      <rect x="96" y={on ? 67 : 40} width="44" height="8" fill={ORANGE} opacity={on ? 1 : 0} className={T} />
      <line x1="10" x2="146" y1="80" y2="80" stroke={ink} strokeOpacity=".3" />
    </svg>
  );
}

/** Under-estimated: the price sits below the value, and the gap between them is the margin. */
export function GapGlyph({ on, ink = "#000" }: GlyphProps) {
  const value = 12;
  const price = on ? 44 : 14;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1="10" x2="146" y1="80" y2="80" stroke={ink} strokeOpacity=".3" />
      <rect x="28" y={value} width="34" height={80 - value} fill="none" stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" />
      <rect x="88" y={price} width="34" height={80 - price} fill={ORANGE} className={T} />
      <path d={`M128 ${value}V${price}`} stroke={ink} strokeWidth="1" opacity={on ? 1 : 0} className={T} />
      <path d={`M125 ${value}h6M125 ${price}h6`} stroke={ink} strokeWidth="1" opacity={on ? 1 : 0} className={T} />
      <text x="45" y="88" textAnchor="middle" fontSize="7" fill={ink} opacity=".6" letterSpacing=".08em">
        VALUE
      </text>
      <text x="105" y="88" textAnchor="middle" fontSize="7" fill={ink} opacity=".6" letterSpacing=".08em">
        PRICE
      </text>
    </svg>
  );
}

/** Liquidity: enough volume every day to get in and out. */
export function LiquidityGlyph({ on, ink = "#000" }: GlyphProps) {
  const bars = [30, 44, 36, 52, 40, 48, 34, 46];
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <line x1="10" x2="146" y1="80" y2="80" stroke={ink} strokeOpacity=".3" />
      {bars.map((height, index) => (
        <rect key={index} x={16 + index * 16} y={on ? 80 - height : 80} width="10" height={on ? height : 0} fill={index % 2 ? ORANGE : ink} style={{ transitionDelay: `${index * 60}ms` }} className={T} />
      ))}
      <line x1="10" x2="146" y1="50" y2="50" stroke={ink} strokeDasharray="3 3" strokeOpacity={on ? 0.6 : 0} className={T} />
    </svg>
  );
}

/** Valuation: never pay above value; the same price-below-value picture, told as a rule. */
export function ValuationGlyph(props: GlyphProps) {
  return <GapGlyph {...props} />;
}

/** Market: the price swings; the holding line runs straight through it. */
export function MarketGlyph({ on, ink = "#000" }: GlyphProps) {
  const wave = "M10 50 C 22 22, 34 22, 46 50 S 70 78, 82 50 S 106 22, 118 50 S 142 78, 146 60";
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <path d={wave} fill="none" stroke={ink} strokeOpacity=".35" strokeWidth="1.4" />
      <path d="M10 56 L146 40" stroke={ORANGE} strokeWidth="2.4" strokeDasharray="160" strokeDashoffset={on ? 0 : 160} className={T} />
    </svg>
  );
}

/** Concentration: a portfolio in slices, no slice allowed past its cap. */
export function ConcentrationGlyph({ on, ink = "#000" }: GlyphProps) {
  const slices = [0.24, 0.2, 0.18, 0.14, 0.12, 0.12];
  let start = -Math.PI / 2;
  const cx = 75;
  const cy = 45;
  const r = 34;
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      {slices.map((share, index) => {
        const end = start + share * Math.PI * 2;
        const large = share > 0.5 ? 1 : 0;
        const d = `M${cx} ${cy} L${cx + r * Math.cos(start)} ${cy + r * Math.sin(start)} A${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(end)} ${cy + r * Math.sin(end)} Z`;
        const mid = (start + end) / 2;
        start = end;
        const push = on ? 4 : 0;
        return (
          <path
            key={index}
            d={d}
            fill={index === 0 ? ORANGE : index % 2 ? ink : "#fff"}
            stroke={ink}
            strokeWidth=".8"
            style={{ transform: `translate(${Math.cos(mid) * push}px, ${Math.sin(mid) * push}px)`, transitionDelay: `${index * 40}ms` }}
            className={T}
          />
        );
      })}
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
