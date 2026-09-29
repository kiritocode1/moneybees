import { CaseStudiesHero, CaseStudyList, TimelineSection } from "@/components/case-studies/case-study-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "Our Investment Journey" };

/**
 * /case-studies, built to the Content & Visual Plan §8: three historical
 * picks with the plan's wording, a business-model drawing and FY20 to FY24
 * financials each, then a shared timeline and the plan's disclaimer. Copy
 * lives in lib/case-studies.ts.
 */
export default function CaseStudiesPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <CaseStudiesHero />
        <CaseStudyList />
        <TimelineSection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["KPI Green Energy", "#kpi-green-energy"],
            ["Uni Abex Alloy Products", "#uni-abex"],
            ["Pitti Engineering", "#pitti-engineering"],
            ["Performance", "/performance"],
            ["Our approach", "/our-approach"],
            ["About Moneybee", "/about"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
