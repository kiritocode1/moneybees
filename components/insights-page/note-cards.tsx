"use client";

import { useShown } from "@/components/about-v2/shared";
import { LineArtFigure } from "@/components/drawing/line-art";
import { COLUMN, EYEBROW } from "@/components/hero/tokens";
import { NOTES } from "@/lib/insights-page";

/*
 * /insights as study 04's line cards (reference/visual-language/04), the
 * same card /careers uses for its openings: a kind, a title, one line, a
 * centred line drawing with one orange element, and the date at the bottom
 * left where 04 puts its link. Every card is a placeholder until the client
 * supplies letters and notes, so none of them links anywhere yet.
 */
export function NoteCards() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.15);
  return (
    <section id="notes" aria-label="Insights" className="scroll-mt-[96px] bg-white text-black">
      <div ref={ref} className={`${COLUMN} grid grid-cols-1 gap-[14px] py-[120px] max-md:py-[80px] sm:grid-cols-2 lg:grid-cols-3`}>
        {NOTES.map((note, index) => (
          <article
            key={note.id}
            className="flex min-h-[400px] flex-col rounded-[6px] bg-[#F6F6F6] p-[26px] max-md:min-h-[340px]"
            style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(24px)", transition: `opacity ${t(500, index * 80)}, transform ${t(700, index * 80)}` }}
          >
            <span className={`${EYEBROW} text-black/60`}>{note.kind}</span>
            <h2 className="mt-[12px] font-serif text-[clamp(1.5rem,1.15rem+.7vw,1.9rem)] leading-[1.1] font-normal">{note.title}</h2>
            <p className="mt-[8px] text-[15px] leading-[1.5] text-black/65">{note.text}</p>
            <div className="flex flex-1 items-center justify-center py-8">
              <LineArtFigure art={note.art} on={shown} delay={200 + index * 80} className="w-[min(100%,150px)]" />
            </div>
            <span className={`${EYEBROW} text-black/60`}>{note.date}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
