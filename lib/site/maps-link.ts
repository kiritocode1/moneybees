/** A map pin. */
export type Pin = { lat: number; lon: number };

const valid = (lat: number, lon: number): Pin | null =>
  Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? { lat: +lat.toFixed(6), lon: +lon.toFixed(6) } : null;

/**
 * The place a Google Maps link points at, or two numbers typed as "lat, lon".
 * Reads the forms Maps puts in its address bar and share links: the place
 * marker (!3d…!4d…), the view centre (@lat,lon), and q=, ll=, query= or
 * destination=. A short maps.app.goo.gl link has none of these until it is
 * followed (lib/site/maps-actions.ts). Safe on the client.
 */
export function pinFromMapsLink(input: string): Pin | null {
  const text = decodeURIComponent(input.trim());
  const marker = text.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (marker) return valid(Number(marker[1]), Number(marker[2]));
  const query = text.match(/[?&](?:q|ll|query|destination|center)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (query) return valid(Number(query[1]), Number(query[2]));
  const view = text.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (view) return valid(Number(view[1]), Number(view[2]));
  const bare = text.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  return bare ? valid(Number(bare[1]), Number(bare[2])) : null;
}

/** True for a short share link that has to be followed before it can be read. */
export const isShortMapsLink = (input: string) => /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(input.trim());
