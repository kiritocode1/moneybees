"use client";

import { useRef } from "react";
import { HEADINGS, STRUCTURE_FUND, STRUCTURE_PARTIES, type StructureSide } from "@/lib/insights";
import { LINE_GLOW, ORANGE, r2, SectionHeading } from "./fact-section";
import { useStageClock } from "./motion-language";

const HOLD = 2.6;
const FUND = { x: 600, y: 330 };
/** Parties sit well clear of the fund so each pair of lanes has room for its two labels. */
const PLACE: Record<StructureSide, { x: number; y: number }> = {
  "top-left": { x: 200, y: 70 },
  "top-right": { x: 1000, y: 70 },
  left: { x: 110, y: 330 },
  right: { x: 1090, y: 330 },
  "bottom-left": { x: 200, y: 590 },
  "bottom-right": { x: 1000, y: 590 },
};

type Point = { x: number; y: number };
const along = (a: Point, b: Point, share: number): Point => ({ x: a.x + (b.x - a.x) * share, y: a.y + (b.y - a.y) * share });

/**
 * The slide's pair of arrows for one party, as two parallel lines between the
 * party and the fund. Dots run each line in its direction: the service one
 * way, the payment back. Returns both lines with their label positions.
 */
function lanes(side: StructureSide) {
  const party = PLACE[side];
  const dx = FUND.x - party.x;
  const dy = FUND.y - party.y;
  const length = Math.hypot(dx, dy);
  const nx = -dy / length;
  const ny = dx / length;
  // Clear of the party's name at one end, and of the fund's box at the other.
  const horizontal = Math.abs(dy) < 1;
  const start = along(party, FUND, (horizontal ? 128 : 60) / length);
  const end = along(party, FUND, 1 - (horizontal ? 160 : 150) / length);
  const shift = (p: Point, by: number) => ({ x: r2(p.x + nx * by), y: r2(p.y + ny * by) });
  return {
    a: [shift(start, 7), shift(end, 7)] as const,
    b: [shift(end, -7), shift(start, -7)] as const,
    labelA: shift(along(start, end, 0.5), 24),
    // A horizontal lane's lower label can wrap to two lines, so it sits further off its line.
    labelB: shift(along(start, end, 0.5), horizontal ? -32 : -24),
    // Labels run along the lane, turned so they never read upside down.
    angle: r2(((Math.atan2(dy, dx) * 180) / Math.PI + 450) % 180 - 90),
  };
}

/** Splits a long arrow label into two lines near its middle, the way the slide's pills break them. */
function labelLines(text: string) {
  if (text.length <= 26) return [text];
  const words = text.split(" ");
  let best = 1;
  for (let cut = 1; cut < words.length; cut += 1) {
    const left = words.slice(0, cut).join(" ").length;
    if (Math.abs(left - text.length / 2) < Math.abs(words.slice(0, best).join(" ").length - text.length / 2)) best = cut;
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

function Lane({ from, to, t, lit }: { from: Point; to: Point; t: number; lit: boolean }) {
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={lit ? ORANGE : "rgba(0,0,0,.28)"}
        strokeWidth={lit ? 1.6 : 1}
        style={{ filter: lit ? LINE_GLOW : "none", transition: "stroke 300ms ease" }}
      />
      {[0, 1, 2].map((dot) => {
        const p = along(from, to, ((t * 0.45 + dot / 3) % 1 + 1) % 1);
        return <circle key={dot} cx={r2(p.x)} cy={r2(p.y)} r={lit ? 4 : 3} fill={lit ? "#000" : "rgba(0,0,0,.35)"} />;
      })}
    </g>
  );
}

/**
 * How Flyingbee is put together, from the deck's structure slide: the fund in
 * the middle, six parties around it, each on a service arrow and a payment
 * arrow. Dots run every line in its direction, and one party at a time lights
 * with its two labels, the way the reference steps through its panels.
 */
/** The diagram alone, for pages that frame it with their own heading. */
export function StructureDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useStageClock(ref, HOLD * STRUCTURE_PARTIES.length - 0.01, 1000);
  const lit = Math.floor(t / HOLD) % STRUCTURE_PARTIES.length;
  return (
      <div ref={ref} className="border-y border-y-[#000] px-[max(32px,calc((100vw_-_1480px)/2))] max-[600px]:px-[12px]">
        <svg viewBox="0 0 1200 660" className="mx-auto w-full max-w-[1240px]" role="img" aria-label="Structure of Flyingbee Investment Fund">
          {STRUCTURE_PARTIES.map((party, index) => {
            const { a, b, labelA, labelB, angle } = lanes(party.side);
            const on = index === lit;
            // Lane a runs party to fund; the service takes it when it flows toward the fund.
            const [serviceLabel, paymentLabel] = party.toFund ? [labelA, labelB] : [labelB, labelA];
            const node = PLACE[party.side];
            return (
              <g key={party.name}>
                <Lane from={a[0]} to={a[1]} t={t} lit={on} />
                <Lane from={b[0]} to={b[1]} t={t} lit={on} />
                {[
                  [serviceLabel, party.service],
                  [paymentLabel, party.payment],
                ].map(([point, text]) => {
                  const { x, y } = point as Point;
                  const lines = labelLines(text as string);
                  return (
                    <text
                      key={text as string}
                      x={x}
                      y={y}
                      transform={`rotate(${angle} ${x} ${y})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fill={on ? "#000" : "rgba(0,0,0,.4)"}
                      style={{ transition: "fill 300ms ease" }}
                    >
                      {lines.map((line, index) => (
                        <tspan key={line} x={x} dy={index === 0 ? (lines.length > 1 ? "-0.55em" : 0) : "1.15em"}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  );
                })}
                <rect x={node.x - 5} y={node.y - 34} width="10" height="10" fill={on ? ORANGE : "#000"} />
                <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize="17" fontWeight="550" fill="#000">
                  {party.name}
                </text>
                <text x={node.x} y={node.y + 16} textAnchor="middle" fontSize="12" fill="rgba(0,0,0,.6)">
                  {party.role}
                </text>
              </g>
            );
          })}
          <rect x={FUND.x - 130} y={FUND.y - 62} width="260" height="124" fill="#fff" stroke="#000" />
          <rect x={FUND.x - 8} y={FUND.y - 44} width="16" height="16" fill={ORANGE} />
          <text x={FUND.x} y={FUND.y + 4} textAnchor="middle" fontSize="18" fontWeight="550" fill="#000">
            {STRUCTURE_FUND.name}
          </text>
          <text x={FUND.x} y={FUND.y + 26} textAnchor="middle" fontSize="11" fill="rgba(0,0,0,.6)">
            (Category III AIF, scheme of Moneybee
          </text>
          <text x={FUND.x} y={FUND.y + 41} textAnchor="middle" fontSize="11" fill="rgba(0,0,0,.6)">
            Investment Trust)
          </text>
        </svg>
      </div>
  );
}

export default function StructureSection() {
  return (
    <section id="structure" aria-labelledby="structure-heading" className="bg-white">
      <SectionHeading
        id="structure"
        label="Structure of Flyingbee Investment Fund"
        heading={HEADINGS.structure}
        lead="An Alternative Investment Fund (AIF) is a privately pooled investment vehicle that collects funds from investors, both Indian and foreign, where collective investments are made into different nontraditional investment options."
      />
      <div className="mt-[56px]">
        <StructureDiagram />
      </div>
    </section>
  );
}
