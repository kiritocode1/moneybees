import config from "@payload-config";
import { getPayload } from "payload";
import { openPrivate } from "@/lib/backend/private-blob";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";

/**
 * One private file, to signed-in desk staff and HR only, streamed from the
 * private store (lib/backend/private-blob.ts). It opens in the browser;
 * `?download=1` saves it instead.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (user?.collection !== "users" || !hasRole(user, ...CRM_ROLES, "hr")) return new Response("Unauthorized", { status: 401 });

  const id = Number((await params).id);
  const row = Number.isInteger(id) ? await payload.findByID({ collection: "private-files", id, depth: 0, user, overrideAccess: false, disableErrors: true }) : null;
  const file = row ? await openPrivate(row.key) : null;
  if (!row || !file) return new Response("Not found", { status: 404 });

  const download = new URL(request.url).searchParams.has("download");
  const name = row.filename.replace(/[^\w.\- ]+/g, "_");
  return new Response(file.body, {
    headers: {
      "Content-Type": row.mimeType || "application/octet-stream",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...(file.size ? { "Content-Length": String(file.size) } : {}),
    },
  });
}
