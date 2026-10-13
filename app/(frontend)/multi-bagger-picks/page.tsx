import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import { PICKS_SECTIONS } from "@/lib/pages/picks-content";
import { pageSections } from "@/lib/pages/load";
import { pmsFigures } from "@/lib/site/figures";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";

const DESCRIPTION =
  "Moneybee's multibagger picks by multiple, from more than 25 stocks at 2X or more to Fairchem Organics and Privi Speciality Chemicals at over 100X, with case studies.";

export const metadata: Metadata = {
  title: "Our multibagger picks",
  description: DESCRIPTION,
  alternates: { canonical: "/multi-bagger-picks" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/multi-bagger-picks", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Our multibagger picks | Moneybee", description: DESCRIPTION },
};

/**
 * /multi-bagger-picks: the pyramid section, moved off the homepage onto its own
 * page (client, 2026-10-08), under the internal-page hero. Tiers and case
 * studies live in lib/insights.ts (PICK_TIERS). Ends with the closing door pair.
 * Staff edit the sections in /admin (globals/PicksPage.ts); the tiers and
 * stocks are compliance's.
 */
export default async function MultibaggerPicksPage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures] = await Promise.all([pageSections("picks-page", draft, PICKS_SECTIONS), pmsFigures()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} draft={draft} />
      </main>
      {draft ? <DraftTools path="/multi-bagger-picks" /> : null}
      <SiteFooter
        explore={[
          ["Case studies", "/case-studies"],
          ["Our philosophy", "/our-philosophy"],
          ["PMS", "/pms"],
          ["Flyingbee AIF", "/aif"],
        ]}
      />
    </SiteNavigation>
  );
}
