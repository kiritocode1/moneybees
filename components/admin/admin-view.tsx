import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import type { ReactNode } from "react";
import { hasRole, type Role } from "@/lib/backend/roles";
import type { User } from "@/payload-types";

type Props = AdminViewServerProps & {
  /** Staff roles that may open the screen. Admin always may. */
  roles: readonly Role[];
  /** False for the dashboard, which Payload already draws inside its template. */
  framed?: boolean;
  children: (user: User) => ReactNode;
};

/**
 * Every screen we add to /admin goes through this: Payload's own nav and
 * header around it, a signed-in staff member required, and `.fluid` so
 * Fluid Functionalism's styles apply inside (components/admin/admin.css).
 */
export function AdminView({ initPageResult, params, searchParams, roles, framed = true, children }: Props) {
  const { req, locale, permissions, visibleEntities } = initPageResult;
  const user = req.user;
  if (user?.collection !== "users") redirect("/admin/login");

  const body = (
    <Gutter>
      <div className="fluid pb-16">
        {hasRole(user, ...roles) ? (
          children(user)
        ) : (
          <p className="mt-10 text-body text-muted-foreground">Your account does not have access to this screen. An admin can add the role it needs.</p>
        )}
      </div>
    </Gutter>
  );
  if (!framed) return body;

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user}
      visibleEntities={visibleEntities}
    >
      {body}
    </DefaultTemplate>
  );
}
