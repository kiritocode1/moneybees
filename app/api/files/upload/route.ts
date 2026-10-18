import { randomUUID } from "node:crypto";
import config from "@payload-config";
import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { getPayload } from "payload";
import { privateStoreReady, privateToken, savePrivate } from "@/lib/backend/private-blob";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { bytesMatch, isPrivateType, isPublicType, MAX_FILE_BYTES, PRIVATE_TYPES, PUBLIC_TYPES } from "@/lib/files/kinds";
import { saveMediaFile, savedItem, savePrivateRow } from "@/lib/files/store";
import type { User } from "@/payload-types";

/**
 * Uploads a file from the Attach picker or the Files screen, private or
 * public. With its store connected, the browser sends the file straight to
 * Vercel Blob (a function takes at most 4.5 MB, and a PPM is often larger):
 * this route only hands out the upload token, and lib/files/actions.ts
 * records the file after. A private file goes under files/ in the private
 * store; a public one waits under uploads/ until Payload takes it into
 * Media. On a laptop without a store, the file comes here as a form.
 */

const PATHS = { private: /^files\/[\w-]+\.[a-z0-9]+$/, public: /^uploads\/[\w-]+\.[a-z0-9]+$/ } as const;
type Store = keyof typeof PATHS;

const storeOf = (value: unknown): Store => (value === "public" ? "public" : "private");
const tokenFor = (store: Store) => (store === "public" ? process.env.BLOB_READ_WRITE_TOKEN : privateToken());

/** Private files are the desk's and HR's; public files also the editors'. */
const mayUpload = (user: User, store: Store) => (store === "private" ? hasRole(user, ...CRM_ROLES, "hr") : hasRole(user, ...CRM_ROLES, "hr", "editor"));

export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (user?.collection !== "users") return Response.json({ error: "Sign in again." }, { status: 401 });
  const staff = user as User;

  if (request.headers.get("content-type")?.includes("application/json")) {
    const body = (await request.json()) as HandleUploadBody;
    const asked = body.type === "blob.generate-client-token" ? (JSON.parse(body.payload.clientPayload ?? "{}") as { store?: string }) : {};
    const store = storeOf(asked.store);
    const token = tokenFor(store);
    if (!mayUpload(staff, store)) return Response.json({ error: "Your role cannot upload these files." }, { status: 403 });
    if (!token) return Response.json({ error: "File storage is not connected." }, { status: 503 });
    const result = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname) => {
        if (!PATHS[store].test(pathname)) throw new Error("Not a file path.");
        return { allowedContentTypes: Object.keys(store === "public" ? PUBLIC_TYPES : PRIVATE_TYPES), maximumSizeInBytes: MAX_FILE_BYTES, addRandomSuffix: false };
      },
    });
    return Response.json(result);
  }

  const form = await request.formData();
  const file = form.get("file");
  const store = storeOf(form.get("store"));
  const title = String(form.get("title") ?? "").trim().slice(0, 200);
  const replace = String(form.get("replace") ?? "") || undefined;
  if (!mayUpload(staff, store)) return Response.json({ error: "Your role cannot upload these files." }, { status: 403 });
  if (!(file instanceof File)) return Response.json({ error: "Choose a file." }, { status: 400 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const allowed = store === "public" ? isPublicType(file.type) : isPrivateType(file.type);
  if (!allowed || !bytesMatch(bytes, file.type)) return Response.json({ error: store === "public" ? "A website file must be a PDF or a picture." : "Send a PDF, Word, Excel or picture file." }, { status: 415 });
  if (bytes.byteLength > MAX_FILE_BYTES) return Response.json({ error: "Files can be up to 25 MB." }, { status: 413 });

  let saved;
  if (store === "public") {
    saved = await saveMediaFile(payload, staff, { bytes: Buffer.from(bytes), mimeType: file.type, filename: file.name, title, replace });
  } else {
    if (!privateStoreReady()) return Response.json({ error: "Private file storage is not connected." }, { status: 503 });
    const key = `files/${randomUUID()}${PRIVATE_TYPES[file.type as keyof typeof PRIVATE_TYPES]}`;
    await savePrivate(key, bytes, file.type);
    saved = await savePrivateRow(payload, staff, { key, filename: file.name.slice(0, 200), mimeType: file.type, filesize: bytes.byteLength, title, replace });
  }
  const result = await savedItem(payload, staff, saved);
  return result.ok ? Response.json(result) : Response.json({ error: result.error }, { status: 400 });
}
