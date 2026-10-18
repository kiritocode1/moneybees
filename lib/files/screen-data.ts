import type { Payload } from "payload";
import { privateToken } from "@/lib/backend/private-blob";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { DOCUMENT_GROUPS } from "@/lib/investor-centre";
import { allFiles, type FileItem } from "@/lib/files/library";
import { fileUsage, type Place, type SentWith } from "@/lib/files/usage";
import type { User } from "@/payload-types";

/*
 * Everything /admin/files shows, read in one pass: every file the staff
 * member can see with where it is used and how often it was sent, and for
 * the open one, the emails it went with and what this person may do to it.
 */

export type FileRow = FileItem & { places: Place[]; sentCount: number };
export type FileDetail = FileRow & {
  sent: SentWith[];
  can: { send: boolean; replace: boolean; delete: boolean; card: boolean };
};

const SHOWN_SENT = 12;

export async function filesScreen(payload: Payload, user: User, selected: string | undefined) {
  const [files, usage] = await Promise.all([allFiles(payload, user), fileUsage(payload, { hr: hasRole(user, "hr") })]);
  const rows: FileRow[] = files.map((file) => ({ ...file, places: usage.places.get(file.ref) ?? [], sentCount: usage.sent.get(file.ref)?.length ?? 0 }));
  const row = selected ? rows.find((file) => file.ref === selected) : undefined;
  const detail: FileDetail | null = row
    ? {
        ...row,
        sent: (usage.sent.get(row.ref) ?? []).slice(0, SHOWN_SENT),
        can: {
          send: hasRole(user, ...CRM_ROLES),
          // As Payload's access has it: Media is changed by editors and compliance, removed by an admin; Private files by the desk and HR, removed by compliance.
          replace: row.private ? hasRole(user, ...CRM_ROLES, "hr") : hasRole(user, "editor", "compliance"),
          delete: row.private ? hasRole(user, "compliance") : hasRole(user),
          card: !row.private && row.kind === "PDF" && !row.places.some((place) => place.kind === "card") && hasRole(user, "editor", "compliance"),
        },
      }
    : null;

  return {
    rows,
    detail,
    groups: DOCUMENT_GROUPS.map(({ id, heading }) => ({ id, heading })),
    /** Editors upload website files only; private files are the desk's and HR's. */
    canUploadPrivate: hasRole(user, ...CRM_ROLES, "hr"),
    targets: { private: Boolean(privateToken()), public: Boolean(process.env.BLOB_READ_WRITE_TOKEN) },
  };
}

export type FilesScreenData = Awaited<ReturnType<typeof filesScreen>>;
