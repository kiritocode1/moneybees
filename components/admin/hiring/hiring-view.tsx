import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { EmailBanner } from "@/components/admin/email-banner";
import { hasRole } from "@/lib/backend/roles";
import { emailConnected } from "@/lib/crm/mail";
import { hiringCounts, hiringRoles, hiringRows, upcomingInterviews } from "@/lib/hiring/desk";
import { resumesStored } from "@/lib/hiring/resume-store";
import { HIRING_TABS, type Stage } from "@/lib/hiring/stages";
import { HiringScreen } from "./hiring-screen";

/** /admin/hiring: every application by stage, for HR and admin (payload.config.ts admin.components.views). */
export async function HiringView(props: AdminViewServerProps) {
  const { req } = props.initPageResult;
  const user = req.user?.collection === "users" && hasRole(req.user, "hr") ? req.user : null;
  const param = (key: string) => (typeof props.searchParams?.[key] === "string" ? (props.searchParams[key] as string) : "");
  const tab: Stage = HIRING_TABS.some(({ key }) => key === param("tab")) ? (param("tab") as Stage) : "new";
  const role = param("role") === "open" ? "open" : Number.isInteger(Number(param("role"))) && param("role") ? Number(param("role")) : null;
  const data = user
    ? await Promise.all([hiringRows(req.payload, user, tab, role), hiringCounts(req.payload, user, role), hiringRoles(req.payload, user), upcomingInterviews(req.payload, user)])
    : null;

  return (
    <AdminView {...props} roles={["hr"]}>
      {() =>
        data && (
          <>
            {emailConnected() ? null : <EmailBanner />}
            <HiringScreen tab={tab} role={role === null ? "" : String(role)} rows={data[0]} counts={data[1]} roles={data[2]} interviewsThisWeek={data[3].length} resumesStored={resumesStored()} />
          </>
        )
      }
    </AdminView>
  );
}
