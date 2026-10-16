import { Link } from "react-email";
import { DEFAULT_DETAILS, type SiteDetails } from "@/lib/site/details";
import { Action, Disclosure, signedNumber, type DocumentItem, Documents, type Fact, Facts, InlineLink, Label, Notice, P, Quote, ReturnBars, type ReturnRow, ReturnTable, Salutation, Signature, Steps, Words, type WordsValue } from "./blocks";
import { AIF_PRIVATE_PLACEMENT, PMS_NAMES, pmsDisclosure } from "./disclosures";
import { MoneybeeEmail } from "./frame";

/*
 * Emails to people who are not yet investors: the acknowledgement, replies,
 * the PMS and Flyingbee introductions, meetings, the account opening
 * checklists and event invitations. PMS material that shows returns carries
 * SEBI's lines (PMS MC 2.3.2 direct onboarding, 4.5.3.6, 5.6.4 relative
 * performance); Flyingbee material is private placement only (AIF MC 3.2.1)
 * and shows no returns (22.5.1).
 */

export type Sender = { name: string; role?: string; phone?: string; email?: string };
const senderLines = (sender: Sender) => [[sender.phone, sender.email].filter(Boolean).join("  ·  ")].filter(Boolean);
type Base = { name: string; reference: string; date?: string; site?: SiteDetails };

/** What happens after each /contact form, from its playbook and first-reply template. */
const NEXT_STEPS = {
  pms: [
    "We will send you our latest fact sheet and Disclosure Document, and answer your questions.",
    "We will propose a meeting, at our office or by video call, to explain how we invest and whether the service suits you.",
    "Should you decide to proceed, we will send the account opening documents. The minimum investment in a PMS is Rs. 50 lakh, as set by SEBI.",
  ],
  aif: [
    "We will confirm how you would invest: as an individual, an HUF, a family office or a company.",
    "We will then send the fund's Private Placement Memorandum privately, and propose a call with the fund team.",
    "Should you decide to proceed, we will send the subscription documents. The minimum commitment is Rs. 1 crore.",
  ],
  support: ["Our operations team will find your account using your client code.", "We will reply with what will happen and by when."],
  general: ["We will answer your question, or pass it to the right team and tell you who will reply."],
} as const;

export const ENQUIRY_ABOUT = { pms: "Portfolio Management Service", aif: "Flyingbee Investment Fund", support: "Investor support", general: "General enquiry" } as const;

export type EnquiryReceivedProps = Base & {
  kind: keyof typeof NEXT_STEPS;
  receivedAt: string;
  replyBy?: string;
  answers: { label: string; value: string }[];
  message?: string;
  words: WordsValue;
};

export const enquiryReceivedSubject = ({ reference }: Pick<EnquiryReceivedProps, "reference">) => `Your enquiry has been received (${reference})`;

/** To a visitor who sent a /contact form (lib/crm/enquiries.ts followUp). */
export function EnquiryReceived({ name, reference, kind, receivedAt, replyBy, answers, message, words, date, site = DEFAULT_DETAILS }: EnquiryReceivedProps) {
  const phone = site.phones[0]?.number;
  return (
    <MoneybeeEmail
      audience="investor"
      site={site}
      date={date}
      reference={reference}
      preview={replyBy ? `A member of our team will reply by ${replyBy}.` : `Your reference is ${reference}.`}
      eyebrow={kind === "general" ? "Enquiry" : `${ENQUIRY_ABOUT[kind]} enquiry`}
      title="Your enquiry has been received"
      reason="You are receiving this email because you submitted an enquiry form on the Moneybee website."
    >
      <Salutation name={name} />
      <Words {...words} />
      <Facts
        rows={[
          [{ label: "Reference", value: reference, mono: true }, { label: "Received", value: receivedAt }],
          [{ label: "Subject", value: ENQUIRY_ABOUT[kind] }, ...(replyBy ? [{ label: "Reply due by", value: replyBy }] : [])],
        ]}
      />
      {answers.length ? (
        <>
          <Label>Details you provided</Label>
          <Facts rows={pairs(answers.map(({ label, value }) => ({ label, value })))} />
        </>
      ) : null}
      {message ? <Quote>{message}</Quote> : null}
      <Label>What happens next</Label>
      <Steps items={[...NEXT_STEPS[kind]]} />
      <Notice>
        If any detail above is incorrect, please reply to this email with the correction.{phone ? ` For urgent matters, please call ${phone} and quote reference ${reference}.` : ""}
      </Notice>
      <Signature name="Client Services" lines={[[phone, site.email].filter(Boolean).join("  ·  ")]} />
    </MoneybeeEmail>
  );
}

/** Facts two to a row; a long value (a message, an address) gets a row of its own. */
export function pairs(facts: Fact[]): Fact[][] {
  const rows: { cells: Fact[]; open: boolean }[] = [];
  for (const fact of facts) {
    const long = typeof fact.value === "string" && fact.value.length > 28;
    const last = rows.at(-1);
    if (!long && last?.open) {
      last.cells.push(fact);
      last.open = false;
    } else rows.push({ cells: [fact], open: !long });
  }
  return rows.map((row) => row.cells);
}

export type LetterProps = Base & {
  /** The line above the title. */
  eyebrow: string;
  title: string;
  words: WordsValue;
  sender: Sender;
  audience?: "investor" | "applicant";
  reason: string;
  /** The message being answered, quoted under the letter. */
  original?: { label: string; message: string };
};

/** A letter in someone's own words: a reply to an enquiry, or any email HR writes. */
export function Letter({ name, reference, eyebrow, title, words, sender, audience = "investor", reason, original, date, site }: LetterProps) {
  return (
    <MoneybeeEmail audience={audience} site={site} date={date} reference={reference} preview={words.text.split("\n").find(Boolean) ?? title} eyebrow={eyebrow} title={title} reason={reason}>
      <Salutation name={name} />
      <Words {...words} />
      <Signature name={sender.name} role={sender.role} lines={senderLines(sender)} />
      {original ? (
        <>
          <Label>{original.label}</Label>
          <Quote>{original.message}</Quote>
        </>
      ) : null}
    </MoneybeeEmail>
  );
}

export type PmsIntroductionProps = Base & { words: WordsValue; sender: Sender; asOf: string; rows: ReturnRow[]; chart: ReturnRow[]; documents: DocumentItem[] };

export const pmsIntroductionSubject = ({ reference }: Pick<PmsIntroductionProps, "reference">) => `Moneybee Portfolio Management Service: the information you requested (${reference})`;

/** The first reply to a PMS enquiry, from the relationship manager who took it. */
export function PmsIntroduction({ name, reference, words, sender, asOf, rows, chart, documents, date, site = DEFAULT_DETAILS }: PmsIntroductionProps) {
  const since = rows.find((row) => /inception/i.test(row.period));
  const year = rows.find((row) => /^1 year/i.test(row.period));
  const asOfLabel = new Date(asOf).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <MoneybeeEmail
      audience="investor"
      site={site}
      date={date}
      reference={reference}
      preview="Our fact sheet and Disclosure Document, and a proposed meeting."
      eyebrow="Portfolio Management Service"
      title="The Moneybee PMS, as you requested"
      reason={`You are receiving this email in reply to your enquiry ${reference}. If you would prefer not to hear from us again, please reply to say so.`}
    >
      <Salutation name={name} />
      <Words {...words} />
      <Facts
        rows={[
          [{ label: "Portfolio", value: "15 to 20 small and mid cap stocks" }, { label: "Holding period", value: "At least 3 years per stock" }],
          [{ label: "Sector limit", value: "No more than 30% in one sector" }, { label: "Benchmark", value: PMS_NAMES.benchmark }],
          [{ label: "Managing PMS portfolios since", value: "August 2007" }, { label: "Minimum investment", value: "Rs. 50 lakh" }],
        ]}
      />
      <Label>Performance to {asOfLabel}</Label>
      {since && year ? (
        <P>
          Since August 2007, the Moneybee PMS has returned {signedNumber(since.ours)}% a year, against {signedNumber(since.benchmark)}% for the {PMS_NAMES.benchmark}. Over the last year it returned {signedNumber(year.ours)}%, against {signedNumber(year.benchmark)}%. Returns are time weighted and after expenses, as set out in the note at the end of this letter.
        </P>
      ) : null}
      <ReturnBars rows={chart} names={PMS_NAMES} />
      <ReturnTable rows={rows} names={PMS_NAMES} />
      <P muted small style={{ marginTop: 10 }}>
        Returns in %. Periods above 1 year are CAGR. The performance of other portfolio managers following the same strategy is published by APMI at{" "}
        <Link className="mb-muted" href="https://www.apmiindia.org" style={{ color: "#5B5D61", textDecoration: "underline" }}>
          apmiindia.org
        </Link>
        .
      </P>
      <Label>Investing directly</Label>
      <P>You may open the account directly with Moneybee, without a distributor. A direct account carries no charges other than statutory ones.</P>
      {documents.length ? (
        <>
          <Label>Documents</Label>
          <Documents items={documents} />
        </>
      ) : null}
      <P style={{ marginTop: 24 }}>
        I would welcome the opportunity to meet you, at our office or by video call. Please reply with a time that suits you{sender.phone ? `, or call me on ${sender.phone}` : ""}.
      </P>
      <Signature name={sender.name} role={sender.role ?? "Relationship Manager, Portfolio Management Service"} lines={senderLines(sender)} />
      <Disclosure paragraphs={pmsDisclosure(asOf, site)} />
    </MoneybeeEmail>
  );
}

export type AifIntroductionProps = Base & { words: WordsValue; sender: Sender; terms: readonly (readonly [string, string])[] };

export const aifIntroductionSubject = ({ reference }: Pick<AifIntroductionProps, "reference">) => `Flyingbee Investment Fund: your enquiry (${reference})`;

/** The first reply to a Flyingbee enquiry: eligibility before documents, terms, no returns. */
export function AifIntroduction({ name, reference, words, sender, terms, date, site }: AifIntroductionProps) {
  const facts: Fact[] = terms.map(([label, value]) => ({ label, value }));
  return (
    <MoneybeeEmail
      audience="investor"
      site={site}
      date={date}
      reference={reference}
      preview="Private placement, for eligible investors only. A few questions before we send the PPM."
      eyebrow="Private and confidential. For the addressee only."
      title="Flyingbee Investment Fund"
      reason={`You are receiving this email in reply to your enquiry ${reference}. If you would prefer not to hear from us again, please reply to say so.`}
    >
      <Salutation name={name} />
      <Words {...words} />
      <Label>Key terms</Label>
      <Facts rows={pairs(facts)} />
      <Label>Before you invest</Label>
      <Steps
        items={[
          "Please confirm how you would invest, so that we can check your eligibility.",
          "We will send you the Private Placement Memorandum privately. SEBI requires that you acknowledge receiving it before making any commitment.",
          "We will arrange a call with the fund team to answer your questions about the strategy and the terms.",
        ]}
      />
      <Signature name={sender.name} role={sender.role ?? "Relationship Manager, Flyingbee Investment Fund"} lines={senderLines(sender)} />
      <Disclosure title="Important information" paragraphs={AIF_PRIVATE_PLACEMENT} />
    </MoneybeeEmail>
  );
}

export type MeetingConfirmationProps = Base & {
  words: WordsValue;
  sender: Sender;
  when: string;
  duration?: string;
  place: { kind: "office"; address: string; mapHref?: string } | { kind: "video"; href: string; label?: string };
  attendees: string;
  agenda: string[];
  bring?: string[];
};

export const meetingConfirmationSubject = ({ when }: Pick<MeetingConfirmationProps, "when">) => `Our meeting on ${when}`;

/** Confirms a meeting with a prospect or client, with what to expect and bring. */
export function MeetingConfirmation({ name, reference, words, sender, when, duration, place, attendees, agenda, bring = [], date, site }: MeetingConfirmationProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={reference} preview={`${when}, ${place.kind === "office" ? "at our office" : "by video call"}.`} eyebrow="Meeting" title="Our meeting is confirmed" reason={`You are receiving this email about your enquiry ${reference}.`}>
      <Salutation name={name} />
      <Words {...words} />
      <Facts
        rows={[
          [{ label: "When", value: when }, { label: "Length", value: duration ?? "About 45 minutes" }],
          [{ label: place.kind === "office" ? "Where" : "How", value: place.kind === "office" ? place.address : (place.label ?? "Video call, link below") }],
          [{ label: "With", value: attendees }],
        ]}
      />
      {place.kind === "office" && place.mapHref ? <P small muted style={{ marginTop: 8 }}><InlineLink href={place.mapHref}>Directions to our office</InlineLink></P> : null}
      <Label>What we will cover</Label>
      <Steps items={agenda} />
      {bring.length ? (
        <>
          <Label>Please have with you</Label>
          <Steps items={bring} />
        </>
      ) : null}
      {place.kind === "video" ? <Action href={place.href}>Join the call</Action> : null}
      <Signature name={sender.name} role={sender.role} lines={senderLines(sender)} />
    </MoneybeeEmail>
  );
}

export type MeetingFollowUpProps = Base & { words: WordsValue; sender: Sender; meetingOn: string; nextSteps: string[]; documents: DocumentItem[] };

export const meetingFollowUpSubject = ({ meetingOn }: Pick<MeetingFollowUpProps, "meetingOn">) => `Following our meeting on ${meetingOn}`;

/** After a meeting: what was discussed in the sender's words, then the agreed steps, each naming who and by when. */
export function MeetingFollowUp({ name, reference, words, sender, meetingOn, nextSteps, documents, date, site }: MeetingFollowUpProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={reference} preview={`A summary of our meeting on ${meetingOn}, and the agreed next steps.`} eyebrow="Meeting follow-up" title={`Following our meeting on ${meetingOn}`} reason={`You are receiving this email about your enquiry ${reference}.`}>
      <Salutation name={name} />
      <Words {...words} />
      {nextSteps.length ? (
        <>
          <Label>Agreed next steps</Label>
          <Steps items={nextSteps} />
        </>
      ) : null}
      {documents.length ? (
        <>
          <Label>Documents</Label>
          <Documents items={documents} />
        </>
      ) : null}
      <Signature name={sender.name} role={sender.role} lines={senderLines(sender)} />
    </MoneybeeEmail>
  );
}

/** What a new PMS client sends, and the order things happen in (PMS MC Annexure 4B, 4.3.4). */
export const PMS_CHECKLIST = {
  items: [
    { name: "PAN card", note: "Identity" },
    { name: "Aadhaar or passport", note: "Address" },
    { name: "Cancelled cheque", note: "Bank account" },
    { name: "Client master list, if you have a demat account", note: "Demat account" },
    { name: "Signed PMS agreement, with the fees annexure signed separately", note: "Agreement" },
  ],
  steps: [
    "Please read the Disclosure Document before you sign anything.",
    "We check your documents and complete your KYC.",
    "You sign the agreement, and the fees annexure separately, noting that you have understood it.",
    "We open your account and send your custodian, demat and bank details within 3 working days.",
  ],
};

/** What a new Flyingbee investor sends (AIF MC 3.2.2: the PPM acknowledged before any commitment). */
export const AIF_CHECKLIST = {
  items: [
    { name: "Signed acknowledgement that you have received the PPM", note: "Before any commitment" },
    { name: "Signed contribution agreement", note: "Agreement" },
    { name: "PAN card, and Aadhaar or passport", note: "KYC" },
    { name: "FATCA and CRS declaration", note: "Tax residency" },
  ],
  steps: ["We check your eligibility and documents.", "You pay your contribution into the fund's bank account as given in the PPM.", "Units are allotted, and the registrar sends your statement of account."],
};

export type ChecklistProps = Base & {
  product: "pms" | "aif";
  words: WordsValue;
  sender: Sender;
  items: { name: string; note: string }[];
  steps: string[];
  sendTo: string;
};

export const checklistSubject = ({ product, reference }: Pick<ChecklistProps, "product" | "reference">) => (product === "pms" ? `Opening your Moneybee PMS account (${reference})` : `Investing in Flyingbee Investment Fund (${reference})`);

/** What a new client must send, and in what order it happens. Includes the bank-details warning. */
export function Checklist({ name, reference, product, words, sender, items, steps, sendTo, date, site }: ChecklistProps) {
  return (
    <MoneybeeEmail
      audience="investor"
      site={site}
      date={date}
      reference={reference}
      preview={`${items.length} documents to send, and what happens after.`}
      eyebrow={product === "pms" ? "Account opening, Portfolio Management Service" : "Private and confidential. Subscription, Flyingbee Investment Fund"}
      title={product === "pms" ? "Opening your PMS account" : "Your subscription to Flyingbee"}
      reason={`You are receiving this email because you asked to ${product === "pms" ? "open a Moneybee PMS account" : "invest in Flyingbee Investment Fund"}.`}
    >
      <Salutation name={name} />
      <Words {...words} />
      <Label>What we need from you</Label>
      <Facts rows={items.map((item) => [{ label: item.note, value: item.name }])} />
      <P small muted style={{ marginTop: 8 }}>
        Please send these to {sendTo}, or hand them to your relationship manager.
      </P>
      <Label>What happens next</Label>
      <Steps items={steps} />
      {product === "pms" ? <P>You may open the account directly with Moneybee, without a distributor. A direct account carries no charges other than statutory ones.</P> : null}
      <Notice>
        <strong>Moneybee will never send you new bank details by email.</strong> If you receive a message asking you to pay into a different account, do not pay. Call us first.
      </Notice>
      <Signature name={sender.name} role={sender.role} lines={senderLines(sender)} />
      {product === "aif" ? <Disclosure paragraphs={AIF_PRIVATE_PLACEMENT} /> : null}
    </MoneybeeEmail>
  );
}

export type EventInvitationProps = { name: string; date?: string; site?: SiteDetails; words: WordsValue; title: string; when: string; where: string; speakers: string[]; agenda: string[]; replyBy: string; href: string; unsubscribeHref: string; eligibleOnly?: boolean };

export const eventInvitationSubject = ({ title, when }: Pick<EventInvitationProps, "title" | "when">) => `Invitation: ${title}, ${when}`;

/** An investor meet or call, to contacts who chose to hear about events. */
export function EventInvitation({ name, words, title, when, where, speakers, agenda, replyBy, href, unsubscribeHref, eligibleOnly, date, site }: EventInvitationProps) {
  return (
    <MoneybeeEmail
      audience="investor"
      site={site}
      date={date}
      preview={`${when}, ${where}. Please reply by ${replyBy}.`}
      eyebrow={eligibleOnly ? "Invitation. For eligible investors only." : "Invitation"}
      title={title}
      reason="You are receiving this invitation because you asked to hear about Moneybee events."
      unsubscribe={{ label: "Stop event invitations.", href: unsubscribeHref }}
    >
      <Salutation name={name} />
      <Words {...words} />
      <Facts rows={[[{ label: "When", value: when }], [{ label: "Where", value: where }], [{ label: "Speakers", value: speakers.join(", ") }], [{ label: "Please reply by", value: replyBy }]]} />
      <Label>Agenda</Label>
      <Steps items={agenda} />
      <Action href={href}>Accept the invitation</Action>
      <P small muted style={{ marginTop: 16 }}>
        If you cannot attend, we will send you the recording afterwards.
      </P>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

