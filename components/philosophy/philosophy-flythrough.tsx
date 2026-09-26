"use client";

import { motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { HEADINGS, PILLARS } from "@/lib/insights";
import { COLUMN_COUNT, DESCENT_END, ORBIT_END, pillarCentre } from "./tholos";

/**
 * Our philosophy as a camera move. The section is pinned while you scroll
 * through it: the camera opens looking straight down on the tholos, comes down
 * on the right, travels the ring past each of the six columns, lighting one at
 * a time with its pillar beside it, then goes in to the centre where all six
 * light together. Scrolling on leaves the pin and runs into the next section.
 */

const PILLAR_SPAN = (ORBIT_END - DESCENT_END) / COLUMN_COUNT;

/**
 * Piecewise-linear map from `input` stops to `output` stops, clamped. Used via
 * useTransform's function form: Motion hands the array form to the browser's
 * scroll timeline, which mis-maps these ranges once the scroll runs past them.
 */
function between(value: number, input: readonly number[], output: readonly number[]) {
  if (value <= input[0]) return output[0];
  for (let i = 1; i < input.length; i += 1) {
    if (value <= input[i]) {
      const t = (value - input[i - 1]) / (input[i] - input[i - 1]);
      return output[i - 1] + (output[i] - output[i - 1]) * t;
    }
  }
  return output[output.length - 1];
}

/** Scroll stops over which pillar `index`'s card fades in, holds and fades out. */
function cardRange(index: number) {
  const centre = pillarCentre(index);
  return [centre - PILLAR_SPAN * 0.5, centre - PILLAR_SPAN * 0.28, centre + PILLAR_SPAN * 0.28, centre + PILLAR_SPAN * 0.5];
}

/** How visible the most visible pillar card is at `value`. */
const cardPresence = (value: number) =>
  Math.max(...PILLARS.map((_, index) => between(value, cardRange(index), [0, 1, 1, 0])));

/** The opening: the heading alone on paper, then the scene fading in as the heading leaves. */
const INTRO_END = 0.065;
const SCENE_IN = [0.03, 0.075] as const;

function PillarCard({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const range = cardRange(index);
  const opacity = useTransform(progress, (value) => between(value, range, [0, 1, 1, 0]));
  const y = useTransform(progress, (value) => between(value, range, [24, 0, 0, -24]));
  const pillar = PILLARS[index];
  return (
    <motion.article
      style={{ opacity, y }}
      className="pointer-events-none absolute bottom-[max(48px,8svh)] left-[max(32px,calc((100vw_-_1480px)/2))] w-[min(600px,calc(100vw_-_64px))] motion-reduce:hidden max-[600px]:left-[14px] max-[600px]:w-[calc(100vw_-_28px)] max-[600px]:bg-white/88 max-[600px]:p-[16px] max-[600px]:backdrop-blur-[6px]"
    >
      <h3 className="text-[clamp(2.2rem,4.4vw,4.4rem)] leading-[.95] font-light tracking-[-.05em] text-[#F7A11A]">{pillar.name}</h3>
      <p className="mt-[20px] max-w-[34ch] text-[clamp(1.15rem,1.55vw,1.45rem)] leading-[1.45] text-[rgba(0,0,0,.82)]">{pillar.text}</p>
    </motion.article>
  );
}

export default function PhilosophyFlythrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
    const index = value < DESCENT_END || value > ORBIT_END ? -1 : Math.min(COLUMN_COUNT - 1, Math.floor((value - DESCENT_END) / PILLAR_SPAN));
    setActive(index);
  });

  const introOpacity = useTransform(scrollYProgress, (value) => between(value, [0, SCENE_IN[0], INTRO_END], [1, 1, 0]));
  const sceneOpacity = useTransform(scrollYProgress, (value) => between(value, [0, ...SCENE_IN], [0, 0, 1]));
  const scrimOpacity = useTransform(scrollYProgress, cardPresence);
  // After the look-up has held, the lower frame fades to paper, so when the pin releases
  // the frame's bottom edge meets the next section as white instead of cutting the ring.
  const exitOpacity = useTransform(scrollYProgress, (value) => between(value, [0.965, 0.998], [0, 1]));
  const railOpacity = useTransform(scrollYProgress, (value) =>
    between(value, [DESCENT_END * 0.8, DESCENT_END, ORBIT_END, ORBIT_END + 0.03], [0, 1, 1, 0]),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};
    // three.js is only fetched once this section mounts.
    void import("./tholos").then(({ createTholos }) => {
      if (disposed) return;
      const tholos = createTholos(canvas);
      const size = () => tholos.resize(canvas.clientWidth, canvas.clientHeight);
      size();
      const resizer = new ResizeObserver(size);
      resizer.observe(canvas);

      let raf = 0;
      let previous = performance.now();
      const tick = (now: number) => {
        // Reduced motion holds the opening overhead view, where the whole ring is in frame.
        tholos.frame(reduceMotion ? 0 : progressRef.current, Math.min(now - previous, 50) / 1000);
        previous = now;
        raf = requestAnimationFrame(tick);
      };
      // Only render while the pinned frame is on screen.
      const io = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (entry.isIntersecting) {
          previous = performance.now();
          raf = requestAnimationFrame(tick);
        }
      });
      io.observe(canvas);
      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        resizer.disconnect();
        tholos.dispose();
      };
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [reduceMotion]);

  return (
    // One structure for both motion settings, switched by `motion-reduce:` in CSS: the server cannot
    // know the setting, so branching in React would render a different tree on the client.
    <section ref={sectionRef} id="philosophy-pillars" aria-labelledby="philosophy-pillars-heading" className="relative h-[760svh] bg-white motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-[70svh]">
        <motion.canvas
          ref={canvasRef}
          style={{ opacity: sceneOpacity }}
          className="absolute inset-0 h-full w-full motion-reduce:!opacity-100"
          aria-hidden="true"
        />
        <motion.div
          aria-hidden="true"
          style={{ opacity: exitOpacity }}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,#fff_92%)] motion-reduce:hidden"
        />

        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-[22px] text-center motion-reduce:hidden"
        >
          <BracketLabel>Our philosophy</BracketLabel>
          <h2 id="philosophy-pillars-heading" className="mt-[22px] text-[clamp(3rem,7vw,7.6rem)] leading-[.92] font-light tracking-[-.055em]">
            {HEADINGS.philosophy}
          </h2>
        </motion.div>

        {/* Paper behind the pillar text, fading out toward the columns, so the sentence never sits on flutes. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: scrimOpacity }}
          className="pointer-events-none absolute inset-y-0 left-0 w-[min(760px,70vw)] bg-[linear-gradient(to_right,rgba(255,255,255,.94)_0%,rgba(255,255,255,.82)_45%,transparent_100%)] motion-reduce:hidden max-[600px]:hidden"
        />
        {PILLARS.map((pillar, index) => (
          <PillarCard key={pillar.name} index={index} progress={scrollYProgress} />
        ))}

        {/* The six as a rail, so you always know which one you are on and how many are left. */}
        <motion.ol
          style={{ opacity: railOpacity }}
          className="pointer-events-none absolute top-1/2 right-[max(32px,calc((100vw_-_1480px)/2))] grid -translate-y-1/2 list-none gap-[10px] p-0 max-[900px]:hidden motion-reduce:hidden"
        >
          {PILLARS.map((pillar, index) => (
            <li
              key={pillar.name}
              className="flex items-center justify-end gap-[12px] text-[15px] transition-colors duration-300"
              style={{ color: index === active ? "#000" : "rgba(0,0,0,.45)" }}
            >
              {pillar.name}
              <span className={`h-[8px] w-[8px] transition-colors duration-300 ${index === active ? "bg-[#F7A11A]" : "bg-[rgba(0,0,0,.18)]"}`} />
            </li>
          ))}
        </motion.ol>
      </div>

      {/* Reduced motion: the still opening view above, and the six as a plain list. */}
      <div className="hidden grid-cols-3 gap-[40px] px-[max(32px,calc((100vw_-_1480px)/2))] pb-[100px] motion-reduce:grid max-[900px]:grid-cols-1 max-[600px]:px-[22px]">
        <p aria-hidden="true" className="col-span-full text-[clamp(2.6rem,5vw,5rem)] leading-[.95] font-light tracking-[-.05em]">
          {HEADINGS.philosophy}
        </p>
        {PILLARS.map((pillar) => (
          <div key={pillar.name}>
            <h3 className="text-[1.6rem] font-light tracking-[-.03em] text-[#F7A11A]">{pillar.name}</h3>
            <p className="mt-[10px] text-[14px] leading-[1.55] text-[rgba(0,0,0,.72)]">{pillar.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
