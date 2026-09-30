"use client";

import Image from "next/image";
import { useId } from "react";
import { BOX, Draw, Hatch, MOVE, OUT, RM, tr } from "@/components/drawing/plate";
import { hexPoints, ORANGE, useShown } from "@/components/about-v2/shared";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import { FOUNDER_PERSON, KEY_MEMBERS, TEAM } from "@/lib/team";

/*
 * /team, content plan §9: the heading beside a chart of the three people that
 * doubles as the page index, the founder on a black band with a drawing of his
 * years in the plan's own dates, and the two key team members on grey, each
 * with a drawing of what their work covers.
 */

const MONO = "var(--font-geist-mono), ui-monospace, monospace";
type Timing = (ms: number, delay?: number) => string;

/** Founder above, the two key members below, joined by lines drawn in turn. Each cell links to its person. */
function TeamChart() {
  const { ref, shown, t } = useShown<SVGSVGElement>(0.35);
  const R = 58;
  const nodes = [
    { person: FOUNDER_PERSON, x: 180, y: 70 },
    { person: KEY_MEMBERS[0], x: 88, y: 252 },
    { person: KEY_MEMBERS[1], x: 272, y: 252 },
  ];
  return (
    <svg ref={ref} viewBox="0 0 360 340" className="block h-auto w-full max-w-[460px]" role="group" aria-label="Team">
      <defs>
        {nodes.map((node) => (
          <clipPath key={node.person.id} id={`team-cell-${node.person.id}`}>
            <polygon points={hexPoints(node.x, node.y, R - 4)} />
          </clipPath>
        ))}
      </defs>
      {nodes.slice(1).map((node, index) => (
        <path
          key={node.person.id}
          d={`M180 158V174H${node.x}V${node.y - R}`}
          fill="none"
          stroke={ORANGE}
          strokeWidth="2"
          strokeDasharray="220"
          strokeDashoffset={shown ? 0 : 220}
          style={{ transition: `stroke-dashoffset ${t(800, 300 + index * 200)}` }}
        />
      ))}
      {nodes.map((node, index) => (
        <a key={node.person.id} href={`#${node.person.id}`} aria-label={`${node.person.name}, ${node.person.designation}`} className="group cursor-pointer outline-none">
          <g style={{ opacity: shown ? 1 : 0, transition: `opacity ${t(600, index * 250)}` }}>
            <image href={node.person.photo} x={node.x - R} y={node.y - R} width={R * 2} height={R * 2} preserveAspectRatio="xMidYMin slice" clipPath={`url(#team-cell-${node.person.id})`} />
            <polygon points={hexPoints(node.x, node.y, R - 1)} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" className="text-black/15 transition-colors duration-300 group-hover:text-[#F6A11A] group-focus-visible:text-black" />
            <text x={node.x} y={node.y + R + 18} textAnchor="middle" fontSize="11" fill="#000" fontFamily={MONO} letterSpacing=".04em">
              {node.person.name.toUpperCase()}
            </text>
          </g>
        </a>
      ))}
    </svg>
  );
}

export function TeamHero() {
  return (
    <section aria-labelledby="team-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-14 pt-[150px] pb-[110px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:pt-[220px] max-md:pb-[72px]`}>
        <div>
          <Rise>
            <BracketLabel>Our team</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="team-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {TEAM.heading}
            </h1>
          </Rise>
        </div>
        <Rise delay={0.2}>
          <div className="flex justify-center md:justify-end">
            <TeamChart />
          </div>
        </Rise>
      </div>
    </section>
  );
}

function Qualifications({ items, dark }: { items: string; dark?: boolean }) {
  return (
    <ul className="mt-[20px] flex list-none flex-wrap gap-[8px] p-0" aria-label="Qualifications">
      {items.split(", ").map((item) => (
        <li key={item} className={`rounded-full border px-[14px] py-[6px] text-[14px] ${dark ? "border-white/30" : "border-black/20"}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * The founder's story in the plan's own facts. A dimension line measures the
 * 45+ years from the start of his career to today; under it the market swings
 * through its cycles over a dashed run-up with no start year (the plan gives
 * none); then the orange run begins at 2004, Moneybee Group, and passes August
 * 2007, the PMS, on its way to today.
 */
function FounderYears({ on }: { on: boolean; t: Timing }) {
  const hatch = useId();
  const ink = "#fff";
  const axis = 90;
  const start = 14;
  const now = 306;
  const stops = [
    { x: 206, label: "2004", sub: "MONEYBEE GROUP" },
    { x: 290, label: "AUG 2007", sub: "PMS" },
  ];
  const wave = "M14 58 C 30 34, 46 34, 62 58 S 94 82, 110 58 S 142 34, 158 58 S 178 72, 190 64";
  const run = 620;
  const runAt = 1150;
  const reach = (x: number) => runAt + ((x - stops[0].x) / (now - stops[0].x)) * run;
  return (
    <svg viewBox="0 0 320 130" className="block h-auto w-full overflow-visible" role="img" aria-label="45+ years across market cycles; Moneybee Group started in 2004; PMS since August 2007">
      <defs>
        <Hatch id={hatch} ink={ink} gap={2.6} opacity={0.4} />
      </defs>
      {/* The time axis and its ticks. */}
      <line x1={start} x2={now} y1={axis} y2={axis} stroke={ink} strokeWidth=".5" strokeOpacity=".3" />
      {Array.from({ length: 25 }, (_, tick) => (
        <line key={tick} x1={start + tick * 12.17} x2={start + tick * 12.17} y1={axis} y2={axis + (tick % 4 ? 2 : 3.6)} stroke={ink} strokeWidth=".5" strokeOpacity=".35" />
      ))}
      <path d={`M${start} ${axis}H${stops[0].x}`} stroke={ink} strokeOpacity=".5" strokeWidth="1" strokeDasharray="3 3" />
      {/* 45+ years, measured end to end: extension lines, then the dimension. */}
      <Draw d={`M${start} ${axis - 4}V10M${now} ${axis - 4}V10`} on={on} ms={420} stroke={ink} strokeWidth=".5" strokeOpacity=".5" />
      <Draw d={`M${start + 1} 16H${now - 1}`} on={on} ms={560} delay={220} ease={MOVE} stroke={ink} strokeWidth=".8" />
      <g className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 240, 700) }}>
        <path d={`M${start + 4} 13.6L${start} 16L${start + 4} 18.4M${now - 4} 13.6L${now} 16L${now - 4} 18.4`} fill="none" stroke={ink} strokeWidth=".8" />
        <rect x="126" y="11" width="68" height="10" fill="#000" />
        <text x="160" y="18.4" textAnchor="middle" fontSize="7" letterSpacing=".12em" fill={ink} fontFamily={MONO}>
          45+ YEARS
        </text>
      </g>
      {/* The market, swinging over the run-up. */}
      <path d={`${wave}L190 ${axis}H14Z`} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 500, 950) }} />
      <Draw d={wave} on={on} ms={1000} delay={150} ease={MOVE} stroke={ink} strokeOpacity=".8" strokeWidth="1" strokeLinejoin="round" />
      <text x={start} y="112" fontSize="7" letterSpacing=".12em" fill={ink} fillOpacity=".6" fontFamily={MONO}>
        MARKET CYCLES
      </text>
      {/* Moneybee's own run, to today. */}
      <Draw d={`M${stops[0].x} ${axis}H${now}`} on={on} ms={run} delay={runAt} ease="linear" stroke={ORANGE} strokeWidth="2.2" />
      {stops.map((stop, index) => (
        <g key={stop.label}>
          <line x1={stop.x} x2={stop.x} y1={axis - 14} y2={axis - 4} stroke={ink} strokeWidth=".5" strokeOpacity=".5" />
          <polygon points={hexPoints(stop.x, axis, 8)} fill="#000" stroke={ink} strokeOpacity=".55" strokeWidth=".8" />
          <polygon points={hexPoints(stop.x, axis, 6.4)} fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 360, reach(stop.x)) }} />
          <text x={stop.x} y="112" textAnchor={index ? "end" : "middle"} dx={index ? 12 : 0} fontSize="8" letterSpacing=".1em" fill={ink} fontFamily={MONO}>
            {stop.label}
          </text>
          <text x={stop.x} y="124" textAnchor={index ? "end" : "middle"} dx={index ? 12 : 0} fontSize="7" letterSpacing=".12em" fill={ink} fillOpacity=".55" fontFamily={MONO}>
            {stop.sub}
          </text>
        </g>
      ))}
      <circle cx={now} cy={axis} r="2.2" fill={ORANGE} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, runAt + run) }} />
    </svg>
  );
}

/** The founder on black: a large portrait, his name and qualifications, and his years drawn in the plan's dates. */
export function FounderBand() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.35);
  const person = FOUNDER_PERSON;
  return (
    <section id={person.id} aria-labelledby="founder-heading" className="scroll-mt-[96px] bg-black text-white">
      <div className={`${COLUMN} grid grid-cols-1 items-end gap-12 py-[120px] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20 max-md:py-[80px]`}>
        <figure className="m-0">
          <div className="relative aspect-[868/824] w-full overflow-hidden bg-white/10">
            <Image src={person.photo} alt={person.name} fill sizes="(max-width: 768px) 100vw, 520px" className="object-cover" />
          </div>
          <span aria-hidden="true" className="block h-[3px] w-full origin-left bg-[#F6A11A]" style={{ transform: `scaleX(${shown ? 1 : 0})`, transition: `transform ${t(900, 200)}` }} />
        </figure>
        <div ref={ref}>
          <BracketLabel>01 · Founder</BracketLabel>
          <h2 id="founder-heading" className={`${HEADING} mt-[18px] text-[clamp(2.5rem,1.2rem+3.2vw,4.25rem)]`}>
            {person.name}
          </h2>
          <p className={`mt-[12px] ${EYEBROW} text-[12px] text-white/70`}>{person.designation}</p>
          <Qualifications items={person.qualifications} dark />
          <p className={`mt-[28px] max-w-[600px] text-white/80 ${BODY}`}>{person.bio}</p>
          <div className="mt-[40px] max-w-[520px] border-t border-white/20 pt-[24px]">
            <FounderYears on={shown} t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Research across listed and unlisted companies. Two fields of companies sit
 * either side of the listing line. A reading frame works through the listed
 * field, the companies it reads are hatched and one is picked in orange; then
 * it crosses the line and does the same among the unlisted.
 */
function ResearchGlyph({ on }: { on: boolean; t: Timing }) {
  const hatch = useId();
  const cells = (ox: number) =>
    Array.from({ length: 12 }, (_, index) => ({ x: ox + (index % 4) * 16 + (Math.floor(index / 4) % 2) * 8, y: 22 + Math.floor(index / 4) * 14, index }));
  const fields = [
    { ox: 12, read: new Set([4, 6, 1]), pick: 5, at: 150, label: "LISTED", mid: 40 },
    { ox: 104, read: new Set([9, 11, 6]), pick: 10, at: 1350, label: "UNLISTED", mid: 132 },
  ];
  const from = cells(fields[0].ox)[fields[0].pick];
  const to = cells(fields[1].ox)[fields[1].pick];
  return (
    <svg viewBox="0 0 180 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2} opacity={0.6} />
      </defs>
      <path d="M92 6V74" stroke="#000" strokeWidth=".5" strokeOpacity=".45" strokeDasharray="5 2 1 2" />
      {fields.map((field) =>
        cells(field.ox).map((cell) => {
          const read = field.read.has(cell.index);
          const pick = cell.index === field.pick;
          return (
            <g key={`${field.ox}-${cell.index}`}>
              <polygon points={hexPoints(cell.x, cell.y, 7)} fill="none" stroke="#000" strokeWidth=".6" strokeOpacity={read || pick ? 0.6 : 0.3} />
              {read && <polygon points={hexPoints(cell.x, cell.y, 7)} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 300, field.at + [...field.read].indexOf(cell.index) * 90) }} />}
              {pick && <polygon points={hexPoints(cell.x, cell.y, 5.6)} fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.75)", ...tr("opacity, transform", 360, field.at + 380) }} />}
            </g>
          );
        }),
      )}
      {/* The reading frame: corner brackets and a centre mark, crossing on a bent path. */}
      <g className={RM} style={{ transform: `translateX(${on ? to.x : from.x}px)`, ...tr("transform", 800, 650, MOVE) }}>
        <g className={RM} style={{ transform: `translateY(${on ? to.y : from.y}px)`, ...tr("transform", 800, 650, OUT) }}>
          <path d="M-11 -6V-11H-6M6 -11H11V-6M11 6V11H6M-6 11H-11V6" fill="none" stroke="#000" strokeWidth=".9" />
          <path d="M-2.4 0H2.4M0 -2.4V2.4" stroke="#000" strokeWidth=".6" />
        </g>
      </g>
      {fields.map((field) => (
        <text key={field.label} x={field.mid} y="86" textAnchor="middle" fontSize="6" letterSpacing=".12em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
          {field.label}
        </text>
      ))}
    </svg>
  );
}

/**
 * Compliance, risk management and fraud prevention. The shield draws itself
 * closed and takes its tick; beside it each entry in the ledger is checked in
 * turn, and the one that fails is struck through in orange.
 */
function ComplianceGlyph({ on }: { on: boolean; t: Timing }) {
  const hatch = useId();
  const shield = "M52 10 78 20V44C78 60 66 72 52 80 38 72 26 60 26 44V20Z";
  const rows = [0, 1, 2, 3];
  const flagged = 2;
  return (
    <svg viewBox="0 0 180 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2.4} opacity={0.45} />
      </defs>
      <path d={shield} fill="none" stroke="#000" strokeWidth=".5" strokeOpacity=".35" strokeDasharray="1.5 2" />
      <path d={shield} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 400, 550) }} />
      <Draw d={shield} on={on} ms={700} stroke="#000" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M37 45 49 56 67 33" fill="none" stroke="#fff" strokeWidth="5" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 200, 700) }} />
      <Draw d="M37 45 49 56 67 33" on={on} ms={420} delay={750} stroke="#000" strokeWidth="1.8" />
      {rows.map((row) => {
        const y = 18 + row * 17;
        const at = 300 + row * 150;
        const fail = row === flagged;
        return (
          <g key={row}>
            <rect x="98" y={y - 3} width="6" height="6" fill={fail ? "none" : "#fff"} stroke="#000" strokeWidth=".6" />
            <line x1="110" x2="166" y1={y - 1.2} y2={y - 1.2} stroke="#000" strokeWidth=".6" strokeOpacity=".5" />
            <line x1="110" x2={row % 2 ? 138 : 150} y1={y + 2.2} y2={y + 2.2} stroke="#000" strokeWidth=".6" strokeOpacity=".3" />
            {fail ? (
              <>
                <rect x="98.8" y={y - 2.2} width="4.4" height="4.4" fill={ORANGE} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 260, 1350) }} />
                <Draw d={`M106 ${y + 0.5}H170`} on={on} ms={420} delay={1250} stroke={ORANGE} strokeWidth="2" />
              </>
            ) : (
              <Draw d={`M99.2 ${y}L100.8 ${y + 1.8}L103 ${y - 2}`} on={on} ms={220} delay={at} stroke="#000" strokeWidth=".9" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

const MEMBER_GLYPHS = { research: ResearchGlyph, compliance: ComplianceGlyph } as const;

export function KeyMembersSection() {
  const { ref, shown, t } = useShown<HTMLDivElement>(0.25);
  return (
    <section id="key-members" aria-labelledby="members-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <span className={`${EYEBROW} text-black/60`}>02</span>
        <h2 id="members-heading" className={`mt-[14px] ${SUBHEAD}`}>
          Key Team Members
        </h2>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-[2px] lg:grid-cols-2">
          {KEY_MEMBERS.map((person) => {
            const Glyph = MEMBER_GLYPHS[person.glyph];
            return (
              <article key={person.id} id={person.id} className="grid scroll-mt-[96px] grid-cols-1 gap-[28px] bg-white p-[28px] sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] max-[600px]:p-[22px]">
                <figure className="m-0 w-full max-sm:max-w-[240px]">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5">
                    <Image src={person.photo} alt={person.name} fill sizes="(max-width: 640px) 240px, 200px" className="object-cover object-top" />
                  </div>
                  <span aria-hidden="true" className="block h-[3px] w-full origin-left bg-[#F6A11A]" style={{ transform: `scaleX(${shown ? 1 : 0})`, transition: `transform ${t(700, 200)}` }} />
                </figure>
                <div className="flex flex-col">
                  <h3 className="font-serif text-[clamp(1.9rem,1.2rem+1.4vw,2.6rem)] leading-[1.05] font-normal">{person.name}</h3>
                  <p className={`mt-[10px] ${EYEBROW} text-[12px] text-black/60`}>{person.designation}</p>
                  <Qualifications items={person.qualifications} />
                  <p className="mt-[18px] text-[16px] leading-[1.55] text-black/70">{person.bio}</p>
                  <div className="mt-[28px] border-t border-black/10 pt-[18px]">
                    <Glyph on={shown} t={t} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
