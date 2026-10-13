import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { DraftTools } from "@/components/site-editor/draft-tools";
import { PageSections } from "@/components/site-editor/page-sections";
import { PHILOSOPHY_SECTIONS } from "@/lib/pages/philosophy-content";
import { pageSections } from "@/lib/pages/load";
import { pmsFigures } from "@/lib/site/figures";
import SiteFooter from "@/components/footer/site-footer";
import SiteNavigation from "@/components/ui/site-navigation";

export const metadata: Metadata = {
  title: "Our philosophy: screen, analyse, monitor, exit",
  description:
    "How Moneybee picks stocks: screen, shortlist, analyse, decide, monitor and exit. We look for quality management, robust fundamentals and reasonable valuations.",
  alternates: { canonical: "/our-philosophy" },
  // Page openGraph replaces the layout one, so it restates the site fields.
  openGraph: { siteName: "Moneybee", locale: "en_IN", type: "website", url: "/our-philosophy", images: [{ url: "/opengraph-image", width: 1200, height: 630 }], title: "Our philosophy: screen, analyse, monitor, exit | Moneybee", description: "How Moneybee picks stocks: screen, shortlist, analyse, decide, monitor and exit. We look for quality management, robust fundamentals and reasonable valuations." },
};

/**
 * /our-philosophy (named Our Approach, at /our-approach, until 2026-10-11, which
 * now redirects here), built to the Content & Visual Plan §6 on study 09's process
 * sheet: the core philosophy on study 08's discs, the six principles round the
 * turning tholos at Delphi (approved in .plannotator/philosophy-tholos/plan.md,
 * 2026-10-11), what we look for and don't do, and risk management
 * as concentric half-rings. Copy lives in lib/approach.ts.
 * Ends with the closing door pair (components/cta/page-end-doors.tsx).
 * Staff edit the sections in /admin (globals/OurPhilosophyPage.ts).
 */
export default async function OurPhilosophyPage() {
  const { isEnabled: draft } = await draftMode();
  const [sections, figures] = await Promise.all([pageSections("our-philosophy-page", draft, PHILOSOPHY_SECTIONS), pmsFigures()]);
  return (
    <SiteNavigation>
      <main id="top" className="option-one bg-white text-black">
        <PageSections sections={sections} figures={figures} draft={draft} />
      </main>
      {draft ? <DraftTools path="/our-philosophy" /> : null}
      <SiteFooter
        explore={[
          ["About Moneybee", "/about"],
          ["Our philosophy", "#philosophy"],
          ["Our strategies", "/pms-vs-aif"],
          ["Team", "/about#team"],
        ]}
      />
    </SiteNavigation>
  );
}
