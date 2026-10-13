import { closingDoors, faq, philosophy, pmsPerformance, portfolioApproach, productHero, risks, selection, text, wealthGrowth, whyPms } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /pms, section by section. Its returns, as-of date and growth of Rs. 1 Mn come from the latest PMS fact sheet. */
export const PmsPage = pageGlobal({
  slug: "pms-page",
  label: "PMS page",
  path: "/pms",
  blocks: [productHero, pmsPerformance, wealthGrowth, whyPms, philosophy, selection, portfolioApproach, risks, closingDoors, faq, text],
});
