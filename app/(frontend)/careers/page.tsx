import type { Metadata } from "next";
import { CareersIntro, CareersOfficeSection, CareersResumeSection } from "@/components/careers/careers-page-sections";
import { CareersJobBoard } from "@/components/careers/careers-job-board";
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

/** The job board uses labelled presentation samples until HR supplies approved vacancies. */
export default function CareersPage() {
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <CareersIntro />
        <CareersJobBoard />
        <CareersOfficeSection />
        <CareersResumeSection />
      </main>
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our approach", "/our-approach"],
          ["Career opportunities", "#openings"],
          ["Life at Moneybee", "#life"],
          ["Send your resume", "#apply"],
          ["Contact", ENQUIRY_HREF],
        ]}
      />
    </SiteNavigation>
  );
}
