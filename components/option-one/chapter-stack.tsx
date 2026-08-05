"use client";

import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * What the desk publishes, and how the figures behind it are produced. These
 * three cards carry the content that the standalone investment-desk and
 * performance sections used to hold — nothing factual was dropped in the
 * rebuild, it was folded into this form.
 */
const CHAPTERS = [
  {
    n: "01",
    label: "The letter",
    title: ["What we publish when", "we are not selling"],
    copy: "A quarterly letter to investors, sector notes on small and ultra-small caps, and commentary on what we own and why. Written whether the quarter was good or not, because a manager who only writes after a strong year has told you nothing.",
    tone: "bg-[#b8862f] text-[#111111]",
    rule: "border-t-[rgba(17,17,17,.35)]",
    sub: "text-[rgba(17,17,17,.72)]",
  },
  {
    n: "02",
    label: "The method",
    title: ["How performance", "is measured"],
    copy: "Time-weighted returns, measured against the benchmark, net of every fee. Rolling returns and drawdowns rather than a single headline number, so the path the return took stays visible alongside the return itself.",
    tone: "bg-[#111111] text-white",
    rule: "border-t-[rgba(255,255,255,.28)]",
    sub: "text-[rgba(255,255,255,.68)]",
  },
  {
    n: "03",
    label: "The record",
    title: ["Where the", "figures live"],
    copy: "Performance is published in the Disclosure Document and the monthly factsheet, after review by our compliance officer. Every figure carries the method used to calculate it and the benchmark it is measured against.",
    tone: "bg-[#eceae5] text-[#111111]",
    rule: "border-t-[rgba(17,17,17,.2)]",
    sub: "text-[rgba(17,17,17,.66)]",
  },
] as const;

/**
 * One card in the stack.
 *
 * Every card is absolutely positioned in the same pinned frame, ordered so the
 * first sits on top. As its slice of the track goes by, it translates up and off
 * and uncovers the card that has been waiting underneath it the whole time. The
 * hold before the peel is what keeps the sequence readable — without it the
 * cards start leaving the moment they arrive.
 *
 * The last card never peels. It is the one still standing when the track ends,
 * so the page can resume normal flow beneath it.
 */
function ChapterCard({
  chapter,
  index,
  total,
  progress,
  pinned,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
  pinned: boolean;
}) {
  const slice = 1 / total;
  const start = index * slice + slice * 0.38;
  const end = (index + 1) * slice;
  // Slightly past -100% so no hairline of the outgoing card is left at the top
  // edge on a fractional device pixel.
  const y = useTransform(progress, [start, end], ["0%", "-102%"]);
  const isLast = index === total - 1;

  return (
    <motion.article
      style={pinned ? { zIndex: total - index, ...(isLast ? {} : { y }) } : undefined}
      className={`grid content-center px-[max(32px,calc((100vw_-_1480px)/2))] ${chapter.tone} ${
        pinned ? "absolute inset-0" : "relative min-h-svh"
      }`}
    >
      <div className={`border-t pt-[36px] ${chapter.rule}`}>
        <div className="grid grid-cols-[.42fr_1fr] gap-[40px] max-[900px]:grid-cols-1 max-[900px]:gap-[28px]">
          <div>
            <span className="block text-[clamp(4rem,8.5vw,9.5rem)] font-light leading-[.84] tracking-[-.06em]">
              {chapter.n}
            </span>
            <span className="mt-[4px] block text-[clamp(3rem,8vw,9rem)] font-light leading-[.88] tracking-[-.055em]">
              {chapter.label}
            </span>
          </div>
          <div className="max-w-[620px] self-start pt-[10px]">
            <h2 className="text-[clamp(2rem,4.2vw,4.2rem)] font-normal leading-[1.02] tracking-[-.04em]">
              {chapter.title[0]}
              <br />
              {chapter.title[1]}
            </h2>
            <p className={`mt-[32px] max-w-[44ch] text-[15px] leading-[1.6] ${chapter.sub} max-[600px]:text-[14px]`}>
              {chapter.copy}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ChapterStack() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Under reduced motion the pin and the peel both go: the cards become three
  // ordinary full-height panels you scroll past. Same content, same order, no
  // hijacked scroll.
  const pinned = !reduceMotion;

  return (
    <section
      ref={trackRef}
      aria-label="What the desk publishes"
      className="relative"
      style={pinned ? { height: `${CHAPTERS.length * 100}svh` } : undefined}
    >
      <div className={pinned ? "sticky top-0 h-svh overflow-hidden" : ""}>
        {CHAPTERS.map((chapter, index) => (
          <ChapterCard
            key={chapter.n}
            chapter={chapter}
            index={index}
            total={CHAPTERS.length}
            progress={scrollYProgress}
            pinned={pinned}
          />
        ))}
      </div>
    </section>
  );
}
