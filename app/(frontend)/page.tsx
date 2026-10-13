import type { Metadata } from "next";
import { draftMode } from "next/headers";
import SiteFooter from "@/components/footer/site-footer";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import SiteNavigation from "@/components/ui/site-navigation";
import { homeSections } from "@/lib/pages/home";
import { pmsFigures } from "@/lib/site/figures";

export const metadata: Metadata = {
  // The root layout's default title is the homepage's.
  description:
    "Moneybee finds small and mid-sized Indian companies that lead their niche and owns them while they grow, through Moneybee PMS and Flyingbee, a Category III AIF.",
  alternates: { canonical: "/" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Moneybee | Small-cap PMS and Category III AIF, Mumbai", description: "Moneybee finds small and mid-sized Indian companies that lead their niche and owns them while they grow, through Moneybee PMS and Flyingbee, a Category III AIF." },
};

/**
 * The Moneybee homepage. Staff edit its sections, their order and their
 * words in /admin (globals/HomePage.ts); figures come from the latest
 * published PMS fact sheet. Today's sections, from the decks
 * (lib/pages/home-content.ts): claim and figures, the results (user,
 * 2026-10-08), the two ways to invest, the founder, then the ask. The client
 * cut the research process, the team photograph and the FAQs, moved the team
 * to /about and the picks to /multi-bagger-picks (2026-10-08). Product
 * detail, risk and the fund's partners live on /pms and /aif. In draft mode
 * the page shows the latest unpublished version, for /admin's preview.
 */
export default async function Home() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures] = await Promise.all([homeSections(draft), pmsFigures()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one overflow-clip bg-white text-[#000000]">
        <PageSections sections={sections} figures={figures} draft={draft} />
      </main>
      {draft ? <DraftTools path="/" /> : null}
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
