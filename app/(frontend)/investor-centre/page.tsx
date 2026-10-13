import type { Metadata } from "next";
import { draftMode } from "next/headers";
import SiteFooter from "@/components/footer/site-footer";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import SiteNavigation from "@/components/ui/site-navigation";
import { ENQUIRY_HREF } from "@/lib/contact-v2";
import { INVESTOR_CENTRE_SECTIONS } from "@/lib/pages/investor-centre-content";
import { pageSections } from "@/lib/pages/load";
import { documentGroups } from "@/lib/site/documents";
import { pmsFigures } from "@/lib/site/figures";

export const metadata: Metadata = {
  title: "Investor Centre: logins, disclosures and grievances",
  description:
    "Client and distributor logins, the investor charter, disclosures, grievance redressal, SCORES, ODR, the PMS disclosure document and AIF documents for investors.",
  alternates: { canonical: "/investor-centre" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/investor-centre", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Investor Centre: logins, disclosures and grievances | Moneybee", description: "Client and distributor logins, the investor charter, disclosures, grievance redressal, SCORES, ODR, the PMS disclosure document and AIF documents for investors." },
};

/**
 * /investor-centre, built to the Content & Visual Plan §12: Client Login and
 * Distributor Login kept separate, then every listed section as a document
 * card. No hero (user, 2026-10-08): the page opens on its title and the two
 * login cards. Copy lives in lib/investor-centre.ts.
 * Ends with the closing door pair (components/cta/page-end-doors.tsx).
 * Staff edit the sections in /admin (globals/InvestorCentrePage.ts) and the
 * cards in Website › Documents (collections/Documents.ts).
 */
export default async function InvestorCentrePage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures, documents] = await Promise.all([pageSections("investor-centre-page", draft, INVESTOR_CENTRE_SECTIONS), pmsFigures(), documentGroups()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} documents={documents} draft={draft} />
      </main>
      {draft ? <DraftTools path="/investor-centre" /> : null}
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["PMS", "/pms"],
          ["AIF", "/aif"],
          ["Logins", "#logins"],
          ["Documents", "#documents"],
          ["Contact", ENQUIRY_HREF],
        ]}
      />
    </SiteNavigation>
  );
}
