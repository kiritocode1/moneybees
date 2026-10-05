"use client";

import type { CSSProperties } from "react";
import { useShown } from "@/components/about-v2/shared";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { STRUCTURE } from "@/lib/aif-v2";

/*
 * Flyingbee Structure (content plan §4) as the plan's diagram and nothing
 * else: Investors → Flyingbee Investment Fund → Moneybee Investment Manager,
 * with the four parties hanging off the fund. Names only, so it repeats none
 * of the Category III text above it. From md the chain runs across and the
 * parties sit on a rail under the fund; below md the chain runs down and the
 * parties sit in a tray under the fund's box. The connectors draw in order as
 * the figure comes into view.
 */

const NAME = "font-serif text-[clamp(1.15rem,.95rem+.6vw,1.55rem)] leading-[1.15]";
const BOX = "flex items-center border border-black bg-white px-[22px] py-[20px]";
const FUND = "flex items-center border border-[#F6A11A] bg-[#F6A11A] px-[22px] py-[20px]";

type Timing = (ms: number, delay?: number) => string;

/** A connector that grows from its start. `down` runs it top to bottom instead of left to right. */
function Arrow({ down, shown, t, delay }: { down?: boolean; shown: boolean; t: Timing; delay: number }) {
  const grow: CSSProperties = { transform: shown ? "none" : down ? "scaleY(0)" : "scaleX(0)", transition: `transform ${t(500, delay)}` };
  const head: CSSProperties = { opacity: shown ? 1 : 0, transition: `opacity ${t(200, delay + 420)}` };
  return down ? (
    <span aria-hidden="true" className="flex h-[44px] flex-col items-center">
      <span className="w-px flex-1 origin-top bg-black" style={grow} />
      <svg width="11" height="7" viewBox="0 0 11 7" className="block" style={head}>
        <path d="M0 0 L5.5 7 L11 0" fill="#000" />
      </svg>
    </span>
  ) : (
    <span aria-hidden="true" className="flex w-[clamp(36px,4.5vw,72px)] items-center">
      <span className="h-px flex-1 origin-left bg-black" style={grow} />
      <svg width="7" height="11" viewBox="0 0 7 11" className="block" style={head}>
        <path d="M0 0 L7 5.5 L0 11" fill="#000" />
      </svg>
    </span>
  );
}

export function StructureSection() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.3);
  const [investors, fund, manager] = STRUCTURE.chain;
  const appear = (delay: number): CSSProperties => ({
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : "translateY(12px)",
    transition: `opacity ${t(500, delay)}, transform ${t(700, delay)}`,
  });
  return (
    <section id="structure" aria-labelledby="structure-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <BracketLabel>Flyingbee</BracketLabel>
        <h2 id="structure-heading" className={`mt-[18px] ${SUBHEAD}`}>
          {STRUCTURE.heading}
        </h2>

        <div ref={ref} className="mt-[56px]">
          {/* md and up: the chain across, the parties on a rail under the fund. */}
          <div className="max-md:hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)_auto_minmax(0,1fr)] items-stretch">
              <div className={BOX} style={appear(0)}>
                <span className={NAME}>{investors}</span>
              </div>
              <Arrow shown={shown} t={t} delay={250} />
              <div className={FUND} style={appear(500)}>
                <span className={NAME}>{fund}</span>
              </div>
              <Arrow shown={shown} t={t} delay={750} />
              <div className={BOX} style={appear(1000)}>
                <span className={NAME}>{manager}</span>
              </div>
            </div>
            {/* The stem drops from the fund's centre, which sits at the middle of the row because both outer columns are equal. */}
            <div className="flex justify-center">
              <span aria-hidden="true" className="block h-[48px] w-px origin-top bg-black" style={{ transform: shown ? "none" : "scaleY(0)", transition: `transform ${t(400, 1250)}` }} />
            </div>
            <ul className="relative m-0 grid list-none grid-cols-4 gap-x-6 p-0">
              {/* From the first column's centre to the last's: a column is (100% - three 24px gaps) / 4, so its centre sits an eighth of that in. */}
              <span
                aria-hidden="true"
                className="absolute top-0 right-[calc((100%-72px)/8)] left-[calc((100%-72px)/8)] h-px bg-black"
                style={{ transform: shown ? "none" : "scaleX(0)", transition: `transform ${t(600, 1550)}` }}
              />
              {STRUCTURE.parties.map((party, index) => (
                <li key={party} className="flex flex-col items-center">
                  <span aria-hidden="true" className="block h-[28px] w-px origin-top bg-black" style={{ transform: shown ? "none" : "scaleY(0)", transition: `transform ${t(300, 2050 + index * 90)}` }} />
                  <div className={`${BOX} w-full flex-1`} style={appear(2200 + index * 90)}>
                    <span className={NAME}>{party}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Below md: the chain down, the parties in a tray under the fund. */}
          <div className="md:hidden">
            <div className={BOX} style={appear(0)}>
              <span className={NAME}>{investors}</span>
            </div>
            <Arrow down shown={shown} t={t} delay={250} />
            <div style={appear(500)}>
              <div className={FUND}>
                <span className={NAME}>{fund}</span>
              </div>
              <ul className="m-0 grid list-none grid-cols-2 gap-[8px] border border-t-0 border-[#F6A11A] p-[8px]">
                {STRUCTURE.parties.map((party) => (
                  <li key={party} className="flex items-center border border-black/25 bg-white px-[14px] py-[14px] text-[15px] leading-[1.3]">
                    {party}
                  </li>
                ))}
              </ul>
            </div>
            <Arrow down shown={shown} t={t} delay={750} />
            <div className={BOX} style={appear(1000)}>
              <span className={NAME}>{manager}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
