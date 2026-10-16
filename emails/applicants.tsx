import type { SiteDetails } from "@/lib/site/details";
import { Facts, InlineLink, Label, P, Salutation, Signature, Steps, Words, type WordsValue } from "./blocks";
import { MoneybeeEmail } from "./frame";
import type { Sender } from "./prospects";

/*
 * Emails to people who applied for a role (lib/hiring). The words are HR's,
 * from the templates in /admin; the facts of the application are drawn here.
 */

type Base = { name: string; reference: string; role: string; date?: string; site?: SiteDetails; words: WordsValue };
const REASON = "You are receiving this email because you applied for a role at Moneybee.";
const senderLines = (sender: Sender) => [[sender.phone, sender.email].filter(Boolean).join("  ·  ")].filter(Boolean);

export type ApplicationReceivedProps = Base & { receivedAt: string; resume?: string; mustHaves: { question: string; answer: "yes" | "no" }[]; notice?: string; keptUntil: string };

export const applicationReceivedSubject = ({ reference }: Pick<ApplicationReceivedProps, "reference">) => `Your application has been received (${reference})`;

export function ApplicationReceived({ name, reference, role, words, receivedAt, resume, mustHaves, notice, keptUntil, date, site }: ApplicationReceivedProps) {
  return (
    <MoneybeeEmail audience="applicant" site={site} date={date} reference={reference} preview={`Reference ${reference}. What happens next, and how long we keep it.`} eyebrow="Careers" title="Your application has been received" reason={REASON}>
      <Salutation name={name} />
      <Words {...words} />
      <Facts
        rows={[
          [{ label: "Reference", value: reference, mono: true }, { label: "Received", value: receivedAt }],
          [{ label: "Role", value: role }],
          [{ label: "Resume", value: resume ?? "Not attached; you described your experience instead" }, ...(notice ? [{ label: "Notice period", value: notice }] : [])],
        ]}
      />
      {mustHaves.length ? (
        <>
          <Label>Your answers to the role&apos;s requirements</Label>
          <Facts rows={mustHaves.map((item) => [{ label: item.question, value: item.answer === "yes" ? "Yes" : "No" }])} />
        </>
      ) : null}
      <Label>What happens next</Label>
      <Steps items={["Our hiring team will read your application.", "If we would like to meet you, we will write to you at this address to arrange an interview.", `We will keep your application until ${keptUntil}, unless you ask us to delete it sooner.`]} />
      <Signature name="Hiring Team" />
    </MoneybeeEmail>
  );
}

export type InterviewInvitationProps = Base & { when: string; where: string; mapHref?: string; with: string; sender: Sender };

export const interviewInvitationSubject = ({ role }: Pick<InterviewInvitationProps, "role">) => `Interview for ${role} at Moneybee`;

export function InterviewInvitation({ name, reference, role, words, when, where, mapHref, with: interviewers, sender, date, site }: InterviewInvitationProps) {
  return (
    <MoneybeeEmail audience="applicant" site={site} date={date} reference={reference} preview={`${when}, ${where}.`} eyebrow="Careers" title={`Interview for ${role}`} reason={REASON}>
      <Salutation name={name} />
      <Words {...words} />
      <Facts rows={[[{ label: "When", value: when }], [{ label: "Where", value: where }], [{ label: "You will meet", value: interviewers }]]} />
      {mapHref ? (
        <P small muted style={{ marginTop: 8 }}>
          <InlineLink href={mapHref}>Directions</InlineLink>
        </P>
      ) : null}
      <Signature name={sender.name} role={sender.role ?? "Hiring Team"} lines={senderLines(sender)} />
    </MoneybeeEmail>
  );
}

export type OfferProps = Base & { sender: Sender; replyBy?: string };

export const offerSubject = () => "Your offer from Moneybee";

export function Offer({ name, reference, role, words, sender, replyBy, date, site }: OfferProps) {
  return (
    <MoneybeeEmail audience="applicant" site={site} date={date} reference={reference} preview={`An offer for the role of ${role}.`} eyebrow="Careers" title="Your offer from Moneybee" reason={REASON}>
      <Salutation name={name} />
      <Words {...words} />
      <Facts rows={[[{ label: "Role", value: role }, ...(replyBy ? [{ label: "Please reply by", value: replyBy }] : [])]]} />
      <Signature name={sender.name} role={sender.role ?? "Hiring Team"} lines={senderLines(sender)} />
    </MoneybeeEmail>
  );
}

export type NotTakenForwardProps = Base & { keptUntil: string; sender: Sender };

export const notTakenForwardSubject = ({ role }: Pick<NotTakenForwardProps, "role">) => `Your application for ${role}`;

export function NotTakenForward({ name, reference, role, words, keptUntil, sender, date, site }: NotTakenForwardProps) {
  return (
    <MoneybeeEmail audience="applicant" site={site} date={date} reference={reference} preview={`About your application for ${role}.`} eyebrow="Careers" title="Your application" reason={REASON}>
      <Salutation name={name} />
      <Words {...words} />
      <Facts rows={[[{ label: "Reference", value: reference, mono: true }, { label: "Kept until", value: keptUntil }]]} />
      <P small muted style={{ marginTop: 10 }}>To have your details deleted sooner, reply to this email and we will delete them.</P>
      <Signature name={sender.name} role={sender.role ?? "Hiring Team"} lines={senderLines(sender)} />
    </MoneybeeEmail>
  );
}
