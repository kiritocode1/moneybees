"use client";

import { motion } from "motion/react";
import Link from "@/components/transition/transition-link";
import CornerBrackets from "@/components/hero/corner-brackets";
import { BODY, BUTTON, COLUMN, EYEBROW, HEADING, Rise } from "@/components/hero/editorial";
import { path, project } from "@/components/iso/geometry";
import { AIF_PRODUCT, PMS_PRODUCT, PMS_VS_AIF } from "@/lib/insights";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { EASE, EDGE, MONO, useReveal } from "./shared";

/*
 * The /pms opening. The figure is the one thing a PMS client owns that a fund
 * investor does not: the stocks themselves, in their own demat account. Twenty
 * slots on a tray, fifteen of them filled, for the 15 to 20 stocks the
 * portfolio holds (group profile p17; AIF presentation p2 for the demat point).
 */

const COLS = 5;
const ROWS = 4;
const PITCH = 44;
const CUBE = 30;
const PAD = 16;
const TRAY = 10;
/** Stocks drawn solid; the front row of five stays open, the room up to twenty. */
const HELD = 15;

/** An axis-aligned box in figure space, its three visible faces in screen space. */
function box(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  return {
    top: path([project(x0, y0, z1), project(x1, y0, z1), project(x1, y1, z1), project(x0, y1, z1)]),
    right: path([project(x1, y0, z1), project(x1, y1, z1), project(x1, y1, z0), project(x1, y0, z0)]),
    left: path([project(x0, y1, z1), project(x1, y1, z1), project(x1, y1, z0), project(x0, y1, z0)]),
  };
}

/** Slots far to near, so a nearer cube is drawn over a farther one and the fill runs toward the viewer. */
const SLOTS = Array.from({ length: COLS * ROWS }, (_, index) => ({ col: index % COLS, row: Math.floor(index / COLS) }))
  .sort((a, b) => a.col + a.row - (b.col + b.row) || a.col - b.col)
  .map(({ col, row }, order) => {
    const x = col * PITCH;
    const y = row * PITCH;
    return { key: `${col}:${row}`, order, open: row === ROWS - 1, faces: box(x, y, x + CUBE, y + CUBE, 0, CUBE) };
  });
/** The drop order of the held cubes, far to near. */
const DROP = new Map(SLOTS.filter((slot) => !slot.open).map((slot, index) => [slot.key, index]));

const TRAY_FACES = box(-PAD, -PAD, (COLS - 1) * PITCH + CUBE + PAD, (ROWS - 1) * PITCH + CUBE + PAD, -TRAY, 0);

/** The tray, then fifteen cubes dropping in, then the count. Reduced motion shows it finished. */
function DematTray() {
  const { ref, run, at } = useReveal<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[560px]">
      <svg
        viewBox="-170 -90 360 250"
        role="img"
        aria-label="Twenty slots in your demat account, fifteen of them holding a stock: a portfolio of 15 to 20 stocks."
        className="block h-auto w-full overflow-visible"
      >
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: run ? 1 : 0 }} transition={at(0, 0.6)}>
          <path d={TRAY_FACES.left} fill="#e4e3e0" stroke={EDGE} strokeWidth="0.9" strokeLinejoin="round" />
          <path d={TRAY_FACES.right} fill="#d6d5d2" stroke={EDGE} strokeWidth="0.9" strokeLinejoin="round" />
          <path d={TRAY_FACES.top} fill="#f7f6f4" stroke={EDGE} strokeWidth="0.9" strokeLinejoin="round" />
        </motion.g>

        {SLOTS.map(({ key, open, faces }) =>
          !open ? (
            <motion.g
              key={key}
              initial={{ opacity: 0, y: -48 }}
              animate={run ? { opacity: 1, y: 0 } : { opacity: 0, y: -48 }}
              transition={at(0.5 + (DROP.get(key) ?? 0) * 0.07, 0.55)}
            >
              <path d={faces.left} fill="#b87408" stroke="rgba(90,50,0,.75)" strokeWidth="0.9" strokeLinejoin="round" />
              <path d={faces.right} fill="#d98c10" stroke="rgba(90,50,0,.75)" strokeWidth="0.9" strokeLinejoin="round" />
              <path d={faces.top} fill="#F6A11A" stroke="rgba(90,50,0,.75)" strokeWidth="0.9" strokeLinejoin="round" />
            </motion.g>
          ) : (
            <motion.g
              key={key}
              fill="none"
              stroke="rgba(0,0,0,.4)"
              strokeWidth="0.9"
              strokeDasharray="2 4"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: run ? 1 : 0 }}
              transition={at(0.5 + HELD * 0.07 + 0.2, 0.5)}
            >
              <path d={faces.left} />
              <path d={faces.right} />
              <path d={faces.top} />
            </motion.g>
          ),
        )}
      </svg>
      <div aria-hidden="true" className={`${EYEBROW} mt-[18px] flex justify-between text-black/60`}>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: run ? 1 : 0 }} transition={at(0.3, 0.5)}>
          Your demat account
        </motion.span>
        <motion.span
          className="text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: run ? 1 : 0 }}
          transition={at(0.5 + HELD * 0.07 + 0.4, 0.5)}
        >
          15-20 stocks
        </motion.span>
      </div>
    </div>
  );
}

/** The four terms a PMS client asks about first, group profile p9, p11 and p17. */
const TERMS = [
  ["Strategy", "Long-only Indian equities"],
  ["Portfolio", "15 to 20 small and mid-cap stocks"],
  ["Horizon", "At least three years"],
  ["Exit load", "None"],
] as const;

/** The page's opening: the product, the demat point, the two ways on, and the tray. */
export default function PmsHero() {
  const reduceMotion = useReducedMotion();
  return (
    <section aria-labelledby="pms-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-[1.05fr_1fr] items-center gap-12 pt-[190px] pb-[90px] max-[900px]:grid-cols-1 max-md:pt-[130px]`}>
        <div>
          <Rise>
            <span className={`${EYEBROW} text-black/60`}>Portfolio Management Service</span>
            <h1 id="pms-heading" className={`mt-[18px] ${HEADING} text-[clamp(3rem,1.6rem+4.6vw,5.4rem)]`}>
              {PMS_PRODUCT.name}
            </h1>
          </Rise>
          <Rise delay={0.08}>
            <p className={`mt-8 max-w-[560px] text-black/70 ${BODY}`}>
              {PMS_PRODUCT.lead}. {PMS_VS_AIF.split(". ")[0]}.
            </p>
          </Rise>
          <Rise delay={0.16}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a href="#talk" className={`${BUTTON} bg-black text-white hover:bg-black/85`}>
                Schedule a conversation
              </a>
              <Link href="/aif" className={`${BUTTON} border border-dashed border-black/10 text-black hover:bg-black/[.03]`}>
                {AIF_PRODUCT.name}
                <CornerBrackets />
              </Link>
            </div>
          </Rise>
        </div>
        <DematTray />
      </div>
      <dl className={`${COLUMN} grid grid-cols-4 border-t border-dashed border-black/10 max-md:grid-cols-2`}>
        {TERMS.map(([term, value], index) => (
          <motion.div
            key={term}
            className="border-dashed border-black/10 py-[28px] pr-[24px] not-first:pl-[24px] not-first:border-l max-md:not-first:pl-0 max-md:odd:border-l-0 max-md:even:pl-[20px]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.1 + index * 0.06, ease: EASE }}
          >
            <dt className={`${EYEBROW} text-black/55`}>{term}</dt>
            <dd className={`${MONO} mt-[10px] text-[14px] leading-[1.45]`}>{value}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}
