import { ApproachHero, ListsSection, PhilosophySection, RiskSection } from "@/components/approach/approach-sections";
import ProcessSteps from "@/components/approach/process-steps";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "Our Investment Approach" };

/**
 * /our-approach, built to the Content & Visual Plan §6: the
 * heading, the core philosophy, the six-step orange-and-black process, what
 * we look for and don't do, and risk management. Copy lives in lib/approach.ts.
 */
export default function OurApproachPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ApproachHero />
        <PhilosophySection />
        <ProcessSteps />
        <ListsSection />
        <RiskSection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
            ["Our philosophy", "#philosophy"],
            ["Our process", "#process"],
            ["Performance", "/#performance"],
            ["Our strategies", "/#invest"],
            ["Team", "/#team"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
