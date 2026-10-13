import { closingDoors, documentCards, faq, logins, text } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /investor-centre, section by section. The document cards are in Website › Documents. */
export const InvestorCentrePage = pageGlobal({
  slug: "investor-centre-page",
  label: "Investor Centre page",
  path: "/investor-centre",
  blocks: [logins, documentCards, closingDoors, faq, text],
});
