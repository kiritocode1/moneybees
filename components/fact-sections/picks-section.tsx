"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { path, type Point } from "@/components/iso/geometry";
import {
  PYRAMID_NORMALS,
  PYRAMID_SPIN,
  PYRAMID_TIERS,
  projectAt,
  squareCorners,
  winding,
} from "@/components/insight-cards/moneybee-figures";
import { type CaseStudy, HEADINGS, PICK_TIERS, PICKS_LEAD } from "@/lib/insights";
import FactSection, {
  Bloom,
  clamp,
  r2,
  easeOut,
  FOCUS,
  type FigureState,
  LINE_GLOW,
  PanelTitle,
  riseAt,
  SOLID_GLOW,
  useFigureClock,
} from "./fact-section";

/** The resting view: one corner of the pyramid pointing at the viewer. */
const REST = Math.PI / 4;
const APEX = PYRAMID_TIERS[PYRAMID_TIERS.length - 1];

/** PYRAMID_TIERS runs base to apex; PICK_TIERS runs apex to base. */
const pickFor = (tier: number) => PICK_TIERS[PYRAMID_TIERS.length - 1 - tier];
/** The tier label as the slide prints it, and a short form for the figure. */
const labelFor = (tier: number) => pickFor(tier).multiple;
const shortLabel = (tier: number) => pickFor(tier).multiple.replace(" or more", "").replace(" ", "");

/** Paper to a light grey by angle to the light, or the site orange to its wall shade when selected. */
function faceFill(shade: number, selected: boolean) {
  const mix = (a: number, b: number) => Math.round(a + (b - a) * shade);
  return selected
    ? `rgb(${mix(201, 247)} ${mix(129, 161)} ${mix(16, 26)})`
    : `rgb(${mix(228, 255)} ${mix(227, 255)} ${mix(225, 255)})`;
}

/**
 * The visible slope faces of one tier at `rotation`, far to near. Culled the
 * same way as the card: by the winding of the whole face from apex to base, so
 * a face does not vanish while its slope still leans toward the viewer.
 */
function tierFaces(index: number, rotation: number) {
  const tier = PYRAMID_TIERS[index];
  const bottom = squareCorners(tier.baseRadius, tier.bottomZ, rotation);
  const top = squareCorners(tier.topRadius, tier.topZ, rotation);
  const apex = projectAt(0, 0, APEX.topZ, rotation);
  const base = squareCorners(PYRAMID_TIERS[0].baseRadius, 0, rotation);
  return PYRAMID_NORMALS.map((normal, side) => ({
    side,
    visible: winding([apex, base[(side + 1) % 4], base[side]]) < 0,
    shade: (1 + Math.cos(normal + rotation)) / 2,
    depth: (bottom[side][1] + bottom[(side + 1) % 4][1]) / 2,
    d: path([top[side], top[(side + 1) % 4], bottom[(side + 1) % 4], bottom[side]]),
  }))
    .filter((face) => face.visible)
    .sort((a, b) => a.depth - b.depth);
}

/**
 * Where a tier's leader line starts at `rotation`: the pyramid's right-hand
 * silhouette at the tier's mid height. Recomputed per frame because the
 * silhouette widens and narrows as the pyramid turns.
 */
function labelAnchor(index: number, rotation: number): Point {
  const tier = PYRAMID_TIERS[index];
  const midZ = (tier.bottomZ + tier.topZ) / 2;
  const corners = squareCorners((tier.baseRadius + tier.topRadius) / 2, midZ, rotation);
  return [r2(Math.max(...corners.map(([x]) => x))), -midZ];
}

function PicksFigure({ progress, selected, onSelect }: FigureState) {
  const settled = progress > 0.8;
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef);
  const reduceMotion = useReducedMotion();
  const spin = useFigureClock(settled && inView && !reduceMotion) * PYRAMID_SPIN;
  // One full turn while the tiers rise, then the card's continuous spin.
  const rotation = REST + (1 - easeOut(clamp(progress / 0.82))) * Math.PI * 2 + spin;

  return (
    <svg ref={svgRef} viewBox="-230 -236 520 356" className="h-auto w-full overflow-visible" role="group" aria-label="Historical picks by multiple">
      <defs>
        <Bloom id="picks-bloom" />
      </defs>
      <ellipse cx="0" cy="12" rx="210" ry="74" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1.2" strokeDasharray="2 9" strokeLinecap="round" />
      {/* Bloom behind the selected tier, as the card draws one behind its lit
          apex. It slides to whichever tier is selected rather than jumping. */}
      <ellipse
        cx="0"
        cy="0"
        rx={PYRAMID_TIERS[selected].baseRadius * 0.9 + 60}
        ry="78"
        fill="url(#picks-bloom)"
        style={{
          transform: `translateY(${labelAnchor(selected, rotation)[1]}px)`,
          opacity: settled ? 1 : 0,
          transition: "transform 450ms cubic-bezier(.16,1,.3,1), rx 450ms cubic-bezier(.16,1,.3,1), opacity 500ms ease",
        }}
      />
      {PYRAMID_TIERS.map((tier, index) => {
        const rise = riseAt(progress, index);
        const active = index === selected && settled;
        return (
          <g
            key={tier.baseRadius}
            role="button"
            tabIndex={settled ? 0 : -1}
            aria-label={`${labelFor(index)}`}
            aria-pressed={active}
            onKeyDown={(event) => event.key === "Enter" && onSelect(index)}
            onClick={() => onSelect(index)}
            className="cursor-pointer outline-none"
            style={{
              opacity: rise,
              transform: `translateY(${(1 - rise) * -46}px)`,
              // The lit solid glows the way the card's highlighted faces do.
              filter: active ? SOLID_GLOW : "none",
              transition: "filter 300ms ease",
            }}
          >
            {tierFaces(index, rotation).map((face) => (
              <path
                key={face.side}
                d={face.d}
                fill={faceFill(face.shade, active)}
                stroke={active ? "#9a6208" : "rgba(0,0,0,.72)"}
                strokeWidth="1.1"
                strokeLinejoin="round"
                style={{ transition: "fill 240ms ease, stroke 240ms ease" }}
              />
            ))}
          </g>
        );
      })}
      {/* Leader lines and multiples, only once the pyramid has stopped turning. */}
      <g style={{ opacity: settled ? 1 : 0, transition: "opacity 400ms ease" }} aria-hidden="true">
        {PYRAMID_TIERS.map((_, index) => {
          const [x, y] = labelAnchor(index, rotation);
          const active = index === selected;
          return (
            <g key={index} style={{ transition: "opacity 240ms ease" }} opacity={active ? 1 : 0.55}>
              <path d={`M${x + 8} ${y}H252`} stroke={active ? "#F7A11A" : "rgba(0,0,0,.4)"} strokeWidth="1" strokeDasharray={active ? undefined : "2 4"}
                // `fig-route--active` from the card.
                style={{ filter: active ? LINE_GLOW : "none" }}
              />
              <text x="258" y={y + 4} fontSize="12" fill="#000" fontFamily="ui-monospace, Menlo, monospace" letterSpacing=".04em">
                {shortLabel(index)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** Revenue and profit on one ₹ crore axis, so profit is drawn at its true size against revenue. */
function FinancialsChart({ caseStudy }: { caseStudy: CaseStudy }) {
  const rows = caseStudy.financials;
  const max = Math.max(...rows.map((row) => row.revenue));
  const first = rows[0];
  const last = rows[rows.length - 1];
  return (
    <figure className="mt-[26px]">
      <div className="flex h-[92px] items-end gap-[14px] border-b border-b-[rgba(0,0,0,.25)]">
        {rows.map((row) => (
          <div key={row.year} className="flex h-full flex-1 items-end gap-[3px]">
            <span className="block flex-1 bg-[#D9D8D6]" style={{ height: `${(row.revenue / max) * 100}%` }} />
            <span className="block flex-1 bg-[#F7A11A]" style={{ height: `${Math.max(1.5, (row.profit / max) * 100)}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-[6px] flex gap-[14px] text-[9px] text-[rgba(0,0,0,.55)]">
        {rows.map((row) => (
          <span key={row.year} className="flex-1 text-center">{row.year}</span>
        ))}
      </div>
      <figcaption className="mt-[12px] flex gap-[16px] text-[10px] text-[rgba(0,0,0,.65)]">
        <span>All Amt in Cr</span>
        <span><i className="mr-[5px] inline-block h-[8px] w-[8px] bg-[#D9D8D6]" />Revenue {first.revenue} to {last.revenue}</span>
        <span><i className="mr-[5px] inline-block h-[8px] w-[8px] bg-[#F7A11A]" />PAT {first.profit} to {last.profit}</span>
      </figcaption>
    </figure>
  );
}

function TierPanel({ tier }: { tier: number }) {
  const { picks } = pickFor(tier);
  const named = typeof picks === "string" ? [] : picks;
  const [open, setOpen] = useState<string | null>(named.find((pick) => pick.caseStudy)?.name ?? null);
  const study = named.find((pick) => pick.name === open)?.caseStudy;

  return (
    <div>
      <PanelTitle>{labelFor(tier)}</PanelTitle>

      {typeof picks === "string" ? (
        <p className="mt-[28px] border-t border-t-[rgba(0,0,0,.13)] pt-[18px] text-[clamp(1.4rem,2vw,1.9rem)] font-light tracking-[-.03em]">
          {picks}
        </p>
      ) : (
        <ul className="mt-[28px] list-none border-t border-t-[rgba(0,0,0,.13)] p-0">
          {named.map((pick) => (
            <li key={pick.name} className="border-b border-b-[rgba(0,0,0,.13)]">
              {pick.caseStudy ? (
                <button
                  type="button"
                  onClick={() => setOpen(pick.name)}
                  aria-expanded={open === pick.name}
                  className={`group flex min-h-[54px] w-full items-center justify-between gap-[20px] text-left text-[clamp(1.2rem,1.7vw,1.6rem)] font-light tracking-[-.03em] ${FOCUS}`}
                >
                  <span className="transition-transform duration-300 ease-[ease] group-hover:translate-x-[6px]">{pick.name}</span>
                  <small className={`text-[9px] uppercase tracking-[.1em] ${open === pick.name ? "text-[#000000]" : "text-[rgba(0,0,0,.5)]"}`}>
                    {open === pick.name ? "Case study" : "Read case study"}
                  </small>
                </button>
              ) : (
                <span className="flex min-h-[54px] items-center text-[clamp(1.2rem,1.7vw,1.6rem)] font-light tracking-[-.03em]">
                  {pick.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {study && (
        <div className="mt-[26px] grid gap-[14px] text-[11px] leading-[1.55] text-[rgba(0,0,0,.72)]">
          {[
            ["Business Model", study.business],
            ["Competitive Edge", study.edge],
            ["Growth Prospect", study.growth],
          ].map(([label, copy]) => (
            <p key={label} className="grid grid-cols-[110px_1fr] gap-[16px]">
              <span className="text-[9px] uppercase tracking-[.1em] text-[rgba(0,0,0,.5)]">{label}</span>
              {copy}
            </p>
          ))}
          <FinancialsChart caseStudy={study} />
        </div>
      )}
    </div>
  );
}

/** Section B, "Our multibagger picks", the deck's own title for slide 20. Panels run base to apex, so it ends on the highest multiple. */
export default function PicksSection() {
  return (
    <FactSection
      id="picks"
      label="Our multibagger picks"
      heading={HEADINGS.picks}
      lead={PICKS_LEAD}
      panels={PYRAMID_TIERS.map((_, tier) => ({ part: tier, content: <TierPanel tier={tier} /> }))}
      figure={PicksFigure}
    />
  );
}
