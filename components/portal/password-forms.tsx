"use client";

import { LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Banner, BannerTitle } from "@/components/fluid/banner";
import { Button } from "@/components/fluid/button";
import { InputField, InputGroup } from "@/components/fluid/input-group";
import { SUBHEAD } from "@/components/hero/tokens";
import { forgotPassword, setNewPassword } from "@/lib/auth/portal-actions";

/** The site heading style; these forms are each page's h1 inside PortalFrame. */
const HEADING = SUBHEAD;
const BODY = "mt-4 text-[15px] leading-[1.55] text-muted-foreground";
const QUIET_LINK = "mt-5 self-start text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";

function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Banner status="error" contrast="high" className="mt-6">
      <BannerTitle>{message}</BannerTitle>
    </Banner>
  );
}

/** Asks for the account's email and always gives the same answer, account or not. */
export function ForgotForm() {
  const [state, action, pending] = useActionState(forgotPassword, { sent: false });
  const [email, setEmail] = useState("");

  if (state.sent) {
    return (
      <div className="flex flex-col">
        <h1 className={HEADING}>Check your email</h1>
        <p className={BODY}>If {email} has an account, a link to set a new password is on its way. It works for 30 minutes.</p>
        <Link href="/portal/login" className={QUIET_LINK}>
          Back to sign in
        </Link>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col">
      <h1 className={HEADING}>Set a new password</h1>
      <p className={BODY}>Enter the email your account uses and we will send a link.</p>
      <ErrorBanner message={state.error} />
      <InputGroup className="mt-8 w-full">
        <InputField index={0} label="Email" name="email" type="email" icon={Mail} placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" required />
      </InputGroup>
      <Button type="submit" loading={pending} className="mt-6 w-full">
        Send link
      </Button>
      <Link href="/portal/login" className={QUIET_LINK}>
        Back to sign in
      </Link>
    </form>
  );
}

/** The page the emailed link opens: choose a password, then sign in with it. */
export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(setNewPassword, { done: false });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  if (state.done) {
    return (
      <div className="flex flex-col">
        <h1 className={HEADING}>Password set</h1>
        <p className={BODY}>Sign in with your email and the new password.</p>
        <Button render={<Link href="/portal/login" />} className="mt-8 w-full">
          Sign in
        </Button>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col">
      <h1 className={HEADING}>Choose a password</h1>
      <p className={BODY}>At least 12 characters.</p>
      <ErrorBanner message={state.error} />
      <input type="hidden" name="token" value={token} />
      <InputGroup className="mt-8 w-full">
        <InputField index={0} label="New password" name="password" type="password" icon={LockKeyhole} placeholder="At least 12 characters" value={password} onChange={setPassword} autoComplete="new-password" minLength={12} required />
        <InputField index={1} label="Type it again" name="confirm" type="password" icon={LockKeyhole} placeholder="Same password again" value={confirm} onChange={setConfirm} autoComplete="new-password" minLength={12} required />
      </InputGroup>
      <Button type="submit" loading={pending} className="mt-6 w-full">
        Save password
      </Button>
    </form>
  );
}
