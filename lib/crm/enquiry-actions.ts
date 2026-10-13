"use server";

import { createHash } from "node:crypto";
import config from "@payload-config";
import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { getPayload } from "payload";
import { VISITOR_COOKIE } from "@/lib/analytics/visitor";
import { followUp, receiveEnquiry } from "@/lib/crm/enquiries";
import { aiEnquiryTriage, analyticsVisitorId } from "@/lib/flags";

export type EnquiryResult =
  | { ok: true; reference: string; email: string; acknowledged: boolean }
  /** `mailto`: no database on this deployment yet, so the form opens the visitor's mail app as it used to. */
  | { ok: false; error: string; mailto?: boolean };

const clip = (value: unknown, length: number) => (typeof value === "string" ? value.slice(0, length) : undefined);

/**
 * The /contact form's submit (components/contact-v2/contact-sections.tsx).
 * Answers fast with a reference; the acknowledgement, the staff email and AI
 * triage run after the response (lib/crm/enquiries.ts `followUp`).
 */
export async function sendEnquiry(kind: string, values: Record<string, unknown>, context: { page?: string; utm?: Record<string, unknown> }): Promise<EnquiryResult> {
  if (!process.env.DATABASE_URL) return { ok: false, error: "", mailto: true };
  // A filled honeypot is a bot. It gets a normal-looking answer and nothing is stored.
  if (typeof values.website === "string" && values.website) return { ok: true, reference: "ENQ-00000", email: "", acknowledged: false };

  const head = await headers();
  const ip = head.get("x-forwarded-for")?.split(",")[0]?.trim() || head.get("x-real-ip") || "";
  const ipHash = ip ? createHash("sha256").update(`${process.env.PAYLOAD_SECRET}:${ip}`).digest("hex").slice(0, 32) : undefined;
  const visitorId = (await analyticsVisitorId()) ? clip((await cookies()).get(VISITOR_COOKIE)?.value, 64) : undefined;
  const utm = Object.fromEntries(Object.entries(context.utm ?? {}).flatMap(([key, value]) => (/^utm_[a-z]+$/.test(key) && typeof value === "string" ? [[key, value.slice(0, 120)]] : [])));

  const result = await receiveEnquiry(kind, values, { page: clip(context.page, 300), utm, ipHash, visitorId });
  if (!result.ok) return result;

  const aiTriage = await aiEnquiryTriage();
  const siteOrigin = `${head.get("x-forwarded-proto") ?? "https"}://${head.get("x-forwarded-host") ?? head.get("host")}`;
  after(() => followUp(result.id, { siteOrigin, aiTriage }));

  const settings = await (await getPayload({ config })).findGlobal({ slug: "crm-settings", depth: 0, overrideAccess: true });
  return { ok: true, reference: result.reference, email: result.email, acknowledged: settings.acknowledge !== false && Boolean(process.env.RESEND_API_KEY) };
}
