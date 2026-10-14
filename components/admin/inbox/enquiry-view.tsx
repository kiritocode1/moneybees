import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { EmailBanner } from "@/components/admin/email-banner";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import { enquiryDetail } from "@/lib/crm/enquiry-detail";
import { EnquiryScreen } from "./enquiry-screen";

/** /admin/inbox/:id: one enquiry with its playbook, the person's timeline and every action on it. */
export async function EnquiryView(props: AdminViewServerProps) {
  const { req } = props.initPageResult;
  const segments = props.params?.segments;
  const id = Number(Array.isArray(segments) ? segments[1] : undefined);
  const user = req.user?.collection === "users" && hasRole(req.user, ...CRM_ROLES) ? req.user : null;
  const detail = user && Number.isInteger(id) ? await enquiryDetail(req.payload, user, id) : null;

  return (
    <AdminView {...props} roles={CRM_ROLES}>
      {() =>
        detail ? (
          <>
            {detail.emailConnected ? null : <EmailBanner />}
            <EnquiryScreen enquiry={detail} />
          </>
        ) : (
          <p className="mt-10 text-body text-muted-foreground">There is no enquiry with this number.</p>
        )
      }
    </AdminView>
  );
}
