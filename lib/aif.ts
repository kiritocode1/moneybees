/*
 * Flyingbee Investment Fund, transcribed from the AIF presentation of August
 * 2026 (reference/moneybee-presentations/INVENTORY-flyingbee.md). Page numbers
 * are in the comments; none of them are rendered. Headings are deck lines;
 * the rest is the deck's facts in plainer words.
 *
 * Kept off the page until the client confirms: the legal entity the fund is a
 * scheme of (p3 says Moneybee Investment Trust, p15 says Moneybee Securities
 * Pvt. Ltd.) and the "aiff" email spelling (p17).
 */

/** Section headings, verbatim or trimmed deck lines. */
export const AIF_HEADINGS = {
  concept: "A privately pooled investment vehicle", // p2, first bullet
  category: "We have therefore opted to set up Flyingbee Investment Fund as a Category III AIF", // p2
  opportunity: "Strategic opportunity with Flyingbee Investment Fund", // p8 title
  process: "Stock selection process", // p5 title
  sectors: "Top 5 sector allocation", // p10 chart title, "Top 5 – Sector Allocation as (%) of AUM"
  performance: "Moneybee AIF performance", // p10 title
  structure: "Structure of Flyingbee Investment Fund", // p3 title
  terms: "Terms of Flyingbee Investment Fund", // p9 title
} as const;

/** p2's two bullets, rewritten plainly. */
export const AIF_CONCEPT = {
  pooled: "An AIF pools money from investors, Indian and foreign, and invests it together in non-traditional investments.",
  units: "In a PMS you hold the stocks in your own demat account. In an AIF you are allotted units of the fund, and the units sit in your demat account.",
} as const;

export type AifCategory = "Cat I AIF" | "Cat II AIF" | "Cat III AIF";
export const AIF_CATEGORIES: readonly AifCategory[] = ["Cat I AIF", "Cat II AIF", "Cat III AIF"];

/**
 * The p2 comparison table, verbatim apart from the dashes. `mark` picks the
 * word the slide underlines in the asset class row.
 */
export const CATEGORY_TABLE: readonly {
  feature: string;
  cells: readonly [string, string, string];
  mark?: readonly [string | null, string | null, string | null];
}[] = [
  { feature: "Strategy focus", cells: ["Impact sectors, early-stage ventures, startups", "Private equity, real estate, debt", "Long-term, dynamic portfolio"] },
  { feature: "Leverage", cells: ["Not allowed", "Not allowed", "Permitted strategically"] },
  {
    feature: "Asset class coverage",
    cells: ["Limited", "Min 50% investment to be made in unlisted entities", "Min 51% investment to be made in listed entities"],
    mark: [null, "unlisted", "listed"],
  },
  { feature: "Taxation", cells: ["Pass through status", "Pass through status", "At fund level"] },
  { feature: "Type of scheme", cells: ["Close ended, min 3 years tenure", "Close ended, min 3 years tenure", "Open ended"] },
];

/** p8's five benefits, names as printed, lines rewritten from the slide. */
export const OPPORTUNITIES: readonly { name: string; title: string; text: string; rows?: readonly (readonly [string, string])[] }[] = [
  {
    name: "Exclusive Access",
    title: "Early-stage winners",
    text: "Access to early-stage winners, and to differentiated opportunities.",
  },
  {
    name: "Seasoned Background",
    title: "Over 45 years",
    text: "Of experience in corporate advisory and wealth management, spent building value in companies.",
  },
  {
    name: "Wealth Creation",
    title: "19.44%",
    text: "A year since our PMS began in August 2007, as on July 2026. The same research team runs the fund.",
    rows: [
      ["Since 2007", "19.44% a year"],
      ["Five years", "19.79% a year"],
    ],
  },
  {
    name: "Dynamic Equity Strategy",
    title: "Listed and pre-IPO",
    text: "High-growth listed companies, and unlisted companies before they go public.",
    rows: [
      ["Listed", "At least 51%"],
      ["Unlisted", "Up to 49%"],
    ],
  },
  {
    name: "Simplified Tax Compliances",
    title: "Taxed at the fund level",
    text: "Income earned by a Category III AIF is taxed at the fund level, and therefore tax free in the investor's hands.",
  },
];

/** p9 and p2: the mix the fund invests to. */
export const AIF_MIX = { listed: 51, unlisted: 49 } as const;

/** p5: the six steps along the deck's ribbon, bullets rewritten lightly ("Incase" fixed). */
export const AIF_PROCESS: readonly { name: string; points: readonly string[] }[] = [
  { name: "Screen", points: ["Screening software", "Investment proposals", "Exclusive market access through intermediaries", "Annual reports", "News reports"] },
  {
    name: "Shortlist",
    points: ["Management credibility", "Strong fundamentals", "Sustainable competitive advantage", "Understanding macro trends", "Attention to sector tailwinds"],
  },
  { name: "Due Diligence", points: ["Management meetings", "Plant visits", "Peer comparison", "In-depth research", "Financial analysis"] },
  { name: "Decision Making", points: ["Liquidity", "Sector exposure", "Determining the risk-reward equation", "Enter at attractive valuation"] },
  { name: "Monitor", points: ["News flow", "Quarterly reviews", "Regular discussions with management and intermediaries", "Stay alert to trends"] },
  { name: "Exit", points: ["On achievement of target price", "In case of deviation from the envisioned growth strategy"] },
];

/** p10: top five sectors, % of AUM, return date July 31, 2026. */
export const AIF_SECTORS: readonly { name: string; share: number }[] = [
  { name: "Food and Agriculture", share: 11.19 },
  { name: "Chemicals", share: 10.61 },
  { name: "Oil & Gas", share: 7.85 },
  { name: "Renewable Energy", share: 7.17 },
  { name: "Power & Transmission", share: 7.07 },
];

/**
 * p10 TWRR returns as on July 31, 2026. `null` is the deck's "NA": the first
 * close was October 30, 2025, so those periods have not run. The benchmark row
 * is printed "S&P BSE 500", without TRI.
 */
export const AIF_RETURNS: readonly { period: string; short: string; fund: number | null; benchmark: number | null }[] = [
  { period: "3 Months", short: "3M", fund: 11.08, benchmark: 3.29 },
  { period: "6 Months", short: "6M", fund: 23.2, benchmark: 1.38 },
  { period: "1 year", short: "1Y", fund: null, benchmark: null },
  { period: "3 year", short: "3Y", fund: null, benchmark: null },
  { period: "5 year", short: "5Y", fund: null, benchmark: null },
];

export const AIF_DATES = { asOn: "July 31, 2026", firstClose: "October 30, 2025" } as const;

/**
 * p3's parties, in the order the figure walks them. Services and payments are
 * the slide's arrow labels in sentence case ("Manger" fixed). `toFund` is the
 * service arrow's direction.
 */
export const AIF_PARTIES: readonly {
  key: string;
  name: string;
  role: string;
  service: string;
  payment: string;
  toFund: boolean;
  logos: readonly { src: string; width: number }[];
}[] = [
  { key: "moneybee", name: "Moneybee", role: "Sponsor and Investment Manager", service: "Fund investment decisions", payment: "Fees", toFund: true, logos: [{ src: "/moneybee-logo.svg", width: 118 }] },
  { key: "axis", name: "Axis Trustee", role: "Trustee", service: "Safeguarding the interest of investors", payment: "Trusteeship fees", toFund: true, logos: [{ src: "/logos/axis-trustee.png", width: 132 }] },
  { key: "orbis", name: "Orbis", role: "Custodian and Fund Accountant", service: "Custody, asset oversight and fund accounting", payment: "Fees", toFund: true, logos: [{ src: "/logos/orbis.png", width: 52 }] },
  {
    key: "brokers",
    name: "Arihant Capital and Moneybee",
    role: "Brokers",
    service: "Execution of trades",
    payment: "Brokerage",
    toFund: true,
    logos: [
      { src: "/logos/arihant-capital.png", width: 120 },
      { src: "/moneybee-logo.svg", width: 104 },
    ],
  },
  { key: "cams", name: "CAMS", role: "Registrar and Transfer Agent", service: "Investor servicing operations", payment: "Fees", toFund: true, logos: [{ src: "/logos/cams.svg", width: 96 }] },
  { key: "investors", name: "Investors", role: "Investors", service: "Sponsor and investment manager services", payment: "Fees", toFund: false, logos: [] },
];

/** p9, every term, in plainer words. The scheme type is p2's. */
export const AIF_TERMS: readonly (readonly [term: string, value: string])[] = [
  ["Minimum investment", "Rs. 1 crore (Rs. 10 Mn)"],
  ["Suitable time frame", "3 to 5 years"],
  ["Type of scheme", "Open ended"],
  ["Fee structure", "A fixed fee, or a fixed fee with profit sharing above a hurdle rate"],
  ["Target investments", "Listed companies at least 51%, unlisted companies up to 49%"],
  ["Exit load", "No exit load"],
  ["Interest of sponsor", "5% of the corpus or Rs. 10 crore, whichever is lower"],
  ["Benchmark", "S&P BSE 500 TRI"],
  ["Investor eligibility", "Resident and non-resident individuals, HUFs and body corporates"],
  ["Redemption limit", "Investors cannot redeem below Rs. 1 crore, the minimum investment"],
  ["First close", "October 30, 2025"], // p10
];
