import { caseStudiesList, caseTimeline, closingDoors, faq, productHero, text } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /case-studies, section by section. The companies are in Website › Case studies. */
export const CaseStudiesPage = pageGlobal({
  slug: "case-studies-page",
  label: "Case Studies page",
  path: "/case-studies",
  blocks: [productHero, caseStudiesList, caseTimeline, closingDoors, faq, text],
});
