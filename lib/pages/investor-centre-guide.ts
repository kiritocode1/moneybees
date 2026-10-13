import type { GuideSection } from "@/lib/pages/home-guide";
import type { SectionKind } from "@/lib/pages/sections";

/*
 * The Guide's "what changes what" for /investor-centre. Pictures are the
 * sections at 1440px wide (public/site-sections/guide/), taken 2026-10-13.
 * Everything is in Website › Investor Centre page unless a part says otherwise.
 */

export const INVESTOR_CENTRE_GUIDE: Partial<Record<SectionKind, GuideSection>> = {
  logins: {
    picture: "/site-sections/guide/logins.png",
    parts: [
      { label: "Heading", where: "Logins › Heading" },
      { label: "Client Login and Distributor Login", where: "The same login card ends most pages, so their words stay as they are. Your web team changes them for now.", gate: "fixed" },
    ],
  },
  documentCards: {
    picture: "/site-sections/guide/document-cards.png",
    note: "A card with a file or web address says View; without either it says Available on request. A group with no documents is left out.",
    parts: [
      { label: "Heading and paragraph", where: "Documents › Heading, and Paragraph beside the heading" },
      { label: "The four groups", where: "Investor Charter, Disclosures, Grievance Redressal, and Forms & Documents. The menu and the footer link to them, so they stay.", gate: "fixed" },
      { label: "Each card", where: "Website › Documents: its title, group, file or web address, date and drawing. Drag a row to change the order." },
    ],
  },
  closingDoors: {
    picture: "/site-sections/guide/closing-doors.png",
    note: "This page already opens on the logins, so only the Get Started card shows here.",
    parts: [{ label: "Get Started", where: "The same card ends most pages. Your web team changes its words for now.", gate: "fixed" }],
  },
};
