import AboutHero from "@/components/about/about-hero";
import DealTimeline from "@/components/about/deal-timeline";
import FounderProfile from "@/components/about/founder-profile";
import NameStory from "@/components/about/name-story";
import OfficeSection from "@/components/about/office-section";
import RankedReturns from "@/components/about/ranked-returns";
import RecentDeals from "@/components/about/recent-deals";
import TeamSection from "@/components/fact-sections/team-section";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "About" };

/**
 * About Moneybee. Facts come from the group profile deck, April 2026
 * (lib/about.ts, with the founder, team and office from lib/insights.ts):
 * who the group is, the name, the founder, the advisory record, recognition,
 * the people and the office, then the ask.
 */
export default function AboutPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-black">
        <AboutHero />
        <NameStory />
        <FounderProfile />
        <DealTimeline />
        <RecentDeals />
        <RankedReturns />
        <TeamSection />
        <OfficeSection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
            ["Our philosophy", "/#philosophy-pillars"],
            ["Our process", "/#research"],
            ["Performance", "/#performance"],
            ["Our strategies", "/#invest"],
            ["Team", "/#team"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
