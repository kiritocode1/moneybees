import config from "@payload-config";
import { getPayload } from "payload";
import { TEAM_NAMES } from "@/lib/careers";
import { aiResumeParse } from "@/lib/flags";
import { resumesStored } from "@/lib/hiring/resume-store";
import { siteDetails } from "@/lib/site/load-details";

/** Footer links for the apply pages. */
export const CAREERS_LINKS: [string, string][] = [
  ["Careers", "/careers"],
  ["Roles", "/careers#openings"],
  ["About Moneybee", "/about"],
  ["Contact", "/contact"],
];

/** What both apply pages pass the form besides the role: teams, the switches, the keep period and the fallback address. */
export async function applyFormProps() {
  const [details, readsResume, settings] = await Promise.all([
    siteDetails(),
    aiResumeParse(),
    process.env.DATABASE_URL ? (await getPayload({ config })).findGlobal({ slug: "crm-settings", depth: 0, overrideAccess: true }) : null,
  ]);
  return {
    teams: Object.entries(TEAM_NAMES).map(([value, label]) => ({ value, label })),
    resumes: resumesStored(),
    readsResume,
    keepMonths: settings?.hiring?.keepMonths ?? 12,
    fallbackEmail: details.email,
  };
}
