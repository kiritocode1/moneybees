"use client";

import { SQUASH } from "@/components/iso/geometry";
import {
  CENTRE_X,
  diamond,
  easeInOut,
  RESEARCH_COUNTS,
  RESEARCH_DOT,
  RESEARCH_FINAL_DOT,
  RESEARCH_PATHS,
  RESEARCH_PLANES,
  RESEARCH_Y,
  researchDot,
} from "@/components/insight-cards/moneybee-figures";
import { RESEARCH_SOURCE, RESEARCH_STAGES } from "@/lib/insights";
import FactSection, {
  Bloom,
  Eyebrow,
  type FigureState,
  LINE_GLOW,
  ORANGE,
  PanelTitle,
  riseAt,
  useEased,
} from "./fact-section";
import { BracketCaption, DotField, Panel, SplitFrame } from "./motion-language";

const LAST = RESEARCH_PLANES.length - 1;
const LABEL_X = 392;

/**
 * The research card's funnel at full size. Six planes stack top to bottom as
 * the section builds. The card's falling dots then follow the lit stage: they
 * glide down the same merging paths as the panels advance, until all thirteen
 * are one orange dot on the last plane.
 */
function ResearchFigure({ progress, selected, onSelect }: FigureState) {
  const settled = progress > 0.8;
  // Where the falling dots are, in stages. Glides to the lit stage.
  const position = useEased(settled ? selected : 0, 3);
  const low = Math.min(LAST - 1, Math.floor(position));
  const blend = easeInOut(position - low);
  const arrival = Math.max(0, position - (LAST - 1));

  return (
    <svg viewBox="76 180 400 290" className="h-auto w-full overflow-visible" role="group" aria-label="Research selection funnel">
      <defs>
        <Bloom id="research-bloom" />
        <linearGradient id="research-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ORANGE} stopOpacity="0.55" />
          <stop offset="100%" stopColor={ORANGE} stopOpacity="0.16" />
        </linearGradient>
      </defs>

      <ellipse
        cx={CENTRE_X}
        cy={RESEARCH_Y[selected]}
        rx={RESEARCH_PLANES[selected] * 1.25 + 30}
        ry={RESEARCH_PLANES[selected] * SQUASH * 1.6 + 26}
        fill="url(#research-bloom)"
        style={{ opacity: settled ? 1 : 0, transition: "cy 450ms cubic-bezier(.16,1,.3,1), rx 450ms cubic-bezier(.16,1,.3,1), ry 450ms cubic-bezier(.16,1,.3,1), opacity 500ms ease" }}
      />
      <path d="M225 190L238 456L212 456Z" fill="url(#research-beam)" style={{ opacity: settled ? 1 : 0, transition: "opacity 600ms ease" }} />

      {RESEARCH_PLANES.map((radius, stage) => {
        const rise = riseAt(progress, stage * 0.8);
        const lit = settled && stage === selected;
        return (
          <g
            key={radius}
            role="button"
            tabIndex={settled ? 0 : -1}
            aria-label={`${RESEARCH_STAGES[stage].count} ${RESEARCH_STAGES[stage].name}`}
            aria-pressed={lit}
            onClick={() => onSelect(stage)}
            onKeyDown={(event) => event.key === "Enter" && onSelect(stage)}
            className="cursor-pointer outline-none"
            style={{ opacity: rise, transform: `translateY(${(1 - rise) * -30}px)` }}
          >
            <path
              d={diamond(CENTRE_X, RESEARCH_Y[stage], radius, radius * SQUASH)}
              fill={lit ? "rgba(247,161,26,.12)" : "rgba(255,255,255,.001)"}
              stroke={lit ? ORANGE : "rgba(0,0,0,.62)"}
              strokeWidth={lit ? 1.6 : 1.1}
              style={{ filter: lit ? LINE_GLOW : "none", transition: "stroke 300ms ease, fill 300ms ease" }}
            />
            {Array.from({ length: RESEARCH_COUNTS[stage] }, (_, index) => {
              const [cx, cy] = researchDot(stage, index);
              return <circle key={index} cx={cx} cy={cy} r={RESEARCH_DOT} fill={lit ? ORANGE : "#000"} opacity={lit ? 0.9 : 0.22} />;
            })}
          </g>
        );
      })}

      {/* The card's falling dots, merging stage by stage. */}
      <g style={{ opacity: settled ? 1 : 0, transition: "opacity 500ms ease" }} aria-hidden="true">
        {RESEARCH_PATHS.map((route, index) => {
          const [x0, y0] = route[low];
          const [x1, y1] = route[low + 1];
          return (
            <circle
              key={index}
              cx={x0 + (x1 - x0) * blend}
              cy={y0 + (y1 - y0) * blend}
              r={RESEARCH_DOT + position * 0.5}
              fill="#000"
            />
          );
        })}
        <g transform={`translate(${CENTRE_X} ${RESEARCH_Y[LAST]}) scale(${arrival.toFixed(3)})`}>
          <circle r={RESEARCH_FINAL_DOT} fill={ORANGE} stroke="rgba(255,255,255,.7)" strokeWidth="1.2" />
        </g>
      </g>

      <g style={{ opacity: settled ? 1 : 0, transition: "opacity 400ms ease" }} aria-hidden="true">
        {RESEARCH_PLANES.map((radius, stage) => {
          const lit = stage === selected;
          const y = RESEARCH_Y[stage];
          return (
            <g key={radius} opacity={lit ? 1 : 0.55}>
              <path
                d={`M${CENTRE_X + radius + 8} ${y}H${LABEL_X - 6}`}
                stroke={lit ? ORANGE : "rgba(0,0,0,.4)"}
                strokeWidth="1"
                strokeDasharray={lit ? undefined : "2 4"}
                style={{ filter: lit ? LINE_GLOW : "none" }}
              />
              <text x={LABEL_X} y={y + 4} fontSize="11" fill="#000" fontFamily="ui-monospace, Menlo, monospace" letterSpacing=".04em">
                {RESEARCH_STAGES[stage].count}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function StagePanel({ stage }: { stage: number }) {
  const { count, name, summary, work } = RESEARCH_STAGES[stage];
  return (
    <div>
      <Eyebrow>{name}</Eyebrow>
      <PanelTitle>{count}</PanelTitle>
      <p className="mt-[22px] max-w-[440px] text-[15px] leading-[1.55] text-[rgba(0,0,0,.76)]">{summary}</p>
      <ul className="mt-[26px] list-none border-t border-t-[rgba(0,0,0,.13)] p-0">
        {work.map((item) => (
          <li key={item} className="flex min-h-[44px] items-center border-b border-b-[rgba(0,0,0,.13)] text-[13px] text-[rgba(0,0,0,.8)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Section A, the selection funnel. Replaces the homepage's pinned stats. */
export default function ResearchSection() {
  return (
    <FactSection
      id="research"
      label="Research selection"
      heading="How ~6,000 companies become ~20"
      lead="About 1,200 of the roughly 6,000 companies in the universe fall in the size range Moneybee invests in, and about 20 of those end up in a portfolio."
      intro={
        <div className="mt-[72px]">
          <SplitFrame>
            <Panel className="min-h-0">
              <DotField sentence="Of about 6,000 companies, about 20 make it into the portfolio." keep={20} />
            </Panel>
            <Panel className="grid place-items-center">
              <BracketCaption text="Most of the work is deciding what not to own" className="w-full" />
            </Panel>
          </SplitFrame>
        </div>
      }
      panels={RESEARCH_STAGES.map((_, stage) => ({ part: stage, content: <StagePanel stage={stage} /> }))}
      figure={ResearchFigure}
      caveat="Company counts are the approximate figures Moneybee gives for its PMS selection process."
      source={RESEARCH_SOURCE}
    />
  );
}
