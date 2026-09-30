"use client";

import { useId } from "react";
import { BOX, Draw, Hatch, MOVE, ORANGE, OUT, RM, tr } from "@/components/drawing/plate";
import type { DocumentGlyph as DocumentKind } from "@/lib/investor-centre";

export { ORANGE };

/*
 * The drawings on /investor-centre, in the engraved-plate language of
 * components/approach/glyphs.tsx: hairline construction first, hatching for
 * grey, orange last as the answer. The hero files loose papers into one
 * register; the two logins draw who each door is for; each document group
 * draws what its documents do for the investor. `on` plays a drawing from its
 * construction to its explained state; reduced motion jumps to the end.
 */

const MONO = "var(--font-geist-mono), ui-monospace, monospace";

/** A small engraved label: mono, spaced, one or two words. */
function Label({ x, y, ink, children, size = 5.4, anchor = "middle", rotate }: { x: number; y: number; ink: string; children: string; size?: number; anchor?: "start" | "middle" | "end"; rotate?: number }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fill={ink}
      opacity=".6"
      letterSpacing=".12em"
      fontFamily={MONO}
      transform={rotate === undefined ? undefined : `rotate(${rotate} ${x} ${y})`}
    >
      {children}
    </text>
  );
}

/** Two arrowheads for a dimension line between (x, y1) and (x, y2), vertical. */
const vArrows = (x: number, y1: number, y2: number, s = 2.2) => `M${x - s * 0.75} ${y1 + s * 1.3}L${x} ${y1}L${x + s * 0.75} ${y1 + s * 1.3}M${x - s * 0.75} ${y2 - s * 1.3}L${x} ${y2}L${x + s * 0.75} ${y2 - s * 1.3}`;
/** The same, horizontal, between (x1, y) and (x2, y). */
const hArrows = (y: number, x1: number, x2: number, s = 2.2) => `M${x1 + s * 1.3} ${y - s * 0.75}L${x1} ${y}L${x1 + s * 1.3} ${y + s * 0.75}M${x2 - s * 1.3} ${y - s * 0.75}L${x2} ${y}L${x2 - s * 1.3} ${y + s * 0.75}`;

const hexAttr = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/** The register's five sections, in the page's order. */
const SECTIONS = ["CHARTER", "DISCLOSURES", "GRIEVANCE", "FORMS", "LOGINS"] as const;

/** Where each loose card starts, and its tilt, before it is filed. */
const SCATTER = [
  [18, 44, -12],
  [384, 26, 9],
  [30, 170, 7],
  [396, 140, -8],
  [372, 238, 11],
] as const;

/**
 * Investor information in one place. Loose cards lie scattered on the left;
 * a register with one row per section of the page stands on the right; each
 * card travels into its own row and squares up; the spine fills orange and a
 * dimension spans the whole register.
 */
export function GatherGlyph({ on }: { on: boolean }) {
  const hatch = useId();
  const ink = "#000";
  const frame = { x: 146, y: 40, w: 178, h: 224 };
  const rowY = (index: number) => frame.y + 12 + index * 42;
  const card = { w: 64, h: 36 };
  const slotX = frame.x + 22;
  const filed = 250 + SCATTER.length * 130 + 900;
  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={3.2} opacity={0.5} />
      </defs>
      {/* Construction: the register, its spine, its rows, and an empty slot in each. */}
      <Draw d={`M${frame.x} ${frame.y}H${frame.x + frame.w}V${frame.y + frame.h}H${frame.x}Z`} on={on} ms={700} stroke={ink} strokeWidth="1.2" />
      <rect x={frame.x} y={frame.y} width="12" height={frame.h} fill={`url(#${hatch})`} stroke={ink} strokeWidth=".8" />
      {SECTIONS.map((section, index) => (
        <g key={section}>
          {index > 0 && <line x1={frame.x + 12} x2={frame.x + frame.w} y1={rowY(index) - 3} y2={rowY(index) - 3} stroke={ink} strokeWidth=".6" strokeOpacity=".4" />}
          <rect x={slotX} y={rowY(index) + 0.5} width={card.w} height={card.h - 1} fill="none" stroke={ink} strokeWidth=".6" strokeOpacity=".45" strokeDasharray="2 3" />
          <Label x={slotX + card.w + 12} y={rowY(index) + card.h / 2 + 3} ink={ink} size={8.4} anchor="start">
            {section}
          </Label>
        </g>
      ))}
      {/* The cards: each travels on two curves, so its path bends, and squares up as it lands. */}
      {SCATTER.map(([x, y, turn], index) => {
        const delay = 250 + index * 130;
        return (
          <g key={index} className={RM} style={{ transform: `translateX(${on ? slotX : x}px)`, ...tr("transform", 900, delay, MOVE) }}>
            <g className={RM} style={{ transform: `translateY(${on ? rowY(index) : y}px)`, ...tr("transform", 900, delay, OUT) }}>
              <g className={RM} style={{ ...BOX, transformOrigin: "center", transform: `rotate(${on ? 0 : turn}deg)`, ...tr("transform", 900, delay, OUT) }}>
                <rect width={card.w} height={card.h} fill="#fff" stroke={ink} strokeWidth="1" />
                <rect width="10" height={card.h} fill={`url(#${hatch})`} stroke={ink} strokeWidth=".6" />
                <path d={`M16 11H56M16 18H52M16 25H40`} stroke={ink} strokeWidth=".8" strokeOpacity=".45" />
              </g>
            </g>
          </g>
        );
      })}
      {/* The answer: the spine fills, and one dimension spans every section. */}
      <rect x={frame.x} y={frame.y} width="12" height={frame.h} fill={ORANGE} stroke={ink} strokeWidth=".8" className={RM} style={{ ...BOX, transformOrigin: "top", transform: on ? "scaleY(1)" : "scaleY(0)", ...tr("transform", 700, filed, MOVE) }} />
      <Draw d={`M${frame.x + frame.w} ${frame.y}H${frame.x + frame.w + 22}M${frame.x + frame.w} ${frame.y + frame.h}H${frame.x + frame.w + 22}`} on={on} ms={260} delay={filed} stroke={ink} strokeWidth=".6" strokeOpacity=".7" />
      <Draw d={`M${frame.x + frame.w + 16} ${frame.y + 1}V${frame.y + frame.h - 1}`} on={on} ms={600} delay={filed + 200} stroke={ink} strokeWidth=".9" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 260, filed + 750) }}>
        <path d={vArrows(frame.x + frame.w + 16, frame.y, frame.y + frame.h, 3.4)} fill="none" stroke={ink} strokeWidth=".9" />
        <Label x={frame.x + frame.w + 29} y={frame.y + frame.h / 2} ink={ink} size={8.4} rotate={90}>
          ONE PLACE
        </Label>
      </g>
    </svg>
  );
}

/**
 * Client Login. The client, a lock, and their own portfolio behind it: the
 * line reaches the lock, the shackle lifts, and the portfolio draws itself in
 * with today's value in orange.
 */
export function ClientGlyph({ on }: { on: boolean }) {
  const hatch = useId();
  const ink = "#000";
  const points: [number, number][] = [
    [118, 80], [131, 72], [144, 76], [157, 62], [170, 56], [183, 40],
  ];
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join("");
  const area = `${line}L183 88L118 88Z`;
  const last = points[points.length - 1];
  return (
    <svg viewBox="0 0 200 110" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.4} opacity={0.55} />
      </defs>
      {/* The client. */}
      <circle cx="24" cy="42" r="9" fill={`url(#${hatch})`} stroke={ink} strokeWidth="1.1" />
      <path d="M8 76a16 15 0 0 1 32 0Z" fill={`url(#${hatch})`} stroke={ink} strokeWidth="1.1" />
      <Label x={24} y={92} ink={ink}>
        CLIENT
      </Label>
      <Draw d="M44 60H71" on={on} ms={420} stroke={ink} strokeWidth=".9" />
      {/* The lock: its shackle lifts once the line arrives. */}
      <path
        d="M76 54V48a6 6 0 0 1 12 0V54"
        fill="none"
        stroke={ink}
        strokeWidth="1.2"
        className={RM}
        style={{ transform: on ? "translateY(-4px)" : "translateY(0)", ...tr("transform", 380, 480) }}
      />
      <rect x="72" y="54" width="20" height="15" fill="#fff" stroke={ink} strokeWidth="1.2" />
      <circle cx="82" cy="60" r="1.8" fill={ink} />
      <path d="M82 61.5V65" stroke={ink} strokeWidth="1.2" />
      <Draw d="M93 60H106" on={on} ms={260} delay={780} stroke={ink} strokeWidth=".9" />
      {/* The portfolio: its frame is there from the start; the holdings draw in once the lock is open. */}
      <rect x="108" y="12" width="84" height="86" fill="#fff" stroke={ink} strokeWidth="1" />
      <line x1="108" x2="192" y1="23" y2="23" stroke={ink} strokeWidth=".6" strokeOpacity=".6" />
      <Label x={112} y={19.8} ink={ink} anchor="start">
        PORTFOLIO
      </Label>
      <line x1="114" x2="188" y1="88" y2="88" stroke={ink} strokeWidth=".6" strokeOpacity=".5" />
      {points.map(([x]) => (
        <line key={x} x1={x} x2={x} y1="88" y2="90.4" stroke={ink} strokeWidth=".5" strokeOpacity=".5" />
      ))}
      <path d={area} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 600, 1300) }} />
      <Draw d={line} on={on} ms={800} delay={950} ease="linear" stroke={ink} strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3.4" fill={ORANGE} stroke={ink} strokeWidth=".7" className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 320, 1760) }} />
    </svg>
  );
}

/**
 * Distributor Login, on black. One distributor, and a line to each of their
 * clients; a dimension takes in every client at once, and the distributor
 * fills orange: one login sees them all.
 */
export function DistributorGlyph({ on, ink = "#fff" }: { on: boolean; ink?: string }) {
  const hatch = useId();
  const hub = [40, 52] as const;
  const clients = [14, 33, 52, 71, 90].map((y) => [150, y] as const);
  return (
    <svg viewBox="0 0 200 110" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.4} opacity={0.6} />
      </defs>
      <circle cx={hub[0]} cy={hub[1]} r="11" fill={`url(#${hatch})`} stroke={ink} strokeWidth="1.1" />
      <circle cx={hub[0]} cy={hub[1]} r="16" fill="none" stroke={ink} strokeWidth=".5" strokeDasharray="1.2 2" strokeOpacity=".7" />
      <Label x={hub[0]} y={86} ink={ink}>
        DISTRIBUTOR
      </Label>
      {clients.map(([x, y], index) => (
        <g key={y}>
          <Draw d={`M${hub[0] + 12} ${hub[1]}L${x - 6} ${y}`} on={on} ms={520} delay={index * 90} stroke={ink} strokeWidth=".7" strokeOpacity=".75" />
          <g className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 320, 420 + index * 90) }}>
            <circle cx={x} cy={y} r="5.2" fill={`url(#${hatch})`} stroke={ink} strokeWidth="1" />
          </g>
        </g>
      ))}
      {/* Every client, measured as one span. */}
      <Draw d="M158 8H172M158 96H172" on={on} ms={240} delay={950} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
      <Draw d="M168 9V95" on={on} ms={480} delay={1100} stroke={ink} strokeWidth=".8" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 1500) }}>
        <path d={vArrows(168, 8, 96)} fill="none" stroke={ink} strokeWidth=".8" />
        <Label x={178} y={52} ink={ink} rotate={90}>
          CLIENTS
        </Label>
      </g>
      <circle cx={hub[0]} cy={hub[1]} r="11" fill={ORANGE} stroke={ink} strokeWidth="1.1" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 380, 1550) }} />
    </svg>
  );
}

/* ---------- The document drawings, one per kind, all on a 150 x 90 plate. ---------- */

type PlateProps = { on: boolean; ink: string; hatch: string };

/**
 * Investor Charter. A page of numbered articles; from every article a line
 * runs out to the investor, and the investor fills orange: the charter sets
 * out what each investor is owed.
 */
function CharterPlate({ on, ink, hatch }: PlateProps) {
  const articles = [22, 32, 42, 52, 62];
  const node = [118, 42] as const;
  return (
    <g>
      <Draw d="M12 8H50L60 18V80H12Z" on={on} ms={520} stroke={ink} strokeWidth="1" />
      <path d="M50 8V18H60" fill="none" stroke={ink} strokeWidth=".6" />
      {articles.map((y, index) => (
        <g key={y}>
          <rect x="17" y={y - 1.6} width="3.2" height="3.2" fill={ink} className={RM} style={{ opacity: on ? 1 : 0.3, ...tr("opacity", 200, 250 + index * 80) }} />
          <Draw d={`M24 ${y}H${index === articles.length - 1 ? 42 : 54}`} on={on} ms={260} delay={250 + index * 80} stroke={ink} strokeWidth=".7" strokeOpacity=".6" />
          <Draw d={`M61 ${y}L${node[0] - 10} ${node[1]}`} on={on} ms={420} delay={800 + index * 70} stroke={ink} strokeWidth=".5" strokeOpacity=".8" />
        </g>
      ))}
      <circle cx={node[0]} cy={node[1]} r="13" fill="none" stroke={ink} strokeWidth=".5" strokeDasharray="1.2 2" strokeOpacity=".7" />
      <circle cx={node[0]} cy={node[1]} r="9" fill={`url(#${hatch})`} stroke={ink} strokeWidth="1" />
      <circle cx={node[0]} cy={node[1]} r="9" fill={ORANGE} stroke={ink} strokeWidth="1" className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.8)", ...tr("opacity, transform", 380, 1350) }} />
      <Label x={node[0]} y={68} ink={ink}>
        INVESTOR
      </Label>
    </g>
  );
}

/**
 * Disclosures. A page lies under a hatched cover; the cover is lifted off and
 * slides away; every line underneath is shown, the one that matters in
 * orange, and a dimension confirms the whole page is open.
 */
function UncoverPlate({ on, ink, hatch, marked = 2 }: PlateProps & { marked?: number }) {
  const page = { x: 38, y: 6, w: 72, h: 64 };
  const lines = [18, 27, 36, 45, 54];
  return (
    <g>
      <rect x={page.x} y={page.y} width={page.w} height={page.h} fill="#fff" stroke={ink} strokeWidth="1" />
      {lines.map((y, index) =>
        index === marked ? (
          <rect key={y} x={page.x + 8} y={y - 1.8} width="48" height="3.6" fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 460, 1150) }} />
        ) : (
          <line key={y} x1={page.x + 8} x2={page.x + (index === lines.length - 1 ? 38 : 60)} y1={y} y2={y} stroke={ink} strokeWidth=".8" strokeOpacity=".55" />
        ),
      )}
      {/* The cover: lifts, slides clear to the right, and fades as it goes. */}
      <g className={RM} style={{ transform: on ? "translateX(74px)" : "translateX(0)", opacity: on ? 0 : 1, transitionProperty: "transform, opacity", transitionDuration: "950ms, 500ms", transitionDelay: "150ms, 650ms", transitionTimingFunction: `${MOVE}, ${OUT}` }}>
        <rect x={page.x - 2} y={page.y - 2} width={page.w + 4} height={page.h + 4} fill="#F7F7F8" />
        <rect x={page.x - 2} y={page.y - 2} width={page.w + 4} height={page.h + 4} fill={`url(#${hatch})`} stroke={ink} strokeWidth="1" />
      </g>
      <Draw d={`M${page.x} ${page.y + page.h + 3}V${page.y + page.h + 10}M${page.x + page.w} ${page.y + page.h + 3}V${page.y + page.h + 10}`} on={on} ms={220} delay={1250} stroke={ink} strokeWidth=".5" strokeOpacity=".7" />
      <Draw d={`M${page.x + 1} ${page.y + page.h + 7}H${page.x + page.w - 1}`} on={on} ms={420} delay={1380} stroke={ink} strokeWidth=".7" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 1700) }}>
        <path d={hArrows(page.y + page.h + 7, page.x, page.x + page.w)} fill="none" stroke={ink} strokeWidth=".7" />
        <Label x={page.x + page.w / 2} y={88} ink={ink}>
          IN FULL
        </Label>
      </g>
    </g>
  );
}

/**
 * Grievance Redressal. Three levels, one above the other; a complaint runs
 * along the first, is not settled there, climbs to the next, and is resolved
 * in orange; the level above stays drawn, dashed, still open to it.
 */
function GrievancePlate({ on, ink }: PlateProps) {
  const levels = [
    { y: 70, name: "FIRM" },
    { y: 46, name: "SCORES" },
    { y: 22, name: "ODR" },
  ];
  const path = "M12 70H52V46H90";
  return (
    <g>
      {levels.map((level, index) => (
        <g key={level.name}>
          <line x1="10" x2="108" y1={level.y} y2={level.y} stroke={ink} strokeWidth=".6" strokeOpacity={index === 2 ? 0.45 : 0.6} strokeDasharray={index === 2 ? "2 2.6" : undefined} />
          {[10, 108].map((x) => (
            <line key={x} x1={x} x2={x} y1={level.y - 2} y2={level.y + 2} stroke={ink} strokeWidth=".5" strokeOpacity=".6" />
          ))}
          <Label x={113} y={level.y + 2} ink={ink} anchor="start">
            {level.name}
          </Label>
        </g>
      ))}
      <circle cx="12" cy="70" r="3" fill={ink} />
      <Draw d={path} on={on} ms={1100} delay={150} ease={MOVE} stroke={ink} strokeWidth="1.3" strokeLinejoin="round" />
      {/* Not settled at the first level: an open ring where it turned up. */}
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 220, 520) }}>
        <circle cx="52" cy="70" r="3.4" fill="#F7F7F8" stroke={ink} strokeWidth=".9" />
      </g>
      <circle cx="90" cy="46" r="7" fill="none" stroke={ink} strokeWidth=".5" strokeDasharray="1.2 2" strokeOpacity=".7" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 220, 1150) }} />
      <circle cx="90" cy="46" r="4.4" fill={ORANGE} stroke={ink} strokeWidth=".8" className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 340, 1250) }} />
    </g>
  );
}

/**
 * Forms & Documents. A form's fields are filled in one after another, and
 * the signature is written last, in orange, along its line.
 */
function FormPlate({ on, ink, hatch }: PlateProps) {
  const fields = [
    { y: 14, name: "NAME", fill: 0.7 },
    { y: 30, name: "ADDRESS", fill: 0.9 },
    { y: 46, name: "DETAILS", fill: 0.5 },
  ];
  return (
    <g>
      <Draw d="M18 4H132V86H18Z" on={on} ms={560} stroke={ink} strokeWidth="1" />
      {fields.map((field, index) => (
        <g key={field.name}>
          <Label x={24} y={field.y + 6.4} ink={ink} anchor="start">
            {field.name}
          </Label>
          <rect x="66" y={field.y} width="58" height="9" fill="none" stroke={ink} strokeWidth=".7" />
          <rect x="66" y={field.y} width={58 * field.fill} height="9" fill={`url(#${hatch})`} className={RM} style={{ ...BOX, transformOrigin: "left", transform: on ? "scaleX(1)" : "scaleX(0)", ...tr("transform", 380, 350 + index * 180, "linear") }} />
        </g>
      ))}
      <Label x={24} y={74} ink={ink} anchor="start">
        SIGN
      </Label>
      <line x1="66" x2="124" y1="74" y2="74" stroke={ink} strokeWidth=".7" />
      <path d="M64 73L62 75M64 75L62 73" stroke={ink} strokeWidth=".6" />
      <Draw d="M70 72c4-9 7-10 7-5s-3 8-2 5 5-9 8-7-2 7 1 6 4-6 7-5 1 5 4 4 5-4 8-3" on={on} ms={800} delay={1000} ease="cubic-bezier(.45,0,.55,1)" stroke={ORANGE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Policies. Each rule on the list is ticked in turn; the last box fills orange once all are checked. */
function PoliciesPlate({ on, ink }: PlateProps) {
  const rows = [16, 34, 52];
  return (
    <g>
      {rows.map((y, index) => (
        <g key={y}>
          <rect x="30" y={y} width="10" height="10" fill={index === rows.length - 1 && on ? ORANGE : "none"} stroke={ink} strokeWidth=".9" className={RM} style={tr("fill", 300, 1200)} />
          <Draw d={`M32 ${y + 5}l2.6 2.8 4.4-6`} on={on} ms={240} delay={250 + index * 260} stroke={ink} strokeWidth="1.3" strokeLinecap="round" />
          <Draw d={`M48 ${y + 5}H${index === 1 ? 100 : 118}`} on={on} ms={320} delay={index * 260} stroke={ink} strokeWidth=".8" strokeOpacity=".55" />
        </g>
      ))}
      <line x1="30" x2="120" y1="72" y2="72" stroke={ink} strokeWidth=".6" strokeOpacity=".5" />
    </g>
  );
}

/** Investor complaints. A written complaint slides into the tray, and the tray marks it received in orange. */
function ComplaintsPlate({ on, ink, hatch }: PlateProps) {
  return (
    <g>
      <path d="M40 58H110V78H40Z" fill={`url(#${hatch})`} stroke={ink} strokeWidth="1" />
      <path d="M40 58L48 50H102L110 58" fill="none" stroke={ink} strokeWidth=".7" />
      <g className={RM} style={{ transform: on ? "translateY(0)" : "translateY(-30px)", opacity: on ? 1 : 0.35, ...tr("transform, opacity", 800, 150, MOVE) }}>
        <rect x="52" y="30" width="46" height="30" fill="#fff" stroke={ink} strokeWidth=".9" />
        <path d="M58 38H92M58 45H86M58 52H74" stroke={ink} strokeWidth=".7" strokeOpacity=".55" />
      </g>
      <path d="M40 58H110V78H40Z" fill="none" stroke={ink} strokeWidth="1" />
      <rect x="100" y="64" width="6" height="8" fill={ORANGE} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 300, 1050) }} />
    </g>
  );
}

/** SCORES. A complaint's stages on a ticked track; each fills as it is passed, the last in orange. */
function ScoresPlate({ on, ink }: PlateProps) {
  const stages = [24, 58, 92, 126];
  return (
    <g>
      <line x1="20" x2="130" y1="46" y2="46" stroke={ink} strokeWidth=".6" strokeOpacity=".5" />
      <Draw d="M24 46H126" on={on} ms={1000} delay={100} ease="linear" stroke={ink} strokeWidth="1.3" />
      {stages.map((x, index) => (
        <circle key={x} cx={x} cy="46" r="4.4" fill={on ? (index === stages.length - 1 ? ORANGE : ink) : "#F7F7F8"} stroke={ink} strokeWidth=".9" className={RM} style={tr("fill", 240, 100 + (index / (stages.length - 1)) * 1000)} />
      ))}
    </g>
  );
}

/** ODR. Two parties draw in toward a meeting point, and the settlement between them appears in orange. */
function OdrPlate({ on, ink, hatch }: PlateProps) {
  return (
    <g>
      <line x1="16" x2="134" y1="46" y2="46" stroke={ink} strokeWidth=".5" strokeDasharray="1.4 2" strokeOpacity=".6" />
      <line x1="75" x2="75" y1="30" y2="62" stroke={ink} strokeWidth=".5" strokeOpacity=".6" />
      <circle cx="30" cy="46" r="8" fill={`url(#${hatch})`} stroke={ink} strokeWidth="1" className={RM} style={{ transform: on ? "translateX(24px)" : "translateX(0)", ...tr("transform", 800, 100, MOVE) }} />
      <circle cx="120" cy="46" r="8" fill={`url(#${hatch})`} stroke={ink} strokeWidth="1" className={RM} style={{ transform: on ? "translateX(-24px)" : "translateX(0)", ...tr("transform", 800, 100, MOVE) }} />
      <polygon points={hexAttr(75, 46, 7)} fill={ORANGE} stroke={ink} strokeWidth=".7" className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 340, 950) }} />
    </g>
  );
}

/** AIF documents. A pooled fund as a comb of cells, hatched in one by one around an orange centre. */
function AifPlate({ on, ink, hatch }: PlateProps) {
  const r = 11;
  const w = Math.sqrt(3) * r;
  const cells = [
    [75, 45],
    [75 + w, 45],
    [75 - w, 45],
    [75 + w / 2, 45 - 1.5 * r],
    [75 - w / 2, 45 - 1.5 * r],
    [75 + w / 2, 45 + 1.5 * r],
    [75 - w / 2, 45 + 1.5 * r],
  ] as const;
  return (
    <g>
      {cells.map(([x, y], index) => (
        <g key={index}>
          <polygon points={hexAttr(x, y, r - 1.2)} fill="none" stroke={ink} strokeWidth=".6" strokeOpacity=".4" strokeDasharray="1.6 2" />
          <polygon points={hexAttr(x, y, r - 1.2)} fill={index === 0 ? ORANGE : `url(#${hatch})`} stroke={ink} strokeWidth=".9" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 320, index === 0 ? 900 : 100 + index * 90) }} />
        </g>
      ))}
    </g>
  );
}

/**
 * One drawing per document kind, each explaining what its documents do. The
 * four group headings use charter, risk (Disclosures), grievance and pms
 * (Forms & Documents).
 */
export function DocumentGlyph({ kind, on }: { kind: DocumentKind; on: boolean }) {
  const hatch = useId();
  const ink = "#000";
  const props = { on, ink, hatch };
  const plate = (() => {
    switch (kind) {
      case "charter":
        return <CharterPlate {...props} />;
      case "disclosures":
        return <UncoverPlate {...props} marked={1} />;
      case "risk":
        return <UncoverPlate {...props} />;
      case "policies":
        return <PoliciesPlate {...props} />;
      case "complaints":
        return <ComplaintsPlate {...props} />;
      case "grievance":
        return <GrievancePlate {...props} />;
      case "scores":
        return <ScoresPlate {...props} />;
      case "odr":
        return <OdrPlate {...props} />;
      case "forms":
      case "pms":
        return <FormPlate {...props} />;
      case "aif":
        return <AifPlate {...props} />;
    }
  })();
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink={ink} opacity={0.5} />
      </defs>
      {plate}
    </svg>
  );
}
