"use client";

import { useState } from "react";
import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import { ILLUSTRATIVE_SECTORS, PHILOSOPHY_POINTS, PHILOSOPHY_WORDS, PMS_LOREM, PMS_PAGE, PMS_PARTS, PORTFOLIO_APPROACH, WHY_PMS } from "@/lib/pms-v2";
import { RISKS } from "@/lib/approach";
import { RISK_GLYPHS } from "@/components/approach/glyphs";
import { DelayedOn, FOCUS, hexPoints, number, ORANGE, OrangeButton, T, useShown } from "./shared";
import { WHY_GLYPHS } from "./why-glyphs";

/*
 * /pms, content plan §3: heading and introduction, why Moneybee PMS, the
 * investment philosophy, the portfolio approach, and the drawings the plan
 * lists (philosophy graphic, portfolio construction, risk management). The
 * funnel and the performance chart live in their own files.
 */

export function PmsHero() {
  return (
    <section aria-labelledby="pms-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 items-end gap-14 pt-[150px] pb-[110px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:pt-[220px] max-md:pb-[72px]`}>
        <div>
          <Rise>
            <BracketLabel>PMS</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="pms-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {PMS_PAGE.heading}
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className={`mt-8 max-w-[560px] text-black/70 ${BODY}`}>{PMS_PAGE.intro}</p>
          </Rise>
          <Rise delay={0.16}>
            <div className="mt-10">
              <OrangeButton href={PMS_PAGE.cta.href}>{PMS_PAGE.cta.label}</OrangeButton>
            </div>
          </Rise>
        </div>
        <Rise delay={0.2}>
          <nav aria-label="On this page">
            <ol className="list-none border-t border-black p-0">
              {PMS_PARTS.map(([label, href], index) => (
                <li key={href} className="border-b border-black/15">
                  <a href={href} className={`group flex items-baseline gap-[18px] py-[14px] text-black no-underline ${FOCUS}`}>
                    <span className="w-[34px] text-[22px] leading-none font-light tracking-[-.04em] text-[#F7A11A]">{number(index)}</span>
                    <span className="text-[17px] text-black/75 transition-colors group-hover:text-black">{label}</span>
                    <span className="ml-auto h-[2px] w-0 bg-[#F7A11A] transition-all duration-300 group-hover:w-[28px]" />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Rise>
      </div>
    </section>
  );
}

/** Why Moneybee PMS?: seven points on a grey field, each card drawing its point; the eighth cell is the CTA. */
export function WhySection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.2);
  return (
    <section id="why" aria-labelledby="why-heading" className="scroll-mt-[96px] bg-[#F7F7F8] text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Why Moneybee</BracketLabel>
            <h2 id="why-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Why Moneybee PMS?
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{PMS_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-4">
          {WHY_PMS.map((point, index) => {
            const Glyph = WHY_GLYPHS[point.glyph];
            return (
              <article key={point.name} className="flex flex-col bg-white p-[28px] max-[600px]:p-[22px]">
                <span className={`${EYEBROW} text-[#F7A11A]`}>{number(index)}</span>
                <div className="mt-[18px] border-b border-black/10 pb-[18px]">
                  <DelayedOn on={shown} delay={index * 180}>
                    {(ready) => <Glyph on={ready} />}
                  </DelayedOn>
                </div>
                <h3 className="mt-[20px] font-serif text-[clamp(1.4rem,1.05rem+.7vw,1.75rem)] leading-[1.12] font-normal">{point.name}</h3>
                <p className="mt-[10px] text-[15px] leading-[1.55] text-black/65">{PMS_LOREM.short}</p>
              </article>
            );
          })}
          <div className="flex flex-col justify-between gap-8 bg-black p-[28px] text-white max-[600px]:p-[22px]">
            <p className="font-serif text-[clamp(1.4rem,1.05rem+.7vw,1.75rem)] leading-[1.12]">{PMS_LOREM.short}</p>
            <a
              href={PMS_PAGE.cta.href}
              className={`inline-flex w-fit items-center rounded-full bg-[#F7A11A] px-[22px] py-[12px] text-[14px] font-medium text-black no-underline transition-colors hover:bg-white ${FOCUS}`}
            >
              {PMS_PAGE.cta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The philosophy graphic: across the three words, attention on a company
 * thins out and its price drifts below its value. The gap that opens is the
 * margin of safety.
 */
function PhilosophyGraphic({ on }: { on: boolean }) {
  const reports = Array.from({ length: 30 }, (_, index) => ({ x: 52 + index * 27.5, h: Math.max(6, 70 - index * 2.3 + ((index * 7) % 5) * 3) }));
  return (
    <svg viewBox="0 0 900 360" className="block h-auto w-full" aria-hidden="true">
      {[300, 600].map((x) => (
        <line key={x} x1={x} x2={x} y1="0" y2="360" stroke="#000" strokeOpacity=".12" strokeDasharray="4 5" />
      ))}
      {/* Value holds; price drifts below it; the gap between them fills orange. */}
      <path d="M40 90C300 96 560 150 860 196V90Z" fill={ORANGE} opacity={on ? 0.22 : 0} className={T} style={{ transitionDelay: "700ms" }} />
      <path d="M40 90H860" stroke="#000" strokeWidth="1.6" strokeDasharray="6 6" />
      <path d="M40 90C300 96 560 150 860 196" fill="none" stroke={ORANGE} strokeWidth="3.5" strokeDasharray="900" strokeDashoffset={on ? 0 : 900} className="transition-[stroke-dashoffset] duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:duration-0" />
      <text x="852" y="78" textAnchor="end" fontSize="16" fill="#000" letterSpacing=".1em" className="max-md:text-[30px]">
        VALUE
      </text>
      <text x="852" y="222" textAnchor="end" fontSize="16" fill={ORANGE} letterSpacing=".1em" opacity={on ? 1 : 0} className={`${T} max-md:text-[30px]`} style={{ transitionDelay: "900ms" }}>
        PRICE
      </text>
      <g opacity={on ? 1 : 0} className={T} style={{ transitionDelay: "1100ms" }}>
        <path d="M790 96V180M782 96h16M782 180h16" stroke="#000" strokeWidth="1.4" />
        <text x="776" y="143" textAnchor="end" fontSize="15" fill="#000" letterSpacing=".08em" stroke="#fdf0dc" strokeWidth="8" paintOrder="stroke" className="max-md:text-[24px]">
          MARGIN OF SAFETY
        </text>
      </g>
      {/* Below: the reports written on the company, thinning out from left to right. */}
      <line x1="40" x2="860" y1="340" y2="340" stroke="#000" strokeOpacity=".3" />
      {reports.map((report, index) => (
        <rect key={index} x={report.x} y={on ? 340 - report.h : 340} width="14" height={on ? report.h : 0} fill="#000" fillOpacity=".75" className={T} style={{ transitionDelay: `${index * 30}ms` }} />
      ))}
      <text x="48" y="248" fontSize="15" fill="#000" opacity=".6" letterSpacing=".1em" className="max-md:text-[30px]">
        ATTENTION
      </text>
    </svg>
  );
}

export function PhilosophySection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.35);
  return (
    <section id="philosophy" aria-labelledby="philosophy-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Philosophy</BracketLabel>
            <h2 id="philosophy-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Investment Philosophy
            </h2>
          </div>
          <p className={`text-black/70 ${BODY}`}>{PMS_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[64px] border border-black/15">
          <ol className="m-0 grid list-none grid-cols-3 border-b border-black/15 p-0">
            {PHILOSOPHY_WORDS.map((word, index) => (
              <li key={word} className="flex items-baseline gap-2 border-black/15 px-[20px] py-[18px] not-first:border-l max-md:flex-col max-md:gap-1 max-md:px-[10px]">
                <span className={`${EYEBROW} text-[#F7A11A]`}>{number(index)}</span>
                <span className="text-[clamp(.72rem,.45rem+1.2vw,1.6rem)] leading-none font-light tracking-[-.02em] uppercase">{word}</span>
              </li>
            ))}
          </ol>
          <div className="pt-[24px] pb-[16px]">
            <PhilosophyGraphic on={shown} />
          </div>
        </div>
        <ol className="mt-[48px] grid list-none grid-cols-1 gap-x-8 p-0 md:grid-cols-5">
          {PHILOSOPHY_POINTS.map((point, index) => (
            <li key={point} className="border-t border-black py-[16px]">
              <span className={`${EYEBROW} text-[#F7A11A]`}>{number(index)}</span>
              <p className="mt-[10px] font-serif text-[clamp(1.2rem,1rem+.5vw,1.4rem)] leading-[1.2]">{point}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const TOTAL_HOLDINGS = ILLUSTRATIVE_SECTORS.reduce((sum, sector) => sum + sector.holdings, 0);
const SHADES = ["#000", "#333", "#5c5c5c", "#858585", "#adadad", "#d1d1d1"];
const CAP = 30;
/** Each cell of the honeycomb, tagged with the sector that owns it. */
const CELLS = ILLUSTRATIVE_SECTORS.flatMap((sector, sectorIndex) => Array.from({ length: sector.holdings }, () => sectorIndex)).map((sector, index) => {
  const r = 30;
  const w = Math.sqrt(3) * r;
  const row = Math.floor(index / 6);
  const col = index % 6;
  return { sector, x: 40 + col * w + (row % 2) * (w / 2), y: 40 + row * r * 1.5, index };
});

/**
 * The portfolio construction diagram: 18 holdings as a honeycomb, coloured by
 * sector, beside each sector's weight against the 30% cap. Pointing at a
 * sector lights its cells.
 */
export function PortfolioSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 gap-14 py-[120px] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-20 max-md:py-[80px]`}>
        <div ref={ref}>
          <BracketLabel>Portfolio approach</BracketLabel>
          <h2 id="portfolio-heading" className={`mt-[18px] ${SUBHEAD}`}>
            Portfolio Approach
          </h2>
          <div className="mt-[40px] border border-black/15 p-[28px] max-[600px]:p-[16px]">
            <div className="flex items-baseline justify-between">
              <span className={`${EYEBROW} text-black/55`}>Illustration</span>
              <span className={`${EYEBROW} text-black/55`}>{TOTAL_HOLDINGS} holdings</span>
            </div>
            <svg viewBox="0 0 368 170" className="mt-[16px] block h-auto w-full" aria-hidden="true">
              {CELLS.map((cell) => {
                const lit = active === null || active === cell.sector;
                return (
                  <polygon
                    key={cell.index}
                    points={hexPoints(cell.x, cell.y, shown ? 27 : 8)}
                    fill={active === cell.sector ? ORANGE : SHADES[cell.sector]}
                    opacity={lit ? 1 : 0.15}
                    className={T}
                    style={{ transitionDelay: active === null ? `${cell.index * 40}ms` : "0ms" }}
                  />
                );
              })}
            </svg>
            <ul className="mt-[24px] list-none p-0">
              {ILLUSTRATIVE_SECTORS.map((sector, index) => {
                const share = (sector.holdings / TOTAL_HOLDINGS) * 100;
                return (
                  <li key={sector.name}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(index)}
                      onBlur={() => setActive(null)}
                      className={`grid w-full grid-cols-[76px_minmax(0,1fr)_48px] items-center gap-3 py-[6px] text-left ${FOCUS}`}
                    >
                      <span className="flex items-center gap-2 text-[13px] text-black/70">
                        <i className="h-[10px] w-[10px]" style={{ backgroundColor: active === index ? ORANGE : SHADES[index] }} />
                        {sector.name}
                      </span>
                      <span className="relative h-[10px] bg-black/[.06]">
                        <span
                          className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:duration-0"
                          style={{ width: shown ? `${(share / 35) * 100}%` : "0%", backgroundColor: active === index ? ORANGE : "#000", transitionDelay: `${index * 80}ms` }}
                        />
                        {index === 0 && (
                          <span className="absolute -top-[18px] -translate-x-1/2 text-[10px] tracking-[.08em] text-[#F7A11A]" style={{ left: `${(CAP / 35) * 100}%` }}>
                            CAP
                          </span>
                        )}
                        <span className="absolute -inset-y-[4px] w-[2px] bg-[#F7A11A]" style={{ left: `${(CAP / 35) * 100}%` }} />
                      </span>
                      <span className="text-right text-[13px] tabular-nums text-black/70">{share.toFixed(1)}%</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="md:pt-[120px]">
          <p className={`text-black/70 ${BODY}`}>{PMS_LOREM.long}</p>
          <ol className="mt-[40px] list-none border-t border-black p-0">
            {PORTFOLIO_APPROACH.map((item, index) => (
              <li key={item} className="grid grid-cols-[34px_minmax(0,1fr)] items-baseline gap-x-[14px] border-b border-black/15 py-[16px]">
                <span className="text-[20px] leading-none font-light tracking-[-.04em] text-[#F7A11A]">{number(index)}</span>
                <span className="font-serif text-[clamp(1.2rem,1rem+.5vw,1.45rem)] leading-[1.25]">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}


/** Where each numbered control sits on the risk drawing. */
/**
 * The risk-management graphic: the four risks the content plan names (§6),
 * each drawn by the same explainer as /our-approach, played in turn.
 */
export function RiskSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section id="risk" aria-labelledby="risk-heading" className="scroll-mt-[96px] bg-black text-white">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <BracketLabel>Risk management</BracketLabel>
            <h2 id="risk-heading" className={`mt-[18px] ${SUBHEAD}`}>
              Risk Management
            </h2>
          </div>
          <p className={`text-white/70 ${BODY}`}>{PMS_LOREM.long}</p>
        </div>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-4">
          {RISKS.map((risk, index) => {
            const Glyph = RISK_GLYPHS[risk.glyph];
            return (
              <article key={risk.name} className="flex flex-col bg-white p-[28px] text-black max-[600px]:p-[22px]">
                <span className={`${EYEBROW} text-[#F7A11A]`}>{number(index)}</span>
                <div className="mt-[18px] border-b border-black/10 pb-[18px]">
                  <DelayedOn on={shown} delay={index * 260}>
                    {(ready) => <Glyph on={ready} />}
                  </DelayedOn>
                </div>
                <h3 className="mt-[20px] font-serif text-[clamp(1.5rem,1.1rem+.8vw,1.9rem)] leading-[1.1] font-normal">{risk.name}</h3>
                <p className="mt-[10px] text-[15px] leading-[1.55] text-black/65">{risk.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
