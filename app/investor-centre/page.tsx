import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import { DocumentsSection, InvestorHero, LoginsSection } from "@/components/investor-centre/investor-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "Investor Centre" };

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
      </main>
    </SiteNavigation>
  );
}
