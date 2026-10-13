import type { Metadata } from "next";
import { draftMode } from "next/headers";
import SiteFooter from "@/components/footer/site-footer";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import SiteNavigation from "@/components/ui/site-navigation";
import { ENQUIRY_HREF } from "@/lib/contact-v2";
import { pageSections } from "@/lib/pages/load";
import { PMS_SECTIONS } from "@/lib/pages/pms-content";
import { pmsFigures } from "@/lib/site/figures";

export const metadata: Metadata = {
  title: "Moneybee PMS: small and mid-cap portfolio management",
  description:
    "Moneybee PMS invests in small and mid caps through a concentrated portfolio of 15 to 20 high-conviction stocks, held in your own demat for at least 3 years.",
  alternates: { canonical: "/pms" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/pms", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Moneybee PMS: small and mid-cap portfolio management | Moneybee", description: "Moneybee PMS invests in small and mid caps through a concentrated portfolio of 15 to 20 high-conviction stocks, held in your own demat for at least 3 years." },
};

/**
 * /pms, built to the Content & Visual Plan §3 and approved in
 * .plannotator/pms-v3/plan.md: the Tres Mares product hero, then the PMS
 * performance chart with every period's table and the growth of Rs. 1 Mn,
 * which investors see first (user, 2026-10-08; /performance was folded in
 * here and into /aif), then why
 * Moneybee PMS as a sticky split, the philosophy, stock selection as
 * converging lines, the portfolio approach as Titan Gate's stats band, and
 * risk management on stacked blocks.
 * Ends with the closing door pair (components/cta/page-end-doors.tsx).
 * Staff edit the sections in /admin (globals/PmsPage.ts); the returns and
 * their date come from the latest published PMS fact sheet.
 */
export default async function PmsPage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures] = await Promise.all([pageSections("pms-page", draft, PMS_SECTIONS), pmsFigures()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} draft={draft} />
      </main>
      {draft ? <DraftTools path="/pms" /> : null}
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our philosophy", "/our-philosophy"],
          ["PMS vs AIF", "/pms-vs-aif"],
          ["Flyingbee AIF", "/aif"],
          ["Performance", "#performance"],
          ["Get started", ENQUIRY_HREF],
        ]}
      />
    </SiteNavigation>
  );
}
