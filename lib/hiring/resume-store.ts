import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, get, put } from "@vercel/blob";

/*
 * Where resumes are kept. Media is public, so resumes go to a private Vercel
 * Blob store of their own (created with `--access private`; its token is
 * RESUMES_READ_WRITE_TOKEN). The path is a random id, never the applicant's
 * file name, and only /api/hiring/resume/:id hands a file out, to HR. Without
 * the token a laptop keeps files in .data/resumes/ (git-ignored); a production
 * deployment without it takes no resumes at all. Before go-live this moves to
 * the client's private S3 bucket in Mumbai.
 */

const token = () => process.env.RESUMES_READ_WRITE_TOKEN;
const LOCAL_DIR = path.join(process.cwd(), ".data", "resumes");

/** True when an uploaded resume has somewhere private to go. */
export const resumesStored = () => Boolean(token()) || process.env.NODE_ENV !== "production";

/** The file types an applicant may upload, recognised by their first bytes rather than their name. */
const SIGNATURES = [
  { extension: ".pdf", type: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] },
  { extension: ".docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", bytes: [0x50, 0x4b, 0x03, 0x04] },
  { extension: ".doc", type: "application/msword", bytes: [0xd0, 0xcf, 0x11, 0xe0] },
] as const;

/** The upload's real type, or null when it is not a PDF or Word file whatever its name says. */
export function resumeType(head: Uint8Array) {
  return SIGNATURES.find(({ bytes }) => bytes.every((byte, index) => head[index] === byte)) ?? null;
}

/** Stores one resume and returns its key. */
export async function saveResume(body: Uint8Array, kind: (typeof SIGNATURES)[number]) {
  const key = `resumes/${randomUUID()}${kind.extension}`;
  const secret = token();
  if (secret) {
    await put(key, Buffer.from(body), { access: "private", contentType: kind.type, token: secret });
  } else {
    if (!resumesStored()) throw new Error("Private file storage is not connected.");
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(path.join(LOCAL_DIR, path.basename(key)), body);
  }
  return key;
}

/** One stored resume as a stream, or null when it is gone. */
export async function openResume(key: string): Promise<{ body: ReadableStream<Uint8Array>; size: number | null } | null> {
  const secret = token();
  if (secret) {
    const result = await get(key, { access: "private", token: secret, useCache: false });
    return result?.stream ? { body: result.stream, size: result.blob.size } : null;
  }
  try {
    const file = await readFile(path.join(LOCAL_DIR, path.basename(key)));
    return { body: new Blob([file]).stream(), size: file.byteLength };
  } catch {
    return null;
  }
}

/** Deletes one stored resume. A file already gone is not an error. */
export async function deleteResume(key: string) {
  const secret = token();
  if (secret) return del(key, { token: secret });
  await rm(path.join(LOCAL_DIR, path.basename(key)), { force: true });
}
