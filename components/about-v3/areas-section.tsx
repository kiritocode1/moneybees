"use client";

import { useId } from "react";
import { hexPoints, useShown } from "@/components/about-v2/shared";
import { BOX, Draw, Hatch, MOVE, ORANGE, RM, tr } from "@/components/drawing/plate";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { COLUMN, EYEBROW } from "@/components/hero/tokens";

/*
 * The group's four areas, content plan §2, each drawn rather than photographed,
 * in the plate language of components/drawing/plate.tsx. What each drawing
 * shows is the group profile deck's: the PMS holds 15 to 20 stocks; the group
 * is a BSE and NSE registered stockbroker and a CDSL depository participant
 * (p4); its advisory work is listings, acquisitions, joint ventures, fund
 * raises and turnarounds (the transactions slides).
 */

const MONO = "var(--font-geist-mono), ui-monospace, monospace";

/** `delay` staggers a drawing behind the ones before it in the row. */
type DrawingProps = { on: boolean; delay: number };

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize="9" letterSpacing=".12em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
      {children}
    </text>
  );
}

/** Opacity and scale for a mark that lands, centred on itself. */
const land = (on: boolean, ms: number, delay: number) => ({
  ...BOX,
  transformOrigin: "center",
  opacity: on ? 1 : 0,
  transform: on ? "scale(1)" : "scale(.7)",
  ...tr("opacity, transform", ms, delay),
});

/**
 * Portfolio management. The account's outline draws on and its holdings
 * settle into it one by one, nineteen cells, within the PMS's 15 to 20
 * stocks. Under it the account's value runs along a time axis, and the orange
 * cell marks where it has got to.
 */
function PortfolioDrawing({ on, delay: d }: DrawingProps) {
  const hatch = useId();
  const cx = 80;
  const cy = 68;
  const outer = 50;
  const r = 9;
  const w = Math.sqrt(3) * r;
  const frame = Array.from({ length: 6 }, (_, k) => {
    const a = (k * Math.PI) / 3;
    return `${(cx + outer * Math.cos(a)).toFixed(2)} ${(cy + outer * Math.sin(a)).toFixed(2)}`;
  });
  // A hexagon of cells two deep: rows of 3, 4, 5, 4 and 3.
  const cells = [-2, -1, 0, 1, 2].flatMap((row) => {
    const count = 5 - Math.abs(row);
    return Array.from({ length: count }, (_, i) => ({ x: cx + (i - (count - 1) / 2) * w, y: cy + row * 1.5 * r }));
  });
  const hatched = new Set([0, 3, 5, 8, 9, 13, 16, 18]);
  const axis = 184;
  const value: [number, number][] = [[18, 176], [32, 173], [46, 168], [58, 170], [72, 161], [86, 163], [100, 154], [114, 151], [128, 143], [142, 139]];
  const [endX, endY] = value[value.length - 1];
  return (
    <svg viewBox="0 0 160 200" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2.2} opacity={0.6} />
      </defs>
      <Draw d={`M${frame.join("L")}Z`} on={on} ms={700} delay={d} stroke="#000" strokeWidth="1" strokeLinejoin="round" />
      {cells.map((cell, index) => (
        // A fixed scatter, so the cells do not fill row by row.
        <polygon
          key={index}
          points={hexPoints(cell.x, cell.y, r - 1.4)}
          fill={hatched.has(index) ? `url(#${hatch})` : "#fff"}
          stroke="#000"
          strokeWidth=".6"
          strokeOpacity=".6"
          className={RM}
          style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(-6px)", ...tr("opacity, transform", 280, d + 600 + ((index * 7) % 19) * 45) }}
        />
      ))}
      <line x1="14" x2="146" y1={axis} y2={axis} stroke="#000" strokeWidth=".5" strokeOpacity=".4" />
      {Array.from({ length: 12 }, (_, tick) => (
        <line key={tick} x1={18 + tick * 11.6} x2={18 + tick * 11.6} y1={axis} y2={axis + (tick % 4 ? 2 : 3.6)} stroke="#000" strokeWidth=".5" strokeOpacity=".4" />
      ))}
      <Draw d={value.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("")} on={on} ms={900} delay={d + 1500} ease={MOVE} stroke="#000" strokeWidth="1" strokeLinejoin="round" />
      <polygon points={hexPoints(endX, endY, 4.8)} fill={ORANGE} className={RM} style={land(on, 360, d + 2350)} />
    </svg>
  );
}

/**
 * Equity broking. An order book on its price ladder: offers to sell stack on
 * one side, bids to buy on the other, and on the middle row the two meet and
 * the trade prints in orange.
 */
function BrokingDrawing({ on, delay: d }: DrawingProps) {
  const sells = useId();
  const buys = useId();
  const mid = 80;
  const rows = Array.from({ length: 9 }, (_, i) => 28 + i * 16);
  const match = rows[4];
  const offers = [22, 34, 28, 42];
  const bids = [40, 30, 46, 24];
  const bar = 9;
  return (
    <svg viewBox="0 0 160 200" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={sells} ink="#000" gap={2.2} opacity={0.6} />
        <Hatch id={buys} ink="#000" gap={2.2} angle={-45} opacity={0.6} />
      </defs>
      <Draw d={`M${mid} 16V172`} on={on} ms={600} delay={d} stroke="#000" strokeWidth=".7" />
      {rows.map((y) => (
        <line key={y} x1={mid - 3} x2={mid + 3} y1={y} y2={y} stroke="#000" strokeWidth=".5" strokeOpacity=".5" />
      ))}
      {offers.map((length, i) => (
        <rect
          key={`sell-${i}`}
          x={mid + 4}
          y={rows[i] - bar / 2}
          width={length}
          height={bar}
          fill={`url(#${sells})`}
          stroke="#000"
          strokeWidth=".6"
          className={RM}
          style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 460, d + 350 + i * 90) }}
        />
      ))}
      {bids.map((length, i) => (
        <rect
          key={`buy-${i}`}
          x={mid - 4 - length}
          y={rows[5 + i] - bar / 2}
          width={length}
          height={bar}
          fill={`url(#${buys})`}
          stroke="#000"
          strokeWidth=".6"
          className={RM}
          style={{ ...BOX, transformOrigin: "right", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 460, d + 350 + i * 90) }}
        />
      ))}
      {/* A bid and an offer travel in from either edge and meet on the middle row. */}
      <rect x={mid - 20} y={match - bar / 2} width="16" height={bar} fill="#fff" stroke="#000" strokeWidth=".8" className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateX(-40px)", ...tr("opacity, transform", 700, d + 1150, MOVE) }} />
      <rect x={mid + 4} y={match - bar / 2} width="16" height={bar} fill="#fff" stroke="#000" strokeWidth=".8" className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateX(40px)", ...tr("opacity, transform", 700, d + 1150, MOVE) }} />
      <rect x={mid - 20} y={match - bar / 2} width="40" height={bar} fill={ORANGE} stroke="#000" strokeWidth=".8" className={RM} style={land(on, 360, d + 1950)} />
      <Label x={mid - 30} y={194}>BUY</Label>
      <Label x={mid + 30} y={194}>SELL</Label>
    </svg>
  );
}

/**
 * Investment advisory. From the business at the foot of the plate three
 * courses lead up, dashed and still open. The advice is the one that draws on
 * in ink, stop by stop, and the orange cell is where it arrives.
 */
function AdvisoryDrawing({ on, delay: d }: DrawingProps) {
  const hatch = useId();
  const open = [
    { d: "M80 164V150H32V104H22V58", end: [22, 58] },
    { d: "M80 164V124H94V82H82V48", end: [82, 48] },
  ] as const;
  const advised = "M80 164V150H126V108H138V30";
  const draw = 1100;
  // Each stop lights as the line reaches it: its share of the route's length.
  const stops = [
    [126, 150, 60 / 192],
    [126, 108, 102 / 192],
    [138, 108, 114 / 192],
  ] as const;
  return (
    <svg viewBox="0 0 160 200" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2.2} opacity={0.6} />
      </defs>
      {[...open, { d: advised, end: [138, 30] as const }].map((route, i) => (
        <g key={route.d} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 400, d + 250 + i * 160) }}>
          <path d={route.d} fill="none" stroke="#000" strokeWidth=".6" strokeOpacity=".45" strokeDasharray="2 2" />
          <polygon points={hexPoints(route.end[0], route.end[1], 5)} fill="#fff" stroke="#000" strokeWidth=".6" strokeOpacity=".55" />
        </g>
      ))}
      <Draw d={advised} on={on} ms={draw} delay={d + 1050} ease="linear" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
      {stops.map(([x, y, at]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#000" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 160, d + 1050 + at * draw) }} />
      ))}
      <polygon points={hexPoints(80, 171, 7)} fill={`url(#${hatch})`} stroke="#000" strokeWidth=".8" />
      <polygon points={hexPoints(138, 30, 5.4)} fill={ORANGE} stroke="#000" strokeWidth=".7" className={RM} style={land(on, 380, d + 1050 + draw + 80)} />
    </svg>
  );
}

/** A share certificate: a double border, a few lines of text and its seal. */
function Certificate({ x, y, hatch }: { x: number; y: number; hatch?: string }) {
  return (
    <g>
      <rect x={x} y={y} width="62" height="38" fill="#fff" stroke="#000" strokeWidth=".7" />
      <rect x={x + 3} y={y + 3} width="56" height="32" fill={hatch ? `url(#${hatch})` : "none"} stroke="#000" strokeWidth=".4" strokeOpacity=".6" />
      {!hatch && (
        <>
          <line x1={x + 9} x2={x + 41} y1={y + 12} y2={y + 12} stroke="#000" strokeWidth=".6" strokeOpacity=".6" />
          <line x1={x + 9} x2={x + 33} y1={y + 18} y2={y + 18} stroke="#000" strokeWidth=".6" strokeOpacity=".4" />
          <circle cx={x + 49} cy={y + 26} r="4.4" fill="none" stroke="#000" strokeWidth=".6" />
        </>
      )}
    </g>
  );
}

/**
 * Related financial services: the group is also a CDSL depository
 * participant. Share certificates on paper go in at the top; in the client's
 * demat account they come out as entries in a ledger, the newest in orange.
 */
function DepositoryDrawing({ on, delay: d }: DrawingProps) {
  const hatch = useId();
  const rows = [134, 145, 156];
  const credited = 167;
  return (
    <svg viewBox="0 0 160 200" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2.2} opacity={0.5} />
      </defs>
      <Label x={80} y={10}>PAPER</Label>
      {[0, 1, 2].map((i) => (
        <g key={i} className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(-8px)", ...tr("opacity, transform", 360, d + i * 110) }}>
          <Certificate x={34 + i * 8} y={22 + i * 8} hatch={i < 2 ? hatch : undefined} />
        </g>
      ))}
      {/* The front certificate travels down into the account and is gone. */}
      <g className={RM} style={{ opacity: on ? 0 : 1, transform: on ? "translateY(78px)" : "none", ...tr("opacity, transform", 800, d + 700, MOVE) }}>
        <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 1, d + 699) }}>
          <Certificate x={50} y={38} />
        </g>
      </g>
      <Draw d="M80 86V104" on={on} ms={360} delay={d + 650} stroke="#000" strokeWidth=".7" />
      <path d="M77 100L80 105L83 100" fill="none" stroke="#000" strokeWidth=".7" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, d + 950) }} />
      <Draw d="M26 110H134V176H26Z" on={on} ms={700} delay={d + 300} stroke="#000" strokeWidth=".9" />
      <line x1="26" x2="134" y1="122" y2="122" stroke="#000" strokeWidth=".5" strokeOpacity=".5" />
      {rows.map((y, i) => (
        <g key={y}>
          <rect x="32" y={y - 2.5} width="5" height="5" fill="none" stroke="#000" strokeWidth=".6" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, d + 1450 + i * 170) }} />
          <Draw d={`M42 ${y}H${[96, 84, 104][i]}`} on={on} ms={300} delay={d + 1450 + i * 170} stroke="#000" strokeWidth=".7" strokeOpacity=".7" />
          <Draw d={`M112 ${y}H128`} on={on} ms={200} delay={d + 1550 + i * 170} stroke="#000" strokeWidth=".7" strokeOpacity=".7" />
        </g>
      ))}
      <rect x="31" y={credited - 3.5} width="98" height="7" fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 520, d + 2050) }} />
      <Label x={80} y={194}>DEMAT</Label>
    </svg>
  );
}

const AREAS = [
  { name: "Portfolio management", Drawing: PortfolioDrawing },
  { name: "Equity broking", Drawing: BrokingDrawing },
  { name: "Investment advisory", Drawing: AdvisoryDrawing },
  { name: "Related financial services", Drawing: DepositoryDrawing },
] as const;

/** The four areas the company text names, a drawing each. `index` is the section's number in the page's order. */
export function AreasSection({ index }: { index: string }) {
  const { ref, shown } = useShown<HTMLUListElement>(0.3);
  return (
    <section id="group" aria-labelledby="group-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} pt-[120px] max-md:pt-[80px]`}>
        <h2 id="group-heading">
          <BracketLabel>{index} · What the group does</BracketLabel>
        </h2>
      </div>
      <ul ref={ref} className={`${COLUMN} mt-10 grid list-none grid-cols-2 gap-x-6 gap-y-10 pb-[120px] max-md:pb-[80px] md:grid-cols-4`}>
        {AREAS.map(({ name, Drawing }, i) => (
          <li key={name}>
            <Rise onView delay={i * 0.06}>
              <div className="flex aspect-[4/5] items-center justify-center bg-[#F6F6F6] p-[6%] max-md:p-[3%]">
                <Drawing on={shown} delay={i * 220} />
              </div>
              <div className="mt-4 flex items-baseline gap-3 border-t border-black pt-3">
                <span className={`${EYEBROW} text-black/50`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-[clamp(1.25rem,1rem+.6vw,1.6rem)] leading-[1.15]">{name}</span>
              </div>
            </Rise>
          </li>
        ))}
      </ul>
    </section>
  );
}
