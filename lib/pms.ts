/**
 * Facts for the /pms page that lib/insights.ts does not already carry, typed
 * once here. Every value is from the group profile deck (April 2026), cited per
 * block. Headings are deck lines; the rest is rewritten plainly from the slide
 * without adding to it. Returns and wealth come from lib/insights.ts (the newer
 * July 31, 2026 figures), not from slide 19 or the undated slide 11 figures.
 */

/** Slide titles and banner lines, used as section headings, verbatim in sentence case. */
export const PMS_HEADINGS = {
  about: "Know Venture. Know Gain.",
  name: "The name Moneybee was inspired by the hardworking bees",
  strategy: "Robust strategy for consistent performance",
  clientFirst: "Client first approach",
  smallCaps: "Why we focus on small cap Indian equities",
  construction: "Portfolio construction",
  risk: "Risk management framework",
  sectors: "Top 5 sector allocation",
  performance: "Wealth creation by Moneybee PMS",
  returns: "Moneybee PMS performance",
  cases: "Recipe for multibaggers",
  providers: "We work with leading service providers to ensure the best service to clients",
  reporting: "Our reporting",
} as const;

/** The name story, group profile p2. The second line as the slide prints it, in sentence case. */
export const NAME_STORY = "While bees convert nectar into honey, we focus on transforming money into wealth.";

/**
 * About Moneybee PMS, group profile p9: the six statements around the hexagon,
 * left column top to bottom, then right. p9 prints "15-25 high conviction
 * ideas"; p17 and the rest of the site say 15 to 20, so 15 to 20 is used.
 */
export const ABOUT_PMS = [
  "A SEBI registered boutique portfolio manager, specialising in small and mid-cap Indian equities.",
  "Long-only Indian equities, with wealth created at a rate well above the benchmark.",
  "Sector-agnostic and research driven, with a disciplined way of analysing and picking stocks.",
  "A multibagger approach that has outperformed the markets since inception.",
  "A concentrated portfolio of 15 to 20 high conviction ideas.",
  "Built for HNIs, NRI investors, ultra HNIs and family offices.",
] as const;

/** Robust strategy for consistent performance, group profile p11, one line per bullet. */
export const STRATEGY = [
  "We focus on small cap Indian equities.",
  "We look to find promising companies early, in emerging sectors.",
  "Our confidence comes from the fundamentals, several meetings with management and visits to the plants.",
  "We build positions in steps, a pyramiding approach, managing the micro and macro risks as we go.",
  "We are disciplined about when a stock is reshuffled and when it leaves the portfolio.",
] as const;

/** Client first approach, group profile p11. */
export const CLIENT_FIRST = [
  ["Your money", "New money goes into the PMS stocks by today's risk and reward, not by copying a model portfolio."],
  ["Fees", "A transparent, performance-based fee, so our interest follows yours."],
  ["Exit load", "None."],
] as const;

export type ConstructionRule = {
  key: "allocation" | "horizon" | "diversification" | "mitigation" | "rebalancing";
  name: string;
  figure: string;
  text: string;
};

/** Portfolio construction, group profile p17, in the slide's order. */
export const CONSTRUCTION: readonly ConstructionRule[] = [
  {
    key: "allocation",
    name: "Asset allocation",
    figure: "15-20",
    text: "A concentrated portfolio of 15 to 20 small and mid-cap stocks, from a range of emerging industries.",
  },
  {
    key: "horizon",
    name: "Investment horizon",
    figure: "3 years",
    text: "At least three years, or as long as the thesis holds. We keep looking for what could make the market re-rate the stock.",
  },
  {
    key: "diversification",
    name: "Diversification",
    figure: "30%",
    text: "No sector above 30% of the portfolio, and a strict check on the earnings of every stock.",
  },
  {
    key: "mitigation",
    name: "Risk mitigation",
    figure: "No cyclicals",
    text: "We stay away from cyclical businesses and spread the portfolio across emerging sectors.",
  },
  {
    key: "rebalancing",
    name: "Rebalancing",
    figure: "Exit",
    text: "We sell a stock once it has done what we bought it for.",
  },
];

/** Risk management framework, group profile p16, numbered as the slide numbers them. */
export const RISKS = [
  {
    name: "Liquidity risk",
    rule: "Enough trading volume to get in and out without moving the price.",
    detail: "We buy stocks that trade enough to enter and exit a position without a large effect on the price, and keep a reasonable cash allocation for liquidity and volatility.",
  },
  {
    name: "Valuation risk",
    rule: "Never without a margin of safety.",
    detail: "The risk is buying a stock without an adequate margin of safety. A reasonable valuation is the corner stone of every investment decision we make.",
  },
  {
    name: "Market risk",
    rule: "The best way to manage it is to be patient.",
    detail: "Market risk comes from economic conditions and from events in the economy or an industry. We manage it by being patient.",
  },
  {
    name: "Concentration risk",
    rule: "Spread across sectors and stocks, with a cap on each stock.",
    detail: "We keep the portfolio diversified across sectors and stocks, and set a maximum exposure to any single stock.",
  },
] as const;

/** Top 5 - Sector Allocation (%), group profile p19, highest first. The slide's only date is April 30, 2026. */
export const SECTORS = [
  ["Renewable Energy", 12.2],
  ["Chemicals", 11.74],
  ["Oil & Gas", 8.97],
  ["Financials & NBFC", 8.72],
  ["Capital Goods", 7.8],
] as const;

export type CaseFinancials = readonly { year: string; revenue: number; ebidta: number; pat: number }[];

const years = (revenue: readonly number[], ebidta: readonly number[], pat: readonly number[]): CaseFinancials =>
  revenue.map((value, index) => ({ year: `FY${20 + index}`, revenue: value, ebidta: ebidta[index], pat: pat[index] }));

/**
 * The case-study bar charts, "All Amt in Cr", FY20 to FY24, group profile p21
 * to p23: Revenue, EBIDTA and PAT as the slides chart them. Keyed by the names
 * PICK_TIERS uses, so the business, edge and growth text comes from there.
 */
export const CASE_FINANCIALS = {
  "KPI Green Energy": years([59, 102, 230, 644, 1024], [27, 58, 109, 208, 337], [6, 22, 43, 110, 162]),
  "Uni Abex Alloy": years([102, 105, 137, 163, 180], [19, 21, 21, 28, 49], [5, 11, 12, 19, 35]),
  "Pitti Engineering": years([525, 518, 954, 1100, 1202], [78, 80, 133, 152, 179], [17, 29, 52, 59, 90]),
} as const;

export type CaseName = keyof typeof CASE_FINANCIALS;

/** Best practices, group profile p27: the four service providers. */
export const PROVIDERS = [
  { name: "SEBI", service: "Registration", role: "Moneybee is a SEBI registered portfolio management firm." },
  { name: "HDFC Bank", service: "Banking", role: "Banking services, through our tie-up with HDFC Bank." },
  { name: "Institutional brokers", service: "Broking", role: "Broking, through tie-ups with top institutional brokers." },
  { name: "Orbis Financial", service: "Custody", role: "Custodian services, through our tie-up with Orbis Financial." },
] as const;

/** Our reporting, group profile p27. */
export const REPORTING = [
  ["Monthly", "Performance appraisal statement"],
  ["Monthly", "Transaction statement"],
  ["Year end", "Audited statements at the end of the financial year"],
] as const;
