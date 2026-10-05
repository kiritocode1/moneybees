/**
 * Copy for the redesigned product pages: the product hero shared by /pms and
 * /aif (one template, only the data and the mark differ) and the risk figure.
 * The other internal pages' heroes are in lib/page-heroes.ts.
 * Hero lines and figures are the content plan's facts (§3 and §4) and the
 * decks' (lib/insights.ts). Risk body lines are LOREM until the client
 * supplies them.
 */

const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

/** Which mark in components/pms-v3/marks.tsx a hero draws: the two products, then one per internal page. */
export type MarkKind = "pms" | "aif" | "compare" | "approach" | "performance" | "cases" | "team" | "careers" | "contact" | "investor" | "insights";

/** One figure in the hero's bottom bar: a mono label over its value. `icon` draws a small line icon before the label; `href` makes the value a link. */
export type HeroFigure = { label: string; value: string; icon?: "phone" | "email"; href?: string };

/** A hero button: the orange pill, or the outlined one for a second action. */
export type HeroAction = { label: string; href: string; outline?: boolean };

export type ProductHeroData = {
  mark: MarkKind;
  /** The title: one line, or two with the second stepped in. */
  title: readonly [string] | readonly [string, string];
  sentence: string;
  actions?: readonly HeroAction[];
  /** Three to six, spread edge to edge along the bottom. */
  figures: readonly HeroFigure[];
};

export const PMS_HERO = {
  mark: "pms",
  title: ["Portfolio", "Management Services"],
  sentence: "Moneybee PMS is focused on long-term investment in Indian equities, with a strong focus on small and mid-cap companies.",
  actions: [{ label: "Get Started", href: "/contact?enquiry=pms" }],
  figures: [
    { label: "PMS since", value: "Aug 2007" },
    { label: "Focus", value: "Small and mid caps" },
    { label: "Approach", value: "Research-driven" },
    { label: "Style", value: "Sector-agnostic" },
    { label: "Holding", value: "Your own demat account" },
    { label: "Benchmark", value: "S&P BSE 500 TRI" },
  ],
} as const satisfies ProductHeroData;

export const AIF_HERO = {
  mark: "aif",
  title: ["Flyingbee", "Investment Fund"],
  sentence: "Flyingbee Investment Fund is a Category III AIF managed by Moneybee.",
  actions: [{ label: "Get Started", href: "/contact?enquiry=aif" }],
  figures: [
    { label: "Category", value: "III AIF" },
    { label: "Minimum", value: "Rs. 1 crore" },
    { label: "Time frame", value: "3 to 5 years" },
    { label: "Invests in", value: "Listed and pre-IPO" },
    { label: "Benchmark", value: "S&P BSE 500 TRI" },
    { label: "Exit load", value: "None" },
  ],
} as const satisfies ProductHeroData;

/** A risk and its line, numbered bottom-up on the stacked-blocks figure: 01 is the lowest block. */
export type RiskCallout = { name: string; text: string };

export const PMS_RISKS = [
  { name: "Liquidity risk", text: LOREM_SHORT },
  { name: "Valuation risk", text: LOREM_SHORT },
  { name: "Market risk", text: LOREM_SHORT },
  { name: "Concentration risk", text: LOREM_SHORT },
] as const satisfies readonly RiskCallout[];
