"use client";

import { useRef } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { AIF_CONCEPT, AIF_HEADINGS } from "@/lib/aif";
import { at, type Box, box, wireBox } from "./iso";
import { stagger, useBuild } from "./use-build";

const INK = "rgba(0,0,0,.7)";
const FACE = { top: "#fbfaf8", left: "#e9e7e2", right: "#f3f1ed" };
const OWN = { top: "#F7A11A", left: "#c97f0c", right: "#e3920f" };

/** Six holdings on a 3 by 2 grid, heights as drawn only: this figure shows ownership, not weights. */
const HOLDINGS = [58, 92, 44, 110, 70, 52].map((height, index) => ({ col: index % 3, row: Math.floor(index / 3), height }));

function Solid({ faces, fill, lift = 0, opacity = 1 }: { faces: Box; fill: typeof FACE; lift?: number; opacity?: number }) {
  return (
    <g transform={`translate(0 ${-lift})`} opacity={opacity} stroke={INK} strokeWidth="0.9" strokeLinejoin="round">
      <path d={faces.left} fill={fill.left} />
      <path d={faces.right} fill={fill.right} />
      <path d={faces.top} fill={fill.top} />
    </g>
  );
}

/** The six holdings standing on a plate at screen (ox, oy), sorted far to near. */
function holdings(ox: number, oy: number, fill: typeof FACE, progress: number, offset: number) {
  return HOLDINGS.map(({ col, row, height }, index) => ({
    index,
    faces: box(24 + col * 58, 24 + row * 70, 36, 36, height, 10, ox, oy),
    fill,
    rise: stagger(progress, index + offset, 14, 0.25),
  })).sort((a, b) => a.faces.depth - b.faces.depth);
}

/**
 * The one line that separates the two products (AIF presentation p2), drawn
 * as two isometric plates. In a PMS the six stocks stand on your own demat
 * plate, in orange because they are yours. In an AIF the same stocks stand
 * in the fund, grey, and what lands on your plate is a stack of units. The
 * PMS side builds first, then the fund, then the units drop in.
 */
function OwnershipFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useBuild(ref, 3.2, 0.35);

  const pmsPlate = box(0, 0, 200, 170, 10, 0, 200, 200);
  const fundPlate = box(0, 0, 200, 170, 10, 0, 690, 150);
  const demat = box(0, 0, 110, 110, 10, 0, 900, 312);
  const units = [0, 1, 2, 3].map((index) => ({
    index,
    faces: box(22, 22, 66, 66, 9, 10 + index * 12, 900, 312),
    drop: stagger(progress, 10 + index, 14, 0.25),
  }));
  const plates = stagger(progress, 0, 14, 0.2);
  const link = [at(200, 120, 10, 690, 150), at(20, 55, 12, 900, 312)] as const;
  const fundWire = stagger(progress, 6, 14, 0.3);

  return (
    <div ref={ref} className="relative w-full">
      <svg
        viewBox="0 0 1000 420"
        role="img"
        aria-label="In a PMS the stocks sit in your own demat account. In an AIF the stocks sit in the fund, and your demat account holds units of the fund."
        className="block h-auto w-full overflow-visible"
      >
        <Solid faces={pmsPlate} fill={FACE} opacity={plates} />
        {holdings(200, 200, OWN, progress, 1).map(({ index, faces, fill, rise }) => (
          <Solid key={`pms-${index}`} faces={faces} fill={fill} lift={(1 - rise) * 40} opacity={rise} />
        ))}

        <Solid faces={fundPlate} fill={FACE} opacity={plates} />
        {holdings(690, 150, FACE, progress, 4).map(({ index, faces, fill, rise }) => (
          <Solid key={`fund-${index}`} faces={faces} fill={fill} lift={(1 - rise) * 40} opacity={rise} />
        ))}
        <path
          d={wireBox(0, 0, 200, 170, 150, 690, 150)}
          fill="none"
          stroke="rgba(0,0,0,.4)"
          strokeDasharray="2 6"
          strokeLinecap="round"
          opacity={fundWire}
        />

        {/* Units leave the fund for your account. */}
        <path
          d={`M${link[0][0].toFixed(2)} ${link[0][1].toFixed(2)} L${link[1][0].toFixed(2)} ${link[1][1].toFixed(2)}`}
          fill="none"
          stroke="#F7A11A"
          strokeWidth="1.4"
          strokeDasharray="3 6"
          strokeLinecap="round"
          opacity={stagger(progress, 9, 14, 0.2)}
        />
        <Solid faces={demat} fill={FACE} opacity={plates} />
        {units.map(({ index, faces, drop }) => (
          <Solid key={`unit-${index}`} faces={faces} fill={OWN} lift={(1 - drop) * 60} opacity={drop} />
        ))}
      </svg>
      {/* Keys for the three plates, in the SVG's own units so they track it at every width. */}
      <div aria-hidden="true" className={`${EYEBROW} pointer-events-none absolute inset-0 text-black/60`}>
        {(
          [
            ["PMS", "Your demat account", 221, 312],
            ["AIF", "The fund", 711, 262],
            ["", "Your demat account", 900, 392],
          ] as const
        ).map(([tag, label, x, y]) => (
          <span
            key={`${x}-${y}`}
            className="absolute flex items-center gap-[8px] whitespace-nowrap max-sm:text-[8px]"
            style={{ left: `${(x / 1000) * 100}%`, top: `${(y / 420) * 100}%`, translate: "-50% 0", opacity: plates }}
          >
            {tag && <b className="bg-black px-[6px] py-[2px] font-normal text-white">{tag}</b>}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** What an AIF is: the deck's definition, the PMS and AIF difference, and the figure that draws it. */
export default function ConceptSection() {
  return (
    <section id="concept" aria-labelledby="concept-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 gap-12 pt-[110px] pb-[40px] md:grid-cols-[1fr_1fr]`}>
        <Rise onView>
          <BracketLabel>Concept of alternative investment fund</BracketLabel>
          <h2 id="concept-heading" className={`mt-[18px] ${SUBHEAD}`}>
            {AIF_HEADINGS.concept}
          </h2>
        </Rise>
        <Rise onView delay={0.08}>
          <div className="flex flex-col gap-6 md:pt-[42px]">
            <p className={BODY}>{AIF_CONCEPT.pooled}</p>
            <p className={`${BODY} text-black/70`}>{AIF_CONCEPT.units}</p>
          </div>
        </Rise>
      </div>
      <div className={`${COLUMN} pb-[110px]`}>
        <OwnershipFigure />
      </div>
    </section>
  );
}
