import { PROCESS_STEPS } from "@/lib/approach";
import { RECORD_CAVEAT, RECORD_METHOD } from "@/lib/insights";
import { PERFORMANCE_LOREM } from "@/lib/performance";
import { PERFORMANCE, PHILOSOPHY_POINTS, PHILOSOPHY_WORDS, PMS_INTRO_APPROACH, PMS_LOREM, PORTFOLIO_APPROACH, WHY_PMS, type WhyGlyph } from "@/lib/pms-v2";
import { type MarkKind, PMS_HERO, PMS_RISKS, type ProductHeroData } from "@/lib/pms-v3-hero";

/*
 * What each /pms section says, in the shape the PMS page record in /admin
 * stores it: today's words, so the first migration writes them and the page
 * reads the same. Lorem lines move over as they are, marked LOREM, until the
 * client supplies the copy. Returns, the as-of date and the growth of Rs. 1
 * Mn are not here: they come from the latest PMS fact sheet.
 */

const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

/** The hero every internal page opens on (components/pms-v3/product-hero.tsx). */
export type ProductHeroContent = {
  mark: MarkKind;
  title1: string;
  title2?: string | null;
  sentence: string;
  actions?: { label: string; link: string; outline?: boolean | null }[] | null;
  figures?: { label: string; value: string }[] | null;
};

export type PerformanceContent = { label?: string | null; heading: string; lead?: string | null; note?: string | null; method?: string | null };
export type WealthContent = { label?: string | null; heading: string; lead?: string | null };
export type WhyContent = { label?: string | null; heading: string; intro?: string | null; points?: { name: string; line?: string | null; drawing: WhyGlyph }[] | null };
export type PhilosophyContent = { label?: string | null; heading: string; words?: { word: string }[] | null; points?: { point: string }[] | null };
export type SelectionContent = { label?: string | null; heading: string; steps?: { name: string; text?: string | null }[] | null };
export type PortfolioContent = {
  heading: string;
  sectorCap: number;
  sectorLine: string;
  holdingsFrom: number;
  holdingsTo: number;
  holdingsLine: string;
  rules?: { rule: string }[] | null;
};
export type RisksContent = { label?: string | null; heading: string; risks?: { name: string; text?: string | null }[] | null };

/** A page's hero as coded (lib/page-heroes.ts, lib/pms-v3-hero.ts), in the shape /admin stores it. */
export const heroContent = (hero: ProductHeroData): ProductHeroContent => ({
  mark: hero.mark,
  title1: hero.title[0],
  title2: hero.title[1] ?? null,
  sentence: hero.sentence,
  actions: (hero.actions ?? []).map(({ label, href, outline }) => ({ label, link: href, outline: Boolean(outline) })),
  figures: hero.figures.map(({ label, value }) => ({ label, value })),
});

export const PMS_HERO_CONTENT: ProductHeroContent = heroContent(PMS_HERO);

/** The deck's method note (AIF presentation p12) with its date as a token, so it follows the fact sheet. The footer prints it too. */
export const METHOD_NOTE = RECORD_METHOD.replace("31 July 2026", "{asOfDay}");

export const PMS_PERFORMANCE: PerformanceContent = {
  label: "Performance",
  heading: PERFORMANCE.heading,
  // LOREM
  lead: PMS_LOREM.long,
  note: "Returns in %. Periods above 1 year are CAGR.",
  // The deck's method note (AIF presentation p12) with its date as a token, then the caveat and the content plan's disclaimer (§7).
  method: `${METHOD_NOTE} ${RECORD_CAVEAT} Past performance does not guarantee future performance.`,
};

// LOREM
export const PMS_WEALTH: WealthContent = { label: "Wealth growth", heading: "Wealth Growth", lead: PERFORMANCE_LOREM.long };

/** One LOREM line per point until the client supplies them. */
const WHY_LINES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
];

export const PMS_WHY: WhyContent = {
  label: "Why Moneybee",
  heading: "Why Moneybee PMS?",
  intro: PMS_INTRO_APPROACH,
  points: WHY_PMS.map((point, index) => ({ name: point.name, line: WHY_LINES[index] ?? LOREM_SHORT, drawing: point.glyph })),
};

export const PMS_PHILOSOPHY: PhilosophyContent = {
  label: "Our philosophy",
  heading: "Investment Philosophy",
  words: PHILOSOPHY_WORDS.map((word) => ({ word })),
  points: PHILOSOPHY_POINTS.map((point) => ({ point })),
};

export const PMS_SELECTION: SelectionContent = {
  label: "Stock selection",
  heading: "Stock Selection",
  // Screen, Shortlist, Analyse and Decision Making; Monitor and Exit come after the portfolio is built.
  steps: PROCESS_STEPS.slice(0, 4).map(({ name, text }) => ({ name, text })),
};

const [CONCENTRATED, HORIZON, SECTOR, MONITORING, REBALANCING] = PORTFOLIO_APPROACH;

export const PMS_PORTFOLIO: PortfolioContent = {
  heading: "Portfolio Approach",
  sectorCap: 30,
  sectorLine: SECTOR,
  holdingsFrom: 15,
  holdingsTo: 20,
  holdingsLine: CONCENTRATED,
  rules: [HORIZON, MONITORING, REBALANCING].map((rule) => ({ rule })),
};

// LOREM lines until the client supplies them.
export const PMS_RISKS_CONTENT: RisksContent = { label: "Risk management", heading: "Risk Management", risks: PMS_RISKS.map(({ name, text }) => ({ name, text })) };

/** /pms as it stood before it was editable, top to bottom. */
export const PMS_SECTIONS = [
  { blockType: "productHero", hidden: false, ...PMS_HERO_CONTENT },
  { blockType: "pmsPerformance", hidden: false, ...PMS_PERFORMANCE },
  { blockType: "wealthGrowth", hidden: false, ...PMS_WEALTH },
  { blockType: "whyPms", hidden: false, ...PMS_WHY },
  { blockType: "philosophy", hidden: false, ...PMS_PHILOSOPHY },
  { blockType: "selection", hidden: false, ...PMS_SELECTION },
  { blockType: "portfolioApproach", hidden: false, ...PMS_PORTFOLIO },
  { blockType: "risks", hidden: false, ...PMS_RISKS_CONTENT },
  { blockType: "closingDoors", hidden: false },
] as const;
