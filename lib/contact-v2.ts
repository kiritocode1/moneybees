/**
 * Copy for /contact, from the Content & Visual Plan §11 "Contact Us". The
 * heading, office address, phone, email and the four enquiry options are the
 * plan's wording. Body copy marked LOREM is placeholder until the client
 * supplies it. The plan asks for the details to be checked against the latest
 * approved company information before launch.
 */

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const CONTACT_PAGE = {
  heading: "Let's Start a Conversation",
  /** LOREM */
  lead: LOREM,
} as const;

/** The plan's office address, split where it reads best on two lines; the dash before the PIN is dropped. */
export const OFFICE = {
  name: "Moneybee Group",
  lines: ["303, Tower A, Peninsula Business Park,", "G.K. Marg, Lower Parel, Mumbai 400013"],
  /** LOREM */
  text: LOREM,
  /** Peninsula Business Park, from OpenStreetMap (way 441268787). */
  lat: 18.9987,
  lon: 72.82925,
} as const;

/** The plan's contact details, verbatim. */
export const PHONE = "022-4030 2080";
export const EMAIL = "info@moneybee.in";
export const PHONE_HREF = "tel:+912240302080";

/** The OpenStreetMap embed around the office, with its marker. */
export const MAP_EMBED = (() => {
  const pad = 0.006;
  const bbox = [OFFICE.lon - pad * 1.6, OFFICE.lat - pad, OFFICE.lon + pad * 1.6, OFFICE.lat + pad].map((n) => n.toFixed(5)).join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${OFFICE.lat}%2C${OFFICE.lon}`;
})();
export const MAP_LINK = `https://www.openstreetmap.org/?mlat=${OFFICE.lat}&mlon=${OFFICE.lon}#map=17/${OFFICE.lat}/${OFFICE.lon}`;

/** One field of the enquiry form. `options` makes it a select. */
export type EnquiryField = {
  readonly name: string;
  readonly label: string;
  readonly type?: "text" | "email" | "tel" | "textarea";
  readonly options?: readonly string[];
  readonly required?: boolean;
  /** The browser autofill token, so saved details fill in. */
  readonly autoComplete?: string;
};

const NAME: EnquiryField = { name: "name", label: "Full name", required: true, autoComplete: "name" };
const MAIL: EnquiryField = { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" };
const TEL: EnquiryField = { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" };
const MESSAGE: EnquiryField = { name: "message", label: "Message", type: "textarea", required: true };

/**
 * The plan's four enquiry options, names verbatim. Each one shapes the form:
 * its own fields between the contact fields and the message. `glyph` picks
 * the option's drawing. The amount bands follow the regulatory minimums
 * (PMS 50 lakh, AIF 1 crore); the other choices are placeholders.
 */
export const ENQUIRIES = [
  {
    id: "pms",
    name: "PMS Enquiry",
    glyph: "pms",
    text: LOREM_SHORT,
    fields: [NAME, MAIL, TEL, { name: "amount", label: "Investment amount", options: ["50 lakh to 1 crore", "1 crore to 5 crore", "Above 5 crore"] }, { name: "city", label: "City", autoComplete: "address-level2" }, MESSAGE],
  },
  {
    id: "aif",
    name: "AIF Enquiry",
    glyph: "aif",
    text: LOREM_SHORT,
    fields: [
      NAME,
      MAIL,
      TEL,
      { name: "investor", label: "Investor type", options: ["Individual", "HUF", "Family office", "Company or trust"] },
      { name: "commitment", label: "Commitment", options: ["1 crore to 5 crore", "Above 5 crore"] },
      MESSAGE,
    ],
  },
  {
    id: "support",
    name: "Investor Support",
    glyph: "support",
    text: LOREM_SHORT,
    fields: [NAME, MAIL, TEL, { name: "client", label: "Client code", autoComplete: "off" }, { name: "topic", label: "Topic", options: ["Statements", "Onboarding", "Withdrawal", "Something else"] }, MESSAGE],
  },
  {
    id: "general",
    name: "General Enquiry",
    glyph: "general",
    text: LOREM_SHORT,
    fields: [NAME, MAIL, TEL, { name: "subject", label: "Subject" }, MESSAGE],
  },
] as const satisfies readonly {
  id: string;
  name: string;
  glyph: string;
  text: string;
  fields: readonly EnquiryField[];
}[];

export type Enquiry = (typeof ENQUIRIES)[number];

/** Reads an `?enquiry=` value (pms, aif, support, general) into an option id, or null. */
export function enquiryFromParam(value: string | null): Enquiry["id"] | null {
  return ENQUIRIES.find((enquiry) => enquiry.id === value)?.id ?? null;
}

/** The mailto an enquiry opens: the option as the subject line, every filled field in the body. */
export function enquiryMailto(enquiry: Enquiry, values: Readonly<Record<string, string>>): string {
  const who = values.name?.trim();
  const subject = who ? `${enquiry.name} from ${who}` : enquiry.name;
  const body = enquiry.fields
    .map((field) => [field.label, values[field.name]?.trim()] as const)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const CONTACT_LOREM = { long: LOREM, short: LOREM_SHORT } as const;
