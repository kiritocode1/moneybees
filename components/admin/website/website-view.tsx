import { BriefcaseBusiness, Building2, ChartColumn, FileText, type LucideIcon, Users } from "lucide-react";
import Link from "next/link";
import type { AdminViewServerProps, Payload } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { Badge } from "@/components/fluid/badge";
import { LinkButton } from "@/components/admin/link-button";
import { editorHref, pagePicture, SITE_PAGES, type SitePage } from "@/lib/pages/site-pages";

/*
 * /admin/website (payload.config.ts admin.components.views.website), the
 * Website group's first link (admin-ergonomics plan A): a card per editable
 * page with a still of its top, whether it has unpublished changes, and View
 * and Edit; then the lists several pages share, with a count and an amber
 * badge when something needs doing.
 */

const ROLES = ["editor", "compliance", "hr"] as const;

/** True when the page's newest version is a draft, so the site is behind the editor. */
async function hasChanges(payload: Payload, page: SitePage) {
  const latest = await payload.findGlobal({ slug: page.slug, draft: true, depth: 0, overrideAccess: true });
  return latest._status === "draft";
}

function PageCard({ page, changed }: { page: SitePage; changed: boolean }) {
  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      <Link href={editorHref(page)} className="block border-b" tabIndex={-1} aria-hidden="true">
        <img src={pagePicture(page)} alt="" className="block aspect-[16/10] w-full object-cover object-top" />
      </Link>
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate text-title font-semibold text-foreground">{page.name}</h2>
          <Badge variant="dot" color={changed ? "amber" : "green"} size="compact" className="shrink-0">
            {changed ? "Unpublished changes" : "Published"}
          </Badge>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="truncate text-caption text-muted-foreground">{page.path}</span>
          <span className="flex shrink-0 gap-1">
            <LinkButton href={page.path} external icon="eye" variant="ghost">
              View<span className="sr-only"> {page.name} on the site</span>
            </LinkButton>
            <LinkButton href={editorHref(page)} icon="pencil" variant="primary">
              Edit<span className="sr-only"> {page.name}</span>
            </LinkButton>
          </span>
        </div>
      </div>
    </article>
  );
}

type Shared = { icon: LucideIcon; name: string; href: string; line: string; warning?: string };

function SharedCard({ icon: Icon, name, href, line, warning }: Shared) {
  return (
    <article className="flex flex-col gap-2 rounded-xl border bg-card p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted">
          <Icon aria-hidden="true" className="h-4 w-4 text-foreground" />
        </span>
        {warning ? (
          <Badge variant="dot" color="amber" size="compact">
            {warning}
          </Badge>
        ) : null}
      </div>
      <h3 className="text-title font-semibold text-foreground">{name}</h3>
      <p className="-mt-1 text-caption text-muted-foreground">{line}</p>
      <LinkButton href={href} className="mt-1 self-start">
        Open<span className="sr-only"> {name}</span>
      </LinkButton>
    </article>
  );
}

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

export async function WebsiteView(props: AdminViewServerProps) {
  const { payload } = props.initPageResult.req;
  const count = async (collection: "team-members" | "documents" | "case-studies" | "openings", where?: Parameters<Payload["count"]>[0]["where"]) =>
    (await payload.count({ collection, where, overrideAccess: true })).totalDocs;
  const [changes, team, documents, unfiled, studies, roles, samples] = await Promise.all([
    Promise.all(SITE_PAGES.map((page) => hasChanges(payload, page))),
    count("team-members"),
    count("documents"),
    count("documents", { and: [{ file: { exists: false } }, { or: [{ link: { exists: false } }, { link: { equals: "" } }] }] }),
    count("case-studies"),
    count("openings"),
    count("openings", { status: { equals: "sample" } }),
  ]);

  const shared: Shared[] = [
    { icon: Users, name: "Team", href: "/admin/collections/team-members", line: plural(team, "person", "people") },
    {
      icon: FileText,
      name: "Documents",
      href: "/admin/collections/documents",
      line: plural(documents, "card", "cards"),
      warning: unfiled ? `${unfiled} without a file` : undefined,
    },
    {
      icon: BriefcaseBusiness,
      name: "Openings",
      href: "/admin/collections/openings",
      line: plural(roles, "role", "roles"),
      warning: samples === 0 ? undefined : samples === roles ? "All samples" : plural(samples, "sample", "samples"),
    },
    { icon: ChartColumn, name: "Case studies", href: "/admin/collections/case-studies", line: plural(studies, "company", "companies") },
    { icon: Building2, name: "Office details", href: "/admin/globals/site-details", line: "Phone, email, address" },
  ];

  return (
    <AdminView {...props} roles={ROLES}>
      {() => (
        <div className="max-w-[1320px]">
          <h1 className="mt-8 text-display font-semibold tracking-[-0.01em] text-foreground">Website</h1>
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {SITE_PAGES.map((page, index) => (
              <PageCard key={page.slug} page={page} changed={changes[index]} />
            ))}
          </div>
          <h2 className="mt-10 text-title font-semibold text-foreground">Shared by several pages</h2>
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
            {shared.map((item) => (
              <SharedCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      )}
    </AdminView>
  );
}
