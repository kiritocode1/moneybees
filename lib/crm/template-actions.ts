"use server";

import config from "@payload-config";
import { type } from "arktype";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { sendCrmEmail } from "@/lib/crm/mail";
import { fillTemplate, fillTemplateHtml } from "@/lib/crm/template";

const TestInput = type({ subject: "string <= 200", html: "string <= 500000", text: "string <= 100000" });

/** Sample values for a test send, so merge fields read as they will in a real email. */
const SAMPLE = { firstName: "Rohan", name: "Rohan Mehta", reference: "ENQ-00042", role: "Equity Research Analyst" };

/**
 * "Send a test to me" in the template editor: the template as it stands,
 * merge fields filled with sample values, to the signed-in staff member only.
 */
export async function sendTemplateTest(input: { subject: string; html: string; text: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = TestInput(input);
  if (parsed instanceof type.errors) return { ok: false, error: "The template is too large to send." };
  if (!parsed.html.trim()) return { ok: false, error: "Write something in the email first." };
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== "users") return { ok: false, error: "Sign in again to send a test." };

  const values = { ...SAMPLE, senderName: user.name };
  await sendCrmEmail(payload, {
    to: user.email,
    subject: `[Test] ${fillTemplate(parsed.subject || "Untitled template", values)}`,
    text: fillTemplate(parsed.text, values),
    html: fillTemplateHtml(parsed.html, values),
    sentBy: user,
  });
  return { ok: true };
}
