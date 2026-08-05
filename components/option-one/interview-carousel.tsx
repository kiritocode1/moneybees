"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowRightUp, Play } from "reicon-react";
import { EASE_OUT } from "@/lib/ease";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-[#b8862f] focus-visible:outline-offset-4";

/**
 * PLACEHOLDER CONTENT. These are Business Insider's own films, published on the
 * @Insider channel — they are not Moneybee's, and the card meta says so on every
 * card precisely so a visitor is never left to assume otherwise. They stand in
 * because they match the one idea this section exists to carry: that you have to
 * understand how a business actually earns before you can put a price on it.
 *
 * Replace `id` and the copy with the firm's own interviews when they exist. The
 * carousel needs nothing else changed — everything below is driven off this array.
 *
 * Two rules when swapping ids in. Use long-form videos, not Shorts: a Short
 * embeds as the vertical Shorts player, which fills a 16:9 slot with chrome and
 * letterboxing. And look at the poster frame before committing to it — YouTube
 * thumbnails carry burned-in promotional text that this layout cannot strip.
 */
const INTERVIEWS = [
  { id: "5kSX2-6Zjuc", name: "Pickle shop", note: "The last one left in a category", source: "Insider" },
  { id: "mU7JJG40xo4", name: "Silk", note: "Why scarcity sets a price", source: "Insider" },
  { id: "MEOuvCnA758", name: "Baked by Melissa", note: "A small business that scaled", source: "Insider" },
  { id: "BbPMy2jryyc", name: "Chillwear", note: "Unit economics from the first order", source: "Insider" },
  { id: "RhledfZqvew", name: "Aleppo soap", note: "A method that has not changed", source: "Insider" },
  { id: "P1td1JYRzNY", name: "Leaf tableware", note: "Ultra-small cap, in the literal sense", source: "Insider" },
  { id: "lznsZSMkRqA", name: "Slime", note: "Where a business begins", source: "Insider" },
] as const;

/** Card width and the flex gap between cards, in px. The arrows step by their sum. */
const CARD_W = 460;
const GAP = 16;

function InterviewCard({ interview }: { interview: (typeof INTERVIEWS)[number] }) {
  // The iframe is not mounted until the poster is clicked. Seven embeds would
  // otherwise pull seven players' worth of third-party script onto a page whose
  // whole argument is restraint.
  const [playing, setPlaying] = useState(false);

  return (
    <article className="w-[460px] shrink-0 max-[600px]:w-[78vw]">
      <div className="relative aspect-video overflow-hidden bg-[#e9e9e6]">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${interview.id}?autoplay=1&rel=0&modestbranding=1`}
            title={`${interview.name} — ${interview.note}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play: ${interview.name} — ${interview.note}`}
            className={`group absolute inset-0 block cursor-pointer border-0 p-0 ${FOCUS}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${interview.id}/maxresdefault.jpg`}
              alt=""
              fill
              sizes="460px"
              /* Greyscale until hover, like the reference's unreleased cards.
                 It also keeps seven different colour grades from fighting the
                 page's palette. */
              className="object-cover grayscale transition-[filter,transform] duration-700 ease-[ease] group-hover:scale-[1.03] group-hover:grayscale-0"
            />
            <span className="absolute top-[14px] left-[14px] text-[10px] uppercase tracking-[.1em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,.6)]">
              {interview.source}
            </span>
            <span className="absolute bottom-[14px] left-[14px] grid h-[42px] w-[42px] place-items-center bg-[#b8862f] text-white transition-transform duration-300 ease-[ease] group-hover:scale-110">
              <Play size={18} aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      {/* The colour bar under the thumbnail is the reference's device for tying a
          card back to the palette. Gold here rather than its lilac. */}
      <div className="h-[7px] bg-[#b8862f]" />
      <h3 className="mt-[22px] text-[22px] font-normal tracking-[-.025em] text-[#111111]">{interview.name}</h3>
      <p className="mt-[8px] max-w-[300px] text-[12px] leading-[1.5] text-[rgba(17,17,17,.6)]">{interview.note}</p>
      <a
        href={`https://www.youtube.com/watch?v=${interview.id}`}
        target="_blank"
        rel="noreferrer"
        className={`group mt-[26px] flex items-center justify-between gap-[20px] border-t border-t-[rgba(17,17,17,.2)] pt-[14px] text-[12px] text-[#111111] no-underline transition-colors duration-200 ease-[ease] hover:text-[#b8862f] ${FOCUS}`}
      >
        Watch on YouTube
        <i className="not-italic transition-transform duration-200 ease-[ease] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
          <ArrowRightUp size={15} aria-hidden="true" />
        </i>
      </a>
    </article>
  );
}

export default function InterviewCarousel() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* The arrows are a convenience over a track that is already a native
     horizontal scroller, so trackpad, touch, and shift-wheel all keep working
     and the ends are read back off the real scroll position rather than a
     counter we would have to keep in sync. */
  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges]);

  const step = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({
      left: direction * (CARD_W + GAP),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const arrow = "grid h-[46px] w-[46px] place-items-center border border-[rgba(17,17,17,.22)] bg-white text-[#111111] transition-[background-color,color,border-color,opacity] duration-200 ease-[ease] enabled:hover:border-[#b8862f] enabled:hover:bg-[#b8862f] enabled:hover:text-white disabled:opacity-30";

  return (
    <section
      aria-label="Understanding businesses"
      className="border-t border-t-[rgba(17,17,17,.14)] bg-white py-[86px] max-[600px]:py-[60px]"
    >
      <div className="px-[max(32px,calc((100vw_-_1480px)/2))] max-[600px]:px-[22px]">
        <span className="block text-[9px] uppercase tracking-[.14em] text-[rgba(17,17,17,.6)]">
          Understanding businesses
        </span>
        <div className="mt-[38px] flex items-end justify-between gap-[40px]">
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE_OUT }}
            className="max-w-[760px] text-[clamp(2rem,3.4vw,3.5rem)] font-light leading-[1.04] tracking-[-.04em] text-[#111111]"
          >
            Seven businesses. Seven ways
            <br />
            of actually making money.
          </motion.h2>
          <div className="flex shrink-0 gap-[10px] max-[600px]:hidden">
            <button type="button" onClick={() => step(-1)} disabled={atStart} aria-label="Previous" className={`${arrow} ${FOCUS}`}>
              <ArrowLeft size={17} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => step(1)} disabled={atEnd} aria-label="Next" className={`${arrow} ${FOCUS}`}>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
        <p className="mt-[24px] max-w-[520px] text-[12px] leading-[1.6] text-[rgba(17,17,17,.62)]">
          We value a security by first understanding the business behind it. These films, published by Insider, are a
          plain look at how ordinary businesses earn. It is the same question we ask of every holding.
        </p>
      </div>

      {/* Full-bleed track: the first card lines up with the page gutter and the
          last one runs off the right edge, so the row reads as continuing rather
          than ending. */}
      <div
        ref={trackRef}
        onScroll={syncEdges}
        tabIndex={0}
        role="group"
        aria-label="Interview carousel, scrollable"
        className={`option-one-track mt-[52px] flex gap-[16px] overflow-x-auto overscroll-x-contain scroll-smooth px-[max(32px,calc((100vw_-_1480px)/2))] pb-[10px] max-[600px]:px-[22px] ${FOCUS}`}
      >
        {INTERVIEWS.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>
    </section>
  );
}
