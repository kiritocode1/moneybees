import type { Metadata } from "next";
import { ApproachHero, ListsSection, PhilosophySection, RiskSection } from "@/components/approach/approach-sections";
import ProcessSteps from "@/components/approach/process-steps";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata: Metadata = {
  title: "Our investment approach: screen, analyse, monitor, exit",
  description:
    "How Moneybee picks stocks: screen, shortlist, analyse, decide, monitor and exit. We look for quality management, robust fundamentals and reasonable valuations.",
  alternates: { canonical: "/our-approach" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/our-approach", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Our investment approach: screen, analyse, monitor, exit | Moneybee", description: "How Moneybee picks stocks: screen, shortlist, analyse, decide, monitor and exit. We look for quality management, robust fundamentals and reasonable valuations." },
};

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
      </main>
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our philosophy", "#philosophy"],
          ["Our process", "#process"],
          ["Performance", "/performance"],
          ["Our strategies", "/pms-vs-aif"],
          ["Team", "/team"],
        ]}
      />
    </SiteNavigation>
  );
}
