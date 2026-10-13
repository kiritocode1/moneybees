import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import { COMPARE_SECTIONS } from "@/lib/pages/compare-content";
import { pageSections } from "@/lib/pages/load";
import { pmsFigures } from "@/lib/site/figures";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";
import { ENQUIRY_HREF } from "@/lib/contact-v2";

export const metadata: Metadata = {
  title: "PMS vs AIF: how the two structures differ",
  description:
    "In a PMS you hold the securities in your own demat account; in an AIF your money is pooled into a fund and you receive units. Compare Moneybee PMS and Flyingbee.",
  alternates: { canonical: "/pms-vs-aif" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/pms-vs-aif", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "PMS vs AIF: how the two structures differ | Moneybee", description: "In a PMS you hold the securities in your own demat account; in an AIF your money is pooled into a fund and you receive units. Compare Moneybee PMS and Flyingbee." },
};

/**
 * /pms-vs-aif, built to the Content & Visual Plan §5: the heading with the
 * plan's two diagrams, the simple comparison and the simple explanation. Copy
 * lives in lib/compare.ts.
 * Ends with the closing door pair (components/cta/page-end-doors.tsx).
 * Staff edit the sections in /admin (globals/PmsVsAifPage.ts).
 */
export default async function PmsVsAifPage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures] = await Promise.all([pageSections("pms-vs-aif-page", draft, COMPARE_SECTIONS), pmsFigures()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} draft={draft} />
      </main>
      {draft ? <DraftTools path="/pms-vs-aif" /> : null}
      <SiteFooter
        explore={[
          ["Portfolio Management Services", "/pms"],
          ["Flyingbee AIF", "/aif"],
          ["Our philosophy", "/our-philosophy"],
          ["About Moneybee", "/about"],
          ["Get started", ENQUIRY_HREF],
        ]}
      />
    </SiteNavigation>
  );
}
