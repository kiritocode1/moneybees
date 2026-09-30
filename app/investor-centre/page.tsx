import type { Metadata } from "next";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import { DocumentsSection, InvestorHero, LoginsSection } from "@/components/investor-centre/investor-sections";
import SiteNavigation from "@/components/ui/site-navigation";

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
 * card. Copy lives in lib/investor-centre.ts.
 */
export default function InvestorCentrePage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <InvestorHero />
        <LoginsSection />
        <DocumentsSection />
        <LetsTalkSection />
      </main>
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["PMS", "/pms"],
          ["AIF", "/aif"],
          ["Logins", "#logins"],
          ["Documents", "#documents"],
          ["Contact", "/contact"],
        ]}
      />
    </SiteNavigation>
  );
}
