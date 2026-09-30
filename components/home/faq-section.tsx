"use client";

import { useId, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { FAQS } from "@/lib/insights";

export type Product = "pms" | "aif";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

/**
 * FAQs as an accordion, one open at a time. The answers come from
 * lib/insights.ts; a product page passes `product` to show only its questions.
 * A closed answer is inert, so it is out of the tab order and the
 * accessibility tree while it is collapsed to zero height.
 */
export function FaqSection({ product }: { product?: Product }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  const questions = FAQS.filter(([, , scope]) => !product || scope === "both" || scope === product);
  return (
    <section id="faqs" aria-labelledby="faqs-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-[.8fr_1.2fr] gap-12 py-[120px] max-[900px]:grid-cols-1 max-[600px]:py-[80px]`}>
        <div>
          <BracketLabel>FAQs</BracketLabel>
          <h2 id="faqs-heading" className={`mt-[18px] ${SUBHEAD}`}>
            Questions we are often asked
          </h2>
        </div>
        <div className="border-t border-t-black">
          {questions.map(([question, answer], index) => {
            const expanded = open === index;
            const buttonId = `${base}-q${index}`;
            const panelId = `${base}-a${index}`;
            return (
              <div key={question} className="border-b border-b-[rgba(0,0,0,.13)]">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : index)}
                    className={`flex w-full items-center justify-between gap-[24px] py-[22px] text-left text-[clamp(1.05rem,1.4vw,1.25rem)] font-normal transition-colors duration-200 hover:text-black/70 ${FOCUS}`}
                  >
                    {question}
                    {/* Plus to minus: the vertical bar turns flat onto the horizontal one. */}
                    <span
                      aria-hidden="true"
                      className={`relative h-[14px] w-[14px] shrink-0 before:absolute before:top-1/2 before:left-0 before:h-[2px] before:w-full before:-translate-y-1/2 before:bg-[#F6A11A] after:absolute after:top-0 after:left-1/2 after:h-full after:w-[2px] after:-translate-x-1/2 after:bg-[#F6A11A] after:transition-transform after:duration-200 after:ease-[cubic-bezier(.23,1,.32,1)] ${expanded ? "after:rotate-90" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!expanded}
                  className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none"
                  style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[60ch] pr-[40px] pb-[24px] text-[16px] leading-[1.6] text-black/70">{answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
