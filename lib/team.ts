/**
 * The key team members on /about and the homepage carousel's links to them,
 * from the Content & Visual Plan §9 "Our Team". Names, designations and
 * biographies are the plan's wording; each key member's line is split at the
 * plan's semicolon into qualification and biography.
 */

export type Person = {
  id: string;
  name: string;
  designation: string;
  qualifications: string;
  bio: string;
  photo: string;
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
  // The plan names only the two above; these four are the group profile's team slides (April 2026, 25 and 26).
  {
    id: "ritesh-mistry",
    name: "Ritesh Mistry",
    designation: "Asst. Vice President, Advisory",
    qualifications: "MBA",
    bio: "15+ years in corporate research, business modelling, valuation and investment advisory, covering chemicals, automobiles and capital goods.",
    photo: "/people/ritesh-mistry.jpg",
    glyph: "valuation",
  },
  {
    id: "anurag-roonwal",
    name: "Anurag Roonwal",
    designation: "Asst. Vice President, PMS",
    qualifications: "CA, FRM, CFA Level 2",
    bio: "6+ years at Moneybee finding undervalued small and mid-sized companies with strong growth. Earlier in due diligence at EY and statutory audit at PwC.",
    photo: "/people/anurag-roonwal.jpg",
    glyph: "undervalued",
  },
  {
    id: "manan-shah",
    name: "Manan Shah",
    designation: "Asst. Portfolio Manager, PMS",
    qualifications: "CA",
    bio: "5+ years at Moneybee on investment banking and research projects for listed and private companies. Earlier ran his own diamond trading business in Dubai.",
    photo: "/people/manan-shah.jpg",
    glyph: "projects",
  },
  {
    id: "chinmayi-upadhyay",
    name: "Chinmayi Upadhyay",
    designation: "Senior Associate, PMS",
    qualifications: "CA",
    bio: "3+ years at Moneybee on in-depth sector and company research, listed and private. Earlier in the GST practice at Suresh Surana & Associates (RSM India).",
    photo: "/people/chinmayi-upadhyay.jpg",
    glyph: "sector",
  },
] as const satisfies readonly (Person & { glyph: string })[];
