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
      { label: "Small label and heading", where: "Performance › Heading", x: 8.3, y: 14.2 },
      { label: "Paragraph", where: "Performance › Paragraph. It states returns, so only compliance can change it.", gate: "compliance", x: 8.3, y: 30.9 },
      { label: "The discs", where: "Fact sheets › Rs. 1 Mn since inception", gate: "factSheet", x: 51.7, y: 6.9 },
      { label: "Returns table", where: "Fact sheets › Returns, for 1 Year, 3 Years, 5 Years and Since Inception", gate: "factSheet", x: 8.3, y: 54.5 },
      { label: "Link under the table", where: "Performance › Link under the table", x: 8.3, y: 91.6 },
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

/** The how-to cards, in the order staff need them. */
export const HOW_TO: { title: string; steps: string[] }[] = [
  {
    title: "Change words",
    steps: [
      "Open the page under Website, such as Home page. The page shows on the right.",
      "Click the section you want to change. Its fields open on the left.",
      "Type. The page on the right updates in about a second.",
      "Press Publish changes when it reads right.",
    ],
  },
  {
    title: "Move or hide a section",
    steps: [
      "Each section on the right has a bar with Up, Down and Hide.",
      "A hidden section stays on the right, greyed out, so you can find it. Show brings it back.",
      "Visitors see the new order only after you publish.",
    ],
  },
  {
    title: "Add a section",
    steps: [
      "Press Add Section under the list on the left.",
      "Pick one by its picture. It arrives with sample words.",
      "Change the words, move it into place, then publish.",
    ],
  },
  {
    title: "Change the returns and the graphs",
    steps: [
      "Open Publishing › Fact sheets and press Create New, or Add a fact sheet in the Performance section.",
      "Pick the fund and the month, then drop in the month's fact sheet PDF.",
      "Copy the numbers into the grid. You can paste a whole column. A box turns amber when it moved a lot since last month: check it against the PDF.",
      "Press Send to compliance. Someone from compliance, not you, approves it, and the graphs and the return in the top figures change then.",
    ],
  },
  {
    title: "Put up a document",
    steps: [
      "Open Website › Documents and press the document, or Create New for a new one.",
      "Drop the approved PDF into File, or type a web address for a page on another site.",
      "Set the date it carries and pick its group. Save puts it on the Investor Centre page straight away.",
    ],
  },
  {
    title: "Undo",
    steps: [
      "Before you publish: Revert to published, next to the status at the top, throws the draft away.",
      "After you publish: Versions, at the top right, lists every saved version. Open one and restore it.",
    ],
  },
];

/** The rules, in plain words. */
export const RULES: string[] = [
  "Your changes are a draft until you press Publish changes. Visitors never see a draft.",
  "Returns come only from a fact sheet that compliance has approved. They are not typed into the page.",
  "Words in braces, like {sinceInception}, print a figure from that fact sheet. Keep the braces.",
  "Never promise or hint at future returns. SEBI's rules for advertising bar it.",
  "Every publish is kept. Any earlier version can be brought back.",
  "Documents, team members, case studies and openings have no draft: Save puts them on the site. Upload only a file compliance has approved.",
];
