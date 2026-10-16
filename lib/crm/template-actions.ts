"use server";

import config from "@payload-config";
import { type } from "arktype";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { catalogueEntry, EMAIL_FOR_PURPOSE, SAMPLE_VALUES } from "@/emails";
import { renderEmail } from "@/emails/render";
import { siteOf } from "@/emails/request";
import { sendCrmEmail } from "@/lib/crm/mail";
import { siteDetails } from "@/lib/site/load-details";
import { fillTemplate, fillTemplateHtml } from "@/lib/crm/template";

const TemplateInput = type({ purpose: "string <= 40", subject: "string <= 200", html: "string <= 500000", text: "string <= 100000" });
type TemplateDraft = { purpose: string; subject: string; html: string; text: string };

/**
 * The template as it will go out: its words in the email its purpose calls
 * for (emails/index.tsx), merge fields filled with sample values, signed by
 * the signed-in staff member.
 */
async function drawTemplate(input: TemplateDraft) {
  const parsed = TemplateInput(input);
  if (parsed instanceof type.errors) return { ok: false as const, error: "The template is too large to show." };
  if (!parsed.text.trim()) return { ok: false as const, error: "Write something in the email first." };
  const payload = await getPayload({ config });
  const head = await headers();
  const { user } = await payload.auth({ headers: head });
  if (user?.collection !== "users") return { ok: false as const, error: "Sign in again." };
  const entry = catalogueEntry(EMAIL_FOR_PURPOSE[parsed.purpose] ?? "enquiry-reply");
  if (!entry) return { ok: false as const, error: "This purpose has no email yet." };
  const values = { ...SAMPLE_VALUES, senderName: user.name };
  const words = { text: fillTemplate(parsed.text, values), html: parsed.html ? fillTemplateHtml(parsed.html, values) : null };
  const sample = entry.sample(words, await siteDetails());
  const email = await renderEmail(sample.element, siteOf(head));
  return { ok: true as const, payload, user, subject: fillTemplate(parsed.subject || sample.subject, values), ...email };
}

/** The editor's Preview: the whole email, frame and facts included. Sends nothing. */
export async function previewTemplate(input: TemplateDraft): Promise<{ ok: true; html: string; text: string } | { ok: false; error: string }> {
  const drawn = await drawTemplate(input);
  return drawn.ok ? { ok: true, html: drawn.html, text: drawn.text } : drawn;
}

/** "Send a test to me" in the template editor: the email as above, to the signed-in staff member only. */
export async function sendTemplateTest(input: TemplateDraft): Promise<{ ok: true } | { ok: false; error: string }> {
  const drawn = await drawTemplate(input);
  if (!drawn.ok) return drawn;
  const { payload, user, subject, html, text } = drawn;
  const sent = await sendCrmEmail(payload, { to: user.email, subject: `[Test] ${subject}`, text, html, sentBy: user });
  if (sent.status === "logged") return { ok: false, error: "Email is not connected, so the test was saved but not sent." };
  if (sent.status === "failed") return { ok: false, error: "Resend refused the test. Try again, or check the address on your account." };
  return { ok: true };
}
