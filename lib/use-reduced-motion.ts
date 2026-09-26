import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Whether the viewer asked for reduced motion. Use this instead of Motion's
 * `useReducedMotion`, which reports the real setting on the very first client
 * render: the server cannot know it, so anything rendered from it failed to
 * hydrate. This reads `false` on the server and during hydration, then
 * re-renders with the real value.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
