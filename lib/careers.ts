/**
 * Copy for /careers, from the Content & Visual Plan §10 "Careers". The
 * heading, the lead, the four section names and both CTAs are the plan's
 * wording. The plan notes the decks carry no careers content, so the openings,
 * culture points and application steps are PLACEHOLDER until HR or management
 * supplies or approves them. Body copy marked LOREM is placeholder too.
 */

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const RESUME_EMAIL = "info@moneybee.in";
export const RESUME_HREF = `mailto:${RESUME_EMAIL}?subject=${encodeURIComponent("Resume")}`;

export const CAREERS = {
  heading: "Build Your Career with Moneybee",
  lead: "Moneybee brings together professionals working across investment research, portfolio management, advisory, compliance and financial services.",
} as const;

/** The five disciplines the plan's lead names, for the hero's drawing. */
export const DISCIPLINES = ["Investment research", "Portfolio management", "Advisory", "Compliance", "Financial services"] as const;

export type Team = "research" | "portfolio" | "advisory" | "compliance" | "services";

export const TEAM_NAMES: Record<Team, string> = {
  research: "Investment research",
  portfolio: "Portfolio management",
  advisory: "Advisory",
  compliance: "Compliance",
  services: "Financial services",
};

/** PLACEHOLDER openings, one per discipline, until HR supplies the real roles. */
export const OPENINGS = [
  { role: "Equity Research Analyst", team: "research", experience: "2 to 5 years", text: LOREM_SHORT },
  { role: "Portfolio Management Associate", team: "portfolio", experience: "3 to 6 years", text: LOREM_SHORT },
  { role: "Relationship Manager", team: "advisory", experience: "4 to 8 years", text: LOREM_SHORT },
  { role: "Compliance Executive", team: "compliance", experience: "1 to 3 years", text: LOREM_SHORT },
  { role: "Operations Associate", team: "services", experience: "1 to 3 years", text: LOREM_SHORT },
] as const satisfies readonly { role: string; team: Team; experience: string; text: string }[];

export const OPENING_PLACE = "Lower Parel, Mumbai";
export const OPENING_TYPE = "Full time";

/** The mailto an opening's Apply link opens. */
export const applyHref = (role: string) => `mailto:${RESUME_EMAIL}?subject=${encodeURIComponent(`Application: ${role}`)}`;

export const LIFE = {
  /** LOREM */
  text: LOREM,
  /** LOREM, three short notes set beside the photograph. */
  notes: [LOREM_SHORT, LOREM_SHORT, LOREM_SHORT],
} as const;

/** PLACEHOLDER culture points. `glyph` picks each point's drawing. */
export const CULTURE = [
  { name: "Research first", glyph: "research", text: LOREM_SHORT },
  { name: "Long-term thinking", glyph: "long", text: LOREM_SHORT },
  { name: "Ownership", glyph: "owner", text: LOREM_SHORT },
  { name: "Learning together", glyph: "learn", text: LOREM_SHORT },
] as const;

/** PLACEHOLDER application steps. */
export const APPLY_STEPS = [
  { name: "Find a role", text: LOREM_SHORT },
  { name: "Send your resume", text: LOREM_SHORT },
  { name: "Meet the team", text: LOREM_SHORT },
  { name: "Hear back", text: LOREM_SHORT },
] as const;

export const CAREERS_LOREM = { long: LOREM, short: LOREM_SHORT } as const;
