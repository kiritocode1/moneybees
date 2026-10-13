import type { GuideSection } from "@/lib/pages/home-guide";
import type { SectionKind } from "@/lib/pages/sections";

/*
 * The Guide's "what changes what" for /contact. Pictures are the sections at
 * 1440px wide (public/site-sections/guide/), taken 2026-10-13. Everything is
 * in Website › Contact page unless a part says otherwise.
 */

export const CONTACT_GUIDE: Partial<Record<SectionKind, GuideSection>> = {
  enquiry: {
    picture: "/site-sections/guide/enquiry.png",
    parts: [
      { label: "Small label and heading", where: "Enquiry form › Small label above, and Heading" },
      { label: "Phone and email", where: "Website › Office details: the first phone number and the main email" },
      { label: "The AIF desks", where: "Website › Office details › Desks. Enquiry form › Small label above the desks changes the words over them." },
      { label: "The form and its four topics", where: "The enquiry desk sorts every enquiry by its topic, so the topics and their fields stay as they are. Your web team changes them.", gate: "fixed" },
    ],
  },
  office: {
    picture: "/site-sections/guide/office.png",
    parts: [{ label: "Office name, address and map", where: "Website › Office details: the office name, both address lines, and the map pin. The footer shows the same." }],
  },
};
