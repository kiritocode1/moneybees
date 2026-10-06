"use client";

import Image from "next/image";
import { useId } from "react";
import { BOX, Draw, Hatch, MOVE, OUT, RM, tr } from "@/components/drawing/plate";
import { hexPoints, ORANGE, useShown } from "@/components/about-v2/shared";
import { COLUMN, EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { KEY_MEMBERS } from "@/lib/team";

/*
 * The key team members, content plan §9, as section 02 of /about (they had a
 * page of their own at /team until 2026-10-06): the plan's two and the group
 * profile's four on grey, each with a drawing of what their work covers.
 */

const MONO = "var(--font-geist-mono), ui-monospace, monospace";
type Timing = (ms: number, delay?: number) => string;

function Qualifications({ items }: { items: string }) {
  return (
    <ul className="mt-[20px] flex list-none flex-wrap gap-[8px] p-0" aria-label="Qualifications">
      {items.split(", ").map((item) => (
        <li key={item} className="rounded-full border border-black/20 px-[14px] py-[6px] text-[14px]">
          {item}
        </li>
      ))}
    </ul>
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

/**
 * Research, modelling and valuation across chemicals, automobiles and capital
 * goods. Under each sector's mark a valuation scale draws, the likely range is
 * hatched, and the orange mark settles on the value.
 */
function ValuationGlyph({ on }: { on: boolean; t: Timing }) {
  const hatch = useId();
  const sectors = [
    { x: 32, label: "CHEMICALS", band: [42, 60], mark: 50 },
    { x: 90, label: "AUTOS", band: [36, 52], mark: 43 },
    { x: 148, label: "CAPITAL GOODS", band: [46, 66], mark: 57 },
  ];
  const icons = [
    // A flask.
    `M29 10V15L24 25H40L35 15V10M27 10H37`,
    // A wheel: rim, hub and spokes.
    `M97 18A7 7 0 1 1 83 18A7 7 0 1 1 97 18ZM92.2 18A2.2 2.2 0 1 1 87.8 18A2.2 2.2 0 1 1 92.2 18ZM90 11V15.8M90 20.2V25M83 18H87.8M92.2 18H97`,
    // A gear's ring and hub; its teeth are drawn thicker below.
    `M153.4 18A5.4 5.4 0 1 1 142.6 18A5.4 5.4 0 1 1 153.4 18ZM150 18A2 2 0 1 1 146 18A2 2 0 1 1 150 18Z`,
  ];
  const teeth = Array.from({ length: 8 }, (_, k) => {
    const a = (k * Math.PI) / 4;
    return `M${(148 + 5.4 * Math.cos(a)).toFixed(2)} ${(18 + 5.4 * Math.sin(a)).toFixed(2)}L${(148 + 7.8 * Math.cos(a)).toFixed(2)} ${(18 + 7.8 * Math.sin(a)).toFixed(2)}`;
  }).join("");
  return (
    <svg viewBox="0 0 180 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2} opacity={0.6} />
      </defs>
      {sectors.map((sector, index) => {
        const at = 200 + index * 260;
        return (
          <g key={sector.label}>
            <Draw d={icons[index]} on={on} ms={600} delay={at - 150} stroke="#000" strokeWidth=".8" strokeLinejoin="round" />
            {index === 2 && <path d={teeth} stroke="#000" strokeWidth="2.2" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 300, at + 250) }} />}
            <Draw d={`M${sector.x} 32V74`} on={on} ms={500} delay={at} stroke="#000" strokeWidth=".6" strokeOpacity=".5" />
            {Array.from({ length: 6 }, (_, tick) => (
              <line key={tick} x1={sector.x - 2} x2={sector.x + 2} y1={34 + tick * 8} y2={34 + tick * 8} stroke="#000" strokeWidth=".5" strokeOpacity=".35" />
            ))}
            <rect x={sector.x - 7} y={sector.band[0]} width="14" height={sector.band[1] - sector.band[0]} fill={`url(#${hatch})`} stroke="#000" strokeWidth=".5" strokeOpacity=".5" className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 360, at + 420) }} />
            <polygon points={hexPoints(sector.x, sector.mark, 4.2)} fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 360, at + 760) }} />
            <text x={sector.x} y="86" textAnchor="middle" fontSize="6" letterSpacing=".12em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
              {sector.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Undervalued small and mid-sized companies with strong growth. The business's
 * value climbs while its price lags; the gap between them is hatched, the
 * orange mark is the buy where the gap opens, and the price catches up.
 */
function UndervaluedGlyph({ on }: { on: boolean; t: Timing }) {
  const hatch = useId();
  const value = "M14 62C58 56 104 34 166 12";
  const price = "M14 64C66 66 112 62 166 16";
  const gap = `${value}L166 16C112 62 66 66 14 64Z`;
  const buy = [58, 64.4] as const;
  const reveal = useId();
  return (
    <svg viewBox="0 0 180 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2.2} opacity={0.5} />
        {/* The value line is dashed, so it draws on through a mask rather than its own dash offset. */}
        <mask id={reveal} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="90">
          <Draw d={value} on={on} ms={900} delay={100} ease={MOVE} stroke="#fff" strokeWidth="4" />
        </mask>
      </defs>
      <line x1="14" x2="166" y1="74" y2="74" stroke="#000" strokeWidth=".5" strokeOpacity=".3" />
      {Array.from({ length: 13 }, (_, tick) => (
        <line key={tick} x1={14 + tick * 12.67} x2={14 + tick * 12.67} y1="74" y2={tick % 4 ? 76 : 77.6} stroke="#000" strokeWidth=".5" strokeOpacity=".35" />
      ))}
      <path d={gap} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 500, 1150) }} />
      <path d={value} fill="none" stroke="#000" strokeWidth=".9" strokeDasharray="3 2" mask={`url(#${reveal})`} />
      <Draw d={price} on={on} ms={900} delay={400} ease={MOVE} stroke="#000" strokeWidth="1.1" />
      <Draw d={`M${buy[0]} ${buy[1] + 5}V74`} on={on} ms={240} delay={1350} stroke="#000" strokeWidth=".5" strokeOpacity=".5" />
      <polygon points={hexPoints(buy[0], buy[1], 4.2)} fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 360, 1400) }} />
      <g fontSize="6" letterSpacing=".12em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
        <line x1="14" x2="24" y1="84" y2="84" stroke="#000" strokeWidth="1.1" />
        <text x="28" y="86">PRICE</text>
        <line x1="62" x2="72" y1="84" y2="84" stroke="#000" strokeWidth=".9" strokeDasharray="3 2" />
        <text x="76" y="86">VALUE</text>
        <polygon points={hexPoints(116, 84, 2.6)} fill={ORANGE} fillOpacity={1} />
        <text x="122" y="86">BUY</text>
      </g>
    </svg>
  );
}

/**
 * Investment banking and research projects for listed and private companies.
 * The project sheet fills in, leaders run out to a listed company (its price
 * line ticking on the roof) and a private one, and the sheet takes its orange
 * mark.
 */
function ProjectsGlyph({ on }: { on: boolean; t: Timing }) {
  const hatch = useId();
  const building = (x: number) => `M${x - 16} 72V36H${x + 16}V72`;
  const windows = (x: number) =>
    Array.from({ length: 9 }, (_, index) => ({ x: x - 11 + (index % 3) * 9, y: 42 + Math.floor(index / 3) * 9 }));
  const companies = [
    { x: 32, label: "LISTED", leader: "M76 44H58V52H48", at: 900 },
    { x: 148, label: "PRIVATE", leader: "M104 44H122V52H132", at: 1050 },
  ];
  return (
    <svg viewBox="0 0 180 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2.4} opacity={0.45} />
      </defs>
      {companies.map((company) => (
        <g key={company.label}>
          <path d={building(company.x)} fill="none" stroke="#000" strokeWidth=".8" />
          <line x1={company.x - 20} x2={company.x + 20} y1="72" y2="72" stroke="#000" strokeWidth=".5" strokeOpacity=".4" />
          {windows(company.x).map((pane) => (
            <rect key={`${pane.x}-${pane.y}`} x={pane.x} y={pane.y} width="4" height="4" fill="none" stroke="#000" strokeWidth=".45" strokeOpacity=".5" />
          ))}
          <Draw d={company.leader} on={on} ms={360} delay={company.at} stroke="#000" strokeWidth=".5" strokeOpacity=".6" strokeDasharray="2 2" />
          <text x={company.x} y="86" textAnchor="middle" fontSize="6" letterSpacing=".12em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
            {company.label}
          </text>
        </g>
      ))}
      {/* The listed company's price, ticking along its roof. */}
      <Draw d="M18 30L24 26L30 29L36 22L42 25L48 19" on={on} ms={600} delay={1200} stroke="#000" strokeWidth=".8" strokeLinejoin="round" />
      {/* The project sheet, its corner folded, filling in row by row. */}
      <path d="M76 14H98L104 20V70H76Z" fill="#fff" stroke="#000" strokeWidth=".9" />
      <path d="M98 14V20H104" fill="none" stroke="#000" strokeWidth=".6" />
      {[26, 32, 38].map((y, row) => (
        <Draw key={y} d={`M81 ${y}H${row === 1 ? 93 : 99}`} on={on} ms={260} delay={150 + row * 140} stroke="#000" strokeWidth=".7" strokeOpacity=".7" />
      ))}
      <rect x="81" y="46" width="18" height="18" fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 400, 650) }} />
      <Draw d="M81 62L86 57L90 59L99 49" on={on} ms={420} delay={700} stroke="#000" strokeWidth=".9" strokeLinejoin="round" />
      <polygon points={hexPoints(104, 14, 4.2)} fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 360, 1500) }} />
    </svg>
  );
}

/**
 * In-depth sector and company research. Across the sector's companies one bar
 * is picked and hatched; the zoom opens it into the company's own page, whose
 * lines fill in and whose chart runs to the orange mark.
 */
function SectorGlyph({ on }: { on: boolean; t: Timing }) {
  const hatch = useId();
  const bars = [22, 34, 16, 40, 28];
  const picked = 3;
  const bar = (index: number) => ({ x: 14 + index * 10, top: 72 - bars[index] });
  const pick = bar(picked);
  return (
    <svg viewBox="0 0 180 90" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <Hatch id={hatch} ink="#000" gap={2} opacity={0.6} />
      </defs>
      <line x1="10" x2="66" y1="72" y2="72" stroke="#000" strokeWidth=".5" strokeOpacity=".4" />
      {bars.map((height, index) => {
        const { x, top } = bar(index);
        return <rect key={x} x={x} y={top} width="7" height={height} fill="none" stroke="#000" strokeWidth=".6" strokeOpacity={index === picked ? 0.9 : 0.4} />;
      })}
      <rect x={pick.x} y={pick.top} width="7" height={72 - pick.top} fill={`url(#${hatch})`} className={RM} style={{ opacity: on ? 1 : 0, ...tr("opacity", 360, 200) }} />
      <Draw d={`M${pick.x + 7} ${pick.top}L92 14M${pick.x + 7} 72L92 74`} on={on} ms={520} delay={480} stroke="#000" strokeWidth=".5" strokeOpacity=".5" strokeDasharray="2 2" />
      <Draw d="M92 14H168V74H92Z" on={on} ms={700} delay={760} stroke="#000" strokeWidth=".9" />
      {[22, 28, 34].map((y, row) => (
        <Draw key={y} d={`M98 ${y}H${[150, 132, 142][row]}`} on={on} ms={260} delay={1150 + row * 120} stroke="#000" strokeWidth=".7" strokeOpacity=".7" />
      ))}
      <line x1="98" x2="162" y1="68" y2="68" stroke="#000" strokeWidth=".5" strokeOpacity=".3" />
      <Draw d="M98 64L110 60L120 62L132 52L144 50L160 40" on={on} ms={600} delay={1450} stroke="#000" strokeWidth=".9" strokeLinejoin="round" />
      <polygon points={hexPoints(160, 40, 4.2)} fill={ORANGE} className={RM} style={{ ...BOX, transformOrigin: "center", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.7)", ...tr("opacity, transform", 360, 1950) }} />
      <text x="38" y="86" textAnchor="middle" fontSize="6" letterSpacing=".12em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
        SECTOR
      </text>
      <text x="130" y="86" textAnchor="middle" fontSize="6" letterSpacing=".12em" fill="#000" fillOpacity=".6" fontFamily={MONO}>
        COMPANY
      </text>
    </svg>
  );
}

const MEMBER_GLYPHS = {
  research: ResearchGlyph,
  compliance: ComplianceGlyph,
  valuation: ValuationGlyph,
  undervalued: UndervaluedGlyph,
  projects: ProjectsGlyph,
  sector: SectorGlyph,
} as const;

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
