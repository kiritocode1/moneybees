import type { Metadata } from "next";
import { PageEndDoors } from "@/components/cta/page-end-doors";
import PicksSection from "@/components/fact-sections/picks-section";
import SiteFooter from "@/components/footer/site-footer";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { PICKS_HERO } from "@/lib/page-heroes";

const DESCRIPTION =
  "Moneybee's multibagger picks by multiple, from more than 25 stocks at 2X or more to Fairchem Organics and Privi Speciality Chemicals at over 100X, with case studies.";

export const metadata: Metadata = {
  title: "Our multibagger picks",
  description: DESCRIPTION,
  alternates: { canonical: "/multi-bagger-picks" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/multi-bagger-picks", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Our multibagger picks | Moneybee", description: DESCRIPTION },
};

/**
 * /multi-bagger-picks: the pyramid section, moved off the homepage onto its own
 * page (client, 2026-10-08), under the internal-page hero. Tiers and case
 * studies live in lib/insights.ts (PICK_TIERS). Ends with the closing door pair.
 */
export default function MultibaggerPicksPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={PICKS_HERO} />
        <PicksSection />
        <PageEndDoors />
      </main>
      <SiteFooter
        explore={[
          ["Case studies", "/case-studies"],
          ["Our approach", "/our-approach"],
          ["PMS", "/pms"],
          ["Flyingbee AIF", "/aif"],
        ]}
      />
    </SiteNavigation>
  );
}
