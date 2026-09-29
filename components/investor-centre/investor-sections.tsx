"use client";

import { useInView } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import { DATE_PLACEHOLDER, DOCUMENTS, INVESTOR_CENTRE, INVESTOR_LOREM, LOGINS } from "@/lib/investor-centre";
import { ClientGlyph, DistributorGlyph, DocumentGlyph, GatherGlyph } from "./glyphs";

/*
 * /investor-centre, content plan §12: the two logins kept apart, then every
 * listed section as a document card with its title, date, and view and
 * download buttons. No legal text on the page itself.
 */

const number = (index: number) => String(index + 1).padStart(2, "0");
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7A11A]";
const PILL = `inline-flex items-center justify-center gap-[8px] rounded-full px-[18px] py-[9px] text-[14px] font-medium no-underline transition-colors ${FOCUS}`;

function useShown<T extends Element>(amount = 0.45) {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { once: true, amount });
  return { ref, shown };
}

function Delayed({ on, delay, children }: { on: boolean; delay: number; children: (ready: boolean) => ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [on, delay]);
  return children(ready);
}

export function InvestorHero() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setOn(true), 250);
    return () => clearTimeout(timer);
  }, []);
  return (
    <section aria-labelledby="investor-heading" className="bg-white text-black">
      <div className={`${COLUMN} pt-[150px] pb-[96px] md:pt-[200px] max-md:pb-[64px]`}>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20">
          <div>
            <Rise>
              <BracketLabel>Investors</BracketLabel>
            </Rise>
            <Rise delay={0.05}>
              <h1 id="investor-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
                {INVESTOR_CENTRE.heading}
              </h1>
            </Rise>
            <Rise delay={0.12}>
              <p className={`mt-8 max-w-[520px] text-black/70 ${BODY}`}>{INVESTOR_CENTRE.lead}</p>
            </Rise>
            <Rise delay={0.18}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#logins" className={`${PILL} bg-[#F7A11A] text-black hover:bg-black hover:text-white`}>
                  {LOGINS.client.name}
                </a>
                <a href="#logins" className={`${PILL} border border-black/25 text-black hover:border-black`}>
                  {LOGINS.distributor.name}
                </a>
              </div>
            </Rise>
          </div>
          <div className="mx-auto w-full max-w-[540px]">
            <GatherGlyph on={on} />
          </div>
        </div>
        <Rise delay={0.25}>
          <nav aria-label="Documents on this page" className="mt-[72px] max-md:mt-[48px]">
            <ol className="m-0 grid list-none grid-cols-1 gap-x-8 border-t border-black p-0 sm:grid-cols-2 lg:grid-cols-4">
              {DOCUMENTS.map((doc, index) => (
                <li key={doc.id} className="border-b border-black/15">
                  <a href={`#${doc.id}`} className="group flex items-baseline gap-[14px] py-[12px] text-black no-underline">
                    <span className="w-[26px] text-[16px] leading-none font-light tracking-[-.04em] text-[#F7A11A] tabular-nums">{number(index)}</span>
                    <span className="text-[15px] text-black/70 transition-colors group-hover:text-black">{doc.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Rise>
      </div>
    </section>
  );
}

/** Client Login on white, Distributor Login on black: two doors, never one. */
export function LoginsSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="logins" aria-label="Logins" className="scroll-mt-[96px] bg-white text-black">
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-t border-black/10 py-[110px] pl-[max(120px,calc((100vw_-_1512px)/2_+_120px))] md:pr-[64px] max-md:px-6 max-md:py-[72px]">
          <BracketLabel>For clients</BracketLabel>
          <h2 className={`mt-[18px] ${SUBHEAD}`}>{LOGINS.client.name}</h2>
          <div className="mt-[36px] max-w-[380px] border-y border-black/10 px-[8%] py-[20px] md:px-0">
            <ClientGlyph on={shown} />
          </div>
          <p className="mt-[20px] max-w-[440px] text-[15px] leading-[1.55] text-black/65">{LOGINS.client.text}</p>
          <a href={LOGINS.client.href} className={`mt-[28px] ${PILL} bg-[#F7A11A] px-[26px] py-[14px] text-[15px] text-black hover:bg-black hover:text-white`}>
            {LOGINS.client.name}
          </a>
        </div>
        <div className="bg-black py-[110px] pr-[max(120px,calc((100vw_-_1512px)/2_+_120px))] text-white md:pl-[64px] max-md:px-6 max-md:py-[72px]">
          <BracketLabel>For distributors</BracketLabel>
          <h2 className={`mt-[18px] ${SUBHEAD}`}>{LOGINS.distributor.name}</h2>
          <div className="mt-[36px] max-w-[380px] border-y border-white/15 px-[8%] py-[20px] md:px-0">
            <Delayed on={shown} delay={400}>
              {(ready) => <DistributorGlyph on={ready} />}
            </Delayed>
          </div>
          <p className="mt-[20px] max-w-[440px] text-[15px] leading-[1.55] text-white/55">{LOGINS.distributor.text}</p>
          <a href={LOGINS.distributor.href} className={`mt-[28px] ${PILL} border border-white/40 px-[26px] py-[14px] text-[15px] text-white hover:border-[#F7A11A] hover:text-[#F7A11A]`}>
            {LOGINS.distributor.name}
          </a>
        </div>
      </div>
    </section>
  );
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 1v7M3 5.5 6 8.5 9 5.5M1.5 11h9" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** One document: its drawing plays when the card comes into view, staggered across a row. */
function DocumentCard({ doc, index }: { doc: (typeof DOCUMENTS)[number]; index: number }) {
  const { ref, shown } = useShown<HTMLElement>(0.4);
  return (
    <article ref={ref} id={doc.id} aria-labelledby={`${doc.id}-title`} className="group flex scroll-mt-[120px] flex-col bg-white p-[24px] max-[600px]:p-[22px]">
      <span className={`${EYEBROW} text-[#F7A11A]`}>{number(index)}</span>
      <div className="mt-[14px] border-b border-black/10 pb-[16px]">
        <div className="mx-auto max-w-[240px] transition-transform duration-300 group-hover:-translate-y-[3px] motion-reduce:transition-none">
          <Delayed on={shown} delay={(index % 4) * 110}>
            {(ready) => <DocumentGlyph kind={doc.glyph} on={ready} />}
          </Delayed>
        </div>
      </div>
      <h3 id={`${doc.id}-title`} className="mt-[18px] font-serif text-[clamp(1.35rem,1.1rem+.5vw,1.65rem)] leading-[1.1] font-normal">
        {doc.title}
      </h3>
      <p className={`mt-[10px] ${EYEBROW} text-black/50`}>Updated {DATE_PLACEHOLDER}</p>
      <div className="mt-auto flex gap-[8px] pt-[22px]">
        <a href="#" aria-label={`View ${doc.title}`} className={`${PILL} bg-black text-white hover:bg-[#F7A11A] hover:text-black`}>
          View
        </a>
        <a href="#" aria-label={`Download ${doc.title}`} className={`${PILL} border border-black/25 text-black hover:border-black`}>
          <DownloadIcon />
          Download
        </a>
      </div>
    </article>
  );
}

/** Every section the plan lists, one card each: drawing, title, date, view and download. */
export function DocumentsSection() {
  return (
    <section id="documents" aria-labelledby="documents-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Documents</BracketLabel>
            <h2 id="documents-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Documents
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{INVESTOR_LOREM.long}</p>
        </div>
        <div className="mt-[56px] grid grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-4">
          {DOCUMENTS.map((doc, index) => (
            <DocumentCard key={doc.id} doc={doc} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
