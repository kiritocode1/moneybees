"use client";

import { useShown } from "@/components/about-v2/shared";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { DONT_DO, LOOK_FOR } from "@/lib/approach";

/*
 * What We Look For and What We Don't Do (content plan §6), set as study 09's
 * closing list columns. Each line carries a ring in the sheet's weight: one
 * with an orange core for what we look for, one struck through for what we
 * don't do. Lines arrive from alternate sides, as Titan Gate's lists do.
 */

function Bullet({ kept }: { kept: boolean }) {
  return (
    <svg viewBox="-10 -10 20 20" className="h-[18px] w-[18px] shrink-0 translate-y-[3px]" aria-hidden="true">
      <circle r="8" fill="none" stroke={kept ? "#000" : "#767676"} strokeWidth="1.25" />
      {kept ? <circle r="3.6" fill="#F6A11A" /> : <path d="M-5.6 5.6 5.6-5.6" stroke="#767676" strokeWidth="1.25" />}
    </svg>
  );
}

function Row({ text, index, kept }: { text: string; index: number; kept: boolean }) {
  const { ref, shown, t } = useShown<HTMLLIElement>(0.6);
  const from = (kept ? 1 : -1) * (index % 2 ? -1 : 1) * 28;
  return (
    <li ref={ref} className="border-t border-black/15 py-6">
      <div className="flex items-start gap-4" style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : `translateX(${from}px)`, transition: `opacity ${t(450, index * 40)}, transform ${t(650, index * 40)}` }}>
        <Bullet kept={kept} />
        <p className={`m-0 font-serif text-[clamp(1.5rem,1.15rem+1vw,2.125rem)] leading-[1.15] ${kept ? "text-black" : "text-black/70"}`}>{text}</p>
      </div>
    </li>
  );
}

export function CriteriaLists() {
  return (
    <section id="look-for" aria-label="What we look for and what we don't do" className="scroll-mt-[96px] overflow-x-clip bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 gap-16 py-[120px] md:grid-cols-2 md:gap-x-[80px] max-md:py-[80px]`}>
        {[
          { heading: "What We Look For", items: LOOK_FOR, kept: true },
          { heading: "What We Don't Do", items: DONT_DO, kept: false },
        ].map((column) => (
          <div key={column.heading}>
            <h2 className={`m-0 mb-10 ${SUBHEAD}`}>{column.heading}</h2>
            <ul className="m-0 list-none border-b border-black/15 p-0">
              {column.items.map((text, index) => (
                <Row key={text} text={text} index={index} kept={column.kept} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
