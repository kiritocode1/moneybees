"use client";

import FactSection, { Bloom, Eyebrow, type FigureState, PanelTitle, r2, riseAt, SOLID_GLOW, useEased } from "@/components/fact-sections/fact-section";
import { onCircle, pieFaces } from "@/components/iso/geometry";
import { PMS_HEADINGS, RISKS } from "@/lib/pms";
import { COLUMN } from "@/components/hero/editorial";
import { EDGE, MONO, PmsSectionHead } from "./shared";

/*
 * Risk management framework, group profile p16. The slide draws four stepped
 * wedges, 01 to 04, around a half circle; here they stand as solids in the
 * page's projection, fanned across the half that faces the viewer, each a step
 * shorter than the last. The panel on the trigger line lifts its wedge.
 */

const SPAN = Math.PI / 4;
/** The half of the plan circle facing the viewer runs from 135 to -45 degrees; 01 takes the left end. */
const START = (3 * Math.PI) / 4;
const RADIUS = 160;
/** The slide's steps: 01 stands tallest, each wedge after it a step lower. */
const HEIGHTS = [58, 44, 30, 16] as const;
const EXPLODE = 12;
const LIFT = 22;

function Wedge({ index, lit, rise }: { index: number; lit: boolean; rise: number }) {
  const lift = useEased(lit ? LIFT : 0, 7);
  const from = START - SPAN * (index + 1);
  const to = START - SPAN * index;
  const faces = pieFaces(from, to, RADIUS, HEIGHTS[index], EXPLODE, lift);
  const mid = (from + to) / 2;
  const [lx, ly] = onCircle(RADIUS * 0.64 + EXPLODE, mid, lift + HEIGHTS[index]);
  const stroke = lit ? "rgba(90,50,0,.75)" : EDGE;
  return (
    <g style={{ opacity: rise, transform: `translateY(${(1 - rise) * -40}px)`, filter: lit ? SOLID_GLOW : "none", transition: "filter 300ms ease" }}>
      <path d={faces.cut} fill={lit ? "#b87408" : "#e4e3e0"} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />
      <path d={faces.rim} fill={lit ? "#d98c10" : "#d6d5d2"} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />
      <path d={faces.top} fill={lit ? "#F6A11A" : "#fbfaf8"} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />
      <text x={r2(lx)} y={r2(ly) + 5} textAnchor="middle" className="fill-black font-serif text-[18px]">
        {String(index + 1).padStart(2, "0")}
      </text>
    </g>
  );
}

function RiskFigure({ progress, selected, onSelect }: FigureState) {
  const settled = progress > 0.8;
  // Far wedges first: in this projection the right-hand wedges sit nearer the viewer.
  const order = RISKS.map((_, index) => index).sort((a, b) => {
    const depth = (index: number) => onCircle(1, START - SPAN * (index + 0.5), 0)[1];
    return depth(a) - depth(b);
  });
  return (
    <div className="w-full max-w-[640px]">
      <svg viewBox="-190 -140 380 240" className="block h-auto w-full overflow-visible" role="group" aria-label={PMS_HEADINGS.risk}>
        <defs>
          <Bloom id="pms-risk-bloom" />
        </defs>
        <ellipse cx="0" cy="0" rx="180" ry="63" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1.2" strokeDasharray="2 9" strokeLinecap="round" />
        <ellipse cx="0" cy="18" rx="170" ry="60" fill="url(#pms-risk-bloom)" style={{ opacity: settled ? 0.8 : 0, transition: "opacity 500ms ease" }} />
        {order.map((index) => (
          <g
            key={index}
            role="button"
            tabIndex={settled ? 0 : -1}
            aria-label={RISKS[index].name}
            aria-pressed={settled && selected === index}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => event.key === "Enter" && onSelect(index)}
            className="cursor-pointer outline-none"
          >
            <Wedge index={index} lit={settled && selected === index} rise={riseAt(progress, index)} />
          </g>
        ))}
      </svg>
      <ul aria-hidden="true" className={`${MONO} mt-[26px] grid list-none grid-cols-4 gap-[8px] p-0 text-[10px] max-[900px]:hidden tracking-[.08em] uppercase`}>
        {RISKS.map((risk, index) => (
          <li
            key={risk.name}
            className="border-t pt-[8px] transition-colors duration-300"
            style={{
              borderColor: settled && selected === index ? "#F6A11A" : "rgba(0,0,0,.2)",
              color: settled && selected === index ? "#000" : "rgba(0,0,0,.5)",
            }}
          >
            {String(index + 1).padStart(2, "0")} {risk.name.replace(" risk", "")}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskPanel({ index }: { index: number }) {
  const { name, rule, detail } = RISKS[index];
  return (
    <div>
      <Eyebrow>
        {String(index + 1).padStart(2, "0")} · {name}
      </Eyebrow>
      <PanelTitle size="medium">{rule}</PanelTitle>
      <p className="mt-[24px] max-w-[440px] border-t border-t-[rgba(0,0,0,.13)] pt-[18px] text-[16px] leading-[1.6] text-[rgba(0,0,0,.76)]">
        {detail}
      </p>
    </div>
  );
}

/** The four risks, scroll driven. */
export default function Risks() {
  return (
    <FactSection
      id="pms-risk"
      label="Managing risk"
      intro={
        <div className={`${COLUMN} pt-[110px] max-md:pt-[72px]`}>
          <PmsSectionHead id="pms-risk" label="Managing risk" heading={PMS_HEADINGS.risk} />
        </div>
      }
      panels={RISKS.map((_, index) => ({ part: index, content: <RiskPanel index={index} /> }))}
      figure={RiskFigure}
    />
  );
}
