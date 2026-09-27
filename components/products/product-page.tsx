import PartnersSection from "@/components/fact-sections/partners-section";
import { AifDetails, CompareBand, PmsDetails, type Product, ProductHero } from "@/components/fact-sections/products-section";
import RecordSection from "@/components/fact-sections/record-section";
import { SelectionLists } from "@/components/fact-sections/research-section";
import RiskSection from "@/components/fact-sections/risk-section";
import StructureSection from "@/components/fact-sections/structure-section";
import WhySmallCapsSection from "@/components/fact-sections/why-small-caps-section";
import SiteFooter from "@/components/footer/site-footer";
import { FaqSection, LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";
import ProcessChapters from "./process-chapters";

/**
 * One product page, /pms or /aif. Both share a skeleton (hero, the product in
 * full, how the portfolio is chosen and protected, a way across to the other
 * product, then the ask and that product's FAQs); the middle is the product's
 * own: the PMS's thesis and record, the fund's structure and partners.
 */
export default function ProductPage({ product }: { product: Product }) {
  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-black">
        <ProductHero product={product} />
        {product === "pms" ? (
          <>
            <PmsDetails />
            <WhySmallCapsSection />
            <div id="performance">
              <RecordSection />
            </div>
          </>
        ) : (
          <>
            <AifDetails />
            <StructureSection />
            <PartnersSection />
          </>
        )}
        <SelectionLists />
        <RiskSection />
        <ProcessChapters />
        <CompareBand product={product} />
        <LetsTalkSection />
        <FaqSection product={product} />
        <SiteFooter
          explore={[
            ["About Moneybee", "/#about"],
            ["Our philosophy", "/#philosophy-pillars"],
            ["Our process", "/#research"],
            ["Performance", "/#performance"],
            ["Our strategies", "/#invest"],
            ["Team", "/#team"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
