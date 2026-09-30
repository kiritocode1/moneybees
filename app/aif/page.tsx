import type { Metadata } from "next";
import { AifHero, ApproachSection, CategoryThreeSection, KeyTermsSection, StructureSection } from "@/components/aif-v2/aif-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata: Metadata = {
  title: "Flyingbee: Category III AIF for small-cap equity",
  description:
    "Flyingbee Investment Fund is a Category III AIF managed by Moneybee, investing in listed and pre-IPO companies. Minimum ₹1 crore; benchmark S&P BSE 500 TRI.",
  alternates: { canonical: "/aif" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/aif", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Flyingbee: Category III AIF for small-cap equity | Moneybee", description: "Flyingbee Investment Fund is a Category III AIF managed by Moneybee, investing in listed and pre-IPO companies. Minimum ₹1 crore; benchmark S&P BSE 500 TRI." },
};

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
      </main>
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
    </SiteNavigation>
  );
}
