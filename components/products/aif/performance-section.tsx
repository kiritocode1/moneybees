"use client";

import { useRef } from "react";
import { BracketLabel, SOLID_GLOW } from "@/components/fact-sections/fact-section";
import { BODY, COLUMN, DashedRule, EYEBROW, Rise, SUBHEAD } from "@/components/hero/editorial";
import { AIF_DATES, AIF_HEADINGS, AIF_RETURNS, AIF_SECTORS } from "@/lib/aif";
import { at, box } from "./iso";
import { stagger, useBuild } from "./use-build";

const MONO = "font-[family-name:var(--font-geist-mono)]";
const pct = (value: number) => `${value.toFixed(2)}%`;

/* --------------------------------------------------------------- sectors --- */

const BAR = 54;
/** Plan step between bars along (a, -a), which projects to a flat screen row. */
const STEP = 80;
/** Screen units per percentage point of AUM. */
const SCALE = 23;
const OX = 70;
const OY = 360;

/** Two lines for a sector name, split at "and" or "&" the way the slide wraps them. */
const nameLines = (name: string) => {
  const cut = name.search(/ (and|&) /);
  return cut < 0 ? [name] : [name.slice(0, cut), name.slice(cut + 1)];
};

/**
 * The fund's top five sectors (AIF presentation p10) as isometric bars in one
 * row on a dashed ground plate, largest first as on the slide. Once in view
 * each bar grows from the plate and its share counts up with it; the largest
 * is lit orange, the rest carry an orange top.
 */
function SectorBars() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useBuild(ref, 2.4, 0.35);
  const plate = [at(-40, 40, 0, OX, OY), at(4 * STEP + BAR + 40, -4 * STEP + 40 - BAR, 0, OX, OY)];

  return (
    <div ref={ref} className="w-full max-w-[720px]">
      <svg
        viewBox="0 0 720 470"
        role="img"
        aria-label={`Top 5 sector allocation as a percentage of AUM, as on ${AIF_DATES.asOn}: ${AIF_SECTORS.map((s) => `${s.name} ${pct(s.share)}`).join(", ")}.`}
        className="block h-auto w-full overflow-visible"
      >
        <text x={OX - 30} y={40} className={`${MONO} fill-black/60 text-[11px] tracking-[.1em] uppercase max-md:text-[18px]`}>
          % of AUM
        </text>
        <line x1={plate[0][0]} y1={OY + 44} x2={plate[1][0]} y2={OY + 44} stroke="rgba(0,0,0,.3)" strokeDasharray="2 6" strokeLinecap="round" opacity={Math.min(1, progress * 4)} />
        {AIF_SECTORS.map((sector, index) => {
          const grow = stagger(progress, index, AIF_SECTORS.length, 0.5);
          const height = Math.max(0.5, sector.share * SCALE * grow);
          const faces = box(index * STEP, -index * STEP, BAR, BAR, height, 0, OX, OY);
          const lit = index === 0;
          const [cx] = at(index * STEP + BAR / 2, -index * STEP + BAR / 2, 0, OX, OY);
          const [, topY] = at(index * STEP, -index * STEP, height, OX, OY);
          const [, footY] = at(index * STEP + BAR, -index * STEP + BAR, 0, OX, OY);
          return (
            <g key={sector.name}>
              <g opacity={Math.min(1, grow * 4)} stroke={lit ? "rgba(90,50,0,.75)" : "rgba(0,0,0,.6)"} strokeWidth="0.9" strokeLinejoin="round" style={{ filter: lit && grow > 0.9 ? SOLID_GLOW : "none" }}>
                <path d={faces.left} fill={lit ? "#c97f0c" : "#e6e4df"} />
                <path d={faces.right} fill={lit ? "#e3920f" : "#f1efeb"} />
                <path d={faces.top} fill="#F7A11A" />
              </g>
              <text x={cx} y={topY - 14} textAnchor="middle" className={`${MONO} fill-black text-[14px] tabular-nums max-md:text-[22px]`} opacity={grow}>
                {(sector.share * grow).toFixed(2)}
              </text>
              <text x={cx} y={footY + 28} textAnchor="middle" className={`${MONO} fill-black/60 text-[11px] tracking-[.06em] uppercase max-md:text-[15px] max-md:tracking-normal`}>
                {nameLines(sector.name).map((line, lineIndex) => (
                  <tspan key={line} x={cx} dy={lineIndex ? "1.35em" : 0}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Top 5 sector allocation: where the fund's money sits, sector by sector. */
export function SectorsSection() {
  return (
    <section id="sectors" aria-labelledby="sectors-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-12 py-[110px] md:grid-cols-[.8fr_1.2fr]`}>
        <Rise onView>
          <div className="flex flex-col gap-8">
            <BracketLabel>Where the fund is invested</BracketLabel>
            <h2 id="sectors-heading" className={SUBHEAD}>
              {AIF_HEADINGS.sectors}
            </h2>
            <p className={BODY}>
              The five largest sectors in the fund on {AIF_DATES.asOn}, as a share of its assets under management. Food and agriculture leads at{" "}
              {pct(AIF_SECTORS[0].share)}.
            </p>
          </div>
        </Rise>
        <SectorBars />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- returns --- */

const BASE = 330;
/** Screen units per percentage point of return. */
const K = 10;
const LIFE = { from: 92, to: 362 } as const;
const SLOT_X = [165, 290, 450, 562, 674];
const PAIR = 34;

/**
 * The fund's TWRR returns against the S&P BSE 500 (AIF presentation p10), on
 * a line of periods. The shaded band is the fund's life so far, from its first
 * close to the return date: the three and six month bars grow inside it, and
 * the one, three and five year slots stand past its edge as dashed outlines
 * marked NA, because the fund has not been open that long.
 */
function ReturnsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useBuild(ref, 2.4, 0.35);
  const band = stagger(progress, 0, 4, 0.3);

  return (
    <div ref={ref} className="w-full max-w-[720px]">
      <div className={`${EYEBROW} mb-[18px] flex gap-[20px] text-black/70`} aria-hidden="true">
        <span className="flex items-center gap-[8px]">
          <i className="h-[9px] w-[9px] bg-[#F7A11A]" />
          Flyingbee Investment Fund
        </span>
        <span className="flex items-center gap-[8px]">
          <i className="h-[9px] w-[9px] bg-[#9D9EA1]" />
          S&amp;P BSE 500
        </span>
      </div>
      <svg
        viewBox="0 0 720 400"
        role="img"
        aria-label={`TWRR returns as on ${AIF_DATES.asOn}. ${AIF_RETURNS.map((row) =>
          row.fund === null ? `${row.period}: not available` : `${row.period}: ${pct(row.fund)} against ${pct(row.benchmark ?? 0)} for the S&P BSE 500`,
        ).join(". ")}. First close declared on ${AIF_DATES.firstClose}.`}
        className="block h-auto w-full overflow-visible"
      >
        <rect x={LIFE.from} y={34} width={(LIFE.to - LIFE.from) * band} height={BASE - 34} fill="#FDEFE2" />
        {[LIFE.from, LIFE.to].map((x, index) => (
          <g key={x} opacity={band}>
            <line x1={x} x2={x} y1={-2} y2={BASE + 8} stroke="rgba(0,0,0,.45)" strokeDasharray="2 5" strokeLinecap="round" />
            <text x={x + (index ? -8 : 8)} y={10} textAnchor={index ? "end" : "start"} className={`${MONO} fill-black/60 text-[10px] tracking-[.08em] uppercase max-md:text-[12px] max-md:tracking-normal`}>
              {(index ? ["Return as on", AIF_DATES.asOn] : ["First close", AIF_DATES.firstClose]).map((line, lineIndex) => (
                <tspan key={line} x={x + (index ? -8 : 8)} dy={lineIndex ? "1.35em" : 0}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}
        <line x1={40} x2={710} y1={BASE} y2={BASE} stroke="rgba(0,0,0,.55)" />

        {AIF_RETURNS.map((row, index) => {
          const x = SLOT_X[index];
          const grow = stagger(progress, index + 1, 7, 0.35);
          if (row.fund === null || row.benchmark === null) {
            return (
              <g key={row.period} opacity={grow}>
                <rect x={x - PAIR - 3} y={BASE - 120} width={PAIR * 2 + 6} height={120} fill="none" stroke="rgba(0,0,0,.35)" strokeDasharray="3 5" />
                <text x={x} y={BASE - 55} textAnchor="middle" className={`${MONO} fill-black/55 text-[13px] tracking-[.1em] max-md:text-[22px]`}>
                  NA
                </text>
                <text x={x} y={BASE + 28} textAnchor="middle" className={`${MONO} fill-black/60 text-[11px] tracking-[.06em] uppercase max-md:text-[20px]`}>
                  {row.short}
                </text>
              </g>
            );
          }
          const bars = [
            { value: row.fund, fill: "#F7A11A", dx: -PAIR - 3 },
            { value: row.benchmark, fill: "#9D9EA1", dx: 3 },
          ];
          return (
            <g key={row.period}>
              {bars.map(({ value, fill, dx }) => {
                const h = value * K * grow;
                return (
                  <g key={fill}>
                    <rect x={x + dx} y={BASE - h} width={PAIR} height={h} fill={fill} />
                    <text x={x + dx + PAIR / 2} y={BASE - h - 9} textAnchor="middle" className={`${MONO} fill-black text-[11px] tabular-nums max-md:text-[18px]`} opacity={grow}>
                      {(value * grow).toFixed(2)}
                    </text>
                  </g>
                );
              })}
              <text x={x} y={BASE + 28} textAnchor="middle" className={`${MONO} fill-black/60 text-[11px] tracking-[.06em] uppercase max-md:text-[20px]`}>
                {row.short}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const byPeriod = (period: string) => {
  const row = AIF_RETURNS.find((item) => item.period === period);
  if (!row || row.fund === null || row.benchmark === null) throw new Error(`No "${period}" return in AIF_RETURNS`);
  return { fund: row.fund, benchmark: row.benchmark };
};
const SIX = byPeriod("6 Months");
const THREE = byPeriod("3 Months");

/** Moneybee AIF performance: the returns the deck prints, and the periods it cannot print yet. */
export function ReturnsSection() {
  return (
    <section id="performance" aria-labelledby="performance-heading" className="bg-white text-black">
      <DashedRule />
      <div className={`${COLUMN} grid grid-cols-1 items-center gap-12 py-[110px] md:grid-cols-[1.2fr_.8fr]`}>
        <div className="md:order-last">
          <Rise onView>
            <div className="flex flex-col gap-8">
              <BracketLabel>Performance</BracketLabel>
              <h2 id="performance-heading" className={SUBHEAD}>
                {AIF_HEADINGS.performance}
              </h2>
              <dl className="grid grid-cols-2 gap-6 border-t border-t-black pt-[22px]">
                {(
                  [
                    ["6 months", SIX],
                    ["3 months", THREE],
                  ] as const
                ).map(([label, row]) => (
                  <div key={label}>
                    <dt className={`${EYEBROW} text-black/60`}>{label}</dt>
                    <dd className="mt-[10px] font-serif text-[clamp(2.4rem,3.6vw,3.4rem)] leading-none text-[#F7A11A] tabular-nums">{pct(row.fund)}</dd>
                    <dd className={`${EYEBROW} mt-[10px] text-black/60`}>S&amp;P BSE 500 {pct(row.benchmark)}</dd>
                  </div>
                ))}
              </dl>
              <p className={BODY}>
                The fund&rsquo;s first close was on {AIF_DATES.firstClose}. It has not run for a full year yet, so there is no one, three or five year return.
              </p>
              <p className="text-[15px] leading-[1.6] text-black/65">
                Returns are time weighted, as on {AIF_DATES.asOn}, and net of management fees, expenses and taxes.
              </p>
            </div>
          </Rise>
        </div>
        <ReturnsChart />
      </div>
    </section>
  );
}
