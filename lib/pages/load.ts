import config from "@payload-config";
import { getPayload } from "payload";
import type { AboutPage, AifPage, CareersPage, CaseStudiesPage, ContactPage, HomePage, InvestorCentrePage, OurPhilosophyPage, PicksPage, PmsPage, PmsVsAifPage } from "@/payload-types";

/** The editable pages' records, by slug. */
type Pages = {
  "home-page": HomePage;
  "pms-page": PmsPage;
  "aif-page": AifPage;
  "pms-vs-aif-page": PmsVsAifPage;
  "our-philosophy-page": OurPhilosophyPage;
  "about-page": AboutPage;
  "case-studies-page": CaseStudiesPage;
  "picks-page": PicksPage;
  "investor-centre-page": InvestorCentrePage;
  "contact-page": ContactPage;
  "careers-page": CareersPage;
};

/** Every kind of section any editable page holds. */
export type PageSection = { [S in keyof Pages]: NonNullable<Pages[S]["sections"]>[number] }[keyof Pages];

/**
 * A page's sections from /admin: the published version, or the latest draft
 * while staff preview it. Without a database, or before the page was first
 * saved, `fallback`: today's sections, from lib/pages/*-content.ts.
 */
export async function pageSections(slug: keyof Pages, draft: boolean, fallback: readonly PageSection[]): Promise<PageSection[]> {
  if (!process.env.DATABASE_URL) return [...fallback];
  const payload = await getPayload({ config });
  const page = await payload.findGlobal({ slug, draft, depth: 1 });
  return page.updatedAt ? (page.sections ?? []) : [...fallback];
}
