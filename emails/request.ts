import type { Origin } from "./security";

/*
 * Where a sign-in or password request came from, for the security emails:
 * the browser in plain words, and roughly where, from the city and country
 * Vercel adds to each request. Both are a guess and are only shown as such.
 */

const BROWSERS = [
  [/Edg\//, "Edge"],
  [/OPR\/|Opera/, "Opera"],
  [/Firefox\//, "Firefox"],
  [/Chrome\//, "Chrome"],
  [/Safari\//, "Safari"],
] as const;

const SYSTEMS = [
  [/iPhone|iPad|iOS/, "iOS"],
  [/Android/, "Android"],
  [/Mac OS X|Macintosh/, "macOS"],
  [/Windows/, "Windows"],
  [/Linux/, "Linux"],
] as const;

/** "Chrome on macOS", or undefined when the browser does not say. */
export function describeBrowser(userAgent: string | null | undefined) {
  if (!userAgent) return undefined;
  const browser = BROWSERS.find(([pattern]) => pattern.test(userAgent))?.[1];
  const system = SYSTEMS.find(([pattern]) => pattern.test(userAgent))?.[1];
  return browser && system ? `${browser} on ${system}` : (browser ?? system);
}

const COUNTRIES: Record<string, string> = { IN: "India", AE: "United Arab Emirates", GB: "United Kingdom", US: "United States", SG: "Singapore" };

/** The request's browser and approximate place. */
export function requestOrigin(head: Headers): Origin {
  const city = head.get("x-vercel-ip-city");
  const country = head.get("x-vercel-ip-country");
  const place = [city ? decodeURIComponent(city) : null, country ? (COUNTRIES[country] ?? country) : null].filter(Boolean).join(", ");
  return { browser: describeBrowser(head.get("user-agent")), near: place || undefined };
}

/** The site the request was made to, for absolute links in the email; undefined without a host, so renderEmail falls back to the site's own address. */
export function siteOf(head: Headers) {
  const host = head.get("x-forwarded-host") ?? head.get("host");
  return host ? `${head.get("x-forwarded-proto") ?? "https"}://${host}` : undefined;
}
