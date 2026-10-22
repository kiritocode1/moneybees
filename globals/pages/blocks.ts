import type { Field } from "payload";
import { allowField } from "@/lib/backend/roles";
import { ABOUT_HERO, ABOUT_STORY, FOUNDER_PROFILE, GROUP_AREAS, RECOGNITION, TEAM_SECTION, TIMELINE } from "@/lib/pages/about-content";
import { FAQ, FOUNDER_WORDS, GET_STARTED, HERO, RECORD, RETURNS, TEXT, TWO_WAYS } from "@/lib/pages/home-content";
import { AIF_APPROACH, AIF_KEY_TERMS, AIF_OPPORTUNITY, AIF_PERFORMANCE, AIF_POOLING, AIF_STRUCTURE } from "@/lib/pages/aif-content";
import { CAREERS_INTRO, CAREERS_OFFICE, CAREERS_RESUME, JOB_BOARD } from "@/lib/pages/careers-content";
import { CASE_TIMELINE } from "@/lib/pages/case-studies-content";
import { COMPARISON_SECTION, EXPLANATION_SECTION } from "@/lib/pages/compare-content";
import { ENQUIRY_SECTION } from "@/lib/pages/contact-content";
import { CORE_DISCS, CRITERIA, PRINCIPLES, RISK_RINGS } from "@/lib/pages/philosophy-content";
import { PICKS } from "@/lib/pages/picks-content";
import { DOCUMENTS_SECTION, LOGINS_SECTION } from "@/lib/pages/investor-centre-content";
import { PMS_HERO_CONTENT, PMS_PERFORMANCE, PMS_PHILOSOPHY, PMS_PORTFOLIO, PMS_RISKS_CONTENT, PMS_SELECTION, PMS_WEALTH, PMS_WHY } from "@/lib/pages/pms-content";
import { TOKEN_HELP } from "@/lib/site/tokens";
import { action, section } from "./page-global";

/*
 * Every kind of section an editable page can hold, as Payload blocks. A page
 * lists the ones it offers (globals/HomePage.ts, globals/PmsPage.ts). Field
 * labels are what staff read; defaults are today's words, so a section added
 * from the picker arrives filled in.
 */

const label = (value?: string | null): Field => ({ name: "label", type: "text", label: "Small label above", defaultValue: value ?? undefined });
const heading = (value: string, type: "text" | "textarea" = "text"): Field =>
  type === "textarea" ? { name: "heading", type, required: true, label: "Heading", defaultValue: value } : { name: "heading", type, required: true, label: "Heading", defaultValue: value };
/** Regulatory wording about returns: compliance changes it, like the fact sheet. */
const complianceOnly = { update: allowField("compliance") };

/* ------------------------------------------------------------- Home --- */

export const hero = section("hero", [
  { name: "heading", type: "text", required: true, label: "Headline", defaultValue: HERO.heading },
  { name: "introduction", type: "textarea", label: "Line under the headline", defaultValue: HERO.introduction ?? undefined },
  action("primary", "Orange button", HERO.primary ?? {}),
  action("secondary", "Outlined button", HERO.secondary ?? {}),
  {
    name: "figures",
    type: "array",
    label: "Figures along the bottom",
    labels: { singular: "Figure", plural: "Figures" },
    maxRows: 4,
    defaultValue: HERO.figures ?? undefined,
    admin: { description: TOKEN_HELP },
    fields: [
      {
        type: "row",
        fields: [
          { name: "figure", type: "text", required: true, label: "Number" },
          { name: "label", type: "text", required: true, label: "What it means" },
        ],
      },
    ],
  },
]);

export const record = section("record", [
  // The discs, and where to change the amount they draw.
  { name: "graphs", type: "ui", admin: { components: { Field: "/components/admin/site-editor/performance-source#WealthSource" } } },
  { name: "eyebrow", type: "text", label: "Small label above", defaultValue: RECORD.eyebrow ?? undefined },
  heading(RECORD.heading, "textarea"),
  {
    name: "lead",
    type: "textarea",
    label: "Paragraph",
    defaultValue: RECORD.lead ?? undefined,
    // It states returns, so it goes through compliance like the fact sheet does.
    access: complianceOnly,
    admin: { description: `It states returns, so only compliance can change it. ${TOKEN_HELP}` },
  },
]);

/** The long-period bars under Performance. The percentages come from the fact sheet. */
export const returns = section("returns", [
  { name: "graphs", type: "ui", admin: { components: { Field: "/components/admin/site-editor/performance-source#ReturnsSource" } } },
  action("more", "Link under the table", RETURNS.more ?? {}),
]);

export const twoWays = section("twoWays", [
  heading(TWO_WAYS.heading),
  { name: "button", type: "text", required: true, label: "Words on each card's button", defaultValue: TWO_WAYS.button },
  {
    name: "ways",
    type: "array",
    label: "The two cards",
    labels: { singular: "Card", plural: "Cards" },
    minRows: 2,
    maxRows: 2,
    defaultValue: TWO_WAYS.ways ?? undefined,
    admin: { description: "Always two cards of the same size, so PMS and the AIF carry equal weight." },
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "kind",
            type: "select",
            required: true,
            label: "Drawing",
            options: [
              { value: "pms", label: "PMS: one investor, their own portfolio" },
              { value: "aif", label: "AIF: many investors, one fund" },
            ],
          },
          { name: "link", type: "text", required: true, label: "Goes to" },
        ],
      },
      { type: "row", fields: [
        { name: "label", type: "text", required: true, label: "Small label" },
        { name: "name", type: "text", required: true, label: "Name" },
      ] },
      { name: "lead", type: "textarea", label: "Line under the name" },
      { name: "facts", type: "array", label: "Facts", labels: { singular: "Fact", plural: "Facts" }, maxRows: 4, fields: [{ name: "fact", type: "text", required: true }] },
    ],
  },
]);

export const founder = section("founder", [
  label(FOUNDER_WORDS.label),
  { name: "quote", type: "textarea", required: true, label: "Quote", defaultValue: FOUNDER_WORDS.quote },
  { name: "photo", type: "upload", relationTo: "media", label: "Portrait", admin: { description: "Leave empty to keep the current portrait." } },
  { type: "row", fields: [
    { name: "name", type: "text", required: true, label: "Name", defaultValue: FOUNDER_WORDS.name },
    { name: "credentials", type: "text", label: "Line under the name", defaultValue: FOUNDER_WORDS.credentials ?? undefined },
  ] },
]);

export const getStarted = section("getStarted", [
  {
    name: "heading",
    type: "text",
    required: true,
    label: "Heading",
    defaultValue: GET_STARTED.heading,
    admin: { description: "The four cards are the enquiry choices on the Contact page, and the phone and email are the office's." },
  },
  { name: "linkLabel", type: "text", required: true, label: "Words on each card's link", defaultValue: GET_STARTED.linkLabel },
]);

/* ------------------------------------------------------------ Shared --- */

export const faq = section("faq", [
  label(FAQ.label),
  heading(FAQ.heading),
  {
    name: "questions",
    type: "array",
    label: "Questions",
    labels: { singular: "Question", plural: "Questions" },
    defaultValue: FAQ.questions ?? undefined,
    fields: [
      { name: "question", type: "text", required: true },
      { name: "answer", type: "textarea", required: true },
    ],
  },
]);

export const text = section("text", [
  label(TEXT.label),
  heading(TEXT.heading, "textarea"),
  { name: "body", type: "textarea", label: "Paragraphs", defaultValue: TEXT.body ?? undefined, admin: { description: "Leave an empty line between paragraphs." } },
  action("action", "Button", TEXT.action ?? {}),
]);

/** The hero every internal page opens on: a big two-line title over the page's drawing. */
export const productHero = section("productHero", [
  { type: "row", fields: [
    { name: "title1", type: "text", required: true, label: "Title, first line", defaultValue: PMS_HERO_CONTENT.title1 },
    { name: "title2", type: "text", label: "Title, second line", defaultValue: PMS_HERO_CONTENT.title2 ?? undefined, admin: { description: "Set in a step to the right. Leave empty for one line." } },
  ] },
  { name: "sentence", type: "textarea", required: true, label: "Sentence under the title", defaultValue: PMS_HERO_CONTENT.sentence },
  {
    name: "mark",
    type: "select",
    required: true,
    label: "Drawing",
    defaultValue: PMS_HERO_CONTENT.mark,
    options: [
      { value: "pms", label: "PMS" },
      { value: "aif", label: "AIF" },
      { value: "compare", label: "PMS vs AIF" },
      { value: "approach", label: "Our philosophy" },
      { value: "picks", label: "Picks" },
      { value: "cases", label: "Case studies" },
      { value: "careers", label: "Careers" },
      { value: "contact", label: "Contact" },
      { value: "investor", label: "Investor Centre" },
    ],
  },
  {
    name: "actions",
    type: "array",
    label: "Buttons",
    labels: { singular: "Button", plural: "Buttons" },
    maxRows: 2,
    defaultValue: PMS_HERO_CONTENT.actions ?? undefined,
    fields: [
      { type: "row", fields: [
        { name: "label", type: "text", required: true, label: "Words on it" },
        { name: "link", type: "text", required: true, label: "Goes to" },
        { name: "outline", type: "checkbox", label: "Outlined instead of orange" },
      ] },
    ],
  },
  {
    name: "figures",
    type: "array",
    label: "Figures along the bottom",
    labels: { singular: "Figure", plural: "Figures" },
    minRows: 3,
    maxRows: 6,
    defaultValue: PMS_HERO_CONTENT.figures ?? undefined,
    fields: [
      { type: "row", fields: [
        { name: "label", type: "text", required: true, label: "Small label" },
        { name: "value", type: "text", required: true, label: "Figure" },
      ] },
    ],
  },
]);

/** The two cards that close a content page: Client Login and the enquiry. Their words are the same on every page. */
export const closingDoors = section("closingDoors", [
  { name: "about", type: "ui", admin: { components: { Field: "/components/admin/site-editor/page-notes#ClosingDoorsNote" } } },
]);

/* --------------------------------------------------------------- PMS --- */

export const pmsPerformance = section("pmsPerformance", [
  { name: "graphs", type: "ui", admin: { components: { Field: "/components/admin/site-editor/performance-source#PerformanceSource" } } },
  label(PMS_PERFORMANCE.label),
  heading(PMS_PERFORMANCE.heading),
  { name: "lead", type: "textarea", label: "Paragraph", defaultValue: PMS_PERFORMANCE.lead ?? undefined },
  { name: "note", type: "text", label: "Line under the table", defaultValue: PMS_PERFORMANCE.note ?? undefined },
  {
    name: "method",
    type: "textarea",
    label: "Method and disclaimer",
    defaultValue: PMS_PERFORMANCE.method ?? undefined,
    access: complianceOnly,
    admin: { description: `How the returns are worked out and the disclaimer SEBI requires beside them. Only compliance can change it. ${TOKEN_HELP}` },
  },
]);

export const wealthGrowth = section("wealthGrowth", [
  { name: "graphs", type: "ui", admin: { components: { Field: "/components/admin/site-editor/performance-source#PerformanceSource" } } },
  label(PMS_WEALTH.label),
  heading(PMS_WEALTH.heading),
  { name: "lead", type: "textarea", label: "Paragraph", defaultValue: PMS_WEALTH.lead ?? undefined },
]);

const WHY_DRAWINGS = [
  { value: "research", label: "Research" },
  { value: "size", label: "Company size" },
  { value: "concentrated", label: "Concentrated portfolio" },
  { value: "management", label: "Management" },
  { value: "longterm", label: "Long term" },
  { value: "riskreward", label: "Risk and reward" },
  { value: "overlooked", label: "Overlooked" },
];

export const whyPms = section("whyPms", [
  label(PMS_WHY.label),
  heading(PMS_WHY.heading),
  { name: "intro", type: "textarea", label: "Paragraph beside the heading", defaultValue: PMS_WHY.intro ?? undefined },
  {
    name: "points",
    type: "array",
    label: "Points",
    labels: { singular: "Point", plural: "Points" },
    minRows: 3,
    maxRows: 9,
    defaultValue: PMS_WHY.points ?? undefined,
    admin: { description: "Each point shows its drawing and line as it scrolls past." },
    fields: [
      { type: "row", fields: [
        { name: "name", type: "text", required: true, label: "Point" },
        { name: "drawing", type: "select", required: true, label: "Drawing", options: WHY_DRAWINGS },
      ] },
      { name: "line", type: "textarea", label: "Line under the drawing" },
    ],
  },
]);

export const philosophy = section("philosophy", [
  label(PMS_PHILOSOPHY.label),
  heading(PMS_PHILOSOPHY.heading),
  {
    name: "words",
    type: "array",
    label: "The three words",
    labels: { singular: "Word", plural: "Words" },
    minRows: 3,
    maxRows: 3,
    defaultValue: PMS_PHILOSOPHY.words ?? undefined,
    admin: { description: "Each sits over its own drawing, in this order. A word starting Un or Under- has that part set upright and the rest in italic." },
    fields: [{ name: "word", type: "text", required: true }],
  },
  {
    name: "points",
    type: "array",
    label: "Points",
    labels: { singular: "Point", plural: "Points" },
    defaultValue: PMS_PHILOSOPHY.points ?? undefined,
    fields: [{ name: "point", type: "text", required: true }],
  },
]);

export const selection = section("selection", [
  label(PMS_SELECTION.label),
  heading(PMS_SELECTION.heading),
  {
    name: "steps",
    type: "array",
    label: "The four steps",
    labels: { singular: "Step", plural: "Steps" },
    minRows: 4,
    maxRows: 4,
    defaultValue: PMS_SELECTION.steps ?? undefined,
    admin: { description: "Always four: the drawing narrows the lines once at each step." },
    fields: [
      { name: "name", type: "text", required: true, label: "Step" },
      { name: "text", type: "textarea", label: "Line under it" },
    ],
  },
]);

export const portfolioApproach = section("portfolioApproach", [
  heading(PMS_PORTFOLIO.heading),
  { type: "row", fields: [
    { name: "sectorCap", type: "number", required: true, min: 1, max: 100, label: "Sector cap (%)", defaultValue: PMS_PORTFOLIO.sectorCap, admin: { description: "The ring lights this share." } },
    { name: "sectorLine", type: "text", required: true, label: "Line under the ring", defaultValue: PMS_PORTFOLIO.sectorLine },
  ] },
  { type: "row", fields: [
    { name: "holdingsFrom", type: "number", required: true, min: 1, label: "Stocks, from", defaultValue: PMS_PORTFOLIO.holdingsFrom },
    { name: "holdingsTo", type: "number", required: true, min: 1, label: "Stocks, to", defaultValue: PMS_PORTFOLIO.holdingsTo },
  ] },
  { name: "holdingsLine", type: "text", required: true, label: "Line under the stock count", defaultValue: PMS_PORTFOLIO.holdingsLine },
  {
    name: "rules",
    type: "array",
    label: "The three rules below",
    labels: { singular: "Rule", plural: "Rules" },
    minRows: 3,
    maxRows: 3,
    defaultValue: PMS_PORTFOLIO.rules ?? undefined,
    fields: [{ name: "rule", type: "text", required: true }],
  },
]);

export const risks = section("risks", [
  label(PMS_RISKS_CONTENT.label),
  heading(PMS_RISKS_CONTENT.heading),
  {
    name: "risks",
    type: "array",
    label: "The four risks",
    labels: { singular: "Risk", plural: "Risks" },
    minRows: 4,
    maxRows: 4,
    defaultValue: PMS_RISKS_CONTENT.risks ?? undefined,
    admin: { description: "Always four, one per block of the drawing, from the bottom block up." },
    fields: [
      { name: "name", type: "text", required: true, label: "Risk" },
      { name: "text", type: "textarea", label: "Line under it" },
    ],
  },
]);

/* ------------------------------------------------------------- About --- */

export const aboutHero = section("aboutHero", [
  label(ABOUT_HERO.label),
  heading(ABOUT_HERO.heading),
  {
    name: "paragraphs",
    type: "array",
    label: "Paragraphs beside the heading",
    labels: { singular: "Paragraph", plural: "Paragraphs" },
    defaultValue: ABOUT_HERO.paragraphs ?? undefined,
    fields: [{ name: "paragraph", type: "textarea", required: true }],
  },
  { name: "photo", type: "upload", relationTo: "media", label: "Photograph", admin: { description: "Leave empty to keep the team photograph." } },
]);

export const founderProfile = section("founderProfile", [
  label(FOUNDER_PROFILE.label),
  { type: "row", fields: [
    { name: "name", type: "text", required: true, label: "Name", defaultValue: FOUNDER_PROFILE.name },
    { name: "role", type: "text", label: "Line under the name", defaultValue: FOUNDER_PROFILE.role ?? undefined },
  ] },
  { name: "photo", type: "upload", relationTo: "media", label: "Portrait", admin: { description: "Leave empty to keep the current portrait." } },
  {
    name: "qualifications",
    type: "array",
    label: "Qualifications",
    labels: { singular: "Qualification", plural: "Qualifications" },
    defaultValue: FOUNDER_PROFILE.qualifications ?? undefined,
    admin: { description: "Shown as small pills. Remove them all to show none." },
    fields: [{ name: "qualification", type: "text", required: true }],
  },
  { type: "row", fields: [
    { name: "years", type: "number", min: 0, label: "Years counted up", defaultValue: FOUNDER_PROFILE.years ?? undefined, admin: { description: "Leave empty to hide the number." } },
    { name: "yearsLabel", type: "text", label: "Words beside the number", defaultValue: FOUNDER_PROFILE.yearsLabel ?? undefined },
  ] },
  {
    name: "points",
    type: "array",
    label: "Points",
    labels: { singular: "Point", plural: "Points" },
    defaultValue: FOUNDER_PROFILE.points ?? undefined,
    fields: [{ name: "point", type: "text", required: true }],
  },
]);

export const teamCarousel = section("teamCarousel", [
  { name: "about", type: "ui", admin: { components: { Field: "/components/admin/site-editor/page-notes#TeamNote" } } },
  heading(TEAM_SECTION.heading),
  { type: "row", fields: [
    { name: "buttonLabel", type: "text", label: "Button words", defaultValue: TEAM_SECTION.buttonLabel ?? undefined },
    { name: "buttonLink", type: "text", label: "Button goes to", defaultValue: TEAM_SECTION.buttonLink ?? undefined },
  ] },
]);

export const groupAreas = section("groupAreas", [
  label(GROUP_AREAS.label),
  {
    name: "areas",
    type: "array",
    label: "The four areas",
    labels: { singular: "Area", plural: "Areas" },
    minRows: 4,
    maxRows: 4,
    defaultValue: GROUP_AREAS.areas ?? undefined,
    admin: { description: "Each keeps its drawing, in this order: portfolios, broking, advisory, depository." },
    fields: [{ name: "name", type: "text", required: true }],
  },
]);

export const recognition = section("recognition", [
  label(RECOGNITION.label),
  heading(RECOGNITION.heading, "textarea"),
  { type: "row", fields: [
    { name: "asOf", type: "text", label: "Date pill", defaultValue: RECOGNITION.asOf ?? undefined, access: complianceOnly },
    { name: "note", type: "text", label: "Line under the lists", defaultValue: RECOGNITION.note ?? undefined, access: complianceOnly },
  ] },
  {
    name: "tables",
    type: "array",
    label: "Ranking lists",
    labels: { singular: "List", plural: "Lists" },
    minRows: 1,
    maxRows: 3,
    defaultValue: RECOGNITION.tables ?? undefined,
    access: complianceOnly,
    admin: { description: "Each list as PMS Bazaar published it: its top returns in order, and which of them is Moneybee's. Only compliance can change these." },
    fields: [
      { type: "row", fields: [
        { name: "rank", type: "text", required: true, label: "Moneybee's rank, e.g. 3rd" },
        { name: "period", type: "text", required: true, label: "Period, e.g. 5-year returns" },
        { name: "ours", type: "number", required: true, min: 0, label: "Moneybee's place (0 is the top)" },
      ] },
      { name: "returns", type: "array", label: "Returns, top first (%)", labels: { singular: "Return", plural: "Returns" }, minRows: 1, maxRows: 10, fields: [{ name: "value", type: "number", required: true }] },
    ],
  },
]);

export const timeline = section("timeline", [
  label(TIMELINE.label),
  {
    name: "stops",
    type: "array",
    label: "Dates",
    labels: { singular: "Date", plural: "Dates" },
    minRows: 2,
    maxRows: 4,
    defaultValue: TIMELINE.stops ?? undefined,
    fields: [
      { type: "row", fields: [
        { name: "label", type: "text", required: true, label: "Date, e.g. Aug 2007" },
        { name: "text", type: "text", required: true, label: "What happened" },
      ] },
    ],
  },
]);

export const story = section("story", [
  heading(ABOUT_STORY.heading),
  { name: "line", type: "textarea", required: true, label: "The quote", defaultValue: ABOUT_STORY.line },
]);

/* ---------------------------------------------- Investor Centre and Contact --- */

/** A note at the top of a section: where the rest of it is edited. */
const note = (name: string): Field => ({ name: "about", type: "ui", admin: { components: { Field: `/components/admin/site-editor/page-notes#${name}` } } });

export const logins = section("logins", [note("LoginsNote"), heading(LOGINS_SECTION.heading)]);

export const documentCards = section("documentCards", [
  note("DocumentsNote"),
  heading(DOCUMENTS_SECTION.heading),
  { name: "lead", type: "textarea", label: "Paragraph beside the heading", defaultValue: DOCUMENTS_SECTION.lead ?? undefined },
]);

export const enquiry = section("enquiry", [
  note("EnquiryNote"),
  label(ENQUIRY_SECTION.label),
  heading(ENQUIRY_SECTION.heading),
  { name: "desksLabel", type: "text", label: "Small label above the desks", defaultValue: ENQUIRY_SECTION.desksLabel ?? undefined },
]);

export const office = section("office", [note("OfficeNote")]);

/* ------------------------------------------------ Our Philosophy --- */

/** A list of one-line items, such as the criteria. */
const items = (name: string, label: string, value: { item: string }[] | null | undefined): Field => ({
  name,
  type: "array",
  label,
  labels: { singular: "Line", plural: "Lines" },
  minRows: 1,
  defaultValue: value ?? undefined,
  fields: [{ name: "item", type: "text", required: true, label: "Line" }],
});

export const coreDiscs = section("coreDiscs", [
  heading(CORE_DISCS.heading),
  { name: "lead", type: "textarea", label: "Paragraph beside the heading", defaultValue: CORE_DISCS.lead ?? undefined },
  {
    name: "stages",
    type: "array",
    label: "The three stages",
    labels: { singular: "Stage", plural: "Stages" },
    minRows: 3,
    maxRows: 3,
    defaultValue: CORE_DISCS.stages ?? undefined,
    admin: { description: "One under each disc, smallest first." },
    fields: [
      { name: "word", type: "text", required: true, label: "Word" },
      { name: "text", type: "textarea", label: "Line under it" },
    ],
  },
]);

export const principles = section("principles", [
  label(PRINCIPLES.label),
  heading(PRINCIPLES.heading, "textarea"),
  {
    name: "principles",
    type: "array",
    label: "The six principles",
    labels: { singular: "Principle", plural: "Principles" },
    minRows: 6,
    maxRows: 6,
    defaultValue: PRINCIPLES.principles ?? undefined,
    admin: { description: "Each lights up as its column turns to the front: the first three on the left, the rest on the right." },
    fields: [
      { name: "name", type: "text", required: true, label: "Principle" },
      { name: "text", type: "textarea", required: true, label: "Line under it" },
    ],
  },
]);

export const criteria = section("criteria", [
  { type: "row", fields: [
    { name: "lookForHeading", type: "text", required: true, label: "Left heading", defaultValue: CRITERIA.lookForHeading },
    { name: "dontDoHeading", type: "text", required: true, label: "Right heading", defaultValue: CRITERIA.dontDoHeading },
  ] },
  items("lookFor", "What we look for (orange dots)", CRITERIA.lookFor),
  items("dontDo", "What we don't do (struck-through dots)", CRITERIA.dontDo),
]);

export const riskRings = section("riskRings", [
  heading(RISK_RINGS.heading),
  {
    name: "risks",
    type: "array",
    label: "Risks",
    labels: { singular: "Risk", plural: "Risks" },
    minRows: 2,
    maxRows: 6,
    defaultValue: RISK_RINGS.risks ?? undefined,
    admin: { description: "One ring round the portfolio for each risk." },
    fields: [
      { name: "name", type: "text", required: true, label: "Risk" },
      { name: "text", type: "textarea", label: "Line under it" },
    ],
  },
]);

/* ------------------------------------------------------ PMS vs AIF --- */

export const comparison = section("comparison", [
  label(COMPARISON_SECTION.label),
  heading(COMPARISON_SECTION.heading),
  {
    name: "rows",
    type: "array",
    label: "Rows",
    labels: { singular: "Row", plural: "Rows" },
    minRows: 1,
    defaultValue: COMPARISON_SECTION.rows ?? undefined,
    fields: [
      { type: "row", fields: [
        { name: "pms", type: "text", required: true, label: "PMS" },
        { name: "aif", type: "text", required: true, label: "AIF" },
      ] },
      {
        name: "drawing",
        type: "select",
        required: true,
        label: "Drawings",
        options: [
          { value: "holding", label: "What the investor holds" },
          { value: "money", label: "How the money is managed" },
          { value: "structure", label: "The structure" },
          { value: "product", label: "The product" },
          { value: "account", label: "Where it is held" },
        ],
      },
    ],
  },
  {
    name: "links",
    type: "array",
    label: "The two buttons",
    labels: { singular: "Button", plural: "Buttons" },
    minRows: 2,
    maxRows: 2,
    defaultValue: COMPARISON_SECTION.links ?? undefined,
    admin: { description: "Drawn the same, so neither product leads." },
    fields: [
      { type: "row", fields: [
        { name: "label", type: "text", required: true, label: "Words on it" },
        { name: "link", type: "text", required: true, label: "Goes to" },
      ] },
    ],
  },
]);

export const explanation = section("explanation", [
  label(EXPLANATION_SECTION.label),
  heading(EXPLANATION_SECTION.heading),
  { name: "pms", type: "textarea", required: true, label: "PMS card", defaultValue: EXPLANATION_SECTION.pms },
  { name: "aif", type: "textarea", required: true, label: "AIF card", defaultValue: EXPLANATION_SECTION.aif },
]);

/* ------------------------------------------------------------- AIF --- */

export const aifPerformance = section("aifPerformance", [
  { name: "about", type: "ui", admin: { components: { Field: "/components/admin/site-editor/page-notes#AifPerformanceNote" } } },
  label(AIF_PERFORMANCE.label),
  heading(AIF_PERFORMANCE.heading),
  { name: "lead", type: "textarea", label: "Paragraph beside the heading", defaultValue: AIF_PERFORMANCE.lead ?? undefined },
  { name: "method", type: "textarea", label: "Method and disclaimer", defaultValue: AIF_PERFORMANCE.method ?? undefined, access: complianceOnly },
]);

export const opportunity = section("opportunity", [
  label(AIF_OPPORTUNITY.label),
  heading(AIF_OPPORTUNITY.heading),
  { name: "lead", type: "textarea", label: "Paragraph beside the heading", defaultValue: AIF_OPPORTUNITY.lead ?? undefined },
  {
    name: "steps",
    type: "array",
    label: "The three steps",
    labels: { singular: "Step", plural: "Steps" },
    minRows: 3,
    maxRows: 3,
    defaultValue: AIF_OPPORTUNITY.steps ?? undefined,
    admin: { description: "The figure climbs them bottom to top. The tax line is a regulatory statement: check it against the approved fund documents." },
    fields: [
      { name: "title", type: "text", required: true, label: "Step" },
      { name: "text", type: "textarea", required: true, label: "Line under it" },
    ],
  },
]);

export const pooling = section("pooling", [
  label(AIF_POOLING.label),
  heading(AIF_POOLING.heading),
  { name: "text", type: "textarea", required: true, label: "Paragraph that lights up word by word", defaultValue: AIF_POOLING.text },
]);

export const structure = section("structure", [
  label(AIF_STRUCTURE.label),
  heading(AIF_STRUCTURE.heading),
  { type: "row", fields: [
    { name: "investors", type: "text", required: true, label: "First box", defaultValue: AIF_STRUCTURE.investors },
    { name: "fund", type: "text", required: true, label: "Middle box (orange)", defaultValue: AIF_STRUCTURE.fund },
    { name: "manager", type: "text", required: true, label: "Last box", defaultValue: AIF_STRUCTURE.manager },
  ] },
  {
    name: "parties",
    type: "array",
    label: "The four parties under the fund",
    labels: { singular: "Party", plural: "Parties" },
    minRows: 4,
    maxRows: 4,
    defaultValue: AIF_STRUCTURE.parties ?? undefined,
    fields: [{ name: "name", type: "text", required: true, label: "Name" }],
  },
]);

export const approachWheel = section("approachWheel", [
  label(AIF_APPROACH.label),
  heading(AIF_APPROACH.heading),
  {
    name: "steps",
    type: "array",
    label: "Points",
    labels: { singular: "Point", plural: "Points" },
    minRows: 3,
    maxRows: 10,
    defaultValue: AIF_APPROACH.steps ?? undefined,
    admin: { description: "One wedge of the wheel each, lit in turn as the reader scrolls." },
    fields: [{ name: "step", type: "text", required: true, label: "Point" }],
  },
  { name: "line", type: "textarea", label: "Line under the lit point", defaultValue: AIF_APPROACH.line ?? undefined },
]);

export const keyTerms = section("keyTerms", [
  label(AIF_KEY_TERMS.label),
  heading(AIF_KEY_TERMS.heading),
  action("button", "Button", AIF_KEY_TERMS.button ?? {}),
  {
    name: "terms",
    type: "array",
    label: "Terms",
    labels: { singular: "Term", plural: "Terms" },
    minRows: 1,
    maxRows: 5,
    defaultValue: AIF_KEY_TERMS.terms ?? undefined,
    admin: { description: "Check every term against the approved fund documents." },
    fields: [
      { type: "row", fields: [
        { name: "label", type: "text", required: true, label: "Term" },
        { name: "value", type: "text", required: true, label: "Value" },
      ] },
      {
        name: "drawing",
        type: "select",
        required: true,
        label: "Drawing",
        options: [
          { value: "minimum", label: "Minimum" },
          { value: "horizon", label: "Time frame" },
          { value: "universe", label: "What it invests in" },
          { value: "benchmark", label: "Benchmark" },
          { value: "exit", label: "Exit" },
        ],
      },
    ],
  },
]);

/* ------------------------------------------- Case studies and picks --- */

export const caseStudiesList = section("caseStudies", [note("CaseStudiesNote")]);

export const caseTimeline = section("caseTimeline", [
  label(CASE_TIMELINE.label),
  heading(CASE_TIMELINE.heading),
  { name: "lead", type: "textarea", label: "Paragraph beside the heading", defaultValue: CASE_TIMELINE.lead ?? undefined },
  { name: "disclaimer", type: "textarea", label: "Disclaimer", defaultValue: CASE_TIMELINE.disclaimer ?? undefined, access: complianceOnly },
]);

export const picks = section("picks", [
  { name: "label", type: "text", required: true, label: "Small label above", defaultValue: PICKS.label },
  { name: "heading", type: "textarea", label: "Heading", defaultValue: PICKS.heading ?? undefined },
  {
    name: "tiers",
    type: "array",
    label: "The five tiers, highest first",
    labels: { singular: "Tier", plural: "Tiers" },
    minRows: 5,
    maxRows: 5,
    defaultValue: PICKS.tiers ?? undefined,
    access: complianceOnly,
    admin: { description: "One per step of the pyramid. Named stocks read as recommendations, so only compliance changes these." },
    fields: [
      { type: "row", fields: [
        { name: "multiple", type: "text", required: true, label: "Multiple, e.g. > 10X" },
        { name: "countLine", type: "text", label: "Or a count line", admin: { description: "Shown when no stocks are named, e.g. More than 10 stocks." } },
      ] },
      {
        name: "picks",
        type: "array",
        label: "Named stocks",
        labels: { singular: "Stock", plural: "Stocks" },
        fields: [
          { name: "name", type: "text", required: true, label: "Company" },
          {
            type: "collapsible",
            label: "Case study (optional)",
            admin: { initCollapsed: true, description: "Fill the business model to show a case study under the name." },
            fields: [
              { name: "business", type: "textarea", label: "Business model" },
              { name: "edge", type: "textarea", label: "Competitive edge" },
              { name: "growth", type: "textarea", label: "Growth prospect" },
              {
                name: "financials",
                type: "array",
                label: "Revenue and PAT, Rs. crore",
                labels: { singular: "Year", plural: "Years" },
                fields: [
                  { type: "row", fields: [
                    { name: "year", type: "text", required: true, label: "Year" },
                    { name: "revenue", type: "number", required: true, label: "Revenue" },
                    { name: "profit", type: "number", required: true, label: "PAT" },
                  ] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

/* ---------------------------------------------------------- Careers --- */

export const careersIntro = section("careersIntro", [
  label(CAREERS_INTRO.label),
  heading(CAREERS_INTRO.heading),
  { name: "lead", type: "textarea", label: "Paragraph", defaultValue: CAREERS_INTRO.lead ?? undefined },
  { type: "row", fields: [
    { name: "buttonLabel", type: "text", label: "Button to the roles", defaultValue: CAREERS_INTRO.buttonLabel ?? undefined },
    { name: "resumeLabel", type: "text", label: "Resume link words", defaultValue: CAREERS_INTRO.resumeLabel ?? undefined, admin: { description: "Emails the main address in Office details." } },
  ] },
]);

export const jobBoard = section("jobBoard", [note("JobBoardNote"), heading(JOB_BOARD.heading)]);

export const careersOffice = section("careersOffice", [
  heading(CAREERS_OFFICE.heading),
  { name: "photo", type: "upload", relationTo: "media", label: "Photograph", admin: { description: "Leave empty to keep the boardroom photograph." } },
  { name: "caption", type: "text", label: "Line under the photograph", defaultValue: CAREERS_OFFICE.caption ?? undefined },
  { name: "text", type: "textarea", label: "Large paragraph", defaultValue: CAREERS_OFFICE.text ?? undefined },
  { name: "detail", type: "textarea", label: "Smaller paragraph", defaultValue: CAREERS_OFFICE.detail ?? undefined },
  { type: "row", fields: [
    { name: "linkLabel", type: "text", label: "Link words", defaultValue: CAREERS_OFFICE.linkLabel ?? undefined },
    { name: "link", type: "text", label: "Link goes to", defaultValue: CAREERS_OFFICE.link ?? undefined },
  ] },
]);

export const careersResume = section("careersResume", [
  heading(CAREERS_RESUME.heading),
  { name: "text", type: "textarea", label: "Paragraph", defaultValue: CAREERS_RESUME.text ?? undefined },
  { type: "row", fields: [
    { name: "buttonLabel", type: "text", required: true, label: "Button words", defaultValue: CAREERS_RESUME.buttonLabel, admin: { description: "Emails the main address in Office details." } },
    { name: "note", type: "text", label: "Line under the address", defaultValue: CAREERS_RESUME.note ?? undefined },
  ] },
]);
