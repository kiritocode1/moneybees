import { CONTACT } from "@/lib/insights";

/*
 * The contact page's facts, transcribed from the two decks. Labels are the
 * decks' own, cased for the page. Citations stay here as comments.
 *
 * The AIF desks use the site's CONTACT addresses ("aif"). The Flyingbee deck
 * spells every one "aiff" (p17); that stays out until the client confirms it.
 */

/** One way to reach a desk: a printed label and an email or phone. */
export type Line = {
  readonly label: string;
  readonly kind: "email" | "phone";
  readonly value: string;
};

/** A business and the addresses that serve it. */
export type Desk = {
  readonly id: "pms" | "aif";
  readonly business: string;
  readonly name: string;
  readonly lines: readonly Line[];
};

/** Turns a printed Indian number into a dialable one: "022 4030 2080" becomes "+912240302080". */
export function telHref(printed: string): string {
  const digits = printed.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("0")) return `tel:+91${digits.slice(1)}`;
  return `tel:+91${digits}`;
}

/** The mailto or tel link for a line. */
export const lineHref = (line: Line) => (line.kind === "email" ? `mailto:${line.value}` : telHref(line.value));

/** The two companies printed above the office address, group profile p32. */
export const ENTITIES = ["Moneybee Securities Pvt Ltd", "Moneybee Investment Advisors Pvt Ltd"] as const;

/** Office telephones: main line (p32, p17), the AIF line (p17), the mobile on the p32 card. */
export const PHONES = [CONTACT.phones[0], "98337 70403", CONTACT.phones[1]] as const;

/** The general address on the p32 card, "Call or write to us at". */
export const GENERAL_EMAIL = "info@moneybee.in";

/** The email on the p32 contact card. */
export const CARD_EMAIL = "shreyams@moneybee.in";

/** Who to write to, by business. PMS from group profile p32; AIF from Flyingbee p17 via CONTACT. */
export const DESKS: readonly Desk[] = [
  {
    id: "pms",
    business: "Portfolio Management Services",
    name: "Moneybee PMS",
    lines: [
      { label: "Product related queries", kind: "email", value: "product@moneybee.in" },
      { label: "Investor servicing queries", kind: "email", value: "service@moneybee.in" },
      { label: "Onboarding queries", kind: "email", value: "onboarding@moneybee.in" },
      { label: "Call or write to us at", kind: "email", value: GENERAL_EMAIL },
      { label: "Telephone", kind: "phone", value: CONTACT.phones[0] },
    ],
  },
  {
    id: "aif",
    business: "Category III AIF",
    name: "Flyingbee Investment Fund",
    lines: [
      ...CONTACT.emails.map(([label, value]): Line => ({ label, kind: "email", value })),
      { label: "Telephone", kind: "phone", value: CONTACT.phones[1] },
    ],
  },
];

/** The PMS officers SEBI expects on the site, group profile p31. */
export const OFFICERS = [
  { role: "Principal Officer", name: "Mr. Dhiren Shah", phone: "022 4030 2080" },
  { role: "Compliance Officer", name: "Mr. Suprit Shah", phone: "022 4030 2039" },
] as const;

/** A step in the grievance path. */
export type GrievanceStep = {
  readonly title: string;
  readonly text: string;
  readonly links: readonly { readonly tag?: string; readonly text: string; readonly href: string }[];
};

/**
 * Where a complaint goes, in order. Step one uses the decks' servicing and
 * grievance addresses (p32, p17). The decks print no wording for SCORES or
 * Smart ODR, so those two steps carry only the plain instruction.
 */
export const GRIEVANCE_STEPS: readonly GrievanceStep[] = [
  {
    title: "Write to us",
    text: "Start with the desk that looks after your investment.",
    links: [
      { tag: "PMS", text: "service@moneybee.in", href: "mailto:service@moneybee.in" },
      { tag: "AIF", text: CONTACT.emails[2][1], href: `mailto:${CONTACT.emails[2][1]}` },
    ],
  },
  {
    title: "SEBI SCORES",
    text: "If the reply does not settle it, lodge the complaint with SEBI.",
    links: [{ text: "scores.sebi.gov.in", href: "https://scores.sebi.gov.in" }],
  },
  {
    title: "Smart ODR",
    text: "If it is still open, take it to online dispute resolution.",
    links: [{ text: "smartodr.in", href: "https://smartodr.in" }],
  },
];

/** The group's other businesses, as the site navigation names them. */
export const GROUP = [
  ["Investment Banking", "moneybeeadvisors.com", "https://moneybeeadvisors.com/"],
  ["Stock Broking", "moneybeesecurities.in", "https://moneybeesecurities.in/"],
] as const;
