import type { SectionKind } from "@/lib/pages/sections";

/*
 * The Guide's "what changes what" for the Home page (components/admin/guide).
 * Each section has a full-width picture (public/site-sections/guide/, taken
 * at 1440px wide on 2026-10-12) and its parts, numbered where they sit: x and
 * y are the part's top-left corner as a percentage of the picture, or its
 * top-right corner when the number goes on the `right`. Retake the pictures
 * and measurements when a section's layout changes.
 */

/** Who can change a part, when it is not every editor through the section's fields. */
export type Gate = "compliance" | "factSheet" | "fixed";

/** One part of a section. `x` and `y` place its number on the picture; without them the part is only listed. */
export type GuidePart = { label: string; where: string; gate?: Gate; x?: number; y?: number; right?: boolean };

export type GuideSection = { picture: string; note?: string; parts: GuidePart[] };

export const GATE_LABELS: Record<Gate, string> = {
  compliance: "Only compliance",
  factSheet: "From the fact sheet",
  fixed: "Not editable yet",
};

export const HOME_GUIDE: Partial<Record<SectionKind, GuideSection>> = {
  hero: {
    picture: "/site-sections/guide/hero.png",
    note: "The drawing on the right is part of the design.",
    parts: [
      { label: "Headline", where: "Top of the page › Headline", x: 8.3, y: 23.7 },
      { label: "Line under the headline", where: "Top of the page › Line under the headline", x: 8.3, y: 33.5 },
      { label: "Orange button", where: "Top of the page › Orange button: its words and the page it opens", x: 8.3, y: 48.4 },
      { label: "Outlined button", where: "Top of the page › Outlined button", x: 28.3, y: 48.3, right: true },
      {
        label: "Figures along the bottom",
        where: "Top of the page › Figures along the bottom. The return is written {sinceInception}, so it prints the latest fact sheet's figure.",
        x: 8.3,
        y: 74.5,
      },
    ],
  },
  record: {
    picture: "/site-sections/guide/record.png",
    parts: [
      { label: "Small label and heading", where: "Performance › Heading", x: 8.3, y: 23 },
      { label: "Paragraph", where: "Performance › Paragraph. It states returns, so only compliance can change it.", gate: "compliance", x: 8.3, y: 64.7 },
      { label: "The discs", where: "Fact sheets › Rs. 10 Lakh grew to", gate: "factSheet", x: 51.7, y: 14.5 },
    ],
  },
  returns: {
    picture: "/site-sections/guide/returns.png",
    parts: [
      { label: "Returns", where: "Fact sheets › Returns, for 1 Year, 3 Years, 5 Years and Since Inception", gate: "factSheet", x: 8.3, y: 13.1 },
      { label: "Link under the table", where: "Returns › Link under the table", x: 8.3, y: 83.9 },
    ],
  },
  twoWays: {
    picture: "/site-sections/guide/twoWays.png",
    note: "There are always two cards of the same size, so PMS and the AIF carry equal weight.",
    parts: [
      { label: "Heading", where: "Two ways to invest › Heading", x: 8.3, y: 10.2 },
      { label: "Each card", where: "Two ways to invest › The two cards: drawing, small label, name, line, facts and the page it opens", x: 8.3, y: 18.7 },
      { label: "Button words", where: "Two ways to invest › Words on each card's button", x: 10.9, y: 82.7 },
    ],
  },
  founder: {
    picture: "/site-sections/guide/founder.png",
    parts: [
      { label: "Small label", where: "Founder's words › Small label above", x: 8.3, y: 15.9 },
      { label: "Quote", where: "Founder's words › Quote", x: 8.3, y: 26.5 },
      { label: "Portrait", where: "Founder's words › Portrait. Upload a new photo, or leave it empty to keep this one.", x: 70.8, y: 26.5 },
      { label: "Name and the line under it", where: "Founder's words › Name, and Line under the name", x: 70.8, y: 76.9 },
    ],
  },
  getStarted: {
    picture: "/site-sections/guide/getStarted.png",
    parts: [
      { label: "Heading", where: "Get started › Heading", x: 8.3, y: 15.6 },
      { label: "The four cards", where: "The enquiry choices on the Contact page. Your web team changes them for now.", gate: "fixed", x: 8.3, y: 28.7 },
      { label: "Link words", where: "Get started › Words on each card's link", x: 10.1, y: 71.7 },
      { label: "Phone and email", where: "Website › Office details: the first phone number and the main email. The footer and the Contact page show the same.", x: 8.3, y: 81.4 },
    ],
  },
};

/** For a section added from the picker that the Guide has no numbered picture for. */
export const ANY_SECTION_NOTE = "Every word in this section is in its fields.";
