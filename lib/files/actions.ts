"use server";

import config from "@payload-config";
import { del, head } from "@vercel/blob";
import { type } from "arktype";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { catalogueEntry } from "@/emails";
import { privateToken } from "@/lib/backend/private-blob";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { templateRow } from "@/lib/crm/email-template-row";
import { DOCUMENT_GROUPS } from "@/lib/investor-centre";
import { bytesMatch, isPrivateType, isPublicType, MAX_FILE_BYTES } from "@/lib/files/kinds";
import { type FileItem, type FilePicks, fileItem, pickFiles } from "@/lib/files/library";
import { saveMediaFile, savedItem, savePrivateRow } from "@/lib/files/store";
import { fileUsage } from "@/lib/files/usage";
import type { User } from "@/payload-types";

/*
 * What the Attach picker (components/admin/files/file-row.tsx) and the
 * Files screen (components/admin/files/files-screen.tsx) ask the server:
 * the files to offer for a letter, recording a file the browser uploaded
 * straight to Vercel Blob, deleting an unused file, and making a PDF into
 * an Investor Centre card. Each checks the signed-in staff member's role,
 * and Payload's own access decides the rest.
 */

type Fail = { ok: false; error: string };
type Done = { ok: true; file: FileItem } | Fail;

async function signedIn() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== "users") throw new Error("Sign in again.");
  return { payload, user: user as User };
}

async function sender() {
  const ctx = await signedIn();
  if (!hasRole(ctx.user, ...CRM_ROLES, "hr")) throw new Error("Only the desk and HR can attach files.");
  return ctx;
}

const Ask = type({ "templateId?": "number.integer > 0", "entryId?": "string <= 60", "query?": "string <= 80", "rules?": "boolean" });

/**
 * The picker's lists. The letter is named by its Email templates row (an
 * enquiry reply) or its catalogue id (a letter sent from a person or the
 * Emails page); its Goes with decides the suggestions. `direct` says whether
 * an upload goes straight to the private store.
 */
export async function filesForPicker(input: typeof Ask.infer): Promise<FilePicks & { direct: boolean }> {
  const ask = Ask(input);
  if (ask instanceof type.errors) return { suggested: [], recent: [], all: [], direct: false };
  const { payload, user } = await sender();
  const entry = ask.entryId ? catalogueEntry(ask.entryId) : undefined;
  const row = ask.templateId
    ? await payload.findByID({ collection: "email-templates", id: ask.templateId, depth: 0, user, overrideAccess: false, disableErrors: true })
    : entry
      ? await templateRow(payload, entry)
      : null;
  const picks = await pickFiles(payload, user, { goesWith: row?.goesWith ?? [], query: ask.query, rules: ask.rules });
  return { ...picks, direct: Boolean(privateToken()) };
}

/** Which uploads go straight from the browser to their store. */
export async function uploadTargets() {
  await signedIn();
  return { private: Boolean(privateToken()), public: Boolean(process.env.BLOB_READ_WRITE_TOKEN) };
}

const Uploaded = type({ pathname: /^files\/[\w-]+\.[a-z0-9]+$/, filename: "1 <= string <= 200", "title?": "string <= 200", "replace?": /^private:\d+$/ });

/** After the browser uploads to the private store: checks the file is really there, then lists it in Private files, or puts it in place of the file it replaces. */
export async function registerPrivateFile(input: typeof Uploaded.infer): Promise<Done> {
  const uploaded = Uploaded(input);
  if (uploaded instanceof type.errors) return { ok: false, error: "That upload cannot be used." };
  const token = privateToken();
  if (!token) return { ok: false, error: "Private file storage is not connected." };
  const { payload, user } = await sender();
  const blob = await head(uploaded.pathname, { token }).catch(() => null);
  if (!blob) return { ok: false, error: "The upload did not arrive. Try again." };
  if (!isPrivateType(blob.contentType) || blob.size > MAX_FILE_BYTES) {
    await del(uploaded.pathname, { token });
    return { ok: false, error: "Send a PDF, Word, Excel or picture file of up to 25 MB." };
  }
  const saved = await savePrivateRow(payload, user, { key: uploaded.pathname, filename: uploaded.filename, mimeType: blob.contentType, filesize: blob.size, title: uploaded.title, replace: uploaded.replace });
  return savedItem(payload, user, saved);
}

const PublicUpload = type({ url: "string.url", pathname: /^uploads\/[\w-]+\.[a-z0-9]+$/, filename: "1 <= string <= 200", "title?": "string <= 200", "replace?": /^media:\d+$/ });

/**
 * After the browser uploads a website file to the public store: Payload
 * takes the bytes into Media (or in place of the file it replaces) and the
 * waiting copy under uploads/ is deleted.
 */
export async function finishPublicUpload(input: typeof PublicUpload.infer): Promise<Done> {
  const uploaded = PublicUpload(input);
  if (uploaded instanceof type.errors) return { ok: false, error: "That upload cannot be used." };
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return { ok: false, error: "File storage is not connected." };
  const { payload, user } = await signedIn();
  if (!hasRole(user, ...CRM_ROLES, "hr", "editor")) return { ok: false, error: "Your role cannot add website files." };
  try {
    const blob = await head(uploaded.pathname, { token }).catch(() => null);
    if (!blob || blob.url !== uploaded.url) return { ok: false, error: "The upload did not arrive. Try again." };
    const bytes = Buffer.from(await (await fetch(blob.url)).arrayBuffer());
    if (!isPublicType(blob.contentType) || !bytesMatch(bytes, blob.contentType) || bytes.byteLength > MAX_FILE_BYTES) return { ok: false, error: "A website file must be a PDF or a picture of up to 25 MB." };
    const saved = await saveMediaFile(payload, user, { bytes, mimeType: blob.contentType, filename: uploaded.filename, title: uploaded.title, replace: uploaded.replace });
    return savedItem(payload, user, saved);
  } finally {
    await del(uploaded.pathname, { token }).catch(() => undefined);
  }
}

const Ref = type(/^(media|private):\d+$/);

/**
 * Deletes a file used nowhere. A file a page, card, fact sheet or letter
 * still uses is refused with where to take it out first; emails that
 * carried it keep their copy. Payload's access decides who may delete
 * (an admin for website files, compliance for private ones).
 */
export async function deleteFile(ref: string): Promise<{ ok: true } | Fail> {
  const parsed = Ref(ref);
  if (parsed instanceof type.errors) return { ok: false, error: "That file cannot be found." };
  const { payload, user } = await signedIn();
  const { places } = await fileUsage(payload, { hr: hasRole(user, "hr") });
  const used = places.get(parsed) ?? [];
  if (used.length) return { ok: false, error: `Still used in ${used.map((place) => place.label).join("; ")}. Take it out there first.` };
  const [collection, id] = parsed.split(":");
  try {
    await payload.delete({ collection: collection === "private" ? "private-files" : "media", id: Number(id), user, overrideAccess: false });
  } catch {
    return { ok: false, error: collection === "private" ? "Only compliance or an admin can delete a private file." : "Only an admin can delete a website file." };
  }
  return { ok: true };
}

const groupIds = DOCUMENT_GROUPS.map((group) => group.id);
const CardInput = type({ title: "1 <= string <= 200", group: type.enumerated(...groupIds) });

/** Puts a public PDF on the Investor Centre as a document card, at the end of its group. */
export async function makeDocumentCard(ref: string, input: typeof CardInput.infer): Promise<{ ok: true; href: string } | Fail> {
  const parsed = CardInput(input);
  const id = /^media:(\d+)$/.exec(ref)?.[1];
  if (parsed instanceof type.errors || !id) return { ok: false, error: "Give the card a title and a group." };
  const { payload, user } = await signedIn();
  const file = await fileItem(payload, user, ref);
  if (!file || file.kind !== "PDF") return { ok: false, error: "Only a website PDF can be a document card." };
  try {
    const card = await payload.create({ collection: "documents", user, overrideAccess: false, data: { title: parsed.title.trim(), group: parsed.group as never, file: Number(id), drawing: "forms" } });
    return { ok: true, href: `/admin/collections/documents/${card.id}` };
  } catch {
    return { ok: false, error: "Only editors and compliance can add document cards." };
  }
}
