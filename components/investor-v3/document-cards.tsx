"use client";

import { useShown } from "@/components/about-v2/shared";
import { type LineArt, LineArtFigure } from "@/components/drawing/line-art";
import { BODY, COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { DOCUMENT_GROUPS, type DocumentGlyph, INVESTOR_LOREM, type InvestorDocument, NOT_YET_PUBLISHED } from "@/lib/investor-centre";

/*
 * Documents (content plan §12: "simple document cards with clear titles,
 * dates and view/download buttons") as study 04's line cards: one card per
 * document under its group, a title, its date, a centred line drawing with
 * one orange element (components/drawing/line-art.tsx), and the link at the
 * bottom left with 04's small square. Until the client supplies a file, the
 * card says so instead of linking.
 */

const DOCUMENT_ART: Record<DocumentGlyph, LineArt> = {
  charter: "rules",
  disclosures: "fan",
  risk: "burst",
  policies: "cylinder",
  complaints: "gather",
  grievance: "exit",
  scores: "burst",
  odr: "fan",
  forms: "rules",
  pms: "distribute",
  aif: "gather",
};

function DocumentCard({ doc, on, delay }: { doc: InvestorDocument; on: boolean; delay: number }) {
  return (
    <li id={doc.id} className="flex min-h-[300px] scroll-mt-[120px] flex-col rounded-[6px] bg-white p-[22px] ring-1 ring-black/[.06]" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(18px)", transition: `opacity 500ms cubic-bezier(.23,1,.32,1) ${delay}ms, transform 700ms cubic-bezier(.23,1,.32,1) ${delay}ms` }}>
      <h4 className="m-0 font-serif text-[clamp(1.25rem,1.05rem+.5vw,1.5rem)] leading-[1.15] font-normal">{doc.title}</h4>
      <span className={`${EYEBROW} mt-[8px] text-black/60 tabular-nums`}>{doc.date ?? "Date to follow"}</span>
      <div className="flex flex-1 items-center justify-center py-6">
        <LineArtFigure art={DOCUMENT_ART[doc.glyph]} on={on} delay={delay + 200} className="w-[min(100%,108px)]" />
      </div>
      {doc.href ? (
        <a href={doc.href} className="inline-flex items-center gap-[10px] text-[14px] font-medium text-black no-underline underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
          View<span className="sr-only"> {doc.title}</span>
          <span aria-hidden="true" className="h-[9px] w-[9px] border border-current" />
        </a>
      ) : (
        <span className="inline-flex items-center gap-[10px] text-[13px] text-black/60">
          {NOT_YET_PUBLISHED}
          <span aria-hidden="true" className="h-[9px] w-[9px] border border-dashed border-current" />
        </span>
      )}
    </li>
  );
}

function Group({ group }: { group: (typeof DOCUMENT_GROUPS)[number] }) {
  const { ref, shown } = useShown<HTMLDivElement>(0.2);
  return (
    <div ref={ref} id={group.id} className="grid scroll-mt-[120px] grid-cols-1 gap-6 border-t border-black/15 pt-8 lg:grid-cols-12 lg:gap-x-6">
      <div className="lg:col-span-3">
        <h3 className=" font-serif text-[clamp(1.6rem,1.3rem+.8vw,2.1rem)] leading-[1.1] font-normal">{group.heading}</h3>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
        {group.documents.map((doc, order) => (
          <DocumentCard key={doc.id} doc={doc} on={shown} delay={order * 90} />
        ))}
      </ul>
    </div>
  );
}

export function DocumentCards() {
  return (
    <section id="documents" aria-labelledby="documents-heading" className="scroll-mt-[96px] bg-[#F6F6F6] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <h2 id="documents-heading" className={`m-0 ${SUBHEAD}`}>
            Documents
          </h2>
          <p className={`text-black/70 ${BODY}`}>{INVESTOR_LOREM.long}</p>
        </div>
        <div className="mt-[64px] flex flex-col gap-[56px]">
          {DOCUMENT_GROUPS.map((group) => (
            <Group key={group.id} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
