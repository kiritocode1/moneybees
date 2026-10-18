/*
 * The files staff may upload to send by email, and how a file's kind is
 * named on screen. Kept free of server imports so the browser can check a
 * file before uploading it.
 */

export const PRIVATE_TYPES = {
  "application/pdf": ".pdf",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
} as const;
export type PrivateType = keyof typeof PRIVATE_TYPES;

export const isPrivateType = (type: string): type is PrivateType => type in PRIVATE_TYPES;

/** The files that may go on the website (Media takes PDFs and pictures). */
export const PUBLIC_TYPES = {
  "application/pdf": ".pdf",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
} as const;
export type PublicType = keyof typeof PUBLIC_TYPES;
export const isPublicType = (type: string): type is PublicType => type in PUBLIC_TYPES;

/** A file's first bytes, so a renamed file is caught whatever it calls itself. */
const SIGNATURES: Record<string, readonly number[]> = {
  "application/pdf": [0x25, 0x50, 0x44, 0x46, 0x2d],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [0x50, 0x4b, 0x03, 0x04],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [0x50, 0x4b, 0x03, 0x04],
};

/** True when the bytes really are the type the file claims. */
export const bytesMatch = (bytes: Uint8Array, type: string) => Boolean(SIGNATURES[type]?.every((byte, index) => bytes[index] === byte));

/** One upload's limit. Resend takes 40 MB per email after Base64, so about 30 MB of files in all. */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_EMAIL_FILE_BYTES = 30 * 1024 * 1024;

export type FileKind = "PDF" | "Picture" | "Word" | "Excel" | "File";

export function kindOf(type: string | null | undefined): FileKind {
  if (!type) return "File";
  if (type === "application/pdf") return "PDF";
  if (type.startsWith("image/")) return "Picture";
  if (type.includes("wordprocessingml") || type === "application/msword") return "Word";
  if (type.includes("spreadsheetml")) return "Excel";
  return "File";
}

/** "2.4 MB", "640 KB". */
export function fileSize(bytes: number | null | undefined) {
  if (!bytes) return "";
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
