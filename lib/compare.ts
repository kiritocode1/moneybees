/**
 * Copy for /pms-vs-aif, from the Content & Visual Plan §5 "PMS vs AIF". The
 * heading, the comparison rows and both explanations are the plan's wording.
 * Body copy marked LOREM is placeholder until the client supplies it.
 */

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const COMPARE = {
  /** The plan's heading, with its dash set as a colon (no dashes in visible copy). */
  heading: "PMS vs AIF: Understanding the Difference",
  /** LOREM */
  lead: LOREM,
} as const;

/** The plan's two diagrams: PMS → Investor → Securities, and AIF → Fund → Investments. */
export const CHAINS = {
  pms: ["PMS", "Investor", "Securities"],
  aif: ["AIF", "Fund", "Investments"],
} as const;

/** The plan's simple comparison, row by row. `glyph` picks each row's pair of drawings. */
export const COMPARISON = [
  { pms: "Investor directly holds securities", aif: "Investor receives units of the fund", glyph: "holding" },
  { pms: "Portfolio managed for the client", aif: "Money is pooled into a fund", glyph: "money" },
  { pms: "Individual portfolio", aif: "Fund structure", glyph: "structure" },
  { pms: "PMS strategies", aif: "Flyingbee Investment Fund", glyph: "product" },
  { pms: "Direct demat holding", aif: "Fund-level investment structure", glyph: "account" },
] as const;

export type ComparisonGlyph = (typeof COMPARISON)[number]["glyph"];

/** The plan's simple explanation, verbatim. */
export const EXPLANATION = {
  pms: "The investor’s portfolio is managed according to the agreed investment mandate.",
  aif: "Investors contribute to a pooled fund structure that is managed according to the fund’s approved strategy and documents.",
} as const;

/** The page's parts, for the hero's index. */
export const COMPARE_PARTS = [
  ["The two structures", "#structures"],
  ["Simple comparison", "#comparison"],
  ["Simple explanation", "#explanation"],
] as const;
