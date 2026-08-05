"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/ease";
import CountUp from "./count-up";

/**
 * The two figures. Both are checkable rather than reported: the first is the
 * SEBI statutory minimum for a PMS mandate, the second is the size of the
 * broad-market index the philosophy section already positions us underneath.
 * No firm performance or AUM number appears here, and none should until the
 * client supplies figures that have been through compliance.
 */
const STATS = [
  {
    prefix: "₹",
    value: 50,
    suffix: " lakh",
    copy: "The SEBI minimum for a Portfolio Management Service mandate. An Alternative Investment Fund begins at ₹1 crore.",
    /* Ink panel. White type, so the gold reveal behind it reads as a warm edge
       rather than a flash. */
    tone: "bg-[#111111] text-white",
    sub: "text-[rgba(255,255,255,.62)]",
  },
  {
    prefix: "",
    value: 500,
    suffix: "",
    copy: "The widely covered names most portfolios are built from. Our research begins below them, among businesses fewer analysts reach.",
    tone: "bg-[#eceae5] text-[#111111]",
    sub: "text-[rgba(17,17,17,.6)]",
  },
] as const;

export default function PinnedStats() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);

  // Progress across the whole pinned run, so the photograph can drift for as
  // long as the panel is held rather than only while it is arriving.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const imageDrift = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    /* The track is taller than the viewport; the child pins inside it. Below
       900px the pin is dropped altogether — a sticky full-height panel on a
       phone is mostly a way to trap the scroll. */
    <section
      ref={trackRef}
      data-pinned-track
      aria-label="Where our research begins"
      className="relative h-[190svh] max-[900px]:h-auto"
    >
      <div
        data-pinned-frame
        className="sticky top-0 h-svh overflow-hidden max-[900px]:static max-[900px]:h-auto"
      >
        <div className="grid h-full grid-cols-[1fr_.44fr] max-[900px]:grid-cols-1">
          {/* The photograph is its own clip box so the drift never moves the
              panels beside it. */}
          <div className="relative overflow-hidden max-[900px]:h-[46svh]">
            <motion.div
              style={reduceMotion ? undefined : { scale: imageScale, y: imageDrift }}
              className="absolute inset-[-4%]"
            >
              <Image
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=90"
                alt="An annual report being read and marked up by hand at the research desk"
                fill
                sizes="(max-width: 900px) 100vw, 62vw"
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="grid grid-rows-2 max-[900px]:grid-rows-none">
            {STATS.map(({ prefix, value, suffix, copy, tone, sub }, index) => (
              /* Gold sits underneath each cell. The panel slides across it, so
                 the reveal happens in the gap the panel has not covered yet —
                 the reference does the same thing with its orange and yellow
                 bands, in its own palette.
                 The viewport trigger has to live on the cell, not the panel. A
                 panel parked at x:100% sits entirely off the right edge of the
                 screen, so it never intersects and `whileInView` on it would
                 wait forever. The cell never moves, so it is the honest
                 observer; the panel follows by variant. */
              <motion.div
                key={copy}
                initial={reduceMotion ? false : "hidden"}
                whileInView="shown"
                viewport={{ once: true, amount: 0.35 }}
                className="relative overflow-hidden bg-[#b8862f]"
              >
                <motion.div
                  variants={{
                    hidden: { x: reduceMotion ? 0 : "100%" },
                    shown: {
                      x: 0,
                      transition: {
                        duration: reduceMotion ? 0 : 1.15,
                        delay: reduceMotion ? 0 : index * 0.14,
                        ease: EASE_OUT,
                      },
                    },
                  }}
                  /* Pinned, each panel fills half the viewport and the figure and
                     its caption push to opposite edges. Unpinned there is no
                     height to distribute, so they sit together instead of being
                     stretched apart by a `justify-between` with nothing to
                     justify. */
                  className={`flex h-full flex-col justify-between p-[42px] max-[900px]:justify-start max-[900px]:gap-[26px] max-[900px]:py-[46px] max-[600px]:p-[26px] max-[600px]:py-[38px] ${tone}`}
                >
                  <strong className="text-[clamp(3.4rem,5.2vw,5.4rem)] font-normal leading-[.9] tracking-[-.05em]">
                    {prefix}
                    <CountUp to={value} />
                    {suffix}
                  </strong>
                  <p className={`mt-[24px] max-w-[330px] text-[11px] leading-[1.55] ${sub}`}>{copy}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
