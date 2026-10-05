import type { Metadata } from "next";
import SiteFooter from "@/components/footer/site-footer";
import { NoteCards } from "@/components/insights-page/note-cards";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { INSIGHTS_HERO } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "Insights",
  description: "Letters, notes and factsheets from Moneybee, the Mumbai portfolio manager for small and mid-cap Indian companies.",
  alternates: { canonical: "/insights" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/insights", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Insights | Moneybee", description: "Letters, notes and factsheets from Moneybee, the Mumbai portfolio manager for small and mid-cap Indian companies." },
};

/**
 * /insights, the Content & Visual Plan's nav item, which has no page section
 * of its own: the shared page hero and placeholder line cards until the
 * client supplies content. Copy lives in lib/insights-page.ts.
 */
export default function InsightsPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={INSIGHTS_HERO} />
        <NoteCards />
      </main>
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our approach", "/our-approach"],
          ["Performance", "/performance"],
          ["Case studies", "/case-studies"],
          ["Contact", "/contact"],
        ]}
      />
    </SiteNavigation>
  );
}
