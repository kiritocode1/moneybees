"use client";

/*
 * The business-model drawings on /case-studies, one per company, each showing
 * what the business does: power from the plant to the grid and to a captive
 * user; molten alloy spun into a tube; steel sheets stacked into a motor core.
 * Drawn as engraved plates (components/drawing/plate.tsx): the construction is
 * there at rest, `on` draws the machine and lands the orange last. `dark`
 * swaps the ink for the black band. The loops stop under reduced motion.
 */

import { useId } from "react";
import { BOX, Draw, Hatch, MOVE, ORANGE, RM, tr } from "@/components/drawing/plate";

const MONO = "var(--font-geist-mono), ui-monospace, monospace";
/** Rounds trig output so the server and the browser print the same attribute. */
const r2 = (value: number) => Math.round(value * 100) / 100;

type DrawingProps = { on: boolean; dark?: boolean };

const inks = (dark?: boolean) => ({ ink: dark ? "#fff" : "#000", ground: dark ? "#000" : "#fff" });

function Label({ x, y, children, ink, anchor = "middle" }: { x: number; y: number; children: string; ink: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="6.4" fill={ink} fillOpacity=".65" fontFamily={MONO} letterSpacing=".12em">
      {children}
    </text>
  );
}

const KEYFRAMES = `
@keyframes cs-flow { to { stroke-dashoffset: -24; } }
@keyframes cs-spin { to { transform: rotate(360deg); } }
@keyframes cs-pour { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
`;

/**
 * KPI Green Energy. The plant's panels and its own evacuation line stand as
 * construction; the line draws from the plant to its tower and splits, one
 * way to the grid (IPP), the other to a factory that uses the power itself
 * (CPP). Orange power then runs along both and lands at each end.
 */
export function PowerDrawing({ on, dark }: DrawingProps) {
  const { ink } = inks(dark);
  const hatch = useId();
  const routes = ["M66 86 H120", "M120 86 C 150 86, 158 52, 194 52", "M120 86 C 150 86, 158 118, 194 118"];
  return (
    <svg viewBox="0 0 240 150" className="block h-auto w-full" aria-hidden="true">
      <style>{KEYFRAMES}</style>
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      <line x1="6" x2="234" y1="126" y2="126" stroke={ink} strokeWidth=".5" strokeOpacity=".4" />
      {/* The sun: a hatched disc with its rays drawn as construction. */}
      <circle cx="30" cy="26" r="8" fill={`url(#${hatch})`} stroke={ink} strokeWidth=".8" />
      {Array.from({ length: 8 }, (_, ray) => {
        const angle = (ray * Math.PI) / 4;
        return <line key={ray} x1={r2(30 + Math.cos(angle) * 11.5)} y1={r2(26 + Math.sin(angle) * 11.5)} x2={r2(30 + Math.cos(angle) * 16)} y2={r2(26 + Math.sin(angle) * 16)} stroke={ink} strokeWidth=".6" strokeOpacity=".7" />;
      })}
      {/* Light falling on the panels. */}
      <path d="M36 38 L44 70 M28 40 L26 70 M42 34 L62 70" stroke={ink} strokeWidth=".5" strokeOpacity=".4" strokeDasharray="1.2 2.4" />
      {[0, 1, 2].map((panel) => (
        <g key={panel}>
          <path d={`M${12 + panel * 18} 96 l8 -22 h14 l-8 22 Z`} fill={`url(#${hatch})`} stroke={ink} strokeWidth=".9" />
          <line x1={20 + panel * 18} x2={20 + panel * 18} y1="96" y2="126" stroke={ink} strokeWidth=".5" strokeOpacity=".5" />
        </g>
      ))}
      <Label x={36} y={140} ink={ink}>
        PLANT
      </Label>
      {/* The evacuation line at rest: faint, dashed. */}
      {routes.map((d) => (
        <path key={d} d={d} fill="none" stroke={ink} strokeWidth=".5" strokeOpacity=".35" strokeDasharray="2 2" />
      ))}
      {/* Its tower. */}
      <path d="M112 126 L120 62 L128 126 M114 110 H126 M116 94 H124 M110 70 H130 M113.4 110 L124 94 M126.6 110 L116 94" fill="none" stroke={ink} strokeWidth=".8" />
      {routes.map((d, index) => (
        <Draw key={d} d={d} on={on} ms={520} delay={index ? 420 + index * 90 : 0} ease={index ? MOVE : undefined} stroke={ink} strokeWidth="1.1" />
      ))}
      {/* Power moving along it, once drawn. */}
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 400, 1050) }}>
        {routes.map((d) => (
          <path key={d} d={d} fill="none" stroke={ORANGE} strokeWidth="2.2" strokeDasharray="4 8" className="animate-[cs-flow_1s_linear_infinite] motion-reduce:animate-none" />
        ))}
      </g>
      {/* The grid, and the captive user. */}
      <path d="M204 66 L210 36 L216 66 M200 42 H220 M203 52 H217 M205.4 52 L214 42 M214.6 52 L206 42" fill="none" stroke={ink} strokeWidth=".8" />
      <Label x={234} y={28} ink={ink} anchor="end">
        IPP · GRID
      </Label>
      <path d="M198 132 V108 l8 6 v-6 l8 6 v-6 l8 6 V132 Z" fill={`url(#${hatch})`} stroke={ink} strokeWidth=".9" />
      <Label x={234} y={144} ink={ink} anchor="end">
        CPP · FACTORY
      </Label>
      {[
        [194, 52],
        [194, 118],
      ].map(([x, y], index) => (
        <rect key={y} x={x - 3} y={y - 3} width="6" height="6" fill={ORANGE} stroke={ink} strokeWidth=".6" className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.6)", ...tr("opacity, transform", 320, 1150 + index * 110) }} />
      ))}
    </svg>
  );
}

/**
 * Uni Abex. Alloy is poured into a mould spinning on its axis; the spin
 * throws it against the wall, where it builds up in orange; the tube that
 * comes out is shown in section, its wall measured.
 */
export function CastingDrawing({ on, dark }: DrawingProps) {
  const { ink, ground } = inks(dark);
  const hatch = useId();
  const wall = on ? 8 : 0.01;
  const grow = { ...tr("height, y", 800, 500), transitionProperty: "height, y" };
  return (
    <svg viewBox="0 0 240 150" className="block h-auto w-full" aria-hidden="true">
      <style>{KEYFRAMES}</style>
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      {/* The ladle and the pour. */}
      <path d="M18 18 h34 l-6 22 h-22 Z" fill={`url(#${hatch})`} stroke={ink} strokeWidth=".9" transform="rotate(18 35 29)" />
      <path d="M52 44 C 58 54, 60 62, 62 70" fill="none" stroke={ORANGE} strokeWidth="2.6" strokeLinecap="round" className="animate-[cs-pour_1.4s_ease-in-out_infinite] motion-reduce:animate-none" />
      {/* The mould in section: steel above and below, the axis through the middle. */}
      <rect x="62" y="66" width="88" height="6" fill={`url(#${hatch})`} stroke={ink} strokeWidth=".7" />
      <rect x="62" y="120" width="88" height="6" fill={`url(#${hatch})`} stroke={ink} strokeWidth=".7" />
      <path d="M48 96 H164" stroke={ink} strokeWidth=".5" strokeOpacity=".55" strokeDasharray="6 2 1 2" />
      <ellipse cx="62" cy="96" rx="12" ry="24" fill="none" stroke={ink} strokeWidth=".5" strokeOpacity=".6" strokeDasharray="3 3" className="animate-[cs-flow_1.2s_linear_infinite] motion-reduce:animate-none" />
      <Draw d="M150 72 a12 24 0 1 1 0 48 a12 24 0 1 1 0 -48" on={on} ms={700} stroke={ink} strokeWidth="1" />
      {/* The spin: an arrowed arc round the axis. */}
      <Draw d="M40 84 a6 12 0 1 0 0 24" on={on} ms={420} delay={200} stroke={ink} strokeWidth=".8" />
      <path d="M37 105 L40 108 L37 111" fill="none" stroke={ink} strokeWidth=".8" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, 600) }} />
      {/* The alloy building up on the wall. */}
      <rect x="62" y="72" width="88" height={wall} fill={ORANGE} className={RM} style={grow} />
      <rect x="62" y={120 - wall} width="88" height={wall} fill={ORANGE} className={RM} style={grow} />
      <Label x={106} y={144} ink={ink}>
        SPINNING MOULD
      </Label>
      {/* The tube that comes out, in section, with its wall measured. */}
      <g className={RM} style={{ opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -14}px)`, ...tr("opacity, transform", 600, 1150, MOVE) }}>
        <path d="M182 84 H222 M182 108 H222" stroke={ink} strokeWidth=".9" />
        <ellipse cx="182" cy="96" rx="5" ry="12" fill="none" stroke={ink} strokeWidth=".7" strokeDasharray="2 2" />
        <ellipse cx="222" cy="96" rx="5" ry="12" fill={ORANGE} stroke={ink} strokeWidth=".9" />
        <ellipse cx="222" cy="96" rx="2.6" ry="7.4" fill={ground} stroke={ink} strokeWidth=".6" />
      </g>
      <Draw d="M222 84 H236 M222 88.6 H236" on={on} ms={260} delay={1650} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 1850) }}>
        <path d="M233 76 V84 M233 96.6 V88.6 M231 81 L233 84 L235 81 M231 91.6 L233 88.6 L235 91.6" fill="none" stroke={ink} strokeWidth=".7" />
        <Label x={233} y={72} ink={ink} anchor="end">
          WALL
        </Label>
      </g>
      <Label x={202} y={128} ink={ink}>
        CASTING
      </Label>
    </svg>
  );
}

const ringSlots = (cx: number, cy: number, r: number, count: number) =>
  Array.from({ length: count }, (_, slot) => {
    const angle = (slot / count) * Math.PI * 2;
    return { x: r2(cx + Math.cos(angle) * r), y: r2(cy + Math.sin(angle) * r), angle: r2((angle * 180) / Math.PI) };
  });

/**
 * Pitti. Thin steel sheets drop, seen edge on, between two guides into a
 * stack, and a dimension line measures it. Face on, the stack is the stator
 * core: a hatched steel ring whose slots fill with orange windings, with a
 * die-cast rotor turning inside.
 */
export function LaminationsDrawing({ on, dark }: DrawingProps) {
  const { ink, ground } = inks(dark);
  const hatch = useId();
  const sheets = 11;
  const base = 118;
  const pitch = 4.4;
  const top = base - sheets * pitch;
  const stacked = 200 + sheets * 60;
  const core = { cx: 180, cy: 72 };
  return (
    <svg viewBox="0 0 240 150" className="block h-auto w-full" aria-hidden="true">
      <style>{KEYFRAMES}</style>
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.2} opacity={0.6} />
      </defs>
      {/* The guides and the bed the sheets settle on. */}
      <path d={`M20 ${base + 1}H90M22 ${base}V24M88 ${base}V24`} stroke={ink} strokeWidth=".5" strokeOpacity=".45" strokeDasharray="4 2 1 2" />
      {Array.from({ length: sheets }, (_, sheet) => (
        <rect
          key={sheet}
          x="24"
          y={base - (sheet + 1) * pitch + 0.8}
          width="62"
          height={pitch - 1.6}
          fill={ground}
          stroke={ink}
          strokeWidth=".7"
          className={RM}
          style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : -18}px)`, ...tr("opacity, transform", 420, 150 + sheet * 60) }}
        />
      ))}
      <Draw d={`M86 ${top}H100M86 ${base}H100`} on={on} ms={240} delay={stacked} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
      <Draw d={`M96 ${top + 1}V${base - 1}`} on={on} ms={360} delay={stacked + 140} stroke={ink} strokeWidth=".8" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, stacked + 420) }}>
        <path d={`M93.6 ${top + 4}L96 ${top}L98.4 ${top + 4}M93.6 ${base - 4}L96 ${base}L98.4 ${base - 4}`} fill="none" stroke={ink} strokeWidth=".8" />
      </g>
      <Label x={55} y={138} ink={ink}>
        LAMINATIONS
      </Label>
      <path d="M108 76 H126 M121 72 l5 4 -5 4" fill="none" stroke={ink} strokeWidth=".8" strokeOpacity=".7" />
      {/* The core, face on: a hatched steel ring with its slots. */}
      <path d={`M${core.cx - 46} ${core.cy}a46 46 0 1 0 92 0a46 46 0 1 0 -92 0ZM${core.cx - 30} ${core.cy}a30 30 0 1 1 60 0a30 30 0 1 1 -60 0Z`} fill={`url(#${hatch})`} fillRule="evenodd" />
      <circle cx={core.cx} cy={core.cy} r="46" fill="none" stroke={ink} strokeWidth="1" />
      <circle cx={core.cx} cy={core.cy} r="30" fill="none" stroke={ink} strokeWidth="1" />
      <circle cx={core.cx} cy={core.cy} r="52" fill="none" stroke={ink} strokeWidth=".5" strokeOpacity=".4" strokeDasharray="1.5 2.5" />
      {ringSlots(core.cx, core.cy, 36, 12).map((slot, index) => (
        <g key={index} transform={`rotate(${r2(slot.angle + 90)} ${slot.x} ${slot.y})`}>
          <rect x={r2(slot.x - 3)} y={r2(slot.y - 5)} width="6" height="10" fill={ground} stroke={ink} strokeWidth=".6" />
          <rect x={r2(slot.x - 2.2)} y={r2(slot.y - 4.2)} width="4.4" height="8.4" fill={ORANGE} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 260, stacked + 200 + index * 45) }} />
        </g>
      ))}
      <g style={{ transformOrigin: `${core.cx}px ${core.cy}px`, transformBox: "view-box" }} className="animate-[cs-spin_6s_linear_infinite] motion-reduce:animate-none">
        <circle cx={core.cx} cy={core.cy} r="24" fill={ground} stroke={ink} strokeWidth=".9" />
        {Array.from({ length: 8 }, (_, bar) => {
          const angle = (bar / 8) * Math.PI * 2;
          return <line key={bar} x1={r2(core.cx + Math.cos(angle) * 8)} y1={r2(core.cy + Math.sin(angle) * 8)} x2={r2(core.cx + Math.cos(angle) * 21)} y2={r2(core.cy + Math.sin(angle) * 21)} stroke={ink} strokeWidth="1.2" />;
        })}
        <circle cx={core.cx} cy={core.cy} r="4" fill={ink} />
      </g>
      <path d={`M${core.cx - 58} ${core.cy}H${core.cx + 58}M${core.cx} ${core.cy - 58}V${core.cy + 58}`} stroke={ink} strokeWidth=".4" strokeOpacity=".4" strokeDasharray="6 2 1 2" />
      <Label x={core.cx} y={138} ink={ink}>
        MOTOR CORE
      </Label>
    </svg>
  );
}

export const DRAWINGS = { power: PowerDrawing, casting: CastingDrawing, laminations: LaminationsDrawing } as const;
