"use server";

import { createHash } from "node:crypto";
import config from "@payload-config";
import { headers } from "next/headers";
import { after } from "next/server";
import { getPayload } from "payload";
import { emailConnected } from "@/lib/crm/mail";
import { aiApplicantScreen, aiResumeParse } from "@/lib/flags";
import { followUpApplication, MAX_RESUME_BYTES, receiveApplication } from "@/lib/hiring/apply";
import { resumeType } from "@/lib/hiring/resume-store";
import { readResumeFields, type ResumeFields } from "@/lib/hiring/screen";

export type ApplyResult =
  | { ok: true; reference: string; email: string; acknowledged: boolean }
  /** `mailto`: no database on this deployment, so the form opens the applicant's mail app instead. */
  | { ok: false; error: string; mailto?: boolean };

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
};

/**
 * The apply form's Send (components/careers/apply-form.tsx). Answers with a
 * reference straight away; the confirmation, the email to HR and Jev's reading
 * run after the response (lib/hiring/apply.ts `followUpApplication`).
 */
export async function sendApplication(form: FormData): Promise<ApplyResult> {
  if (!process.env.DATABASE_URL) return { ok: false, error: "", mailto: true };
  // A filled honeypot is a bot. It gets a normal-looking answer and nothing is stored.
  if (text(form, "website")) return { ok: true, reference: "APP-00000", email: "", acknowledged: false };

  const head = await headers();
  const ip = head.get("x-forwarded-for")?.split(",")[0]?.trim() || head.get("x-real-ip") || "";
  const ipHash = ip ? createHash("sha256").update(`${process.env.PAYLOAD_SECRET}:${ip}`).digest("hex").slice(0, 32) : undefined;
  const file = form.get("resume");
  const resume = file instanceof File && file.size > 0 ? { bytes: new Uint8Array(await file.arrayBuffer()), name: file.name } : null;
  const fields = Object.fromEntries(["name", "email", "phone", "city", "linkedin", "notice", "why", "experience", "consent"].map((key) => [key, text(form, key)]));

  const result = await receiveApplication(
    { role: text(form, "role"), team: text(form, "team"), fields, mustHaves: form.getAll("must").map(String), resume },
    { page: text(form, "page").slice(0, 300), ipHash },
  );
  if (!result.ok) return result;

  const aiScreen = await aiApplicantScreen();
  const siteOrigin = `${head.get("x-forwarded-proto") ?? "https"}://${head.get("x-forwarded-host") ?? head.get("host")}`;
  after(() => followUpApplication(result.id, { siteOrigin, aiScreen }));

  const settings = await (await getPayload({ config })).findGlobal({ slug: "crm-settings", depth: 0, overrideAccess: true });
  return { ok: true, reference: result.reference, email: result.email, acknowledged: settings.hiring?.acknowledge !== false && emailConnected() };
}

/**
 * Step 1's reading of an uploaded PDF, only while "Read uploaded resumes" is
 * on in Desk settings. Nothing is stored: the file goes with the application
 * at Send. Any failure leaves the details step for the applicant to type.
 */
export async function readResume(form: FormData): Promise<{ ok: true; fields: ResumeFields } | { ok: false }> {
  if (!(await aiResumeParse())) return { ok: false };
  const file = form.get("resume");
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_RESUME_BYTES) return { ok: false };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (resumeType(bytes.subarray(0, 8))?.extension !== ".pdf") return { ok: false };
  try {
    return { ok: true, fields: await readResumeFields(bytes) };
  } catch {
    return { ok: false };
  }
}
