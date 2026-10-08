import type { Metadata } from "next";
import SiteFooter from "@/components/footer/site-footer";
import { LoginsSection } from "@/components/investor-centre/investor-sections";
import { DocumentCards } from "@/components/investor-v3/document-cards";
import SiteNavigation from "@/components/ui/site-navigation";
import { PageEndDoors } from "@/components/cta/page-end-doors";
import { ENQUIRY_HREF } from "@/lib/contact-v2";

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
 */
export default function InvestorCentrePage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <LoginsSection />
        <DocumentCards />
        <PageEndDoors login={false} />
      </main>
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
