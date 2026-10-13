import { closingDoors, faq, picks, productHero, text } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /multi-bagger-picks, section by section. The tiers and stocks are compliance's. */
export const PicksPage = pageGlobal({
  slug: "picks-page",
  label: "Multibagger Picks page",
  path: "/multi-bagger-picks",
  blocks: [productHero, picks, closingDoors, faq, text],
});
