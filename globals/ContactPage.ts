import { enquiry, faq, office, text } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /contact, section by section. Phone, email, desks and the office are in Website › Office details. */
export const ContactPage = pageGlobal({
  slug: "contact-page",
  label: "Contact page",
  path: "/contact",
  blocks: [enquiry, office, faq, text],
});
