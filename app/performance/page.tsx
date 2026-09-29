import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import { AifPerformanceSection, MethodologySection, PerformanceHero, PmsPerformanceSection, WealthSection } from "@/components/performance/performance-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "Performance" };

/**
 * /performance, built to the Content & Visual Plan §7: the PMS table and chart
 * against the S&P BSE 500 TRI, wealth growth, the AIF's periods, and the
 * method and disclaimer. Figures are as of 31 July 2026 (lib/performance.ts).
 */
export default function PerformancePage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PerformanceHero />
        <PmsPerformanceSection />
        <WealthSection />
        <AifPerformanceSection />
        <MethodologySection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["PMS performance", "#pms"],
            ["Wealth growth", "#wealth"],
            ["AIF performance", "#aif"],
            ["Case studies", "/case-studies"],
            ["Our approach", "/our-approach"],
            ["About Moneybee", "/about"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
