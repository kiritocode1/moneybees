import { CONTACT_PAGE } from "@/lib/contact-v2";

/*
 * What each /contact section says, in the shape the Contact page record in
 * /admin stores it: today's words, written by the first migration so the page
 * reads the same. Phone, email, the desks and the office are Office details
 * (globals/SiteDetails.ts); the four enquiry forms stay in code, because the
 * enquiry desk sorts by them.
 */

export type EnquiryContent = { label?: string | null; heading: string; desksLabel?: string | null };

export const ENQUIRY_SECTION: EnquiryContent = { label: "Get Started", heading: CONTACT_PAGE.heading, desksLabel: "Flyingbee AIF desks" };

/** /contact as it stood before it was editable, top to bottom. */
export const CONTACT_SECTIONS = [
  { blockType: "enquiry", hidden: false, ...ENQUIRY_SECTION },
  { blockType: "office", hidden: false },
] as const;
