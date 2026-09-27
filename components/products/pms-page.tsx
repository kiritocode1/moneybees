import { DashedRule } from "@/components/hero/editorial";
import SiteFooter from "@/components/footer/site-footer";
import { FaqSection, LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";
import AboutPms from "./pms/about";
import CaseStudies from "./pms/case-studies";
import Construction from "./pms/construction";
import PmsHero from "./pms/hero";
import NameStory from "./pms/name-story";
import Performance from "./pms/performance";
import Providers from "./pms/providers";
import Risks from "./pms/risks";
import Sectors from "./pms/sectors";
import Selection from "./pms/selection";
import SmallCaps from "./pms/small-caps";
import Strategy from "./pms/strategy";

/**
 * /pms, the Portfolio Management Service on its own terms, in the order a
 * client would ask: what it is, where the name comes from, the strategy and
 * why small caps, how stocks are chosen, how the portfolio is built and its
 * risks managed, where it sits, what it has returned, three companies it
 * found early, who services it, then the ask and the PMS questions.
 */
export default function PmsPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-black">
        <PmsHero />
        <AboutPms />
        <NameStory />
        <Strategy />
        <SmallCaps />
        <DashedRule />
        <Selection />
        <Construction />
        <DashedRule />
        <Risks />
        <Sectors />
        <Performance />
        <CaseStudies />
        <Providers />
        <LetsTalkSection />
        <FaqSection product="pms" />
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
