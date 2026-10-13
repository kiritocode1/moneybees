import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import { TEAM, type TeamMember } from "@/lib/insights";

/**
 * The Our Team carousel's people from /admin (collections/TeamMembers.ts), in
 * their order there. Without a database, or with no one added yet, the team
 * in lib/insights.ts.
 */
export const teamMembers = cache(async (): Promise<readonly TeamMember[]> => {
  if (!process.env.DATABASE_URL) return TEAM;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "team-members", sort: "_order", depth: 1, limit: 50 });
  if (docs.length === 0) return TEAM;
  return docs.map((person) => ({
    name: person.name,
    role: person.role,
    photo: (typeof person.photo === "object" ? person.photo?.url : null) ?? person.photoPath ?? "",
    points: (person.points ?? []).map(({ point }) => point),
    linkedin: person.linkedin ?? undefined,
  }));
});
