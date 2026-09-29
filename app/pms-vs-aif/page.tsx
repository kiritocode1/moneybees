import { CompareHero, ComparisonSection, ExplanationSection } from "@/components/compare/compare-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "PMS vs AIF" };

/**
 * /pms-vs-aif, built to the Content & Visual Plan §5: the heading with the
 * plan's two diagrams, the simple comparison and the simple explanation. Copy
 * lives in lib/compare.ts.
 */
export default function PmsVsAifPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <CompareHero />
        <ComparisonSection />
        <ExplanationSection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["Portfolio Management Services", "/pms"],
            ["Flyingbee AIF", "/aif"],
            ["Our approach", "/our-approach"],
            ["About Moneybee", "/about"],
            ["Get started", "/contact"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
