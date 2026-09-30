"use client";

import { useInView } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import { DOCUMENT_GROUPS, INVESTOR_CENTRE, INVESTOR_LOREM, type InvestorDocument, LOGINS, NOT_YET_PUBLISHED } from "@/lib/investor-centre";
import { ClientGlyph, DistributorGlyph, DocumentGlyph, GatherGlyph } from "./glyphs";

/*
 * /investor-centre, content plan §12: the two logins kept apart, then every
 * listed section as a row in one of four ruled document lists, each list with
 * its own drawing. No legal text on the page itself, and no dead links: a
 * document without an approved file says so instead of pointing at "#".
 */

const number = (index: number) => String(index + 1).padStart(2, "0");
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";
const PILL = `inline-flex items-center justify-center gap-[8px] rounded-full px-[18px] py-[9px] text-[14px] font-medium no-underline transition-[color,background-color,border-color,transform,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] active:scale-[0.97] motion-reduce:transition-none ${FOCUS}`;

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
                <a href="#logins" className={`${PILL} bg-[#F6A11A] text-black hover:bg-black hover:text-white`}>
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
          <nav aria-label="On this page" className="mt-[72px] max-md:mt-[48px]">
            <ol className="m-0 grid list-none grid-cols-1 gap-x-8 border-t border-black p-0 sm:grid-cols-2 lg:grid-cols-5">
              {[["Logins", "#logins"] as const, ...DOCUMENT_GROUPS.map((group) => [group.heading, `#${group.id}`] as const)].map(([label, href], index) => (
                <li key={href} className="border-b border-black/15">
                  <a href={href} className={`group flex items-baseline gap-[14px] py-[12px] text-black no-underline ${FOCUS}`}>
                    <span className="w-[26px] text-[16px] leading-none font-light tracking-[-.04em] text-black/60 tabular-nums">{number(index)}</span>
                    <span className="text-[15px] text-black/70 transition-colors duration-200 group-hover:text-black">{label}</span>
                    <span aria-hidden="true" className="ml-auto h-[2px] w-[20px] origin-left scale-x-0 self-center bg-[#F6A11A] transition-transform duration-300 ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-x-100 motion-reduce:transition-none" />
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
          <a href={LOGINS.client.href} className={`mt-[28px] ${PILL} bg-[#F6A11A] px-[26px] py-[14px] text-[15px] text-black hover:bg-black hover:text-white`}>
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
          <p className="mt-[20px] max-w-[440px] text-[15px] leading-[1.55] text-white/65">{LOGINS.distributor.text}</p>
          {LOGINS.distributor.href ? (
            <a href={LOGINS.distributor.href} className={`mt-[28px] ${PILL} border border-white/40 px-[26px] py-[14px] text-[15px] text-white hover:border-[#F6A11A] hover:text-[#F6A11A] focus-visible:outline-white`}>
              {LOGINS.distributor.name}
            </a>
          ) : (
            <p className={`mt-[28px] ${EYEBROW} text-white/60`}>{NOT_YET_PUBLISHED}</p>
          )}
        </div>
      </div>
    </section>
  );
}

/** One row of a list: the title, its date, and a View link once the approved file exists. */
function DocumentRow({ doc }: { doc: InvestorDocument }) {
  return (
    <li id={doc.id} className="grid scroll-mt-[120px] grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-[4px] border-b border-black/15 py-[18px] md:grid-cols-[minmax(0,1fr)_140px_170px]">
      <h4 className="font-serif text-[clamp(1.25rem,1rem+.7vw,1.6rem)] leading-[1.2] font-normal">{doc.title}</h4>
      <span className={`${EYEBROW} text-black/60 tabular-nums max-md:col-start-1 max-md:row-start-2`}>{doc.date ?? "Date to follow"}</span>
      <span className="text-right max-md:col-start-2 max-md:row-span-2 max-md:row-start-1 max-md:self-center">
        {doc.href ? (
          <a href={doc.href} className={`group inline-flex items-center gap-[8px] text-[14px] font-medium text-black no-underline ${FOCUS}`}>
            View<span className="sr-only"> {doc.title}</span>
            <span aria-hidden="true" className="h-[2px] w-[18px] bg-[#F6A11A] transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)] group-hover:translate-x-[3px] motion-reduce:transition-none" />
          </a>
        ) : (
          <span className="text-[13px] whitespace-nowrap text-black/60">{NOT_YET_PUBLISHED}</span>
        )}
      </span>
    </li>
  );
}

/** One of the plan's groups: its number, heading and drawing on the left, the ruled list of documents on the right. */
function DocumentGroup({ group, index }: { group: (typeof DOCUMENT_GROUPS)[number]; index: number }) {
  const { ref, shown } = useShown<HTMLDivElement>(0.35);
  return (
    <div ref={ref} id={group.id} className="grid scroll-mt-[120px] grid-cols-1 gap-8 border-t border-black pt-[28px] md:grid-cols-[minmax(0,.8fr)_minmax(0,1.6fr)] md:gap-16">
      <div className="flex gap-[22px] md:flex-col">
        <div className="min-w-0 flex-1 md:flex-none">
          <span className={`${EYEBROW} text-black/60`}>{number(index + 1)}</span>
          <h3 className="mt-[10px] font-serif text-[clamp(1.6rem,1.2rem+1vw,2.2rem)] leading-[1.1] font-normal">{group.heading}</h3>
        </div>
        <div className="w-[132px] shrink-0 md:mt-[28px] md:w-full md:max-w-[240px]">
          <DocumentGlyph kind={group.glyph} on={shown} />
        </div>
      </div>
      <ul className="m-0 list-none p-0">
        {group.documents.map((doc) => (
          <DocumentRow key={doc.id} doc={doc} />
        ))}
      </ul>
    </div>
  );
}

/** Every section the plan lists, as four ruled lists: title, date and a View link per document. */
export function DocumentsSection() {
  return (
    <section id="documents" aria-labelledby="documents-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <h2 id="documents-heading" className={SUBHEAD}>
            Documents
          </h2>
          <p className={`text-black/70 ${BODY}`}>{INVESTOR_LOREM.long}</p>
        </div>
        <div className="mt-[64px] flex flex-col gap-[72px] max-md:gap-[56px]">
          {DOCUMENT_GROUPS.map((group, index) => (
            <DocumentGroup key={group.id} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
