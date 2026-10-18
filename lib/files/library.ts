import type { Payload } from "payload";
import { readPrivate } from "@/lib/backend/private-blob";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import type { EmailAttachment } from "@/lib/crm/mail";
import { type FileKind, fileSize, kindOf, MAX_EMAIL_FILE_BYTES } from "@/lib/files/kinds";
import type { Contact, Email, FactSheet, Media, PrivateFile, Product, User } from "@/payload-types";

/*
 * Every file staff can send, wherever it lives: Media (public: document card
 * PDFs, fact sheet PDFs, portraits, page pictures) and Private files. A file
 * is named by a ref, "media:12" or "private:3". A letter's Goes with may also
 * hold "latest-fact-sheet:moneybee-pms", the newest approved sheet of that
 * product at the moment the letter is picked. A file is named after what
 * uses it (the document card's title, the fact sheet's product and month),
 * so staff see "Disclosure Document", not dd-final-v3.pdf.
 */

export type FileItem = {
  ref: string;
  name: string;
  kind: FileKind;
  size: number | null;
  sizeLabel: string;
  private: boolean;
  /** Where it lives, or why it cannot go yet: "On the Investor Centre", "Waiting for compliance". */
  note: string;
  attachable: boolean;
  /** Where staff open it: the public address, or /api/files/private/:id. */
  href: string | null;
  updatedAt: string;
};

export type FilePicks = { suggested: FileItem[]; recent: FileItem[]; all: FileItem[] };

const LATEST = "latest-fact-sheet:";
const RECENT_DAYS = 30;

const asDoc = <T extends { id: number }>(value: number | T | null | undefined): T | null => (value && typeof value === "object" ? value : null);
const idOf = (value: number | { id: number } | null | undefined) => (value && typeof value === "object" ? value.id : (value ?? null));
const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
const monthOf = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
const bareName = (filename: string | null | undefined) => (filename ?? "File").replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");

/** Whether this staff member may see private files at all. */
const seesPrivate = (user: User) => hasRole(user, ...CRM_ROLES, "hr");

type Sheet = FactSheet & { product: Product };

/** One Private files row as the picker shows it. */
export const privateFileItem = (file: PrivateFile): FileItem => ({
  ref: `private:${file.id}`,
  name: file.title,
  kind: kindOf(file.mimeType),
  size: file.filesize,
  sizeLabel: fileSize(file.filesize),
  private: true,
  note: "Private",
  attachable: true,
  href: `/api/files/private/${file.id}`,
  updatedAt: file.updatedAt,
});

/** Every file, newest first, with the fact sheets kept aside so a letter's "latest" can be found. */
async function library(payload: Payload, user: User) {
  const [media, privates, sheets, cards, team, products] = await Promise.all([
    payload.find({ collection: "media", sort: "-updatedAt", limit: 300, depth: 0, overrideAccess: true }),
    seesPrivate(user) ? payload.find({ collection: "private-files", sort: "-updatedAt", limit: 300, depth: 0, user, overrideAccess: false }) : null,
    payload.find({ collection: "fact-sheets", where: { pdf: { exists: true }, status: { in: ["published", "in_review", "superseded"] } }, sort: "-asOf", limit: 200, depth: 1, overrideAccess: true }),
    payload.find({ collection: "documents", where: { file: { exists: true } }, limit: 100, depth: 0, overrideAccess: true }),
    payload.find({ collection: "team-members", where: { photo: { exists: true } }, limit: 100, depth: 0, overrideAccess: true }),
    payload.find({ collection: "products", sort: "name", limit: 50, depth: 0, overrideAccess: true }),
  ]);

  // What uses a Media file decides its name and whether it may go. A fact sheet beats a card beats a portrait.
  const known = new Map<number, { name: string; note: string; attachable: boolean }>();
  for (const member of team.docs) {
    const id = idOf(member.photo);
    if (id) known.set(id, { name: `${member.name}, portrait`, note: "Team", attachable: true });
  }
  for (const card of cards.docs) {
    const id = idOf(card.file);
    if (id) known.set(id, { name: card.title, note: "On the Investor Centre", attachable: true });
  }
  const sheetDocs = sheets.docs.filter((sheet): sheet is Sheet => Boolean(asDoc(sheet.product)));
  for (const sheet of [...sheetDocs].reverse()) {
    const id = idOf(sheet.pdf);
    if (!id) continue;
    const name = `${sheet.product.name} fact sheet, ${monthOf(sheet.asOf)}`;
    const note = sheet.status === "published" ? `Approved by compliance${sheet.publishedAt ? ` ${shortDate(sheet.publishedAt)}` : ""}` : sheet.status === "in_review" ? "Waiting for compliance" : "Replaced by a newer sheet";
    known.set(id, { name, note, attachable: sheet.status === "published" });
  }

  const fromMedia = (file: Media): FileItem => {
    const use = known.get(file.id);
    const kind = kindOf(file.mimeType);
    return {
      ref: `media:${file.id}`,
      name: use?.name ?? (file.alt?.trim() || bareName(file.filename)),
      kind,
      size: file.filesize ?? null,
      sizeLabel: fileSize(file.filesize),
      private: false,
      note: use?.note ?? (kind === "Picture" ? "Picture" : "Public"),
      attachable: use?.attachable ?? true,
      href: file.url ?? null,
      updatedAt: file.updatedAt,
    };
  };
  const items = [...media.docs.map(fromMedia), ...(privates?.docs ?? []).map(privateFileItem)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items, byRef: new Map(items.map((item) => [item.ref, item])), sheets: sheetDocs, products: products.docs };
}

type Library = Awaited<ReturnType<typeof library>>;

/** A letter's "latest" ref as today's files: the newest approved sheet, and a newer one still with compliance, shown greyed. */
function expand(lib: Library, ref: string): FileItem[] {
  if (!ref.startsWith(LATEST)) return [lib.byRef.get(ref)].filter((item): item is FileItem => Boolean(item));
  const slug = ref.slice(LATEST.length);
  const ofProduct = lib.sheets.filter((sheet) => sheet.product.slug === slug);
  const published = ofProduct.find((sheet) => sheet.status === "published");
  const waiting = ofProduct.find((sheet) => sheet.status === "in_review" && (!published || sheet.asOf > published.asOf));
  return [published, waiting].map((sheet) => (sheet ? lib.byRef.get(`media:${idOf(sheet.pdf)}`) : undefined)).filter((item): item is FileItem => Boolean(item));
}

/** The choices for a letter's Goes with: "the latest approved sheet" of each product, kept as a rule rather than a month. */
function latestRules(lib: Library): FileItem[] {
  return lib.products.map((product) => ({
    ref: `${LATEST}${product.slug}`,
    name: `Latest approved ${product.name} fact sheet`,
    kind: "PDF",
    size: null,
    sizeLabel: "",
    private: false,
    note: "Newest approved month",
    attachable: true,
    href: null,
    updatedAt: "",
  }));
}

/** The words typed, matched against a file's name and where it lives. */
const matches = (item: FileItem, query: string) => `${item.name} ${item.note}`.toLowerCase().includes(query.toLowerCase());

/**
 * What the Attach picker shows: the files the letter goes with, the files
 * this staff member sent in the last month, then every other file. With
 * `rules`, for setting a letter's Goes with, the "latest fact sheet" rules
 * come first and suggestions are skipped.
 */
export async function pickFiles(payload: Payload, user: User, { goesWith = [], query = "", rules = false }: { goesWith?: readonly string[]; query?: string; rules?: boolean } = {}): Promise<FilePicks> {
  const lib = await library(payload, user);
  const suggested = rules ? latestRules(lib) : goesWith.flatMap((ref) => expand(lib, ref));
  const since = new Date(Date.now() - RECENT_DAYS * 86_400_000).toISOString();
  const sent = await payload.find({
    collection: "emails",
    where: { sentBy: { equals: user.id }, createdAt: { greater_than: since }, "attachments.ref": { exists: true } },
    sort: "-createdAt",
    limit: 30,
    depth: 1,
    overrideAccess: true,
    select: { attachments: true, contact: true, to: true, createdAt: true },
  });
  const taken = new Set(suggested.map((item) => item.ref));
  const recent: FileItem[] = [];
  for (const email of sent.docs as Email[]) {
    for (const { ref } of email.attachments ?? []) {
      const item = lib.byRef.get(ref);
      if (!item || taken.has(ref) || recent.length >= 5) continue;
      taken.add(ref);
      recent.push({ ...item, note: `Sent to ${asDoc<Contact>(email.contact)?.name ?? email.to}, ${shortDate(email.createdAt)}` });
    }
  }
  const all = lib.items.filter((item) => !taken.has(item.ref));
  if (!query.trim()) return { suggested, recent, all };
  const words = query.trim();
  return { suggested: suggested.filter((item) => matches(item, words)), recent: recent.filter((item) => matches(item, words)), all: all.filter((item) => matches(item, words)) };
}

/** Every file this staff member can see, newest first, for the Files screen. */
export async function allFiles(payload: Payload, user: User) {
  return (await library(payload, user)).items;
}

/** One file by its ref, or null when it is gone or private to someone else. */
export async function fileItem(payload: Payload, user: User, ref: string) {
  return (await library(payload, user)).byRef.get(ref) ?? null;
}

/** The files a letter goes with, as today's files: what is attached the moment the letter is picked. */
export async function goesWithFiles(payload: Payload, user: User, goesWith: readonly string[]) {
  const lib = await library(payload, user);
  return goesWith.flatMap((ref) => expand(lib, ref));
}

/** A letter's Goes with as saved, rules and all, for the Emails page to show and change. */
export async function describeGoesWith(payload: Payload, user: User, goesWith: readonly string[]) {
  const lib = await library(payload, user);
  const rules = new Map(latestRules(lib).map((item) => [item.ref, item]));
  return goesWith.map((ref) => rules.get(ref) ?? lib.byRef.get(ref)).filter((item): item is FileItem => Boolean(item));
}

export const isFileRef = (ref: string) => /^(media|private):\d+$/.test(ref) || /^latest-fact-sheet:[a-z0-9-]+$/.test(ref);

/** "Disclosure Document.pdf": the name staff see, with the file's own extension, safe for any mail client. */
const attachmentName = (name: string, filename: string | null | undefined) => {
  const extension = /\.[a-z0-9]+$/i.exec(filename ?? "")?.[0] ?? "";
  return `${name.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120)}${extension}`;
};

/**
 * The files an email will carry, checked and fetched: public files by their
 * address, private ones by their bytes. Refuses a fact sheet compliance has
 * not approved, a file this staff member cannot see, and more than an email
 * can carry. `origin` turns a relative media address into one Resend can fetch.
 */
export async function resolveAttachments(payload: Payload, user: User, refs: readonly string[] | undefined, origin: string): Promise<{ ok: true; attachments: EmailAttachment[] } | { ok: false; error: string }> {
  const wanted = [...new Set(refs ?? [])];
  if (wanted.length === 0) return { ok: true, attachments: [] };
  if (wanted.length > 10) return { ok: false, error: "An email can carry up to 10 files." };
  const lib = await library(payload, user);
  const items = wanted.flatMap((ref) => (ref.startsWith(LATEST) ? expand(lib, ref).slice(0, 1) : [lib.byRef.get(ref)]));
  if (items.some((item) => !item)) return { ok: false, error: "One of the files is no longer there. Remove it and attach it again." };
  const files = items as FileItem[];
  const blocked = files.find((item) => !item.attachable);
  if (blocked) return { ok: false, error: `${blocked.name} cannot be sent: ${blocked.note.toLowerCase()}.` };
  const total = files.reduce((sum, item) => sum + (item.size ?? 0), 0);
  if (total > MAX_EMAIL_FILE_BYTES) return { ok: false, error: `These files come to ${fileSize(total)}. An email can carry ${fileSize(MAX_EMAIL_FILE_BYTES)}.` };

  const attachments: EmailAttachment[] = [];
  for (const item of files) {
    const [collection, raw] = item.ref.split(":");
    const id = Number(raw);
    if (collection === "private") {
      const row = await payload.findByID({ collection: "private-files", id, depth: 0, user, overrideAccess: false, disableErrors: true });
      const content = row ? await readPrivate(row.key) : null;
      if (!row || !content) return { ok: false, error: `${item.name} could not be read. Upload it again.` };
      attachments.push({ ref: item.ref, filename: attachmentName(item.name, row.filename), size: item.size, content });
    } else {
      const file = await payload.findByID({ collection: "media", id, depth: 0, overrideAccess: true, disableErrors: true });
      if (!file?.url) return { ok: false, error: `${item.name} has no file to send.` };
      attachments.push({ ref: item.ref, filename: attachmentName(item.name, file.filename), size: item.size, path: new URL(file.url, origin).toString() });
    }
  }
  return { ok: true, attachments };
}
