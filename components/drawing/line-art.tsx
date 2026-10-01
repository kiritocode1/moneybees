import type { ReactNode } from "react";

/*
 * Study 04's line drawings (reference/visual-language/04/moneybee.svg and
 * STUDY.md), for line cards on any page: line art in one ink, exactly one
 * orange element each, strokes 1 to 1.4, small-square corners a quarter of
 * their side. `gather` is `distribute` reversed, and `rules` and `burst`
 * follow 04's frame and ray measurements. Used by /careers and
 * /investor-centre.
 */

export type LineArt = "cylinder" | "distribute" | "gather" | "fan" | "rules" | "burst" | "exit";

const ORANGE = "#F6A11A";

/** 30 rays at 12°, from the square's edge out to dots. */
const BURST = Array.from({ length: 30 }, (_, index) => {
  const angle = (index * 12 * Math.PI) / 180;
  const at = (r: number) => [(50 + r * Math.cos(angle)).toFixed(2), (50 + r * Math.sin(angle)).toFixed(2)] as const;
  return { from: at(16), to: at(39), dot: at(42.5) };
});

const ART: Record<LineArt, { viewBox: string; draw: (ink: string) => ReactNode }> = {
  cylinder: {
    viewBox: "68.5 198.5 100 100",
    draw: (ink) => (
      <>
        <rect x="84.7" y="214.6" width="67.6" height="67.8" rx="13" fill="none" stroke={ink} strokeWidth="1.35" />
        <ellipse cx="118.5" cy="230.6" rx="21.35" ry="5.8" fill="none" stroke={ink} strokeWidth="1.36" />
        <path d="M97.15 230.60 V266.21 M139.85 230.60 V266.21" stroke={ink} strokeWidth="1.36" fill="none" />
        <path d="M97.15 242.47 A21.35 5.8 0 0 0 139.85 242.47" stroke={ink} strokeWidth="1.36" fill="none" />
        <path d="M97.15 254.34 A21.35 5.8 0 0 0 139.85 254.34" stroke={ORANGE} strokeWidth="1.6" fill="none" />
        <path d="M97.15 266.21 A21.35 5.8 0 0 0 139.85 266.21" stroke={ink} strokeWidth="1.36" fill="none" />
      </>
    ),
  },
  distribute: {
    viewBox: "395.7 198.5 110 100",
    draw: (ink) => (
      <>
        <rect x="398.45" y="236.25" width="24.5" height="24.5" rx="6" fill={ORANGE} />
        <rect x="460.40" y="219.20" width="16.6" height="16.6" rx="3.2" fill="none" stroke={ink} strokeWidth="1.1" />
        <rect x="482.40" y="240.20" width="16.6" height="16.6" rx="3.2" fill="none" stroke={ink} strokeWidth="1.1" />
        <rect x="444.40" y="256.20" width="16.6" height="16.6" rx="3.2" fill="none" stroke={ink} strokeWidth="1.1" />
        <path d="M423.20 241.90 L453.01 231.12 M423.20 248.50 L474.30 248.50 M423.20 254.90 L436.10 259.33" stroke={ink} strokeWidth="1.1" fill="none" />
        <path d="M456.40 229.90 L453.76 233.19 L452.27 229.05 Z M477.90 248.50 L474.30 250.70 L474.30 246.30 Z M439.50 260.50 L435.38 261.41 L436.81 257.25 Z" fill={ink} />
      </>
    ),
  },
  gather: {
    // `distribute` mirrored: three holdings arrive at one orange square.
    viewBox: "395.7 198.5 110 100",
    draw: (ink) => (
      <g transform="translate(901.4 0) scale(-1 1)">
        <rect x="398.45" y="236.25" width="24.5" height="24.5" rx="6" fill={ORANGE} />
        <rect x="460.40" y="219.20" width="16.6" height="16.6" rx="3.2" fill="none" stroke={ink} strokeWidth="1.1" />
        <rect x="482.40" y="240.20" width="16.6" height="16.6" rx="3.2" fill="none" stroke={ink} strokeWidth="1.1" />
        <rect x="444.40" y="256.20" width="16.6" height="16.6" rx="3.2" fill="none" stroke={ink} strokeWidth="1.1" />
        <path d="M456.40 229.90 L426.59 240.68 M477.90 248.50 L426.80 248.50 M439.50 260.50 L426.60 256.07" stroke={ink} strokeWidth="1.1" fill="none" />
        <path d="M423.20 241.90 L425.84 238.61 L427.33 242.75 Z M423.20 248.50 L426.80 246.30 L426.80 250.70 Z M423.20 254.90 L427.32 253.99 L425.89 258.15 Z" fill={ink} />
      </g>
    ),
  },
  fan: {
    viewBox: "577.3 198.5 100 100",
    draw: (ink) => (
      <>
        <g fill="none" stroke={ink} strokeWidth="1">
          {[209.25, 223.62, 235.52, 261.52, 273.4, 287.71].map((y) => (
            <path key={y} d={`M601.3 248.5 C639.3 248.5 621.3 ${y} 665.3 ${y} L671.3 ${y}`} />
          ))}
        </g>
        <path d="M582.9 248.5 L671.3 248.5" stroke={ORANGE} strokeWidth="1.3" fill="none" />
        <path d="M582.3 248.5 L586.3 245.9 L586.3 251.1 Z" fill={ORANGE} />
      </>
    ),
  },
  rules: {
    viewBox: "0 0 100 100",
    draw: (ink) => (
      <>
        <rect x="16.2" y="16.1" width="67.6" height="67.8" rx="13" fill="none" stroke={ink} strokeWidth="1.35" />
        {[36, 50, 64].map((y) => (
          <g key={y}>
            <circle cx="31" cy={y} r="2.2" fill={ink} />
            <path d={`M38 ${y}H69`} stroke={y === 50 ? ORANGE : ink} strokeWidth={y === 50 ? 1.6 : 1.35} />
          </g>
        ))}
      </>
    ),
  },
  burst: {
    viewBox: "0 0 100 100",
    draw: (ink) => (
      <>
        {BURST.map((ray, index) => (
          <g key={index}>
            <path d={`M${ray.from[0]} ${ray.from[1]}L${ray.to[0]} ${ray.to[1]}`} stroke={ink} strokeWidth="1" />
            <circle cx={ray.dot[0]} cy={ray.dot[1]} r="1.4" fill={ink} />
          </g>
        ))}
        <rect x="39.4" y="39.4" width="21.2" height="21.2" rx="5.6" fill={ORANGE} />
      </>
    ),
  },
  exit: {
    viewBox: "739.9 198.5 100 100",
    draw: (ink) => (
      <>
        <path d="M802.9 239.5 V231.5 A11 11 0 0 0 791.9 220.5 H757.9 A11 11 0 0 0 746.9 231.5 V265.5 A11 11 0 0 0 757.9 276.5 H791.9 A11 11 0 0 0 802.9 265.5 V257.5" fill="none" stroke={ink} strokeWidth="1.36" />
        <circle cx="762.9" cy="248.5" r="2.2" fill={ink} />
        <path d="M766.90 248.50 L819.90 248.50" stroke={ORANGE} strokeWidth="1.6" fill="none" />
        <path d="M824.90 248.50 L819.90 251.70 L819.90 245.30 Z" fill={ORANGE} />
      </>
    ),
  },
};

/** One drawing, wiped on from the left when `on`; `className` sets its size. */
export function LineArtFigure({ art, on, ink = "#000", delay = 0, className, duration = 1100 }: { art: LineArt; on: boolean; ink?: string; delay?: number; className?: string; duration?: number }) {
  const { viewBox, draw } = ART[art];
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      className={`block overflow-visible motion-reduce:![clip-path:none] motion-reduce:!transition-none ${className ?? ""}`}
      style={{ clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", transition: `clip-path ${duration}ms cubic-bezier(.23,1,.32,1) ${delay}ms` }}
    >
      {draw(ink)}
    </svg>
  );
}
