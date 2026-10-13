import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import { CASE_STUDIES, type CaseStudyEntry } from "@/lib/case-studies";

/**
 * The companies on /case-studies from /admin (collections/CaseStudies.ts), in
 * their order there. Without a database, or with none added yet, the content
 * plan's three in lib/case-studies.ts.
 */
export const caseStudies = cache(async (): Promise<readonly CaseStudyEntry[]> => {
  if (!process.env.DATABASE_URL) return CASE_STUDIES;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "case-studies", sort: "_order", depth: 0, limit: 50 });
  if (docs.length === 0) return CASE_STUDIES;
  return docs.map((study) => ({
    id: study.anchor ?? `case-${study.id}`,
    name: study.name,
    mark: study.mark,
    drawing: study.drawing,
    business: study.business,
    edge: study.edge,
    growth: study.growth,
    financials: (study.financials ?? []).map(({ year, revenue, ebitda, pat }) => ({ year, revenue, ebidta: ebitda, pat })),
  }));
});
