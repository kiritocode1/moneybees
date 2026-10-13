import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import { DEFAULT_DETAILS, type SiteDetails } from "./details";

/**
 * The office and contact details from /admin, read once per request however
 * many parts of the page ask. Without a database, or before the record was
 * first saved, today's details.
 */
export const siteDetails = cache(async (): Promise<SiteDetails> => {
  if (!process.env.DATABASE_URL) return DEFAULT_DETAILS;
  const payload = await getPayload({ config });
  const saved = await payload.findGlobal({ slug: "site-details", depth: 0 });
  if (!saved.updatedAt) return DEFAULT_DETAILS;
  return {
    company: saved.company,
    officeName: saved.officeName,
    address: saved.address,
    pin: saved.pin,
    phones: saved.phones ?? [],
    email: saved.email,
    desks: saved.desks ?? [],
    registrations: saved.registrations ?? [],
    disclaimer: saved.disclaimer,
  };
});
