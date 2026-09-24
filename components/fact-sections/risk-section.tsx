"use client";

import { useRef } from "react";
import { HEADINGS, RISK_LEAD, RISK_RULES, RISK_SOURCE } from "@/lib/insights";
import { BracketLabel, LINE_GLOW, ORANGE, r2, SectionFooter, SectionHeading } from "./fact-section";
import { BracketCaption, Panel, SplitFrame, useStageClock } from "./motion-language";

const [CONCENTRATION, VALUATION, LIQUIDITY, MARKET] = RISK_RULES;

/** Label and rule at the top of every risk panel. */
function PanelHead({ name, rule }: { name: string; rule: string }) {
  return (
    <div className="relative z-[1] p-[28px] max-[600px]:p-[20px]">
      <BracketLabel>{name} risk</BracketLabel>
      <p className="mt-[12px] max-w-[26ch] text-[clamp(1.2rem,1.7vw,1.6rem)] font-light leading-[1.12] tracking-[-.03em]">{rule}</p>
    </div>
  );
}

/**
 * The order holdings arrive in, by sector column. Six land in the first
 * column, which is 30% of a 20-stock book at equal weight; then one more
 * tries that column, is held above the line, and goes to another sector.
 */
const ARRIVALS = [0, 1, 2, 0, 3, 0, 2, 4, 1, 0, 3, 2, 0, 1, 3, 0, 2, 4] as const;
const CELL = 26;
const GAP = 5;
const CAP = 6;
const PER_CELL = 0.16;
/** When the first column reaches the cap. */
const CAPPED_AT = (ARRIVALS.lastIndexOf(0) + 1) * PER_CELL;

/**
 * The reference's waffle, built cell by cell: holdings stack into five sector
 * columns under a 30% line. When a column reaches the line, the line and that
 * column light; the next holding is held above it, then moves to another sector.
 */
function ConcentrationPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useStageClock(ref, 4.6, 6.2);
  const shown = Math.min(ARRIVALS.length, Math.floor(t / PER_CELL));
  const heights = [0, 0, 0, 0, 0];
  const cells: { col: number; slot: number }[] = [];
  ARRIVALS.slice(0, shown).forEach((col) => cells.push({ col, slot: heights[col]++ }));
  const capped = t >= CAPPED_AT;
  // The nineteenth holding: above the cap from 3.1 s, over to column five by 3.9 s.
  const extra = t < 3.1 ? null : t < 3.6 ? { x: 0, slot: CAP, held: true } : { x: Math.min(1, (t - 3.6) / 0.3), slot: 2, held: false };
  const baseY = 250;
  const x = (col: number) => 40 + col * (CELL + GAP) * 1.6;
  const y = (slot: number) => baseY - (slot + 1) * (CELL + GAP);
  const capY = y(CAP - 1) - GAP / 2;

  return (
    <div ref={ref} className="h-full">
      <PanelHead name={CONCENTRATION.name} rule={CONCENTRATION.rule} />
      <svg viewBox="0 0 320 270" className="absolute right-[6%] bottom-[18px] h-[62%] w-auto max-w-[60%]" aria-hidden="true">
        {Array.from({ length: 5 }, (_, col) =>
          Array.from({ length: CAP }, (_, slot) => (
            <rect key={`${col}:${slot}`} x={x(col)} y={y(slot)} width={CELL} height={CELL} fill="rgba(0,0,0,.05)" />
          )),
        )}
        {cells.map(({ col, slot }) => (
          <rect
            key={`${col}:${slot}`}
            x={x(col)}
            y={y(slot)}
            width={CELL}
            height={CELL}
            fill={capped && col === 0 ? ORANGE : "#D9D8D6"}
            style={{ transition: "fill 300ms ease" }}
          />
        ))}
        {extra && (
          <rect
            x={x(0) + (x(4) - x(0)) * extra.x}
            y={extra.held ? y(CAP) - 6 : y(0) + (y(extra.slot) - y(0)) * extra.x + (y(CAP) - 6 - y(0)) * (1 - extra.x)}
            width={CELL}
            height={CELL}
            fill={extra.held ? "none" : "#D9D8D6"}
            stroke={extra.held ? "#000" : "none"}
            strokeDasharray="3 3"
          />
        )}
        <line
          x1="24"
          x2="300"
          y1={capY}
          y2={capY}
          stroke={capped ? ORANGE : "rgba(0,0,0,.45)"}
          strokeWidth={capped ? 1.6 : 1}
          strokeDasharray={capped ? undefined : "4 4"}
          style={{ filter: capped ? "drop-shadow(0 0 6px rgba(247,161,26,.7))" : "none", transition: "stroke 300ms ease" }}
        />
        <text x="300" y={capY - 8} textAnchor="end" fontSize="11" fontFamily="ui-monospace, Menlo, monospace" fill="#000" opacity={capped ? 1 : 0.5}>
          maximum sector allocation 30%
        </text>
        <line x1="24" x2="300" y1={baseY - GAP / 2} y2={baseY - GAP / 2} stroke="rgba(0,0,0,.35)" />
      </svg>
    </div>
  );
}

/** The bracket caption, carrying the valuation rule, looping. */
function ValuationPanel() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr]">
      <div className="p-[28px] max-[600px]:p-[20px]">
        <BracketLabel>{VALUATION.name} risk</BracketLabel>
      </div>
      <div className="grid place-items-center pb-[40px]">
        {/* The deck's short form of the rule (AIF p4), so the ribbon reads at a glance. */}
        <BracketCaption text="Invest only when value outweighs price" loop className="w-full" />
        <p className="mb-[14px] max-w-[40ch] px-[28px] text-center text-[13px] leading-[1.5] text-[#000000]">{VALUATION.rule}</p>
        <p className="max-w-[40ch] px-[28px] text-center text-[11px] leading-[1.55] text-[rgba(0,0,0,.6)]">{VALUATION.detail.join(" ")}</p>
      </div>
    </div>
  );
}

/**
 * The liquidity rule drawn literally: trades flow through in both directions
 * as the reference's dot conveyors, entering on one lane and leaving on the
 * other, while the price line above them barely moves.
 */
function LiquidityPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useStageClock(ref, 0, 1000);
  const count = 14;
  const width = 640;
  const lane = (y: number, direction: 1 | -1) =>
    Array.from({ length: count }, (_, index) => {
      const travel = ((index * (width / count) + t * 70 * direction) % width + width) % width;
      return { x: r2(travel), y, hollow: index % 5 === 2 };
    });
  const price = Array.from({ length: 41 }, (_, index) => `${index ? "L" : "M"}${index * 16} ${r2(40 + Math.sin(index * 0.9 + t * 1.3) * 1.6)}`).join("");
  return (
    <div ref={ref} className="h-full">
      <PanelHead name={LIQUIDITY.name} rule={LIQUIDITY.rule} />
      <svg viewBox="0 0 640 190" className="absolute inset-x-0 bottom-[40px] w-full" aria-hidden="true">
        <path d={price} fill="none" stroke={ORANGE} strokeWidth="1.6" style={{ filter: LINE_GLOW }} />
        <text x="630" y="26" textAnchor="end" fontSize="11" fontFamily="ui-monospace, Menlo, monospace" fill="#000">stock price</text>
        {[...lane(110, 1), ...lane(160, -1)].map((dot, index) =>
          dot.hollow ? (
            <circle key={index} cx={dot.x} cy={dot.y} r="11" fill="none" stroke="rgba(0,0,0,.3)" />
          ) : (
            <circle key={index} cx={dot.x} cy={dot.y} r="11" fill="#000" />
          ),
        )}
        <text x="10" y="92" fontSize="11" fontFamily="ui-monospace, Menlo, monospace" fill="rgba(0,0,0,.55)">enter</text>
        <text x="10" y="186" fontSize="11" fontFamily="ui-monospace, Menlo, monospace" fill="rgba(0,0,0,.55)">exit</text>
      </svg>
      <p className="absolute bottom-[12px] left-[28px] max-w-[60ch] text-[10px] leading-[1.5] text-[rgba(0,0,0,.55)] max-[600px]:left-[20px]">{LIQUIDITY.detail[1]}</p>
    </div>
  );
}

/**
 * The reference's cropped display type: "3 years" too big for its panel, with
 * a price line swinging behind it that the words do not follow.
 */
function MarketPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useStageClock(ref, 0, 1000);
  const line = Array.from({ length: 49 }, (_, index) => {
    const x = index * 14;
    const y = 90 + Math.sin(index * 0.5 + t * 1.4) * 30 + Math.sin(index * 1.3 - t * 0.8) * 12;
    return `${index ? "L" : "M"}${x} ${y.toFixed(1)}`;
  }).join("");
  return (
    <div ref={ref} className="h-full">
      <svg viewBox="0 0 672 180" preserveAspectRatio="none" className="absolute inset-x-0 top-[34%] h-[46%] w-full" aria-hidden="true">
        <path d={line} fill="none" stroke={ORANGE} strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 6px rgba(247,161,26,.6))" }} />
      </svg>
      <PanelHead name={MARKET.name} rule={MARKET.rule} />
      <p className="relative z-[1] -mt-[14px] max-w-[40ch] px-[28px] text-[11px] leading-[1.55] text-[rgba(0,0,0,.6)] max-[600px]:px-[20px]">
        {MARKET.detail[1]}
      </p>
      <strong
        aria-hidden="true"
        className="absolute bottom-[-0.14em] left-[-0.04em] text-[clamp(6rem,13vw,13rem)] leading-none font-normal tracking-[-.06em] whitespace-nowrap"
      >
        3-year
      </strong>
    </div>
  );
}

/**
 * Section C, time-based. A hairline split frame of the four risks, each panel
 * running its own loop on its own clock, the way the reference's panels cut
 * independently. On the homepage it sits inside "How we think about risk".
 */
export default function RiskSection() {
  return (
    <section id="risk-rules" aria-labelledby="risk-rules-heading" className="bg-white">
      <SectionHeading
        id="risk-rules"
        label="Risk management framework"
        heading={HEADINGS.risk}
        lead={RISK_LEAD}
      />
      <div className="mt-[72px]">
        <SplitFrame>
          <Panel>
            <ConcentrationPanel />
          </Panel>
          <Panel>
            <ValuationPanel />
          </Panel>
          <Panel>
            <LiquidityPanel />
          </Panel>
          <Panel>
            <MarketPanel />
          </Panel>
        </SplitFrame>
      </div>
      <SectionFooter
        caveat="For more details on risk factors, key terms etc. please refer to Disclosure documents/PPM/ Key material documents. Investment in securities market are subject to market risks. Read all the related documents carefully before investing."
        source={RISK_SOURCE}
      />
    </section>
  );
}
