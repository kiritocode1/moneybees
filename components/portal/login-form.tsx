"use client";

import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Banner, BannerTitle } from "@/components/fluid/banner";
import { Button } from "@/components/fluid/button";
import { InputField, InputGroup } from "@/components/fluid/input-group";
import { SUBHEAD } from "@/components/hero/tokens";
import { login, type LoginState } from "@/lib/auth/portal-actions";

const START: LoginState = { step: "password", email: "" };

/**
 * Client Login, two steps on one form: email and password, then the six-digit
 * code from the email. "Use a different account" remounts the steps, which is
 * the only way to clear useActionState back to the start. Rendered on
 * /portal/login inside PortalFrame, which supplies the `.fluid` tokens
 * (components/fluid/fluid.css).
 */
export function LoginForm() {
  const [attempt, setAttempt] = useState(0);
  return <LoginSteps key={attempt} onRestart={() => setAttempt((count) => count + 1)} />;
}

function LoginSteps({ onRestart }: { onRestart: () => void }) {
  const [state, action, pending] = useActionState(login, START);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  if (state.step === "code") {
    return (
      <form action={action} className="flex flex-col">
        <h1 className={SUBHEAD}>Check your email</h1>
        <p className="mt-4 text-[15px] leading-[1.55] text-muted-foreground">
          We sent a 6-digit code to {state.sentTo}. It works for 10 minutes.
        </p>
        <ErrorBanner message={state.error} />
        <InputGroup className="mt-8 w-full">
          <InputField
            index={0}
            label="Code"
            name="code"
            icon={ShieldCheck}
            placeholder="6-digit code"
            value={code}
            onChange={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            required
          />
        </InputGroup>
        <Button type="submit" loading={pending} className="mt-6 w-full">
          Sign in
        </Button>
        <button type="button" onClick={onRestart} className="mt-5 self-start text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Use a different account
        </button>
      </form>
    );
  }

  return (
    <form action={action} className="flex flex-col">
      <h1 className={SUBHEAD}>Client Login</h1>
      <p className="mt-4 text-[15px] leading-[1.55] text-muted-foreground">
        Moneybee sets up each account. If you invest with us and have not had an invitation, write to{" "}
        <a href="mailto:info@moneybee.in" className="text-foreground underline underline-offset-4">
          info@moneybee.in
        </a>
        .
      </p>
      <ErrorBanner message={state.error} />
      <InputGroup className="mt-8 w-full">
        <InputField index={0} label="Email" name="email" type="email" icon={Mail} placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" required />
        <InputField index={1} label="Password" name="password" type="password" icon={LockKeyhole} placeholder="Your password" value={password} onChange={setPassword} autoComplete="current-password" required />
      </InputGroup>
      <Button type="submit" loading={pending} className="mt-6 w-full">
        Continue
      </Button>
      <Link href="/portal/forgot" className="mt-5 self-start text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        Forgot your password?
      </Link>
    </form>
  );
}

function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Banner status="error" contrast="high" className="mt-6">
      <BannerTitle>{message}</BannerTitle>
    </Banner>
  );
}
