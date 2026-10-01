"use client";

import Link from "@/components/transition/transition-link";
import { useRef } from "react";
import CornerBrackets from "@/components/hero/corner-brackets";
import { BODY, BUTTON, COLUMN, EYEBROW, HEADING, Rise } from "@/components/hero/editorial";
import { onCircle, path, pieFaces, type Point } from "@/components/iso/geometry";
import { AIF_MIX } from "@/lib/aif";
import { AIF_PRODUCT } from "@/lib/insights";
import { stagger, useBuild } from "./use-build";

const CX = 300;
const CY = 250;
const RADIUS = 200;
const THICK = 44;
/** The listed half faces the viewer, turned a little right so both cut walls show when the halves part. */
const FRONT = Math.PI / 4 - 0.75;
const LISTED_SPAN = (AIF_MIX.listed / 100) * Math.PI * 2;

const WEDGES = [
  {
    key: "listed",
    from: FRONT - LISTED_SPAN / 2,
    to: FRONT + LISTED_SPAN / 2,
    top: "#F6A11A",
    side: "#d98c10",
    edge: "rgba(90,50,0,.72)",
  },
  {
    key: "unlisted",
    from: FRONT + LISTED_SPAN / 2,
    to: FRONT - LISTED_SPAN / 2 + Math.PI * 2,
    top: "url(#aif-hatch)",
    side: "#e4e2dd",
    edge: "rgba(0,0,0,.6)",
  },
] as const;

const at = ([x, y]: Point): Point => [CX + x, CY + y];

/**
 * The fund's mix as one isometric plate cut in two, in the picks pyramid's
 * projection: listed companies (at least 51%) in orange at the front, unlisted
 * (up to 49%) hatched behind. The two halves drop in, part, and name
 * themselves on leader lines to the right, the way the hero pyramid labels its
 * tiers. Split per AIF presentation p9, "Target investments".
 */
function MixPlate() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useBuild(ref, 2.2, 0.3);
  const labels = stagger(progress, 1, 2, 0.35);

  const faces = WEDGES.map((wedge, index) => {
    const drop = stagger(progress, index, 3, 0.45);
    const part = stagger(progress, 2, 3, 0.45);
    const faces = pieFaces(wedge.from, wedge.to, RADIUS, THICK, part * 30, (1 - drop) * 70);
    return { ...wedge, faces, drop };
  }).sort((a, b) => a.faces.depth - b.faces.depth);

  const listedMid = (WEDGES[0].from + WEDGES[0].to) / 2;
  const unlistedMid = (WEDGES[1].from + WEDGES[1].to) / 2;
  const leaders = [
    { key: "listed", start: at(onCircle(RADIUS * 0.7, listedMid, THICK)), y: CY + 150, figure: `${AIF_MIX.listed}%`, label: "Listed, at least" },
    { key: "unlisted", start: at(onCircle(RADIUS * 0.55, unlistedMid, THICK)), y: CY - 120, figure: `${AIF_MIX.unlisted}%`, label: "Unlisted, up to" },
  ];

  return (
    <div ref={ref} className="relative w-full max-w-[680px]">
      <svg
        viewBox="0 0 700 460"
        role="img"
        aria-label={`Target investments: at least ${AIF_MIX.listed}% in listed companies, up to ${AIF_MIX.unlisted}% in unlisted companies.`}
        className="block h-auto w-full overflow-visible"
      >
        <defs>
          <pattern id="aif-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="#fbfaf8" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(0,0,0,.22)" strokeWidth="1.2" />
          </pattern>
          <radialGradient id="aif-hero-bloom">
            <stop offset="0%" stopColor="#F6A11A" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#F6A11A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={CX} cy={CY + 30} rx={RADIUS * 1.05} ry={RADIUS * 0.5} fill="url(#aif-hero-bloom)" opacity={progress} />
        <path
          d={path(Array.from({ length: 64 }, (_, i) => at(onCircle(RADIUS + 34, (i / 64) * Math.PI * 2, 0))))}
          fill="none"
          stroke="rgba(0,0,0,.3)"
          strokeDasharray="2 7"
          strokeLinecap="round"
          opacity={Math.min(1, progress * 3)}
        />
        <g transform={`translate(${CX} ${CY})`}>
          {faces.map(({ key, faces: f, top, side, edge, drop }) => (
            <g key={key} opacity={drop} strokeLinejoin="round" strokeWidth="1">
              <path d={f.rim} fill={side} stroke={edge} />
              <path d={f.cut} fill={side} stroke={edge} />
              <path d={f.top} fill={top} stroke={edge} />
            </g>
          ))}
        </g>
        {leaders.map(({ key, start, y }) => (
          <g key={key} opacity={labels} className="max-md:hidden">
            <circle cx={start[0]} cy={start[1]} r="3.2" fill="#000" />
            <path
              d={`M${start[0].toFixed(2)} ${start[1].toFixed(2)} L${(start[0] + 40).toFixed(2)} ${y} L560 ${y}`}
              fill="none"
              stroke={key === "listed" ? "#F6A11A" : "rgba(0,0,0,.4)"}
              strokeDasharray={key === "listed" ? undefined : "2 5"}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
      {/* Labels in HTML over the plate so the type stays crisp, placed in the SVG's own units. */}
      <div aria-hidden="true" className="absolute inset-0 max-md:hidden">
        {leaders.map(({ key, y, figure, label }) => (
          <div
            key={key}
            className="absolute flex flex-col items-start"
            style={{ left: `${(566 / 700) * 100}%`, top: `${(y / 460) * 100}%`, translate: "0 -58%", opacity: labels }}
          >
            <span className={`${EYEBROW} text-black/60`}>{label}</span>
            <span className={`font-serif text-[clamp(1.8rem,3vw,2.8rem)] leading-none tabular-nums ${key === "listed" ? "text-[#F6A11A]" : "text-black"}`}>
              {figure}
            </span>
          </div>
        ))}
      </div>
      {/* On a phone the leader labels would run off the edge, so the two shares sit under the plate. */}
      <div aria-hidden="true" className="mt-6 grid grid-cols-2 gap-6 md:hidden">
        {leaders.map(({ key, figure, label }) => (
          <div key={key} className="flex flex-col gap-1" style={{ opacity: labels }}>
            <span className={`${EYEBROW} text-black/60`}>{label}</span>
            <span className={`font-serif text-[2.2rem] leading-none tabular-nums ${key === "listed" ? "text-[#F6A11A]" : "text-black"}`}>{figure}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FIGURES = [
  ["Rs. 1 crore", "Minimum investment"],
  ["3 to 5 years", "Suitable time frame"],
  ["Open ended", "Type of scheme"],
  ["None", "Exit load"],
] as const;

/** The page's opening: the fund's name and line, the ask, its mix drawn on the right, and four terms in orange. */
export default function AifHero() {
  return (
    <section aria-labelledby="aif-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-12 pt-[190px] pb-[64px] max-md:pt-[132px] md:grid-cols-[1fr_1.05fr]`}>
        <div>
          <Rise>
            <span className={`${EYEBROW} text-black/60`}>Category III Alternative Investment Fund</span>
            <h1 id="aif-heading" className={`mt-[18px] max-w-[640px] ${HEADING} text-[clamp(3rem,1.6rem+4.6vw,5.4rem)]`}>
              {AIF_PRODUCT.name}
            </h1>
          </Rise>
          <Rise delay={0.08}>
            <p className={`mt-8 max-w-[520px] text-black/70 ${BODY}`}>{AIF_PRODUCT.lead}</p>
          </Rise>
          <Rise delay={0.16}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a href="#talk" className={`${BUTTON} bg-black text-white hover:bg-black/85`}>
                Schedule a conversation
              </a>
              <Link href="#terms" className={`${BUTTON} border border-dashed border-black/10 text-black hover:bg-black/[.03]`}>
                The fund&rsquo;s terms
                <CornerBrackets />
              </Link>
            </div>
          </Rise>
        </div>
        <MixPlate />
      </div>
      <dl className={`${COLUMN} grid grid-cols-4 gap-x-10 gap-y-8 border-t border-dashed border-black/10 pt-[32px] pb-[64px] max-md:grid-cols-2`}>
        {FIGURES.map(([figure, caption], index) => (
          <Rise key={caption} onView delay={index * 0.06}>
            <dt className="font-serif text-[clamp(2rem,3.2vw,3rem)] leading-none text-[#F6A11A]">{figure}</dt>
            <dd className={`${EYEBROW} mt-[12px] text-black/60`}>{caption}</dd>
          </Rise>
        ))}
      </dl>
    </section>
  );
}
