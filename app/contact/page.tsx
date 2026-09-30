import type { Metadata } from "next";
import { ContactHero, EnquirySection, OfficeSection } from "@/components/contact-v2/contact-sections";
import SiteFooter from "@/components/footer/site-footer";
import { LetsTalkSection } from "@/components/home/home-sections";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata: Metadata = {
  title: "Contact Moneybee: Lower Parel, Mumbai",
  description:
    "Talk to Moneybee about PMS, the Flyingbee AIF or investor support. Call 022-4030 2080, email info@moneybee.in, or visit our office in Lower Parel, Mumbai.",
  alternates: { canonical: "/contact" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/contact", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Contact Moneybee: Lower Parel, Mumbai | Moneybee", description: "Talk to Moneybee about PMS, the Flyingbee AIF or investor support. Call 022-4030 2080, email info@moneybee.in, or visit our office in Lower Parel, Mumbai." },
};

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
      </main>
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our approach", "/our-approach"],
          ["Office", "#office"],
          ["Enquiry", "#enquiry"],
          ["Performance", "/performance"],
          ["Team", "/team"],
        ]}
      />
    </SiteNavigation>
  );
}
