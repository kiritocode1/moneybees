import { headers } from "next/headers";
import type { AdminViewServerProps } from "payload";
import { AdminView } from "@/components/admin/admin-view";
import { ScreenIntro } from "@/components/admin/screen-intro";
import { CATALOGUE, CHANNEL_LABELS, type CatalogueEntry, catalogueEntry, compose, mergeFields } from "@/emails";
import { renderEmail } from "@/emails/render";
import { siteOf } from "@/emails/request";
import { CRM_ROLES, hasRole, ROLES } from "@/lib/backend/roles";
import { templateRow } from "@/lib/crm/email-template-row";
import { describeGoesWith, goesWithFiles } from "@/lib/files/library";
import { STARTER_TEMPLATES } from "@/lib/crm/starter-content";
import { siteDetails } from "@/lib/site/load-details";
import { EmailsScreen, type EntrySummary, type SelectedEmail } from "./emails-screen";

/*
 * /admin/emails (payload.config.ts admin.components.views.emails), the one
 * page for Moneybee's emails (plan .plannotator/email-templates/merge): every
 * email as the reader gets it, its words edited beside it, and the letters
 * operations sends to one person sent from here. The words live in Email
 * templates, which is off the sidebar; ?email=<id> picks one.
 */

const STAFF = ROLES.filter((role) => role !== "integration");

const summary = (entry: CatalogueEntry): EntrySummary => ({ id: entry.id, group: entry.group, name: entry.name, channel: entry.channel, channelLabel: CHANNEL_LABELS[entry.channel] });

export async function EmailsView(props: AdminViewServerProps) {
  const head = await headers();
  const { payload, user } = props.initPageResult.req;
  const asked = typeof props.searchParams?.email === "string" ? props.searchParams.email : undefined;
  const entry = (asked && catalogueEntry(asked)) || CATALOGUE[0];

  const [site, row] = await Promise.all([siteDetails(), templateRow(payload, entry)]);
  const email = compose(entry, { template: row ? { subject: row.subject, body: row.body ?? "", html: row.html } : null, site });
  const { html, text } = await renderEmail(email.element, siteOf(head));
  const starter = entry.template ? STARTER_TEMPLATES[entry.template] : null;
  const staff = user?.collection === "users" ? user : null;
  // What the letter goes with: the rules as saved, and today's files for a send from here.
  const saved = row?.goesWith ?? [];
  const [goesWith, attached] = staff && starter ? await Promise.all([describeGoesWith(payload, staff, saved), goesWithFiles(payload, staff, saved)]) : [[], []];

  const selected: SelectedEmail = {
    ...summary(entry),
    to: entry.to,
    when: entry.when,
    rule: entry.rule ?? null,
    needs: entry.needs ?? null,
    fields: entry.fields ?? [],
    merge: mergeFields(entry),
    words: starter ? { subject: row?.subject ?? starter.subject, body: row?.body ?? starter.body, designed: Boolean(row?.html) } : null,
    canEdit: Boolean(starter) && hasRole(staff, "compliance", "hr"),
    canSend: entry.channel === "here" && hasRole(staff, ...CRM_ROLES),
    goesWith,
    goesWithFiles: attached.filter((file) => file.attachable),
  };

  return (
    <AdminView {...props} roles={STAFF}>
      {() => (
        <div className="max-w-[1560px]">
          <h1 className="mt-8 text-display font-semibold tracking-[-0.01em] text-foreground">Emails</h1>
          <ScreenIntro screen="emails" />
          <EmailsScreen key={entry.id} entries={CATALOGUE.map(summary)} selected={selected} subject={email.subject} html={html} text={text} />
        </div>
      )}
    </AdminView>
  );
}
