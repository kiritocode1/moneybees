import { COMPARE_LINKS, COMPARISON, type ComparisonGlyph, EXPLANATION } from "@/lib/compare";
import { COMPARE_HERO } from "@/lib/page-heroes";
import { heroContent } from "@/lib/pages/pms-content";

/*
 * What each /pms-vs-aif section says, in the shape the PMS vs AIF page record
 * in /admin stores it: today's words, written by the first migration so the
 * page reads the same. PMS and AIF always sit side by side on equal footing.
 */

export type ComparisonContent = {
  label?: string | null;
  heading: string;
  rows?: { pms: string; aif: string; drawing: ComparisonGlyph }[] | null;
  links?: { label: string; link: string }[] | null;
};
export type ExplanationContent = { label?: string | null; heading: string; pms: string; aif: string };

export const COMPARISON_SECTION: ComparisonContent = {
  label: "Comparison",
  heading: "Simple Comparison",
  rows: COMPARISON.map(({ pms, aif, glyph }) => ({ pms, aif, drawing: glyph })),
  links: COMPARE_LINKS.map(([label, link]) => ({ label, link })),
};

export const EXPLANATION_SECTION: ExplanationContent = { label: "Explanation", heading: "Simple Explanation", pms: EXPLANATION.pms, aif: EXPLANATION.aif };

/** /pms-vs-aif as it stood before it was editable, top to bottom. */
export const COMPARE_SECTIONS = [
  { blockType: "productHero", hidden: false, ...heroContent(COMPARE_HERO) },
  { blockType: "comparison", hidden: false, ...COMPARISON_SECTION },
  { blockType: "explanation", hidden: false, ...EXPLANATION_SECTION },
  { blockType: "closingDoors", hidden: false },
] as const;
