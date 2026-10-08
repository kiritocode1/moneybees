import type { Metadata } from "next";
import SiteFooter from "@/components/footer/site-footer";
import PerformanceChart from "@/components/pms-v2/performance-chart";
import { PhilosophySection } from "@/components/pms-v3/philosophy";
import { PortfolioApproachSection } from "@/components/pms-v3/portfolio-stats";
import ProductHero from "@/components/pms-v3/product-hero";
import { RiskSection } from "@/components/pms-v3/risk-blocks";
import { SelectionSection } from "@/components/pms-v3/selection-lines";
import { WhySection } from "@/components/pms-v3/why-sticky";
import SiteNavigation from "@/components/ui/site-navigation";
import { PMS_HERO } from "@/lib/pms-v3-hero";

export const metadata: Metadata = {
  title: "Moneybee PMS: small and mid-cap portfolio management",
  description:
    "Moneybee PMS invests in small and mid caps through a concentrated portfolio of 15 to 20 high-conviction stocks, held in your own demat for at least 3 years.",
  alternates: { canonical: "/pms" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/pms", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Moneybee PMS: small and mid-cap portfolio management | Moneybee", description: "Moneybee PMS invests in small and mid caps through a concentrated portfolio of 15 to 20 high-conviction stocks, held in your own demat for at least 3 years." },
};

/**
 * /pms, built to the Content & Visual Plan §3 and approved in
 * .plannotator/pms-v3/plan.md: the Tres Mares product hero, then the PMS
 * performance chart, which investors see first (user, 2026-10-08), then why
 * Moneybee PMS as a sticky split, the philosophy, stock selection as
 * converging lines, the portfolio approach as Titan Gate's stats band, and
 * risk management on stacked blocks.
 */
export default function PmsPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={PMS_HERO} />
        <PerformanceChart />
        <WhySection />
        <PhilosophySection />
        <SelectionSection />
        <PortfolioApproachSection />
        <RiskSection />
      </main>
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
    </SiteNavigation>
  );
}
