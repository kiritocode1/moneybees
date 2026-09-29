/**
 * Copy for /our-approach, from the Content & Visual Plan (docs, §6 "Our
 * Approach"). Headings, the philosophy, the six steps and both lists are the
 * plan's wording. Body copy marked LOREM is placeholder until the client
 * supplies it.
 */

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const APPROACH = {
  heading: "Our Investment Approach",
  /** LOREM */
  lead: LOREM,
} as const;

/** The plan's core philosophy, one stage per word. */
export const PHILOSOPHY_STAGES = [
  { word: "Undiscovered", glyph: "found", text: LOREM_SHORT },
  { word: "Under-researched", glyph: "coverage", text: LOREM_SHORT },
  { word: "Under-estimated", glyph: "gap", text: LOREM_SHORT },
] as const;

/** The plan's stock selection process, names and descriptions verbatim. */
export const PROCESS_STEPS = [
  { name: "Screen", text: "Start with a large universe of companies using financial information, screeners, reports, news flow and team experience." },
  { name: "Shortlist", text: "Review management quality, fundamentals, external events and timing." },
  { name: "Analyse", text: "Conduct management meetings, plant visits, competitive analysis, peer comparison and financial modelling." },
  { name: "Decision Making", text: "Review liquidity, sector exposure, macro trends, valuation and risk-reward." },
  { name: "Monitor", text: "Track news flow, quarterly results, management discussions and business developments." },
  { name: "Exit", text: "Exit when the investment objective is achieved or the investment thesis changes." },
] as const;

/** The plan's two lists, verbatim. */
export const LOOK_FOR = [
  "Disproportionate beneficiaries of economic growth",
  "Robust fundamentals",
  "Quality management",
  "Competitive advantage",
  "Favourable risk-reward",
  "Reasonable valuations",
] as const;

export const DONT_DO = [
  "Derivatives and F&O",
  "Trading and short-term investments",
  "Chasing hot stocks",
  "Impulsive investment decisions",
  "Following market noise or external platforms without independent research",
] as const;

/** The plan's four risks. `glyph` picks each risk's explainer drawing. */
export const RISKS = [
  { name: "Liquidity risk", glyph: "liquidity", text: LOREM },
  { name: "Valuation risk", glyph: "valuation", text: LOREM },
  { name: "Market risk", glyph: "market", text: LOREM },
  { name: "Concentration risk", glyph: "concentration", text: LOREM },
] as const;

/** The page's four parts, for the hero's index. */
export const APPROACH_PARTS = [
  ["Core philosophy", "#philosophy"],
  ["Stock selection process", "#process"],
  ["What we look for", "#look-for"],
  ["Risk management", "#risk"],
] as const;

export const APPROACH_LOREM = { long: LOREM, short: LOREM_SHORT } as const;
