/**
 * The site's editable pages, in the menu's order: their key in /admin URLs,
 * their record (globals/*Page.ts), the name staff see, their address, and a
 * still of the page's top (public/site-pages/, taken 2026-10-13; retake with
 * the section pictures when a layout changes). Read by the Website screen,
 * the Guide and the editor's breadcrumb. Safe on the client.
 */
export const SITE_PAGES = [
  { key: "home", slug: "home-page", name: "Home page", path: "/" },
  { key: "pms", slug: "pms-page", name: "PMS page", path: "/pms" },
  { key: "aif", slug: "aif-page", name: "AIF page", path: "/aif" },
  { key: "pms-vs-aif", slug: "pms-vs-aif-page", name: "PMS vs AIF page", path: "/pms-vs-aif" },
  { key: "our-philosophy", slug: "our-philosophy-page", name: "Our Philosophy page", path: "/our-philosophy" },
  { key: "about", slug: "about-page", name: "About page", path: "/about" },
  { key: "case-studies", slug: "case-studies-page", name: "Case Studies page", path: "/case-studies" },
  { key: "picks", slug: "picks-page", name: "Multibagger Picks page", path: "/multi-bagger-picks" },
  { key: "investor-centre", slug: "investor-centre-page", name: "Investor Centre page", path: "/investor-centre" },
  { key: "contact", slug: "contact-page", name: "Contact page", path: "/contact" },
  { key: "careers", slug: "careers-page", name: "Careers page", path: "/careers" },
] as const;

export type SitePage = (typeof SITE_PAGES)[number];

/** The still of a page's top. */
export const pagePicture = (page: SitePage) => `/site-pages/${page.key}.jpg`;

/** A page's editor, opened on section `index` when given. */
export const editorHref = (page: SitePage, index?: number) => `/admin/globals/${page.slug}${index === undefined ? "" : `?section=${index}`}`;
