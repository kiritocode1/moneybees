import type { Metadata } from "next";
import SiteFooter from "@/components/footer/site-footer";
import { AifPerformanceSection, MethodologySection, PmsPerformanceSection } from "@/components/performance/performance-sections";
import { WealthDiscs } from "@/components/performance-v3/wealth-discs";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { PERFORMANCE_HERO } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "Performance: Moneybee PMS and Flyingbee returns",
  description:
    "Moneybee PMS returns against the S&P BSE 500 TRI and Flyingbee Investment Fund returns against the S&P BSE 500, period by period, as of 31 July 2026.",
  alternates: { canonical: "/performance" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/performance", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Performance: Moneybee PMS and Flyingbee returns | Moneybee", description: "Moneybee PMS returns against the S&P BSE 500 TRI and Flyingbee Investment Fund returns against the S&P BSE 500, period by period, as of 31 July 2026." },
};

/**
 * /performance, built to the Content & Visual Plan §7: the PMS table and chart
 * against the S&P BSE 500 TRI, wealth growth, the AIF's periods, and the
 * method and disclaimer. Figures are as of 31 July 2026 (lib/performance.ts).
 */
export default function PerformancePage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={PERFORMANCE_HERO} />
        <PmsPerformanceSection />
        <WealthDiscs />
        <AifPerformanceSection />
        <MethodologySection />
      </main>
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
    </SiteNavigation>
  );
}
