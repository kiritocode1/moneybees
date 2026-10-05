import type { MetadataRoute } from "next";

const SITE_URL = "https://www.moneybee.in";

/** The thirteen production pages. /preview/* stays out; robots.ts disallows it too. */
const ROUTES = [
  "",
  "/about",
  "/pms",
  "/aif",
  "/pms-vs-aif",
  "/our-approach",
  "/performance",
  "/case-studies",
  "/team",
  "/careers",
  "/contact",
  "/insights",
  "/investor-centre",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
