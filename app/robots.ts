import type { MetadataRoute } from "next";

/** Crawlers may read every page except the design previews. Non-production builds also send noindex from the root layout. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/preview/" },
    sitemap: "https://www.moneybee.in/sitemap.xml",
  };
}
