import type { Metadata } from "next";
import FounderSection from "@/components/fact-sections/founder-section";
import PicksSection from "@/components/fact-sections/picks-section";
import RecordSection from "@/components/fact-sections/record-section";
import ResearchSection from "@/components/fact-sections/research-section";
import TeamCarousel from "@/components/fact-sections/team-carousel";
import SiteFooter from "@/components/footer/site-footer";
import { HeroSection, WhoWeAreSection } from "@/components/hero/hero-sections";
import { FaqSection, GetStartedSection, TwoWaysSection } from "@/components/home/home-sections";
import PhilosophyFlythrough from "@/components/philosophy/philosophy-flythrough";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata: Metadata = {
  // The root layout's default title is the homepage's.
  description:
    "Moneybee finds small and mid-sized Indian companies that lead their niche and owns them while they grow, through Moneybee PMS and Flyingbee, a Category III AIF.",
  alternates: { canonical: "/" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Moneybee | Small-cap PMS and Category III AIF, Mumbai", description: "Moneybee finds small and mid-sized Indian companies that lead their niche and owns them while they grow, through Moneybee PMS and Flyingbee, a Category III AIF." },
};

/**
 * The Moneybee homepage. Facts come from the client decks (lib/insights.ts):
 * headings are deck lines, paragraphs are rewritten plainly from deck facts.
 * Product detail, risk and the fund's partners live on /pms and /aif.
 */
export default function Home() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-[#000000]">
        {/* The peer pattern: claim and figures, who we are, the two ways to
            invest, belief and method, results, people, then the ask. */}
        <HeroSection />
        <WhoWeAreSection />
        <FounderSection />
        <TwoWaysSection />
        <PhilosophyFlythrough />
        <ResearchSection />
        <div id="performance">
          <RecordSection />
        </div>
        <PicksSection />
        <TeamCarousel />
        <GetStartedSection />
        <FaqSection />
      </main>
      <SiteFooter
        explore={[
          ["About Us", "/about"],
          ["Our Investment Approach", "/our-approach"],
          ["PMS", "/pms"],
          ["Flyingbee AIF", "/aif"],
          ["Performance", "/performance"],
          ["Our Team", "/about#key-members"],
        ]}
      />
    </SiteNavigation>
  );
}
