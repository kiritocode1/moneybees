"use client";

import Image from "next/image";
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
 * The founder's story in the plan's own facts: 45+ years of advisory through
 * market cycles (a dashed run with the market swinging above it, no start year
 * because the plan gives none), then Moneybee Group in 2004 and its PMS in
 * August 2007, lit in turn.
 */
function FounderYears({ on, t }: { on: boolean; t: Timing }) {
  const stops = [
    { x: 206, label: "2004", sub: "MONEYBEE GROUP" },
    { x: 290, label: "AUG 2007", sub: "PMS" },
  ];
  const wave = "M14 58 C 30 34, 46 34, 62 58 S 94 82, 110 58 S 142 34, 158 58 S 178 72, 190 64";
  return (
    <svg viewBox="0 0 320 130" className="block h-auto w-full" role="img" aria-label="45+ years across market cycles; Moneybee Group started in 2004; PMS since August 2007">
      <path d={wave} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.4" strokeDasharray="260" strokeDashoffset={on ? 0 : 260} style={{ transition: `stroke-dashoffset ${t(1200)}` }} />
      <path d="M14 90H206" stroke="#fff" strokeOpacity=".45" strokeWidth="1.6" strokeDasharray="4 5" />
      <path d="M206 90H290" stroke={ORANGE} strokeWidth="2" style={{ transform: `scaleX(${on ? 1 : 0})`, transformOrigin: "206px 90px", transition: `transform ${t(700, 1300)}` }} />
      <text x="14" y="112" fontSize="9" letterSpacing=".1em" fill="#fff" fillOpacity=".7" fontFamily={MONO}>
        45+ YEARS
      </text>
      <text x="14" y="124" fontSize="8" letterSpacing=".1em" fill="#fff" fillOpacity=".5" fontFamily={MONO}>
        MARKET CYCLES
      </text>
      {stops.map((stop, index) => (
        <g key={stop.label}>
          <polygon
            points={hexPoints(stop.x, 90, 9)}
            fill={on ? ORANGE : "#000"}
            stroke={on ? ORANGE : "rgba(255,255,255,.4)"}
            strokeWidth="1.5"
            style={{ transition: `fill ${t(300, 1200 + index * 600)}, stroke ${t(300, 1200 + index * 600)}` }}
          />
          <text x={stop.x} y="112" textAnchor={index ? "end" : "middle"} dx={index ? 12 : 0} fontSize="9" letterSpacing=".1em" fill="#fff" fontFamily={MONO}>
            {stop.label}
          </text>
          <text x={stop.x} y="124" textAnchor={index ? "end" : "middle"} dx={index ? 12 : 0} fontSize="8" letterSpacing=".1em" fill="#fff" fillOpacity=".5" fontFamily={MONO}>
            {stop.sub}
          </text>
        </g>
      ))}
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

/** Research: a field of listed companies and one of unlisted ones, a lens picking out cells in both. */
function ResearchGlyph({ on, t }: { on: boolean; t: Timing }) {
  const cells = (ox: number) =>
    Array.from({ length: 12 }, (_, index) => ({ x: ox + (index % 4) * 16 + (Math.floor(index / 4) % 2) * 8, y: 22 + Math.floor(index / 4) * 14, index }));
  const picked = new Set([5, 10]);
  return (
    <svg viewBox="0 0 180 90" className="block h-auto w-full" aria-hidden="true">
      {[12, 104].map((ox, field) =>
        cells(ox).map((cell) => (
          <polygon
            key={`${field}-${cell.index}`}
            points={hexPoints(cell.x, cell.y, 7)}
            fill={on && picked.has(cell.index) ? ORANGE : "rgba(0,0,0,.12)"}
            style={{ transition: `fill ${t(400, 700 + field * 500)}` }}
          />
        )),
      )}
      <circle cx="0" cy="0" r="15" fill="none" stroke="#000" strokeWidth="1.4" style={{ transform: `translate(${on ? 150 : 44}px, 36px)`, transition: `transform ${t(1400, 300)}` }} />
      <text x="40" y="84" textAnchor="middle" fontSize="7" letterSpacing=".1em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
        LISTED
      </text>
      <text x="132" y="84" textAnchor="middle" fontSize="7" letterSpacing=".1em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
        UNLISTED
      </text>
    </svg>
  );
}

/** Compliance: a shield that closes with a tick, and a flagged entry struck out. */
function ComplianceGlyph({ on, t }: { on: boolean; t: Timing }) {
  return (
    <svg viewBox="0 0 180 90" className="block h-auto w-full" aria-hidden="true">
      <path d="M52 10 78 20V44C78 60 66 72 52 80 38 72 26 60 26 44V20Z" fill={on ? ORANGE : "none"} stroke="#000" strokeWidth="1.4" style={{ transition: `fill ${t(500, 900)}` }} />
      <path d="M40 44 49 53 65 35" fill="none" stroke="#000" strokeWidth="2.2" strokeDasharray="40" strokeDashoffset={on ? 0 : 40} style={{ transition: `stroke-dashoffset ${t(500, 400)}` }} />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect x="104" y={22 + row * 18} width="56" height="8" fill="rgba(0,0,0,.12)" />
          {row === 1 && <path d="M100 56h64" stroke={ORANGE} strokeWidth="2" strokeDasharray="64" strokeDashoffset={on ? 0 : 64} style={{ transition: `stroke-dashoffset ${t(500, 1200)}` }} />}
        </g>
      ))}
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
