import { closingDoors, coreDiscs, criteria, faq, principles, productHero, riskRings, text } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /our-philosophy, section by section. */
export const OurPhilosophyPage = pageGlobal({
  slug: "our-philosophy-page",
  label: "Our Philosophy page",
  path: "/our-philosophy",
  blocks: [productHero, coreDiscs, principles, criteria, riskRings, closingDoors, faq, text],
});
