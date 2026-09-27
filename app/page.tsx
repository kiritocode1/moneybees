import FounderSection from "@/components/fact-sections/founder-section";
import PartnersSection from "@/components/fact-sections/partners-section";
import PicksSection from "@/components/fact-sections/picks-section";
import RecordSection from "@/components/fact-sections/record-section";
import ResearchSection from "@/components/fact-sections/research-section";
import RiskSection from "@/components/fact-sections/risk-section";
import TeamSection from "@/components/fact-sections/team-section";
import SiteFooter from "@/components/footer/site-footer";
import { HeroSection, WhoWeAreSection } from "@/components/hero/hero-sections";
import PhilosophyFlythrough from "@/components/philosophy/philosophy-flythrough";
import SiteNavigation from "@/components/ui/site-navigation";

/**
 * The Moneybee homepage. Facts come from the client decks (lib/insights.ts):
 * headings are deck lines, paragraphs are rewritten plainly from deck facts.
 * Product detail lives on /pms and /aif.
 */
export default function Home() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-[#000000]">
        {/* Hero and 1 · Who we are, in antimetal.com's layout (components/hero). */}
        <HeroSection />
        <WhoWeAreSection />
        {/* 2 · Who runs it, and why small caps: the founder in his own words */}
        <FounderSection />
        {/* 3 · What we believe */}
        <PhilosophyFlythrough />
        {/* 4 · How we choose */}
        <ResearchSection />
        {/* 5 · How we protect */}
        <RiskSection />
        {/* 6 · What it has produced */}
        <PicksSection />
        <div id="performance">
          <RecordSection />
        </div>
        {/* 7 · Who we work alongside, and who manages it */}
        <PartnersSection />
        <TeamSection />

        <SiteFooter
          explore={[
            ["About Moneybee", "#about"],
            ["Our philosophy", "#philosophy-pillars"],
            ["Our process", "#research"],
            ["Performance", "#performance"],
            ["Our strategies", "/pms"],
            ["Team", "#team"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
