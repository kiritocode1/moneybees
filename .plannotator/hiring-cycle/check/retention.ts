/* Runs the daily deletion once against the local database (what /api/cron/retention calls). Not committed. */
import config from "@payload-config";
import { getPayload } from "payload";
import { deleteExpiredApplications } from "@/lib/hiring/retention";

const payload = await getPayload({ config });
if (!/localhost:54329/.test(process.env.DATABASE_URL ?? "")) throw new Error("Local database only.");
console.log(JSON.stringify({ deleted: await deleteExpiredApplications(payload) }));
process.exit(0);
