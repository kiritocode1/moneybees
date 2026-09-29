import { ContactHero, EnquirySection, OfficeSection } from "@/components/contact-v2/contact-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata = { title: "Contact" };

/**
 * /contact, built to the Content & Visual Plan §11: the heading with the
 * phone and email, the office on a map, and the four enquiry options shaping
 * a simple form that opens a mailto. Copy lives in lib/contact-v2.ts.
 */
export default function ContactPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ContactHero />
        <OfficeSection />
        <EnquirySection />
        <LetsTalkSection />
        <SiteFooter
          explore={[
            ["About Moneybee", "/about"],
            ["Our approach", "/our-approach"],
            ["Office", "#office"],
            ["Enquiry", "#enquiry"],
            ["Performance", "/#performance"],
            ["Team", "/#team"],
          ]}
        />
      </main>
    </SiteNavigation>
  );
}
