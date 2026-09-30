import type { Metadata } from "next";
import { AboutHero, FounderSection, StorySection, TeamPhotoSection, TimelineSection } from "@/components/about-v2/about-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
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
 * /about, built to the Content & Visual Plan §2: the heading and company
 * information, the founder, a timeline of the plan's dates and the Moneybee
 * story. Copy lives in lib/about-v2.ts.
 */
export default function AboutPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <AboutHero />
        <FounderSection />
        <TimelineSection />
        <TeamPhotoSection />
        <StorySection />
        <LetsTalkSection />
      </main>
      <SiteFooter
        explore={[
          ["Founder", "#founder"],
          ["Timeline", "#timeline"],
          ["Moneybee story", "#story"],
          ["Our team", "/team"],
          ["Our approach", "/our-approach"],
          ["Performance", "/performance"],
        ]}
      />
    </SiteNavigation>
  );
}
