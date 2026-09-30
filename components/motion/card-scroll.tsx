"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { type ReactNode, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * 360lexingtonave.com's layered cards (reference/details-360lex/NOTES.md).
 * A pinned stage; the first card is already there, and each later card slides
 * up from below and lands over the ones before it. Measured: each card
 * travels linearly with scroll over about one viewport, with no easing, fade
 * or scale, then the stage holds for about 0.6 of a viewport and unpins.
 * On phones every card fills the stage, so each slides over the last whole.
 */

export type ScrollCard = {
  key: string;
  tone: "light" | "black" | "orange";
  /** Desktop placement in the stage's 2x2 grid, e.g. "md:col-span-2 md:row-span-2". */
  place: string;
  children: ReactNode;
};

const TONES = {
  light: "bg-[#F6F6F6] text-black",
  black: "bg-black text-white",
  orange: "bg-[#F6A11A] text-black",
} as const;

/** Each card's share of the pinned track: one viewport per card after the first, then the hold. */
const HOLD = 0.6;

function Card({ card, index, count, progress, reduced }: { card: ScrollCard; index: number; count: number; progress: MotionValue<number>; reduced: boolean }) {
  const steps = count - 1 + HOLD;
  const y = useTransform(progress, [(index - 1) / steps, index / steps], ["105%", "0%"]);
  return (
    <motion.div
      style={index === 0 || reduced ? undefined : { y }}
      className={`${TONES[card.tone]} ${card.place} relative overflow-hidden rounded-[10px] p-[clamp(20px,2.4vw,36px)] ${reduced ? "" : "max-md:[grid-area:1/1]"}`}
    >
      {card.children}
    </motion.div>
  );
}

export default function CardScroll({ cards, label }: { cards: readonly ScrollCard[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const reduced = useReducedMotion();
  const track = (cards.length - 1 + HOLD) * 100 + 100;

  if (reduced) {
    return (
      <div aria-label={label} role="group" className="mx-auto grid w-full max-w-[1512px] gap-4 px-6 md:grid-cols-2 md:px-[120px]">
        {cards.map((card, index) => (
          <Card key={card.key} card={card} index={index} count={cards.length} progress={scrollYProgress} reduced />
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} role="group" aria-label={label} className="relative" style={{ height: `${track}svh` }}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid h-[min(620px,74svh)] w-full overflow-hidden max-w-[1512px] grid-cols-1 grid-rows-1 gap-4 px-6 md:grid-cols-2 md:grid-rows-2 md:gap-0 md:px-[120px]">
          {cards.map((card, index) => (
            <Card key={card.key} card={card} index={index} count={cards.length} progress={scrollYProgress} reduced={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
