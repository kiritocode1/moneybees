import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { INBOX_TABS, type InboxTab, inboxCounts, inboxRows } from "@/lib/crm/inbox";
import { InboxScreen } from "./inbox-screen";

/** /admin/inbox: every enquiry, most urgent first (payload.config.ts admin.components.views). */
export async function InboxView(props: AdminViewServerProps) {
  const { req } = props.initPageResult;
  const user = req.user?.collection === "users" && hasRole(req.user, ...CRM_ROLES) ? req.user : null;
  const requested = typeof props.searchParams?.tab === "string" ? props.searchParams.tab : "";
  const tab: InboxTab = INBOX_TABS.some(({ key }) => key === requested) ? (requested as InboxTab) : "waiting";
  const [rows, counts] = user ? await Promise.all([inboxRows(req.payload, user, tab), inboxCounts(req.payload, user)]) : [[], null];

  return (
    <AdminView {...props} roles={CRM_ROLES}>
      {() => counts && <InboxScreen tab={tab} rows={rows} counts={counts} />}
    </AdminView>
  );
}
