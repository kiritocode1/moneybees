"use client";

import { useEffect, useRef, useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { PRINCIPLES, type PrinciplesContent } from "@/lib/pages/philosophy-content";

/*
 * Our philosophy, centred on the tholos at Delphi turning on its turntable
 * (tholos-turn.ts), on black as the anatomy kit's dark theme draws. The six principles stand round it, three a side, all at equal
 * weight. Six of the twenty columns belong to them; as each turns through the front it
 * is lit orange and its principle comes up in ink. The model only draws while it is on
 * screen. Reduced motion shows it still, with every principle in ink.
 * The words are edited in /admin; there are always six principles, one per lit column.
 */

type Turn = import("./tholos-turn").TholosTurn;

function Principle({ pillar, index, active }: { pillar: { name: string; text: string }; index: number; active: boolean }) {
  const left = index < 3;
  return (
    <li className={`flex gap-[14px] border-t border-t-white/12 py-[22px] max-[900px]:py-[16px] ${left ? "flex-row-reverse text-right max-[900px]:flex-row max-[900px]:text-left" : ""}`}>
      <i aria-hidden="true" className={`mt-[.55em] h-[8px] w-[8px] shrink-0 transition-colors duration-500 motion-reduce:bg-[#F6A11A] ${active ? "bg-[#F6A11A]" : "bg-white/20"}`} />
      <div className={`transition-opacity duration-500 motion-reduce:opacity-100 ${active ? "opacity-100" : "opacity-45"}`}>
        <h3 className="font-serif text-[clamp(1.15rem,1.5vw,1.5rem)] leading-[1.15] font-bold tracking-[-.015em] text-white">{pillar.name}</h3>
        <p className="mt-[8px] text-[15px] leading-[1.5] text-white/70">{pillar.text}</p>
      </div>
    </li>
  );
}

export function TholosSection({ content = PRINCIPLES }: { content?: PrinciplesContent }) {
  const principles = content.principles ?? [];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let turn: Turn | null = null;
    let raf = 0;
    let running = false;
    let last = 0;
    let shown = -1;
    let cancelled = false;

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      turn?.resize(rect.width, rect.height);
    };
    const draw = (now: number) => {
      if (!turn || !running) return;
      const front = turn.frame(Math.min((now - last) / 1000, 0.05));
      last = now;
      if (front !== shown) {
        shown = front;
        setActive(front);
      }
      raf = requestAnimationFrame(draw);
    };

    const resize = new ResizeObserver(() => {
      size();
      if (turn && !running) turn.frame(0);
    });
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !still;
      cancelAnimationFrame(raf);
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    });

    void import("./tholos-turn").then(({ createTholosTurn }) => {
      if (cancelled) return;
      turn = createTholosTurn(canvas, { still });
      size();
      turn.frame(0);
      resize.observe(canvas);
      io.observe(canvas);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      turn?.dispose();
    };
  }, []);

  return (
    <section id="principles" aria-labelledby="principles-heading" className="bg-[#0b0b0b] py-[120px] text-white max-[600px]:py-[80px]">
      <div className="mx-auto max-w-[1512px] px-6 md:px-[120px]">
        <div className="flex flex-col items-center text-center">
          {content.label ? <BracketLabel>{content.label}</BracketLabel> : null}
          {/* One sentence to a line, so no phrase breaks across two. */}
          <h2 id="principles-heading" className="mt-[22px] font-serif text-[clamp(2.2rem,4.4vw,4.4rem)] leading-[.98] font-bold tracking-[-.03em]">
            {content.heading.split(/(?<=\.)\s+/).map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <div className="mt-[56px] grid grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)_minmax(0,1fr)] items-center gap-x-[24px] max-[900px]:mt-[32px] max-[900px]:grid-cols-1">
          <ol className="m-0 list-none p-0 max-[900px]:order-2">
            {principles.slice(0, 3).map((pillar, index) => (
              <Principle key={index} pillar={pillar} index={index} active={active === index} />
            ))}
          </ol>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="A model of the tholos at Delphi turning on a turntable: twenty Doric columns on a three-step base under a frieze of triglyphs and a conical roof. Six of the columns are lit in turn."
            className="aspect-[1.08] w-full max-[900px]:order-1"
          />
          <ol className="m-0 list-none p-0 max-[900px]:order-3">
            {principles.slice(3, 6).map((pillar, index) => (
              <Principle key={index + 3} pillar={pillar} index={index + 3} active={active === index + 3} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
