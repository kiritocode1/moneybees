/**
 * The facts the /about page shows that lib/insights.ts does not carry yet, each
 * transcribed from the group profile deck (April 2026) and naming its slide.
 * Logos are the deck's own images, extracted from the PDF into public/about/logos.
 * Nothing here is compliance-approved for public use yet.
 */

export type Logo = {
  src: string;
  /** Pixel size of the extracted image, so it is never drawn larger than the deck holds it. */
  width: number;
  height: number;
  /** The name as the logo itself prints it. */
  alt: string;
};

const logo = (file: string, width: number, height: number, alt: string): Logo => ({
  src: `/about/logos/${file}.png`,
  width,
  height,
  alt,
});

/** Group profile p1 and p9. */
export const TAGLINE = "Know Venture. Know Gain.";

/** Group profile p2, the name story, verbatim in capitals on the slide. */
export const NAME_STORY = {
  heading: "The name Moneybee was inspired by the hardworking bees",
  line: "Bees turn nectar into honey. We turn money into wealth.",
} as const;

/**
 * Who the group is: group profile p3 (founded 2004), p4 (SEBI registered
 * boutique, corporate and private clients, advice to listed and unlisted
 * businesses) and p32 (the two companies at the Lower Parel office).
 */
export const ABOUT_INTRO = {
  heading: "Advising companies and managing wealth since 2004",
  lead: "Moneybee Group is a SEBI registered boutique portfolio manager, looking after money for corporate and private clients around the world. Alongside it, we advise businesses, listed and unlisted, on the decisions that shape them.",
} as const;

export type GroupBusiness = { name: string; detail: string; href: string; external: boolean };

/**
 * The group's businesses. The founder slide (p3) lists broking, fund
 * management and investment advisory; the two outside links are the ones the
 * site navigation already carries.
 */
export const GROUP_BUSINESSES: readonly GroupBusiness[] = [
  { name: "Portfolio management", detail: "PMS and the Flyingbee AIF", href: "/pms", external: false },
  { name: "Investment banking", detail: "moneybeeadvisors.com", href: "https://moneybeeadvisors.com/", external: true },
  { name: "Stock broking", detail: "moneybeesecurities.in", href: "https://moneybeesecurities.in/", external: true },
];

/** Group profile p3. The points lib/insights.ts FOUNDER leaves out are the last two. */
export const FOUNDER_PROFILE = {
  name: "Dhiren Shah",
  role: "Founder and Managing Director",
  years: "45+",
  yearsLabel: "Years in corporate advisory and wealth management",
  points: [
    "Started Moneybee Group in 2004.",
    "Advises small and medium businesses on turnarounds and growth, helping them reach their full potential.",
    "His knowledge of many industries shaped portfolios that have outperformed the market and stayed invested across market cycles.",
    "Has advised and invested in companies that went on to reward their shareholders.",
    "A mentor, advisor, partner and friend to industry leaders, peers and colleagues.",
  ],
} as const;

export type FeaturedDeal = {
  logo: Logo;
  /** The words the slide sets in bold. */
  kind: string;
  line: string;
};

/**
 * Featured deals 01 to 12, group profile p7 and p8, in the slides' order.
 * Lines are the slides' sentences made plain. Deal 12 prints no company name:
 * the slide's text ("Yesssworks") and its logo ("YesssWorks.") differ.
 */
export const FEATURED_DEALS: readonly FeaturedDeal[] = [
  {
    logo: logo("sun-pharma", 76, 103, "Sun Pharma"),
    kind: "Initial public issue",
    line: "Advisors to the initial public issue of Sun Pharmaceuticals Ltd.",
  },
  {
    logo: logo("zandu", 300, 86, "Zandu"),
    kind: "Hostile takeover",
    line: "Represented the Parikh family in the hostile takeover of Zandu Pharmaceutical Works by Emami Ltd.",
  },
  {
    logo: logo("rubfila", 378, 78, "Rubfila International Limited"),
    kind: "Acquisition and turnaround",
    line: "The acquisition of Rubfila International Ltd from its Malaysian liquidator, a placement with Indian HNIs, and the company's turnaround.",
  },
  {
    logo: logo("zcl", 197, 88, "ZCL Chemicals Limited"),
    kind: "Joint venture",
    line: "Advisors on the joint venture of Nagase & Co. Ltd with ZCL.",
  },
  {
    logo: logo("nulife", 105, 68, "NuLife"),
    kind: "Turnaround and growth advisory",
    line: "Currently engaged on the turnaround and growth of MRK Healthcare Pvt Ltd.",
  },
  {
    logo: logo("aditya-birla", 79, 76, "Aditya Birla Chemicals"),
    kind: "Acquisition",
    line: "Advisors to Aditya Birla Chemicals (Europe) GmbH on its acquisition of CTP Advanced Materials GmbH.",
  },
  {
    logo: logo("setco", 170, 44, "Setco Auto Systems"),
    kind: "Listing and debt",
    line: "Strategic advisory on the listing of Setco Automotive Ltd's shares and the debt it raised after.",
  },
  {
    logo: logo("candor", 220, 68, "Candor Foods"),
    kind: "Fund raise",
    line: "Raised funds for Candor Foods Pvt Ltd from OFB Tech Pvt Ltd.",
  },
  {
    logo: logo("psi-data", 300, 143, "PSI Data"),
    kind: "Capital reduction",
    line: "Advisors on the reduction of equity share capital at PSI Data Systems, an affiliate of Groupe Bull of France.",
  },
  {
    logo: logo("znl", 190, 168, "ZNL"),
    kind: "Turnaround and growth advisory",
    line: "Turnaround and growth advisory for Precision Bearings Pvt Ltd.",
  },
  {
    logo: logo("medtech", 261, 94, "Medtech"),
    kind: "Family settlement",
    line: "Advisors on the family settlement between the owners of MRK Healthcare Pvt Ltd and Medtech Medical Devices Pvt Ltd.",
  },
  {
    logo: logo("yesssworks", 300, 44, "YesssWorks"),
    kind: "Fund raise and strategic advisory",
    line: "Fund raising, and a strategic advisory role alongside it.",
  },
];

/** Group profile p4, rewritten plainly. */
export const ADVISORY_LEAD =
  "Knowing many industries well lets us advise businesses as well as invest in them. That means listings, acquisitions, fund raises and turnarounds, for companies listed and unlisted.";

export type RecentDeal = {
  logo: Logo;
  sector: string;
  kind: string;
  /** ₹ crore. */
  raise: number;
  /** ₹ crore. */
  valuation: number;
  /** Whether the slide calls it pre-money. Kevadiya's line says only "valuation". */
  preMoney: boolean;
};

/**
 * Deals executed in the last three months, group profile p6, left to right.
 * Company names stay on the logos: Caliber's text reads "Caliber Mercantile"
 * and its logo "Caliber Mining and Logistics Limited"; Heritage's text reads
 * "Infraspaces", its logo "Infraspace".
 */
export const RECENT_DEALS: readonly RecentDeal[] = [
  { logo: logo("caliber", 167, 149, "Caliber Mining and Logistics Limited"), sector: "Coal mining", kind: "Pre-IPO", raise: 1, valuation: 1224, preMoney: true },
  { logo: logo("vikran", 305, 224, "Vikran Engineering & Exim Pvt. Ltd"), sector: "EPC", kind: "Pre-IPO", raise: 25, valuation: 1300, preMoney: true },
  { logo: logo("onix", 173, 84, "Onix Renewable Limited"), sector: "Renewable", kind: "Pre-IPO, from HNI investors", raise: 41, valuation: 450, preMoney: true },
  { logo: logo("kevadiya", 191, 134, "KC, Kevadiya Construction"), sector: "Water EPC", kind: "Fund raise", raise: 42.5, valuation: 450, preMoney: false },
  { logo: logo("heritage", 179, 281, "HIP Heritage Infraspace (India) Limited"), sector: "Infrastructure", kind: "Series A", raise: 4, valuation: 750, preMoney: true },
];

export const RECENT_DEALS_HEADING = "Deals executed in the last three months";

/**
 * PMS Bazaar Top Performance, as on 31 December 2024, group profile p5.
 * Only Moneybee's own row is kept (strategy "QueenBee"); the peers named in
 * the screenshots stay off the page until compliance clears them. `field` is
 * the number of rows the screenshot shows.
 */
export const RANKED_RETURNS = [
  { period: "5-year", rank: 3, ordinal: "3rd", returns: 44.69, field: 7 },
  { period: "3-year", rank: 6, ordinal: "6th", returns: 38.67, field: 7 },
  { period: "1-year", rank: 6, ordinal: "6th", returns: 51.95, field: 7 },
] as const;

/** Group profile p32: both companies sit at the one address. */
export const GROUP_COMPANIES = ["Moneybee Investment Advisors Pvt Ltd", "Moneybee Securities Pvt Ltd"] as const;
