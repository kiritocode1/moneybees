import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { EmailBanner } from "@/components/admin/email-banner";
import { hasRole } from "@/lib/backend/roles";
import { applicantDetail } from "@/lib/hiring/desk";
import { ApplicantScreen } from "./applicant-screen";

/** /admin/hiring/:id: one application with its resume, answers, interviews, emails and every action on it. */
export async function ApplicantView(props: AdminViewServerProps) {
  const { req } = props.initPageResult;
  const segments = props.params?.segments;
  const id = Number(Array.isArray(segments) ? segments[1] : undefined);
  const user = req.user?.collection === "users" && hasRole(req.user, "hr") ? req.user : null;
  const detail = user && Number.isInteger(id) ? await applicantDetail(req.payload, user, id) : null;

  return (
    <AdminView {...props} roles={["hr"]}>
      {() =>
        detail ? (
          <>
            {detail.emailConnected ? null : <EmailBanner />}
            <ApplicantScreen applicant={detail} />
          </>
        ) : (
          <p className="mt-10 text-body text-muted-foreground">There is no application with this number. It may have been deleted.</p>
        )
      }
    </AdminView>
  );
}
