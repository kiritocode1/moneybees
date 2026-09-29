/**
 * Copy for /investor-centre, from the Content & Visual Plan §12. The section
 * names are the plan's, in its order. Links are "#" and dates are placeholders
 * until the client supplies the approved documents.
 */

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const INVESTOR_CENTRE = {
  heading: "Investor Centre",
  /** LOREM */
  lead: LOREM,
} as const;

/** The two logins, kept apart: the client one leads, the distributor one sits beside it. */
export const LOGINS = {
  client: { name: "Client Login", href: "#", text: LOREM_SHORT },
  distributor: { name: "Distributor Login", href: "#", text: LOREM_SHORT },
} as const;

/** The plan's document sections, in order. `glyph` picks each card's drawing. */
export const DOCUMENTS = [
  { title: "Investor Charter", id: "investor-charter", glyph: "charter" },
  { title: "Disclosures", id: "disclosures", glyph: "disclosures" },
  { title: "Risk Disclosures", id: "risk-disclosures", glyph: "risk" },
  { title: "Policies", id: "policies", glyph: "policies" },
  { title: "Investor Complaints", id: "investor-complaints", glyph: "complaints" },
  { title: "Grievance Redressal", id: "grievance-redressal", glyph: "grievance" },
  { title: "SCORES", id: "scores", glyph: "scores" },
  { title: "ODR", id: "odr", glyph: "odr" },
  { title: "Forms & Documents", id: "forms-documents", glyph: "forms" },
  { title: "PMS Disclosure Document", id: "pms-disclosure-document", glyph: "pms" },
  { title: "AIF Documents", id: "aif-documents", glyph: "aif" },
] as const;

export type DocumentGlyph = (typeof DOCUMENTS)[number]["glyph"];

/** Placeholder until each document carries its real date. */
export const DATE_PLACEHOLDER = "DD/MM/YYYY";

export const INVESTOR_LOREM = { long: LOREM, short: LOREM_SHORT } as const;
