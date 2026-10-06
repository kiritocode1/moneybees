/**
 * Photographs and dates for /about. The heading, company text, founder and
 * story stay in lib/about-v2.ts in the content plan's §2 wording; the key team
 * members are in lib/team.ts. Photo sources: public/about/photos/SOURCES.md.
 */

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
