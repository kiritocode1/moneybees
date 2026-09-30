/**
 * Copy for /investor-centre, from the Content & Visual Plan §12. The section
 * names are the plan's, in its order. Documents carry no link or date
 * until the client supplies the approved files.
 */

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const INVESTOR_CENTRE = {
  heading: "Investor Centre",
  /** LOREM */
  lead: LOREM,
} as const;

/**
 * The two logins, kept apart: the client one leads, the distributor one sits
 * beside it. The client link is the investor login the site nav already uses;
 * the distributor portal has no address yet, so it renders without a link.
 */
export const LOGINS: Record<"client" | "distributor", { name: string; text: string; href?: string }> = {
  client: { name: "Client Login", text: LOREM_SHORT, href: "https://www.moneybee.in/register.php" },
  distributor: { name: "Distributor Login", text: LOREM_SHORT },
};

/**
 * One document. `href` and `date` stay empty until the client supplies the
 * approved file; the page then shows "Available on request" instead of a dead
 * link or an invented date.
 */
export type InvestorDocument = {
  title: string;
  id: string;
  glyph: DocumentGlyph;
  href?: string;
  date?: string;
};

export type DocumentGlyph = "charter" | "disclosures" | "risk" | "policies" | "complaints" | "grievance" | "scores" | "odr" | "forms" | "pms" | "aif";

/**
 * The plan's eleven sections, in its order, grouped into four ruled lists.
 * Group headings are the plan's own section names. The group ids are stable:
 * the site footer links to them.
 */
export const DOCUMENT_GROUPS: readonly { id: string; heading: string; glyph: DocumentGlyph; documents: readonly InvestorDocument[] }[] = [
  {
    id: "investor-charter",
    heading: "Investor Charter",
    glyph: "charter",
    documents: [{ title: "Investor Charter", id: "investor-charter-document", glyph: "charter" }],
  },
  {
    id: "disclosures",
    heading: "Disclosures",
    glyph: "risk",
    documents: [
      { title: "Disclosures", id: "disclosures-document", glyph: "disclosures" },
      { title: "Risk Disclosures", id: "risk-disclosures", glyph: "risk" },
      { title: "Policies", id: "policies", glyph: "policies" },
    ],
  },
  {
    id: "grievance",
    heading: "Grievance Redressal",
    glyph: "grievance",
    documents: [
      { title: "Investor Complaints", id: "investor-complaints", glyph: "complaints" },
      { title: "Grievance Redressal", id: "grievance-redressal", glyph: "grievance" },
      { title: "SCORES", id: "scores", glyph: "scores" },
      { title: "ODR", id: "odr", glyph: "odr" },
    ],
  },
  {
    id: "disclosure-document",
    heading: "Forms & Documents",
    glyph: "pms",
    documents: [
      { title: "Forms & Documents", id: "forms-documents", glyph: "forms" },
      { title: "PMS Disclosure Document", id: "pms-disclosure-document", glyph: "pms" },
      { title: "AIF Documents", id: "aif-documents", glyph: "aif" },
    ],
  },
];

/** Shown in place of a link and a date until the approved document exists. */
export const NOT_YET_PUBLISHED = "Available on request";

export const INVESTOR_LOREM = { long: LOREM, short: LOREM_SHORT } as const;
