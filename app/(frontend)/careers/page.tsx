import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import { CAREERS_SECTIONS } from "@/lib/pages/careers-content";
import { pageSections } from "@/lib/pages/load";
import { openings } from "@/lib/site/openings";
import { pmsFigures } from "@/lib/site/figures";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";
import { ENQUIRY_HREF } from "@/lib/contact-v2";

export const metadata: Metadata = {
  title: "Careers at Moneybee, Mumbai",
  description:
    "Build your career with Moneybee: professionals working across investment research, portfolio management, advisory, compliance and financial services in Mumbai.",
  alternates: { canonical: "/careers" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/careers", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Careers at Moneybee, Mumbai | Moneybee", description: "Build your career with Moneybee: professionals working across investment research, portfolio management, advisory, compliance and financial services in Mumbai." },
};

/** The job board uses labelled presentation samples until HR supplies approved vacancies. * Staff edit the sections in /admin (globals/CareersPage.ts) and the roles
 * in Website › Openings (collections/Openings.ts).
 */
export default async function CareersPage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures, roles] = await Promise.all([pageSections("careers-page", draft, CAREERS_SECTIONS), pmsFigures(), openings()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} roles={roles} draft={draft} />
      </main>
      {draft ? <DraftTools path="/careers" /> : null}
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our philosophy", "/our-philosophy"],
          ["Career opportunities", "#openings"],
          ["Life at Moneybee", "#life"],
          ["Send your resume", "#apply"],
          ["Contact", ENQUIRY_HREF],
        ]}
      />
    </SiteNavigation>
  );
}
