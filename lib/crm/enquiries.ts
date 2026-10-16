import config from "@payload-config";
import { createElement } from "react";
import { type } from "arktype";
import { getPayload, type Payload, type Where } from "payload";
import { ENQUIRIES, type EnquiryField, PHONE } from "@/lib/contact-v2";
import { sendCrmEmail } from "@/lib/crm/mail";
import { enquiryReference } from "@/lib/crm/reference";
import { STARTER_TEMPLATES } from "@/lib/crm/starter-content";
import { siteDetails } from "@/lib/site/load-details";
import { dueIn, longDateTime, shortDateTime } from "@/emails/format";
import { EnquiryReceived } from "@/emails/prospects";
import { renderEmail } from "@/emails/render";
import { StaffNewEnquiry, staffNewEnquirySubject } from "@/emails/staff";
import { type EnquiryKind, ENQUIRY_KINDS, highest, type Reason, rulesSeverity, type Severity } from "@/lib/crm/severity";
import { fillTemplate, fillTemplateHtml } from "@/lib/crm/template";
import { askJev, raiseWithAi } from "@/lib/crm/triage";
import { ENQUIRY_KIND_LABELS } from "@/lib/crm/vocabulary";
import type { Contact, Enquiry, Playbook } from "@/payload-types";

/*
 * What happens when someone sends the /contact form (plan: "How a website
 * enquiry flows in"):
 *   1. the answers are checked against that tab's fields;
 *   2. the person is found by email, then phone, or created;
 *   3. the rules set a severity and say why (lib/crm/severity.ts);
 *   4. the first matching playbook sets the reply deadline;
 *   5. the enquiry and a timeline entry are written.
 * Then, after the visitor already has their answer (`followUp`): the
 * acknowledgement, the email to staff, and AI triage when its flag is on.
 */

export { enquiryReference };

const isEmail = type("string.email");
const MAX_MESSAGE = 4000;
const MAX_FIELD = 200;
/** More than this many enquiries from one connection in the window is refused. */
const RATE = { count: 5, windowMs: 10 * 60_000 };

export type Origin = { page?: string; utm?: Record<string, string>; visitorId?: string; ipHash?: string };
export type Received = { ok: true; id: number; reference: string; email: string } | { ok: false; error: string };

function readAnswers(kind: EnquiryKind, raw: Readonly<Record<string, unknown>>): { answers: Record<string, string> } | { error: string } {
  const form = ENQUIRIES.find((enquiry) => enquiry.id === kind);
  if (!form) return { error: "Choose what the enquiry is about." };
  const answers: Record<string, string> = {};
  for (const field of form.fields as readonly EnquiryField[]) {
    const value = typeof raw[field.name] === "string" ? (raw[field.name] as string).trim() : "";
    const limit = field.type === "textarea" ? MAX_MESSAGE : MAX_FIELD;
    if (field.required && !value) return { error: `Fill in ${field.label.toLowerCase()}.` };
    if (value.length > limit) return { error: `${field.label} is too long. Keep it under ${limit} characters.` };
    if (field.options && value && !field.options.includes(value)) return { error: `Choose one of the options for ${field.label.toLowerCase()}.` };
    if (value) answers[field.name] = value;
  }
  if (isEmail(answers.email) instanceof type.errors) return { error: "That email address doesn't look right." };
  return { answers };
}

/** The person this enquiry belongs to: same email, else same phone, else a new row. Fills gaps, never overwrites. */
async function matchContact(payload: Payload, answers: Record<string, string>): Promise<Contact> {
  const email = answers.email.toLowerCase();
  const phone = answers.phone?.replace(/[^\d+]/g, "");
  const or: Where[] = [{ email: { equals: email } }, ...(phone ? [{ phone: { equals: phone } }] : [])];
  const { docs } = await payload.find({ collection: "contacts", where: { or }, limit: 2, depth: 0, overrideAccess: true });
  const existing = docs.find((doc) => doc.email === email) ?? docs[0];
  if (!existing) {
    return payload.create({ collection: "contacts", overrideAccess: true, data: { name: answers.name, email, phone, city: answers.city, kind: "prospect", source: "website" } });
  }
  const gaps = { ...(!existing.phone && phone ? { phone } : {}), ...(!existing.city && answers.city ? { city: answers.city } : {}), ...(!existing.email ? { email } : {}) };
  return Object.keys(gaps).length ? payload.update({ collection: "contacts", id: existing.id, overrideAccess: true, data: gaps }) : existing;
}

/** True when the person holds a Moneybee product, or quoted a client code an investor account carries. */
async function isExistingInvestor(payload: Payload, contact: Contact, clientCode: string | undefined) {
  if (contact.kind === "investor" || contact.investor) return true;
  if (!clientCode) return false;
  const { totalDocs } = await payload.count({ collection: "investors", where: { clientCodes: { in: [clientCode.toUpperCase(), clientCode] } }, overrideAccess: true });
  return totalDocs > 0;
}

/** The first playbook, by order, whose kinds and severities include this enquiry. Empty lists match everything. */
export async function matchPlaybook(payload: Payload, kind: EnquiryKind, severity: Severity): Promise<Playbook | undefined> {
  const { docs } = await payload.find({ collection: "playbooks", sort: "order", limit: 100, depth: 0, overrideAccess: true });
  return docs.find((playbook) => (!playbook.kinds?.length || playbook.kinds.includes(kind)) && (!playbook.severities?.length || playbook.severities.includes(severity)));
}

/** Reply deadline: the playbook's hours, else the default for the severity in Desk settings. */
export async function replyDeadline(payload: Payload, from: Date, severity: Severity, playbook: Playbook | undefined) {
  const settings = await payload.findGlobal({ slug: "crm-settings", depth: 0, overrideAccess: true });
  const hours = playbook?.responseHours ?? settings.responseHours?.[severity] ?? 24;
  return new Date(from.getTime() + hours * 3_600_000);
}

export async function receiveEnquiry(kindInput: string, raw: Readonly<Record<string, unknown>>, origin: Origin): Promise<Received> {
  const kind = (ENQUIRY_KINDS as readonly string[]).includes(kindInput) ? (kindInput as EnquiryKind) : null;
  if (!kind) return { ok: false, error: "Choose what the enquiry is about." };
  const read = readAnswers(kind, raw);
  if ("error" in read) return { ok: false, error: read.error };
  const { answers } = read;

  const payload = await getPayload({ config });
  if (origin.ipHash) {
    const since = new Date(Date.now() - RATE.windowMs).toISOString();
    const { totalDocs } = await payload.count({ collection: "enquiries", where: { "origin.ipHash": { equals: origin.ipHash }, receivedAt: { greater_than: since } }, overrideAccess: true });
    if (totalDocs >= RATE.count) return { ok: false, error: `We've had several messages from this connection in the last few minutes. Try again shortly, or call ${PHONE}.` };
  }

  const contact = await matchContact(payload, answers);
  const existingInvestor = await isExistingInvestor(payload, contact, answers.client);
  const { severity, reasons } = rulesSeverity({ kind, answers, existingInvestor });
  const playbook = await matchPlaybook(payload, kind, severity);
  const receivedAt = new Date();
  const dueAt = await replyDeadline(payload, receivedAt, severity, playbook);

  const enquiry = await payload.create({
    collection: "enquiries",
    overrideAccess: true,
    data: {
      title: `${ENQUIRY_KIND_LABELS[kind]} enquiry from ${answers.name}`,
      contact: contact.id,
      kind,
      status: "new",
      severity,
      message: answers.message,
      answers,
      triage: { rules: reasons, existingInvestor },
      receivedAt: receivedAt.toISOString(),
      dueAt: dueAt.toISOString(),
      playbook: playbook?.id,
      origin: { page: origin.page, visitorId: origin.visitorId, utm: origin.utm, ipHash: origin.ipHash },
    },
  });

  await payload.create({
    collection: "activities",
    overrideAccess: true,
    data: { contact: contact.id, enquiry: enquiry.id, type: "form", summary: `Sent the ${ENQUIRY_KIND_LABELS[kind]} form`, body: answers.message, at: receivedAt.toISOString(), meta: { answers, page: origin.page } },
  });
  await payload.update({ collection: "contacts", id: contact.id, overrideAccess: true, data: { lastActivityAt: receivedAt.toISOString(), ...(origin.visitorId && !contact.visitorIds?.includes(origin.visitorId) ? { visitorIds: [...(contact.visitorIds ?? []), origin.visitorId] } : {}) } });

  return { ok: true, id: enquiry.id, reference: enquiryReference(enquiry.id), email: contact.email ?? answers.email };
}

const idOf = (value: number | { id: number } | null | undefined) => (value && typeof value === "object" ? value.id : value ?? undefined);

/**
 * The work after the visitor has their reference: AI triage (when on), the
 * acknowledgement, and the email to whoever should take it. Each step logs
 * its own failure, so one failing does not stop the rest.
 */
export async function followUp(enquiryId: number, options: { siteOrigin: string; aiTriage: boolean }) {
  const payload = await getPayload({ config });
  let enquiry: Enquiry = await payload.findByID({ collection: "enquiries", id: enquiryId, depth: 0, overrideAccess: true });
  const contact = await payload.findByID({ collection: "contacts", id: idOf(enquiry.contact) as number, depth: 0, overrideAccess: true });
  const answers = (enquiry.answers ?? {}) as Record<string, string>;
  const kind = enquiry.kind as EnquiryKind;
  const settings = await payload.findGlobal({ slug: "crm-settings", depth: 0, overrideAccess: true });

  if (options.aiTriage) {
    try {
      const triage = (enquiry.triage ?? {}) as { rules?: Reason[]; existingInvestor?: boolean };
      const ai = await askJev({ kind, answers, existingInvestor: Boolean(triage.existingInvestor) });
      const raised = raiseWithAi(enquiry.severity as Severity, ai, settings.ai?.triageConfidence ?? 0.7, Boolean(triage.existingInvestor));
      const severity = highest(enquiry.severity as Severity, raised.severity);
      const changed = severity !== enquiry.severity;
      const playbook = changed ? await matchPlaybook(payload, kind, severity) : undefined;
      const dueAt = changed ? await replyDeadline(payload, new Date(enquiry.receivedAt), severity, playbook) : undefined;
      enquiry = await payload.update({
        collection: "enquiries",
        id: enquiry.id,
        overrideAccess: true,
        data: {
          triage: { ...triage, ai, rules: [...(triage.rules ?? []), ...raised.reasons] },
          ...(changed ? { severity, playbook: playbook?.id ?? null, ...(dueAt && (!enquiry.dueAt || dueAt < new Date(enquiry.dueAt)) ? { dueAt: dueAt.toISOString() } : {}) } : {}),
        },
      });
    } catch (error) {
      payload.logger.error({ err: error, msg: "AI triage failed; the rules' severity stands", enquiryId });
    }
  }

  const site = await siteDetails();
  const answered = answersFor(kind, answers).filter(({ label }) => label !== "Message");

  if (settings.acknowledge !== false && contact.email) {
    try {
      const template = (await payload.find({ collection: "email-templates", where: { purpose: { equals: "enquiry_ack" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] ?? STARTER_TEMPLATES.enquiryAck;
      const reference = enquiryReference(enquiry.id);
      const values = { firstName: contact.name.split(/\s+/)[0], name: contact.name, reference, replyBy: enquiry.dueAt ? longDateTime(enquiry.dueAt) : "the next working day" };
      const words = { text: fillTemplate(template.body ?? "", values), html: "html" in template && template.html ? fillTemplateHtml(template.html, values) : null };
      const email = await renderEmail(
        createElement(EnquiryReceived, { name: contact.name, reference, kind, receivedAt: shortDateTime(enquiry.receivedAt), replyBy: enquiry.dueAt ? shortDateTime(enquiry.dueAt) : undefined, answers: answered, message: enquiry.message ?? undefined, words, site }),
        options.siteOrigin,
      );
      await sendCrmEmail(payload, { to: contact.email, subject: fillTemplate(template.subject, values), ...email, words: words.text, contact: contact.id, enquiry: enquiry.id, summary: "Acknowledgement" });
    } catch (error) {
      payload.logger.error({ err: error, msg: "Acknowledgement failed", enquiryId });
    }
  }

  try {
    const playbook = enquiry.playbook ? await payload.findByID({ collection: "playbooks", id: idOf(enquiry.playbook) as number, depth: 0, overrideAccess: true }) : undefined;
    const roles = playbook?.handlerRoles?.length ? playbook.handlerRoles : ["sales", "operations", "compliance"];
    const { docs: staff } = await payload.find({ collection: "users", where: { roles: { in: [...roles, "admin"] } }, limit: 50, depth: 0, overrideAccess: true });
    const triage = (enquiry.triage ?? {}) as { rules?: Reason[]; existingInvestor?: boolean };
    const reference = enquiryReference(enquiry.id);
    const severity = enquiry.severity as Severity;
    const due = new Date(enquiry.dueAt ?? Date.now());
    if (staff.length) {
      const email = await renderEmail(
        createElement(StaffNewEnquiry, {
          reference,
          title: enquiry.title,
          severity,
          replyBy: dueIn(due),
          receivedAt: shortDateTime(enquiry.receivedAt),
          contact: [
            // The person's own answers, phone as they typed it; the name is already in the title.
            ...answered.filter(({ label }) => !/\bname\b/i.test(label)),
            { label: "Existing relationship", value: triage.existingInvestor ? "Already a Moneybee investor." : `None. First contact${enquiry.origin?.page ? `, from ${enquiry.origin.page}` : ""}.` },
          ],
          message: enquiry.message ?? undefined,
          reasons: (triage.rules ?? []).map((reason) => reason.why),
          playbook: playbook ? { name: playbook.name, steps: (playbook.steps ?? []).map((step) => step.step) } : undefined,
          href: `/admin/inbox/${enquiry.id}`,
          roleLabel: roles.map((role) => role[0].toUpperCase() + role.slice(1)).join(" or "),
        }),
        options.siteOrigin,
      );
      await payload.sendEmail({ to: staff.map((user) => user.email), subject: staffNewEnquirySubject({ severity, title: enquiry.title, replyBy: shortDateTime(due).split(", ").at(-1) ?? "" }), ...email });
    }
  } catch (error) {
    payload.logger.error({ err: error, msg: "Staff notification failed", enquiryId });
  }
}

/** The answers as label and value pairs in the form's order, for the admin and emails. */
export function answersFor(kind: EnquiryKind, answers: Readonly<Record<string, string>>) {
  const form = ENQUIRIES.find((enquiry) => enquiry.id === kind);
  return ((form?.fields ?? []) as readonly EnquiryField[]).filter((field) => answers[field.name]).map((field) => ({ label: field.label, value: answers[field.name] }));
}
