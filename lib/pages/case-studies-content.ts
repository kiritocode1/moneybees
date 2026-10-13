import { CASE_DISCLAIMER, CASE_LOREM } from "@/lib/case-studies";
import { CASES_HERO } from "@/lib/page-heroes";
import { heroContent } from "@/lib/pages/pms-content";

/*
 * What each /case-studies section says, in the shape the Case Studies page
 * record in /admin stores it: today's words, written by the first migration
 * so the page reads the same. The companies are a list of their own
 * (collections/CaseStudies.ts).
 */

export type CaseTimelineContent = { label?: string | null; heading: string; lead?: string | null; disclaimer?: string | null };

// LOREM lead.
export const CASE_TIMELINE: CaseTimelineContent = { label: "Timeline", heading: "Historical Investment Timeline", lead: CASE_LOREM.long, disclaimer: CASE_DISCLAIMER };

/** /case-studies as it stood before it was editable, top to bottom. */
export const CASE_STUDIES_SECTIONS = [
  { blockType: "productHero", hidden: false, ...heroContent(CASES_HERO) },
  { blockType: "caseStudies", hidden: false },
  { blockType: "caseTimeline", hidden: false, ...CASE_TIMELINE },
  { blockType: "closingDoors", hidden: false },
] as const;
