import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { sitePath } from "@/lib/site/path";

/** Back to the published site: ends draft mode and returns to `path`. */
export async function GET(request: Request) {
  (await draftMode()).disable();
  redirect(sitePath(new URL(request.url).searchParams.get("path")));
}
