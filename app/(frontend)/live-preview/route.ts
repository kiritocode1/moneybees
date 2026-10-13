import config from "@payload-config";
import { draftMode, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { sitePath } from "@/lib/site/path";

/**
 * /admin's preview pane opens pages through here. Signed-in staff get Next's
 * draft mode, so the page shows its latest unpublished version, and land on
 * `path`. Anyone else is turned away.
 */
export async function GET(request: Request) {
  const path = sitePath(new URL(request.url).searchParams.get("path"));
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== "users") return new Response("Sign in to /admin to see unpublished changes.", { status: 401 });
  (await draftMode()).enable();
  redirect(path);
}
