/*
 * The business-model drawings on /case-studies, one per company, each showing
 * what the business does: power from the plant to the grid and to a captive
 * user; molten alloy spun into a tube; steel sheets stacked into a motor core.
 * `on` moves a drawing from resting to explained; `dark` swaps the ink for the
 * black band. The loops stop under reduced motion.
 */

import type { CSSProperties } from "react";

const ORANGE = "#F6A11A";
const T = "transition-[opacity,fill,stroke,fill-opacity,stroke-opacity,stroke-dashoffset,transform,x,y,width,height,r,cx,cy] duration-700 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:!transition-none";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";
/** Rounds trig output so the server and the browser print the same attribute. */
const r2 = (value: number) => Math.round(value * 100) / 100;

type DrawingProps = { on: boolean; dark?: boolean };

const inks = (dark?: boolean) => ({ ink: dark ? "#fff" : "#000", faint: dark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.3)" });

function Label({ x, y, children, fill, anchor = "middle" }: { x: number; y: number; children: string; fill: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="8" fill={fill} fontFamily={MONO} letterSpacing=".1em">
      {children}
    </text>
  );
}

const KEYFRAMES = `
@keyframes cs-flow { to { stroke-dashoffset: -24; } }
@keyframes cs-spin { to { transform: rotate(360deg); } }
@keyframes cs-pour { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
`;

/** KPI Green Energy: a solar plant feeds its own evacuation line, which splits to the grid (IPP) and to a factory (CPP). */
export function PowerDrawing({ on, dark }: DrawingProps) {
  const { ink, faint } = inks(dark);
  const flowing: CSSProperties = { opacity: on ? 1 : 0, transition: "opacity 500ms ease 300ms" };
  return (
    <svg viewBox="0 0 240 150" className="block h-auto w-full" aria-hidden="true">
      <style>{KEYFRAMES}</style>
      {/* The sun and the panels. */}
      <circle cx="30" cy="26" r="9" fill={ORANGE} />
      {Array.from({ length: 8 }, (_, ray) => {
        const angle = (ray * Math.PI) / 4;
        return <line key={ray} x1={r2(30 + Math.cos(angle) * 13)} y1={r2(26 + Math.sin(angle) * 13)} x2={r2(30 + Math.cos(angle) * 17)} y2={r2(26 + Math.sin(angle) * 17)} stroke={ORANGE} strokeWidth="1.4" />;
      })}
      {[0, 1, 2].map((panel) => (
        <path key={panel} d={`M${12 + panel * 18} 96 l8 -22 h14 l-8 22 Z`} fill="none" stroke={ink} strokeWidth="1.2" />
      ))}
      <Label x={36} y={112} fill={faint}>
        PLANT
      </Label>
      {/* The evacuation line, with its own tower. */}
      <path d="M66 86 H120" stroke={ink} strokeWidth="1.2" />
      <path d="M112 118 L120 62 L128 118 M114 104 H126 M116 88 H124 M110 70 H130" fill="none" stroke={ink} strokeWidth="1.1" />
      <path d="M120 86 C 150 86, 158 50, 196 50" fill="none" stroke={ink} strokeWidth="1.2" />
      <path d="M120 86 C 150 86, 158 118, 196 118" fill="none" stroke={ink} strokeWidth="1.2" />
      {/* Power moving along it, once explained. */}
      <g style={flowing}>
        {["M66 86 H120", "M120 86 C 150 86, 158 50, 196 50", "M120 86 C 150 86, 158 118, 196 118"].map((d) => (
          <path key={d} d={d} fill="none" stroke={ORANGE} strokeWidth="2.4" strokeDasharray="4 8" className="animate-[cs-flow_1s_linear_infinite] motion-reduce:animate-none" />
        ))}
      </g>
      {/* The grid, and the captive user. */}
      <path d="M204 64 L210 34 L216 64 M200 40 H220 M203 50 H217" fill="none" stroke={ink} strokeWidth="1.1" />
      <Label x={210} y={26} fill={ORANGE}>
        IPP
      </Label>
      <Label x={210} y={76} fill={faint}>
        GRID
      </Label>
      <path d="M198 132 V108 l8 6 v-6 l8 6 v-6 l8 6 V132 Z" fill={on ? ORANGE : "none"} stroke={ink} strokeWidth="1.1" className={T} />
      <Label x={212} y={100} fill={ORANGE}>
        CPP
      </Label>
      <Label x={212} y={144} fill={faint}>
        FACTORY
      </Label>
    </svg>
  );
}

/** Uni Abex: alloy poured into a spinning mould is thrown against its wall and sets as a tube. */
export function CastingDrawing({ on, dark }: DrawingProps) {
  const { ink, faint } = inks(dark);
  const wall = on ? 9 : 2;
  return (
    <svg viewBox="0 0 240 150" className="block h-auto w-full" aria-hidden="true">
      <style>{KEYFRAMES}</style>
      {/* The ladle and the pour. */}
      <path d="M18 18 h34 l-6 22 h-22 Z" fill="none" stroke={ink} strokeWidth="1.2" transform="rotate(18 35 29)" />
      <path d="M52 44 C 58 54, 60 62, 62 72" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" className="animate-[cs-pour_1.4s_ease-in-out_infinite] motion-reduce:animate-none" />
      {/* The mould: a cylinder on its side, spinning. */}
      <ellipse cx="62" cy="96" rx="12" ry="24" fill="none" stroke={ink} strokeWidth="1.2" />
      <ellipse cx="150" cy="96" rx="12" ry="24" fill="none" stroke={ink} strokeWidth="1.2" />
      <path d="M62 72 H150 M62 120 H150" stroke={ink} strokeWidth="1.2" />
      <rect x="62" y="72" width="88" height={wall} fill={ORANGE} className={T} />
      <rect x="62" y={120 - wall} width="88" height={wall} fill={ORANGE} className={T} />
      <ellipse cx="150" cy="96" rx={12 - wall / 3} ry={24 - wall} fill="none" stroke={ORANGE} strokeWidth={on ? 3 : 0} className={T} />
      <ellipse cx="106" cy="96" rx="58" ry="36" fill="none" stroke={faint} strokeWidth="1" strokeDasharray="4 6" className="animate-[cs-flow_1.2s_linear_infinite] motion-reduce:animate-none" />
      <Label x={106} y={146} fill={faint}>
        SPINNING MOULD
      </Label>
      {/* The tube that comes out. */}
      <g style={{ opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -16}px)`, transition: "opacity 700ms cubic-bezier(.23,1,.32,1) 400ms, transform 700ms cubic-bezier(.23,1,.32,1) 400ms" }} className="motion-reduce:!transition-none">
        <path d="M180 84 H222 M180 108 H222" stroke={ink} strokeWidth="1.2" />
        <ellipse cx="180" cy="96" rx="5" ry="12" fill="none" stroke={ink} strokeWidth="1.2" />
        <ellipse cx="222" cy="96" rx="5" ry="12" fill={ORANGE} stroke={ink} strokeWidth="1.2" />
        <ellipse cx="222" cy="96" rx="2.5" ry="7" fill={dark ? "#000" : "#fff"} />
        <Label x={201} y={128} fill={ORANGE}>
          CASTING
        </Label>
      </g>
    </svg>
  );
}

const ringSlots = (cx: number, cy: number, r: number, count: number) =>
  Array.from({ length: count }, (_, slot) => {
    const angle = (slot / count) * Math.PI * 2;
    return { x: r2(cx + Math.cos(angle) * r), y: r2(cy + Math.sin(angle) * r), angle: r2((angle * 180) / Math.PI) };
  });

/** Pitti: thin steel sheets are stacked into a stator core, with a die-cast rotor turning inside it. */
export function LaminationsDrawing({ on, dark }: DrawingProps) {
  const { ink, faint } = inks(dark);
  const sheets = 8;
  return (
    <svg viewBox="0 0 240 150" className="block h-auto w-full" aria-hidden="true">
      <style>{KEYFRAMES}</style>
      {/* Sheets dropping into a stack. */}
      {Array.from({ length: sheets }, (_, sheet) => {
        const settled = 112 - sheet * 6;
        return (
          <g key={sheet} style={{ transform: `translateY(${on ? 0 : -24 - sheet * 4}px)`, opacity: on ? 1 : 0.25, transition: `opacity 600ms cubic-bezier(.23,1,.32,1) ${sheet * 80}ms, transform 600ms cubic-bezier(.23,1,.32,1) ${sheet * 80}ms` }} className="motion-reduce:!transition-none">
            <ellipse cx="54" cy={settled} rx="38" ry="11" fill={dark ? "#000" : "#fff"} stroke={sheet === sheets - 1 ? ORANGE : ink} strokeWidth="1.1" />
            {sheet === sheets - 1 && <ellipse cx="54" cy={settled} rx="16" ry="4.6" fill="none" stroke={ORANGE} strokeWidth="1.1" />}
          </g>
        );
      })}
      <Label x={54} y={142} fill={faint}>
        LAMINATIONS
      </Label>
      <path d="M100 76 H122 M116 70 l6 6 -6 6" fill="none" stroke={ORANGE} strokeWidth="1.6" style={{ opacity: on ? 1 : 0, transition: "opacity 400ms ease 700ms" }} />
      {/* The core, face on: a slotted ring with the rotor inside. */}
      <circle cx="180" cy="72" r="46" fill="none" stroke={ink} strokeWidth="1.2" />
      <circle cx="180" cy="72" r="30" fill="none" stroke={ink} strokeWidth="1.2" />
      {ringSlots(180, 72, 36, 12).map((slot, index) => (
        <rect key={index} x={r2(slot.x - 3)} y={r2(slot.y - 5)} width="6" height="10" fill={on ? ORANGE : faint} transform={`rotate(${r2(slot.angle + 90)} ${slot.x} ${slot.y})`} style={{ transitionDelay: `${800 + index * 30}ms` }} className={T} />
      ))}
      <g style={{ transformOrigin: "180px 72px", transformBox: "view-box" }} className="animate-[cs-spin_6s_linear_infinite] motion-reduce:animate-none">
        <circle cx="180" cy="72" r="24" fill={dark ? "#000" : "#fff"} stroke={ink} strokeWidth="1.1" />
        {Array.from({ length: 8 }, (_, bar) => {
          const angle = (bar / 8) * Math.PI * 2;
          return <line key={bar} x1={r2(180 + Math.cos(angle) * 8)} y1={r2(72 + Math.sin(angle) * 8)} x2={r2(180 + Math.cos(angle) * 21)} y2={r2(72 + Math.sin(angle) * 21)} stroke={ink} strokeWidth="1.6" />;
        })}
        <circle cx="180" cy="72" r="4" fill={ORANGE} />
      </g>
      <Label x={180} y={142} fill={faint}>
        MOTOR CORE
      </Label>
    </svg>
  );
}

export const DRAWINGS = { power: PowerDrawing, casting: CastingDrawing, laminations: LaminationsDrawing } as const;
