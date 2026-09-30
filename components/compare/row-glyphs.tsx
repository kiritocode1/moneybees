"use client";

import { useId, type JSX, type ReactNode } from "react";
import { BOX, Draw, Hatch, MOVE, ORANGE, RM, tr } from "@/components/drawing/plate";
import { hexPoints } from "@/components/pms-v2/shared";
import type { ComparisonGlyph } from "@/lib/compare";

/*
 * A pair of drawings per comparison row, drawn for the black band in white
 * ink: the PMS side and the AIF side of the same idea, in the engraved-plate
 * language of components/approach/glyphs.tsx. The construction rests on the
 * plate; `on` plays the row's mechanism and lands the orange answer last.
 */

type GlyphProps = { on: boolean };
type Pair = { pms: (props: GlyphProps) => JSX.Element; aif: (props: GlyphProps) => JSX.Element };

const INK = "#fff";
const MONO = "var(--font-geist-mono)";

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 120 64" className="block h-auto w-full max-w-[150px] overflow-visible" aria-hidden="true">
      {children}
    </svg>
  );
}

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="6" fill={INK} opacity=".6" letterSpacing=".12em" fontFamily={MONO}>
      {children}
    </text>
  );
}

const fade = (on: boolean, delay: number, ms = 260) => ({ opacity: on ? 1 : 0, ...tr("opacity", ms, delay) });
const pop = (on: boolean, delay: number, ms = 320, from = 0.6) => ({
  ...BOX,
  transformOrigin: "center",
  opacity: on ? 1 : 0,
  transform: on ? "scale(1)" : `scale(${from})`,
  ...tr("opacity, transform", ms, delay),
});

/** An investor, in outline with engraved fill. */
function Person({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g fill={fill} stroke={INK} strokeWidth=".9">
      <circle cx={x} cy={y - 9} r="5" />
      <path d={`M${x - 9} ${y + 10}c0-7 4-11 9-11s9 4 9 11Z`} />
    </g>
  );
}

/** A small investor for rows of many. */
function MiniPerson({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g fill={fill} stroke={INK} strokeWidth=".7">
      <circle cx={x} cy={y - 5} r="3" />
      <path d={`M${x - 5} ${y + 5}c0-4 2-6 5-6s5 2 5 6Z`} />
    </g>
  );
}

/** Wraps a drawing that needs its own hatch pattern. */
function Hatched({ children, gap = 1.8 }: { children: (fill: string) => ReactNode; gap?: number }) {
  const id = useId();
  return (
    <Svg>
      <defs>
        <Hatch id={id} ink={INK} gap={gap} opacity={0.6} />
      </defs>
      {children(`url(#${id})`)}
    </Svg>
  );
}

const PAIRS: Record<ComparisonGlyph, Pair> = {
  /**
   * Holds securities: the securities travel in and sit beside the investor,
   * tied to them directly. Receives units: one slice of the fund leaves it
   * and travels to the investor; the fund keeps the rest.
   */
  holding: {
    pms: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            <Person x={18} y={34} fill={hatch} />
            {[52, 68, 84].map((x, index) => (
              <g key={x}>
                <polygon points={hexPoints(x, 32, 7)} fill="none" stroke={INK} strokeWidth=".6" strokeOpacity=".35" strokeDasharray="1.4 1.4" />
                <polygon points={hexPoints(x, 32, 7)} fill={ORANGE} className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "translateX(0)" : "translateX(34px)", ...tr("opacity, transform", 700, 300 + index * 110, MOVE) }} />
              </g>
            ))}
            <Draw d="M30 32H43" on={on} ms={260} stroke={INK} strokeWidth=".9" />
            <Draw d="M44 45V48H92V45" on={on} ms={380} delay={900} stroke={INK} strokeWidth=".6" />
            <g className={RM} style={fade(on, 1100)}>
              <Label x={68} y={58}>
                DIRECT
              </Label>
            </g>
          </>
        )}
      </Hatched>
    ),
    aif: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            <Person x={18} y={34} fill={hatch} />
            <circle cx="94" cy="30" r="16" fill={hatch} stroke={INK} strokeWidth=".9" />
            <path d="M94 30L82.7 18.7M94 30L105.3 18.7M94 30L105.3 41.3M94 30L82.7 41.3" stroke={INK} strokeWidth=".6" />
            {/* The gap the slice leaves in the fund. */}
            <path d="M94 30L82.7 41.3A16 16 0 0 1 82.7 18.7Z" fill="#000" stroke={INK} strokeWidth=".5" strokeDasharray="1.2 1.2" className={RM} style={fade(on, 300)} />
            <path
              d="M94 30L82.7 41.3A16 16 0 0 1 82.7 18.7Z"
              fill={ORANGE}
              className={RM}
              style={{ transform: on ? "translate(-48px,2px)" : "translate(0px,0px)", ...tr("transform", 800, 250, MOVE) }}
            />
            <g className={RM} style={fade(on, 950)}>
              <Label x={40} y={58}>
                UNITS
              </Label>
              <Label x={94} y={58}>
                FUND
              </Label>
            </g>
          </>
        )}
      </Hatched>
    ),
  },
  /**
   * Managed for the client: the mandate runs from the client to the manager,
   * and the managed portfolio comes back to that same client, in orange.
   * Pooled: several investors' money runs into one channel and the pool rises.
   */
  money: {
    pms: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            <Person x={18} y={32} fill={hatch} />
            <polygon points={hexPoints(94, 32, 14)} fill="none" stroke={INK} strokeWidth=".9" />
            <polygon points={hexPoints(94, 32, 11)} fill="none" stroke={INK} strokeWidth=".5" strokeOpacity=".5" />
            <text x="94" y="34.2" textAnchor="middle" fontSize="6" fill={INK} letterSpacing=".08em" fontFamily={MONO}>
              PMS
            </text>
            <Draw d="M30 22C46 6 68 6 80 20" on={on} ms={520} stroke={INK} strokeWidth=".8" />
            <path d="M75.4 19.2L80 20L80.2 15.3" fill="none" stroke={INK} strokeWidth=".8" className={RM} style={fade(on, 480, 180)} />
            <Draw d="M80 44C68 58 46 58 31 44" on={on} ms={560} delay={620} stroke={ORANGE} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M35.6 44.4L31 44L31.2 48.6" fill="none" stroke={ORANGE} strokeWidth="1.4" strokeLinecap="round" className={RM} style={fade(on, 1140, 180)} />
            <g className={RM} style={fade(on, 1200)}>
              <Label x={18} y={62}>
                CLIENT
              </Label>
            </g>
          </>
        )}
      </Hatched>
    ),
    aif: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            {[10, 24, 40, 54].map((y, index) => (
              <g key={y}>
                <circle cx="10" cy={y} r="3.6" fill={hatch} stroke={INK} strokeWidth=".7" />
                <Draw d={`M15 ${y}C38 ${y} 40 32 62 32`} on={on} ms={420} delay={index * 80} stroke={INK} strokeWidth=".7" strokeOpacity=".75" />
              </g>
            ))}
            <Draw d="M62 32H78" on={on} ms={220} delay={420} stroke={INK} strokeWidth="1.1" />
            <path d="M80 14V50a4 4 0 0 0 4 4H106a4 4 0 0 0 4-4V14" fill="none" stroke={INK} strokeWidth=".9" />
            {[22, 30, 38, 46].map((y, tick) => (
              <line key={y} x1="110" x2={tick % 2 ? 113 : 115} y1={y} y2={y} stroke={INK} strokeWidth=".5" strokeOpacity=".6" />
            ))}
            <rect x="83" y="24" width="24" height="27.5" rx="2" fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 700, 620) }} />
            <g className={RM} style={fade(on, 1000)}>
              <Label x={95} y={9}>
                POOL
              </Label>
            </g>
          </>
        )}
      </Hatched>
    ),
  },
  /**
   * Individual portfolio: each investor has a frame of their own, and each
   * frame closes in orange. Fund structure: every investor feeds one manifold
   * into a single frame, and that one frame closes in orange.
   */
  structure: {
    pms: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            {[8, 44, 80].map((x, frame) => (
              <g key={x}>
                <MiniPerson x={x + 16} y={10} fill={hatch} />
                <rect x={x} y="22" width="32" height="30" fill="none" stroke={INK} strokeWidth=".6" strokeOpacity=".4" />
                {[
                  [x + 10, 32],
                  [x + 22, 32],
                  [x + 16, 42],
                ].map(([cx, cy], cell) => (
                  <polygon key={cell} points={hexPoints(cx, cy, 4.6)} fill={hatch} stroke={INK} strokeWidth=".6" className={RM} style={pop(on, 100 + frame * 140 + cell * 60)} />
                ))}
                <Draw d={`M${x} 22H${x + 32}V52H${x}Z`} on={on} ms={420} delay={800 + frame * 120} stroke={ORANGE} strokeWidth="1.3" />
              </g>
            ))}
            <g className={RM} style={fade(on, 1200)}>
              <Label x={60} y={62}>
                SEPARATE
              </Label>
            </g>
          </>
        )}
      </Hatched>
    ),
    aif: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            {[24, 48, 72, 96].map((x, index) => (
              <g key={x}>
                <MiniPerson x={x} y={8} fill={hatch} />
                <Draw d={`M${x} 14V20`} on={on} ms={200} delay={index * 60} stroke={INK} strokeWidth=".7" />
              </g>
            ))}
            <Draw d="M24 20H96M60 20V24" on={on} ms={380} delay={260} stroke={INK} strokeWidth=".9" />
            <rect x="8" y="24" width="104" height="28" fill="none" stroke={INK} strokeWidth=".6" strokeOpacity=".4" />
            {[22, 38, 54, 70, 86, 102].map((cx, cell) => (
              <polygon key={cx} points={hexPoints(cx, 38, 5.2)} fill={hatch} stroke={INK} strokeWidth=".6" className={RM} style={pop(on, 400 + cell * 60)} />
            ))}
            <Draw d="M8 24H112V52H8Z" on={on} ms={620} delay={900} stroke={ORANGE} strokeWidth="1.3" />
            <g className={RM} style={fade(on, 1200)}>
              <Label x={60} y={62}>
                SHARED
              </Label>
            </g>
          </>
        )}
      </Hatched>
    ),
  },
  /**
   * PMS strategies: several strategy cards arrive, each holding its own
   * arrangement, each tagged in orange. The one fund: a single emblem, its
   * wings drawn on, its orange core landing last.
   */
  product: {
    pms: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            {[10, 47, 84].map((x, card) => {
              const layouts: [number, number][][] = [
                [[x + 7, 30], [x + 13, 30], [x + 19, 30]],
                [[x + 10, 26], [x + 16, 26], [x + 13, 31.5], [x + 10, 37], [x + 16, 37]],
                [[x + 13, 24], [x + 13, 30], [x + 13, 36], [x + 13, 42]],
              ];
              return (
                <g key={x} className={RM} style={{ opacity: on ? 1 : 0.25, transform: on ? "translateY(0)" : "translateY(5px)", ...tr("opacity, transform", 460, card * 120) }}>
                  <rect x={x} y="14" width="26" height="36" fill="#000" stroke={INK} strokeWidth=".9" />
                  {layouts[card].map(([cx, cy], cell) => (
                    <polygon key={cell} points={hexPoints(cx, cy, 3)} fill={hatch} stroke={INK} strokeWidth=".5" />
                  ))}
                  <line x1={x + 5} x2={x + 21} y1="46" y2="46" stroke={INK} strokeWidth=".5" strokeOpacity=".5" />
                  <rect x={x} y="14" width="6" height="6" fill={ORANGE} className={RM} style={pop(on, 800 + card * 100)} />
                </g>
              );
            })}
            <g className={RM} style={fade(on, 1100)}>
              <Label x={60} y={61}>
                STRATEGIES
              </Label>
            </g>
          </>
        )}
      </Hatched>
    ),
    aif: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            <Draw d="M45 26C34 10 14 12 18 24C21 32 36 32 44 29" on={on} ms={520} stroke={INK} strokeWidth=".8" />
            <Draw d="M75 26C86 10 106 12 102 24C99 32 84 32 76 29" on={on} ms={520} stroke={INK} strokeWidth=".8" />
            <Draw d="M44 33C36 40 26 44 26 38" on={on} ms={380} delay={260} stroke={INK} strokeWidth=".6" strokeOpacity=".7" />
            <Draw d="M76 33C84 40 94 44 94 38" on={on} ms={380} delay={260} stroke={INK} strokeWidth=".6" strokeOpacity=".7" />
            <polygon points={hexPoints(60, 30, 17)} fill="#000" stroke={INK} strokeWidth="1" />
            <polygon points={hexPoints(60, 30, 13.5)} fill={hatch} stroke={INK} strokeWidth=".5" strokeOpacity=".7" className={RM} style={fade(on, 400, 420)} />
            <polygon points={hexPoints(60, 30, 7.5)} fill={ORANGE} className={RM} style={pop(on, 900, 380, 0.5)} />
            <g className={RM} style={fade(on, 1100)}>
              <Label x={60} y={60}>
                ONE FUND
              </Label>
            </g>
          </>
        )}
      </Hatched>
    ),
  },
  /**
   * Direct demat: the investor is tied straight into a ledger under their own
   * tab, and each holding is entered on it in orange. Fund level: the
   * investor holds only a slip; the ledger carries the fund's tab, and its
   * entries belong to the fund.
   */
  account: {
    pms: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            <Person x={14} y={36} fill={hatch} />
            <Draw d="M25 34H40" on={on} ms={240} stroke={INK} strokeWidth="1" />
            <path d="M40 16V54H112V16H74V7H40V16H74" fill="none" stroke={INK} strokeWidth=".9" />
            <Label x={43} y={13.6} anchor="start">
              DEMAT
            </Label>
            {[26, 36, 46].map((y, row) => (
              <g key={y}>
                <Draw d={`M56 ${y}H106`} on={on} ms={320} delay={250 + row * 110} stroke={INK} strokeWidth=".6" strokeOpacity=".7" />
                <polygon points={hexPoints(48, y, 3.4)} fill={ORANGE} className={RM} style={pop(on, 800 + row * 100)} />
              </g>
            ))}
          </>
        )}
      </Hatched>
    ),
    aif: ({ on }) => (
      <Hatched>
        {(hatch) => (
          <>
            <Person x={14} y={36} fill={hatch} />
            <rect x="26" y="30" width="8" height="10" fill="#000" stroke={INK} strokeWidth=".8" className={RM} style={pop(on, 100)} />
            <path d="M36 35H40" stroke={INK} strokeWidth=".6" strokeDasharray="1 1.2" className={RM} style={fade(on, 300)} />
            <path d="M40 16V54H112V16H74V7H40V16H74" fill="none" stroke={INK} strokeWidth=".9" />
            <Label x={52} y={13.6} anchor="start">
              FUND
            </Label>
            <polygon points={hexPoints(46, 11.5, 3.2)} fill={ORANGE} className={RM} style={pop(on, 1000, 380, 0.4)} />
            {[26, 36, 46].map((y, row) => (
              <g key={y}>
                <Draw d={`M56 ${y}H106`} on={on} ms={320} delay={350 + row * 110} stroke={INK} strokeWidth=".6" strokeOpacity=".7" />
                <polygon points={hexPoints(48, y, 3.4)} fill={hatch} stroke={INK} strokeWidth=".5" className={RM} style={pop(on, 600 + row * 100)} />
              </g>
            ))}
          </>
        )}
      </Hatched>
    ),
  },
};

export const ROW_GLYPHS = PAIRS;
