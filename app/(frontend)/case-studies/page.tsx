import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import { CASE_STUDIES_SECTIONS } from "@/lib/pages/case-studies-content";
import { pageSections } from "@/lib/pages/load";
import { caseStudies } from "@/lib/site/case-studies";
import { pmsFigures } from "@/lib/site/figures";
import SiteFooter from "@/components/footer/site-footer";
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
 * picks, each with the plan's Business Model, Competitive Edge and Growth
 * Prospect lines, a business-model drawing and FY20 to FY24 financials, then
 * a shared timeline and the plan's disclaimer. Copy lives in
 * lib/case-studies.ts.
 * Ends with the closing door pair (components/cta/page-end-doors.tsx).
 * Staff edit the sections in /admin (globals/CaseStudiesPage.ts) and the
 * companies in Website › Case studies (collections/CaseStudies.ts).
 */
export default async function CaseStudiesPage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures, studies] = await Promise.all([pageSections("case-studies-page", draft, CASE_STUDIES_SECTIONS), pmsFigures(), caseStudies()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} studies={studies} draft={draft} />
      </main>
      {draft ? <DraftTools path="/case-studies" /> : null}
      <SiteFooter
        explore={[
          ["KPI Green Energy", "#kpi-green-energy"],
          ["Uni Abex Alloy Products", "#uni-abex"],
          ["Pitti Engineering", "#pitti-engineering"],
          ["Our philosophy", "/our-philosophy"],
          ["About Moneybee", "/about"],
        ]}
      />
    </SiteNavigation>
  );
}
