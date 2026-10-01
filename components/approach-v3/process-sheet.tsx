"use client";

import { useShown } from "@/components/about-v2/shared";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { PROCESS_STEPS } from "@/lib/approach";
import { type Pt, type SheetNode, type SheetSpec, SheetFigure } from "./sheet";

/*
 * The stock selection process (content plan §6) as study 09's process sheet:
 * six stages under full-width rules, each with the plan's sentence on the left
 * and a figure drawn from that sentence on the right. Every figure uses the
 * sheet's own vocabulary, and its one orange element is the step's result:
 *
 *   Screen          the five sources as an interlocking chain, feeding the universe of companies
 *   Shortlist       the four checks as overlapping rings; what passes all four goes on
 *   Analyse         the five kinds of work aimed at one company inside the targeting ring
 *   Decision Making the company, the five things reviewed in a dotted box, the decision
 *   Monitor         the four things tracked, feeding a holding that is watched round and round
 *   Exit            the holding, either condition, the exit
 *
 * Labels inside the figures are the plan's own words from each sentence.
 */

/** Rings of radius `r` interlocking by 6.8% of the diameter, along x or y from `at`. */
const chain = (ids: readonly string[], labels: readonly (readonly string[])[], at: Pt, r: number, axis: "x" | "y" = "x"): SheetNode[] =>
  ids.map((id, index) => {
    const step = index * 2 * r * 0.932;
    return { id, kind: "ring", r, label: labels[index], at: axis === "x" ? [at[0] + step, at[1]] : [at[0], at[1] + step] };
  });

/** Four rings on a square of side 1.3 r, so a small region is inside all four; each label sits in its ring's outer lobe. */
const four = (labels: readonly (readonly string[])[], at: Pt, r: number): SheetNode[] => {
  const half = 0.65 * r;
  const corners: Pt[] = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  return corners.flatMap(([sx, sy], index): SheetNode[] => [
    { id: `check-${index}`, kind: "ring", r, at: [at[0] + sx * half, at[1] + sy * half] },
    // Out along x more than y, where the lobe is widest for a line of text.
    { id: `check-label-${index}`, kind: "label", lines: labels[index], at: [at[0] + sx * (half + 0.38 * r), at[1] + sy * (half + 0.3 * r)] },
  ]);
};

const SOURCES = [["Financial", "information"], ["Screeners"], ["Reports"], ["News flow"], ["Team", "experience"]] as const;
const CHECKS = [["Management", "quality"], ["Fundamentals"], ["External", "events"], ["Timing"]] as const;
const METHODS = [["Management", "meetings"], ["Plant", "visits"], ["Competitive", "analysis"], ["Peer", "comparison"], ["Financial", "modelling"]] as const;
const REVIEWED = ["Liquidity", "Sector exposure", "Macro trends", "Valuation", "Risk-reward"] as const;
const TRACKED = [["News flow"], ["Quarterly", "results"], ["Management", "discussions"], ["Business", "developments"]] as const;

const sourceIds = SOURCES.map((_, index) => `source-${index}`);
const methodIds = METHODS.map((_, index) => `method-${index}`);
const trackIds = TRACKED.map((_, index) => `track-${index}`);

type Figure = { wide: SheetSpec; narrow: SheetSpec };

const FIGURES: Record<(typeof PROCESS_STEPS)[number]["name"], Figure> = {
  Screen: {
    wide: {
      font: 11,
      nodes: [...chain(sourceIds, SOURCES, [0, 0], 44), { id: "universe", kind: "field", at: [532, 0], r: 88, accent: true }],
      edges: [{ from: sourceIds[4], to: "universe", dotted: true }],
      tags: [{ at: [532, -104], text: "Universe of companies" }],
    },
    narrow: {
      font: 9.5,
      nodes: [...chain(sourceIds, SOURCES, [0, 0], 31), { id: "universe", kind: "field", at: [115.6, 176], r: 80, accent: true }],
      edges: [{ from: sourceIds[2], to: "universe", dotted: true }],
      tags: [{ at: [115.6, 278], text: "Universe of companies" }],
    },
  },
  Shortlist: {
    wide: {
      font: 11,
      nodes: [...four(CHECKS, [0, 0], 70), { id: "start", kind: "point", at: [0, 0] }, { id: "shortlist", kind: "ring", at: [262, 0], r: 66, fill: "accent", label: ["Shortlist"] }],
      edges: [{ from: "start", to: "shortlist", dotted: true }],
    },
    narrow: {
      font: 9.5,
      nodes: [...four(CHECKS, [0, 0], 60), { id: "start", kind: "point", at: [0, 0] }, { id: "shortlist", kind: "ring", at: [0, 214], r: 56, fill: "accent", label: ["Shortlist"] }],
      edges: [{ from: "start", to: "shortlist", dotted: true }],
    },
  },
  Analyse: {
    wide: {
      font: 11,
      nodes: [
        { id: "target", kind: "ring", at: [0, 0], r: 94, dotted: true },
        { id: "company", kind: "ring", at: [0, 0], r: 38, fill: "accent", label: ["Company"] },
        ...chain(methodIds.slice(0, 2), METHODS.slice(0, 2), [-236, -41], 44, "y"),
        ...chain(methodIds.slice(2), METHODS.slice(2), [236, -82], 44, "y"),
      ],
      edges: methodIds.map((id) => ({ from: id, to: "target" })),
    },
    narrow: {
      font: 9.5,
      nodes: [
        { id: "target", kind: "ring", at: [0, 0], r: 84, dotted: true },
        { id: "company", kind: "ring", at: [0, 0], r: 34, fill: "accent", label: ["Company"] },
        ...chain(methodIds.slice(0, 2), METHODS.slice(0, 2), [-37.3, -196], 40),
        ...chain(methodIds.slice(2), METHODS.slice(2), [-74.6, 196], 40),
      ],
      edges: methodIds.map((id) => ({ from: id, to: "target" })),
    },
  },
  "Decision Making": {
    wide: {
      font: 11,
      nodes: [
        { id: "company", kind: "ring", at: [0, 0], r: 44, label: ["Company"] },
        { id: "reviewed", kind: "box", at: [196, 0], w: 140, h: 132, items: REVIEWED },
        { id: "decision", kind: "square", at: [384, 0], s: 84, label: "Decision" },
      ],
      edges: [
        { from: "company", to: "reviewed", dotted: true },
        { from: "reviewed", to: "decision", dotted: true },
      ],
    },
    narrow: {
      font: 9.5,
      nodes: [
        { id: "company", kind: "ring", at: [0, 0], r: 40, label: ["Company"] },
        { id: "reviewed", kind: "box", at: [0, 154], w: 132, h: 118, items: REVIEWED },
        { id: "decision", kind: "square", at: [0, 306], s: 78, label: "Decision" },
      ],
      edges: [
        { from: "company", to: "reviewed", dotted: true },
        { from: "reviewed", to: "decision", dotted: true },
      ],
    },
  },
  Monitor: {
    wide: {
      font: 11,
      nodes: [
        ...chain(trackIds, TRACKED, [0, -111.8], 40, "y"),
        { id: "watch", kind: "cycle", at: [262, 0], r: 72 },
        { id: "holding", kind: "ring", at: [262, 0], r: 40, fill: "accent", label: ["Holding"] },
      ],
      edges: trackIds.map((id) => ({ from: id, to: "watch" })),
    },
    narrow: {
      font: 9.5,
      nodes: [
        ...chain(trackIds, TRACKED, [0, 0], 36),
        { id: "watch", kind: "cycle", at: [100.6, 178], r: 64 },
        { id: "holding", kind: "ring", at: [100.6, 178], r: 36, fill: "accent", label: ["Holding"] },
      ],
      edges: trackIds.map((id) => ({ from: id, to: "watch" })),
    },
  },
  Exit: {
    wide: {
      font: 11,
      nodes: [
        { id: "holding", kind: "ring", at: [0, 0], r: 44, label: ["Holding"] },
        { id: "achieved", kind: "ring", at: [184, -60], r: 50, label: ["Objective", "achieved"] },
        { id: "changed", kind: "ring", at: [184, 60], r: 50, label: ["Thesis", "changes"] },
        { id: "exit", kind: "square", at: [376, 0], s: 84, label: "Exit" },
      ],
      edges: [
        { from: "holding", to: "achieved", dotted: true },
        { from: "holding", to: "changed", dotted: true },
        { from: "achieved", to: "exit" },
        { from: "changed", to: "exit" },
      ],
    },
    narrow: {
      font: 9.5,
      nodes: [
        { id: "holding", kind: "ring", at: [0, 0], r: 40, label: ["Holding"] },
        { id: "achieved", kind: "ring", at: [-62, 150], r: 48, label: ["Objective", "achieved"] },
        { id: "changed", kind: "ring", at: [62, 150], r: 48, label: ["Thesis", "changes"] },
        { id: "exit", kind: "square", at: [0, 300], s: 78, label: "Exit" },
      ],
      edges: [
        { from: "holding", to: "achieved", dotted: true },
        { from: "holding", to: "changed", dotted: true },
        { from: "achieved", to: "exit" },
        { from: "changed", to: "exit" },
      ],
    },
  },
};

/** One stage of the sheet: its rule draws across as it arrives, then its figure draws. */
function Stage({ index, step }: { index: number; step: (typeof PROCESS_STEPS)[number] }) {
  const { ref, shown, t } = useShown<HTMLLIElement>(0.2);
  const figure = FIGURES[step.name];
  return (
    <li ref={ref} className="relative">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-white/25" style={{ transform: shown ? "none" : "scaleX(0)", transition: `transform ${t(1200)}` }} />
      <div className={`${COLUMN} grid grid-cols-1 gap-12 py-[64px] md:py-[96px] xl:min-h-[min(66vh,580px)] xl:grid-cols-12 xl:items-center xl:gap-x-6`}>
        <div className="xl:col-span-4">
          <span aria-hidden="true" className="block font-serif text-[56px] leading-none text-white/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-5 font-serif text-[clamp(2rem,1.4rem+1.6vw,2.75rem)] leading-[1.05] font-normal tracking-[-.015em]">{step.name}</h3>
          <p className="mt-4 max-w-[36ch] text-[17px] leading-[1.55] text-white/70">{step.text}</p>
        </div>
        <div className="xl:col-span-8 xl:col-start-5 xl:flex xl:justify-center">
          <SheetFigure wide={figure.wide} narrow={figure.narrow} />
        </div>
      </div>
    </li>
  );
}

export function ProcessSheet() {
  return (
    <section id="process" aria-labelledby="process-heading" className="scroll-mt-[96px] bg-black text-white">
      <div className={`${COLUMN} pt-[120px] pb-[64px] max-md:pt-[80px] max-md:pb-[40px]`}>
        <h2 id="process-heading" className={`m-0 ${SUBHEAD}`}>
          Stock Selection Process
        </h2>
      </div>
      <ol className="m-0 list-none border-b border-white/25 p-0">
        {PROCESS_STEPS.map((step, index) => (
          <Stage key={step.name} index={index} step={step} />
        ))}
      </ol>
    </section>
  );
}
