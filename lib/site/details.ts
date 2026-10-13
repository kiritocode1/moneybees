import { EMAIL, OFFICE, PHONE } from "@/lib/contact-v2";
import { CONTACT, REGISTRATIONS } from "@/lib/insights";

/*
 * Moneybee's office and contact details, as every page prints them. Staff
 * edit them once in /admin (globals/SiteDetails.ts); the footer, /contact,
 * Get started and the search data all read the same record. Safe on the
 * client; lib/site/load-details.ts reads the record on the server.
 */

export type SiteDetails = {
  /** The legal name, in the footer and the search data. */
  company: string;
  /** The name on the /contact office card. */
  officeName: string;
  address: { line1: string; line2: string };
  /** Where the map and "Get directions" point. */
  pin: { lat: number; lon: number };
  /** The first is the main line, shown wherever one number fits. */
  phones: { label: string; number: string }[];
  email: string;
  desks: { label: string; email: string }[];
  registrations: { business: string; number: string }[];
  disclaimer: string;
};

/** Today's details, from the client's content plan (lib/contact-v2.ts) and the AIF deck's contact slide (lib/insights.ts). */
export const DEFAULT_DETAILS: SiteDetails = {
  company: CONTACT.company,
  officeName: OFFICE.name,
  address: { line1: OFFICE.lines[0], line2: OFFICE.lines[1] },
  pin: { lat: OFFICE.lat, lon: OFFICE.lon },
  phones: [
    { label: "Office", number: PHONE },
    { label: "Mobile", number: CONTACT.phones[1] },
  ],
  email: EMAIL,
  desks: CONTACT.emails.map(([label, email]) => ({ label, email })),
  registrations: REGISTRATIONS.map(([business, number]) => ({ business, number })),
  disclaimer:
    "Investments in securities are subject to market risk, including the loss of principal. Read all related documents carefully before investing. Registration with SEBI does not imply approval or endorsement of the portfolio manager by the Board. Past performance is not indicative of future results.",
};

/** A dialable link for a number as staff write it: "022-4030 2080" becomes tel:+912240302080. */
export function telHref(number: string) {
  const digits = number.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("0") ? `+91${digits.slice(1)}` : digits}`;
}

/** Google Maps at street level around the pin; this form of embed needs no API key. */
export const mapEmbed = ({ pin }: Pick<SiteDetails, "pin">) => `https://www.google.com/maps?q=${pin.lat},${pin.lon}&z=16&output=embed`;

/** Directions to the pin, starting from wherever the visitor is. */
export const directionsHref = ({ pin }: Pick<SiteDetails, "pin">) => `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lon}`;
