/**
 * Photographs, people and dates for /about. The heading, company text,
 * founder and story stay in lib/about-v2.ts in the content plan's §2 wording.
 * Names, roles and photos come from the decks' team profile (TEAM in
 * lib/insights.ts); each `does` line is one deck fact said plainly. Photo
 * sources: public/about/photos/SOURCES.md.
 */

import { TEAM, type TeamMember } from "@/lib/insights";

export type Photo = { src: string; alt: string; position?: string };

/** The team at the Lower Parel office: the current moneybee.in hero slide. */
export const HERO_PHOTO: Photo = {
  src: "/people/moneybee-team.jpg",
  alt: "The Moneybee team at the Lower Parel office",
  position: "50% 42%",
};

/** The group's four areas (content plan §2, in its order), each with the photograph that shows it. */
export const AREAS: readonly (Photo & { name: string })[] = [
  { name: "Portfolio management", src: "/about/photos/research-desk.jpg", alt: "Financial statements and charts on a desk", position: "50% 50%" },
  { name: "Equity broking", src: "/about/photos/dealing-desk.jpg", alt: "Two people working over a laptop and a tablet", position: "15% 50%" },
  { name: "Investment advisory", src: "/people/moneybee-boardroom.jpg", alt: "The Moneybee team in a meeting in the boardroom", position: "62% 50%" },
  { name: "Related financial services", src: "/about/photos/handshake.jpg", alt: "A handshake over a signed contract", position: "35% 50%" },
];

/** The kinds of work the team does, as the people section's filters. */
export const WORK = {
  research: "Research",
  pms: "Moneybee PMS",
  aif: "Flyingbee AIF",
  advisory: "Advisory",
  compliance: "Compliance",
} as const;

export type Work = keyof typeof WORK;

type Details = { qualification: string; does: string; work: readonly Work[] };

/**
 * What each person does, from their deck profile. The key order is the page
 * order: investment and research first, compliance last.
 */
const DETAILS: Record<string, Details> = {
  "Shreyam Shah": { qualification: "CA", does: "Leads research on listed and unlisted companies.", work: ["research", "aif"] },
  "Anurag Roonwal": { qualification: "CA, FRM", does: "Finds undervalued small and mid-sized companies.", work: ["research", "pms"] },
  "Manan Shah": { qualification: "CA", does: "Researches listed and private companies, and works on investment banking.", work: ["research", "pms"] },
  "Chinmayi Upadhyay": { qualification: "CA", does: "Researches sectors and companies, listed and private.", work: ["research", "pms"] },
  "Ritesh Mistry": { qualification: "MBA", does: "Builds business models and valuations for chemical, automobile and capital goods companies.", work: ["research", "advisory"] },
  "Suprit Shah": { qualification: "LL.B.", does: "Heads compliance, risk management and fraud prevention.", work: ["compliance", "pms"] },
};

export type Person = TeamMember & Details;

/** The team in DETAILS order, each joined to its deck profile. A name missing from TEAM fails loudly. */
export const PEOPLE: readonly Person[] = Object.entries(DETAILS).map(([name, details]) => {
  const member = TEAM.find((entry) => entry.name === name);
  if (!member) throw new Error(`lib/about-v3.ts: ${name} is not in TEAM`);
  return { ...member, ...details };
});

/**
 * The plan's company timeline: its two dates (§2: 2004; §1: PMS since August
 * 2007) and the AIF deck's first close ("First Close declared on October 30,
 * 2025"). The plan asks for dates to be approved before publication.
 */
export const TIMELINE_STOPS = [
  { label: "2004", text: "Dhiren Shah starts Moneybee Group." },
  { label: "Aug 2007", text: "Moneybee PMS starts managing portfolios." },
  { label: "Oct 2025", text: "Flyingbee Investment Fund declares its first close." },
] as const;
