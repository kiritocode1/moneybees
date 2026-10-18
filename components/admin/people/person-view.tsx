import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { EmailBanner } from "@/components/admin/email-banner";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { personDetail } from "@/lib/crm/person-detail";
import { fileItem } from "@/lib/files/library";
import { PersonScreen } from "./person-screen";

/**
 * /admin/people/:id: one person, everything that has happened with them,
 * and everything to do next. `?attach=<file ref>` (Send to someone on the
 * Files screen) opens a letter to them with that file attached;
 * `?task=<id>` (Write on an email task) opens the task's letter, and
 * sending it ticks the task; `?letter=<Emails page id>` opens that letter
 * with its `f.<field>` values filled in (a deal moved to Meeting or
 * Invested, components/admin/deals/move-dialog.tsx).
 */
export async function PersonView(props: AdminViewServerProps) {
  const { req } = props.initPageResult;
  const segments = props.params?.segments;
  const id = Number(Array.isArray(segments) ? segments[1] : undefined);
  const user = req.user?.collection === "users" && hasRole(req.user, ...CRM_ROLES) ? req.user : null;
  const detail = user && Number.isInteger(id) ? await personDetail(req.payload, user, id) : null;
  const asked = typeof props.searchParams?.attach === "string" ? props.searchParams.attach : null;
  const attach = user && detail?.email && asked ? await fileItem(req.payload, user, asked) : null;
  const taskId = Number(typeof props.searchParams?.task === "string" ? props.searchParams.task : NaN);
  const found = user && detail && Number.isInteger(taskId) ? await req.payload.findByID({ collection: "tasks", id: taskId, depth: 0, user, overrideAccess: false, disableErrors: true }) : null;
  const task = found && !found.doneAt && (typeof found.contact === "object" ? found.contact?.id : found.contact) === detail?.id ? { id: found.id, title: found.title, letter: found.letter ?? null } : null;
  const params = props.searchParams ?? {};
  const opening =
    !task && detail?.email && typeof params.letter === "string"
      ? { letter: params.letter, fill: Object.fromEntries(Object.entries(params).flatMap(([key, value]) => (key.startsWith("f.") && typeof value === "string" ? [[key.slice(2), value.slice(0, 300)]] : []))) }
      : null;

  return (
    <AdminView {...props} roles={CRM_ROLES}>
      {() =>
        detail ? (
          <>
            {detail.emailConnected ? null : <EmailBanner />}
            {/* A new ?task=, ?letter= or ?attach= on the same person opens the composer afresh. */}
            <PersonScreen key={[task?.id, opening?.letter, attach?.ref].join("|")} person={detail} attach={attach?.attachable ? attach : null} task={task} opening={opening} />
          </>
        ) : (
          <p className="mt-10 text-body text-muted-foreground">There is no one with this number in People.</p>
        )
      }
    </AdminView>
  );
}
