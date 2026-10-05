import type { Metadata } from "next";
import { FounderSection, StorySection } from "@/components/about-v2/about-sections";
import { AboutHero, AreasSection } from "@/components/about-v3/about-sections";
import PeopleSection from "@/components/about-v3/people-section";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";

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
 * the team photograph, the founder, the group's four areas as photographs, who
 * does what and the Moneybee story. The timeline's solid moved to /aif. Copy lives
 * in lib/about-v2.ts; photographs, people and dates in lib/about-v3.ts.
 */
export default function AboutPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <AboutHero />
        <FounderSection />
        <AreasSection />
        <PeopleSection />
        <StorySection index="04" />
      </main>
      <SiteFooter
        explore={[
          ["Founder", "#founder"],
          ["What the group does", "#group"],
          ["Our team", "#people"],
          ["Moneybee story", "#story"],
          ["Our approach", "/our-approach"],
        ]}
      />
    </SiteNavigation>
  );
}
