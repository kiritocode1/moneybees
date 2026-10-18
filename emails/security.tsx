import type { SiteDetails } from "@/lib/site/details";
import { Action, Code, Facts, InlineLink, Notice, P, Salutation, Signature, Steps } from "./blocks";
import { MoneybeeEmail } from "./frame";

/*
 * Sign-in and password emails for investors (/portal) and staff (/admin).
 * Each says when it was asked for, from where if known, and what to do if
 * it was not them.
 */

type Base = { name: string; date?: string; site?: SiteDetails };
/** Where a request came from: the browser, and roughly where (Vercel's city header). Either may be missing. */
export type Origin = { browser?: string; near?: string };

const originRows = ({ browser, near }: Origin) => (browser || near ? [[...(browser ? [{ label: "Browser", value: browser }] : []), ...(near ? [{ label: "Location (approximate)", value: near }] : [])]] : []);

export type SignInCodeProps = Base & Origin & { code: string; validUntil: string; account: string; requestedAt: string; resetHref: string; phone?: string };

export const signInCodeSubject = ({ code }: Pick<SignInCodeProps, "code">) => `${code} is your Moneybee sign-in code`;

/** Step two of the investor sign-in (lib/auth/portal.ts startLogin). */
export function SignInCode({ name, code, validUntil, account, requestedAt, browser, near, resetHref, phone, date, site }: SignInCodeProps) {
  const spaced = code.replace(/^(\d{3})(\d{3})$/, "$1 $2");
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} preview={`Valid for one use until ${validUntil}. Moneybee will never ask you for this code.`} eyebrow="Investor portal" title="Your sign-in code" reason="You are receiving this email because a sign-in to the Moneybee investor portal was attempted with your email address and password.">
      <Salutation name={name} />
      <P>Please enter the following code on the sign-in page to complete your sign-in to the Moneybee investor portal.</P>
      <Code value={spaced} />
      <P muted>This code is valid for one use until {validUntil}.</P>
      <Facts rows={[[{ label: "Account", value: account }, { label: "Requested", value: requestedAt }], ...originRows({ browser, near })]} />
      <Notice>
        <strong>If you did not attempt to sign in,</strong> your password may be known to someone else. Do not share this code; Moneybee staff will never ask for it. Please <InlineLink href={resetHref}>set a new password</InlineLink> immediately{phone ? ` and inform us on ${phone}` : ""}.
      </Notice>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

export type SetPasswordProps = Base & Origin & { href: string; validFor: string; requestedAt: string; who: "investor" | "staff" };

export const setPasswordSubject = ({ who }: Pick<SetPasswordProps, "who">) => (who === "investor" ? "Set your Moneybee portal password" : "Set your Moneybee admin password");

/** The set-password link, for investors (/portal/reset) and staff (/admin). */
export function SetPassword({ name, href, validFor, requestedAt, browser, near, who, date, site }: SetPasswordProps) {
  const place = who === "investor" ? "the Moneybee investor portal" : "Moneybee's admin";
  return (
    <MoneybeeEmail audience={who === "investor" ? "investor" : "staff"} site={site} date={date} preview={`The link works once, for ${validFor}.`} eyebrow={who === "investor" ? "Investor portal" : "Admin"} title="Set your password" reason={`You are receiving this email because a new password was requested for your account on ${place}.`}>
      <Salutation name={name} />
      <P>Please use the button below to set your password for {place}. The link works once, for {validFor}.</P>
      <Action href={href}>Set your password</Action>
      <Facts rows={[[{ label: "Requested", value: requestedAt }], ...originRows({ browser, near })]} />
      <Notice>If you did not ask for this, you can ignore this email. Your password has not changed.</Notice>
      <Signature name={who === "investor" ? "Client Services" : "Moneybee"} />
    </MoneybeeEmail>
  );
}

export type PasswordChangedProps = Base & Origin & { at: string; resetHref: string; phone?: string };

export const passwordChangedSubject = () => "Your Moneybee portal password was changed";

export function PasswordChanged({ name, at, browser, near, resetHref, phone, date, site }: PasswordChangedProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} preview={`Changed on ${at}.`} eyebrow="Investor portal" title="Your password was changed" reason="You are receiving this email because the password on your Moneybee investor portal account was changed.">
      <Salutation name={name} />
      <P>The password for your Moneybee investor portal account was changed on {at}.</P>
      <Facts rows={[[{ label: "Changed", value: at }], ...originRows({ browser, near })]} />
      <Notice>
        <strong>If you did not change it,</strong> please <InlineLink href={resetHref}>set a new password</InlineLink> now{phone ? ` and call us on ${phone}` : ""}.
      </Notice>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

export type NewBrowserProps = Base & Origin & { at: string; resetHref: string; phone?: string };

export const newBrowserSubject = () => "New sign-in to your Moneybee portal account";

export function NewBrowser({ name, at, browser, near, resetHref, phone, date, site }: NewBrowserProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} preview={`${browser ?? "A new browser"}, ${at}.`} eyebrow="Investor portal" title="A new browser signed in" reason="You are receiving this email because your Moneybee investor portal account was signed in to from a browser we had not seen before.">
      <Salutation name={name} />
      <P>Your account was signed in to from a new browser. If this was you, there is nothing to do.</P>
      <Facts rows={[[{ label: "When", value: at }], ...originRows({ browser, near })]} />
      <Notice>
        <strong>If this was not you,</strong> please <InlineLink href={resetHref}>set a new password</InlineLink> now{phone ? ` and call us on ${phone}` : ""}.
      </Notice>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

export type PortalInvitationProps = Base & { href: string; validUntil: string; account: string; invitedBy: string; loginHref: string; clientCodes: string[] };

export const portalInvitationSubject = () => "Your Moneybee investor portal account";

/** When Moneybee opens a client's portal account from their page in /admin (lib/crm/portal-invite.ts). They choose their own password; nobody at Moneybee knows it. */
export function PortalInvitation({ name, href, validUntil, account, invitedBy, loginHref, clientCodes, date, site }: PortalInvitationProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} preview={`Set your password by ${validUntil}. The link works once.`} eyebrow="Investor portal" title="Your investor portal account" reason="You are receiving this email because Moneybee has opened an investor portal account for you.">
      <Salutation name={name} />
      <P>We have opened an account for you on the Moneybee investor portal. Please set your own password using the button below; the link works once, until {validUntil}. Nobody at Moneybee will know your password or ask you for it.</P>
      <Action href={href}>Set your password</Action>
      <Facts rows={[[{ label: "Account", value: account }, { label: "Opened by", value: invitedBy }], ...(clientCodes.length ? [[{ label: clientCodes.length === 1 ? "Client code" : "Client codes", value: clientCodes.join(", "), mono: true }]] : [])]} />
      <Steps
        items={[
          "Set your password with the button above.",
          <>
            Sign in at <InlineLink href={loginHref}>the investor portal</InlineLink> with this email address and your password.
          </>,
          "The first time you sign in on a browser, we email you a six-digit code to confirm it is you.",
        ]}
      />
      <Notice>If you were not expecting this account, please write to us and we will close it.</Notice>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}
