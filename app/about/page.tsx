import { AboutHero, FounderSection, StorySection, TimelineSection } from "@/components/about-v2/about-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "About Moneybee Group" };

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
        <StorySection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["Founder", "#founder"],
            ["Timeline", "#timeline"],
            ["Moneybee story", "#story"],
            ["Our team", "/team"],
            ["Our approach", "/our-approach"],
            ["Performance", "/#performance"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
