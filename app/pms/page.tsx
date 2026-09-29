import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import PerformanceChart from "@/components/pms-v2/performance-chart";
import { PhilosophySection, PmsHero, PortfolioSection, RiskSection, WhySection } from "@/components/pms-v2/pms-sections";
import SelectionFunnel from "@/components/pms-v2/selection-funnel";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "Portfolio Management Services" };

/**
 * /pms, built to the Content & Visual Plan §3: heading and introduction, why
 * Moneybee PMS, the investment philosophy, the stock-selection funnel, the
 * portfolio approach, risk management and PMS performance. Copy lives in
 * lib/pms-v2.ts; figures come from lib/insights.ts.
 */
export default function PmsPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PmsHero />
        <WhySection />
        <PhilosophySection />
        <SelectionFunnel />
        <PortfolioSection />
        <RiskSection />
        <PerformanceChart />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
            ["Our approach", "/our-approach"],
            ["PMS vs AIF", "/pms-vs-aif"],
            ["Flyingbee AIF", "/aif"],
            ["Performance", "#performance"],
            ["Get started", "/contact"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
