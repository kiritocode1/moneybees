import type { Metadata } from "next";
import { OfficeSection } from "@/components/contact-v2/contact-sections";
import { ContactEnquirySection } from "@/components/contact-v3/contact-enquiry";
import { ContactHero } from "@/components/contact-v3/contact-hero";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata: Metadata = { title: "Contact preview", robots: { index: false, follow: false } };

/** Isolated contact preview; the published contact route is unchanged. */
export default function ContactPreviewPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <ContactHero />
        <ContactEnquirySection />
        <OfficeSection />
      </main>
      <SiteFooter explore={[
        ["About Moneybee", "/about"],
        ["Our approach", "/our-approach"],
        ["Office", "#office"],
        ["Enquiry", "#enquiry"],
        ["Performance", "/performance"],
        ["Team", "/team"],
      ]} />
    </SiteNavigation>
  );
}
