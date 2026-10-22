import type { GuideSection } from "@/lib/pages/home-guide";
import type { SectionKind } from "@/lib/pages/sections";

/*
 * The Guide's "what changes what" for /pms. Pictures are the sections at
 * 1440px wide (public/site-sections/guide/), taken 2026-10-13; the parts are
 * listed without numbered markers. Everything is in Website › PMS page unless
 * a part says otherwise.
 */

export const PMS_GUIDE: Partial<Record<SectionKind, GuideSection>> = {
  productHero: {
    picture: "/site-sections/guide/product-hero.png",
    note: "Every inside page opens on this same layout; only the words and the drawing change.",
    parts: [
      { label: "Title", where: "Page top › Title, first and second line. The second line sits one step to the right." },
      { label: "Sentence under the title", where: "Page top › Sentence under the title" },
      { label: "Buttons", where: "Page top › Buttons: up to two, orange or outlined" },
      { label: "Drawing", where: "Page top › Drawing: pick one of the site's page drawings" },
      { label: "Figures along the bottom", where: "Page top › Figures along the bottom: three to six" },
    ],
  },
  pmsPerformance: {
    picture: "/site-sections/guide/pms-performance.png",
    parts: [
      { label: "Small label, heading and paragraph", where: "Returns chart and table › Heading and Paragraph" },
      { label: "The date pill", where: "The latest PMS fact sheet's month-end date", gate: "factSheet" },
      { label: "Bars and the full table", where: "Fact sheets › Returns: the bars show 1, 3 and 5 years and since inception; the table shows every period", gate: "factSheet" },
      { label: "Line under the table", where: "Returns chart and table › Line under the table" },
      { label: "Method and disclaimer", where: "Returns chart and table › Method and disclaimer. {asOfDay} prints the fact sheet's date.", gate: "compliance" },
    ],
  },
  wealthGrowth: {
    picture: "/site-sections/guide/wealth-growth.png",
    parts: [
      { label: "Small label, heading and paragraph", where: "Growth of Rs. 10 Lakh › Heading and Paragraph" },
      { label: "The discs and their values", where: "Fact sheets › Rs. 10 Lakh grew to. The discs resize to the numbers.", gate: "factSheet" },
    ],
  },
  whyPms: {
    picture: "/site-sections/guide/why-pms.png",
    note: "On a computer the points scroll past and the box on the right shows each point's drawing and line.",
    parts: [
      { label: "Heading and paragraph", where: "Why points with drawings › Heading and Paragraph beside the heading" },
      { label: "Each point", where: "Why points with drawings › Points: the point, its drawing and the line under it. Three to nine." },
    ],
  },
  philosophy: {
    picture: "/site-sections/guide/philosophy.png",
    parts: [
      { label: "Heading", where: "Three words and points › Heading" },
      { label: "The three words", where: "Three words and points › The three words. Each keeps its drawing, in order." },
      { label: "The points below", where: "Three words and points › Points" },
    ],
  },
  selection: {
    picture: "/site-sections/guide/selection.png",
    note: "The drawing narrows the lines once at each step, so there are always four.",
    parts: [
      { label: "Heading", where: "Four selection steps › Heading" },
      { label: "The four steps", where: "Four selection steps › The four steps: each step and the line under it" },
    ],
  },
  portfolioApproach: {
    picture: "/site-sections/guide/portfolio-approach.png",
    parts: [
      { label: "Heading", where: "Portfolio rules › Heading" },
      { label: "The ring", where: "Portfolio rules › Sector cap (%) and its line. The ring lights that share." },
      { label: "The stock count", where: "Portfolio rules › Stocks, from and to, and their line" },
      { label: "The three rules below", where: "Portfolio rules › The three rules below" },
    ],
  },
  risks: {
    picture: "/site-sections/guide/risks.png",
    note: "One risk per block of the drawing, from the bottom block up, so there are always four.",
    parts: [
      { label: "Heading", where: "Four risks › Heading" },
      { label: "Each risk", where: "Four risks › The four risks: the risk and the line under it" },
    ],
  },
  closingDoors: {
    picture: "/site-sections/guide/closing-doors.png",
    parts: [{ label: "Client Login and Get Started", where: "The same two cards end most pages. Your web team changes their words for now.", gate: "fixed" }],
  },
};
