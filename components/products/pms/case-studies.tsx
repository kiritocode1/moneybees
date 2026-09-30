"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { FOCUS } from "@/components/fact-sections/fact-section";
import { BODY, EYEBROW } from "@/components/hero/editorial";
import { type CaseStudy, PICK_TIERS, PICKS_LEAD } from "@/lib/insights";
import { CASE_FINANCIALS, type CaseName, PMS_HEADINGS } from "@/lib/pms";
import { GREY, MONO, ORANGE, PmsSection, PmsSectionHead, useReveal } from "./shared";

/*
 * The three case studies, group profile p21 to p23: what each company does,
 * its edge and its growth, beside the slide's grouped bars of Revenue, EBIDTA
 * and PAT for FY20 to FY24, in ₹ crore. The slides' price charts are left out:
 * only their axis ticks are printed, not the series.
 */

type Study = { name: CaseName; multiple: string; study: CaseStudy };

const STUDIES: readonly Study[] = PICK_TIERS.flatMap((tier) =>
  typeof tier.picks === "string"
    ? []
    : tier.picks.flatMap((pick) =>
        pick.caseStudy && pick.name in CASE_FINANCIALS ? [{ name: pick.name as CaseName, multiple: tier.multiple, study: pick.caseStudy }] : [],
      ),
);

const SERIES = [
  { key: "revenue", name: "Revenue", fill: "#D9D8D6" },
  { key: "ebidta", name: "EBIDTA", fill: GREY },
  { key: "pat", name: "PAT", fill: ORANGE },
] as const;

const W = 640;
const H = 300;
const BASE = 262;
const TOP = 30;
const LEFT = 8;
const BAR = 26;
const INNER = 3;

/** Grouped bars on one ₹ crore axis per company, rising from the base once in view. */
function FinancialBars({ name }: { name: CaseName }) {
  const { ref, run, at } = useReveal<HTMLDivElement>(0.4);
  const rows = CASE_FINANCIALS[name];
  const max = Math.max(...rows.map((row) => row.revenue));
  const group = (W - LEFT * 2) / rows.length;
  const y = (value: number) => BASE - (value / max) * (BASE - TOP);
  return (
    <div ref={ref} className="w-full">
      <div className={`${EYEBROW} mb-[16px] flex flex-wrap gap-x-[20px] gap-y-[8px] text-black/70`} aria-hidden="true">
        {SERIES.map((series) => (
          <span key={series.key} className="flex items-center gap-[8px]">
            <i className="h-[9px] w-[9px]" style={{ background: series.fill }} />
            {series.name}
          </span>
        ))}
        <span className="ml-auto text-black/50">All amounts in ₹ crore</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${name}, FY20 to FY24, in ₹ crore. ${SERIES.map((series) => `${series.name}: ${rows.map((row) => row[series.key]).join(", ")}`).join(". ")}.`}
        className="block h-auto w-full overflow-visible"
      >
        <line x1="0" x2={W} y1={BASE} y2={BASE} stroke="rgba(0,0,0,.5)" strokeDasharray="2 5" strokeLinecap="round" />
        {rows.map((row, index) => {
          const x0 = LEFT + group * index + (group - (BAR * 3 + INNER * 2)) / 2;
          return (
            <g key={row.year}>
              {SERIES.map((series, s) => {
                const value = row[series.key];
                const bx = x0 + s * (BAR + INNER);
                const delay = index * 0.1 + s * 0.06;
                return (
                  <g key={series.key}>
                    <motion.rect
                      x={bx}
                      y={y(value)}
                      width={BAR}
                      height={Math.max(1, BASE - y(value))}
                      fill={series.fill}
                      style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: run ? 1 : 0 }}
                      transition={at(delay, 0.8)}
                    />
                    <motion.text
                      x={bx + BAR / 2}
                      y={y(value) - 6}
                      textAnchor="middle"
                      className={`${MONO} fill-black/75 text-[9.5px] max-[700px]:hidden`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: run ? 1 : 0 }}
                      transition={at(delay + 0.6, 0.3)}
                    >
                      {value}
                    </motion.text>
                  </g>
                );
              })}
              <text x={x0 + (BAR * 3 + INNER * 2) / 2} y={BASE + 24} textAnchor="middle" className={`${MONO} fill-black/60 text-[11px] tracking-[.06em]`}>
                {row.year}
              </text>
            </g>
          );
        })}
      </svg>
      {/* The bar values are too small to read on a phone; the same figures as a table instead. */}
      <table className={`${MONO} mt-[20px] hidden w-full border-collapse text-[11px] max-[700px]:table`}>
        <thead>
          <tr className="text-black/55">
            <th className="py-[6px] text-left font-normal">₹ Cr</th>
            {rows.map((row) => (
              <th key={row.year} className="py-[6px] text-right font-normal">
                {row.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SERIES.map((series) => (
            <tr key={series.key} className="border-t border-t-[rgba(0,0,0,.13)]">
              <td className="py-[8px]">{series.name}</td>
              {rows.map((row) => (
                <td key={row.year} className="py-[8px] text-right tabular-nums">
                  {row[series.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Tabs for the three companies; the chart remounts on each switch so it grows again. */
export default function CaseStudies() {
  const [open, setOpen] = useState(0);
  const { name, multiple, study } = STUDIES[open];
  return (
    <PmsSection id="case-studies">
      <PmsSectionHead id="case-studies" label="Case studies" heading={PMS_HEADINGS.cases}>
        <p className={`max-w-[520px] text-black/70 ${BODY}`}>{PICKS_LEAD}</p>
      </PmsSectionHead>

      <div role="tablist" aria-label="Case studies" className="mt-[64px] grid grid-cols-3 border-y border-y-black max-[700px]:grid-cols-1">
        {STUDIES.map((item, index) => {
          const selected = index === open;
          return (
            <button
              key={item.name}
              type="button"
              role="tab"
              id={`case-tab-${index}`}
              aria-selected={selected}
              aria-controls="case-panel"
              onClick={() => setOpen(index)}
              className={`group relative flex items-baseline justify-between gap-4 border-r border-r-[rgba(0,0,0,.13)] px-[4px] py-[22px] text-left last:border-r-0 max-[700px]:border-r-0 max-[700px]:border-b max-[700px]:last:border-b-0 min-[701px]:not-first:pl-[24px] ${FOCUS}`}
            >
              <span className="font-serif text-[clamp(1.4rem,2vw,1.9rem)] leading-[1.1] transition-colors" style={{ color: selected ? "#000" : "rgba(0,0,0,.45)" }}>
                {item.name}
              </span>
              <span className={`${MONO} text-[12px]`} style={{ color: selected ? ORANGE : "rgba(0,0,0,.4)" }}>
                {item.multiple.replace(" ", "")}
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-[-1px] left-0 h-[3px] bg-[#F6A11A] transition-all duration-500"
                style={{ width: selected ? "100%" : "0%" }}
              />
            </button>
          );
        })}
      </div>

      <div id="case-panel" role="tabpanel" aria-labelledby={`case-tab-${open}`} className="mt-[56px] grid grid-cols-[.85fr_1.15fr] gap-[64px] max-[900px]:grid-cols-1 max-[900px]:gap-[40px]">
        <dl className="grid content-start gap-[26px]">
          <div>
            <dt className={`${EYEBROW} text-black/55`}>Multibagger</dt>
            <dd className="mt-[8px] font-serif text-[clamp(2.6rem,4vw,3.6rem)] leading-none text-[#F6A11A]">{multiple.replace(" ", "")}</dd>
          </div>
          {(
            [
              ["Business model", study.business],
              ["Competitive edge", study.edge],
              ["Growth prospect", study.growth],
            ] as const
          ).map(([term, text]) => (
            <div key={term} className="border-t border-t-[rgba(0,0,0,.13)] pt-[16px]">
              <dt className={`${EYEBROW} text-black/55`}>{term}</dt>
              <dd className="mt-[10px] text-[17px] leading-[1.5]">{text}</dd>
            </div>
          ))}
        </dl>
        <FinancialBars key={name} name={name} />
      </div>
    </PmsSection>
  );
}
