import { AIF_PRODUCT, PMS_PRODUCT } from "@/lib/insights";
import { BracketLabel } from "./fact-section";

/*
 * The two products in their decks' own terms, one per product page (/pms and
 * /aif). They used to sit side by side on the homepage.
 */

const HEADING = "mt-[22px] text-[clamp(3rem,6vw,6rem)] leading-[.95] font-light tracking-[-.05em]";
const LEAD = "mt-[22px] max-w-[46ch] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-[1.5] text-[rgba(0,0,0,.78)]";

export function PmsPanel() {
  return (
    <div>
      <BracketLabel>Portfolio Management Service</BracketLabel>
      <h1 className={HEADING}>{PMS_PRODUCT.name}</h1>
      <p className={LEAD}>{PMS_PRODUCT.lead}</p>
      <ul className="mt-[48px] list-none border-t border-t-[rgba(0,0,0,.13)] p-0">
        {PMS_PRODUCT.points.map((point) => (
          <li key={point} className="flex gap-[14px] border-b border-b-[rgba(0,0,0,.13)] py-[18px] text-[16px] leading-[1.5]">
            <span className="mt-[.55em] h-[7px] w-[7px] shrink-0 bg-[#F7A11A]" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AifPanel() {
  return (
    <div>
      <BracketLabel>Category III Alternative Investment Fund</BracketLabel>
      <h1 className={HEADING}>{AIF_PRODUCT.name}</h1>
      <p className={LEAD}>{AIF_PRODUCT.lead}</p>
      <dl className="mt-[48px] grid grid-cols-[220px_1fr] border-t border-t-[rgba(0,0,0,.13)] text-[16px] max-[600px]:grid-cols-1">
        {AIF_PRODUCT.terms.map(([term, value]) => (
          <div key={term} className="contents">
            <dt className="border-b border-b-[rgba(0,0,0,.13)] py-[16px] text-[12px] uppercase tracking-[.08em] text-[rgba(0,0,0,.55)] max-[600px]:border-0 max-[600px]:pb-0">
              {term}
            </dt>
            <dd className="border-b border-b-[rgba(0,0,0,.13)] py-[16px] leading-[1.45]">{value}</dd>
          </div>
        ))}
      </dl>
      <table className="mt-[40px] w-full border-collapse text-left text-[16px]">
        <thead>
          <tr className="text-[12px] uppercase tracking-[.1em] text-[rgba(0,0,0,.55)]">
            <th className="py-[8px] font-normal">TWRR Returns</th>
            <th className="py-[8px] text-right font-normal">Flyingbee</th>
            <th className="py-[8px] text-right font-normal">S&amp;P BSE 500</th>
          </tr>
        </thead>
        <tbody>
          {AIF_PRODUCT.performance.map(([period, fund, index]) => (
            <tr key={period} className="border-t border-t-[rgba(0,0,0,.13)]">
              <td className="py-[12px]">{period}</td>
              <td className="py-[12px] text-right tabular-nums">{fund}</td>
              <td className="py-[12px] text-right tabular-nums text-[rgba(0,0,0,.6)]">{index}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
