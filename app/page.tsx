import FounderSection from "@/components/fact-sections/founder-section";
import PicksSection from "@/components/fact-sections/picks-section";
import RecordSection from "@/components/fact-sections/record-section";
import ResearchSection from "@/components/fact-sections/research-section";
import TeamSection from "@/components/fact-sections/team-section";
import SiteFooter from "@/components/footer/site-footer";
import { HeroSection, WhoWeAreSection } from "@/components/hero/hero-sections";
import { FaqSection, LetsTalkSection, RecognitionSection, TwoWaysSection } from "@/components/home/home-sections";
import PhilosophyFlythrough from "@/components/philosophy/philosophy-flythrough";
import SiteNavigation from "@/components/ui/site-navigation";

/**
 * The Moneybee homepage. Facts come from the client decks (lib/insights.ts):
 * headings are deck lines, paragraphs are rewritten plainly from deck facts.
 * Product detail, risk and the fund's partners live on /pms and /aif.
 */
export default function Home() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-[#000000]">
        {/* The peer pattern: claim and figures, outside proof, who we are, the two
            ways to invest, belief and method, results, people, then the ask. */}
        <HeroSection />
        <RecognitionSection />
        <WhoWeAreSection />
        <FounderSection />
        <TwoWaysSection />
        <PhilosophyFlythrough />
        <ResearchSection />
        <div id="performance">
          <RecordSection />
        </div>
        <PicksSection />
        <TeamSection />
        <LetsTalkSection />
        <FaqSection />

        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
            ["Our philosophy", "#philosophy-pillars"],
            ["Our process", "#research"],
            ["Performance", "#performance"],
            ["Our strategies", "#invest"],
            ["Team", "#team"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
