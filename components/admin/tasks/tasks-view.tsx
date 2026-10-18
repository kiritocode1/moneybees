import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { TASK_TABS, type TaskTab, taskDesk } from "@/lib/crm/task-desk";
import { TasksScreen } from "./tasks-screen";

/** /admin/tasks (payload.config.ts admin.components.views.tasks): what each of us owes someone, and when. ?tab= picks Mine, Team, Asked of others or Done. */
export async function TasksView(props: AdminViewServerProps) {
  const { req } = props.initPageResult;
  const user = req.user?.collection === "users" && hasRole(req.user, ...CRM_ROLES) ? req.user : null;
  const asked = typeof props.searchParams?.tab === "string" ? props.searchParams.tab : "mine";
  const tab = (TASK_TABS.find(({ key }) => key === asked)?.key ?? "mine") as TaskTab;
  const desk = user ? await taskDesk(req.payload, user, tab) : null;
  return <AdminView {...props} roles={CRM_ROLES}>{() => (desk ? <TasksScreen desk={desk} /> : null)}</AdminView>;
}
