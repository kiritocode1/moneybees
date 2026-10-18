import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { filesScreen } from "@/lib/files/screen-data";
import { FilesScreen } from "./files-screen";

/*
 * /admin/files (payload.config.ts admin.components.views.files): every PDF
 * and picture Moneybee keeps, public and private, with where each is used
 * and who it was sent to. ?file=<ref> opens one beside the list. Payload's
 * own Media list stays at /admin/collections/media for alt text and focus.
 */

const ROLES = [...CRM_ROLES, "hr", "editor"] as const;

export async function FilesView(props: AdminViewServerProps) {
  const { req } = props.initPageResult;
  const user = req.user?.collection === "users" && hasRole(req.user, ...ROLES) ? req.user : null;
  const selected = typeof props.searchParams?.file === "string" ? props.searchParams.file : undefined;
  const data = user ? await filesScreen(req.payload, user, selected) : null;

  return <AdminView {...props} roles={ROLES}>{() => (data ? <FilesScreen data={data} /> : null)}</AdminView>;
}
