"use client";

import { useInView } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { LOGINS, NOT_YET_PUBLISHED } from "@/lib/investor-centre";
import { ClientGlyph, DistributorGlyph } from "./glyphs";

/*
 * /investor-centre, content plan §12: the two logins kept apart. The documents
 * are study-04 cards in components/investor-v3/document-cards.tsx.
 */

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
