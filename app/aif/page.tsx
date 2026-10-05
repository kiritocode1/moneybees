import type { Metadata } from "next";
import { ApproachWheelSection } from "@/components/aif-v3/approach-wheel";
import { KeyTermsSection } from "@/components/aif-v3/key-terms-section";
import { OpportunitySection } from "@/components/aif-v3/opportunity-section";
import { PoolingSection } from "@/components/aif-v3/pooling-section";
import SiteFooter from "@/components/footer/site-footer";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { AIF_HERO } from "@/lib/pms-v3-hero";

export const metadata: Metadata = {
  title: "Flyingbee: Category III AIF for small-cap equity",
  description:
    "Flyingbee Investment Fund is a Category III AIF managed by Moneybee, investing in listed and pre-IPO companies. Minimum ₹1 crore; benchmark S&P BSE 500 TRI.",
  alternates: { canonical: "/aif" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/aif", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Flyingbee: Category III AIF for small-cap equity | Moneybee", description: "Flyingbee Investment Fund is a Category III AIF managed by Moneybee, investing in listed and pre-IPO companies. Minimum ₹1 crore; benchmark S&P BSE 500 TRI." },
};

/**
 * /aif, built to the Content & Visual Plan §4 and approved in
 * .plannotator/aif-v3/plan.md: the product hero shared with /pms, the deck's
 * strategic opportunity on the solid that was /about's timeline, why a
 * Category III AIF as a pinned pooling scene, the investment approach as a
 * pinned wedge wheel, and the key terms as line cards. Copy lives in
 * lib/aif-v2.ts.
 */
export default function AifPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={AIF_HERO} />
        <OpportunitySection />
        <PoolingSection />
        <ApproachWheelSection />
        <KeyTermsSection />
      </main>
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["PMS", "/pms"],
          ["Our approach", "/our-approach"],
          ["Strategic opportunity", "#opportunity"],
          ["Investment approach", "#approach"],
          ["Key terms", "#key-terms"],
          ["Investor Centre", "/investor-centre"],
        ]}
      />
    </SiteNavigation>
  );
}
