"use client";

/// <reference types="react/canary" />
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useLayoutEffect, ViewTransition } from "react";
import { isTransitionRoute, PAGE_TRANSITION_TYPE } from "./routes";
import "./page-transition.css";

type AppRouterInstance = ReturnType<typeof useRouter>;

/** Wrappers currently mounted. Back and forward only slide when leaving a page that has one. */
let mountedCount = 0;
let popstateInstalled = false;
/** The App Router of the mounted page, for back and forward. */
let currentRouter: AppRouterInstance | null = null;
/** The mounted page's path; back or forward to the same path is an anchor move and does not slide. */
let currentPathname: string | null = null;
/** Ends the scroll hold set up by onPopState; the entering page calls it. */
let releaseScrollHold: (() => void) | null = null;

/**
 * Back and forward. Next's own traverse commits without starting a view
 * transition (measured: the swap commits but document.startViewTransition is
 * never called), so when both pages take part this capture listener keeps the
 * popstate from Next and replays the move as router.replace to the URL the
 * browser already shows, tagged with the transition type. replace rewrites the
 * current entry in place, so the history stack and forward button are
 * unchanged, and Next scrolls the new page to the top as on a push.
 * Installed once; it ignores every other navigation.
 */
function onPopState(event: PopStateEvent) {
  const router = currentRouter;
  if (mountedCount === 0 || !router || !isTransitionRoute(window.location.pathname) || window.location.pathname === currentPathname) return;
  event.stopImmediatePropagation();
  // The browser restores the destination's saved offset onto the page still
  // showing, which would jump the old page before its snapshot. Hold it where
  // the reader left it until the new page mounts.
  releaseScrollHold?.();
  // Checked on every scroll event and every frame before paint.
  const heldY = window.scrollY;
  const hold = () => {
    if (window.scrollY !== heldY) window.scrollTo(0, heldY);
  };
  let frame = 0;
  const holdEachFrame = () => {
    hold();
    frame = requestAnimationFrame(holdEachFrame);
  };
  frame = requestAnimationFrame(holdEachFrame);
  const safety = window.setTimeout(() => releaseScrollHold?.(), 3000);
  window.addEventListener("scroll", hold);
  releaseScrollHold = () => {
    window.removeEventListener("scroll", hold);
    cancelAnimationFrame(frame);
    window.clearTimeout(safety);
    releaseScrollHold = null;
  };
  const { pathname, search, hash } = window.location;
  // One task later, outside the popstate: React renders transitions started
  // inside popstate synchronously.
  window.setTimeout(() => router.replace(`${pathname}${search}${hash}`, { transitionTypes: [PAGE_TRANSITION_TYPE] }), 0);
}

/**
 * The Tres Mares page transition (reference/page-transitions/NOTES.md), on
 * React's <ViewTransition>. Wrap a page's whole tree, site header included:
 * the header lives inside each page, so it travels with its page as it does on
 * Tres Mares. The boundary exits with the old route and enters with the new
 * one; the animation itself is CSS in page-transition.css.
 *
 * The slide only runs for navigations tagged with PAGE_TRANSITION_TYPE:
 * <TransitionLink> tags clicks, the popstate listener tags back and forward.
 * Any other navigation resolves to "none" and swaps as before.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Layout effects run inside React's view-transition update, after the old
  // snapshot and before Next scrolls the new page to the top.
  useLayoutEffect(() => {
    releaseScrollHold?.();
  }, []);

  useEffect(() => {
    currentPathname = pathname;
  }, [pathname]);

  useEffect(() => {
    mountedCount++;
    currentRouter = router;
    if (!popstateInstalled) {
      popstateInstalled = true;
      window.addEventListener("popstate", onPopState, { capture: true });
    }
    return () => {
      mountedCount--;
    };
  }, [router]);

  return (
    <ViewTransition
      enter={{ [PAGE_TRANSITION_TYPE]: "mb-page-in", default: "none" }}
      exit={{ [PAGE_TRANSITION_TYPE]: "mb-page-out", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
