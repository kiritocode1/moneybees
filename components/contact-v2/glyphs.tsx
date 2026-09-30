"use client";

import { useId } from "react";
import { BOX, Draw, Hatch, MOVE, ORANGE, OUT, RM, tr, type GlyphProps } from "@/components/drawing/plate";

export { ORANGE };

/*
 * The drawings on /contact, in the engraved-plate language of
 * components/approach/glyphs.tsx: hairline construction first, hatching for
 * grey, orange last as the answer. A handset that rings, an envelope that
 * opens, and one drawing per enquiry option. The enquiry drawings flip ink
 * when their card is chosen (white on black), so every line takes `ink`.
 * `on` plays a drawing forward; switching it off plays it back.
 */

/** A handset; its outline draws, the body is hatched, and the rings spread from the earpiece, nearest in orange. */
export function PhoneIcon({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const handset = "M14 8h6l3 9-4 3c2 5 5 8 10 10l3-4 9 3v6c0 2-2 4-4 4C22 39 9 26 9 12c0-2 2-4 5-4Z";
  const rings = [
    { d: "M29 12.5a8 8 0 0 1 6.5 6.5", stroke: ORANGE, width: 1.8 },
    { d: "M29 7a13.5 13.5 0 0 1 12 12", stroke: ink, width: 1.2 },
    { d: "M29 1.5a19 19 0 0 1 17.5 17.5", stroke: ink, width: 0.6 },
  ];
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      <path d={handset} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 420, 420) }} />
      <Draw d={handset} on={on} ms={700} stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />
      {rings.map((ring, index) => (
        <Draw key={ring.d} d={ring.d} on={on} ms={320} delay={780 + index * 120} stroke={ring.stroke} strokeWidth={ring.width} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** An envelope; the flap folds back, and a letter rises out with its first line in orange. */
export function MailIcon({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      {/* The flap folds up about the top edge; it sits behind the body while closed. */}
      <path
        d="M6 18 24 31 42 18Z"
        fill="#fff"
        stroke={ink}
        strokeWidth="1.2"
        strokeLinejoin="round"
        className={RM}
        style={{ ...BOX, transformOrigin: "top", transform: on ? "scaleY(-1)" : "scaleY(1)", ...tr("transform", 520, 0, MOVE) }}
      />
      <g className={RM} style={{ transform: `translateY(${on ? -14 : 0}px)`, ...tr("transform", 620, 420) }}>
        <rect x="11" y="20" width="26" height="18" fill="#fff" stroke={ink} strokeWidth="1" />
        <path d="M15 28h14" stroke={ink} strokeWidth=".7" strokeOpacity=".6" />
        <rect x="15" y="23.2" width="18" height="2" fill={ORANGE} />
      </g>
      <rect x="6" y="18" width="36" height="24" fill="#fff" stroke={ink} strokeWidth="1.4" />
      <path d="M6 42 20 30.5 28 30.5 42 42Z" fill={`url(#${hatch})`} />
      <path d="M6 42 20 30.5M42 42 28 30.5" stroke={ink} strokeWidth=".7" />
      {/* The closed flap's fold, gone once the flap is up. */}
      <path d="M6 18 24 31 42 18" fill="none" stroke={ink} strokeWidth="1.2" strokeLinejoin="round" className={RM} style={{ opacity: on ? 0 : 1, ...tr("opacity", 200, 60) }} />
    </svg>
  );
}

/**
 * PMS. An account frame with a name tab; the holdings rise inside it on their
 * own baseline; the tab fills orange, because the account is in the
 * investor's own name.
 */
function PmsGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const base = 48;
  const bars = [12, 20, 15, 24];
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      <Draw d="M14 12H66V54H14Z" on={on} ms={560} stroke={ink} strokeWidth="1.1" />
      <path d="M14 12V5H36V12" fill="none" stroke={ink} strokeWidth=".8" />
      <line x1="19" x2="61" y1={base} y2={base} stroke={ink} strokeWidth=".5" strokeOpacity=".6" />
      {bars.map((height, index) => (
        <rect
          key={index}
          x={23 + index * 9}
          y={base - height}
          width="6"
          height={height}
          fill={`url(#${hatch})`}
          stroke={ink}
          strokeWidth=".7"
          className={RM}
          style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 480, 300 + index * 80) }}
        />
      ))}
      <rect x="14" y="5" width="22" height="7" fill={ORANGE} stroke={ink} strokeWidth=".8" className={RM} style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 420, 950) }} />
    </svg>
  );
}

/**
 * AIF. Investors stand around one open fund; each travels down its line into
 * it; the pooled level rises orange inside the walls once they are in.
 */
function AifGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const mouth = [40, 20] as const;
  const from = [
    [8, 10],
    [6, 30],
    [18, 52],
    [72, 10],
    [74, 32],
  ] as const;
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2} opacity={0.6} />
      </defs>
      {/* The fund: hatched walls, open at the top. */}
      <path d="M28 20V54H52V20H49V51H31V20Z" fill={`url(#${hatch})`} stroke={ink} strokeWidth=".9" />
      <rect x="31" y="30" width="18" height="21" fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 620, 1000) }} />
      {from.map(([x, y], index) => (
        <g key={index}>
          <path d={`M${x} ${y}L${mouth[0]} ${mouth[1]}`} stroke={ink} strokeWidth=".5" strokeDasharray="1.2 1.6" strokeOpacity=".7" />
          <circle
            cx={x}
            cy={y}
            r="3"
            fill={ink}
            className={RM}
            style={{
              transform: on ? `translate(${mouth[0] - x}px, ${mouth[1] + 6 - y}px)` : "translate(0,0)",
              opacity: on ? 0 : 1,
              transitionProperty: "transform, opacity",
              transitionDuration: "700ms, 200ms",
              transitionDelay: `${index * 70}ms, ${index * 70 + 620}ms`,
              transitionTimingFunction: `${MOVE}, ${OUT}`,
            }}
          />
          <circle cx={x} cy={y} r="3" fill="none" stroke={ink} strokeWidth=".6" strokeOpacity=".6" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Investor support. The question is asked at the top of a time rule; the rule
 * ticks down; the answer arrives beside it in orange, ticked.
 */
function SupportGlyph({ on, ink = "#000" }: GlyphProps) {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <path d="M8 6h34v16H18l-5 5v-5H8Z" fill="none" stroke={ink} strokeWidth="1.1" strokeLinejoin="round" />
      <text x="25" y="17.6" textAnchor="middle" fontSize="10" fill={ink} fontFamily="var(--font-geist-mono), ui-monospace, monospace">
        ?
      </text>
      {/* The time rule, ticked as it runs down. */}
      <Draw d="M30 22V50" on={on} ms={520} stroke={ink} strokeWidth=".6" />
      {[28, 34, 40, 46].map((y, index) => (
        <line key={y} x1="28" x2="32" y1={y} y2={y} stroke={ink} strokeWidth=".5" className={RM} style={{ opacity: on ? 0.8 : 0, ...tr("opacity", 160, 120 + index * 110) }} />
      ))}
      <g className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "translateX(0)" : "translateX(-6px)", ...tr("opacity, transform", 420, 650) }}>
        <path d="M36 36h36v16h-6v5l-5-5H36Z" fill={ORANGE} stroke={ink} strokeWidth=".8" strokeLinejoin="round" />
        <Draw d="M48 44l3.5 3.5 7-7" on={on} ms={280} delay={1050} stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <line x1="30" x2="36" y1="44" y2="44" stroke={ink} strokeWidth=".6" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, 650) }} />
    </svg>
  );
}

/**
 * General enquiries. A conversation, turn by turn: each line is written in
 * its own bubble, left then right, and the last reply is the orange one.
 */
function GeneralGlyph({ on, ink = "#000" }: GlyphProps) {
  const hatch = useId();
  const turns = [
    { x: 6, y: 5, w: 38, line: 26, side: "left" },
    { x: 36, y: 20, w: 38, line: 22, side: "right" },
    { x: 6, y: 35, w: 30, line: 18, side: "left" },
  ] as const;
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.5} />
      </defs>
      {turns.map((turn, index) => (
        <g key={index} className={RM} style={{ opacity: on || index === 0 ? 1 : 0, transform: on || index === 0 ? "translateY(0)" : "translateY(4px)", ...tr("opacity, transform", 360, index * 260) }}>
          <rect x={turn.x} y={turn.y} width={turn.w} height="11" rx="5.5" fill={index === 1 ? `url(#${hatch})` : "none"} stroke={ink} strokeWidth=".9" />
          <Draw d={`M${turn.x + 6} ${turn.y + 5.5}h${turn.line}`} on={on} ms={260} delay={index * 260 + 180} stroke={ink} strokeWidth=".8" strokeOpacity=".7" />
        </g>
      ))}
      {/* The reply to it all. */}
      <g className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(4px)", ...tr("opacity, transform", 380, 900) }}>
        <rect x="42" y="47" width="32" height="11" rx="5.5" fill={ORANGE} stroke={ink} strokeWidth=".8" />
        {[0, 1, 2].map((dot) => (
          <circle key={dot} cx={52 + dot * 6} cy="52.5" r="1.3" fill="#000" />
        ))}
      </g>
    </svg>
  );
}

export const ENQUIRY_GLYPHS = { pms: PmsGlyph, aif: AifGlyph, support: SupportGlyph, general: GeneralGlyph } as const;
