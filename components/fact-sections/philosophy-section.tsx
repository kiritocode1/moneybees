"use client";

import { useRef } from "react";
import { HEADINGS, PHILOSOPHY_SOURCE, PILLARS } from "@/lib/insights";
import { LINE_GLOW, ORANGE, r2, SectionFooter, SectionHeading } from "./fact-section";
import { Panel, SplitFrame, typedWords, useStageClock } from "./motion-language";

const HOLD = 2.8;
const HEX = 58;

/** A flat-topped hexagon's points around (cx, cy). */
function hexPoints(cx: number, cy: number, radius: number) {
  return Array.from({ length: 6 }, (_, corner) => {
    const angle = (Math.PI / 3) * corner;
    return `${r2(cx + radius * Math.cos(angle))},${r2(cy + radius * Math.sin(angle))}`;
  }).join(" ");
}

/** Six pillars ringed around the centre, as the deck's hexagon cluster sets them. */
const CELLS = PILLARS.map((_, index) => {
  const angle = (Math.PI / 3) * index - Math.PI / 2;
  return { cx: r2(200 + Math.cos(angle) * HEX * 1.78), cy: r2(190 + Math.sin(angle) * HEX * 1.78) };
});

/**
 * "Know Venture. Know Gain." The deck's six-pillar hexagon cluster, lit one
 * pillar at a time on its own clock. Beside it, the reference's stacked list:
 * the current pillar has a solid bullet and its sentence types in, earlier
 * ones drop to hollow bullets and grey.
 */
export default function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useStageClock(ref, HOLD * PILLARS.length - 0.01, HOLD * PILLARS.length);
  const lit = Math.min(PILLARS.length - 1, Math.floor(t / HOLD));
  const within = t - lit * HOLD;
  const { settled, newest } = typedWords(PILLARS[lit].text, within, 0.15, 0.09);

  return (
    <section id="philosophy-pillars" aria-labelledby="philosophy-pillars-heading" className="bg-white">
      <SectionHeading id="philosophy-pillars" label="Our investment philosophy" heading={HEADINGS.philosophy} />
      <div ref={ref} className="mt-[72px]">
        <SplitFrame>
          <Panel className="grid place-items-center">
            <svg viewBox="0 0 400 380" className="w-[min(88%,460px)]" role="img" aria-label="Six pillars of the investment philosophy">
              <defs>
                <radialGradient id="pillar-bloom">
                  <stop offset="0%" stopColor={ORANGE} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle
                cx={CELLS[lit].cx}
                cy={CELLS[lit].cy}
                r="110"
                fill="url(#pillar-bloom)"
                style={{ transition: "cx 500ms cubic-bezier(.16,1,.3,1), cy 500ms cubic-bezier(.16,1,.3,1)" }}
              />
              <polygon points={hexPoints(200, 190, HEX - 4)} fill="#000" />
              <rect x="192" y="182" width="16" height="16" fill={ORANGE} />
              {CELLS.map(({ cx, cy }, index) => (
                <g key={index}>
                  <polygon
                    points={hexPoints(cx, cy, HEX - 4)}
                    fill={index === lit ? ORANGE : "#fff"}
                    stroke={index === lit ? ORANGE : "rgba(0,0,0,.55)"}
                    strokeWidth="1.2"
                    style={{ filter: index === lit ? LINE_GLOW : "none", transition: "fill 350ms ease, stroke 350ms ease" }}
                  />
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="ui-monospace, Menlo, monospace"
                    fill={index === lit ? "#000" : "rgba(0,0,0,.45)"}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </text>
                </g>
              ))}
            </svg>
          </Panel>
          <Panel className="flex flex-col justify-center gap-[34px] p-[40px] max-[600px]:p-[24px]">
            <ul className="list-none p-0">
              {PILLARS.map((pillar, index) => (
                <li
                  key={pillar.name}
                  className="flex items-center gap-[12px] py-[5px] text-[clamp(1.1rem,1.6vw,1.5rem)] font-light tracking-[-.03em]"
                  style={{ color: index === lit ? "#000" : index < lit ? "rgba(0,0,0,.35)" : "rgba(0,0,0,.18)", transition: "color 300ms ease" }}
                >
                  <span
                    className="h-[8px] w-[8px] shrink-0 rounded-full"
                    style={{
                      background: index === lit ? "#000" : "transparent",
                      border: index === lit ? "none" : "1px solid rgba(0,0,0,.35)",
                    }}
                  />
                  {pillar.name}
                </li>
              ))}
            </ul>
            <p className="min-h-[4.8em] max-w-[46ch] text-[15px] leading-[1.6] text-[#000000]">
              {settled} {newest && <span className="text-[rgba(0,0,0,.4)]">{newest}</span>}
            </p>
          </Panel>
        </SplitFrame>
      </div>
      <SectionFooter source={PHILOSOPHY_SOURCE} />
    </section>
  );
}
