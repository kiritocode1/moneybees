"use client";

import { motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Bloom, BracketLabel } from "@/components/fact-sections/fact-section";
import { COLUMN_COUNT, DESCENT_END, ORBIT_END, pillarCentre } from "@/components/philosophy/tholos-path";
import { PILLARS } from "@/lib/insights";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * PREVIEW ONLY. The homepage fly-through's camera move with the detailed,
 * weathered tholos drawn in the site's hairline style (./tholos-fly.ts). The
 * pinned frame is split: the pillar text holds its own column on the left and
 * the scene runs on the right, fading out toward the text, so nothing is ever
 * set over the columns.
 */

const PILLAR_SPAN = (ORBIT_END - DESCENT_END) / COLUMN_COUNT;

/** Piecewise-linear map, clamped; used through useTransform's function form. */
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
  return [centre - PILLAR_SPAN * 0.5, centre - PILLAR_SPAN * 0.25, centre + PILLAR_SPAN * 0.25, centre + PILLAR_SPAN * 0.5];
}

function PillarCard({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const range = cardRange(index);
  const opacity = useTransform(progress, (value) => between(value, range, [0, 1, 1, 0]));
  const y = useTransform(progress, (value) => between(value, range, [18, 0, 0, -18]));
  const pillar = PILLARS[index];
  return (
    <motion.div aria-hidden="true" style={{ opacity, y }} className="absolute inset-x-0 top-0">
      <p className="font-serif text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[.98] font-bold tracking-[-.03em] text-black">{pillar.name}</p>
      <p className="mt-[22px] max-w-[30ch] border-t border-black/15 pt-[18px] text-[clamp(1.05rem,1.3vw,1.3rem)] leading-[1.45] text-black/75">{pillar.text}</p>
    </motion.div>
  );
}

/** "drawn" is the paper-and-ink scene; "real" is marble and gilt with a hairline accent. */
export function FlythroughDrawn({ look = "drawn" }: { look?: "drawn" | "real" }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bloomRef = useRef<SVGEllipseElement>(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(-1);
  // At the centre all six light, in the scene and in the list.
  const [together, setTogether] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
    const index = value < DESCENT_END || value > ORBIT_END ? -1 : Math.min(COLUMN_COUNT - 1, Math.floor((value - DESCENT_END) / PILLAR_SPAN));
    setActive(index);
    setTogether(value > ORBIT_END + 0.05);
  });


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};
    const load =
      look === "real"
        ? import("./tholos-real-fly").then(({ createRealFlythrough }) => createRealFlythrough)
        : import("./tholos-fly").then(({ createDrawnFlythrough }) => createDrawnFlythrough);
    void load.then((create) => {
      if (disposed) return;
      const tholos = create(canvas);
      const size = () => tholos.resize(canvas.clientWidth, canvas.clientHeight);
      size();
      const resizer = new ResizeObserver(size);
      resizer.observe(canvas);
      let raf = 0;
      let previous = performance.now();
      const tick = (now: number) => {
        // Reduced motion holds the overhead opening, where the whole ring is in frame.
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
  }, [reduceMotion, look]);

  return (
    <section ref={sectionRef} id="pillars" aria-labelledby="pillars-heading" className="relative h-[460svh] bg-white motion-reduce:h-auto">
      <div className="sticky top-0 grid h-svh grid-cols-[minmax(0,.62fr)_minmax(0,1fr)] overflow-hidden motion-reduce:relative max-[900px]:grid-cols-1 max-[900px]:grid-rows-[56svh_minmax(0,1fr)]">
        {/* The text column. */}
        <div className="relative z-[1] flex flex-col justify-center pr-[clamp(24px,3vw,56px)] pl-[max(24px,calc((100vw_-_1512px)/2_+_120px))] max-[900px]:order-2 max-[900px]:justify-start max-[900px]:pt-2 max-[900px]:pl-6">
          <BracketLabel>Our philosophy</BracketLabel>
          <h2 id="pillars-heading" className="mt-[18px] font-serif text-[clamp(2.1rem,3.2vw,3rem)] leading-[1.05] font-bold tracking-[-.025em] max-[900px]:text-[1.6rem]">
            Our investment philosophy
          </h2>
          <div className="relative mt-[48px] h-[min(300px,34svh)] max-[900px]:mt-6 motion-reduce:hidden">
            {PILLARS.map((pillar, index) => (
              <PillarCard key={pillar.name} index={index} progress={scrollYProgress} />
            ))}
          </div>
          {/* Where you are among the six. */}
          <ol aria-hidden="true" className="mt-[28px] grid list-none gap-[8px] p-0 max-[900px]:hidden motion-reduce:hidden">
            {PILLARS.map((pillar, index) => (
              <li key={pillar.name} className="flex items-center gap-[12px] text-[14px] transition-colors duration-200" style={{ color: index === active || together ? "#000" : "rgba(0,0,0,.4)" }}>
                <span className={`h-[8px] w-[8px] shrink-0 transition-colors duration-200 ${index === active || together ? "bg-[#F6A11A]" : "bg-black/15"}`} />
                {pillar.name}
              </li>
            ))}
          </ol>
        </div>

        {/* The scene, fading out toward the text so its edge never cuts a column. */}
        <div className="relative max-[900px]:order-1">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <Bloom id="fly-bloom" />
            </defs>
            <ellipse ref={bloomRef} rx="22%" ry="38%" fill="url(#fly-bloom)" style={{ opacity: 0 }} />
          </svg>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_right,transparent,#000_14%)] max-[900px]:[mask-image:linear-gradient(to_bottom,#000_82%,transparent)]"
          />
        </div>
      </div>

      {/* The six as the section's one semantic list. */}
      <ul className="sr-only">
        {PILLARS.map((pillar) => (
          <li key={pillar.name}>
            {pillar.name}: {pillar.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
