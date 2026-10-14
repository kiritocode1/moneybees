import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import { CAREER_ROLES, type CareerRole } from "@/lib/career-roles";

/**
 * The roles on /careers from /admin (collections/Openings.ts), in their order
 * there, without the Closed ones. Without a database, or with none added yet,
 * the sample roles in lib/career-roles.ts.
 */
export const openings = cache(async (): Promise<readonly CareerRole[]> => {
  if (!process.env.DATABASE_URL) return CAREER_ROLES;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "openings", where: { status: { not_equals: "closed" } }, sort: "_order", depth: 0, limit: 200 });
  if (docs.length === 0) return CAREER_ROLES;
  return docs.map((role) => ({
    id: role.anchor ?? `opening-${role.id}`,
    title: role.title,
    team: role.team,
    location: role.location,
    employment: role.employment,
    summary: role.summary,
    responsibilities: (role.responsibilities ?? []).map(({ line }) => line),
    mustHaves: (role.mustHaves ?? []).map(({ line }) => line),
    status: role.status === "live" ? "live" : "sample",
  }));
});
