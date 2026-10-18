import type { Payload } from "payload";
import { deletePrivate } from "@/lib/backend/private-blob";
import { fileItem } from "@/lib/files/library";
import type { User } from "@/payload-types";

/*
 * Writing a file's row once its bytes are somewhere: a Private files row for
 * a file in the private store, a Media row (Payload stores the bytes through
 * its adapter) for one that may go on the website. With `replace`, the same
 * row takes the new file, so every page, card, fact sheet and letter that
 * uses it shows the new one. Emails already sent keep the copy they carried.
 */

type Saved = { ok: true; ref: string } | { ok: false; error: string };

const refId = (ref: string | undefined, collection: "media" | "private") => {
  const match = ref ? new RegExp(`^${collection}:(\\d+)$`).exec(ref) : null;
  return match ? Number(match[1]) : null;
};

export async function savePrivateRow(payload: Payload, user: User, file: { key: string; filename: string; mimeType: string; filesize: number; title?: string; replace?: string }): Promise<Saved> {
  const replace = refId(file.replace, "private");
  const title = file.title?.trim() || file.filename.replace(/\.[a-z0-9]+$/i, "");
  if (replace) {
    const old = await payload.findByID({ collection: "private-files", id: replace, depth: 0, user, overrideAccess: false, disableErrors: true });
    if (!old) return { ok: false, error: "That file is no longer there." };
    await payload.update({ collection: "private-files", id: replace, user, overrideAccess: false, data: { filename: file.filename, mimeType: file.mimeType, filesize: file.filesize, key: file.key, uploadedBy: user.id } });
    await deletePrivate(old.key);
    return { ok: true, ref: `private:${replace}` };
  }
  const row = await payload.create({ collection: "private-files", user, overrideAccess: false, data: { title, filename: file.filename, mimeType: file.mimeType, filesize: file.filesize, key: file.key, uploadedBy: user.id } });
  return { ok: true, ref: `private:${row.id}` };
}

export async function saveMediaFile(payload: Payload, user: User, file: { bytes: Buffer; mimeType: string; filename: string; title?: string; replace?: string }): Promise<Saved> {
  const replace = refId(file.replace, "media");
  const upload = { data: file.bytes, mimetype: file.mimeType, name: file.filename.replace(/[^\w.\- ]+/g, "_"), size: file.bytes.byteLength };
  try {
    if (replace) {
      await payload.update({ collection: "media", id: replace, user, overrideAccess: false, data: {}, file: upload });
      return { ok: true, ref: `media:${replace}` };
    }
    const row = await payload.create({ collection: "media", user, overrideAccess: false, data: { alt: file.title?.trim() || file.filename.replace(/\.[a-z0-9]+$/i, "") }, file: upload });
    return { ok: true, ref: `media:${row.id}` };
  } catch (error) {
    const forbidden = error instanceof Error && /forbidden|not allowed/i.test(error.message);
    return { ok: false, error: forbidden ? (replace ? "Only editors and compliance can replace a website file." : "Your role cannot add website files.") : "The file could not be saved. Check it is a whole PDF or picture." };
  }
}

/** The saved file as the Files screen and the picker show it. */
export async function savedItem(payload: Payload, user: User, saved: Saved) {
  if (!saved.ok) return saved;
  const file = await fileItem(payload, user, saved.ref);
  return file ? ({ ok: true, file } as const) : ({ ok: false, error: "The file was saved but cannot be shown. Reload the page." } as const);
}
