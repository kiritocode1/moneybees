import { HEADINGS, PICK_TIERS, type PickTier } from "@/lib/insights";
import { PICKS_HERO } from "@/lib/page-heroes";
import { heroContent } from "@/lib/pages/pms-content";

/*
 * What /multi-bagger-picks says, in the shape the Multibagger Picks page
 * record in /admin stores it: today's words, written by the first migration
 * so the page reads the same. The pyramid has five tiers, highest first; a
 * tier lists named stocks (a stock with a business line opens a case study)
 * or, when the deck gives only a count, one line such as "More than 10 stocks".
 */

export type PickEntry = {
  name: string;
  business?: string | null;
  edge?: string | null;
  growth?: string | null;
  financials?: { year: string; revenue: number; profit: number }[] | null;
};

export type PicksTierContent = { multiple: string; countLine?: string | null; picks?: PickEntry[] | null };

export type PicksContent = { label: string; heading?: string | null; tiers?: PicksTierContent[] | null };

export const PICKS: PicksContent = {
  label: "Our multibagger picks",
  heading: HEADINGS.picks,
  tiers: PICK_TIERS.map(({ multiple, picks }) =>
    typeof picks === "string"
      ? { multiple, countLine: picks, picks: [] }
      : {
          multiple,
          countLine: null,
          picks: picks.map(({ name, caseStudy }) => ({
            name,
            business: caseStudy?.business ?? null,
            edge: caseStudy?.edge ?? null,
            growth: caseStudy?.growth ?? null,
            financials: caseStudy ? caseStudy.financials.map(({ year, revenue, profit }) => ({ year, revenue, profit })) : [],
          })),
        },
  ),
};

/** The tiers as the pyramid draws them: named stocks, or the count line when none are named. */
export const pickTiers = (content: PicksContent): readonly PickTier[] =>
  (content.tiers ?? []).map(({ multiple, countLine, picks }) => ({
    multiple,
    picks: picks?.length
      ? picks.map(({ name, business, edge, growth, financials }) => ({
          name,
          caseStudy: business ? { business, edge: edge ?? "", growth: growth ?? "", financials: financials ?? [], source: "" } : undefined,
        }))
      : (countLine ?? ""),
  }));

/** /multi-bagger-picks as it stood before it was editable, top to bottom. */
export const PICKS_SECTIONS = [
  { blockType: "productHero", hidden: false, ...heroContent(PICKS_HERO) },
  { blockType: "picks", hidden: false, ...PICKS },
  { blockType: "closingDoors", hidden: false },
] as const;
