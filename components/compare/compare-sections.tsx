"use client";

import { BracketLabel } from "@/components/fact-sections/fact-section";
import { Rise } from "@/components/hero/editorial";
import { BODY, COLUMN, EYEBROW, HEADING, SUBHEAD } from "@/components/hero/tokens";
import { DelayedOn, FOCUS, hexPoints, number, ORANGE, T, useShown } from "@/components/pms-v2/shared";
import { COMPARE, COMPARE_PARTS, COMPARISON, EXPLANATION } from "@/lib/compare";
import { AifChain, PmsChain } from "./chain-diagrams";
import { ROW_GLYPHS } from "./row-glyphs";

/*
 * /pms-vs-aif, content plan §5: the heading with the plan's two diagrams, the
 * simple comparison row by row, and the simple explanation. Every row and
 * card draws what its words say.
 */

const CHAIN_DIAGRAMS = [
  { label: "PMS", Diagram: PmsChain, delay: 0 },
  { label: "AIF", Diagram: AifChain, delay: 400 },
] as const;

export function CompareHero() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  return (
    <section aria-labelledby="compare-heading" className="bg-white text-black">
      <div className={`${COLUMN} grid grid-cols-1 items-end gap-14 pt-[150px] pb-[72px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-20 md:pt-[220px]`}>
        <div>
          <Rise>
            <BracketLabel>PMS vs AIF</BracketLabel>
          </Rise>
          <Rise delay={0.05}>
            <h1 id="compare-heading" className={`${HEADING} mt-[22px] text-balance text-[clamp(2.75rem,1.2rem+4.4vw,5rem)]`}>
              {COMPARE.heading}
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className={`mt-8 max-w-[520px] text-black/70 ${BODY}`}>{COMPARE.lead}</p>
          </Rise>
        </div>
        <Rise delay={0.2}>
          <nav aria-label="On this page">
            <ol className="list-none border-t border-black p-0">
              {COMPARE_PARTS.map(([label, href], index) => (
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
      <div id="structures" ref={ref} className={`${COLUMN} scroll-mt-[96px] pb-[120px] max-md:pb-[80px]`}>
        <div className="grid grid-cols-1 gap-[2px] bg-[#F7F7F8] p-[2px] md:grid-cols-2">
          {CHAIN_DIAGRAMS.map(({ label, Diagram, delay }) => (
            <div key={label} className="bg-white p-[32px] max-[600px]:p-[18px]">
              <span className={`${EYEBROW} text-[#F7A11A]`}>{label}</span>
              <div className="mt-[18px]">
                <DelayedOn on={shown} delay={delay}>
                  {(ready) => <Diagram on={ready} />}
                </DelayedOn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The simple comparison on black: PMS and AIF side by side, each cell with its drawing, rows played in turn. */
export function ComparisonSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.2);
  return (
    <section id="comparison" aria-labelledby="comparison-heading" className="scroll-mt-[96px] bg-black text-white">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <BracketLabel>Comparison</BracketLabel>
        <h2 id="comparison-heading" className={`mt-[18px] ${SUBHEAD}`}>
          Simple Comparison
        </h2>
        <div ref={ref} className="mt-[56px]" role="table" aria-label="PMS compared with AIF">
          <div role="row" className="grid grid-cols-2 border-b border-white/40">
            {["PMS", "AIF"].map((head, index) => (
              <div role="columnheader" key={head} className={`pb-[16px] text-[clamp(2rem,1.4rem+2vw,3.4rem)] leading-none font-light tracking-[-.04em] ${index ? "border-l border-white/15 pl-[32px] max-md:pl-[14px]" : "pr-[32px] max-md:pr-[14px]"}`}>
                <span className={index ? "text-white" : "text-[#F7A11A]"}>{head}</span>
              </div>
            ))}
          </div>
          {COMPARISON.map((row, index) => {
            const pair = ROW_GLYPHS[row.glyph];
            return (
              <div role="row" key={row.glyph} className="grid grid-cols-2 border-b border-white/15" style={{ opacity: shown ? 1 : 0.3, transition: `opacity 500ms ease ${index * 180}ms` }}>
                {([
                  [row.pms, pair.pms],
                  [row.aif, pair.aif],
                ] as const).map(([text, Glyph], side) => (
                  <div
                    role="cell"
                    key={side}
                    className={`grid grid-cols-[minmax(0,1fr)_150px] items-center gap-6 py-[22px] max-lg:grid-cols-1 max-lg:gap-3 ${side ? "border-l border-white/15 pl-[32px] max-md:pl-[14px]" : "pr-[32px] max-md:pr-[14px]"}`}
                  >
                    <span className="font-serif text-[clamp(1.1rem,.9rem+.8vw,1.75rem)] leading-[1.2]">{text}</span>
                    <DelayedOn on={shown} delay={index * 180 + side * 90 + 200}>
                      {(ready) => <Glyph on={ready} />}
                    </DelayedOn>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** PMS: a mandate on the left, and the portfolio arranged to it. */
function MandateDrawing({ on }: { on: boolean }) {
  const scattered = [
    [178, 40],
    [236, 104],
    [264, 30],
    [200, 110],
    [250, 66],
  ];
  const arranged = [
    [196, 50],
    [224, 50],
    [252, 50],
    [210, 76],
    [238, 76],
  ];
  return (
    <svg viewBox="0 0 300 140" className="block h-auto w-full" aria-hidden="true">
      <rect x="14" y="14" width="86" height="112" rx="3" fill="#fff" stroke="#000" strokeWidth="1.4" />
      <text x="57" y="36" textAnchor="middle" fontSize="10" fill="#000" letterSpacing=".12em">
        MANDATE
      </text>
      {[52, 66, 80, 94, 108].map((y, index) => (
        <rect key={y} x="26" y={y} width={index % 2 ? 48 : 62} height="4" fill="rgba(0,0,0,.14)" />
      ))}
      <path d="M110 70H160M152 62l8 8-8 8" fill="none" stroke="#000" strokeWidth="1.4" strokeDasharray="66" strokeDashoffset={on ? 0 : 66} className={T} />
      <rect x="174" y="22" width="112" height="96" rx="3" fill="none" stroke={on ? ORANGE : "rgba(0,0,0,.2)"} strokeWidth="1.4" className={T} style={{ transitionDelay: "500ms" }} />
      {scattered.map(([x, y], index) => {
        const [tx, ty] = arranged[index];
        return (
          <polygon key={index} points={hexPoints(on ? tx : x, on ? ty : y, 12)} fill={index === 0 && on ? ORANGE : "#000"} className={T} style={{ transitionDelay: `${300 + index * 90}ms` }} />
        );
      })}
    </svg>
  );
}

/** AIF: contributions pool in the fund, which follows its approved strategy and documents. */
function PoolDrawing({ on }: { on: boolean }) {
  const investors = [22, 50, 78, 106];
  return (
    <svg viewBox="0 0 300 140" className="block h-auto w-full" aria-hidden="true">
      {investors.map((y, index) => (
        <g key={y}>
          <circle cx="22" cy={y + 6} r="7" fill="#000" />
          <path d={`M34 ${y + 6}L126 76`} stroke="#000" strokeWidth="1.2" strokeDasharray="100" strokeDashoffset={on ? 0 : 100} className={T} style={{ transitionDelay: `${index * 90}ms` }} />
        </g>
      ))}
      <circle cx="160" cy="76" r="36" fill="#fff" stroke="#000" strokeWidth="1.4" />
      <circle cx="160" cy="76" r={on ? 28 : 4} fill={ORANGE} className={T} style={{ transitionDelay: "450ms" }} />
      <path d="M198 60H226" stroke="#000" strokeWidth="1.2" strokeDasharray="3 3" opacity={on ? 1 : 0} className={T} style={{ transitionDelay: "700ms" }} />
      <g opacity={on ? 1 : 0.25} className={T} style={{ transitionDelay: "700ms" }}>
        <rect x="236" y="30" width="50" height="62" rx="3" fill="#fff" stroke="#000" strokeWidth="1.4" />
        <rect x="230" y="36" width="50" height="62" rx="3" fill="#fff" stroke="#000" strokeWidth="1.4" />
        {[50, 62, 74].map((y) => (
          <rect key={y} x="238" y={y} width="32" height="4" fill="rgba(0,0,0,.14)" />
        ))}
        <path d="M244 86l6 6 12-12" fill="none" stroke={ORANGE} strokeWidth="2" />
      </g>
    </svg>
  );
}

/** The simple explanation: the plan's two sentences, each beside a drawing of it. */
export function ExplanationSection() {
  const { ref, shown } = useShown<HTMLDivElement>(0.3);
  const cards = [
    { label: "PMS", text: EXPLANATION.pms, Drawing: MandateDrawing },
    { label: "AIF", text: EXPLANATION.aif, Drawing: PoolDrawing },
  ];
  return (
    <section id="explanation" aria-labelledby="explanation-heading" className="scroll-mt-[96px] bg-white text-black">
      <div className={`${COLUMN} py-[120px] max-md:py-[80px]`}>
        <BracketLabel>Explanation</BracketLabel>
        <h2 id="explanation-heading" className={`mt-[18px] ${SUBHEAD}`}>
          Simple Explanation
        </h2>
        <div ref={ref} className="mt-[56px] grid grid-cols-1 gap-8 md:grid-cols-2">
          {cards.map(({ label, text, Drawing }, index) => (
            <article key={label} className="border border-black/15 p-[32px] max-[600px]:p-[20px]">
              <span className="text-[clamp(2rem,1.4rem+2vw,3.4rem)] leading-none font-light tracking-[-.04em] text-[#F7A11A]">{label}</span>
              <div className="mt-[28px] border-y border-black/10 py-[22px]">
                <DelayedOn on={shown} delay={index * 500}>
                  {(ready) => <Drawing on={ready} />}
                </DelayedOn>
              </div>
              <p className="mt-[22px] font-serif text-[clamp(1.25rem,1rem+.7vw,1.6rem)] leading-[1.3]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
