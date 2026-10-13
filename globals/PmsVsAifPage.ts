import { closingDoors, comparison, explanation, faq, productHero, text } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /pms-vs-aif, section by section. PMS and AIF always sit side by side. */
export const PmsVsAifPage = pageGlobal({
  slug: "pms-vs-aif-page",
  label: "PMS vs AIF page",
  path: "/pms-vs-aif",
  blocks: [productHero, comparison, explanation, closingDoors, faq, text],
});
