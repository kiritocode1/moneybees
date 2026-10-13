import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { SeverityBadge } from "@/components/admin/severity-badge";
import { CRM_ROLES, hasRole, ROLES } from "@/lib/backend/roles";
import { istDateTime, relative } from "@/lib/crm/format";
import { inboxRows } from "@/lib/crm/inbox";
import type { User } from "@/payload-types";

/*
 * /admin's home, in place of Payload's collection grid
 * (payload.config.ts admin.components.views.dashboard). It shows only what
 * is waiting on the person signed in, by role: enquiries for the CRM roles,
 * fact sheets to approve for compliance. Payload's sidebar still lists every
 * collection for plain record editing.
 */

async function load(props: AdminViewServerProps, user: User) {
  const { payload } = props.initPageResult.req;
  const now = new Date();
  const crm = hasRole(user, ...CRM_ROLES);
  const [urgent, mine, tasks, toApprove] = await Promise.all([
    crm ? inboxRows(payload, user, "waiting", now) : null,
    crm ? payload.count({ collection: "enquiries", where: { assignee: { equals: user.id }, status: { in: ["new", "open"] } }, user, overrideAccess: false }) : null,
    crm ? payload.find({ collection: "tasks", where: { owner: { equals: user.id }, doneAt: { exists: false } }, sort: "dueAt", limit: 8, depth: 1, user, overrideAccess: false }) : null,
    hasRole(user, "compliance") ? payload.count({ collection: "fact-sheets", where: { status: { equals: "in_review" } }, user, overrideAccess: false }) : null,
  ]);
  return { now, urgent, mine: mine?.totalDocs ?? null, tasks: tasks?.docs ?? null, toApprove: toApprove?.totalDocs ?? null };
}

function Stat({ label, value, href, tone }: { label: string; value: number; href: string; tone?: "alert" }) {
  return (
    <Link href={href} className="block rounded-xl border bg-card p-4 no-underline transition-colors hover:bg-accent/40">
      <span className="block text-caption text-muted-foreground">{label}</span>
      <span className={`mt-1 block text-display font-semibold tabular-nums ${tone === "alert" && value > 0 ? "text-destructive" : "text-foreground"}`}>{value}</span>
    </Link>
  );
}

export async function TodayView(props: AdminViewServerProps) {
  const user = props.initPageResult.req.user;
  const data = user?.collection === "users" ? await load(props, user) : null;

  return (
    <AdminView {...props} roles={ROLES} framed={false}>
      {(staff) =>
        data && (
          <>
            <header className="mt-8 mb-6">
              <h1 className="text-display font-semibold tracking-[-0.01em] text-foreground">Today</h1>
              <p className="mt-1 text-body text-muted-foreground">
                {data.now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" })}, signed in as {staff.name}
              </p>
            </header>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
              {data.urgent ? <Stat label="Enquiries waiting on us" value={data.urgent.length} href="/admin/inbox" /> : null}
              {data.urgent ? <Stat label="Past their reply time" value={data.urgent.filter((row) => row.overdue).length} href="/admin/inbox" tone="alert" /> : null}
              {data.mine !== null ? <Stat label="Taken by you" value={data.mine} href="/admin/inbox?tab=mine" /> : null}
              {data.toApprove !== null ? <Stat label="Fact sheets to approve" value={data.toApprove} href="/admin/collections/fact-sheets?where[status][equals]=in_review" /> : null}
            </div>

            {data.urgent && data.urgent.length > 0 ? (
              <section className="mt-10">
                <div className="mb-3 flex items-center justify-between border-b pb-2">
                  <h2 className="text-title font-semibold text-foreground">Most urgent</h2>
                  <Link href="/admin/inbox" className="text-caption text-muted-foreground hover:text-foreground">
                    All enquiries
                  </Link>
                </div>
                <ul className="m-0 grid list-none p-0">
                  {data.urgent.slice(0, 6).map((row) => (
                    <li key={row.id}>
                      <Link href={`/admin/inbox/${row.id}`} className="grid grid-cols-[110px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2.5 no-underline hover:bg-accent/40">
                        <span className="justify-self-start">
                          <SeverityBadge severity={row.severity} size="compact" />
                        </span>
                        <span className="truncate text-body text-foreground">
                          {row.name}
                          <span className="text-muted-foreground">
                            , {row.kindLabel}
                            {row.detail ? `, ${row.detail}` : ""}
                          </span>
                        </span>
                        <span className={`text-caption tabular-nums ${row.overdue ? "text-destructive" : "text-muted-foreground"}`} title={row.dueAt ? istDateTime(row.dueAt) : undefined}>
                          {row.dueAt ? (row.overdue ? `Overdue ${relative(row.dueAt, data.now).replace(" ago", "")}` : `Reply ${relative(row.dueAt, data.now)}`) : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {data.tasks && data.tasks.length > 0 ? (
              <section className="mt-10">
                <h2 className="mb-3 border-b pb-2 text-title font-semibold text-foreground">Your follow-ups</h2>
                <ul className="m-0 grid list-none gap-1 p-0">
                  {data.tasks.map((task) => (
                    <li key={task.id} className="flex items-baseline justify-between gap-3 px-2 py-1.5 text-body">
                      <span className="text-foreground">{task.title}</span>
                      <span className={`text-caption tabular-nums ${new Date(task.dueAt) < data.now ? "text-destructive" : "text-muted-foreground"}`}>{istDateTime(task.dueAt)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )
      }
    </AdminView>
  );
}
