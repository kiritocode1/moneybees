import SiteFooter from "@/components/footer/site-footer";
import { FaqSection, LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";
import AifHero from "./aif/aif-hero";
import CategorySection from "./aif/category-section";
import ConceptSection from "./aif/concept-section";
import OpportunitySection from "./aif/opportunity-section";
import { ReturnsSection, SectorsSection } from "./aif/performance-section";
import ProcessSection from "./aif/process-section";
import StructureSection from "./aif/structure-section";
import TermsSection, { FundTeamSection } from "./aif/terms-section";

/**
 * /aif, Flyingbee Investment Fund, built from its own deck (AIF presentation,
 * August 2026). Every section is the fund's own; only the ask, the FAQs and
 * the footer are shared with the rest of the site.
 */
export default function AifPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-black">
        <AifHero />
        <ConceptSection />
        <CategorySection />
        <OpportunitySection />
        <ProcessSection />
        <SectorsSection />
        <ReturnsSection />
        <StructureSection />
        <FundTeamSection />
        <TermsSection />
        <LetsTalkSection />
        <FaqSection product="aif" />
        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
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
