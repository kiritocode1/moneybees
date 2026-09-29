import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import { FounderBand, KeyMembersSection, TeamHero } from "@/components/team/team-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "People Behind Moneybee" };

/**
 * /team, built to the Content & Visual Plan §9: the heading, the founder and
 * the two key team members, each with a headshot, designation,
 * qualifications and the plan's short biography. Copy lives in lib/team.ts.
 */
export default function TeamPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <TeamHero />
        <FounderBand />
        <KeyMembersSection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
            ["Founder", "#dhiren-shah"],
            ["Key team members", "#key-members"],
            ["Our approach", "/our-approach"],
            ["Performance", "/#performance"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
