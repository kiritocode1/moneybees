import type { Metadata } from "next";
import { draftMode } from "next/headers";
import SiteFooter from "@/components/footer/site-footer";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import SiteNavigation from "@/components/ui/site-navigation";
import { CONTACT_SECTIONS } from "@/lib/pages/contact-content";
import { pageSections } from "@/lib/pages/load";
import { pmsFigures } from "@/lib/site/figures";

export const metadata: Metadata = {
  title: "Contact Moneybee: Lower Parel, Mumbai",
  description:
    "Talk to Moneybee about PMS, the Flyingbee AIF or investor support. Call 022-4030 2080, email info@moneybee.in, or visit our office in Lower Parel, Mumbai.",
  alternates: { canonical: "/contact" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/contact", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Contact Moneybee: Lower Parel, Mumbai | Moneybee", description: "Talk to Moneybee about PMS, the Flyingbee AIF or investor support. Call 022-4030 2080, email info@moneybee.in, or visit our office in Lower Parel, Mumbai." },
};

/**
 * /contact, built to the Content & Visual Plan §11 on realevate's layout. No
 * hero (user, 2026-10-08): the page opens on the heading and direct lines
 * beside the four enquiry options as tabs over a form that opens a mailto,
 * then the office on a map. Copy lives in lib/contact-v2.ts.
 * Staff edit the sections in /admin (globals/ContactPage.ts); phone, email,
 * desks and the office in Website › Office details.
 */
export default async function ContactPage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures] = await Promise.all([pageSections("contact-page", draft, CONTACT_SECTIONS), pmsFigures()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} draft={draft} />
      </main>
      {draft ? <DraftTools path="/contact" /> : null}
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our philosophy", "/our-philosophy"],
          ["Office", "#office"],
          ["Enquiry", "#enquiry"],
          ["Team", "/about#team"],
        ]}
      />
    </SiteNavigation>
  );
}
