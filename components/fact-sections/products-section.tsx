import { AIF_PRODUCT, PMS_PRODUCT, PMS_VS_AIF } from "@/lib/insights";
import { BracketLabel, SectionHeading } from "./fact-section";
import { Panel, SplitFrame } from "./motion-language";
import PartnersSection from "./partners-section";

/**
 * What you can invest in: Moneybee PMS and the Flyingbee fund side by side,
 * each in its decks' own terms, then the line that separates them and the
 * fund's structure. Replaces the homepage's "What we do" link list.
 */
/** `bare` drops the heading when the homepage's "Specialising in…" section already introduces the two products. */
export default function ProductsSection({ bare = false }: { bare?: boolean }) {
  return (
    <>
    <section id="products" aria-labelledby={bare ? undefined : "products-heading"} aria-label={bare ? "Moneybee PMS and Flyingbee Investment Fund" : undefined} className="bg-white">
      {!bare && <SectionHeading id="products" label="What you can invest in" heading="Moneybee PMS and Flyingbee Investment Fund" lead={PMS_VS_AIF} />}
      <div className={bare ? "" : "mt-[72px]"}>
        <SplitFrame>
          <Panel className="flex flex-col p-[40px] max-[600px]:p-[24px]">
            <BracketLabel>Portfolio Management Service</BracketLabel>
            <h3 className="mt-[18px] text-[clamp(2rem,3.2vw,3.2rem)] font-light tracking-[-.045em]">{PMS_PRODUCT.name}</h3>
            <p className="mt-[14px] max-w-[46ch] text-[15px] leading-[1.55]">{PMS_PRODUCT.lead}</p>
            <ul className="mt-[26px] list-none border-t border-t-[rgba(0,0,0,.13)] p-0">
              {PMS_PRODUCT.points.map((point) => (
                <li key={point} className="flex gap-[12px] border-b border-b-[rgba(0,0,0,.13)] py-[12px] text-[13px] leading-[1.5]">
                  <span className="mt-[.5em] h-[6px] w-[6px] shrink-0 bg-[#F7A11A]" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-[24px] text-[10px] uppercase tracking-[.08em] text-[rgba(0,0,0,.55)]">SEBI {PMS_PRODUCT.registration}</p>
          </Panel>
          <Panel className="flex flex-col p-[40px] max-[600px]:p-[24px]">
            <BracketLabel>Category III Alternative Investment Fund</BracketLabel>
            <h3 className="mt-[18px] text-[clamp(2rem,3.2vw,3.2rem)] font-light tracking-[-.045em]">{AIF_PRODUCT.name}</h3>
            <p className="mt-[14px] max-w-[46ch] text-[15px] leading-[1.55]">{AIF_PRODUCT.lead}</p>
            <dl className="mt-[26px] grid grid-cols-[150px_1fr] border-t border-t-[rgba(0,0,0,.13)] text-[13px] max-[600px]:grid-cols-1">
              {AIF_PRODUCT.terms.map(([term, value]) => (
                <div key={term} className="contents">
                  <dt className="border-b border-b-[rgba(0,0,0,.13)] py-[10px] text-[10px] uppercase tracking-[.08em] text-[rgba(0,0,0,.55)] max-[600px]:border-0 max-[600px]:pb-0">{term}</dt>
                  <dd className="border-b border-b-[rgba(0,0,0,.13)] py-[10px] leading-[1.45]">{value}</dd>
                </div>
              ))}
            </dl>
            <table className="mt-[22px] w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="text-[9px] uppercase tracking-[.1em] text-[rgba(0,0,0,.55)]">
                  <th className="py-[6px] font-normal">TWRR Returns</th>
                  <th className="py-[6px] text-right font-normal">Flyingbee</th>
                  <th className="py-[6px] text-right font-normal">S&amp;P BSE 500</th>
                </tr>
              </thead>
              <tbody>
                {AIF_PRODUCT.performance.map(([period, fund, index]) => (
                  <tr key={period} className="border-t border-t-[rgba(0,0,0,.13)]">
                    <td className="py-[8px]">{period}</td>
                    <td className="py-[8px] text-right tabular-nums">{fund}</td>
                    <td className="py-[8px] text-right tabular-nums text-[rgba(0,0,0,.6)]">{index}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-auto pt-[18px] text-[10px] uppercase tracking-[.08em] text-[rgba(0,0,0,.55)]">
              {AIF_PRODUCT.firstClose} · SEBI {AIF_PRODUCT.registration}
            </p>
          </Panel>
        </SplitFrame>
      </div>
    </section>
    <PartnersSection />
    </>
  );
}
