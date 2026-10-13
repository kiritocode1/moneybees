import type { Payload, PayloadRequest } from "payload";
import { Resend } from "resend";
import type { User } from "@/payload-types";
import { DEFAULT_DETAILS } from "@/lib/site/details";

/*
 * Every CRM email goes through `sendCrmEmail`: it writes the Emails row first,
 * sends through Resend when RESEND_API_KEY is set, and puts the email on the
 * person's timeline. Without a key (while building) the row is kept with the
 * status "logged" and nothing leaves the machine. Resend only sends; the
 * record of who was written to stays in Postgres (user, 2026-10-12).
 */

const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS ?? "info@moneybee.in";

/** The footer line, from Office details in /admin: "Moneybee Group, 303, Tower A, ... Mumbai 400013". */
async function officeLine(payload: Payload) {
  const saved = await payload.findGlobal({ slug: "site-details", depth: 0, overrideAccess: true });
  const { officeName, address } = saved.updatedAt ? saved : DEFAULT_DETAILS;
  return `${officeName}, ${address.line1} ${address.line2}`;
}

let client: Resend | null | undefined;
const resend = () => (client === undefined ? (client = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null) : client);

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain text to the HTML part: a blank line is a new paragraph, the office address in the footer. */
function emailHtml(text: string, office: string) {
  const paragraphs = text
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 16px">${escape(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#ffffff"><div style="max-width:560px;margin:0 auto;padding:32px 24px;font:15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111111">${paragraphs}<p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #e5e5e5;font-size:12px;color:#737373">${escape(office)}</p></div></body></html>`;
}

export type CrmEmail = {
  to: string;
  subject: string;
  text: string;
  /** Designed HTML from the template editor; without it the text goes out in Moneybee's plain layout. */
  html?: string;
  contact?: number;
  enquiry?: number;
  sentBy?: Pick<User, "id" | "name" | "email">;
  /** Shown on the timeline, e.g. "Acknowledgement sent". Defaults to the subject. */
  summary?: string;
};

/** Sends one email, records it, and returns the Emails row id. A Resend failure is recorded, not thrown. */
export async function sendCrmEmail(payload: Payload, email: CrmEmail, req?: Partial<PayloadRequest>) {
  const fromName = email.sentBy ? `${email.sentBy.name} at Moneybee` : "Moneybee";
  const from = `${fromName} <${FROM_ADDRESS}>`;
  const row = await payload.create({
    collection: "emails",
    overrideAccess: true,
    req,
    data: { direction: "out", status: resend() ? "queued" : "logged", from, to: email.to, subject: email.subject, text: email.text, contact: email.contact, enquiry: email.enquiry, sentBy: email.sentBy?.id },
  });

  let status: "sent" | "failed" | "logged" = "logged";
  const api = resend();
  if (api) {
    const { data, error } = await api.emails.send({
      from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html ?? emailHtml(email.text, await officeLine(payload)),
      // Replies go to the sender's own inbox until inbound mail is set up on a Moneybee domain.
      replyTo: email.sentBy?.email ?? FROM_ADDRESS,
      tags: [{ name: "email_id", value: String(row.id) }],
    });
    status = error ? "failed" : "sent";
    await payload.update({ collection: "emails", id: row.id, overrideAccess: true, req, data: { status, resendId: data?.id ?? null } });
    if (error) payload.logger.error({ msg: "Resend refused an email", emailId: row.id, error: error.message });
  } else {
    payload.logger.info({ msg: "Email logged, not sent (no RESEND_API_KEY)", to: email.to, subject: email.subject });
  }

  if (email.contact) {
    await payload.create({
      collection: "activities",
      overrideAccess: true,
      req,
      data: { contact: email.contact, enquiry: email.enquiry, type: "email_out", at: new Date().toISOString(), summary: email.summary ?? email.subject, body: email.text, email: row.id, actor: email.sentBy?.id, meta: { status } },
    });
  }
  return row.id;
}
