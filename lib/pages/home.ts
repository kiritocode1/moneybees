import { HOME_SECTIONS } from "./home-content";
import { type PageSection, pageSections } from "./load";

export type { PageSection };

/** The Home page's sections from /admin (lib/pages/load.ts). */
export const homeSections = (draft: boolean) => pageSections("home-page", draft, HOME_SECTIONS);
