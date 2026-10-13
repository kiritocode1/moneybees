import type { GuideSection } from "@/lib/pages/home-guide";
import type { SectionKind } from "@/lib/pages/sections";

/*
 * The Guide's "what changes what" for /our-philosophy, /pms-vs-aif, /aif,
 * /case-studies, /multi-bagger-picks and /careers. Pictures are the sections
 * at 1440px wide (public/site-sections/guide/), taken 2026-10-13. Each part is
 * changed in that page's record under Website unless it says otherwise. The
 * page top, closing cards and other shared sections reuse the PMS entries.
 */

type Guide = Partial<Record<SectionKind, GuideSection>>;

const PAGE_TOP: GuideSection = {
  picture: "/site-sections/guide/product-hero.png",
  note: "Every inside page opens on this same layout; only the words and the drawing change. This picture is the PMS page's.",
  parts: [
    { label: "Title, sentence and buttons", where: "Page top › Title, Sentence under the title, Buttons" },
    { label: "Drawing", where: "Page top › Drawing: pick one of the site's page drawings" },
    { label: "Figures along the bottom", where: "Page top › Figures along the bottom: three to six" },
  ],
};

const CLOSING: GuideSection = {
  picture: "/site-sections/guide/closing-doors.png",
  parts: [{ label: "Client Login and Get Started", where: "The same two cards end most pages. Your web team changes their words for now.", gate: "fixed" }],
};

export const PHILOSOPHY_GUIDE: Guide = {
  productHero: PAGE_TOP,
  coreDiscs: {
    picture: "/site-sections/guide/core-discs.png",
    note: "There are always three stages, one under each disc.",
    parts: [
      { label: "Heading and paragraph", where: "Three discs › Heading, and Paragraph beside the heading" },
      { label: "The three stages", where: "Three discs › The three stages: each word and the line under it" },
    ],
  },
  principles: {
    picture: "/site-sections/guide/principles.png",
    note: "Six of the tholos's columns light in turn, one for each principle, so there are always six.",
    parts: [
      { label: "Small label and heading", where: "Six principles round the tholos › Heading. Each sentence ending in a full stop gets its own line." },
      { label: "The six principles", where: "Six principles round the tholos › The six principles: the first three on the left, the rest on the right" },
    ],
  },
  criteria: {
    picture: "/site-sections/guide/criteria.png",
    parts: [
      { label: "Both headings", where: "Two lists › Left heading and Right heading" },
      { label: "The lines", where: "Two lists › What we look for, and What we don't do: add, remove or reorder lines" },
    ],
  },
  riskRings: {
    picture: "/site-sections/guide/risk-rings.png",
    note: "One ring is drawn round the portfolio for each risk, so adding a risk adds a ring.",
    parts: [
      { label: "Heading", where: "Risk rings › Heading" },
      { label: "Each risk", where: "Risk rings › Risks: two to six, each with the line under it" },
    ],
  },
  closingDoors: CLOSING,
};

export const COMPARE_GUIDE: Guide = {
  productHero: PAGE_TOP,
  comparison: {
    picture: "/site-sections/guide/comparison.png",
    note: "PMS and AIF always sit side by side, and their two buttons are drawn the same.",
    parts: [
      { label: "Small label and heading", where: "PMS and AIF side by side › Heading" },
      { label: "Each row", where: "PMS and AIF side by side › Rows: the PMS line, the AIF line, and which pair of drawings goes with them" },
      { label: "The two buttons", where: "PMS and AIF side by side › The two buttons" },
    ],
  },
  explanation: {
    picture: "/site-sections/guide/explanation.png",
    parts: [
      { label: "Small label and heading", where: "PMS and AIF cards › Heading" },
      { label: "The two sentences", where: "PMS and AIF cards › PMS card and AIF card. The drawings stay." },
    ],
  },
  closingDoors: CLOSING,
};

export const AIF_GUIDE: Guide = {
  productHero: PAGE_TOP,
  aifPerformance: {
    picture: "/site-sections/guide/aif-performance.png",
    note: "SEBI bars AIF returns in marketing without the benchmarking agency's report. Until it exists, tick Hide on the site on this section.",
    parts: [
      { label: "Small label, heading and paragraph", where: "Flyingbee returns › Heading and Paragraph" },
      {
        label: "The date, the bars and the table",
        where: "Fact sheets › Flyingbee, once Show performance publicly is on for Flyingbee in Publishing › Products. Until then, the Flyingbee deck's July 2026 figures.",
        gate: "factSheet",
      },
      { label: "Method and disclaimer", where: "Flyingbee returns › Method and disclaimer", gate: "compliance" },
    ],
  },
  opportunity: {
    picture: "/site-sections/guide/opportunity.png",
    note: "The figure climbs three steps, so there are always three.",
    parts: [
      { label: "Small label, heading and paragraph", where: "Three steps up the block › Heading and Paragraph beside the heading" },
      { label: "The three steps", where: "Three steps up the block › The three steps, bottom to top. Check the tax line against the approved fund documents." },
    ],
  },
  pooling: {
    picture: "/site-sections/guide/pooling.png",
    note: "The PMS and AIF drawings fill in as the reader scrolls; they stay as they are.",
    parts: [
      { label: "Small label and heading", where: "Pooled fund explained › Heading" },
      { label: "The paragraph", where: "Pooled fund explained › Paragraph that lights up word by word" },
    ],
  },
  structure: {
    picture: "/site-sections/guide/structure.png",
    parts: [
      { label: "Small label and heading", where: "Fund structure › Heading" },
      { label: "The three boxes across", where: "Fund structure › First box, Middle box and Last box" },
      { label: "The four parties", where: "Fund structure › The four parties under the fund" },
    ],
  },
  approachWheel: {
    picture: "/site-sections/guide/approach-wheel.png",
    note: "The wheel has one wedge per point, lit in turn as the reader scrolls.",
    parts: [
      { label: "Small label and heading", where: "Approach wheel › Heading" },
      { label: "The points", where: "Approach wheel › Points: three to ten" },
      { label: "Line under the lit point", where: "Approach wheel › Line under the lit point" },
    ],
  },
  keyTerms: {
    picture: "/site-sections/guide/key-terms.png",
    parts: [
      { label: "Small label, heading and button", where: "Key terms › Heading and Button" },
      { label: "Each term", where: "Key terms › Terms: the term, its value and its drawing. Check each against the approved fund documents." },
    ],
  },
  closingDoors: CLOSING,
};

export const CASE_STUDIES_GUIDE: Guide = {
  productHero: PAGE_TOP,
  caseStudies: {
    picture: "/site-sections/guide/case-studies.png",
    note: "Each company gets a section like this one, in the order of the list.",
    parts: [
      { label: "Name and initials", where: "Website › Case studies: Company and Initials in the badge" },
      { label: "The three lines", where: "Website › Case studies: Business model, Competitive edge and Growth prospect" },
      { label: "The drawing", where: "Website › Case studies: Business drawing" },
      { label: "The bars", where: "Website › Case studies: Five years, Rs. crore. The bars redraw from them." },
    ],
  },
  caseTimeline: {
    picture: "/site-sections/guide/case-timeline.png",
    parts: [
      { label: "Small label, heading and paragraph", where: "Profit timeline › Heading and Paragraph beside the heading" },
      { label: "The rows of discs", where: "Website › Case studies: one row per company, each disc sized by that year's PAT" },
      { label: "Disclaimer", where: "Profit timeline › Disclaimer", gate: "compliance" },
    ],
  },
  closingDoors: CLOSING,
};

export const PICKS_GUIDE: Guide = {
  productHero: PAGE_TOP,
  picks: {
    picture: "/site-sections/guide/picks.png",
    note: "The pyramid has five steps, so there are always five tiers, highest first.",
    parts: [
      { label: "Small label and heading", where: "Picks pyramid › Small label above, and Heading" },
      {
        label: "Each tier",
        where: "Picks pyramid › The five tiers: the multiple, then the named stocks or a count line. A stock with a business model opens its case study under the name.",
        gate: "compliance",
      },
    ],
  },
  closingDoors: CLOSING,
};

export const CAREERS_GUIDE: Guide = {
  careersIntro: {
    picture: "/site-sections/guide/careers-intro.png",
    parts: [
      { label: "Small label, heading and paragraph", where: "Careers heading › Small label above, Heading and Paragraph" },
      { label: "Button and resume link", where: "Careers heading › Button to the roles, and Resume link words. Resumes go to the main email in Website › Office details." },
    ],
  },
  jobBoard: {
    picture: "/site-sections/guide/job-board.png",
    note: "A role marked Sample says it is not a live vacancy. A Live role offers Apply with your resume.",
    parts: [
      { label: "Heading", where: "Job board › Heading" },
      { label: "The roles", where: "Website › Openings: each role's title, team, location, type, summary and lines, and whether it is Live or a Sample. Drag a row to change the order." },
    ],
  },
  careersOffice: {
    picture: "/site-sections/guide/careers-office.png",
    parts: [
      { label: "Photograph and the line under it", where: "Office photograph and text › Photograph, and Line under the photograph" },
      { label: "Heading and both paragraphs", where: "Office photograph and text › Heading, Large paragraph and Smaller paragraph" },
      { label: "Meet the team link", where: "Office photograph and text › Link words and Link goes to" },
    ],
  },
  careersResume: {
    picture: "/site-sections/guide/careers-resume.png",
    parts: [
      { label: "Heading and paragraph", where: "Send your resume › Heading and Paragraph" },
      { label: "Button and the address", where: "Send your resume › Button words. The address is the main email in Website › Office details." },
    ],
  },
};
