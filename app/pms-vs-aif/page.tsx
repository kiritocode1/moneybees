import type { Metadata } from "next";
import { ComparisonSection, ExplanationSection } from "@/components/compare/compare-sections";
import SiteFooter from "@/components/footer/site-footer";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { COMPARE_HERO } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "PMS vs AIF: how the two structures differ",
  description:
    "In a PMS you hold the securities in your own demat account; in an AIF your money is pooled into a fund and you receive units. Compare Moneybee PMS and Flyingbee.",
  alternates: { canonical: "/pms-vs-aif" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/pms-vs-aif", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "PMS vs AIF: how the two structures differ | Moneybee", description: "In a PMS you hold the securities in your own demat account; in an AIF your money is pooled into a fund and you receive units. Compare Moneybee PMS and Flyingbee." },
};

/**
 * /pms-vs-aif, built to the Content & Visual Plan §5: the heading with the
 * plan's two diagrams, the simple comparison and the simple explanation. Copy
 * lives in lib/compare.ts.
 */
export default function PmsVsAifPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={COMPARE_HERO} />
        <ComparisonSection />
        <ExplanationSection />
      </main>
      <SiteFooter
        explore={[
          ["Portfolio Management Services", "/pms"],
          ["Flyingbee AIF", "/aif"],
          ["Our approach", "/our-approach"],
          ["About Moneybee", "/about"],
          ["Get started", "/contact"],
        ]}
      />
    </SiteNavigation>
  );
}
