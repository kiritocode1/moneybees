"use client";

import { HEADINGS, RESEARCH_LEAD, RESEARCH_SOURCE, RESEARCH_STAGES } from "@/lib/insights";
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
 * India's outline as (longitude, latitude), simplified, following the Government
 * of India's official depiction: all of Jammu & Kashmir and Ladakh, including
 * Gilgit-Baltistan and Aksai Chin. At honeycomb resolution the coastline only
 * needs a few dozen points, but the northern border must follow the official map.
 */
const INDIA: readonly (readonly [number, number])[] = [
  [77.8, 35.5], [79.5, 35.6], [80.3, 35.0], [80.2, 33.5], [79.0, 32.5], [78.8, 31.0], [80.2, 30.2], [81.1, 30.0],
  [83.0, 27.3], [85.0, 26.8], [88.0, 26.4], [88.1, 27.1], [88.8, 28.1], [89.0, 26.9], [92.0, 26.8], [92.1, 27.4],
  [94.0, 28.9], [95.4, 29.2], [96.9, 28.8], [97.4, 28.2], [97.0, 27.2], [95.2, 26.6], [94.6, 25.0], [94.2, 23.9],
  [93.4, 23.5], [93.2, 22.2], [92.6, 22.0], [92.3, 23.7], [91.4, 24.1], [90.1, 25.2], [89.8, 26.0], [88.6, 26.4],
  [88.1, 25.5], [88.5, 24.3], [88.9, 22.9], [89.0, 21.7], [87.0, 21.4], [86.8, 20.5], [85.5, 19.6], [84.5, 18.5],
  [82.3, 16.5], [80.5, 15.5], [80.2, 13.6], [79.8, 11.5], [79.3, 10.3], [78.2, 8.9], [77.5, 8.1], [76.5, 8.9],
  [75.9, 11.0], [74.8, 12.9], [74.0, 15.0], [73.3, 17.0], [72.8, 19.0], [72.8, 21.0], [72.0, 21.3], [70.4, 20.8],
  [69.0, 22.3], [68.4, 23.5], [70.8, 24.4], [70.0, 25.7], [70.4, 27.5], [72.5, 28.9], [73.8, 30.1], [74.5, 31.0],
  [74.8, 32.4], [73.5, 33.9], [73.9, 34.8], [72.6, 35.5], [74.5, 36.9], [75.5, 36.8], [77.0, 35.9],
];
const LON_MIN = 68;
const LAT_MAX = 37.5;
/** Longitude is narrowed by cos(22°) so the map is not stretched sideways. */
const LON_SCALE = 0.93;
const SPAN_X = 29.5 * LON_SCALE;
const SPAN_Y = 31;

const R = 7;
const W = Math.sqrt(3) * R;
const H = 1.5 * R;
/** Screen units per scaled degree: about 1.6 cells per degree across. */
const UNIT = W / 0.62;
const COLS = Math.ceil((SPAN_X * UNIT) / W);
const ROWS = Math.ceil((SPAN_Y * UNIT) / H);
const VIEW_W = r2(COLS * W + W / 2);
const VIEW_H = r2(ROWS * H + R);

function insideIndia(lon: number, lat: number) {
  let inside = false;
  for (let i = 0, j = INDIA.length - 1; i < INDIA.length; j = i, i += 1) {
    const [xi, yi] = INDIA[i];
    const [xj, yj] = INDIA[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

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
 * The comb over India. Cells outside the map are not drawn. `rank` is noise,
 * so the companies still in play stay spread across the country rather than
 * gathering in one place; `arrive` fills the map from north to south.
 */
const CELLS = (() => {
  const cells: { points: string; rank: number; arrive: number; delay: number; order: number }[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const x = col * W + (row % 2) * (W / 2) + W / 2;
      const y = row * H + R;
      const lon = LON_MIN + x / UNIT / LON_SCALE;
      const lat = LAT_MAX - y / UNIT;
      if (!insideIndia(lon, lat)) continue;
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

/** Cells still in play at each stage, as a share of the map, ending on exactly twenty: one per portfolio stock. */
const KEEP = [1, 0.45, 0.2, 0.11, 0.07].map((share) => Math.round(CELLS.length * share)).concat(20);

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
      label="Stock selection process"
      heading={HEADINGS.research}
      lead={RESEARCH_LEAD}
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
      source={RESEARCH_SOURCE}
    />
  );
}
