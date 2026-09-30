"use client";

import { useRef } from "react";
import { COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { clamp, easeOut } from "@/components/fact-sections/fact-section";
import { barFaces } from "@/components/iso/geometry";
import { RECENT_DEALS, RECENT_DEALS_HEADING } from "@/lib/about";
import LogoImage from "./logo-image";
import { useBuild } from "./use-build";

/**
 * Plan side per root crore, shared by every tile so areas compare across the
 * row: the largest valuation, Rs. 1300 crore, is a 150-unit square.
 */
const UNIT = 150 / Math.sqrt(Math.max(...RECENT_DEALS.map((deal) => deal.valuation)));
const side = (crore: number) => Math.sqrt(crore) * UNIT;
const SLAB = 6;
const BLOCK = 6;

const crore = (value: number) => `Rs. ${value.toLocaleString("en-IN")} Cr`;

/**
 * One deal in the picks pyramid's projection: the company's valuation as a
 * grey slab whose area is to scale, and the money raised as an orange tile on
 * its front corner, to the same scale. The slab rises, then the tile drops on.
 */
function DealTile({ valuation, raise, progress }: { valuation: number; raise: number; progress: number }) {
  const big = side(valuation);
  const small = side(raise);
  const slab = barFaces(-big / 2, -big / 2, big, SLAB);
  const tile = barFaces(big / 2 - small, big / 2 - small, small, BLOCK);
  const rise = easeOut(clamp(progress / 0.5));
  const drop = easeOut(clamp((progress - 0.5) / 0.5));
  return (
    <svg viewBox="-112 -46 224 108" aria-hidden="true" className="block h-auto w-full overflow-visible">
      <g style={{ opacity: rise, transform: `translateY(${(1 - rise) * 10}px)` }}>
        <path d={slab.left} fill="#d8d6d1" stroke="rgba(0,0,0,.55)" strokeWidth=".9" strokeLinejoin="round" />
        <path d={slab.right} fill="#c9c7c2" stroke="rgba(0,0,0,.55)" strokeWidth=".9" strokeLinejoin="round" />
        <path d={slab.top} fill="#eeece8" stroke="rgba(0,0,0,.55)" strokeWidth=".9" strokeLinejoin="round" />
      </g>
      {/* The tile sits on the slab's top face, SLAB units up. */}
      <g style={{ opacity: drop, transform: `translateY(${-SLAB - (1 - drop) * 30}px)` }}>
        <path d={tile.left} fill="#d98c10" stroke="rgba(90,50,0,.7)" strokeWidth=".9" strokeLinejoin="round" />
        <path d={tile.right} fill="#c98110" stroke="rgba(90,50,0,.7)" strokeWidth=".9" strokeLinejoin="round" />
        <path d={tile.top} fill="#F6A11A" stroke="rgba(90,50,0,.7)" strokeWidth=".9" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/**
 * Group profile p6: five fund raises, each company's valuation against the
 * money raised, in the slide's order. Company names stay on the logos.
 */
export default function RecentDeals() {
  const ref = useRef<HTMLOListElement>(null);
  const progress = useBuild(ref, 2600, 0.25);
  return (
    <section aria-labelledby="recent-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} py-[110px] max-md:py-[80px]`}>
        <div className="flex items-end justify-between gap-10 max-[900px]:flex-col max-[900px]:items-start">
          <Rise onView>
            <h2 id="recent-heading" className={`${SUBHEAD} max-w-[18ch]`}>
              {RECENT_DEALS_HEADING}
            </h2>
          </Rise>
          <div className={`${EYEBROW} flex flex-wrap gap-x-[20px] gap-y-[8px] text-black/70`} aria-hidden="true">
            <span className="flex items-center gap-[8px]">
              <i className="h-[9px] w-[9px] bg-[#F6A11A]" />
              Raised
            </span>
            <span className="flex items-center gap-[8px]">
              <i className="h-[9px] w-[9px] border border-black/50 bg-[#eeece8]" />
              Valuation
            </span>
            <span>Areas to scale</span>
          </div>
        </div>

        <ol ref={ref} className="mt-[56px] grid list-none grid-cols-5 gap-[28px] p-0 max-[1100px]:grid-cols-3 max-[700px]:grid-cols-1 max-[700px]:gap-0">
          {RECENT_DEALS.map((deal, index) => (
            <li
              key={deal.logo.src}
              className="flex flex-col border-t border-t-black pt-[18px] max-[700px]:grid max-[700px]:grid-cols-[1fr_1.1fr] max-[700px]:gap-x-[20px] max-[700px]:pb-[28px]"
            >
              <div>
                <span className={`${EYEBROW} text-black/60`}>{deal.sector}</span>
                <div className="mt-[16px] flex h-[72px] items-center">
                  <LogoImage logo={deal.logo} maxHeight={72} maxWidth={150} />
                </div>
              </div>
              <div className="mt-[18px] max-[700px]:row-span-2 max-[700px]:mt-0 max-[700px]:self-center">
                <DealTile valuation={deal.valuation} raise={deal.raise} progress={clamp(progress * 1.6 - index * 0.15)} />
              </div>
              <dl className="mt-[20px] grid gap-[12px]">
                <div>
                  <dt className={`${EYEBROW} text-black/55`}>{deal.kind}</dt>
                  <dd className="mt-[4px] font-serif text-[clamp(1.8rem,2.4vw,2.3rem)] leading-none text-[#F6A11A] tabular-nums">{crore(deal.raise)}</dd>
                </div>
                <div>
                  <dt className={`${EYEBROW} text-black/55`}>{deal.preMoney ? "Pre-money valuation" : "Valuation"}</dt>
                  <dd className="mt-[4px] font-serif text-[clamp(1.35rem,1.6vw,1.6rem)] leading-none tabular-nums">{crore(deal.valuation)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
