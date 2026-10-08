"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEVICE_COOKIE, requestPasswordReset, resetPassword, type Session, SESSION_COOKIE, startLogin, verifyCode } from "@/lib/auth/portal";

/** Where the sign-in form is: asking for the password, or for the emailed code. */
export type LoginState =
  | { step: "password"; email: string; error?: string }
  | { step: "code"; email: string; challengeId: string; sentTo: string; error?: string };

const secure = process.env.NODE_ENV === "production";

async function openSession(session: Session) {
  (await cookies()).set(SESSION_COOKIE, session.token, { httpOnly: true, secure, sameSite: "lax", path: "/", expires: session.expires });
}

/** One action for both steps; the step comes from the state the form already holds. */
export async function login(previous: LoginState, form: FormData): Promise<LoginState> {
  if (previous.step === "code") {
    const code = String(form.get("code") ?? "").replace(/\s/g, "");
    if (!/^\d{6}$/.test(code)) return { ...previous, error: "Enter the 6 digits from the email." };
    const result = await verifyCode(previous.challengeId, code);
    if (result.kind === "error") return { ...previous, error: result.message };
    await openSession(result.session);
    (await cookies()).set(DEVICE_COOKIE, result.deviceToken, { httpOnly: true, secure, sameSite: "lax", path: "/portal", maxAge: 60 * 60 * 24 * 400 });
    redirect("/portal");
  }

  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { step: "password", email, error: "Enter your email and password." };
  const result = await startLogin(email, password, (await cookies()).get(DEVICE_COOKIE)?.value);
  if (result.kind === "error") return { step: "password", email, error: result.message };
  if (result.kind === "code-sent") return { step: "code", email, challengeId: result.challengeId, sentTo: result.sentTo };
  await openSession(result.session);
  redirect("/portal");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/portal/login");
}

export type ForgotState = { sent: boolean; error?: string };

/** Always answers the same way, so the form cannot be used to find out who has an account. */
export async function forgotPassword(_: ForgotState, form: FormData): Promise<ForgotState> {
  const email = String(form.get("email") ?? "").trim();
  if (!email.includes("@")) return { sent: false, error: "Enter the email your account uses." };
  const head = await headers();
  const origin = `${head.get("x-forwarded-proto") ?? "https"}://${head.get("x-forwarded-host") ?? head.get("host")}`;
  await requestPasswordReset(email, origin);
  return { sent: true };
}

export type ResetState = { done: boolean; error?: string };

export async function setNewPassword(_: ResetState, form: FormData): Promise<ResetState> {
  const token = String(form.get("token") ?? "");
  const password = String(form.get("password") ?? "");
  if (password.length < 12) return { done: false, error: "Use at least 12 characters." };
  if (password !== String(form.get("confirm") ?? "")) return { done: false, error: "The two passwords don't match." };
  const result = await resetPassword(token, password);
  return result.kind === "done" ? { done: true } : { done: false, error: result.message };
}
