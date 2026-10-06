"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { FigurePanel } from "@/components/pms-v2/shared";
import { RANKING_TABLES, RANKINGS_AS_OF } from "@/lib/insights";
import { EASE_OUT } from "@/lib/ease";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * Recognition, on /about: PMS Bazaar's three top-seven lists (group profile
 * p5), drawn in the /pms performance chart's language (components/motion/
 * lit-rows.tsx). The other schemes are thin grey pills, unnamed; Moneybee's
 * row is the lit bar, sweeping to orange and ending in the ringed marker, so
 * the rank reads as a place in the list. The scale is shared, so the three
 * lists compare. Cadence follows lit-rows: pills 60ms apart, then the lit bar
 * fills in 0.6s, the ring draws in 0.53s and the number rises.
 */

const RING = 30;
const FILL = 0.6;
const DRAW = 0.53;
const STEP = 0.06;
const MAX = Math.max(...RANKING_TABLES.flatMap((table) => table.returns));

const pct = (value: number) => `+${value.toFixed(2)}%`;
const place = (index: number) => String(index + 1).padStart(2, "0");

/** One period's list. `start` staggers it behind the lists before it. */
function Ladder({ table, on, start, reduced }: { table: (typeof RANKING_TABLES)[number]; on: boolean; start: number; reduced: boolean }) {
  /** A delay after the list's own start; nothing waits under reduced motion. */
  const at = (delay: number) => (reduced ? 0 : start + delay);
  const lit = table.returns.length * STEP + 0.1;
  return (
    <div>
      <h3 className="m-0 flex items-baseline gap-[14px] border-b border-black pb-[14px]">
        <motion.span
          initial={false}
          animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: at(lit + 0.75), duration: reduced ? 0 : 0.5, ease: EASE_OUT }}
          className="font-serif text-[clamp(3rem,2rem+2.4vw,4.25rem)] leading-none font-normal tracking-[-.02em]"
        >
          {table.rank}
        </motion.span>
        <span className={`${EYEBROW} text-black/60`}>{table.period}</span>
      </h3>
      <ol className="m-0 mt-[10px] list-none p-0">
        {table.returns.map((value, index) => {
          const ours = index === table.ours;
          const share = `${(value / MAX) * 100}%`;
          return (
            <li key={index} className={`grid grid-cols-[28px_1fr] items-center gap-[10px] ${ours ? "py-[10px]" : "py-[7px]"}`}>
              <span className={`${EYEBROW} tabular-nums ${ours ? "text-black" : "text-black/40"}`}>{place(index)}</span>
              {/* Every row shares one track, so bar lengths compare; its right margin leaves room for the number. */}
              <div className="relative mr-[104px]">
                {ours ? (
                  <>
                    <span className="block text-[12px] leading-none text-black/70">Moneybee PMS</span>
                    <div className="relative mt-[8px]" style={{ height: RING }}>
                      <motion.div
                        initial={false}
                        animate={{ scaleX: on ? 1 : 0 }}
                        transition={{ delay: at(lit), duration: reduced ? 0 : FILL, ease: EASE_OUT }}
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: share, originX: 0, background: "linear-gradient(to right, rgba(157,158,161,0), rgba(246,161,26,.35) 45%, #F6A11A)" }}
                      />
                      {/* The ring's white face arrives with the bar, so no dot waits on the panel beforehand. */}
                      <motion.div
                        initial={false}
                        animate={{ opacity: on ? 1 : 0 }}
                        transition={{ delay: at(lit + 0.2), duration: reduced ? 0 : 0.3, ease: EASE_OUT }}
                        className="absolute inset-y-0 flex items-center"
                        style={{ left: `calc(${share} - ${RING / 2}px)` }}
                      >
                        <svg width={RING} height={RING} viewBox="0 0 44 44" aria-hidden="true">
                          <circle cx="22" cy="22" r="18" fill="#fff" />
                          <motion.circle
                            cx="22"
                            cy="22"
                            r="18"
                            fill="none"
                            stroke="#F6A11A"
                            strokeWidth="4"
                            initial={false}
                            animate={{ pathLength: on ? 1 : 0 }}
                            transition={{ delay: at(lit + 0.27), duration: reduced ? 0 : DRAW, ease: EASE_OUT }}
                            style={{ rotate: -90, originX: "50%", originY: "50%" }}
                          />
                        </svg>
                      </motion.div>
                      <motion.span
                        initial={false}
                        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        transition={{ delay: at(lit + 0.75), duration: reduced ? 0 : 0.5, ease: EASE_OUT }}
                        className="absolute inset-y-0 flex items-center font-serif text-[clamp(1.35rem,1.1rem+.6vw,1.75rem)] leading-none whitespace-nowrap tabular-nums"
                        style={{ left: `calc(${share} + ${RING / 2 + 10}px)` }}
                      >
                        {pct(value)}
                      </motion.span>
                    </div>
                  </>
                ) : (
                  <div className="relative h-[6px]">
                    <motion.div
                      initial={false}
                      animate={{ scaleX: on ? 1 : 0 }}
                      transition={{ delay: at(index * STEP), duration: reduced ? 0 : FILL, ease: EASE_OUT }}
                      className="absolute inset-y-0 left-0 rounded-full bg-[#9D9EA1]/60"
                      style={{ width: share, originX: 0 }}
                    />
                    <motion.span
                      initial={false}
                      animate={{ opacity: on ? 1 : 0 }}
                      transition={{ delay: at(index * STEP + 0.3), duration: reduced ? 0 : 0.4 }}
                      className="absolute top-1/2 -translate-y-1/2 text-[12px] leading-none whitespace-nowrap text-black/50 tabular-nums"
                      style={{ left: `calc(${share} + 8px)` }}
                    >
                      {pct(value)}
                    </motion.span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** `index` is the section's number in the page's order. */
export function RecognitionSection({ index }: { index: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const on = inView || reduced;
  return (
    <section id="recognition" aria-labelledby="recognition-heading" className="scroll-mt-[96px] border-t border-dashed border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <BracketLabel>{index} · Recognition</BracketLabel>
        <h2 id="recognition-heading" className={`mt-[18px] max-w-[880px] ${SUBHEAD}`}>
          Ranked among India&rsquo;s top-performing portfolio managers by PMS Bazaar
        </h2>
        <p className="mt-[40px]">
          <span className={`${EYEBROW} rounded-full border border-[#F6A11A] px-[10px] py-[4px] text-black`}>{RANKINGS_AS_OF}</span>
        </p>
        <FigurePanel className="mt-[32px]">
          <div ref={ref} className="grid grid-cols-1 gap-x-[48px] gap-y-[56px] xl:grid-cols-3">
            {RANKING_TABLES.map((table, i) => (
              <Ladder key={table.period} table={table} on={on} start={i * 0.15} reduced={reduced} />
            ))}
          </div>
        </FigurePanel>
        <p className={`${EYEBROW} mt-[18px] text-black/60`}>Returns in %. Past performance does not guarantee future performance.</p>
      </div>
    </section>
  );
}
