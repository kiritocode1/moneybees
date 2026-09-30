"use client";

import { useRef } from "react";
import { COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { clamp } from "@/components/fact-sections/fact-section";
import { RANKED_RETURNS } from "@/lib/about";
import { hexPoints, useBuild } from "./use-build";

const R = 15;
const PITCH = 2 * R * 1.04;

/**
 * One period's ranking as a row of hexagons, one per place in the PMS Bazaar
 * table the slide shows. Once in view a light steps down from first place and
 * stops at Moneybee's rank, which stays orange; the places around it stay
 * unnamed.
 */
function RankRow({ rank, field, progress }: { rank: number; field: number; progress: number }) {
  // The light's position, in places: it walks to the rank and holds.
  const at = clamp(progress) * (rank - 1);
  const width = (field - 1) * PITCH + 2 * R + 4;
  return (
    <svg viewBox={`-2 -${R + 2} ${width} ${2 * R + 4}`} aria-hidden="true" className="block h-auto w-full max-w-[300px] overflow-visible">
      {Array.from({ length: field }, (_, index) => {
        const place = index + 1;
        const cx = R + index * PITCH;
        const passed = index < at - 0.01;
        const here = Math.abs(index - at) < 0.5;
        const landed = place === rank && progress >= 1;
        return (
          <g key={place}>
            <polygon
              points={hexPoints(cx, 0, R - 1)}
              fill={landed || here ? "#F6A11A" : passed ? "#f3f2ef" : "#ffffff"}
              stroke={landed || here ? "#F6A11A" : "rgba(0,0,0,.3)"}
              strokeWidth="1"
              style={{ filter: landed ? "drop-shadow(0 0 8px rgba(246, 161, 26,.55))" : "none" }}
            />
            <text
              x={cx}
              y="4"
              textAnchor="middle"
              className={`font-[family-name:var(--font-geist-mono)] text-[10px] ${landed || here ? "fill-white" : "fill-black/45"}`}
            >
              {place}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Recognition, group profile p5: Moneybee's place and return in each of the
 * three PMS Bazaar "Top Performance" tables, as on 31 December 2024. The peer
 * funds in those tables stay off the page until compliance clears them.
 */
export default function RankedReturns() {
  const ref = useRef<HTMLDListElement>(null);
  const progress = useBuild(ref, 2200, 0.3);
  return (
    <section aria-labelledby="ranked-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} py-[110px] max-md:py-[80px]`}>
        <Rise onView>
          <span className={`${EYEBROW} text-black/60`}>PMS Bazaar, as on 31 December 2024</span>
          <h2 id="ranked-heading" className={`${SUBHEAD} mt-[14px] max-w-[22ch]`}>
            Ranked among the top performing PMS
          </h2>
        </Rise>
        <dl ref={ref} className="mt-[56px] grid grid-cols-3 gap-[40px] max-[900px]:grid-cols-1 max-[900px]:gap-[48px]">
          {RANKED_RETURNS.map((row, index) => (
            <div key={row.period} className="border-t border-t-black pt-[20px]">
              <dt className={`${EYEBROW} text-black/60`}>
                Ranked {row.ordinal}, {row.period} returns
              </dt>
              <dd className="mt-[18px]">
                <RankRow rank={row.rank} field={row.field} progress={clamp(progress * 1.5 - index * 0.25)} />
                <p className="mt-[26px] font-serif text-[clamp(3rem,5vw,4.6rem)] leading-none text-[#F6A11A] tabular-nums">{row.returns.toFixed(2)}%</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
