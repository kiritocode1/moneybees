"use client";

import { HEADINGS, RED_FLAGS, RESEARCH_STAGES, SELECTION_LEAD, WHAT_WE_DONT_DO, WHAT_WE_LOOK_FOR } from "@/lib/insights";
import { StackedList } from "./discipline-section";
import FactSection, { Eyebrow, type FigureState, ORANGE, PanelTitle, r2, SOLID_GLOW } from "./fact-section";
import { BracketCaption, DotField, Panel, SplitFrame } from "./motion-language";

/*
 * The honeycomb card from the movin reference (reference/movin-03635, the
 * "Attributed revenue" panel): a faint comb of empty cells that fills in, with
 * a figure above and a row per group below. Here the comb is the research
 * universe. Each panel that scrolls past narrows it to the cells still in play
 * at that stage, dropped cells fading to pale grey, until the last stage holds
 * twenty cells, one per stock in the portfolio, lit orange.
 */

/**
 * The comb, copied cell by cell from the reference card at its fullest
 * (reference/movin-03635/hex/strip-f4.png): a 22 by 15 field of faint cells
 * with a wide, rounded cluster inside it. Each row lists the cluster's columns
 * as inclusive [from, to] runs; odd rows sit half a cell to the right. The
 * hole in row 3 and the strays in rows 12 and 13 are the reference's own.
 */
const COLS = 22;
const ROWS = 15;
const CLUSTER: readonly (readonly (readonly [number, number])[])[] = [
  [],
  [[9, 12]],
  [[7, 14]],
  [[5, 7], [9, 15]],
  [[5, 18]],
  [[4, 18]],
  [[4, 18]],
  [[3, 18]],
  [[5, 19]],
  [[4, 17]],
  [[5, 17]],
  [[4, 16]],
  [[3, 3], [8, 15]],
  [[8, 8], [10, 11], [13, 13]],
  [],
];
const inCluster = (row: number, col: number) => CLUSTER[row].some(([from, to]) => col >= from && col <= to);

const R = 7;
const W = Math.sqrt(3) * R;
const H = 1.5 * R;
const VIEW_W = r2(COLS * W + W / 2);
const VIEW_H = r2(ROWS * H + R);

const noise = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const hex = (x: number, y: number, radius: number) =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = (Math.PI / 3) * corner + Math.PI / 6;
    return `${r2(x + radius * Math.cos(angle))},${r2(y + radius * Math.sin(angle))}`;
  }).join(" ");

/**
 * The cluster's cells. `rank` is noise, so the companies still in play stay
 * spread across the comb rather than gathering in one place; `arrive` fills it
 * from top to bottom.
 */
const CELLS = (() => {
  const cells: { points: string; rank: number; arrive: number; delay: number; order: number }[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (!inCluster(row, col)) continue;
      const x = col * W + (row % 2) * (W / 2) + W / 2;
      const y = row * H + R;
      cells.push({
        points: hex(r2(x), r2(y), R - 1),
        rank: noise(row * 97 + col),
        arrive: (y / VIEW_H) * 0.7 + noise(row * 31 + col * 7) * 0.15,
        delay: Math.round(noise(row * 13 + col * 3) * 320),
        order: 0,
      });
    }
  }
  [...cells].sort((a, b) => a.rank - b.rank).forEach((cell, index) => {
    cell.order = index;
  });
  return cells;
})();

/** The faint cells around the cluster, the empty comb the card sits on. */
const FIELD = Array.from({ length: ROWS * COLS }, (_, index) => {
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  return inCluster(row, col) ? null : hex(r2(col * W + (row % 2) * (W / 2) + W / 2), r2(row * H + R), R - 1);
}).filter((points) => points !== null);

/**
 * Cells still in play at each stage, from the deck's counts on a log scale:
 * the whole cluster at ~6000, exactly twenty at ~20 (one per portfolio stock),
 * and every stage in between smaller than the one before.
 */
const COUNTS = RESEARCH_STAGES.map(({ count }) => Number(count.replace(/[^0-9]/g, "")));
const KEEP = COUNTS.map((count) => {
  const top = COUNTS[0];
  const last = COUNTS[COUNTS.length - 1];
  const t = Math.log(count / last) / Math.log(top / last);
  return Math.round(last * (CELLS.length / last) ** t);
});

function HoneycombFigure({ progress, selected, onSelect }: FigureState) {
  const settled = progress > 0.8;
  const last = RESEARCH_STAGES.length - 1;
  const stage = settled ? selected : 0;
  const keep = KEEP[stage];
  return (
    <div className="w-full max-w-[600px] bg-white p-[22px] shadow-[0_1px_0_rgba(0,0,0,.06),0_14px_44px_rgba(0,0,0,.07)] max-[900px]:p-[14px]">
      <div className="flex items-baseline justify-between text-[11px] text-[rgba(0,0,0,.6)]">
        <span>{RESEARCH_STAGES[stage].name}</span>
        <span>Stock selection process</span>
      </div>
      <strong className="mt-[2px] block text-[clamp(1.6rem,2.4vw,2.2rem)] font-normal tracking-[-.04em] tabular-nums">
        {RESEARCH_STAGES[stage].count}
      </strong>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="mx-auto mt-[10px] block max-h-[46svh] w-auto max-w-full"
        aria-hidden="true"
      >
        {FIELD.map((points) => (
          <polygon key={points} points={points} fill="#f4f3f1" />
        ))}
        {CELLS.map((cell, index) => {
          const arrived = progress >= cell.arrive;
          const inPlay = arrived && cell.order < keep;
          const fill = !arrived ? "#f4f3f1" : inPlay ? (stage === last ? ORANGE : "#1b1b1b") : "#e2e1df";
          return (
            <polygon
              key={index}
              points={cell.points}
              fill={fill}
              style={{
                transition: `fill 420ms ease ${cell.delay}ms`,
                // Only the twenty portfolio cells glow, the way the cards light a single solid.
                filter: inPlay && stage === last ? SOLID_GLOW : undefined,
              }}
            />
          );
        })}
      </svg>
      <ul className="mt-[14px] grid list-none gap-[2px] p-0">
        {RESEARCH_STAGES.map((item, index) => (
          <li key={item.count}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              className="flex w-full items-center justify-between bg-[#F7F6F4] px-[10px] py-[6px] text-left text-[12px]"
              style={{ color: index === stage && settled ? "#000" : "rgba(0,0,0,.5)" }}
            >
              <span className="flex items-center gap-[8px]">
                <i
                  className="h-[7px] w-[7px] rounded-full"
                  style={{ background: index === stage && settled ? (index === last ? ORANGE : "#1b1b1b") : "#d6d5d3" }}
                />
                {item.name}
              </span>
              <span className="font-mono text-[11px] tabular-nums">{item.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
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
      label="Our process"
      heading={HEADINGS.research}
      lead={SELECTION_LEAD}
      intro={
        <div className="mt-[72px]">
          <SplitFrame>
            <Panel className="min-h-0">
              <DotField sentence="What is our selection process?" keep={20} />
            </Panel>
            <Panel className="grid place-items-center">
              <BracketCaption text="What makes us special?" className="w-full" />
            </Panel>
          </SplitFrame>
        </div>
      }
      panels={RESEARCH_STAGES.map((_, stage) => ({ part: stage, content: <StagePanel stage={stage} /> }))}
      figure={HoneycombFigure}
      after={
        <div className="mb-[40px]">
          <SplitFrame cols={3} cross={false}>
            <Panel className="min-h-[380px]">
              <StackedList title="What we look for" items={WHAT_WE_LOOK_FOR} offset={0} />
            </Panel>
            <Panel className="min-h-[380px]">
              <StackedList title="What we don't do" items={WHAT_WE_DONT_DO} offset={1.1} />
            </Panel>
            <Panel className="min-h-[380px]">
              <StackedList title="Red flags" items={RED_FLAGS} offset={2.3} accent />
            </Panel>
          </SplitFrame>
        </div>
      }
    />
  );
}
