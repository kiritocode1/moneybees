import { randomUUID } from "node:crypto";
import { deletePrivate, openPrivate, privateStoreReady, savePrivate } from "@/lib/backend/private-blob";

/*
 * Where resumes are kept: the private store (lib/backend/private-blob.ts),
 * under resumes/. The path is a random id, never the applicant's file name,
 * and only /api/hiring/resume/:id hands a file out, to HR.
 */

/** True when an uploaded resume has somewhere private to go. */
export const resumesStored = privateStoreReady;

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
  await savePrivate(key, body, kind.type);
  return key;
}

/** One stored resume as a stream, or null when it is gone. */
export const openResume = openPrivate;

/** Deletes one stored resume. A file already gone is not an error. */
export const deleteResume = deletePrivate;
