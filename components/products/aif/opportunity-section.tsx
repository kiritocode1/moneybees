"use client";

import FactSection, { DetailRows, Eyebrow, type FigureState, FOCUS, PanelTitle, riseAt, SOLID_GLOW, useEased } from "@/components/fact-sections/fact-section";
import { AIF_HEADINGS, OPPORTUNITIES } from "@/lib/aif";
import { at, box } from "./iso";

const W = 250;
const D = 170;
const H = 24;
const GAP = 16;
const OX = 300;
const OY = 300;
/** How far the lit slab slides out toward the viewer, in plan units. */
const SLIDE = 70;

const PAPER = { top: "#fbfaf8", left: "#e6e4df", right: "#f1efeb" };
const LIT = { top: "#F7A11A", left: "#c97f0c", right: "#e3920f" };

/** One benefit's slab. It glides out and back as the lit panel changes. */
function Slab({ index, lit, rise, labels, onSelect }: { index: number; lit: boolean; rise: number; labels: boolean; onSelect: () => void }) {
  const slide = useEased(lit ? SLIDE : 0, 6);
  const z = (OPPORTUNITIES.length - 1 - index) * (H + GAP);
  const faces = box(slide, slide * 0.35, W, D, H, z, OX, OY);
  const fill = lit ? LIT : PAPER;
  // The leader leaves from the slab's right-hand corner, halfway up its side. Labels keep the resting height so they never crowd.
  const [cornerX, cornerY] = at(W + slide, slide * 0.35, z + H / 2, OX, OY);
  const [, labelY] = at(W, 0, z + H / 2, OX, OY);
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={OPPORTUNITIES[index].name}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect();
      }}
      className={`cursor-pointer outline-none ${FOCUS}`}
      transform={`translate(0 ${-(1 - rise) * 60})`}
      opacity={rise}
    >
      <g stroke={lit ? "rgba(90,50,0,.75)" : "rgba(0,0,0,.62)"} strokeWidth="0.9" strokeLinejoin="round" style={{ filter: lit ? SOLID_GLOW : "none" }}>
        <path d={faces.left} fill={fill.left} />
        <path d={faces.right} fill={fill.right} />
        <path d={faces.top} fill={fill.top} />
      </g>
      {labels && (
        <>
      <path d={`M${(cornerX + 8).toFixed(2)} ${cornerY.toFixed(2)} L${(cornerX + 30).toFixed(2)} ${labelY.toFixed(2)} L590 ${labelY.toFixed(2)}`} fill="none" stroke={lit ? "#F7A11A" : "rgba(0,0,0,.3)"} strokeDasharray={lit ? undefined : "2 5"} strokeLinecap="round" />
      <text x={600} y={labelY + 4} className={`font-[family-name:var(--font-geist-mono)] text-[12px] tracking-[.08em] uppercase ${lit ? "fill-black" : "fill-black/45"}`}>
        {String(index + 1).padStart(2, "0")} {OPPORTUNITIES[index].name}
      </text>
        </>
      )}
    </g>
  );
}

/**
 * The deck draws its five benefits as stacked banners, darkest on top (AIF
 * presentation p8). Here they are five isometric slabs in the same order. The
 * stack builds as the panels arrive, and the benefit on the trigger line
 * slides its slab out and lights it orange.
 */
function SlabStack({ progress, selected, onSelect }: FigureState) {
  // Stacks draw bottom up, so the upper slabs cover the lower ones.
  const order = OPPORTUNITIES.map((_, index) => OPPORTUNITIES.length - 1 - index);
  const slabs = (labels: boolean) =>
    order.map((index) => (
      <Slab key={index} index={index} lit={selected === index} rise={riseAt(progress, OPPORTUNITIES.length - 1 - index)} labels={labels} onSelect={() => onSelect(index)} />
    ));
  return (
    <>
      <svg viewBox="0 0 820 440" className="block h-auto w-full max-w-[760px] overflow-visible max-md:hidden" role="img" aria-label="The five benefits of Flyingbee Investment Fund">
        {slabs(true)}
      </svg>
      {/* A phone has no room for the leader labels; the stack alone, cropped to it, and the panel names the benefit. */}
      <svg viewBox="110 60 440 360" className="mx-auto block h-full max-h-full w-auto max-w-full overflow-visible md:hidden" aria-hidden="true">
        {slabs(false)}
      </svg>
    </>
  );
}

/** Strategic opportunity with Flyingbee: five benefits, one panel each, told against the slab stack. */
export default function OpportunitySection() {
  return (
    <FactSection
      id="opportunity"
      label="Why Flyingbee"
      heading={AIF_HEADINGS.opportunity}
      figure={SlabStack}
      panels={OPPORTUNITIES.map((item, index) => ({
        part: index,
        content: (
          <>
            <Eyebrow>
              {String(index + 1).padStart(2, "0")} {item.name}
            </Eyebrow>
            <PanelTitle size={item.title.length > 8 ? "medium" : "large"}>{item.title}</PanelTitle>
            <p className="mt-[22px] max-w-[440px] text-[15px] leading-[1.6] text-[rgba(0,0,0,.72)]">{item.text}</p>
            {item.rows && <DetailRows rows={item.rows} />}
          </>
        ),
      }))}
    />
  );
}
