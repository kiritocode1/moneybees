"use client";

import { useSyncExternalStore } from "react";

const never = () => () => {};

const onResize = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

/**
 * True when this page is loaded inside /admin's preview pane, which frames
 * the site from the same origin. False on the server and in a normal tab.
 */
export function useInAdminPreview() {
  return useSyncExternalStore(
    never,
    () => window.parent !== window && window.parent.location.origin === window.location.origin,
    () => false,
  );
}

/** This site's origin once on the client; empty on the server. */
export function useOrigin() {
  return useSyncExternalStore(never, () => window.location.origin, () => "");
}

/**
 * How much /admin's preview shrinks this page: 0.5 when it is zoomed to 50%.
 * The frame's width on screen over the page's own width; 1 outside a frame.
 */
export function usePreviewScale() {
  return useSyncExternalStore(
    onResize,
    () => {
      const frame = window.frameElement?.getBoundingClientRect().width;
      return frame && window.innerWidth ? Math.round((frame / window.innerWidth) * 100) / 100 : 1;
    },
    () => 1,
  );
}
