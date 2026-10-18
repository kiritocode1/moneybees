import type { Payload, PayloadRequest } from "payload";
import { Resend } from "resend";
import type { User } from "@/payload-types";

/*
 * Every CRM email goes through `sendCrmEmail`: it writes the Emails row first,
 * sends through Resend when RESEND_API_KEY is set, and puts the email on the
 * person's timeline. Without a key (while building) the row is kept with the
 * status "logged" and nothing leaves the machine. Resend only sends; the
 * record of who was written to stays in Postgres (user, 2026-10-12). The
 * email itself is drawn by a component in emails/ and rendered by the caller.
 */

const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS ?? "info@moneybee.in";

/** False while RESEND_API_KEY is unset: emails are saved with the status "logged" and nobody receives them. */
export const emailConnected = () => Boolean(process.env.RESEND_API_KEY);

let client: Resend | null | undefined;
const resend = () => (client === undefined ? (client = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null) : client);

export type CrmEmail = {
  to: string;
  subject: string;
  /** The plain-text version and the HTML, both from emails/render.ts renderEmail. */
  text: string;
  html: string;
  contact?: number;
  enquiry?: number;
  application?: number;
  sentBy?: Pick<User, "id" | "name" | "email">;
  /** Shown on the timeline, e.g. "Acknowledgement". Defaults to the subject; the email's status shows beside it. */
  summary?: string;
  /** The letter's own words, shown under it on the timeline; the full plain text stays on the Emails row. */
  words?: string;
  /** Files it carries, from lib/files/library.ts resolveAttachments. */
  attachments?: EmailAttachment[];
};

/** One file an email carries: a public file by its address, a private one by its bytes. */
export type EmailAttachment = { ref: string; filename: string; size: number | null; path?: string; content?: Buffer };

export type SentEmail = { id: number; status: "sent" | "failed" | "logged" };

/** Sends one email, records it, and returns the Emails row and what became of it. A Resend failure is recorded, not thrown. */
export async function sendCrmEmail(payload: Payload, email: CrmEmail, req?: Partial<PayloadRequest>): Promise<SentEmail> {
  const fromName = email.sentBy ? `${email.sentBy.name} at Moneybee` : "Moneybee";
  const from = `${fromName} <${FROM_ADDRESS}>`;
  const row = await payload.create({
    collection: "emails",
    overrideAccess: true,
    req,
    data: {
      direction: "out",
      status: resend() ? "queued" : "logged",
      from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      contact: email.contact,
      enquiry: email.enquiry,
      application: email.application,
      sentBy: email.sentBy?.id,
      attachments: email.attachments?.map(({ ref, filename, size }) => ({ ref, name: filename, size })),
    },
  });

  let status: "sent" | "failed" | "logged" = "logged";
  const api = resend();
  if (api) {
    const { data, error } = await api.emails.send({
      from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
      // Replies go to the sender's own inbox until inbound mail is set up on a Moneybee domain.
      replyTo: email.sentBy?.email ?? FROM_ADDRESS,
      tags: [{ name: "email_id", value: String(row.id) }],
      ...(email.attachments?.length ? { attachments: email.attachments.map(({ filename, path, content }) => ({ filename, ...(content ? { content } : { path }) })) } : {}),
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
      data: { contact: email.contact, enquiry: email.enquiry, type: "email_out", at: new Date().toISOString(), summary: email.summary ?? email.subject, body: email.words ?? email.text, email: row.id, actor: email.sentBy?.id, meta: { status } },
    });
  }
  return { id: row.id, status };
}
