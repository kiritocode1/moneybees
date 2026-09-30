/*
 * The drawings on /investor-centre. The hero gathers loose papers into one
 * tray, the two logins draw who they are for, and every document card draws a
 * page beside the mark of what that document is. `on` switches a drawing from
 * its resting state to its explained state.
 */

import type { DocumentGlyph } from "@/lib/investor-centre";

export const ORANGE = "#F6A11A";

/** Only the properties the drawings change; reduced motion shows the explained state at once. */
const T = "transition-[transform,opacity,fill,stroke,stroke-dashoffset,r,cx,y,width,height] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:!transition-none";

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = ((60 * corner - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

/** Where each loose sheet starts, scattered, before it is filed. */
const SCATTER = [
  [40, 30, -14],
  [120, 12, 8],
  [210, 40, -6],
  [300, 10, 12],
  [390, 34, -10],
  [20, 150, 10],
  [410, 150, -8],
  [70, 230, -12],
  [160, 250, 6],
  [310, 244, -4],
  [400, 236, 14],
] as const;

/** Investor information in one place: scattered sheets settle into a single tray. */
export function GatherGlyph({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full" aria-hidden="true">
      <rect x="140" y="150" width="200" height="120" fill="none" stroke="#000" strokeWidth="1.4" />
      <path d="M140 150h62l10-14h56l10 14" fill="none" stroke="#000" strokeWidth="1.4" />
      {SCATTER.map(([x, y, turn], index) => {
        const stackX = 190 + (index % 2) * 3;
        const stackY = 184 - index * 6;
        const dx = on ? stackX : x;
        const dy = on ? stackY : y;
        const top = index === SCATTER.length - 1;
        return (
          <g
            key={index}
            style={{ transform: `translate(${dx}px, ${dy}px) rotate(${on ? 0 : turn}deg) scale(${on ? 1.45 : 1})`, transitionDelay: `${index * 90}ms`, transitionDuration: "1000ms" }}
            className={T}
          >
            <path d="M0 0h54l12 12v40H0Z" fill="#fff" stroke={top && on ? ORANGE : "#000"} strokeWidth={top && on ? 2 : 1} />
            <path d="M10 18h40M10 26h46M10 34h30" stroke="#000" strokeOpacity=".3" strokeWidth="1.4" />
          </g>
        );
      })}
      <rect x="140" y="270" width="200" height="4" fill={ORANGE} style={{ transform: `scaleX(${on ? 1 : 0})`, transformOrigin: "140px 272px", transitionDelay: "1100ms" }} className={T} />
    </svg>
  );
}

/** Client Login: an investor and their own portfolio. */
export function ClientGlyph({ on }: { on: boolean }) {
  const bars = [18, 28, 24, 36, 44];
  return (
    <svg viewBox="0 0 200 110" className="block h-auto w-full" aria-hidden="true">
      <circle cx="40" cy="40" r="12" fill="#000" />
      <path d="M18 84a22 20 0 0 1 44 0Z" fill="#000" />
      <path d="M72 60h20" stroke="#000" strokeDasharray="3 3" strokeOpacity=".5" />
      <rect x="98" y="16" width="90" height="76" fill="none" stroke="#000" strokeWidth="1.2" />
      {bars.map((height, index) => (
        <rect
          key={index}
          x={108 + index * 16}
          y={on ? 84 - height : 84}
          width="10"
          height={on ? height : 0}
          fill={index === bars.length - 1 ? ORANGE : "#000"}
          style={{ transitionDelay: `${index * 80}ms` }}
          className={T}
        />
      ))}
    </svg>
  );
}

/** Distributor Login: one distributor linked to many clients. */
export function DistributorGlyph({ on }: { on: boolean }) {
  const clients = [
    [130, 18],
    [170, 36],
    [182, 74],
    [150, 98],
    [112, 88],
  ] as const;
  return (
    <svg viewBox="0 0 200 110" className="block h-auto w-full" aria-hidden="true">
      <circle cx="40" cy="40" r="12" fill="#fff" />
      <path d="M18 84a22 20 0 0 1 44 0Z" fill="#fff" />
      <path d="M72 60h24" stroke="#fff" strokeOpacity=".5" />
      {clients.map(([x, y], index) => (
        <g key={index}>
          <path d={`M100 60L${x} ${y}`} stroke="#fff" strokeOpacity=".4" strokeDasharray="80" strokeDashoffset={on ? 0 : 80} style={{ transitionDelay: `${index * 90}ms` }} className={T} />
          <circle cx={x} cy={y} r={on ? 6 : 0} fill="#fff" style={{ transitionDelay: `${300 + index * 90}ms` }} className={T} />
        </g>
      ))}
      <polygon points={hexPoints(100, 60, 9)} fill={ORANGE} />
    </svg>
  );
}

/** Each document's mark, drawn beside its page. Centred on (108, 45). */
function Mark({ kind, on }: { kind: DocumentGlyph; on: boolean }) {
  const ink = "#000";
  switch (kind) {
    case "charter":
      return (
        <g>
          <path d="M100 58l-6 20 8-4 6 6 2-20M116 58l6 20-8-4-6 6-2-20" fill={ink} opacity=".85" />
          <circle cx="108" cy="42" r="18" fill={on ? ORANGE : "#fff"} stroke={ink} strokeWidth="1.2" className={T} />
          <path d="M100 42l6 6 10-12" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="24" strokeDashoffset={on ? 0 : 24} className={T} style={{ transitionDelay: "300ms" }} />
        </g>
      );
    case "disclosures":
      return (
        <g>
          <circle cx="104" cy="40" r="16" fill="none" stroke={ink} strokeWidth="2" />
          <path d="M115 52l14 14" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M96 36h16M96 44h10" stroke={on ? ORANGE : "rgba(0,0,0,.2)"} strokeWidth="2.4" className={T} />
        </g>
      );
    case "risk":
      return (
        <g>
          <path d="M108 16l24 44H84Z" fill={on ? ORANGE : "#fff"} stroke={ink} strokeWidth="1.4" className={T} />
          <path d="M108 32v14M108 51v3" stroke={ink} strokeWidth="2.4" />
          <path d="M84 72q6-6 12 0t12 0 12 0 12 0" fill="none" stroke={ink} strokeOpacity=".4" />
        </g>
      );
    case "policies":
      return (
        <g>
          {[0, 1, 2].map((row) => (
            <g key={row}>
              <rect x="88" y={20 + row * 18} width="10" height="10" fill="none" stroke={ink} strokeWidth="1.2" />
              <path d={`M90 ${25 + row * 18}l3 3 5-7`} fill="none" stroke={ORANGE} strokeWidth="2" strokeDasharray="12" strokeDashoffset={on ? 0 : 12} className={T} style={{ transitionDelay: `${row * 200}ms` }} />
              <path d={`M104 ${25 + row * 18}h26`} stroke={ink} strokeOpacity=".35" strokeWidth="1.4" />
            </g>
          ))}
        </g>
      );
    case "complaints":
      return (
        <g>
          <path d="M84 18h48v34h-30l-10 10v-10h-8Z" fill="#fff" stroke={ink} strokeWidth="1.4" />
          <path d="M92 30h32M92 40h20" stroke={on ? ink : "rgba(0,0,0,.15)"} strokeWidth="1.6" className={T} />
          <circle cx="128" cy="20" r="5" fill={ORANGE} opacity={on ? 1 : 0} className={T} />
        </g>
      );
    case "grievance":
      return (
        <g>
          <path d="M80 18h34v26h-20l-8 8v-8h-6Z" fill="#fff" stroke={ink} strokeWidth="1.2" />
          <path d="M116 44q8 0 10 10" fill="none" stroke={ink} strokeOpacity=".5" strokeDasharray="30" strokeDashoffset={on ? 0 : 30} className={T} />
          <circle cx="126" cy="66" r="12" fill={on ? ORANGE : "#fff"} stroke={ink} strokeWidth="1.2" className={T} style={{ transitionDelay: "400ms" }} />
          <path d="M120 66l4 4 8-8" fill="none" stroke={ink} strokeWidth="1.8" />
        </g>
      );
    case "scores":
      return (
        <g>
          <rect x="80" y="16" width="56" height="40" fill="#fff" stroke={ink} strokeWidth="1.4" />
          <path d="M100 56l-4 12h24l-4-12" fill="none" stroke={ink} strokeWidth="1.2" />
          <path d="M88 38h40" stroke={ink} strokeOpacity=".2" strokeWidth="2" />
          {[0, 1, 2, 3].map((stage) => (
            <circle key={stage} cx={90 + stage * 12} cy="38" r="3.4" fill={on ? (stage === 3 ? ORANGE : ink) : "#fff"} stroke={ink} style={{ transitionDelay: `${stage * 180}ms` }} className={T} />
          ))}
        </g>
      );
    case "odr":
      return (
        <g>
          <circle cx={on ? 90 : 82} cy="44" r="8" fill={ink} className={T} />
          <circle cx={on ? 126 : 134} cy="44" r="8" fill={ink} className={T} />
          <path d="M98 44h20" stroke={ink} strokeOpacity=".4" strokeDasharray="2 3" />
          <polygon points={hexPoints(108, 44, on ? 7 : 0)} fill={ORANGE} className={T} style={{ transitionDelay: "300ms" }} />
          <path d="M84 66h48" stroke={ink} strokeOpacity=".3" />
        </g>
      );
    case "forms":
      return (
        <g>
          {[0, 1, 2].map((row) => (
            <rect key={row} x="82" y={18 + row * 18} width="52" height="11" fill="#fff" stroke={ink} strokeWidth="1" />
          ))}
          <rect x="85" y="21" height="5" width={on ? 30 : 0} fill={ink} opacity=".35" className={T} />
          <rect x="85" y="39" height="5" width={on ? 20 : 0} fill={ink} opacity=".35" className={T} style={{ transitionDelay: "250ms" }} />
          <path d={`M${on ? 108 : 86} 55v9`} stroke={ORANGE} strokeWidth="2" className={T} style={{ transitionDelay: "450ms" }} />
        </g>
      );
    case "pms": {
      const slices = [0.34, 0.24, 0.2, 0.22];
      let start = -Math.PI / 2;
      return (
        <g>
          {slices.map((share, index) => {
            const end = start + share * Math.PI * 2;
            const d = `M108 44 L${108 + 24 * Math.cos(start)} ${44 + 24 * Math.sin(start)} A24 24 0 0 1 ${108 + 24 * Math.cos(end)} ${44 + 24 * Math.sin(end)} Z`;
            const mid = (start + end) / 2;
            start = end;
            const push = on && index === 0 ? 4 : 0;
            return (
              <path
                key={index}
                d={d}
                fill={index === 0 ? ORANGE : index % 2 ? ink : "#fff"}
                stroke={ink}
                strokeWidth=".8"
                style={{ transform: `translate(${Math.cos(mid) * push}px, ${Math.sin(mid) * push}px)` }}
                className={T}
              />
            );
          })}
        </g>
      );
    }
    case "aif": {
      const r = 10;
      const w = Math.sqrt(3) * r;
      const cells = [
        [108, 44],
        [108 + w, 44],
        [108 - w, 44],
        [108 + w / 2, 44 - 1.5 * r],
        [108 - w / 2, 44 - 1.5 * r],
        [108 + w / 2, 44 + 1.5 * r],
        [108 - w / 2, 44 + 1.5 * r],
      ] as const;
      return (
        <g>
          {cells.map(([x, y], index) => (
            <polygon key={index} points={hexPoints(x, y, r - 1.2)} fill={index === 0 ? ORANGE : ink} style={{ opacity: on ? 1 : 0.12, transitionDelay: `${index * 60}ms` }} className={T} />
          ))}
        </g>
      );
    }
  }
}

/** A page with its lines written in, and beside it the mark of what the document is. */
export function DocumentGlyph({ kind, on }: { kind: DocumentGlyph; on: boolean }) {
  return (
    <svg viewBox="0 0 150 90" className="block h-auto w-full" aria-hidden="true">
      <path d="M14 8h36l12 12v62H14Z" fill="#fff" stroke="#000" strokeWidth="1.2" />
      <path d="M50 8v12h12" fill="none" stroke="#000" strokeWidth="1.2" />
      {[30, 40, 50, 60, 70].map((y, index) => (
        <path
          key={y}
          d={`M22 ${y}h${index === 4 ? 20 : 32}`}
          stroke="#000"
          strokeOpacity=".3"
          strokeWidth="1.6"
          strokeDasharray="32"
          strokeDashoffset={on ? 0 : 32}
          style={{ transitionDelay: `${index * 80}ms` }}
          className={T}
        />
      ))}
      <Mark kind={kind} on={on} />
    </svg>
  );
}
