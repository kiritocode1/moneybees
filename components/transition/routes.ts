/**
 * Which navigations take part in the page transition: every internal page.
 * Only a navigation whose source and destination both render <PageTransition>
 * animates, and app/template.tsx renders it around every page. Anchors on the
 * same page, external links, mail and phone links never animate.
 */

/** The React transition type that switches the slide on (see page-transition.css). */
export const PAGE_TRANSITION_TYPE = "mb-page";

/** The path part of an internal href, or null for anything that leaves the site or stays on the page. */
function internalPath(href: string): string | null {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  return href.split(/[?#]/)[0] || "/";
}

export function isTransitionRoute(href: string): boolean {
  return internalPath(href) !== null;
}

/** True when the href points at a different page than `pathname`; a link to the current page only scrolls or swaps its query. */
export function leavesPage(href: string, pathname: string): boolean {
  const path = internalPath(href);
  return path !== null && path.replace(/\/$/, "") !== pathname.replace(/\/$/, "");
}
