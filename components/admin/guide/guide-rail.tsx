"use client";

import { useEffect, useState } from "react";

export type GuidePart = { id: string; title: string; purpose: string };

/**
 * The Guide's contents: every part with what it is for. It stays in view
 * while the page scrolls and lights the part being read, the last one whose
 * heading has passed the top third of the window.
 */
export function GuideRail({ parts }: { parts: readonly GuidePart[] }) {
  const [current, setCurrent] = useState(parts[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight / 3;
      let reading = parts[0]?.id;
      for (const part of parts) {
        const top = document.getElementById(part.id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) reading = part.id;
      }
      setCurrent(reading);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [parts]);

  // The entry a How to use this button opened gets a blue line. :target misses
  // it, because the admin moves between screens without reloading.
  useEffect(() => {
    const mark = () => {
      for (const el of document.querySelectorAll("[data-arrived]")) el.removeAttribute("data-arrived");
      if (location.hash.length > 1) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.setAttribute("data-arrived", "");
    };
    mark();
    window.addEventListener("hashchange", mark);
    return () => window.removeEventListener("hashchange", mark);
  }, []);

  return (
    <nav aria-label="Guide" className="sticky top-20 hidden self-start lg:block">
      <p className="px-3 text-caption font-medium tracking-[.08em] text-muted-foreground uppercase">Contents</p>
      <ol className="mt-2 grid list-none gap-0.5 p-0">
        {parts.map((part) => (
          <li key={part.id}>
            <a
              href={`#${part.id}`}
              aria-current={current === part.id ? "true" : undefined}
              className="block rounded-lg px-3 py-2 text-foreground no-underline hover:bg-hover aria-[current]:bg-muted"
            >
              <span className="block text-[14px] leading-5 font-semibold">{part.title}</span>
              <span className="mt-0.5 block text-[12px] leading-4 text-muted-foreground">{part.purpose}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
