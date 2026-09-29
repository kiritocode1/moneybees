import { AifHero, ApproachSection, CategoryThreeSection, KeyTermsSection, StructureSection } from "@/components/aif-v2/aif-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "Flyingbee Investment Fund" };

/**
 * /aif, built to the Content & Visual Plan §4: the Flyingbee heading and fund
 * graphic, why a Category III AIF, the fund structure, the investment approach
 * as a process, and the key terms. Copy lives in lib/aif-v2.ts.
 */
export default function AifPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <AifHero />
        <CategoryThreeSection />
        <StructureSection />
        <ApproachSection />
        <KeyTermsSection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
            ["PMS", "/pms"],
            ["Our approach", "/our-approach"],
            ["Fund structure", "#structure"],
            ["Key terms", "#key-terms"],
            ["Investor Centre", "/investor-centre"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
