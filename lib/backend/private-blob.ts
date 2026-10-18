import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, get, put } from "@vercel/blob";

/*
 * Files that must never have a public web address: applicants' resumes and
 * staff's private files (the Flyingbee PPM, fee illustrations, anything for
 * one client). Media is public, so these go to a private Vercel Blob store of
 * their own, created with `--access private`. Its token is still called
 * RESUMES_READ_WRITE_TOKEN because resumes came first. Keys are ours, a
 * folder and a random id, never a person's file name. Without the token a
 * laptop keeps files under .data/ (git-ignored); a production deployment
 * without it stores nothing. Before go-live this moves to the client's
 * private S3 bucket in Mumbai.
 */

export const privateToken = () => process.env.RESUMES_READ_WRITE_TOKEN;

/** True when a private file has somewhere to go: the private store, or a laptop's .data/. */
export const privateStoreReady = () => Boolean(privateToken()) || process.env.NODE_ENV !== "production";

/** Keys are "<folder>/<id>.<ext>", which also keeps a local path inside .data/. */
const KEY = /^[a-z]+\/[\w-]+\.[a-z0-9]+$/;
const localPath = (key: string) => {
  if (!KEY.test(key)) throw new Error("Not a private file key.");
  return path.join(process.cwd(), ".data", key);
};

export async function savePrivate(key: string, body: Uint8Array, contentType: string) {
  const token = privateToken();
  if (token) {
    await put(key, Buffer.from(body), { access: "private", contentType, token });
    return;
  }
  if (!privateStoreReady()) throw new Error("Private file storage is not connected.");
  const file = localPath(key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body);
}

/** One private file as a stream, or null when it is gone. */
export async function openPrivate(key: string): Promise<{ body: ReadableStream<Uint8Array>; size: number | null } | null> {
  const token = privateToken();
  if (token) {
    const result = await get(key, { access: "private", token, useCache: false });
    return result?.stream ? { body: result.stream, size: result.blob.size } : null;
  }
  try {
    const file = await readFile(localPath(key));
    return { body: new Blob([file]).stream(), size: file.byteLength };
  } catch {
    return null;
  }
}

/** One private file's bytes, for an email attachment. */
export async function readPrivate(key: string): Promise<Buffer | null> {
  const file = await openPrivate(key);
  return file ? Buffer.from(await new Response(file.body).arrayBuffer()) : null;
}

/** Deletes one private file. A file already gone is not an error. */
export async function deletePrivate(key: string) {
  const token = privateToken();
  if (token) return del(key, { token });
  await rm(localPath(key), { force: true });
}
