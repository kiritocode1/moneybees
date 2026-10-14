import config from "@payload-config";
import { getPayload } from "payload";
import { deleteExpiredApplications } from "@/lib/hiring/retention";

/**
 * The daily deletion of applications past their keep-until day
 * (lib/hiring/retention.ts), called by Vercel Cron (vercel.json). Vercel sends
 * CRON_SECRET as a bearer token; anything else gets 401.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  const deleted = await deleteExpiredApplications(await getPayload({ config }));
  return Response.json({ deleted });
}
