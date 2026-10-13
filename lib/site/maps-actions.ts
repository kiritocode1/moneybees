"use server";

import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { isShortMapsLink, type Pin, pinFromMapsLink } from "./maps-link";

/** Only Google's own hosts are followed, so the server never fetches an address staff did not mean. */
const GOOGLE = /^(maps\.app\.goo\.gl|goo\.gl|(www\.|maps\.)?google\.[a-z.]+)$/i;

/**
 * Follows a short Google Maps share link (maps.app.goo.gl) to the full
 * address, up to three hops, and reads the pin from it. Staff only.
 */
export async function pinFromShortLink(link: string): Promise<Pin | null> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== "users" || !isShortMapsLink(link)) return null;
  let url = link.trim();
  for (let hop = 0; hop < 3; hop++) {
    const host = new URL(url).hostname;
    if (!GOOGLE.test(host)) return null;
    const response = await fetch(url, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(5000) });
    const next = response.headers.get("location");
    if (!next) return pinFromMapsLink(url);
    url = new URL(next, url).toString();
    const pin = pinFromMapsLink(url);
    if (pin) return pin;
  }
  return null;
}
