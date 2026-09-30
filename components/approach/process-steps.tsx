"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BOX, Draw, Hatch, MOVE, ORANGE, RM, tr } from "@/components/drawing/plate";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { PROCESS_STEPS } from "@/lib/approach";

/*
 * The plan's "six-step orange-and-black investment process". The band pins
 * while the reader scrolls through it: a track of six hexagons fills in
 * orange, and the step it reaches takes the stage with its own drawing. Every
 * node is a button, so the steps can be read in any order.
 *
 * The step drawings follow the engraved-plate language of
 * components/approach/glyphs.tsx, in white ink for the black band: hairline
 * construction rests on the plate, the step's data plays in when it takes the
 * stage, and orange lands last as the step's result.
 */

const STEPS = PROCESS_STEPS.length;
const INK = "#fff";
const MONO = "var(--font-geist-mono)";

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/** A small mono plate label: one or two descriptive words. */
function Label({ x, y, children, anchor = "start", rotate, opacity = 0.6 }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; rotate?: number; opacity?: number }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize="5.6"
      fill={INK}
      opacity={opacity}
      letterSpacing=".12em"
      fontFamily={MONO}
      transform={rotate === undefined ? undefined : `rotate(${rotate} ${x} ${y})`}
    >
      {children}
    </text>
  );
}

/** Arrives from slightly smaller, for dots, marks and cells landing on the plate. */
const pop = (on: boolean, ms: number, delay: number, from = 0.6) => ({
  ...BOX,
  transformOrigin: "center",
  opacity: on ? 1 : 0,
  transform: on ? "scale(1)" : `scale(${from})`,
  ...tr("opacity, transform", ms, delay),
});

/** An evenly spread but irregular field of companies (the R2 low-discrepancy sequence), so no grid shows through. */
const UNIVERSE = Array.from({ length: 64 }, (_, index) => ({
  x: 28 + (((index + 1) * 0.7548776662) % 1) * 154,
  y: 14 + (((index + 1) * 0.5698402909) % 1) * 104,
  index,
}));

/**
 * Screen. The universe arrives as a scatter on two tick-marked axes; two
 * threshold lines draw across it, the corner beyond both is hatched, and the
 * companies that fall inside it turn orange.
 */
function ScreenPlate({ on }: { on: boolean }) {
  const hatch = useId();
  const cutX = 116;
  const cutY = 56;
  const passes = (dot: { x: number; y: number }) => dot.x > cutX && dot.y < cutY;
  return (
    <svg viewBox="0 0 200 150" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={INK} opacity={0.35} />
      </defs>
      <path d="M20 10V128H190" fill="none" stroke={INK} strokeWidth=".7" strokeOpacity=".55" />
      {Array.from({ length: 9 }, (_, tick) => (
        <line key={`x${tick}`} x1={34 + tick * 19} x2={34 + tick * 19} y1="128" y2="131" stroke={INK} strokeWidth=".5" strokeOpacity=".45" />
      ))}
      {Array.from({ length: 6 }, (_, tick) => (
        <line key={`y${tick}`} x1="17" x2="20" y1={114 - tick * 19} y2={114 - tick * 19} stroke={INK} strokeWidth=".5" strokeOpacity=".45" />
      ))}
      <Label x={20} y={142}>
        UNIVERSE
      </Label>
      <rect x={cutX} y="10" width={190 - cutX} height={cutY - 10} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 420, 1000) }} />
      {UNIVERSE.map((dot) => (
        <circle key={dot.index} cx={dot.x} cy={dot.y} r="1.9" fill="#000" stroke={INK} strokeWidth=".6" strokeOpacity=".8" className={RM} style={pop(on, 280, 40 + dot.index * 9)} />
      ))}
      <Draw d={`M${cutX} 128V10`} on={on} ms={520} delay={650} stroke={INK} strokeWidth=".9" />
      <Draw d={`M20 ${cutY}H190`} on={on} ms={520} delay={760} stroke={INK} strokeWidth=".9" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 1250) }}>
        <Label x={188} y={cutY + 8} anchor="end">
          SCREEN
        </Label>
      </g>
      {UNIVERSE.filter(passes).map((dot, order) => (
        <circle key={dot.index} cx={dot.x} cy={dot.y} r="2.6" fill={ORANGE} className={RM} style={pop(on, 320, 1300 + order * 50, 0.4)} />
      ))}
    </svg>
  );
}

const CRITERIA = ["MANAGEMENT", "FUNDAMENTALS", "EVENTS", "TIMING"] as const;
/** Each candidate's four reviews, true where it holds up. Rows 1 and 4 hold up on all four. */
const REVIEWS = [
  [true, false, true, true],
  [true, true, true, true],
  [false, true, false, true],
  [true, true, false, false],
  [true, true, true, true],
  [true, false, true, false],
] as const;

/**
 * Shortlist. The screened names run down the side and the four reviews across
 * the top; each cell is marked row by row, the names that fail a review fall
 * back, and the ones that hold up on all four move to the shortlist in orange.
 */
function ShortlistPlate({ on }: { on: boolean }) {
  const hatch = useId();
  const cols = [98, 122, 146, 170];
  const rowY = (row: number) => 66 + row * 13;
  return (
    <svg viewBox="0 0 200 150" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={INK} gap={2} opacity={0.6} />
      </defs>
      {CRITERIA.map((name, col) => (
        <Label key={name} x={cols[col] + 2} y={52} rotate={-90}>
          {name}
        </Label>
      ))}
      <path d={`M${cols[0] - 12} 57V${rowY(5) + 6.5}${cols.slice(1).map((x) => `M${x - 12} 57V${rowY(5) + 6.5}`).join("")}M${cols[3] + 12} 57V${rowY(5) + 6.5}`} stroke={INK} strokeWidth=".5" strokeOpacity=".3" />
      {REVIEWS.map((marks, row) => {
        const y = rowY(row);
        const kept = marks.every(Boolean);
        const at = 120 + row * 110;
        return (
          <g key={row}>
            <line x1="14" x2={cols[3] + 12} y1={y + 6.5} y2={y + 6.5} stroke={INK} strokeWidth=".5" strokeOpacity=".3" />
            <g className={RM} style={{ opacity: on && !kept ? 0.35 : 1, ...tr("opacity", 360, at + 420) }}>
              <polygon points={hexPoints(24, y, 4.6)} fill={`url(#${hatch})`} stroke={INK} strokeWidth=".6" />
              <line x1="34" x2="70" y1={y} y2={y} stroke={INK} strokeWidth=".6" strokeOpacity=".5" />
              {marks.map((pass, col) => (
                <g key={col} className={RM} style={pop(on, 240, at + col * 55)}>
                  {pass ? (
                    <circle cx={cols[col]} cy={y} r="1.8" fill={INK} />
                  ) : (
                    <path d={`M${cols[col] - 2} ${y - 2}l4 4m0-4l-4 4`} stroke={INK} strokeWidth=".7" />
                  )}
                </g>
              ))}
            </g>
            {kept && (
              <g className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "translateX(0)" : "translateX(-8px)", ...tr("opacity, transform", 460, 900 + row * 110) }}>
                <polygon points={hexPoints(cols[3] + 21, y, 4.6)} fill={ORANGE} />
              </g>
            )}
          </g>
        );
      })}
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 1500) }}>
        <Label x={cols[3] + 26} y={rowY(5) + 17} anchor="end">
          SHORTLIST
        </Label>
      </g>
    </svg>
  );
}

/**
 * Analyse. One company among its peers is ringed and pulled out into a detail
 * view, as on an engineering drawing; inside it the model builds year by year
 * against the peers' line, and the company and its latest year turn orange.
 */
function AnalysePlate({ on }: { on: boolean }) {
  const hatch = useId();
  const peers = [18, 32, 46, 60, 74];
  const subject = 46;
  const py = 108;
  const cx = 142;
  const cy = 62;
  const R = 46;
  const bars = [14, 19, 17, 25, 31];
  const base = cy + 24;
  return (
    <svg viewBox="0 0 200 150" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={INK} gap={2.2} opacity={0.6} />
      </defs>
      {peers.map((x) => (
        <polygon key={x} points={hexPoints(x, py, 5.6)} fill={x === subject ? "none" : `url(#${hatch})`} stroke={INK} strokeWidth=".6" strokeOpacity=".8" />
      ))}
      <line x1="10" x2="82" y1={py + 10} y2={py + 10} stroke={INK} strokeWidth=".5" strokeOpacity=".4" />
      <Label x={46} y={py + 20} anchor="middle">
        PEERS
      </Label>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeWidth=".5" strokeOpacity=".3" strokeDasharray="1.2 2.2" />
      {/* The detail ring, the leader, then the detail view. */}
      <Draw d={`M${subject} ${py - 10}a10 10 0 1 1 0 20a10 10 0 1 1 0-20`} on={on} ms={420} stroke={INK} strokeWidth=".8" />
      <Draw d={`M${subject + 7} ${py - 7}L${cx - R * 0.72} ${cy + R * 0.69}`} on={on} ms={380} delay={320} stroke={INK} strokeWidth=".6" />
      <Draw d={`M${cx} ${cy - R}a${R} ${R} 0 1 1 0 ${2 * R}a${R} ${R} 0 1 1 0 ${-2 * R}`} on={on} ms={620} delay={560} stroke={INK} strokeWidth=".9" />
      <line x1={cx - 30} x2={cx + 30} y1={base} y2={base} stroke={INK} strokeWidth=".6" strokeOpacity=".5" />
      {bars.map((height, index) => {
        const x = cx - 26 + index * 11;
        const last = index === bars.length - 1;
        return (
          <rect
            key={index}
            x={x}
            y={base - height * 1.3}
            width="7"
            height={height * 1.3}
            fill={last ? ORANGE : `url(#${hatch})`}
            stroke={last ? "none" : INK}
            strokeWidth=".6"
            className={RM}
            style={{ ...BOX, transformOrigin: "bottom", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 420, last ? 1380 : 900 + index * 80) }}
          />
        );
      })}
      <Draw d={`M${cx - 32} ${base - 26}H${cx + 32}`} on={on} ms={420} delay={1240} stroke={INK} strokeWidth=".6" strokeOpacity=".8" />
      <polygon points={hexPoints(subject, py, 5.6)} fill={ORANGE} className={RM} style={pop(on, 360, 1380, 0.7)} />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 1200) }}>
        <Label x={cx} y={base + 10} anchor="middle">
          MODEL
        </Label>
      </g>
    </svg>
  );
}

/**
 * Decision making. A beam balance: the risk goes on one pan and the reward on
 * the other, and the beam tips toward the reward against the level line.
 */
function DecisionPlate({ on }: { on: boolean }) {
  const hatch = useId();
  const pivot = { x: 100, y: 40 };
  const arm = 58;
  const tilt = 7;
  const drop = arm * Math.sin((tilt * Math.PI) / 180);
  const travel = tr("transform", 900, 900, MOVE);
  /** A pan hanging from a beam end, carrying its weight and label. */
  const pan = (side: -1 | 1, weight: ReactNode, name: string) => (
    <g transform={`translate(${pivot.x + side * arm} ${pivot.y})`}>
      <g className={RM} style={{ transform: `translateY(${on ? side * drop : 0}px)`, ...travel }}>
        <path d="M0 0L-15 36M0 0L15 36" stroke={INK} strokeWidth=".5" strokeOpacity=".7" />
        <path d="M-17 36h34a17 6 0 0 1-34 0Z" fill={`url(#${hatch})`} stroke={INK} strokeWidth=".7" />
        {weight}
        <Label x={0} y={56} anchor="middle">
          {name}
        </Label>
      </g>
    </g>
  );
  return (
    <svg viewBox="0 0 200 150" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={INK} gap={2.2} opacity={0.55} />
      </defs>
      {/* Stand, base and the level line the tilt is read against. */}
      <path d={`M${pivot.x} ${pivot.y}V124M86 124L${pivot.x} ${pivot.y + 12}L114 124`} fill="none" stroke={INK} strokeWidth=".8" />
      <rect x="70" y="124" width="60" height="6" fill={`url(#${hatch})`} stroke={INK} strokeWidth=".6" />
      <line x1="30" x2="170" y1={pivot.y} y2={pivot.y} stroke={INK} strokeWidth=".5" strokeOpacity=".4" strokeDasharray="1.5 2" />
      <g className={RM} style={{ transformOrigin: `${pivot.x}px ${pivot.y}px`, transform: `rotate(${on ? tilt : 0}deg)`, ...travel }}>
        <line x1={pivot.x - arm} x2={pivot.x + arm} y1={pivot.y} y2={pivot.y} stroke={INK} strokeWidth="1.1" />
        {Array.from({ length: 13 }, (_, tick) => (
          <line key={tick} x1={pivot.x - arm + tick * (arm / 6)} x2={pivot.x - arm + tick * (arm / 6)} y1={pivot.y - 2.4} y2={pivot.y} stroke={INK} strokeWidth=".5" strokeOpacity=".6" />
        ))}
      </g>
      <circle cx={pivot.x} cy={pivot.y} r="2.2" fill="#000" stroke={INK} strokeWidth=".8" />
      {pan(
        -1,
        <rect x="-6" y="27" width="12" height="9" fill={`url(#${hatch})`} stroke={INK} strokeWidth=".7" className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(-8px)", ...tr("opacity, transform", 380, 150) }} />,
        "RISK",
      )}
      {pan(
        1,
        <rect x="-9" y="20" width="18" height="16" fill={ORANGE} className={RM} style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(-8px)", ...tr("opacity, transform", 380, 480) }} />,
        "REWARD",
      )}
    </svg>
  );
}

/** Blips on the monitor, as [angle from twelve o'clock, radius], one run per quadrant. */
const BLIPS: [number, number][] = [
  [22, 40], [50, 22], [74, 48],
  [108, 30], [138, 46], [162, 16],
  [198, 42], [228, 26], [254, 50],
  [292, 18], [316, 44], [342, 32],
];

/**
 * Monitor. A sweep arm turns once round the company; news, results,
 * management and the business each sit in their own quadrant and light up as
 * the arm passes them, and the company at the centre turns orange.
 */
function MonitorPlate({ on }: { on: boolean }) {
  const hatch = useId();
  const cx = 100;
  const cy = 74;
  const R = 54;
  const sweep = 1500;
  const start = 150;
  const at = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)] as const;
  };
  const [wx, wy] = at(-28, R);
  return (
    <svg viewBox="0 0 200 150" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={INK} opacity={0.5} />
      </defs>
      {[18, 36, R].map((radius) => (
        <circle key={radius} cx={cx} cy={cy} r={radius} fill="none" stroke={INK} strokeWidth={radius === R ? ".8" : ".5"} strokeOpacity={radius === R ? ".8" : ".35"} />
      ))}
      <path d={`M${cx - R - 4} ${cy}H${cx + R + 4}M${cx} ${cy - R - 4}V${cy + R + 4}`} stroke={INK} strokeWidth=".5" strokeOpacity=".35" />
      {Array.from({ length: 36 }, (_, tick) => {
        const [x1, y1] = at(tick * 10, R);
        const [x2, y2] = at(tick * 10, R + (tick % 9 === 0 ? 5 : 2.6));
        return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth=".5" strokeOpacity=".55" />;
      })}
      <Label x={8} y={12}>
        NEWS
      </Label>
      <Label x={192} y={12} anchor="end">
        RESULTS
      </Label>
      <Label x={8} y={144}>
        MANAGEMENT
      </Label>
      <Label x={192} y={144} anchor="end">
        BUSINESS
      </Label>
      {/* The arm and its hatched wake turn one full circle, at an even pace so each blip lights as it is passed. */}
      <g className={RM} style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${on ? 360 : 0}deg)`, ...tr("transform", sweep, start, "linear") }}>
        <path d={`M${cx} ${cy}L${wx} ${wy}A${R} ${R} 0 0 1 ${cx} ${cy - R}Z`} fill={`url(#${hatch})`} />
        <line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke={INK} strokeWidth="1" />
      </g>
      {BLIPS.map(([angle, radius]) => {
        const [x, y] = at(angle, radius);
        const delay = start + (angle / 360) * sweep;
        return (
          <g key={angle} className={RM} style={pop(on, 260, delay, 0.3)}>
            <circle cx={x} cy={y} r="4" fill="none" stroke={INK} strokeWidth=".5" strokeOpacity=".6" />
            <circle cx={x} cy={y} r="1.6" fill={INK} />
          </g>
        );
      })}
      <polygon points={hexPoints(cx, cy, 7)} fill={ORANGE} className={RM} style={pop(on, 420, start + sweep, 0.7)} />
    </svg>
  );
}

/**
 * Exit. From the entry the holding runs to a fork: on one branch it reaches
 * the objective, on the other it breaks through the thesis line. Either way
 * the exit is marked in orange and the position leaves the plate.
 */
function ExitPlate({ on }: { on: boolean }) {
  const hatch = useId();
  const objective = 30;
  const thesis = 112;
  const fork = "M22 88L38 80L52 84L70 72";
  const up = "M70 72L84 62L96 66L110 48L124 52L142 30";
  const down = "M70 72L84 80L98 76L110 92L124 88L138 112";
  const exits = [
    { x: 142, y: objective, delay: 1150 },
    { x: 138, y: thesis, delay: 1150 },
  ];
  return (
    <svg viewBox="0 0 200 150" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={INK} opacity={0.4} />
      </defs>
      <line x1="14" x2="190" y1="132" y2="132" stroke={INK} strokeWidth=".6" strokeOpacity=".5" />
      {Array.from({ length: 9 }, (_, tick) => (
        <line key={tick} x1={22 + tick * 21} x2={22 + tick * 21} y1="132" y2="135" stroke={INK} strokeWidth=".5" strokeOpacity=".45" />
      ))}
      <line x1="14" x2="190" y1={objective} y2={objective} stroke={INK} strokeWidth=".6" strokeOpacity=".6" strokeDasharray="2.4 1.8" />
      <Label x={14} y={objective - 5}>
        OBJECTIVE
      </Label>
      <rect x="14" y={thesis} width="176" height="14" fill={`url(#${hatch})`} />
      <line x1="14" x2="190" y1={thesis} y2={thesis} stroke={INK} strokeWidth=".6" strokeOpacity=".6" />
      <Label x={14} y={thesis - 5}>
        THESIS
      </Label>
      <circle cx="22" cy="88" r="2.6" fill="#000" stroke={INK} strokeWidth=".8" />
      <Draw d={fork} on={on} ms={460} delay={100} ease="linear" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      <Draw d={up} on={on} ms={600} delay={560} ease="linear" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      <Draw d={down} on={on} ms={600} delay={560} ease="linear" stroke={INK} strokeOpacity=".55" strokeWidth=".8" strokeLinejoin="round" />
      {exits.map(({ x, y, delay }) => (
        <g key={y}>
          <circle cx={x} cy={y} r="3.4" fill={ORANGE} className={RM} style={pop(on, 360, delay, 0.5)} />
          <Draw d={`M${x + 6} ${y}H182`} on={on} ms={380} delay={delay + 200} stroke={INK} strokeWidth=".8" />
          <path d={`M178 ${y - 3}L182 ${y}L178 ${y + 3}`} fill="none" stroke={INK} strokeWidth=".8" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, delay + 520) }} />
        </g>
      ))}
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 1700) }}>
        <Label x={190} y={objective + 12} anchor="end">
          EXIT
        </Label>
        <Label x={190} y={thesis - 6} anchor="end">
          EXIT
        </Label>
      </g>
    </svg>
  );
}

const PLATES = [ScreenPlate, ShortlistPlate, AnalysePlate, DecisionPlate, MonitorPlate, ExitPlate] as const;

/**
 * The drawing for the step on stage. The stage remounts on every step change,
 * so each plate rests for one frame and then plays.
 */
function StepGlyph({ step }: { step: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setOn(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);
  const Plate = PLATES[step] ?? ExitPlate;
  return <Plate on={on} />;
}

export default function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Only the step index lives in state, so scrolling re-renders six times, not every frame.
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => setActive(Math.max(0, Math.min(STEPS - 1, Math.floor(value * STEPS)))));
  const step = PROCESS_STEPS[active];

  /** Scrolls the page to the middle of a step's stretch of the pin. */
  const goTo = (index: number) => {
    const node = ref.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY;
    const travel = node.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((index + 0.5) / STEPS) * travel, behavior: "smooth" });
  };

  return (
    <section id="process" aria-labelledby="process-heading" className="scroll-mt-0 bg-black text-white">
      <div ref={ref} className="relative h-[520svh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className={`${COLUMN} pt-[72px]`}>
            <div className="flex items-end justify-between gap-8">
              <div>
                <BracketLabel>Our process</BracketLabel>
                <h2 id="process-heading" className={`mt-[14px] ${SUBHEAD}`}>
                  Stock Selection Process
                </h2>
              </div>
              <span className={`${EYEBROW} shrink-0 text-white/50 max-md:hidden`}>
                Step {active + 1} of {STEPS}
              </span>
            </div>

            {/* The track: six nodes on a line that fills orange up to the step in view. */}
            <div className="relative mt-[48px] max-md:mt-[32px]">
              <div className="absolute top-1/2 right-[18px] left-[18px] h-[2px] -translate-y-1/2 bg-white/15" />
              <div
                className="absolute top-1/2 right-[18px] left-[18px] h-[2px] origin-left -translate-y-1/2 bg-[#F6A11A] motion-reduce:!transition-none"
                style={{ transform: `scaleX(${active / (STEPS - 1)})`, transition: "transform 500ms cubic-bezier(.22,1,.36,1)" }}
              />
              <ol className="relative m-0 flex list-none justify-between p-0">
                {PROCESS_STEPS.map((item, index) => {
                  const passed = index < active;
                  const current = index === active;
                  return (
                    <li key={item.name} className="flex flex-col items-center">
                      <button type="button" onClick={() => goTo(index)} aria-current={current ? "step" : undefined} aria-label={`Step ${index + 1}, ${item.name}`} className="block">
                        <svg viewBox="0 0 36 36" className="h-[36px] w-[36px]">
                          <polygon
                            points={hexPoints(18, 18, 16)}
                            fill={current ? ORANGE : passed ? "#000" : "#000"}
                            stroke={current || passed ? ORANGE : "rgba(255,255,255,.3)"}
                            strokeWidth="1.5"
                            style={{ transition: "fill 300ms ease, stroke 300ms ease" }}
                          />
                          <text x="18" y="22" textAnchor="middle" fontSize="11" fill={current ? "#000" : passed ? ORANGE : "rgba(255,255,255,.6)"} fontFamily="var(--font-geist-mono), ui-monospace, monospace">
                            {index + 1}
                          </text>
                        </svg>
                      </button>
                      <span className={`mt-[10px] text-[13px] transition-colors max-md:hidden ${current ? "text-white" : "text-white/45"}`}>{item.name}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* The stage: the step in view, its words beside its drawing. */}
            <div key={step.name} className="mt-[56px] grid animate-[approach-count_500ms_cubic-bezier(.22,1,.36,1)] grid-cols-1 items-center gap-10 motion-reduce:animate-none md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-16 max-md:mt-[36px] max-md:gap-6">
              <div>
                <div className="flex items-baseline gap-[18px]">
                  <span className="text-[clamp(3.4rem,7vw,6.4rem)] leading-none font-light tracking-[-.05em] text-[#F6A11A] tabular-nums">{String(active + 1).padStart(2, "0")}</span>
                  <h3 className="font-serif text-[clamp(2.2rem,1.4rem+2.6vw,4rem)] leading-none font-normal tracking-[-.02em]">{step.name}</h3>
                </div>
                <p className={`mt-[24px] max-w-[560px] text-white/75 ${BODY}`}>{step.text}</p>
              </div>
              <div className="mx-auto w-full max-w-[420px] border border-white/15 p-[28px] max-md:max-w-[280px] max-md:p-[18px]">
                <StepGlyph step={active} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
