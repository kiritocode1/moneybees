import type { Metadata } from "next";
import { CriteriaLists } from "@/components/approach-v3/criteria-lists";
import { PhilosophyDiscs } from "@/components/approach-v3/philosophy-discs";
import { ProcessSheet } from "@/components/approach-v3/process-sheet";
import { RiskRings } from "@/components/approach-v3/risk-rings";
import SiteFooter from "@/components/footer/site-footer";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { APPROACH_HERO } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "Our investment approach: screen, analyse, monitor, exit",
  description:
    "How Moneybee picks stocks: screen, shortlist, analyse, decide, monitor and exit. We look for quality management, robust fundamentals and reasonable valuations.",
  alternates: { canonical: "/our-approach" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/our-approach", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Our investment approach: screen, analyse, monitor, exit | Moneybee", description: "How Moneybee picks stocks: screen, shortlist, analyse, decide, monitor and exit. We look for quality management, robust fundamentals and reasonable valuations." },
};

/**
 * /our-approach, built to the Content & Visual Plan §6 on study 09's process
 * sheet: the core philosophy on study 08's discs, then the six steps each drawn
 * from its own sentence, what we look for and don't do, and risk management
 * as concentric half-rings. Copy lives in lib/approach.ts.
 */
export default function OurApproachPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={APPROACH_HERO} />
        <PhilosophyDiscs />
        <ProcessSheet />
        <CriteriaLists />
        <RiskRings />
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
