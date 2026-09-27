"use client";

import { BODY, COLUMN, EYEBROW } from "@/components/hero/editorial";
import FactSection, { Eyebrow, type FigureState, LINE_GLOW, PanelTitle, r2, riseAt, SOLID_GLOW } from "@/components/fact-sections/fact-section";
import { path, project } from "@/components/iso/geometry";
import { PMS_HEADINGS, SELECTION_STAGES } from "@/lib/pms";
import { EDGE, MONO, ORANGE, PmsSectionHead } from "./shared";

/*
 * Stock selection process, group profile p13, as a stack of sheets in the
 * page's projection: one sheet per stage, the widest at the top for the ~6000
 * companies, narrowing down to the ~20 in the portfolio. Each sheet carries a
 * scatter of dots on a log scale of its count, with exactly twenty on the last,
 * one per stock. The panel on the trigger line lights its sheet.
 */

const LAST = SELECTION_STAGES.length - 1;
const TOP_VALUE = SELECTION_STAGES[0].value;
const LAST_VALUE = SELECTION_STAGES[LAST].value;
/** 0 at the portfolio, 1 at the universe, on a log scale. */
const scale = (value: number) => Math.log(value / LAST_VALUE) / Math.log(TOP_VALUE / LAST_VALUE);

const MIN_SIDE = 70;
const MAX_SIDE = 230;
const GAP = 64;
const THICK = 5;
const MAX_DOTS = 150;

const noise = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const SHEETS = SELECTION_STAGES.map((stage, index) => {
  const t = scale(stage.value);
  const side = MIN_SIDE + (MAX_SIDE - MIN_SIDE) * t;
  const z = (LAST - index) * GAP;
  const a = -side / 2;
  const b = side / 2;
  const dots = Math.round(LAST_VALUE * (MAX_DOTS / LAST_VALUE) ** t);
  const margin = 9;
  return {
    index,
    top: path([project(a, a, z), project(b, a, z), project(b, b, z), project(a, b, z)]),
    right: path([project(b, a, z), project(b, b, z), project(b, b, z - THICK), project(b, a, z - THICK)]),
    left: path([project(a, b, z), project(b, b, z), project(b, b, z - THICK), project(a, b, z - THICK)]),
    /** The sheet's right-hand corner, where its leader line starts. */
    anchor: project(b, a, z).map(r2) as [number, number],
    dots: Array.from({ length: dots }, (_, dot) => {
      const [x, y] = project(
        a + margin + noise(index * 211 + dot * 7) * (side - margin * 2),
        a + margin + noise(index * 97 + dot * 13 + 5) * (side - margin * 2),
        z,
      );
      return [r2(x), r2(y)] as const;
    }),
  };
});

function SheetsFigure({ progress, selected, onSelect }: FigureState) {
  const settled = progress > 0.8;
  const stage = settled ? selected : 0;
  return (
    <div className="w-full max-w-[640px]">
      <svg viewBox="-190 -350 460 450" className="block h-auto max-h-[78svh] w-full overflow-visible max-[900px]:max-h-[36svh]" role="group" aria-label="Stock selection process">
        {/* The funnel's four edges, dashed, through every sheet's corners. */}
        <g stroke="rgba(0,0,0,.22)" strokeDasharray="2 5" strokeLinecap="round" fill="none" style={{ opacity: progress, transition: "opacity 300ms" }}>
          {[
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ].map(([sx, sy]) => (
            <path
              key={`${sx}${sy}`}
              d={path(
                SELECTION_STAGES.map((item, index) => {
                  const half = (MIN_SIDE + (MAX_SIDE - MIN_SIDE) * scale(item.value)) / 2;
                  return project(sx * half, sy * half, (LAST - index) * GAP);
                }),
                false,
              )}
            />
          ))}
        </g>
        {/* Bottom sheet first, so each sheet above is drawn over the one below. */}
        {[...SHEETS].reverse().map((sheet) => {
          const rise = riseAt(progress, LAST - sheet.index);
          const lit = sheet.index === stage && settled;
          return (
            <g
              key={sheet.index}
              role="button"
              tabIndex={settled ? 0 : -1}
              aria-label={`${SELECTION_STAGES[sheet.index].name}, ${SELECTION_STAGES[sheet.index].count}`}
              aria-pressed={lit}
              onClick={() => onSelect(sheet.index)}
              onKeyDown={(event) => event.key === "Enter" && onSelect(sheet.index)}
              className="cursor-pointer outline-none"
              style={{
                opacity: rise,
                transform: `translateY(${(1 - rise) * -40}px)`,
                filter: lit ? SOLID_GLOW : "none",
                transition: "filter 300ms ease",
              }}
            >
              <path d={sheet.left} fill={lit ? "#b87408" : "#dcdbd8"} stroke={lit ? "rgba(90,50,0,.75)" : EDGE} strokeWidth="0.8" strokeLinejoin="round" />
              <path d={sheet.right} fill={lit ? "#d98c10" : "#cfcecb"} stroke={lit ? "rgba(90,50,0,.75)" : EDGE} strokeWidth="0.8" strokeLinejoin="round" />
              <path
                d={sheet.top}
                fill={lit ? "rgba(247,161,26,.92)" : "rgba(252,251,249,.82)"}
                stroke={lit ? "rgba(90,50,0,.75)" : EDGE}
                strokeWidth="0.9"
                strokeLinejoin="round"
                style={{ transition: "fill 300ms ease" }}
              />
              {sheet.dots.map(([x, y], dot) => (
                <ellipse key={dot} cx={x} cy={y} rx="2.3" ry="1.2" fill={lit ? "#000" : "rgba(0,0,0,.42)"} />
              ))}
            </g>
          );
        })}
        {/* Counts on leader lines, once the stack has built. */}
        <g aria-hidden="true" style={{ opacity: settled ? 1 : 0, transition: "opacity 400ms ease" }}>
          {SHEETS.map((sheet) => {
            const active = sheet.index === stage;
            const [x, y] = sheet.anchor;
            return (
              <g key={sheet.index} opacity={active ? 1 : 0.5} style={{ transition: "opacity 240ms ease" }}>
                <path
                  d={`M${x + 8} ${y}H200`}
                  stroke={active ? ORANGE : "rgba(0,0,0,.4)"}
                  strokeWidth="1"
                  strokeDasharray={active ? undefined : "2 4"}
                  style={{ filter: active ? LINE_GLOW : "none" }}
                />
                <text x="208" y={y + 4} fontSize="12" fill="#000" fontFamily="ui-monospace, Menlo, monospace" letterSpacing=".04em">
                  {SELECTION_STAGES[sheet.index].count}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function StagePanel({ stage }: { stage: number }) {
  const { count, name, summary, work, decision } = SELECTION_STAGES[stage];
  return (
    <div>
      <Eyebrow>
        {String(stage + 1).padStart(2, "0")} · {name}
      </Eyebrow>
      <PanelTitle>{count}</PanelTitle>
      <p className="mt-[22px] max-w-[440px] text-[17px] leading-[1.5] text-[rgba(0,0,0,.76)]">{summary}</p>
      <ul className="mt-[26px] list-none border-t border-t-[rgba(0,0,0,.13)] p-0">
        {work.map((item) => (
          <li key={item} className="flex min-h-[44px] items-center border-b border-b-[rgba(0,0,0,.13)] text-[14px] text-[rgba(0,0,0,.8)]">
            {item}
          </li>
        ))}
      </ul>
      {decision && (
        <div className="mt-[26px] border border-dashed border-black/25 p-[18px]">
          <span className={`${EYEBROW} text-black/55`}>Decision making process</span>
          <ol className="mt-[12px] list-none p-0">
            {decision.map((item, index) => (
              <li key={item} className="flex gap-[12px] py-[6px] text-[14px] leading-[1.45]">
                <span className={`${MONO} text-[11px] text-[#F7A11A]`}>{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/** The selection funnel, scroll driven: one panel per stage lights its sheet. */
export default function Selection() {
  return (
    <FactSection
      id="selection"
      label="Our process"
      intro={
        <div className={`${COLUMN} pt-[110px] max-md:pt-[72px]`}>
          <PmsSectionHead id="selection" label="Our process" heading={PMS_HEADINGS.selection}>
            <p className={`max-w-[480px] text-black/70 ${BODY}`}>From about 6,000 listed companies to the 20 or so in the portfolio.</p>
          </PmsSectionHead>
        </div>
      }
      panels={SELECTION_STAGES.map((_, stage) => ({ part: stage, content: <StagePanel stage={stage} /> }))}
      figure={SheetsFigure}
    />
  );
}
