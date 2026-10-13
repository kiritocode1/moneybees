import { careersIntro, careersOffice, careersResume, faq, jobBoard, text } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /careers, section by section. The roles are in Website › Openings. */
export const CareersPage = pageGlobal({
  slug: "careers-page",
  label: "Careers page",
  path: "/careers",
  blocks: [careersIntro, jobBoard, careersOffice, careersResume, faq, text],
});
