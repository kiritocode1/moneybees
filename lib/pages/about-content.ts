import { ABOUT, FOUNDER, STORY } from "@/lib/about-v2";
import { HERO_PHOTO, TIMELINE_STOPS } from "@/lib/about-v3";
import { ENQUIRY_HREF } from "@/lib/contact-v2";
import { RANKING_TABLES, RANKINGS_AS_OF } from "@/lib/insights";

/*
 * What each /about section says, in the shape the About page record in
 * /admin stores it: today's words, written by the first migration so the page
 * reads the same. The team itself is a list of its own (collections/TeamMembers.ts).
 */

export type AboutHeroContent = { label?: string | null; heading: string; paragraphs?: { paragraph: string }[] | null };

export type FounderProfileContent = {
  label?: string | null;
  name: string;
  role?: string | null;
  qualifications?: { qualification: string }[] | null;
  years?: number | null;
  yearsLabel?: string | null;
  points?: { point: string }[] | null;
};

export type TeamContent = { heading: string; buttonLabel?: string | null; buttonLink?: string | null };

export type AreasContent = { label?: string | null; areas?: { name: string }[] | null };

export type RankingTable = { rank: string; period: string; ours: number; returns?: { value: number }[] | null };

export type RecognitionContent = { label?: string | null; heading: string; asOf?: string | null; note?: string | null; tables?: RankingTable[] | null };

export type TimelineContent = { label?: string | null; stops?: { label: string; text: string }[] | null };

export type StoryContent = { heading: string; line: string };

/** A picture on the page: an address, its description, and where it is cropped. */
export type PlacedPicture = { src: string; alt: string; position?: string };

export const ABOUT_HERO: AboutHeroContent = { label: "About us", heading: ABOUT.heading, paragraphs: ABOUT.company.map((paragraph) => ({ paragraph })) };

/** The team photograph until another is uploaded. */
export const ABOUT_PHOTO: PlacedPicture = HERO_PHOTO;

export const FOUNDER_PROFILE: FounderProfileContent = {
  label: "Founder",
  name: FOUNDER.name,
  role: FOUNDER.role,
  qualifications: FOUNDER.qualifications.map((qualification) => ({ qualification })),
  years: 45,
  yearsLabel: "Years of experience",
  points: FOUNDER.points.map((point) => ({ point })),
};

/** The founder's portrait until another is uploaded. */
export const FOUNDER_PORTRAIT: PlacedPicture = { src: FOUNDER.photo, alt: FOUNDER.name };

export const TEAM_SECTION: TeamContent = { heading: "Our Team", buttonLabel: "Get in touch", buttonLink: ENQUIRY_HREF };

export const GROUP_AREAS: AreasContent = {
  label: "What the group does",
  areas: ["Portfolio management", "Equity broking", "Investment advisory", "Related financial services"].map((name) => ({ name })),
};

export const RECOGNITION: RecognitionContent = {
  label: "Recognition",
  heading: "Ranked among India’s top-performing portfolio managers by PMS Bazaar",
  asOf: RANKINGS_AS_OF,
  note: "Returns in %. Past performance does not guarantee future performance.",
  tables: RANKING_TABLES.map(({ rank, period, ours, returns }) => ({ rank, period, ours, returns: returns.map((value) => ({ value })) })),
};

export const TIMELINE: TimelineContent = { label: "Timeline", stops: TIMELINE_STOPS.map(({ label, text }) => ({ label, text })) };

export const ABOUT_STORY: StoryContent = { heading: STORY.heading, line: STORY.line };

/** /about as it stood before it was editable, top to bottom. */
export const ABOUT_SECTIONS = [
  { blockType: "aboutHero", hidden: false, ...ABOUT_HERO },
  { blockType: "founderProfile", hidden: false, ...FOUNDER_PROFILE },
  { blockType: "teamCarousel", hidden: false, ...TEAM_SECTION },
  { blockType: "groupAreas", hidden: false, ...GROUP_AREAS },
  { blockType: "recognition", hidden: false, ...RECOGNITION },
  { blockType: "timeline", hidden: false, ...TIMELINE },
  { blockType: "story", hidden: false, ...ABOUT_STORY },
  { blockType: "closingDoors", hidden: false },
] as const;
