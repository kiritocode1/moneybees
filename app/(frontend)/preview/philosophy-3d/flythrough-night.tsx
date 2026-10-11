"use client";

import { motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Bloom, BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN_COUNT, DESCENT_END, ORBIT_END, pillarCentre } from "@/components/philosophy/tholos-path";
import { PILLARS } from "@/lib/insights";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * PREVIEW ONLY. The fly-through on black, in the homepage section's original
 * layout: the scene runs full width with the lit column framed right of
 * centre, the heading opens centred over it, each pillar's name and sentence
 * set large at the lower left in white over a soft dark falloff, and the six
 * as a rail on the right. Weathered marble and gilt from ./tholos-real-fly.ts.
 */

const PILLAR_SPAN = (ORBIT_END - DESCENT_END) / COLUMN_COUNT;

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

function cardRange(index: number) {
  const centre = pillarCentre(index);
  return [centre - PILLAR_SPAN * 0.5, centre - PILLAR_SPAN * 0.26, centre + PILLAR_SPAN * 0.26, centre + PILLAR_SPAN * 0.5];
}

const cardPresence = (value: number) => Math.max(...PILLARS.map((_, index) => between(value, cardRange(index), [0, 1, 1, 0])));

function PillarCard({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const range = cardRange(index);
  const opacity = useTransform(progress, (value) => between(value, range, [0, 1, 1, 0]));
  const y = useTransform(progress, (value) => between(value, range, [24, 0, 0, -24]));
  const pillar = PILLARS[index];
  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, y }}
      className="pointer-events-none absolute bottom-[max(56px,9svh)] left-[max(24px,calc((100vw_-_1512px)/2_+_120px))] w-[min(460px,calc(100vw_-_48px))] motion-reduce:hidden"
    >
      <p className="font-serif text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[.95] font-bold tracking-[-.03em] text-white">{pillar.name}</p>
      <p className="mt-[22px] max-w-[29ch] text-[clamp(1.1rem,1.45vw,1.4rem)] leading-[1.45] text-white/75">{pillar.text}</p>
    </motion.div>
  );
}

export function FlythroughNight() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bloomRef = useRef<SVGEllipseElement>(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(-1);
  const [together, setTogether] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
    setActive(value < DESCENT_END || value > ORBIT_END ? -1 : Math.min(COLUMN_COUNT - 1, Math.floor((value - DESCENT_END) / PILLAR_SPAN)));
    setTogether(value > ORBIT_END + 0.05);
  });

  // The heading opens alone on black; the scene comes up as it leaves, as the original did.
  const introOpacity = useTransform(scrollYProgress, (value) => between(value, [0, DESCENT_END * 0.25, DESCENT_END * 0.5], [1, 1, 0]));
  const sceneOpacity = useTransform(scrollYProgress, (value) => between(value, [0, DESCENT_END * 0.2, DESCENT_END * 0.55], [0, 0, 1]));
  const falloffOpacity = useTransform(scrollYProgress, cardPresence);
  // Gone once the camera leaves the ring for the centre, before the gilt shafts fill the frame.
  const railOpacity = useTransform(scrollYProgress, (value) => between(value, [DESCENT_END * 0.8, DESCENT_END, ORBIT_END, ORBIT_END + 0.04], [0, 1, 1, 0]));
  // The frame's foot fades to black before the pin releases, so the section hands over cleanly.
  const exitOpacity = useTransform(scrollYProgress, (value) => between(value, [0.96, 0.998], [0, 1]));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};
    void import("./tholos-real-fly").then(({ createRealFlythrough }) => {
      if (disposed) return;
      const tholos = createRealFlythrough(canvas, { dark: true, shift: 0.18 });
      const size = () => tholos.resize(canvas.clientWidth, canvas.clientHeight);
      size();
      const resizer = new ResizeObserver(size);
      resizer.observe(canvas);
      let raf = 0;
      let previous = performance.now();
      const tick = (now: number) => {
        const pose = tholos.frame(reduceMotion ? 0 : progressRef.current, Math.min(now - previous, 50) / 1000);
        previous = now;
        const bloom = bloomRef.current;
        if (pose && bloom) {
          bloom.setAttribute("cx", String(pose.bloom.x));
          bloom.setAttribute("cy", String(pose.bloom.y));
          bloom.style.opacity = String(pose.bloom.opacity);
        }
        raf = requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(raf);
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
    <section ref={sectionRef} id="pillars" aria-labelledby="pillars-heading" className="relative h-[340svh] bg-black text-white motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:relative motion-reduce:h-[70svh]">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
          <defs>
            <Bloom id="night-bloom" />
          </defs>
          <ellipse ref={bloomRef} rx="16%" ry="40%" fill="url(#night-bloom)" style={{ opacity: 0 }} />
        </svg>
        <motion.canvas ref={canvasRef} aria-hidden="true" style={{ opacity: sceneOpacity }} className="absolute inset-0 h-full w-full motion-reduce:!opacity-100" />
        <motion.div aria-hidden="true" style={{ opacity: exitOpacity }} className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_35%,#000_92%)] motion-reduce:hidden" />

        <motion.div style={{ opacity: introOpacity }} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center motion-reduce:sr-only">
          <BracketLabel>Our philosophy</BracketLabel>
          <h2 id="pillars-heading" className="mt-[22px] font-serif text-[clamp(3rem,7vw,7.4rem)] leading-[.92] font-bold tracking-[-.03em]">
            Our investment philosophy
          </h2>
        </motion.div>

        {/* A soft black falloff behind the pillar text, so the sentence never sits on a lit flute. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: falloffOpacity }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_72%_at_0%_100%,rgba(0,0,0,.95)_0%,rgba(0,0,0,.78)_42%,transparent_80%)] motion-reduce:hidden"
        />
        {PILLARS.map((pillar, index) => (
          <PillarCard key={pillar.name} index={index} progress={scrollYProgress} />
        ))}

        {/* The same falloff behind the rail, so its labels never sit on a column. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: railOpacity }}
          className="pointer-events-none absolute inset-y-0 right-0 w-[34vw] bg-[radial-gradient(ellipse_100%_42%_at_100%_50%,rgba(0,0,0,.92)_0%,rgba(0,0,0,.7)_45%,transparent_80%)] max-[900px]:hidden motion-reduce:hidden"
        />
        <motion.ol
          aria-hidden="true"
          style={{ opacity: railOpacity }}
          className="pointer-events-none absolute top-1/2 right-[max(32px,calc((100vw_-_1512px)/2_+_32px))] grid -translate-y-1/2 list-none gap-[10px] p-0 max-[900px]:hidden motion-reduce:hidden"
        >
          {PILLARS.map((pillar, index) => (
            <li
              key={pillar.name}
              className="flex items-center justify-end gap-[12px] text-[15px] transition-colors duration-200"
              style={{ color: index === active || together ? "#fff" : "rgba(255,255,255,.4)" }}
            >
              {pillar.name}
              <span className={`h-[8px] w-[8px] transition-colors duration-200 ${index === active || together ? "bg-[#F6A11A]" : "bg-white/20"}`} />
            </li>
          ))}
        </motion.ol>
      </div>

      <ul className="sr-only motion-reduce:not-sr-only motion-reduce:mx-auto motion-reduce:grid motion-reduce:max-w-[1512px] motion-reduce:grid-cols-3 motion-reduce:gap-10 motion-reduce:px-6 motion-reduce:pb-[120px] md:motion-reduce:px-[120px] max-[900px]:motion-reduce:grid-cols-1">
        {PILLARS.map((pillar) => (
          <li key={pillar.name} className="border-t border-white/20 pt-[18px]">
            <p className="font-serif text-[1.6rem] font-semibold tracking-[-.02em]">{pillar.name}</p>
            <p className="mt-[10px] text-[14px] leading-[1.55] text-white/70">{pillar.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
