import config from "@payload-config";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { FiguresPreview } from "@/components/site-editor/figures-preview";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * The fact sheet screen's preview (components/admin/fact-sheet): the site's
 * own returns graphs, drawn from numbers the screen posts in as staff type.
 * It lives on the site because the admin does not load the site's styles.
 * Staff only; it holds no data of its own.
 */
export default async function FiguresPreviewPage() {
  // Headers first: they make the page render per request, so the build never starts Payload for it.
  const requestHeaders = await headers();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: requestHeaders });
  if (user?.collection !== "users") notFound();
  return <FiguresPreview />;
}
