import { AIF_DATES } from "@/lib/aif";
import { AIF_LOREM, APPROACH_STEPS, CATEGORY_III, FLYINGBEE, KEY_TERMS, OPPORTUNITY, STRUCTURE } from "@/lib/aif-v2";
import { METHOD, PERFORMANCE_LOREM } from "@/lib/performance";
import { heroContent } from "@/lib/pages/pms-content";
import { AIF_HERO } from "@/lib/pms-v3-hero";

/*
 * What each /aif section says, in the shape the AIF page record in /admin
 * stores it: today's words, written by the first migration so the page reads
 * the same. Lorem lines move over as they are, marked LOREM. The returns are
 * not here: they come from Flyingbee's fact sheets (lib/site/figures.ts).
 * The plan asks that terms, tax treatment, eligibility, fees and regulatory
 * statements be checked against the approved fund documents.
 */

export type TermGlyph = (typeof KEY_TERMS)[number]["glyph"];

export type AifPerformanceContent = { label?: string | null; heading: string; lead?: string | null; method?: string | null };
export type OpportunityContent = { label?: string | null; heading: string; lead?: string | null; steps?: { title: string; text: string }[] | null };
export type PoolingContent = { label?: string | null; heading: string; text: string };
export type StructureContent = { label?: string | null; heading: string; investors: string; fund: string; manager: string; parties?: { name: string }[] | null };
export type ApproachWheelContent = { label?: string | null; heading: string; steps?: { step: string }[] | null; line?: string | null };
export type KeyTermsContent = { label?: string | null; heading: string; button?: { label?: string | null; link?: string | null }; terms?: { label: string; value: string; drawing: TermGlyph }[] | null };

export const AIF_PERFORMANCE: AifPerformanceContent = {
  label: "Performance",
  heading: "AIF Performance",
  // LOREM
  lead: PERFORMANCE_LOREM.long,
  // The content plan (§7) requires a method and disclaimer beside any performance figures; the fund's own facts (deck p10).
  method: `Returns in %, time-weighted (TWRR). N/A marks a period that has not run since the fund's first close on ${AIF_DATES.firstClose}. ${METHOD.caveat} ${METHOD.guarantee}`,
};

export const AIF_OPPORTUNITY: OpportunityContent = {
  label: "Flyingbee",
  heading: OPPORTUNITY.heading,
  lead: FLYINGBEE.focus,
  steps: OPPORTUNITY.steps.map(({ title, text }) => ({ title, text })),
};

export const AIF_POOLING: PoolingContent = { label: "Category III AIF", heading: CATEGORY_III.heading, text: CATEGORY_III.text };

export const AIF_STRUCTURE: StructureContent = {
  label: "Flyingbee",
  heading: STRUCTURE.heading,
  investors: STRUCTURE.chain[0],
  fund: STRUCTURE.chain[1],
  manager: STRUCTURE.chain[2],
  parties: STRUCTURE.parties.map((name) => ({ name })),
};

// LOREM line under the lit point.
export const AIF_APPROACH: ApproachWheelContent = { label: "Flyingbee", heading: "Investment Approach", steps: APPROACH_STEPS.map((step) => ({ step })), line: AIF_LOREM.short };

export const AIF_KEY_TERMS: KeyTermsContent = {
  label: "Flyingbee",
  heading: "Key Terms",
  button: { label: FLYINGBEE.start.label, link: FLYINGBEE.start.href },
  terms: KEY_TERMS.map(({ label, value, glyph }) => ({ label, value, drawing: glyph })),
};

/** /aif as it stood before it was editable, top to bottom. */
export const AIF_SECTIONS = [
  { blockType: "productHero", hidden: false, ...heroContent(AIF_HERO) },
  { blockType: "aifPerformance", hidden: false, ...AIF_PERFORMANCE },
  { blockType: "opportunity", hidden: false, ...AIF_OPPORTUNITY },
  { blockType: "pooling", hidden: false, ...AIF_POOLING },
  { blockType: "structure", hidden: false, ...AIF_STRUCTURE },
  { blockType: "approachWheel", hidden: false, ...AIF_APPROACH },
  { blockType: "keyTerms", hidden: false, ...AIF_KEY_TERMS },
  { blockType: "closingDoors", hidden: false },
] as const;
