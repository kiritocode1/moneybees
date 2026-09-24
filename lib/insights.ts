/**
 * Every figure the homepage fact sections show, in one place, so a number is
 * typed once and each section reads it from here. Values are copied from the
 * client decks as summarised in docs/moneybee-slide-factsheets.md; each block
 * names its slide. None of it is compliance-approved for public use yet.
 */

/** Revenue and profit after tax, ₹ crore, FY20 to FY24, as the case-study slides chart them. */
export type Financials = readonly {
  year: string;
  revenue: number;
  profit: number;
}[];

export type CaseStudy = {
  business: string;
  edge: string;
  growth: string;
  financials: Financials;
  source: string;
};

export type Pick = { name: string; caseStudy?: CaseStudy };

export type PickTier = {
  multiple: string;
  /** Named holdings, or a count when the deck gives only a count. */
  picks: readonly Pick[] | string;
};

const fy = (rows: readonly (readonly [number, number])[]): Financials =>
  rows.map(([revenue, profit], index) => ({ year: `FY${20 + index}`, revenue, profit }));

/**
 * The multibagger slide, apex first. Group profile April 2026 slide 20 and
 * AIF deck August 2026 page 11 carry the same five tiers. The case studies are
 * profile slides 21 to 23. Each slide's title also carries a year and price
 * ("FY2023 - Rs. 85"); the factsheet review marks those as labels rather than
 * purchase prices, so they are left out.
 */
export const PICK_TIERS: readonly PickTier[] = [
  { multiple: "100×", picks: [{ name: "Fairchem Organics" }, { name: "Privi Speciality Chemicals" }] },
  {
    multiple: "20×",
    picks: [
      {
        name: "KPI Green Energy",
        caseStudy: {
          business: "Generates solar power in Gujarat, selling it both as an independent producer and to captive customers.",
          edge: "Owns its power-evacuation infrastructure and earns more per unit than the grid rate.",
          growth: "About 40 MW of independent and 7.5 MW of captive capacity under development.",
          financials: fy([[59, 6], [102, 22], [230, 43], [644, 110], [1024, 162]]),
          source: "Group profile, April 2026, slide 21",
        },
      },
      {
        name: "Pitti Engineering",
        caseStudy: {
          business: "Makes electrical steel laminations, motor cores, die-cast rotors and machined metal components.",
          edge: "Supplies railways, renewables and power, with capital spending already in place for growth.",
          growth: "Doubling machining-hour capacity, with better margins and a strong order book.",
          financials: fy([[525, 17], [518, 29], [954, 52], [1100, 59], [1202, 90]]),
          source: "Group profile, April 2026, slide 23",
        },
      },
    ],
  },
  {
    multiple: "10×",
    picks: [
      {
        name: "Uni Abex Alloy",
        caseStudy: {
          business: "Makes and exports centrifugal and static castings in heat-, wear- and corrosion-resistant stainless alloys.",
          edge: "Its centrifugally cast alloy assemblies are hard to engineer and hard for a new entrant to copy.",
          growth: "A partnership with the Tata Group to develop air-injection tubes for sponge-iron plants.",
          financials: fy([[102, 5], [105, 11], [137, 12], [163, 19], [180, 35]]),
          source: "Group profile, April 2026, slide 22",
        },
      },
      { name: "Tejas Networks" },
    ],
  },
  { multiple: "5×", picks: "More than 10 stocks" },
  { multiple: "2×", picks: "More than 25 stocks" },
];

export const PICKS_SOURCE = "Group profile, April 2026, slide 20. AIF presentation, August 2026, page 11.";

/** The footnote every case-study slide carries, shortened without changing what it says. */
export const PICKS_CAVEAT =
  "Past Moneybee PMS holdings, shown for illustration only and not as a recommendation. Moneybee may or may not hold them in future. The presentations do not give purchase dates or how each multiple was calculated. Past performance may not be sustained.";

/* ------------------------------------------------------------ research --- */

export type ResearchStage = {
  count: string;
  name: string;
  summary: string;
  work: readonly string[];
};

/**
 * The PMS selection funnel, top to bottom, one entry per plane of the figure.
 * Group profile April 2026 slide 13. Counts are the deck's approximations.
 */
export const RESEARCH_STAGES: readonly ResearchStage[] = [
  {
    count: "~6,000",
    name: "The universe",
    summary: "The full universe of companies the screens start from.",
    work: ["Annual reports", "In-house screeners", "News flow and reports", "The team's own experience"],
  },
  {
    count: "~1,200",
    name: "Investable",
    summary: "Companies with a market capitalisation between ₹150 crore and ₹2,000 crore.",
    work: ["Market capitalisation of ₹150 crore to ₹2,000 crore"],
  },
  {
    count: "~350",
    name: "Shortlisted",
    summary: "Chosen by the investment team for a closer look.",
    work: ["Quality of management", "Fundamentals", "External events", "Timing"],
  },
  {
    count: ">100",
    name: "Analysed",
    summary: "Macro and company-level analysis.",
    work: ["Management meetings", "Plant visits", "Competitive advantage", "Peer comparison", "Financial models"],
  },
  {
    count: "~75",
    name: "Investment ideas",
    summary: "Each one weighed on risk against reward before any money goes in.",
    work: ["Risk-reward", "Macro trends", "Buy at the current or target price, or add to the watchlist"],
  },
  {
    count: "~20",
    name: "The portfolio",
    summary: "Built and then watched for as long as the reason for owning each company holds.",
    work: ["Liquidity", "Sector exposure", "Risk management", "Quarterly reviews", "Sell discipline"],
  },
];

export const RESEARCH_SOURCE = "Group profile, April 2026, slide 13.";

/* ---------------------------------------------------------------- risk --- */

export type RiskRule = { name: string; rule: string; detail: readonly string[] };

/** The four risks the AIF deck names and what Moneybee says it does about each. AIF presentation p7, group profile p16 to 17. */
export const RISK_RULES: readonly RiskRule[] = [
  {
    name: "Concentration",
    rule: "15 to 20 holdings. No sector above 30%.",
    detail: [
      "A maximum exposure to any single stock is set for each portfolio.",
      "Holdings are spread across sectors rather than stacked in one theme.",
    ],
  },
  {
    name: "Valuation",
    rule: "No purchase without a margin of safety.",
    detail: [
      "Value is weighed against price before buying.",
      "The expected return has to justify the risk taken to earn it.",
    ],
  },
  {
    name: "Liquidity",
    rule: "Enough trading volume to get in and out.",
    detail: [
      "Listed holdings need volumes that let a position be entered and exited without moving the price much.",
      "A reasonable cash allocation is kept for liquidity and volatility.",
      "For unlisted AIF holdings, the exit route (IPO, buyback or strategic sale) is decided before investing.",
    ],
  },
  {
    name: "Market",
    rule: "Patience, not trading.",
    detail: [
      "Economic and industry swings are sat through rather than traded around.",
      "A minimum three-year horizon, or longer while the reason for owning holds.",
    ],
  },
];

/** What keeps a company out, AIF presentation p6. */
export const RED_FLAGS = [
  "Poor corporate governance",
  "Low promoter holding",
  "Expensive valuation",
  "Very high leverage",
  "High institutional ownership",
  "Fashionable or \"hot\" sectors",
] as const;

/** The two reasons to sell, AIF presentation p5. */
export const EXIT_TRIGGERS = ["The target price is reached", "The company moves away from its expected growth strategy"] as const;

export const RISK_SOURCE = "AIF presentation, August 2026, pages 5 to 7. Group profile, April 2026, pages 16 to 17.";

/* -------------------------------------------------------------- record --- */

export type PeriodReturn = { period: string; queenbee: number; benchmark: number };

/** Queenbee PMS against the S&P BSE 500 TRI, as at 31 July 2026. AIF presentation p12. */
export const PERIOD_RETURNS: readonly PeriodReturn[] = [
  { period: "1 month", queenbee: 2.08, benchmark: 2.02 },
  { period: "3 months", queenbee: 8.44, benchmark: 3.29 },
  { period: "6 months", queenbee: 13.63, benchmark: 1.38 },
  { period: "1 year", queenbee: -7.45, benchmark: 1.95 },
  { period: "3 years", queenbee: 13.96, benchmark: 10.67 },
  { period: "5 years", queenbee: 19.79, benchmark: 11.01 },
  { period: "Since inception", queenbee: 19.44, benchmark: 9.9 },
];

/** ₹10 lakh invested on 1 August 2007, valued on 31 July 2026. In lakh. */
export const WEALTH = { start: 10, queenbee: 288.5, benchmark: 59.7 } as const;

export const RECORD_METHOD =
  "Time-weighted returns, after expenses, adjusted for inflows and outflows. APMI data. Individual portfolios can differ, and SEBI has not verified these figures. Performance is also published in the Disclosure Document and the monthly factsheet after review by the compliance officer.";

export const RECORD_SOURCE = "AIF presentation, August 2026, page 12. As at 31 July 2026.";
