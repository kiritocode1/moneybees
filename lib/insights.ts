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
            "A solar power producer in Gujarat, selling to the grid and to captive customers.",
          edge:
            "It owns its power evacuation infrastructure and earns more per unit. The promoters have long experience and a record of delivery.",
          growth:
            "About 40 MW of grid and 7.5 MW of captive capacity under development.",
          financials: fy([[59, 6], [102, 22], [230, 43], [644, 110], [1024, 162]]),
          source: "Group profile, April 2026, slide 21",
        },
      },
      {
        name: "Pitti Engineering",
        caseStudy: {
          business:
            "Makes electrical steel laminations, motor cores, die-cast rotors and machined parts.",
          edge:
            "It supplies railways, renewables and power, all sectors with strong tailwinds.",
          growth:
            "Machining capacity is doubling, with a strong order book behind it.",
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
            "Makes and exports heat-, wear- and corrosion-resistant steel castings.",
          edge:
            "Its centrifugally cast alloy assemblies are hard to engineer and harder to copy.",
          growth:
            "It is developing air-injection tubes for sponge-iron plants with the Tata Group.",
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
  "We look for small companies with honest, capable management and a sound business, and get in early. When the business grows, the market re-rates it.";

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
    summary: "The universe we start from.",
    work: ["Annual reports", "In-house screeners", "The team's experience", "News flow", "Research reports"],
  },
  {
    count: "~1200",
    name: "Screening",
    summary: "Fall between ₹150 crore and ₹2,000 crore in market cap, the range we invest in.",
    work: ["Annual reports", "In-house screeners", "The team's experience", "News flow", "Research reports"],
  },
  {
    count: "~350",
    name: "Short list",
    summary: "Make the investment team's shortlist.",
    work: ["Quality of management", "Fundamentals", "External events", "Timing"],
  },
  {
    count: ">100",
    name: "Analyse",
    summary: "Are studied in depth, from the economy down to the company.",
    work: ["Management meetings", "Plant visits", "Competitive advantage", "Peer comparison", "Financial models"],
  },
  {
    count: "~75",
    name: "Construct",
    summary: "Become investment ideas, each weighed on risk against reward.",
    work: [
      "Risk against reward",
      "Macro trends",
      "Buy at the current or target price, or wait on the watchlist",
    ],
  },
  {
    count: "~20",
    name: "Monitor",
    summary: "Make it into the portfolio, and are watched from then on.",
    work: ["Liquidity", "Sector exposure", "Risk management", "News flow", "Quarterly reviews", "Sell discipline"],
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
    rule: "15 to 20 stocks. No sector above 30%.",
    detail: [
      "Each portfolio also caps how much any single stock can hold.",
      "Earnings are checked closely before a stock earns its place.",
    ],
  },
  {
    name: "Valuation",
    rule: "Never without a margin of safety.",
    detail: ["A reasonable valuation comes first in every decision we make."],
  },
  {
    name: "Liquidity",
    rule: "We only buy stocks that trade enough to get in and out without moving the price.",
    detail: [
      "Enough trading volume to enter and exit without moving the price.",
      "A cash reserve for liquidity and volatility.",
      "For unlisted holdings, the exit (an IPO, a buyback or a sale) is planned before we invest.",
    ],
  },
  {
    name: "Market",
    rule: "We hold for at least three years and sit through market swings instead of trading them.",
    detail: [
      "Markets move on the economy and on events. We sit through the swings instead of trading them.",
      "At least three years, or for as long as the reason for owning holds.",
    ],
  },
];

/** Red flags, AIF presentation p6, verbatim. */
export const RED_FLAGS = [
  "Poor corporate governance",
  "Low promoter holding",
  "Expensive valuations",
  "Very high leverage",
  "High institutional ownership",
  "Fashionable sectors",
] as const;

/** What we don't do, AIF presentation p6, verbatim. */
export const WHAT_WE_DONT_DO = [
  "Derivatives and F&O",
  "Trading or short-term bets",
  "Chasing hot stocks",
  "Impulsive decisions",
  "Following the news cycle",
] as const;

/** Exit, AIF presentation p5, verbatim. */
export const EXIT_TRIGGERS = ["The target price is reached", "The company strays from its growth plan"] as const;

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
  "Rs. 1 Mn put into Moneybee PMS in August 2007 was worth Rs. 28.85 Mn by July 2026. The same amount in the S&P BSE 500 TRI grew to Rs. 5.97 Mn.";

/** The disclaimer under the table, AIF presentation p12, verbatim. */
export const RECORD_METHOD =
  "Returns over 1 year period are calculated using a Time Weighted Rate of Return (TWRR) method, returns are adjusted for inflows/ outflows and are after expenses as of July 31, 2026. Please note that the performance of an individual portfolio may vary from that of other investors and that generated by the Investment Approach across all investors because of timing of inflows and outflows of funds or difference in the portfolio composition because of restrictions and other constraints. Performance-related information provided herein is not verified by the regulator.";

export const RECORD_CAVEAT = "Past performance may or may not be sustained in the future.";

export const RECORD_SOURCE = "AIF presentation, August 2026, page 12. Return as on July 31, 2026 as per APMI.";

/* --------------------------------------------------------- philosophy --- */

export type Pillar = { name: string; text: string };

/** Investment philosophy, verbatim: group profile p12's wording where it has the pillar, AIF p4's otherwise (Unbiased decision making). */
export const PILLARS: readonly Pillar[] = [
  { name: "Fundamental driven", text: "We study the numbers and the operations before we buy. The business decides, not the sector." },
  { name: "Long term value", text: "We invest as if we were buying the whole business, and let it compound over years rather than quarters." },
  { name: "Outperform benchmark", text: "We aim to beat the benchmark steadily while protecting the downside, not to chase big wins at the risk of capital." },
  { name: "Unbiased decision making", text: "Every investment is researched in-house. We do not follow the herd or rely on outside agencies." },
  { name: "Management leadership", text: "We spend time with management to understand their goals, and back owners who have allocated capital well." },
  { name: "Risk reward equation", text: "We buy only when value is well above price. The expected return has to justify the risk." },
];

export const PHILOSOPHY_SOURCE = "Group profile, April 2026, slide 12. AIF presentation, August 2026, page 4.";

/* --------------------------------------------------------- discipline --- */

/** What we look for, AIF presentation p6, verbatim. */
export const WHAT_WE_LOOK_FOR = [
  "Disproportionate beneficiaries of economic growth",
  "Strong fundamentals",
  "Quality management",
  "A competitive advantage",
  "Favourable risk and reward",
  "Reasonable valuations",
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
    "45 years in corporate advisory and wealth management",
    "Founded Moneybee Group in 2004",
    "Advises small and medium businesses on turnarounds and growth",
    "Has advised and invested in companies that went on to reward their shareholders",
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
  risk: "Risk management framework",
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

/* ------------------------------------------------------------ the story --- */

/** Group profile p4, verbatim. */
export const INTRODUCTION = {
  lead: "Moneybee Group is a SEBI registered boutique portfolio management services firm, managing assets for its corporate and private clients globally.",
  focus: "An India-focused portfolio manager. We find small and mid-sized companies that lead their niche, and own them while they grow.",
  advice: "Since 2004 we have managed money for families and companies. You can invest with us through a Portfolio Management Service, where the stocks sit in your own demat account, or through Flyingbee, our Category III AIF.",
  team: "Both are run by the same research team, from our office in Lower Parel, Mumbai.",
} as const;

/** PMS Bazaar rankings, December 2024, group profile p5. */
export const RANKINGS = [
  ["3rd", "5-year returns"],
  ["6th", "3-year returns"],
  ["6th", "1-year returns"],
] as const;

/** Why we focus on small cap Indian equities, group profile p14, verbatim. The index and multibagger-share figures are left out: the slide gives no source or date. */
export const SMALL_CAP_THESIS = [
  {
    title: "Growth boom in India",
    text: "India is moving from a developing economy to a developed one. New companies, and whole new sectors, are forming along the way.",
  },
  {
    title: "Faster growth in small cap companies",
    text: "That growth opens the most room for small businesses. We expect them to grow much faster than GDP.",
  },
  {
    title: "Moneybee expertise",
    text: "For two decades we have advised and invested in small businesses. Getting in early has been one of the biggest drivers of our returns.",
  },
] as const;

export const SMALL_CAP_SOURCE = "Group profile, April 2026, slide 14.";

/** Portfolio construction, group profile p17, verbatim. */
export const PORTFOLIO_CONSTRUCTION = [
  ["Asset allocation", "15 to 20 small and mid-cap stocks, drawn from emerging industries."],
  ["Investment horizon", "At least three years, or as long as the thesis holds."],
  ["Diversification", "No sector above 30% of the portfolio."],
  ["Risk mitigation", "We stay away from cyclical businesses."],
  ["Rebalancing", "We sell once a stock has done what we bought it for."],
] as const;

/** Moneybee PMS, group profile p9, p11 and p17, verbatim. */
export const PMS_PRODUCT = {
  name: "Moneybee PMS",
  lead: "A SEBI registered boutique portfolio management firm specialising in small and mid-cap Indian equities",
  points: [
    "Long-only Indian equities",
    "15 to 20 small and mid-cap stocks",
    "A horizon of at least three years",
    "New money goes in by today's risk and reward, not by copying a model portfolio",
    "Fees tied to performance, so our interest follows yours",
    "No exit load",
  ],
  registration: "INP000001959",
} as const;

/** Flyingbee Investment Fund, AIF presentation p2, p8, p9 and p10, verbatim. */
export const AIF_PRODUCT = {
  name: "Flyingbee Investment Fund",
  lead: "High-growth listed companies, and unlisted companies before they go public.",
  terms: [
    ["Minimum investment", "Rs. 1 crore"],
    ["Suitable time frame", "3-5 years"],
    ["Fee structure", "A fixed fee, or a fixed fee with profit share above a hurdle rate"],
    ["Target investments", "At least 51% listed, up to 49% unlisted"],
    ["Exit load", "None"],
    ["Sponsor commitment", "5% of the corpus or Rs. 10 crore, whichever is lower"],
    ["Benchmark", "S&P BSE 500 TRI"],
    ["Who can invest", "Resident and non-resident individuals, HUFs and companies"],
    ["Redemption", "Holdings cannot fall below the Rs. 1 crore minimum"],
  ],
  performance: [
    ["3 Months", "11.08%", "3.29%"],
    ["6 Months", "23.20%", "1.38%"],
  ],
  firstClose: "First Close declared on October 30, 2025",
  registration: "IN/AIF3/24-25/1709",
} as const;

/** AIF presentation p2, verbatim: how an AIF holding differs from a PMS holding. */
export const PMS_VS_AIF =
  "In a PMS you own the stocks in your own demat account. In an AIF you own units of the fund.";

export const PRODUCTS_SOURCE = "Group profile, April 2026, slides 9, 11 and 17. AIF presentation, August 2026, pages 2, 8, 9 and 10.";

export type TeamMember = { name: string; role: string; photo: string; points: readonly string[] };

/** Team profile, AIF presentation p14 and group profile p25 to 26, verbatim. */
export const TEAM: readonly TeamMember[] = [
  {
    name: "Shreyam Shah",
    role: "Fund Manager - Flyingbee Investment Fund",
    photo: "/people/shreyam-shah.jpg",
    points: [
      "A chartered accountant, 14 years at Moneybee leading research on listed and unlisted companies.",
      "Since 2015 he has also run Tee Ventures, India's only dedicated golf-ball manufacturer, so he knows what running a small company takes.",
      "Before Moneybee he worked in assurance at EY.",
    ],
  },
  {
    name: "Suprit Shah",
    role: "Compliance Officer – Moneybee Group",
    photo: "/people/suprit-shah.jpg",
    points: [
      "A law graduate who joined Moneybee in 2022 and now heads compliance.",
      "He works on risk management and fraud prevention, and holds Level 1 of the Enterprise Risk Management programme from the International Risk Management Institute.",
    ],
  },
  {
    name: "Ritesh Mistry",
    role: "Asst. Vice President, Advisory",
    photo: "/people/ritesh-mistry.jpg",
    points: [
      "An MBA with 15 years in corporate research, business modelling, valuation and advisory.",
      "He covers chemicals, automobiles and capital goods.",
    ],
  },
  {
    name: "Anurag Roonwal",
    role: "Asst. Vice President, PMS",
    photo: "/people/anurag-roonwal.jpg",
    points: [
      "A chartered accountant and FRM, with CFA Level 2. Six years at Moneybee finding undervalued small and mid-sized companies.",
      "Before Moneybee he worked in due diligence at EY and statutory audit at PwC.",
    ],
  },
  {
    name: "Manan Shah",
    role: "Asst. Portfolio Manager, PMS",
    photo: "/people/manan-shah.jpg",
    points: [
      "A chartered accountant, five years at Moneybee on research and investment banking for listed and private companies.",
      "Before Moneybee he ran his own diamond trading business in Dubai.",
    ],
  },
  {
    name: "Chinmayi Upadhyay",
    role: "Senior Associate, PMS",
    photo: "/people/chinmayi-upadhyay.jpg",
    points: [
      "A chartered accountant, three years at Moneybee on sector and company research, listed and private.",
      "Before Moneybee she worked in the GST practice at Suresh Surana & Associates (RSM India).",
    ],
  },
];

export const TEAM_SOURCE = "AIF presentation, August 2026, page 14. Group profile, April 2026, slides 25 and 26.";

/** Who it is for: group profile p9 and AIF p9, verbatim. */
export const AUDIENCE = {
  pms: "Create wealth for HNIs, NRI Investors, Ultra HNIs, and Family Offices",
  aif: "Flyingbee is open to resident and non-resident individuals, HUFs and companies.",
} as const;

/** Robust strategy, group profile p11, the first line only. */
export const SELECTION_LEAD = "We meet management more than once and visit the plants before we buy. The numbers are checked line by line.";

/** About Moneybee PMS, group profile p9, verbatim. Sits under "Finding value where the market is not looking". */
export const PMS_APPROACH = "Bottom-up research. We pick companies one at a time, on their own numbers, whatever the sector.";

/**
 * The chapter stack's three cards. Headings are deck lines verbatim (group
 * profile p13 and p11, p19's chart title); the paragraphs are AIF p5's Monitor
 * and Due diligence points, joined into a sentence without adding to them.
 */
export const PROCESS_CHAPTERS = {
  monitor: {
    label: "Monitor",
    title: "Portfolio construction and risk monitoring of ~20 stocks",
    body: "We follow the news, review every holding each quarter, and keep talking to management and the people around the company.",
  },
  diligence: {
    label: "Due diligence",
    title: "Confidence building through analysis of fundamentals, multiple management interviews and plant visits.",
    body: "Management meetings, plant visits, peer comparison and our own financial models.",
  },
  sectors: {
    label: "Sectors",
    title: "Top 5 - Sector Allocation (%)",
    figures: [["Renewable Energy", "12.2"], ["Chemicals", "11.74"], ["Oil & Gas", "8.97"], ["Financials & NBFC", "8.72"], ["Capital Goods", "7.8"]],
  },
} as const;
