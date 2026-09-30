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

/**
 * PLACEHOLDER openings, one per discipline the plan names. The role, its
 * details and its text are lorem until HR supplies real roles; only the team
 * names come from the plan.
 */
export const OPENINGS = (Object.keys(TEAM_NAMES) as Team[]).map((team) => ({
  role: "Role title",
  team,
  text: LOREM_SHORT,
  details: [
    ["Location", "Lorem ipsum"],
    ["Type", "Lorem ipsum"],
    ["Experience", "Lorem ipsum"],
  ] as const,
}));

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
  { name: "Lorem ipsum", glyph: "research", text: LOREM_SHORT },
  { name: "Dolor sit amet", glyph: "long", text: LOREM_SHORT },
  { name: "Consectetur", glyph: "owner", text: LOREM_SHORT },
  { name: "Adipiscing elit", glyph: "learn", text: LOREM_SHORT },
] as const;

/** The application steps: practical site copy, the 10 to 20% the plan allows beyond the decks. */
export const APPLY_STEPS = [
  { name: "Find a role", text: LOREM_SHORT },
  { name: "Send your resume", text: LOREM_SHORT },
  { name: "Meet the team", text: LOREM_SHORT },
  { name: "Hear back", text: LOREM_SHORT },
] as const;

export const CAREERS_LOREM = { long: LOREM, short: LOREM_SHORT } as const;
