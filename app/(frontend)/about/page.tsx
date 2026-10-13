import type { Metadata } from "next";
import { draftMode } from "next/headers";
import SiteFooter from "@/components/footer/site-footer";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import SiteNavigation from "@/components/ui/site-navigation";
import { ABOUT_SECTIONS } from "@/lib/pages/about-content";
import { pageSections } from "@/lib/pages/load";
import { pmsFigures } from "@/lib/site/figures";
import { teamMembers } from "@/lib/site/team";

export const metadata: Metadata = {
  title: "About Moneybee Group: founded in 2004 by Dhiren Shah",
  description:
    "Moneybee Group was started in 2004 by Dhiren Shah, FCA, who brings 45+ years in corporate advisory and wealth management. Portfolio management since August 2007.",
  alternates: { canonical: "/about" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/about", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "About Moneybee Group: founded in 2004 by Dhiren Shah | Moneybee", description: "Moneybee Group was started in 2004 by Dhiren Shah, FCA, who brings 45+ years in corporate advisory and wealth management. Portfolio management since August 2007." },
};

/**
 * /about, built to the Content & Visual Plan §2 and approved in
 * .plannotator/about-people/plan.md: the heading and company information over
 * the team photograph, the founder, the team carousel (moved from the
 * homepage in place of the key team members, client, 2026-10-08), the group's four areas as
 * drawings (.plannotator/about-areas), the PMS Bazaar rankings (moved from the
 * homepage, .plannotator/about-recognition), the company timeline and the
 * Moneybee story. Copy lives in lib/about-v2.ts; the photograph and dates in
 * lib/about-v3.ts, the team in lib/insights.ts (TEAM).
 * Ends with the closing door pair (components/cta/page-end-doors.tsx).
 * Staff edit the sections in /admin (globals/AboutPage.ts) and the people in
 * Website › Team (collections/TeamMembers.ts).
 */
export default async function AboutPage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures, team] = await Promise.all([pageSections("about-page", draft, ABOUT_SECTIONS), pmsFigures(), teamMembers()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} team={team} draft={draft} />
      </main>
      {draft ? <DraftTools path="/about" /> : null}
      <SiteFooter
        explore={[
          ["Founder", "#founder"],
          ["Our team", "#team"],
          ["What the group does", "#group"],
          ["Recognition", "#recognition"],
          ["Timeline", "#timeline"],
          ["Moneybee story", "#story"],
          ["Our philosophy", "/our-philosophy"],
        ]}
      />
    </SiteNavigation>
  );
}
