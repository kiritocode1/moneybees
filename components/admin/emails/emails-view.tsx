import { headers } from "next/headers";
import type { AdminViewServerProps, Payload } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { ScreenIntro } from "@/components/admin/screen-intro";
import { CATALOGUE, type CatalogueEntry, catalogueEntry, SAMPLE_VALUES } from "@/emails";
import { renderEmail } from "@/emails/render";
import { ROLES } from "@/lib/backend/roles";
import { STARTER_TEMPLATES } from "@/lib/crm/starter-content";
import { fillTemplate, fillTemplateHtml } from "@/lib/crm/template";
import { siteDetails } from "@/lib/site/load-details";
import { EmailsScreen, type EntrySummary } from "./emails-screen";

/*
 * /admin/emails (payload.config.ts admin.components.views.emails): every
 * email Moneybee sends, drawn from its sample in emails/index.tsx with the
 * words its template holds in /admin right now, so staff and compliance read
 * exactly what goes out. ?email=<id> picks one.
 */

const STAFF = ROLES.filter((role) => role !== "integration");

/** The template row whose words an email uses: its starter's name first, else its purpose. */
async function templateFor(payload: Payload, entry: CatalogueEntry) {
  if (!entry.template) return null;
  const starter = STARTER_TEMPLATES[entry.template];
  const byName = await payload.find({ collection: "email-templates", where: { name: { equals: starter.name } }, limit: 1, depth: 0, overrideAccess: true });
  if (byName.docs[0]) return byName.docs[0];
  const byPurpose = await payload.find({ collection: "email-templates", where: { purpose: { equals: starter.purpose } }, limit: 1, depth: 0, overrideAccess: true });
  return byPurpose.docs[0] ?? null;
}

const summary = (entry: CatalogueEntry): EntrySummary => ({ id: entry.id, group: entry.group, name: entry.name, to: entry.to, when: entry.when, status: entry.status, needs: entry.needs, rule: entry.rule });

export async function EmailsView(props: AdminViewServerProps) {
  const head = await headers();
  const origin = `${head.get("x-forwarded-proto") ?? "https"}://${head.get("x-forwarded-host") ?? head.get("host")}`;
  const { payload } = props.initPageResult.req;
  const asked = typeof props.searchParams?.email === "string" ? props.searchParams.email : undefined;
  const entry = (asked && catalogueEntry(asked)) || CATALOGUE[0];

  const [site, template] = await Promise.all([siteDetails(), templateFor(payload, entry)]);
  const words = template ? { text: fillTemplate(template.body ?? "", SAMPLE_VALUES), html: template.html ? fillTemplateHtml(template.html, SAMPLE_VALUES) : null } : undefined;
  const sample = entry.sample(words, site);
  const { html, text } = await renderEmail(sample.element, origin);
  const subject = template ? fillTemplate(template.subject, SAMPLE_VALUES) : sample.subject;

  return (
    <AdminView {...props} roles={STAFF}>
      {() => (
        <div className="max-w-[1400px]">
          <h1 className="mt-8 text-display font-semibold tracking-[-0.01em] text-foreground">Emails</h1>
          <ScreenIntro screen="emails" />
          <EmailsScreen
            entries={CATALOGUE.map(summary)}
            selected={summary(entry)}
            subject={subject}
            html={html}
            text={text}
            template={template ? { name: template.name, href: `/admin/collections/email-templates/${template.id}` } : null}
          />
        </div>
      )}
    </AdminView>
  );
}
