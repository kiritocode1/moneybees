import config from "@payload-config";
import { getPayload } from "payload";
import { sendTaskDigests } from "@/lib/crm/tasks";

/**
 * The weekday 9:00 email of each person's tasks overdue or due today
 * (lib/crm/tasks.ts sendTaskDigests), called by Vercel Cron (vercel.json) at
 * 03:33 UTC, which is 9:03 in Mumbai. Vercel sends CRON_SECRET as a bearer
 * token; anything else gets 401.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  const sent = await sendTaskDigests(await getPayload({ config }));
  return Response.json({ sent });
}
