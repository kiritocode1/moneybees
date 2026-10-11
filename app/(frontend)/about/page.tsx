import type { Metadata } from "next";
import { FounderSection, StorySection } from "@/components/about-v2/about-sections";
import { AboutHero } from "@/components/about-v3/about-sections";
import { AreasSection } from "@/components/about-v3/areas-section";
import { RecognitionSection } from "@/components/about-v3/recognition-section";
import { TimelineSection } from "@/components/about-v3/timeline-section";
import TeamCarousel from "@/components/fact-sections/team-carousel";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";
import { PageEndDoors } from "@/components/cta/page-end-doors";

export const metadata: Metadata = {
  title: "About Moneybee Group: founded in 2004 by Dhiren Shah",
  description:
    "Moneybee Group was started in 2004 by Dhiren Shah, FCA, who brings 45+ years in corporate advisory and wealth management. Portfolio management since August 2007.",
  alternates: { canonical: "/about" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/about", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "About Moneybee Group: founded in 2004 by Dhiren Shah | Moneybee", description: "Moneybee Group was started in 2004 by Dhiren Shah, FCA, who brings 45+ years in corporate advisory and wealth management. Portfolio management since August 2007." },
};

/**
 * /about, built to the Content & Visual Plan §2 and approved in
 * .plannotator/about-people/plan.md: the heading and company information over
 * the team photograph, the founder, the team carousel (moved from the
 * homepage in place of the key team members, client, 2026-10-08), the group's four areas as
 * drawings (.plannotator/about-areas), the PMS Bazaar rankings (moved from the
 * homepage, .plannotator/about-recognition), the company timeline and the
 * Moneybee story. Copy lives in lib/about-v2.ts; the photograph and dates in
 * lib/about-v3.ts, the team in lib/insights.ts (TEAM).
 * Ends with the closing door pair (components/cta/page-end-doors.tsx).
 */
export default function AboutPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <AboutHero />
        <FounderSection />
        <TeamCarousel />
        <AreasSection />
        <RecognitionSection />
        <TimelineSection />
        <StorySection />
        <PageEndDoors />
      </main>
      <SiteFooter
        explore={[
          ["Founder", "#founder"],
          ["Our team", "#team"],
          ["What the group does", "#group"],
          ["Recognition", "#recognition"],
          ["Timeline", "#timeline"],
          ["Moneybee story", "#story"],
          ["Our philosophy", "/our-philosophy"],
        ]}
      />
    </SiteNavigation>
  );
}
