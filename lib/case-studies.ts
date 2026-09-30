/**
 * Copy for /case-studies, Content & Visual Plan §8 "Case Studies / Multibagger
 * Picks". The heading, the three companies' Business Model, Competitive Edge
 * and Growth Prospect lines and the disclaimer are the plan's wording. The
 * Revenue, EBITDA and PAT figures are CASE_FINANCIALS in lib/pms.ts (group
 * profile p21 to p23, FY20 to FY24, Rs. crore). The multibagger multiples are
 * left off: they read as recommendations.
 */

import { CASE_FINANCIALS, type CaseFinancials, type CaseName } from "@/lib/pms";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const CASE_STUDIES_PAGE = {
  heading: "Our Investment Journey",
  /** LOREM */
  lead: LOREM,
} as const;

/** The plan's disclaimer, with its "The presentation states that" dropped. */
export const CASE_DISCLAIMER =
  "The stocks and sectors shown are for illustration only and are not recommendations. Moneybee may or may not hold them in the future. Past performance may or may not be sustained.";

export type CaseStudyEntry = {
  id: string;
  name: string;
  /** Initials for the placeholder mark until an approved logo is supplied. */
  mark: string;
  drawing: "power" | "casting" | "laminations";
  business: string;
  edge: string;
  growth: string;
  financials: CaseFinancials;
};

const entry = (key: CaseName, study: Omit<CaseStudyEntry, "financials">): CaseStudyEntry => ({
  ...study,
  financials: CASE_FINANCIALS[key],
});

/** The plan's three case studies, in its order, with its text (the plan's "presented in the PMS deck" source notes dropped). */
export const CASE_STUDIES: readonly CaseStudyEntry[] = [
  entry("KPI Green Energy", {
    id: "kpi-green-energy",
    name: "KPI Green Energy",
    mark: "KPI",
    drawing: "power",
    business: "Renewable power generation through IPP and CPP operations.",
    edge: "Established power evacuation infrastructure, revenue realisation and promoter execution experience.",
    growth: "Order book and development pipeline.",
  }),
  entry("Uni Abex Alloy", {
    id: "uni-abex",
    name: "Uni Abex Alloy Products",
    mark: "UA",
    drawing: "casting",
    business: "Manufacturer/exporter of centrifugal and static castings in specialised stainless-steel alloys.",
    edge: "Engineering complexity and high entry barriers.",
    growth: "Partnership with the TATA Group and opportunities linked to sponge iron technology.",
  }),
  entry("Pitti Engineering", {
    id: "pitti-engineering",
    name: "Pitti Engineering",
    mark: "PE",
    drawing: "laminations",
    business: "Manufacturer of electrical steel laminations, motor cores, sub-assemblies, die-cast rotors and machined components.",
    edge: "Exposure to railway, renewable energy and power-related applications.",
    growth: "Capacity expansion, order book and long-term growth visibility.",
  }),
];

/** The page's parts, for the hero's index. */
export const CASE_PARTS = [...CASE_STUDIES.map((study) => [study.name, `#${study.id}`] as const), ["Investment timeline", "#timeline"] as const];

export const CASE_LOREM = { long: LOREM, short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." } as const;
