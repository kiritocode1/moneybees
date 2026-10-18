import { type } from "arktype";
import type { Payload } from "payload";
import { createElement } from "react";
import { chartRows, emailRows } from "@/emails/disclosures";
import { longDateTime } from "@/emails/format";
import { AIF_CHECKLIST, AifIntroduction, Checklist, Letter, MeetingConfirmation, MeetingFollowUp, PMS_CHECKLIST, PmsIntroduction } from "@/emails/prospects";
import { renderEmail } from "@/emails/render";
import { enquiryReference } from "@/lib/crm/reference";
import { fillTemplate } from "@/lib/crm/template";
import { AIF_PRODUCT } from "@/lib/insights";
import { directionsHref } from "@/lib/site/details";
import { pmsFigures } from "@/lib/site/figures";
import { siteDetails } from "@/lib/site/load-details";
import { dayMonthYear } from "@/lib/site/tokens";
import type { Contact, Enquiry, Media, User } from "@/payload-types";

/*
 * A reply to an enquiry, drawn as the email its template's purpose calls for
 * (lib/crm/vocabulary.ts TEMPLATE_PURPOSES): a plain letter, the PMS or
 * Flyingbee introduction, a meeting confirmation or follow-up, or an account
 * checklist. The composer's Preview and Send both come through here, so what
 * staff read is what goes.
 */

export const ReplyInput = type({
  subject: "1 <= string <= 200",
  body: "1 <= string <= 20000",
  "purpose?": "string <= 40",
  "meeting?": { when: "1 <= string <= 120", where: "1 <= string <= 300", "link?": "string <= 500", with: "1 <= string <= 200" },
  "followUp?": { meetingOn: "1 <= string <= 60", steps: "string <= 4000" },
  /** Files it carries, by lib/files/library.ts ref. */
  "attachments?": "string[] <= 10",
});
export type ReplyDraft = typeof ReplyInput.infer;

/** The title over a plain reply, by the form the enquiry came from. */
const REPLY_TITLES = { pms: "Your PMS enquiry", aif: "Your Flyingbee enquiry", support: "Your request to Moneybee", general: "Your enquiry" } as const;

const lines = (text: string) => text.split("\n").map((line) => line.trim()).filter(Boolean);

/** The latest approved PMS fact sheet's PDF and the Disclosure Document card, linked from the introduction. */
async function pmsDocuments(payload: Payload, asOf: string) {
  const [sheets, dd] = await Promise.all([
    payload.find({ collection: "fact-sheets", where: { status: { equals: "published" }, "product.slug": { equals: "moneybee-pms" } }, sort: "-asOf", limit: 1, depth: 1, overrideAccess: true }),
    payload.find({ collection: "documents", where: { title: { like: "Disclosure Document" } }, limit: 1, depth: 1, overrideAccess: true }),
  ]);
  const pdf = sheets.docs[0]?.pdf as Media | number | null | undefined;
  const card = dd.docs[0];
  const ddFile = card?.file as Media | number | null | undefined;
  const month = new Date(asOf).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  return [
    { name: `Moneybee PMS fact sheet, ${month}`, note: "PDF", href: (typeof pdf === "object" && pdf?.url) || "/investor-centre" },
    { name: "Disclosure Document", note: "PDF. Please read it, in particular the risk factors, before investing.", href: (typeof ddFile === "object" && ddFile?.url) || card?.link || "/investor-centre" },
  ];
}

export async function buildReply(payload: Payload, user: User, enquiry: Enquiry, contact: Contact, draft: ReplyDraft, origin: string) {
  const reference = enquiryReference(enquiry.id);
  const values = { firstName: contact.name.split(/\s+/)[0], name: contact.name, reference, senderName: user.name, replyBy: enquiry.dueAt ? longDateTime(enquiry.dueAt) : undefined, meetingAt: draft.meeting?.when, meetingOn: draft.followUp?.meetingOn };
  const words = { text: fillTemplate(draft.body, values) };
  const subject = fillTemplate(draft.subject, values);
  const sender = { name: user.name, email: user.email };
  const site = await siteDetails();
  const base = { name: contact.name, reference, words, sender, site };
  const onboarding = site.desks.find((desk) => /onboarding/i.test(desk.label))?.email ?? site.email;

  const element = await (async () => {
    switch (draft.purpose) {
      case "pms_introduction": {
        const figures = await pmsFigures();
        return createElement(PmsIntroduction, { ...base, asOf: figures.asOf, rows: emailRows(figures.rows), chart: chartRows(figures.rows), documents: await pmsDocuments(payload, figures.asOf) });
      }
      case "aif_introduction":
        return createElement(AifIntroduction, { ...base, terms: AIF_PRODUCT.terms });
      case "meeting_confirmation": {
        const meeting = draft.meeting ?? { when: "[When]", where: "[Where]", with: user.name };
        const office = `${site.address.line1} ${site.address.line2}`;
        const place = meeting.link ? ({ kind: "video", href: meeting.link, label: meeting.where } as const) : ({ kind: "office", address: meeting.where, mapHref: meeting.where === office ? directionsHref(site) : undefined } as const);
        return createElement(MeetingConfirmation, { ...base, when: meeting.when, place, attendees: meeting.with, agenda: ["How we choose companies, and how the portfolio is built.", "Fees, reporting and how your account is held.", "Your questions."] });
      }
      case "follow_up":
        return createElement(MeetingFollowUp, { ...base, meetingOn: draft.followUp?.meetingOn ?? dayMonthYear(new Date().toISOString()), nextSteps: lines(draft.followUp?.steps ?? ""), documents: [] });
      case "pms_checklist":
        return createElement(Checklist, { ...base, product: "pms", sendTo: onboarding, ...PMS_CHECKLIST });
      case "aif_checklist":
        return createElement(Checklist, { ...base, product: "aif", sendTo: onboarding, ...AIF_CHECKLIST });
      default:
        return createElement(Letter, {
          ...base,
          eyebrow: "Reply to your enquiry",
          title: REPLY_TITLES[enquiry.kind as keyof typeof REPLY_TITLES] ?? "Your enquiry",
          reason: `You are receiving this email in reply to your enquiry ${reference}.`,
          original: enquiry.message ? { label: `Your enquiry of ${dayMonthYear(enquiry.receivedAt)}`, message: enquiry.message } : undefined,
        });
    }
  })();

  return { subject, words: words.text, ...(await renderEmail(element, origin)) };
}
