import type { Metadata } from "next";
import { CaseStudyList, TimelineSection } from "@/components/case-studies/case-study-sections";
import SiteFooter from "@/components/footer/site-footer";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { CASES_HERO } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "Case studies: KPI Green, Uni Abex, Pitti Engineering",
  description:
    "Three Moneybee picks, KPI Green Energy, Uni Abex Alloy Products and Pitti Engineering: each business model, competitive edge and financials from FY20 to FY24.",
  alternates: { canonical: "/case-studies" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/case-studies", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Case studies: KPI Green, Uni Abex, Pitti Engineering | Moneybee", description: "Three Moneybee picks, KPI Green Energy, Uni Abex Alloy Products and Pitti Engineering: each business model, competitive edge and financials from FY20 to FY24." },
};

/**
 * /case-studies, built to the Content & Visual Plan §8: three historical
 * picks, each with the plan's Business Model, Competitive Edge and Growth
 * Prospect lines, a business-model drawing and FY20 to FY24 financials, then
 * a shared timeline and the plan's disclaimer. Copy lives in
 * lib/case-studies.ts.
 */
export default function CaseStudiesPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={CASES_HERO} />
        <CaseStudyList />
        <TimelineSection />
      </main>
      <SiteFooter
        explore={[
          ["KPI Green Energy", "#kpi-green-energy"],
          ["Uni Abex Alloy Products", "#uni-abex"],
          ["Pitti Engineering", "#pitti-engineering"],
          ["Performance", "/performance"],
          ["Our approach", "/our-approach"],
          ["About Moneybee", "/about"],
        ]}
      />
    </SiteNavigation>
  );
}
