import type { Metadata } from "next";
import { CriteriaLists } from "@/components/approach-v3/criteria-lists";
import { PhilosophyDiscs } from "@/components/approach-v3/philosophy-discs";
import { RiskRings } from "@/components/approach-v3/risk-rings";
import SiteFooter from "@/components/footer/site-footer";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { APPROACH_HERO } from "@/lib/page-heroes";
import { PageEndDoors } from "@/components/cta/page-end-doors";
import { TholosSection } from "@/components/philosophy-tholos/tholos-section";

export const metadata: Metadata = {
  title: "Our philosophy: screen, analyse, monitor, exit",
  description:
    "How Moneybee picks stocks: screen, shortlist, analyse, decide, monitor and exit. We look for quality management, robust fundamentals and reasonable valuations.",
  alternates: { canonical: "/our-philosophy" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/our-philosophy", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Our philosophy: screen, analyse, monitor, exit | Moneybee", description: "How Moneybee picks stocks: screen, shortlist, analyse, decide, monitor and exit. We look for quality management, robust fundamentals and reasonable valuations." },
};

/**
 * /our-philosophy (named Our Approach, at /our-approach, until 2026-10-11, which
 * now redirects here), built to the Content & Visual Plan §6 on study 09's process
 * sheet: the core philosophy on study 08's discs, the six principles round the
 * turning tholos at Delphi (approved in .plannotator/philosophy-tholos/plan.md,
 * 2026-10-11), what we look for and don't do, and risk management
 * as concentric half-rings. Copy lives in lib/approach.ts.
 * Ends with the closing door pair (components/cta/page-end-doors.tsx).
 */
export default function OurPhilosophyPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={APPROACH_HERO} />
        <PhilosophyDiscs />
        {/* The stock selection process is off the page until it is reworked (user, 2026-10-11). */}
        <TholosSection />
        <CriteriaLists />
        <RiskRings />
        <PageEndDoors />
      </main>
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our philosophy", "#philosophy"],
          ["Our strategies", "/pms-vs-aif"],
          ["Team", "/about#key-members"],
        ]}
      />
    </SiteNavigation>
  );
}
