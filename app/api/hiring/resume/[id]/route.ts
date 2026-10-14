import config from "@payload-config";
import { getPayload } from "payload";
import { hasRole } from "@/lib/backend/roles";
import { openResume } from "@/lib/hiring/resume-store";

/**
 * One applicant's resume, to signed-in HR or admin only, streamed from the
 * private store (lib/hiring/resume-store.ts). The applicant screen shows a PDF
 * in the page; `?download=1` saves it instead.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (user?.collection !== "users" || !hasRole(user, "hr")) return new Response("Unauthorized", { status: 401 });

  const id = Number((await params).id);
  const application = Number.isInteger(id) ? await payload.findByID({ collection: "applications", id, depth: 0, user, overrideAccess: false, disableErrors: true }) : null;
  const resume = application?.resume;
  const file = resume?.key ? await openResume(resume.key) : null;
  if (!resume?.key || !file) return new Response("Not found", { status: 404 });

  const download = new URL(request.url).searchParams.has("download");
  const name = (resume.name ?? "resume").replace(/[^\w.\- ]+/g, "_");
  return new Response(file.body, {
    headers: {
      "Content-Type": resume.type || "application/octet-stream",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...(file.size ? { "Content-Length": String(file.size) } : {}),
    },
  });
}
