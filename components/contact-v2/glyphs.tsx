/*
 * The drawings on /contact. Each draws what its label means: a handset that
 * rings, an envelope that opens, and one drawing per enquiry option. `on`
 * switches a drawing from its resting state to its explained state.
 */

export const ORANGE = "#F6A11A";

/** Only the properties the drawings change; reduced motion shows the explained state at once. */
const T = "transition-[transform,opacity,fill,stroke,stroke-opacity,stroke-dashoffset,y,height,cx,cy] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:!transition-none";

type GlyphProps = { on: boolean; ink?: string };

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/** A handset; once `on`, two sound arcs draw out from it. */
export function PhoneIcon({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <path
        d="M14 8h6l3 9-4 3c2 5 5 8 10 10l3-4 9 3v6c0 2-2 4-4 4C22 39 9 26 9 12c0-2 2-4 5-4Z"
        fill={on ? ORANGE : "none"}
        stroke={ink}
        strokeWidth="1.8"
        strokeLinejoin="round"
        className={T}
      />
      <path d="M29 9a11 11 0 0 1 10 10" fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="18" strokeDashoffset={on ? 0 : 18} className={T} style={{ transitionDelay: "250ms" }} />
      <path d="M29 3a17 17 0 0 1 16 16" fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="28" strokeDashoffset={on ? 0 : 28} className={T} style={{ transitionDelay: "400ms" }} />
    </svg>
  );
}

/** An envelope; once `on`, the flap opens back and a letter rises out of it. */
export function MailIcon({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <path d="M6 18 24 5 42 18Z" fill="#fff" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" opacity={on ? 1 : 0} className={T} />
      <g className={T} style={{ transform: `translateY(${on ? -13 : 0}px)`, transitionDelay: "200ms" }}>
        <rect x="11" y="20" width="26" height="18" fill="#fff" stroke={ink} strokeWidth="1.4" />
        <path d="M15 25h18M15 30h12" stroke={ORANGE} strokeWidth="2" />
      </g>
      <rect x="6" y="18" width="36" height="24" fill={on ? ORANGE : "#fff"} stroke={ink} strokeWidth="1.8" className={T} />
      <path d="M6 42 20 30M42 42 28 30" stroke={ink} strokeWidth="1.4" />
      <path d="M6 18 24 31 42 18" fill="none" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" opacity={on ? 0 : 1} className={T} />
    </svg>
  );
}

/** PMS: a portfolio held in the investor's own name, one cell with its own holdings. */
function PmsGlyph({ on, ink = "#000" }: GlyphProps) {
  const bars = [14, 22, 18, 28];
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <polygon points={hexPoints(40, 30, 26)} fill="none" stroke={ink} strokeWidth="1.4" />
      {bars.map((height, index) => (
        <rect key={index} x={27 + index * 7} y={on ? 42 - height : 42} width="5" height={on ? height : 0} fill={index === 3 ? ORANGE : ink} className={T} style={{ transitionDelay: `${index * 60}ms` }} />
      ))}
    </svg>
  );
}

/** AIF: many investors' money pooled into one fund. */
function AifGlyph({ on, ink = "#000" }: GlyphProps) {
  const from = [
    [10, 12],
    [10, 30],
    [10, 48],
    [70, 12],
    [70, 48],
  ] as const;
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      {from.map(([x, y], index) => (
        <g key={index}>
          <line x1={x} y1={y} x2="40" y2="30" stroke={ink} strokeOpacity=".3" strokeDasharray="2 2" />
          <circle cx={on ? 40 + (x - 40) * 0.45 : x} cy={on ? 30 + (y - 30) * 0.45 : y} r="3.2" fill={ink} className={T} style={{ transitionDelay: `${index * 50}ms` }} />
        </g>
      ))}
      <polygon points={hexPoints(40, 30, on ? 11 : 7)} fill={ORANGE} className={T} />
    </svg>
  );
}

/** Investor support: a question answered, the reply arriving under it. */
function SupportGlyph({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <path d="M8 8h40v18H20l-6 6v-6H8Z" fill="none" stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />
      <text x="28" y="21" textAnchor="middle" fontSize="11" fill={ink}>
        ?
      </text>
      <g opacity={on ? 1 : 0} className={T} style={{ transform: `translateY(${on ? 0 : 6}px)`, transitionDelay: "200ms" }}>
        <path d="M72 30H32v18h28l6 6v-6h6Z" fill={ORANGE} />
        <path d="M44 39l4 4 8-8" fill="none" stroke="#000" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** General: two lines of a conversation. */
function GeneralGlyph({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <rect x="8" y="10" width="44" height="16" rx="8" fill="none" stroke={ink} strokeWidth="1.4" />
      <path d="M16 18h24" stroke={ink} strokeOpacity=".4" strokeWidth="1.6" />
      <rect x="28" y="34" width="44" height="16" rx="8" fill={on ? ORANGE : "none"} stroke={on ? ORANGE : ink} strokeWidth="1.4" className={T} style={{ transitionDelay: "150ms" }} />
      {[0, 1, 2].map((dot) => (
        <circle key={dot} cx={42 + dot * 8} cy="42" r="1.8" fill="#000" opacity={on ? 1 : 0.3} className={T} style={{ transitionDelay: `${250 + dot * 80}ms` }} />
      ))}
    </svg>
  );
}

export const ENQUIRY_GLYPHS = { pms: PmsGlyph, aif: AifGlyph, support: SupportGlyph, general: GeneralGlyph } as const;
