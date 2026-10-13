"use client";

import { useEffect, useState } from "react";
import RecordSection from "@/components/fact-sections/record-section";
import { COLUMN } from "@/components/hero/editorial";
import LitRows from "@/components/motion/lit-rows";
import { AIF_NAMES } from "@/lib/performance";
import type { PmsFigures } from "@/lib/site/tokens";

/** What the fact sheet screen posts: the product kind and the figures as typed. */
export type FiguresMessage = { source: "mb-figures"; kind: "pms" | "aif"; figures: PmsFigures };

const isFiguresMessage = (value: unknown): value is FiguresMessage =>
  typeof value === "object" && value !== null && (value as FiguresMessage).source === "mb-figures";

/**
 * Renders the returns graphs a product's numbers feed, as visitors see them:
 * the homepage Performance section for PMS (discs and lit rows), the lit rows
 * for an AIF scheme. Waits for the first message; the parent re-posts on
 * every keystroke.
 */
export function FiguresPreview() {
  const [message, setMessage] = useState<FiguresMessage | null>(null);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && isFiguresMessage(event.data)) setMessage(event.data);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ source: "mb-figures-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  if (!message) return null;
  if (message.kind === "pms") return <RecordSection figures={message.figures} />;
  return (
    <section className="bg-white py-[100px] text-black">
      <div className={COLUMN}>
        <LitRows rows={message.figures.rows.filter((row) => row.ours !== null || row.benchmark !== null)} names={AIF_NAMES} />
      </div>
    </section>
  );
}
