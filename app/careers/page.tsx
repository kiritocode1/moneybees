import { ApplySection, CareersHero, CultureSection, LifeSection, OpeningsSection } from "@/components/careers/careers-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "Careers" };

/**
 * /careers, built to the Content & Visual Plan §10: the heading with both
 * CTAs, current openings, life at Moneybee, our work culture and how to
 * apply. Copy lives in lib/careers.ts; the roles and culture points are
 * placeholders until HR approves them.
 */
export default function CareersPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <CareersHero />
        <OpeningsSection />
        <LifeSection />
        <CultureSection />
        <ApplySection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
            ["Our approach", "/our-approach"],
            ["Current openings", "#openings"],
            ["Life at Moneybee", "#life"],
            ["How to apply", "#apply"],
            ["Contact", "/contact"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
