import { aboutHero, closingDoors, faq, founderProfile, groupAreas, recognition, story, teamCarousel, text, timeline } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** /about, section by section. The people in the carousel are in Website › Team. */
export const AboutPage = pageGlobal({
  slug: "about-page",
  label: "About page",
  path: "/about",
  blocks: [aboutHero, founderProfile, teamCarousel, groupAreas, recognition, timeline, story, closingDoors, faq, text],
});
