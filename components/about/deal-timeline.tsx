"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  BODY,
  COLUMN,
  DashedRule,
  EYEBROW,
  Rise,
  SUBHEAD,
} from "@/components/hero/editorial";
import { ADVISORY_LEAD, FEATURED_DEALS } from "@/lib/about";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import LogoImage from "./logo-image";
import { hexPoints } from "./use-build";

const pad = (index: number) => String(index + 1).padStart(2, "0");
/** Scroll given to each deal while the pane is pinned, in svh. */
const PER_DEAL = 38;
/** The track's left and right inset, the page column's gutter. */
const GUTTER = "px-[max(24px,calc((100vw_-_1512px)/2_+_120px))] max-md:px-6";
/** One deal's column. */
const COL = "w-[340px] max-md:w-[76vw]";

/**
 * The deck's featured-deals timeline (group profile p7 and p8) as one pinned
 * scroll: the dashed line with its numbered hexagons runs sideways as the page
 * scrolls, deals alternating below and above it as on the slides. Each deal
 * lights when it reaches the reading position, its hexagon turning orange and
 * its logo taking its colour; the orange line follows along behind.
 */
export default function DealTimeline() {
  const runRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const count = FEATURED_DEALS.length;

  const { scrollYProgress } = useScroll({
    target: runRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setActive(Math.min(count - 1, Math.max(0, Math.round(value * (count - 1))))),
  );

  useEffect(() => {
    const pane = paneRef.current;
    const track = trackRef.current;
    if (!pane || !track) return;
    const measure = () =>
      setDistance(Math.max(0, track.scrollWidth - pane.clientWidth));
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(pane);
    resize.observe(track);
    return () => resize.disconnect();
  }, []);

  return (
    <section
      id="deals"
      aria-labelledby="deals-heading"
      className="bg-white text-black"
    >
      <DashedRule />
      <div className={`${COLUMN} pt-[110px] max-md:pt-[80px]`}>
        <Rise onView>
          <span className={`${EYEBROW} text-black/60`}>Advisory</span>
          <h2 id="deals-heading" className={`${SUBHEAD} mt-[14px]`}>
            Featured deals
          </h2>
          <p className={`mt-[18px] max-w-[640px] text-black/70 ${BODY}`}>
            {ADVISORY_LEAD}
          </p>
        </Rise>
      </div>
      <div
        ref={runRef}
        className="relative"
        style={{ height: `calc(${count * PER_DEAL}svh + 100svh)` }}
      >
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
          <p
            className={`${COLUMN} ${EYEBROW} flex gap-[18px] pt-[104px] text-black/55 tabular-nums max-md:pt-[88px]`}
            aria-hidden="true"
          >
            <span>Featured deals</span>
            <span>
              <span className="text-black">{pad(active)}</span> / {pad(count - 1)}
            </span>
          </p>

          <div ref={paneRef} className="relative min-h-0 flex-1">
            <motion.ol
              ref={trackRef}
              style={{ x }}
              className={`relative flex h-full w-max list-none p-0 ${GUTTER}`}
            >
              {/* The slide's dashed line, and the orange run up to the lit deal. */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 right-0 left-0 border-t border-dashed border-black/30"
              />
              {FEATURED_DEALS.map((deal, index) => {
                const reached = reduceMotion || index <= active;
                const lit = !reduceMotion && index === active;
                const below = index % 2 === 0;
                const card = (
                  <div
                    className={`flex flex-col gap-[14px] pr-[36px] ${below ? "justify-start" : "justify-end"}`}
                  >
                    <div className="flex h-[56px] items-end">
                      <LogoImage
                        logo={deal.logo}
                        maxHeight={56}
                        maxWidth={200}
                        className={`transition-[filter,opacity] duration-500 motion-reduce:transition-none ${reached ? "opacity-100 grayscale-0" : "opacity-40 grayscale"}`}
                      />
                    </div>
                    <h3 className="font-serif text-[clamp(1.35rem,1.6vw,1.6rem)] leading-[1.1] font-normal">
                      {deal.kind}
                    </h3>
                    <p className="max-w-[34ch] text-[15px] leading-[1.5] text-black/70">
                      {deal.line}
                    </p>
                  </div>
                );
                return (
                  <li
                    key={deal.logo.src}
                    className={`relative grid h-full shrink-0 grid-rows-[1fr_auto_1fr] ${COL}`}
                  >
                    <div className="flex flex-col justify-end pb-[18px]">
                      {!below && card}
                      {!below && (
                        <span
                          aria-hidden="true"
                          className="mt-[16px] ml-[27px] h-[22px] border-l border-dashed border-black/40"
                        />
                      )}
                    </div>
                    <div className="relative h-[50px]">
                      {/* The orange run: from this hexagon to the next, once the next is reached. */}
                      {index < count - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute top-1/2 left-[28px] h-[2px] w-full origin-left bg-[#F7A11A] transition-transform duration-500 ease-out motion-reduce:transition-none"
                          style={{
                            transform: `translateY(-50%) scaleX(${reduceMotion || index < active ? 1 : 0})`,
                          }}
                        />
                      )}
                      <svg
                        viewBox="-29 -26 58 52"
                        width="58"
                        height="52"
                        aria-hidden="true"
                        className="relative overflow-visible"
                      >
                        <polygon
                          points={hexPoints(0, 0, 26)}
                          fill={reached ? "#F7A11A" : "#ffffff"}
                          stroke={reached ? "#F7A11A" : "rgba(0,0,0,.35)"}
                          strokeWidth="1.2"
                          className="transition-[fill,stroke] duration-300 motion-reduce:transition-none"
                          style={{
                            filter: lit
                              ? "drop-shadow(0 0 12px rgba(247,161,26,.55))"
                              : "none",
                          }}
                        />
                        <text
                          x="0"
                          y="5"
                          textAnchor="middle"
                          className={`font-[family-name:var(--font-geist-mono)] text-[14px] transition-colors duration-300 motion-reduce:transition-none ${reached ? "fill-white" : "fill-black/55"}`}
                        >
                          {pad(index)}
                        </text>
                      </svg>
                    </div>
                    <div className="flex flex-col justify-start pt-[18px]">
                      {below && (
                        <span
                          aria-hidden="true"
                          className="mb-[16px] ml-[27px] h-[22px] border-l border-dashed border-black/40"
                        />
                      )}
                      {below && card}
                    </div>
                  </li>
                );
              })}
            </motion.ol>
          </div>
        </div>
      </div>
    </section>
  );
}
