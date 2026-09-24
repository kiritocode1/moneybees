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
 * AIF deck August 2026 page 11 carry the same five tiers, labelled as the
 * slide labels them. The case studies are profile slides 21 to 23, quoted
 * verbatim. Each slide's title also carries a year and price ("FY2023 -
 * Rs. 85"); the factsheet review marks those as labels rather than purchase
 * prices, so they are left out.
 */
export const PICK_TIERS: readonly PickTier[] = [
  { multiple: ">100X", picks: [{ name: "Fairchem Organics" }, { name: "Privi Speciality Chemicals" }] },
  {
    multiple: "> 20X",
    picks: [
      {
        name: "KPI Green Energy",
        caseStudy: {
          business:
            "One of the leading Gujarat based renewable power generating company, operating both as an IPP and CPP producer for providing solar power",
          edge:
            "Established Infrastructure for evacuation power, higher per unit revenue realisation. Extensive promoter experience and strong execution capabilities in this domain",
          growth:
            "Strong Order book of ~40 MW under development for IPP and ~7.48MW under CPP, leading to improvement in margins and earnings growth for the next 3-5 years",
          financials: fy([[59, 6], [102, 22], [230, 43], [644, 110], [1024, 162]]),
          source: "Group profile, April 2026, slide 21",
        },
      },
      {
        name: "Pitti Engineering",
        caseStudy: {
          business:
            "Manufacturer of Electrical Steel Laminations, Motors Cores, Sub-Assemblies, Die-Cast Rotors and Machining of metal components",
          edge:
            "Supplying components in key industries with strong tailwinds such as railway, renewables and power sector. Capex driven economy to support robust growth as well.",
          growth:
            "Doubling of machining hour capacity leading to better margins and strong order book position providing long term growth visibility",
          financials: fy([[525, 17], [518, 29], [954, 52], [1100, 59], [1202, 90]]),
          source: "Group profile, April 2026, slide 23",
        },
      },
    ],
  },
  {
    multiple: "> 10X",
    picks: [
      {
        name: "Uni Abex Alloy",
        caseStudy: {
          business:
            "One of the leading manufacturers and exporters of centrifugal and static castings in heat, wear and corrosion-resistant stainless-steel alloys",
          edge:
            "Centrifugally cast haste alloy assemblies are not easily replicable due to the complexity behind engineering thereby creating high entry barrier",
          growth:
            "Partnership with TATA Group to develop air injection tubes critical for sponge iron technology thereby creating opportunities for revenue growth",
          financials: fy([[102, 5], [105, 11], [137, 12], [163, 19], [180, 35]]),
          source: "Group profile, April 2026, slide 22",
        },
      },
      { name: "Tejas Networks" },
    ],
  },
  { multiple: "> 5X", picks: "More than 10 stocks" },
  { multiple: "> 2X or more", picks: "More than 25 stocks" },
];

export const PICKS_SOURCE = "Group profile, April 2026, slides 20 to 23. AIF presentation, August 2026, page 11.";

/** Recipe for multibaggers, group profile slide 14, verbatim. */
export const PICKS_LEAD =
  "There are several promising small companies that have capable and honest managements with sound business models. Early investment in such business creates access to rapid growth, which leads to valuation rerating and thus significant returns on investments.";

/** The footnote every case-study slide carries, verbatim. */
export const PICKS_CAVEAT =
  "The stock(s)/sector(s) mentioned above is provided only as illustration purpose. These sector(s)/stock(s) mentioned above do not constitute any recommendation of the same and Moneybee Investment Pvt Ltd, Portfolio Manager may or may not have any future position in these sector(s)/stock(s). Past performance may or may not be sustained in the future.";

/* ------------------------------------------------------------ research --- */

export type ResearchStage = {
  count: string;
  name: string;
  summary: string;
  work: readonly string[];
};

/**
 * The stock selection process, top to bottom, one entry per plane of the
 * figure. Stage names, sentences and bullets are group profile slide 13 as
 * printed; the screening column holds both the ~6000 and the ~1200 figure.
 */
export const RESEARCH_STAGES: readonly ResearchStage[] = [
  {
    count: "~6000",
    name: "Screening",
    summary: "From universe of ~6000 companies",
    work: ["Annual report", "In-house screeners", "Team experience", "News flows", "Reports"],
  },
  {
    count: "~1200",
    name: "Screening",
    summary: "~1200 companies are within 150-2000 Cr market cap and investable",
    work: ["Annual report", "In-house screeners", "Team experience", "News flows", "Reports"],
  },
  {
    count: "~350",
    name: "Short list",
    summary: "~350 companies are shortlisted with the help of experienced investment team",
    work: ["Quality Management", "Fundamentals", "External events", "Correct Timing"],
  },
  {
    count: ">100",
    name: "Analyse",
    summary: "Macro and micro analysis on >100 companies",
    work: ["Management meetings", "Competitive advantage", "Plant visits", "Peer comparison", "Financial models"],
  },
  {
    count: "~75",
    name: "Construct",
    summary: "Idea generation on ~75 stocks",
    work: [
      "Determining the risk reward equation",
      "Understanding macro trends",
      "Buy the stock at current/ target price or add to watchlist",
    ],
  },
  {
    count: "~20",
    name: "Monitor",
    summary: "Portfolio construction and risk monitoring of ~20 stocks",
    work: ["Liquidity", "Sector exposure", "Risk management", "News flow", "Quarterly Reviews", "Sell discipline"],
  },
];

/** Fundamental driven, group profile slide 12, verbatim. */
export const RESEARCH_LEAD =
  "Bottom-up sector agnostic research with focus on strong financials. We rely on comprehensive research into the core financials and business operations of companies which ultimately derive superior returns.";

export const RESEARCH_SOURCE = "Group profile, April 2026, slides 12 and 13.";

/* ---------------------------------------------------------------- risk --- */

export type RiskRule = { name: string; rule: string; detail: readonly string[] };

/**
 * The risk management framework. `rule` is the deck's own headline sentence
 * for each risk; `detail` is the rest of its text. AIF presentation p7 and
 * group profile p16 to 17, verbatim.
 */
export const RISK_RULES: readonly RiskRule[] = [
  {
    name: "Concentration",
    rule: "Concentrated portfolio consisting of 15-20 small and mid cap stocks",
    detail: [
      "Establish a diversified portfolio with a maximum sector allocation of 30% and a stringent due diligence on the earnings",
      "Endeavor to have adequately diversified portfolio across sectors and stocks. A maximum exposure limit to any single stock will be set to ensure diversification and mitigate concentration risk.",
    ],
  },
  {
    name: "Valuation",
    rule: "Reasonable valuation is the corner stone of all our investment decision",
    detail: ["The risk of buying stocks without adequate margin of safety."],
  },
  {
    name: "Liquidity",
    rule: "Invest in stocks with sufficient trading volumes",
    detail: [
      "Invest in stocks with sufficient trading volumes to ensure the ability to enter and exit positions without significantly impacting the stock price.",
      "Maintain a reasonable cash allocation in the portfolio to manage liquidity and handle market volatility.",
      "There is no active market for unlisted shares and exits often depend on IPOs, buybacks, or strategic sales. Have a pre-defined exit strategy to minimize liquidity risk.",
    ],
  },
  {
    name: "Market",
    rule: "The best way to manage market risk is by being patient.",
    detail: [
      "This typically arises from certain fundamental economic conditions or events in the economy or industry.",
      "Invest with at least 3-year time horizon or till the investment thesis is intact and actively search for conditions that can trigger a stock rerating",
    ],
  },
];

/** Red flags, AIF presentation p6, verbatim. */
export const RED_FLAGS = [
  "Companies with poor corporate governance",
  "Low Promoter Holding",
  "Expensive Valuations",
  "Very High Leverage",
  "High Institutional Ownership",
  "Fad/ hot sectors",
] as const;

/** What we don't do, AIF presentation p6, verbatim. */
export const WHAT_WE_DONT_DO = [
  "Indulge in Derivatives and F&O",
  "Trading and Short Term investments",
  "Chase Returns by going after 'hot stocks'",
  "Impulsive Decisions",
  "Getting influenced by news and other platforms",
] as const;

/** Exit, AIF presentation p5, verbatim. */
export const EXIT_TRIGGERS = ["On achievement of target price", "Incase of deviation from envisioned growth strategy"] as const;

/** Risk mitigation, group profile p17, verbatim. */
export const RISK_LEAD =
  "Be mindful and stay away from cyclical business, and maintain a diverse portfolio that includes investments in a variety of emerging sectors.";

export const RISK_SOURCE = "AIF presentation, August 2026, pages 5 to 7. Group profile, April 2026, pages 16 to 17.";

/* -------------------------------------------------------------- record --- */

export type PeriodReturn = { period: string; queenbee: number; benchmark: number };

/** Queenbee against the S&P BSE 500 TRI, CAGR returns as on July 31, 2026 as per APMI. AIF presentation p12, labels as printed. */
export const PERIOD_RETURNS: readonly PeriodReturn[] = [
  { period: "1 month", queenbee: 2.08, benchmark: 2.02 },
  { period: "3 months", queenbee: 8.44, benchmark: 3.29 },
  { period: "6 months", queenbee: 13.63, benchmark: 1.38 },
  { period: "1 year", queenbee: -7.45, benchmark: 1.95 },
  { period: "3 year", queenbee: 13.96, benchmark: 10.67 },
  { period: "5 year", queenbee: 19.79, benchmark: 11.01 },
  { period: "Since Inception", queenbee: 19.44, benchmark: 9.9 },
];

/** Rs. 1 Mn invested on August 1, 2007, valued on July 31, 2026, in Rs. Mn as the deck states it. */
export const WEALTH = { start: 1, queenbee: 28.85, benchmark: 5.97 } as const;

/** The wealth sentence, AIF presentation p12, verbatim. */
export const RECORD_LEAD =
  "An investment of Rs. 1 Mn with Moneybee PMS on August 1, 2007 would be worth Rs. 28.85 Mn as of July 31, 2026 as opposed to Rs. 5.97 Mn from S&P BSE500 TRI.";

/** The disclaimer under the table, AIF presentation p12, verbatim. */
export const RECORD_METHOD =
  "Returns over 1 year period are calculated using a Time Weighted Rate of Return (TWRR) method, returns are adjusted for inflows/ outflows and are after expenses as of July 31, 2026. Please note that the performance of an individual portfolio may vary from that of other investors and that generated by the Investment Approach across all investors because of timing of inflows and outflows of funds or difference in the portfolio composition because of restrictions and other constraints. Performance-related information provided herein is not verified by the regulator.";

export const RECORD_CAVEAT = "Past performance may or may not be sustained in the future.";

export const RECORD_SOURCE = "AIF presentation, August 2026, page 12. Return as on July 31, 2026 as per APMI.";

/* --------------------------------------------------------- philosophy --- */

export type Pillar = { name: string; text: string };

/** Investment philosophy, AIF presentation p4, verbatim. Six pillars around the bee. */
export const PILLARS: readonly Pillar[] = [
  { name: "Fundamental driven", text: "Bottom-up sector agnostic research focused on core financials and business operations, delivering superior returns" },
  { name: "Long term value", text: "Adopt business owner mindset, embracing long-term compounding over short-term volatility" },
  { name: "Outperform benchmark", text: "Aim for consistent benchmark outperformance while prioritizing downside protection over high-risk returns" },
  { name: "Unbiased decision making", text: "Uninfluenced by 'herd mentality', all investments are thoroughly researched internally with zero reliance on external agencies" },
  { name: "Management leadership", text: "Deep understanding of management's vision, goals and priorities. Partner with owners with demonstrated prudent capital allocation skills" },
  { name: "Risk reward equation", text: "Invest only when value outweighs price, ensuring margin of safety and justified risk" },
];

export const PHILOSOPHY_SOURCE = "Group profile, April 2026, slide 12. AIF presentation, August 2026, page 4.";

/* --------------------------------------------------------- discipline --- */

/** What we look for, AIF presentation p6, verbatim. */
export const WHAT_WE_LOOK_FOR = [
  "Disproportionate beneficiaries of economic growth",
  "Robust Fundamentals",
  "Quality Management",
  "Competitive Advantage",
  "Favourable Risk Reward",
  "Reasonable Valuations",
] as const;

/** Robust strategy for consistent performance, group profile p11, verbatim. */
export const DISCIPLINE_LEAD =
  "Confidence building through analysis of fundamentals, multiple management interviews and plant visits. Disciplined approach for shuffling and exit in portfolio stocks.";

export const DISCIPLINE_SOURCE = "AIF presentation, August 2026, pages 5 and 6. Group profile, April 2026, slide 11.";

/* ------------------------------------------------------------ founder --- */

/** About the founder, AIF presentation p13 and group profile p3, verbatim. */
export const FOUNDER = {
  name: "Mr. Dhiren Shah, Managing Director",
  credentials: "FCA, GRAD CWA, LLB, M.COM",
  quote:
    "Long-term investing isn't about chasing headlines, it's about owning quality businesses with the patience to let time compound your conviction. In a world obsessed with speed, we win by standing still when it matters most.",
  points: [
    "45+ years of rich experience in corporate advisory and wealth management",
    "Started Moneybee Group in 2004 offering Equity Broking, Fund Management and Investment Advisory",
    "Specializes in turnaround and growth advisory for small and medium enterprises helping them unlock their full potential",
    "Has been advisor and investor in companies helping them unlock value and reward shareholders with exponential returns",
  ],
} as const;

export const FOUNDER_SOURCE = "AIF presentation, August 2026, page 13. Group profile, April 2026, slide 3.";

/* ---------------------------------------------------------- structure --- */

/** Where each party sits around the fund, as on the slide. */
export type StructureSide = "top-left" | "top-right" | "left" | "right" | "bottom-left" | "bottom-right";

/**
 * One party and its pair of arrows. Every party on the slide has two: a
 * service in one direction and a payment in the other. `toFund` is true when
 * the service arrow points at the fund.
 */
export type StructureParty = {
  name: string;
  role: string;
  side: StructureSide;
  service: string;
  payment: string;
  toFund: boolean;
};

/** Structure of Flyingbee Investment Fund, AIF presentation p3. Names, roles and arrow labels as printed. */
export const STRUCTURE_FUND = {
  name: "Flyingbee Investment Fund",
  role: "Category III AIF, scheme of Moneybee Investment Trust",
} as const;

export const STRUCTURE_PARTIES: readonly StructureParty[] = [
  { name: "Moneybee", role: "Sponsor and Investment Manager", side: "top-left", service: "Fund Investment Decisions", payment: "Fees", toFund: true },
  { name: "Axis Trustee", role: "Trustee", side: "top-right", service: "Safeguarding the interest of Investors", payment: "Trusteeship Fees", toFund: true },
  { name: "Orbis", role: "Custodian and Fund Accountant", side: "left", service: "Custody and Asset Oversight Fund Accounting", payment: "Fees", toFund: true },
  { name: "Arihant Capital, Moneybee", role: "Brokers", side: "right", service: "Execution of Trades", payment: "Brokerage", toFund: true },
  { name: "Investors", role: "Investors", side: "bottom-left", service: "Sponsor and Investment Manger Services", payment: "Fees", toFund: false },
  { name: "CAMS", role: "Registrar and Transfer Agent", side: "bottom-right", service: "Investor Servicing Operations", payment: "Fees", toFund: true },
];

export const STRUCTURE_SOURCE = "AIF presentation, August 2026, pages 2, 3 and 8.";

/* ----------------------------------------------------------- headings --- */

/**
 * The deck's prestige lines, one per section, each verbatim. Slide titles sit
 * in the bracket label above; these carry the heading.
 */
export const HEADINGS = {
  philosophy: "Undiscovered. Under researched. Under estimated.",
  research: "Early identification of promising companies in emerging sectors",
  discipline: "Robust strategy for consistent performance",
  picks: "Our superior gains stem from venturing into opportunities overlooked by the investment crowd",
  products: "Specialising in small and mid-cap Indian equities",
  structure: "Exclusive Access to early-stage winners & differentiated opportunities",
  risk: "Prioritizing downside protection over high-risk returns",
  record: "Compounding is the magic that turns small, regular investments into substantial wealth",
} as const;

/* ------------------------------------------------------------ contact --- */

/** Contact details, AIF presentation p17, as printed. */
export const CONTACT = {
  company: "Moneybee Securities Pvt Ltd",
  address: ["303, Tower A, Peninsula Business Park,", "G. K. Marg, Lower Parel (W), Mumbai 400 013"],
  phones: ["022 4030 2080", "+91 98672 90143"],
  website: "www.moneybee.in",
  emails: [
    ["Onboarding queries", "customersupportaif@moneybee.in"],
    ["Product related queries", "marketingaif@moneybee.in"],
    ["Investor grievance", "grievanceaif@moneybee.in"],
  ],
} as const;

/**
 * SEBI registrations for the two businesses this site covers, AIF
 * presentation p15. Broking and depository numbers belong to other Moneybee
 * businesses and stay off this pure-play site.
 */
export const REGISTRATIONS = [
  ["Portfolio Management Services", "INP000001959"],
  ["Alternative Investment Fund", "IN/AIF3/24-25/1709"],
] as const;
