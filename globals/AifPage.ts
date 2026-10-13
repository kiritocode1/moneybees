import { aifPerformance, approachWheel, closingDoors, faq, keyTerms, opportunity, pooling, productHero, structure, text } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /aif, section by section. The returns come from Flyingbee's fact sheets once they may be shown. */
export const AifPage = pageGlobal({
  slug: "aif-page",
  label: "AIF page",
  path: "/aif",
  blocks: [productHero, aifPerformance, opportunity, pooling, structure, approachWheel, keyTerms, closingDoors, faq, text],
});
