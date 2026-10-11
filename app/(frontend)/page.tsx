import type { Metadata } from "next";
import FounderSection from "@/components/fact-sections/founder-section";
import RecordSection from "@/components/fact-sections/record-section";
import SiteFooter from "@/components/footer/site-footer";
import { HeroSection } from "@/components/hero/hero-sections";
import { GetStartedSection, TwoWaysSection } from "@/components/home/home-sections";
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
        {/* Claim and figures, then the results (user, 2026-10-08), the two
            ways to invest, the founder, then the ask. The client cut the
            research process, the team photograph and the FAQs, moved the team
            to /about and the picks to /multi-bagger-picks (2026-10-08). The
            philosophy fly-through is off the page while it is reworked
            (user, 2026-10-09); drafts live under /preview/philosophy-*. */}
        <HeroSection />
        <div id="performance">
          <RecordSection />
        </div>
        <TwoWaysSection />
        <FounderSection />
        <GetStartedSection />
      </main>
      <SiteFooter
        explore={[
          ["About Us", "/about"],
          ["Our Philosophy", "/our-philosophy"],
          ["PMS", "/pms"],
          ["Flyingbee AIF", "/aif"],
          ["Multibagger picks", "/multi-bagger-picks"],
          ["Our Team", "/about#team"],
        ]}
      />
    </SiteNavigation>
  );
}
