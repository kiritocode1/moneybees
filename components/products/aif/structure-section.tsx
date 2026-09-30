"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BracketLabel, FOCUS, LINE_GLOW, ORANGE, r2, SOLID_GLOW, useFigureClock } from "@/components/fact-sections/fact-section";
import { COLUMN, DashedRule, EYEBROW, SUBHEAD } from "@/components/hero/editorial";
import { AIF_HEADINGS, AIF_PARTIES } from "@/lib/aif";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SQUASH } from "@/components/iso/geometry";
import { at, box } from "./iso";
import { stagger, useBuild } from "./use-build";

type Party = (typeof AIF_PARTIES)[number];

const OX = 400;
const OY = 250;
const FUND = 46;
const NODE = 24;
/** Seconds each party stays lit while the figure walks the ring. */
const HOLD = 2.8;
/** Short names for the figure; the list beside it carries the full ones. */
const SHORT: Record<string, string> = { moneybee: "Moneybee", axis: "Axis Trustee", orbis: "Orbis", brokers: "Brokers", cams: "CAMS", investors: "Investors" };

/**
 * Where each party stands on screen, relative to the fund, in the slide's
 * layout: sponsor and trustee above, custodian and brokers at the sides, the
 * registrar and investors below. The slide's order of the list is not its
 * layout, so these are keyed by party.
 */
const SCREEN: Record<string, readonly [number, number]> = {
  moneybee: [-200, -150],
  axis: [200, -150],
  orbis: [-320, 12],
  brokers: [320, 12],
  cams: [200, 170],
  investors: [-200, 170],
};

/** A screen offset turned back into plan, undoing the projection's rotation and squash. */
const plan = (index: number) => {
  const [sx, sy] = SCREEN[AIF_PARTIES[index].key];
  const c = Math.cos(Math.PI / 4);
  const across = sx / c;
  const along = sy / (c * SQUASH);
  return [(across + along) / 2, (along - across) / 2] as const;
};

/** The pair of ground lanes between a party and the fund, as plan segments. `a` runs party to fund. */
function lanes(index: number) {
  const [px, py] = plan(index);
  const length = Math.hypot(px, py);
  const [ux, uy] = [-px / length, -py / length];
  const [nx, ny] = [-uy, ux];
  const start = (offset: number) => [px + ux * 52 + nx * offset, py + uy * 52 + ny * offset] as const;
  const end = (offset: number) => [ux * -84 + nx * offset, uy * -84 + ny * offset] as const;
  return { a: [start(9), end(9)] as const, b: [end(-9), start(-9)] as const };
}

const segment = ([from, to]: readonly (readonly [number, number])[]) => {
  const [x1, y1] = at(from[0], from[1], 0, OX, OY);
  const [x2, y2] = at(to[0], to[1], 0, OX, OY);
  return { x1: r2(x1), y1: r2(y1), x2: r2(x2), y2: r2(y2) };
};

function Lane({ line, t, lit, build }: { line: ReturnType<typeof segment>; t: number; lit: boolean; build: number }) {
  return (
    <g opacity={build}>
      <line {...line} stroke={lit ? ORANGE : "rgba(0,0,0,.25)"} strokeWidth={lit ? 1.8 : 1} style={{ filter: lit ? LINE_GLOW : "none", transition: "stroke 300ms ease" }} />
      {[0, 1, 2].map((dot) => {
        const share = ((t * 0.4 + dot / 3) % 1 + 1) % 1;
        return (
          <circle
            key={dot}
            cx={r2(line.x1 + (line.x2 - line.x1) * share)}
            cy={r2(line.y1 + (line.y2 - line.y1) * share)}
            r={lit ? 3.4 : 2.4}
            fill={lit ? "#000" : "rgba(0,0,0,.35)"}
          />
        );
      })}
    </g>
  );
}

/**
 * The deck's structure slide (AIF presentation p3) as an isometric plan: the
 * fund as a block in the middle, its six parties on a ring around it, and
 * between each party and the fund the slide's two arrows as ground lanes, one
 * carrying the service and one the payment, with dots running each way. The
 * lit party's lanes glow; it walks the ring on its own until one is picked.
 */
function StructureFigure({ lit, onSelect }: { lit: number; onSelect: (index: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const build = useBuild(ref, 2, 0.3);
  const inView = useInView(ref, { amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const t = useFigureClock(inView && !reduceMotion);

  const solids = [
    { key: "fund", index: -1, faces: box(-FUND, -FUND, FUND * 2, FUND * 2, 64, 0, OX, OY), rise: stagger(build, 0, 7, 0.4) },
    ...AIF_PARTIES.map((party, index) => {
      const [px, py] = plan(index);
      return { key: party.key, index, faces: box(px - NODE, py - NODE, NODE * 2, NODE * 2, 30, 0, OX, OY), rise: stagger(build, index + 1, 7, 0.4) };
    }),
  ].sort((a, b) => a.faces.depth - b.faces.depth);

  return (
    <div ref={ref} className="w-full">
      <svg viewBox="0 0 800 480" role="img" aria-label="Structure of Flyingbee Investment Fund: the fund and its six parties" className="block h-auto w-full overflow-visible">
        <ellipse cx={OX} cy={OY + 12} rx={330} ry={172} fill="none" stroke="rgba(0,0,0,.22)" strokeDasharray="2 7" strokeLinecap="round" opacity={build} />
        {AIF_PARTIES.map((party, index) => {
          const { a, b } = lanes(index);
          const on = index === lit;
          return (
            <g key={party.key}>
              <Lane line={segment(a)} t={t} lit={on} build={build} />
              <Lane line={segment(b)} t={t} lit={on} build={build} />
            </g>
          );
        })}
        {solids.map(({ key, index, faces, rise }) => {
          const fund = index < 0;
          const on = index === lit;
          const [px, py] = fund ? [0, 0] : plan(index);
          const [lx, ly] = fund ? at(-FUND, -FUND, 64, OX, OY) : at(px, py, 30, OX, OY);
          const top = fund ? "#F6A11A" : on ? "#F6A11A" : "#fbfaf8";
          return (
            <g
              key={key}
              transform={`translate(0 ${-(1 - rise) * 50})`}
              opacity={rise}
              {...(fund
                ? {}
                : {
                    role: "button",
                    tabIndex: -1,
                    "aria-label": AIF_PARTIES[index].name,
                    onClick: () => onSelect(index),
                    className: "cursor-pointer",
                  })}
            >
              <g stroke={fund || on ? "rgba(90,50,0,.75)" : "rgba(0,0,0,.6)"} strokeWidth="0.9" strokeLinejoin="round" style={{ filter: on ? SOLID_GLOW : "none" }}>
                <path d={faces.left} fill={fund || on ? "#c97f0c" : "#e6e4df"} />
                <path d={faces.right} fill={fund || on ? "#e3920f" : "#f1efeb"} />
                <path d={faces.top} fill={top} />
              </g>
              <text
                x={lx}
                y={fund ? ly - 18 : ly - 26}
                textAnchor="middle"
                className={`font-[family-name:var(--font-geist-mono)] tracking-[.08em] uppercase ${fund ? "fill-black text-[12px] max-md:text-[20px]" : on ? "fill-black text-[11px] max-md:text-[20px]" : "fill-black/50 text-[11px] max-md:text-[20px]"}`}
              >
                {fund ? "Flyingbee" : SHORT[AIF_PARTIES[index].key]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** A party's logos in their own colours; the Moneybee file is cropped to its mark as the nav does. */
function Logos({ party }: { party: Party }) {
  if (party.logos.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-[28px]">
      {party.logos.map((logo) =>
        logo.src === "/moneybee-logo.svg" ? (
          <svg key={logo.src} viewBox="200 205 1455 445" width={logo.width} height={Math.round((logo.width * 445) / 1455)} role="img" aria-label="Moneybee logo" className="block brightness-0">
            <image href="/moneybee-logo.svg" width="2048" height="897" />
          </svg>
        ) : (
          <div key={logo.src} className="relative h-[36px]" style={{ width: logo.width }}>
            <Image src={logo.src} alt={`${party.name} logo`} fill sizes="160px" className="object-contain object-left brightness-0" />
          </div>
        ),
      )}
    </div>
  );
}

/**
 * Structure of Flyingbee: the isometric plan beside the six parties as a
 * list. The lit party opens with its logos and its two arrows in words, what
 * it gives and what it gets. Picking one in either place holds it; otherwise
 * the figure walks the ring.
 */
export default function StructureSection() {
  const [lit, setLit] = useState(0);
  const [held, setHeld] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (held || !inView || reduceMotion) return;
    const id = window.setInterval(() => setLit((index) => (index + 1) % AIF_PARTIES.length), HOLD * 1000);
    return () => window.clearInterval(id);
  }, [held, inView, reduceMotion]);

  const pick = (index: number) => {
    setLit(index);
    setHeld(true);
  };

  return (
    <section id="structure" aria-labelledby="structure-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} pt-[110px]`}>
        <BracketLabel>The fund&rsquo;s partners</BracketLabel>
        <h2 id="structure-heading" className={`mt-[18px] ${SUBHEAD}`}>
          {AIF_HEADINGS.structure}
        </h2>
      </div>
      <div ref={ref} className={`${COLUMN} grid grid-cols-1 items-center gap-12 pt-[40px] pb-[120px] lg:grid-cols-[1.25fr_.75fr]`}>
        <StructureFigure lit={lit} onSelect={pick} />
        <ul className="list-none border-t border-t-black">
          {AIF_PARTIES.map((party, index) => {
            const open = index === lit;
            const rows = party.toFund
              ? ([
                  ["Provides", party.service],
                  ["Receives", party.payment],
                ] as const)
              : ([
                  ["Receives", party.service],
                  ["Pays", party.payment],
                ] as const);
            return (
              <li key={party.key} className="border-b border-b-[rgba(0,0,0,.13)]">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => pick(index)}
                  className={`flex w-full items-baseline gap-[16px] py-[16px] text-left ${FOCUS}`}
                >
                  <span className={`${EYEBROW} w-[22px] shrink-0 ${open ? "text-black" : "text-black/45"}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className={`block text-[17px] leading-[1.3] transition-colors ${open ? "text-black" : "text-black/55"}`}>{party.name}</span>
                    <span className={`${EYEBROW} mt-[4px] block text-black/50`}>{party.role}</span>
                  </span>
                  <i className={`h-[8px] w-[8px] shrink-0 self-center transition-colors ${open ? "bg-[#F6A11A]" : "bg-black/15"}`} aria-hidden="true" />
                </button>
                <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-[16px] pb-[20px] pl-[38px]">
                      <Logos party={party} />
                      <dl className="grid gap-[8px] text-[15px] leading-[1.5]">
                        {rows.map(([label, value]) => (
                          <div key={label} className="grid grid-cols-[84px_1fr] gap-[12px]">
                            <dt className={`${EYEBROW} pt-[4px] text-black/50`}>{label}</dt>
                            <dd className="text-black/80">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
