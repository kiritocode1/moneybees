import type { Metadata } from "next";
import SiteFooter from "@/components/footer/site-footer";
import { FounderBand, KeyMembersSection } from "@/components/team/team-sections";
import ProductHero from "@/components/pms-v3/product-hero";
import SiteNavigation from "@/components/ui/site-navigation";
import { TEAM_HERO } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "Our team: the people behind Moneybee",
  description:
    "Meet the people behind Moneybee: managing director Dhiren Shah, Shreyam Shah of the AIF and investment team, and Suprit Shah, compliance officer for the PMS.",
  alternates: { canonical: "/team" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/team", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Our team: the people behind Moneybee | Moneybee", description: "Meet the people behind Moneybee: managing director Dhiren Shah, Shreyam Shah of the AIF and investment team, and Suprit Shah, compliance officer for the PMS." },
};

/**
 * /team, built to the Content & Visual Plan §9: the heading, the founder and
 * the two key team members, each with a headshot, designation,
 * qualifications and the plan's short biography. Copy lives in lib/team.ts.
 */
export default function TeamPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ProductHero data={TEAM_HERO} />
        <FounderBand />
        <KeyMembersSection />
      </main>
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Founder", "#dhiren-shah"],
          ["Key team members", "#key-members"],
          ["Our approach", "/our-approach"],
          ["Performance", "/performance"],
        ]}
      />
    </SiteNavigation>
  );
}
