"use client";

import { useShown } from "@/components/about-v2/shared";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BUTTON, COLUMN, SUBHEAD } from "@/components/hero/tokens";
import Link from "@/components/transition/transition-link";
import { AIF_KEY_TERMS, type KeyTermsContent } from "@/lib/pages/aif-content";
import { TermFigure } from "./term-figures";

/*
 * "Key Terms", content plan §4, as the line cards of reference/visual-language/04
 * on black: one card per term, a white line drawing with exactly one orange
 * element, the term's label and value from lib/aif-v2.ts. The cards rise in
 * turn and their drawings wipe on.
 *
 * Compliance: the plan asks that terms, tax treatment, eligibility, fees and
 * regulatory statements be checked against the latest approved fund documents
 * before publication. The words are edited in /admin.
 */

export function KeyTermsSection({ content = AIF_KEY_TERMS }: { content?: KeyTermsContent }) {
  const button = content.button?.label && content.button.link ? content.button : null;
  const { ref, shown } = useShown<HTMLDivElement>(0.25);
  return (
    <section id="key-terms" aria-labelledby="key-terms-heading" className="scroll-mt-[96px] bg-black text-white">
      <div className={`${COLUMN} py-[140px] max-md:py-[88px]`}>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            {content.label ? <BracketLabel>{content.label}</BracketLabel> : null}
            <h2 id="key-terms-heading" className={`${content.label ? "mt-[18px] " : ""}${SUBHEAD}`}>
              {content.heading}
            </h2>
          </div>
          {button ? (
            <Link href={button.link ?? ""} className={`${BUTTON} bg-[#F6A11A] text-black hover:bg-white focus-visible:outline-white`}>
              {button.label}
            </Link>
          ) : null}
        </div>
        <div ref={ref} className="mt-[64px] grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-5">
          {(content.terms ?? []).map((term, index) => (
            <article
              key={index}
              className="flex min-h-[360px] flex-col rounded-[6px] bg-[#141414] p-[26px] ring-1 ring-white/[.08] transition-[opacity,transform] duration-700 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none max-lg:min-h-[300px]"
              style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(28px)", transitionDelay: `${index * 90}ms` }}
            >
              <h3 className=" font-serif text-[clamp(1.45rem,1.15rem+.5vw,1.75rem)] leading-[1.1] font-semibold">{term.label}</h3>
              <p className="mt-[10px] text-[15px] leading-[1.45] text-white/70">{term.value}</p>
              <div className="mt-auto flex justify-center pt-8">
                <div className="w-[min(100%,180px)]">
                  <TermFigure glyph={term.drawing} on={shown} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
