/**
 * Copy for /pms, from the Content & Visual Plan §3 "PMS Page". Headings, the
 * introduction and every list are the plan's wording. Body copy marked LOREM
 * is placeholder until the client supplies it. Performance figures are read
 * from lib/insights.ts, not typed here.
 */

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const PMS_PAGE = {
  heading: "Portfolio Management Services",
  intro:
    "Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies. The approach is research-driven, sector-agnostic and based on understanding businesses, management quality, valuations and risk.",
  /** The plan's "Explore PMS / Get Started" button, split into its two actions. */
  explore: { label: "Explore PMS", href: "/pms-vs-aif" },
  start: { label: "Get Started", href: "/contact?enquiry=pms" },
} as const;

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

/**
 * The funnel's stages. Names are the plan's stock selection steps (§6); the
 * last stage is the plan's portfolio size (§3). No counts: the deck gives none.
 */
export const FUNNEL_STAGES = [
  { name: "Screen", text: LOREM_SHORT },
  { name: "Shortlist", text: LOREM_SHORT },
  { name: "Analyse", text: LOREM_SHORT },
  { name: "Decision Making", text: LOREM_SHORT },
  { name: "15 to 20 high-conviction stocks", text: LOREM_SHORT },
] as const;

/** "Portfolio Approach", verbatim. */
export const PORTFOLIO_APPROACH = [
  "Concentrated portfolio of approximately 15 to 20 high-conviction stocks.",
  "At least 3-year investment horizon or until the investment thesis remains intact.",
  "Maximum sector allocation of 30%.",
  "Regular monitoring and quarterly review.",
  "Disciplined approach to rebalancing and exits.",
] as const;

/** The controls the risk drawing marks, each tied to a line of the plan's §3. */
export const RISK_CONTROLS = [
  { name: "Margin of safety", text: LOREM_SHORT },
  { name: "Sector cap of 30%", text: LOREM_SHORT },
  { name: "Quarterly review", text: LOREM_SHORT },
  { name: "Exit when the thesis changes", text: LOREM_SHORT },
] as const;

export const PERFORMANCE = {
  heading: "PMS Performance",
  asOf: "As of 31 July 2026",
  pms: "Moneybee PMS",
  benchmark: "S&P BSE 500 TRI",
} as const;

/** The page's parts, for the hero's index. */
export const PMS_PARTS = [
  ["Why Moneybee PMS?", "#why"],
  ["Investment philosophy", "#philosophy"],
  ["Stock selection", "#selection"],
  ["Portfolio approach", "#portfolio"],
  ["Risk management", "#risk"],
  ["PMS performance", "#performance"],
] as const;

export const PMS_LOREM = { long: LOREM, short: LOREM_SHORT } as const;
