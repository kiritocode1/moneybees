"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TEAM } from "@/lib/insights";
import { EASE_OUT } from "@/lib/ease";
import { Materialize } from "@/components/pixel-reveal/materialize";
import { BracketLabel } from "./fact-section";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-[#F7A11A] focus-visible:outline-offset-4";
const pad = (index: number) => String(index + 1).padStart(2, "0");
const PITCH = 5;

/**
 * A portrait redrawn as a halftone: the photo is sampled on a square lattice
 * and each cell becomes a dot sized by how dark it is. It matches the dot
 * language used across the page, and it evens out portraits from two
 * different shoots until one is selected.
 */
function Halftone({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = new window.Image();
    image.src = src;
    let cancelled = false;
    const draw = () => {
      if (cancelled) return;
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      const context = canvas.getContext("2d");
      if (!context || !width) return;
      // Sample the photo at lattice resolution, cropped like object-cover at the top.
      const cols = Math.ceil(width / PITCH);
      const rows = Math.ceil(height / PITCH);
      const probe = document.createElement("canvas");
      probe.width = cols;
      probe.height = rows;
      const sample = probe.getContext("2d");
      if (!sample) return;
      const scale = Math.max(cols / image.width, rows / image.height);
      const sw = cols / scale;
      const sh = rows / scale;
      sample.drawImage(image, (image.width - sw) / 2, (image.height - sh) * 0.2, sw, sh, 0, 0, cols, rows);
      const pixels = sample.getImageData(0, 0, cols, rows).data;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      // Light grey dots, as the reference draws its inactive portraits, so the row reads as one quiet field.
      context.fillStyle = "#8f8e8c";
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const at = (row * cols + col) * 4;
          const luminance = (pixels[at] * 0.299 + pixels[at + 1] * 0.587 + pixels[at + 2] * 0.114) / 255;
          // A contrast curve so only shadows and mid-tones carry dots; bright walls and skin stay open.
          const tone = Math.max(0, Math.min(1, (0.88 - luminance) / 0.7));
          const radius = Math.sqrt(tone) * PITCH * 0.48;
          if (radius < 0.35) continue;
          context.beginPath();
          context.arc(col * PITCH + PITCH / 2, row * PITCH + PITCH / 2, radius, 0, Math.PI * 2);
          context.fill();
        }
      }
    };
    image.onload = draw;
    const resize = new ResizeObserver(() => image.complete && draw());
    resize.observe(canvas);
    return () => {
      cancelled = true;
      resize.disconnect();
    };
  }, [src]);
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/**
 * Team profile, after United Carriers' "people behind the promise" (inspo,
 * reference/inspo-team): a row of portraits at their own small size, every one
 * but the selected person drawn in halftone, and the selected bio beside the
 * row with a counter and previous / next. Hover, focus or click a portrait to
 * select it. The real team photograph from moneybee.in closes the section.
 */
export default function TeamSection() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const member = TEAM[active];
  const step = (by: number) => setActive((current) => (current + by + TEAM.length) % TEAM.length);

  return (
    <section id="team" aria-labelledby="team-heading" className="bg-white">
      <div className="px-[max(32px,calc((100vw_-_1480px)/2))] pt-[120px] max-[600px]:px-[22px] max-[600px]:pt-[72px]">
        <BracketLabel>The people behind the portfolio</BracketLabel>
        <div className="mt-[18px] flex items-end justify-between gap-[40px] border-b border-b-[rgba(0,0,0,.13)] pb-[28px] max-[900px]:flex-col max-[900px]:items-start">
          <Materialize as="h2" id="team-heading" className="text-[clamp(3.6rem,6.4vw,7rem)] leading-[.9] font-light tracking-[-.06em]">
            Team profile
          </Materialize>
          <div className="flex items-center gap-[22px] text-[12px] uppercase tracking-[.08em]">
            <span className="font-mono text-[rgba(0,0,0,.5)] normal-case">
              {pad(active)} / {pad(TEAM.length - 1)}
            </span>
            <button type="button" onClick={() => step(-1)} className={`hover:text-[#F7A11A] ${FOCUS}`}>
              Previous
            </button>
            <button type="button" onClick={() => step(1)} className={`hover:text-[#F7A11A] ${FOCUS}`}>
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(260px,.34fr)_1fr] gap-[40px] px-[max(32px,calc((100vw_-_1480px)/2))] pt-[40px] max-[1000px]:grid-cols-1 max-[600px]:px-[22px]">
        {/* The selected person's bio, left of the row as in the reference. */}
        <div className="min-h-[300px] max-[1000px]:order-2 max-[1000px]:min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE_OUT }}
            >
              <h3 className="text-[clamp(1.8rem,2.4vw,2.4rem)] leading-[1] font-normal tracking-[-.045em]">{member.name}</h3>
              <p className="mt-[8px] text-[11px] uppercase tracking-[.08em] text-[#c98110]">{member.role}</p>
              <ul className="mt-[22px] grid list-none gap-[12px] border-t border-t-[rgba(0,0,0,.13)] p-0 pt-[16px] text-[14px] leading-[1.6] text-[rgba(0,0,0,.76)]">
                {member.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        <ol className="grid list-none grid-cols-6 gap-[10px] p-0 max-[1000px]:order-1 max-[1000px]:grid-cols-3 max-[600px]:grid-cols-2">
          {TEAM.map((person, index) => {
            const on = index === active;
            return (
              <li key={person.name}>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${person.name}, ${person.role}`}
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className={`group block w-full text-left ${FOCUS}`}
                >
                  <span className="relative block aspect-[27/35] overflow-hidden bg-[#F4F3F0]">
                    <Halftone src={person.photo} />
                    <Image
                      src={person.photo}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 45vw, (max-width: 1000px) 30vw, 200px"
                      className="object-cover object-[50%_20%] grayscale transition-opacity duration-500"
                      style={{ opacity: on ? 1 : 0 }}
                    />
                    <i
                      className="absolute top-[8px] right-[8px] h-[8px] w-[8px] bg-[#F7A11A] transition-opacity duration-300"
                      style={{ opacity: on ? 1 : 0 }}
                    />
                  </span>
                  <span className="mt-[10px] flex items-baseline gap-[8px]">
                    <span className="font-mono text-[10px] text-[rgba(0,0,0,.45)]">{pad(index)}</span>
                    <span
                      className="text-[13px] font-[550] tracking-[-.01em] transition-colors duration-300"
                      style={{ color: on ? "#000" : "rgba(0,0,0,.4)" }}
                    >
                      {person.name}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The team photograph from moneybee.in: the one real image large enough to run full width. */}
      <div className="relative mt-[88px] aspect-[1920/1080] max-h-[88svh] w-full overflow-hidden">
        <Image src="/people/moneybee-team.jpg" alt="The Moneybee team at the Mumbai office" fill sizes="100vw" className="object-cover object-[50%_40%]" />
      </div>
    </section>
  );
}
