import { APPROACH_LOREM, DONT_DO, LOOK_FOR, PHILOSOPHY_STAGES, RISKS } from "@/lib/approach";
import { HEADINGS, PILLARS } from "@/lib/insights";
import { APPROACH_HERO } from "@/lib/page-heroes";
import { heroContent } from "@/lib/pages/pms-content";

/*
 * What each /our-philosophy section says, in the shape the Our Philosophy
 * page record in /admin stores it: today's words, written by the first
 * migration so the page reads the same. Lorem lines move over as they are,
 * marked LOREM, until the client supplies the copy.
 */

export type CoreDiscsContent = { heading: string; lead?: string | null; stages?: { word: string; text?: string | null }[] | null };
export type PrinciplesContent = { label?: string | null; heading: string; principles?: { name: string; text: string }[] | null };
export type CriteriaContent = { lookForHeading: string; lookFor?: { item: string }[] | null; dontDoHeading: string; dontDo?: { item: string }[] | null };
export type RiskRingsContent = { heading: string; risks?: { name: string; text?: string | null }[] | null };

// LOREM lead and stage lines.
export const CORE_DISCS: CoreDiscsContent = {
  heading: "Core Philosophy",
  lead: APPROACH_LOREM.long,
  stages: PHILOSOPHY_STAGES.map(({ word, text }) => ({ word, text })),
};

/** One sentence a line in the heading; each sentence ends in a full stop. */
export const PRINCIPLES: PrinciplesContent = {
  label: "Our philosophy",
  heading: HEADINGS.philosophy,
  principles: PILLARS.map(({ name, text }) => ({ name, text })),
};

export const CRITERIA: CriteriaContent = {
  lookForHeading: "What We Look For",
  lookFor: LOOK_FOR.map((item) => ({ item })),
  dontDoHeading: "What We Don't Do",
  dontDo: DONT_DO.map((item) => ({ item })),
};

// LOREM lines under each risk.
export const RISK_RINGS: RiskRingsContent = { heading: "Risk Management", risks: RISKS.map(({ name }) => ({ name, text: APPROACH_LOREM.short })) };

/** /our-philosophy as it stood before it was editable, top to bottom. */
export const PHILOSOPHY_SECTIONS = [
  { blockType: "productHero", hidden: false, ...heroContent(APPROACH_HERO) },
  { blockType: "coreDiscs", hidden: false, ...CORE_DISCS },
  { blockType: "principles", hidden: false, ...PRINCIPLES },
  { blockType: "criteria", hidden: false, ...CRITERIA },
  { blockType: "riskRings", hidden: false, ...RISK_RINGS },
  { blockType: "closingDoors", hidden: false },
] as const;
