/**
 * Copy for /team, from the Content & Visual Plan §9 "Our Team". Names,
 * designations and biographies are the plan's wording; each key member's line
 * is split at the plan's semicolon into qualification and biography. The
 * founder's qualifications come from §2.
 */

export type Person = {
  id: string;
  name: string;
  designation: string;
  qualifications: string;
  bio: string;
  photo: string;
};

export const TEAM = {
  heading: "People Behind Moneybee",
} as const;

export const FOUNDER_PERSON: Person = {
  id: "dhiren-shah",
  name: "Dhiren Shah",
  designation: "Managing Director",
  qualifications: "FCA, Grad CWA, LLB, M.Com.",
  bio: "45+ years of experience in corporate advisory and wealth management, with experience across small and medium-sized businesses and multiple market cycles.",
  photo: "/people/dhiren-shah.jpg",
};

/** `glyph` picks each member's explainer drawing. */
export const KEY_MEMBERS = [
  {
    id: "shreyam-shah",
    name: "Shreyam Shah",
    designation: "AIF / Investment Team",
    qualifications: "CA",
    bio: "Research across listed and unlisted companies and entrepreneurial experience.",
    photo: "/people/shreyam-shah.jpg",
    glyph: "research",
  },
  {
    id: "suprit-shah",
    name: "Suprit Shah",
    designation: "Compliance Officer, PMS",
    qualifications: "LL.B.",
    bio: "Compliance, risk management and fraud prevention experience.",
    photo: "/people/suprit-shah.jpg",
    glyph: "compliance",
  },
] as const satisfies readonly (Person & { glyph: string })[];
