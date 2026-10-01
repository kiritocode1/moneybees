"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { leavesPage, PAGE_TRANSITION_TYPE } from "./routes";

/** True while a view transition is running. */
function isTransitionRunning(): boolean {
  try {
    return document.documentElement.matches(":active-view-transition");
  } catch {
    return false;
  }
}

/**
 * next/link that asks for the page transition when it points at another page
 * of the site. Anchors on the current page, external, mail and phone hrefs
 * pass straight through. A press while a transition is running is
 * ignored, as Taxi refuses a second navigation on Tres Mares; the pointer is
 * already blocked by the ::view-transition overlay, so this catches the keyboard.
 */
export default function TransitionLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const types = leavesPage(href, pathname) ? [PAGE_TRANSITION_TYPE] : undefined;
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isTransitionRunning()) event.preventDefault();
    onClick?.(event);
  };
  return <Link href={href} transitionTypes={types} onClick={handleClick} {...props} />;
}
