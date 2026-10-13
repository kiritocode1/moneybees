import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import { AIF_SECTIONS } from "@/lib/pages/aif-content";
import { pageSections } from "@/lib/pages/load";
import { aifFigures, pmsFigures } from "@/lib/site/figures";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata: Metadata = {
  title: "Flyingbee: Category III AIF for small-cap equity",
  description:
    "Flyingbee Investment Fund is a Category III AIF managed by Moneybee, investing in listed and pre-IPO companies. Minimum ₹1 crore; benchmark S&P BSE 500 TRI.",
  alternates: { canonical: "/aif" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/aif", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Flyingbee: Category III AIF for small-cap equity | Moneybee", description: "Flyingbee Investment Fund is a Category III AIF managed by Moneybee, investing in listed and pre-IPO companies. Minimum ₹1 crore; benchmark S&P BSE 500 TRI." },
};

/**
 * /aif, built to the Content & Visual Plan §4 and approved in
 * .plannotator/aif-v3/plan.md: the product hero shared with /pms, the fund's
 * returns, which investors see first (user, 2026-10-08), the deck's
 * strategic opportunity on the solid that was /about's timeline, why a
 * Category III AIF as a pinned pooling scene, the fund's structure as the
 * plan's diagram, the investment approach as a pinned wedge wheel, and the key
 * terms as line cards. Copy lives in
 * lib/aif-v2.ts.
 * Ends with the closing door pair (components/cta/page-end-doors.tsx).
 * Staff edit the sections in /admin (globals/AifPage.ts); the returns come from
 * Flyingbee's fact sheets once they may be shown (lib/site/figures.ts).
 */
export default async function AifPage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures, aif] = await Promise.all([pageSections("aif-page", draft, AIF_SECTIONS), pmsFigures(), aifFigures()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} aif={aif} draft={draft} />
      </main>
      {draft ? <DraftTools path="/aif" /> : null}
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["PMS", "/pms"],
          ["Our philosophy", "/our-philosophy"],
          ["Performance", "#performance"],
          ["Strategic opportunity", "#opportunity"],
          ["Structure", "#structure"],
          ["Investment approach", "#approach"],
          ["Key terms", "#key-terms"],
          ["Investor Centre", "/investor-centre"],
        ]}
      />
    </SiteNavigation>
  );
}
