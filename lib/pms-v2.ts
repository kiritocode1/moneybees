/**
 * Copy for /pms, from the Content & Visual Plan §3 "PMS Page": the lists and
 * performance labels the sections read. The hero's copy is in
 * lib/pms-v3-hero.ts. Body copy marked LOREM
 * is placeholder until the client supplies it. Performance figures are read
 * from lib/insights.ts, not typed here.
 */

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

/** "Why Moneybee PMS?", verbatim. `glyph` picks each point's drawing. */
export const WHY_PMS = [
  { name: "Fundamental research", glyph: "research" },
  { name: "Small and mid-cap focus", glyph: "size" },
  { name: "Concentrated portfolio", glyph: "concentrated" },
  { name: "Quality management", glyph: "management" },
  { name: "Long-term investment approach", glyph: "longterm" },
  { name: "Risk-reward based decisions", glyph: "riskreward" },
  { name: "Focus on overlooked opportunities", glyph: "overlooked" },
] as const;

export type WhyGlyph = (typeof WHY_PMS)[number]["glyph"];

/** The plan's philosophy line, one entry per word. */
export const PHILOSOPHY_WORDS = ["Undiscovered", "Under-researched", "Under-estimated"] as const;

/** The plan's philosophy points, verbatim. */
export const PHILOSOPHY_POINTS = [
  "Fundamental-driven research",
  "Understanding management leadership and capital allocation",
  "Long-term value creation",
  "Risk-reward analysis and margin of safety",
  "Focus on consistent performance while protecting downside",
] as const;

/** "Portfolio Approach", verbatim. */
export const PORTFOLIO_APPROACH = [
  "Concentrated portfolio of approximately 15 to 20 high-conviction stocks.",
  "At least 3-year investment horizon or until the investment thesis remains intact.",
  "Maximum sector allocation of 30%.",
  "Regular monitoring and quarterly review.",
  "Disciplined approach to rebalancing and exits.",
] as const;

export const PERFORMANCE = {
  heading: "PMS Performance",
  asOf: "As of 31 July 2026",
  pms: "Moneybee PMS",
  benchmark: "S&P BSE 500 TRI",
} as const;

export const PMS_LOREM = { long: LOREM, short: LOREM_SHORT } as const;
