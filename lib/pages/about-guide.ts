import type { GuideSection } from "@/lib/pages/home-guide";
import type { SectionKind } from "@/lib/pages/sections";

/*
 * The Guide's "what changes what" for /about. Pictures are the sections at
 * 1440px wide (public/site-sections/guide/), taken 2026-10-13. Everything is
 * in Website › About page unless a part says otherwise.
 */

export const ABOUT_GUIDE: Partial<Record<SectionKind, GuideSection>> = {
  aboutHero: {
    picture: "/site-sections/guide/about-hero.png",
    parts: [
      { label: "Small label and heading", where: "Heading, text and team photograph › Heading" },
      { label: "Paragraphs", where: "Heading, text and team photograph › Paragraphs beside the heading" },
      { label: "Team photograph", where: "Heading, text and team photograph › Photograph. Upload a new one, or leave it empty to keep this one." },
    ],
  },
  founderProfile: {
    picture: "/site-sections/guide/founder-profile.png",
    parts: [
      { label: "Name and the line under it", where: "Founder profile › Name, and Line under the name" },
      { label: "Portrait", where: "Founder profile › Portrait" },
      { label: "Qualifications", where: "Founder profile › Qualifications. Remove them all to show none." },
      { label: "The years figure", where: "Founder profile › Years counted up, and the words beside it. Empty hides it." },
      { label: "Points", where: "Founder profile › Points" },
    ],
  },
  teamCarousel: {
    picture: "/site-sections/guide/team-carousel.png",
    parts: [
      { label: "The people", where: "Website › Team: each person's name, role, portrait, lines and LinkedIn. Drag a row to change the order." },
      { label: "Heading and button", where: "Team carousel › Heading, and the button's words and link" },
    ],
  },
  groupAreas: {
    picture: "/site-sections/guide/group-areas.png",
    note: "Each area keeps its drawing, so there are always four.",
    parts: [
      { label: "Small label", where: "Four group areas › Small label above" },
      { label: "The four names", where: "Four group areas › The four areas" },
    ],
  },
  recognition: {
    picture: "/site-sections/guide/recognition.png",
    parts: [
      { label: "Small label and heading", where: "Rankings › Heading" },
      { label: "Date pill and the line under the lists", where: "Rankings › Date pill, and Line under the lists", gate: "compliance" },
      { label: "The lists", where: "Rankings › Ranking lists: Moneybee's rank, the period, its place, and every return in order. The bars redraw from them.", gate: "compliance" },
    ],
  },
  timeline: {
    picture: "/site-sections/guide/timeline.png",
    parts: [{ label: "The dates", where: "Timeline › Dates: two to four, each a date and what happened" }],
  },
  story: {
    picture: "/site-sections/guide/story.png",
    note: "The two drawings, nectar into honey and money into wealth, stay as they are.",
    parts: [
      { label: "Heading", where: "Story with drawings › Heading" },
      { label: "The quote", where: "Story with drawings › The quote" },
    ],
  },
  closingDoors: {
    picture: "/site-sections/guide/closing-doors.png",
    parts: [{ label: "Client Login and Get Started", where: "The same two cards end most pages. Your web team changes their words for now.", gate: "fixed" }],
  },
};
