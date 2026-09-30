import type { Metadata } from "next";
import { CaseStudiesHero, CaseStudyList, TimelineSection } from "@/components/case-studies/case-study-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

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
 * picks with the plan's wording, a business-model drawing and FY20 to FY24
 * financials each, then a shared timeline and the plan's disclaimer. Copy
 * lives in lib/case-studies.ts.
 */
export default function CaseStudiesPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <CaseStudiesHero />
        <CaseStudyList />
        <TimelineSection />
        <LetsTalkSection />
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
