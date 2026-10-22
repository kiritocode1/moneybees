import { faq, founder, getStarted, hero, record, returns, text, twoWays } from "./pages/blocks";
import { pageGlobal } from "./pages/page-global";

/** The homepage, section by section (globals/pages/page-global.ts says how editing works). */
export const HomePage = pageGlobal({ slug: "home-page", label: "Home page", path: "/", blocks: [hero, record, returns, twoWays, founder, getStarted, faq, text] });
