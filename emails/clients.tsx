import { Link } from "react-email";
import { DEFAULT_DETAILS, type SiteDetails } from "@/lib/site/details";
import { Action, Disclosure, signedNumber, type DocumentItem, Documents, Facts, InlineLink, Label, Notice, P, Quote, ReturnBars, type ReturnRow, ReturnTable, Salutation, Signature, Steps, Weights, Words, type WordsValue } from "./blocks";
import { AIF_NAMES, aifPerformanceDisclosure, INDICATIVE_NAV, PMS_NAMES, pmsDisclosure } from "./disclosures";
import { grievanceEmail, MoneybeeEmail } from "./frame";

/*
 * Emails to people who hold a Moneybee product. Statements and notices are
 * sent whatever the person's mailing choices; only the monthly update and
 * insights carry an unsubscribe link. Deadlines and required wording are
 * from the PMS and AIF master circulars and the SCORES circular
 * (.plannotator/email-templates/research/sebi-communications.md).
 */

type Base = { name: string; date?: string; site?: SiteDetails };
const ALWAYS_SENT = "Statements and regulatory notices are sent regardless of your mailing choices.";
const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

export type WelcomeProps = Base & { clientCode: string; approach: string; benchmark: string; activatedOn: string; distributor: string; manager: { name: string; phone?: string; email?: string }; documents: DocumentItem[] };

export const welcomeSubject = () => "Your Moneybee PMS account is open";

/** When a PMS account is activated: everything the client will need to refer to later. */
export function Welcome({ name, clientCode, approach, benchmark, activatedOn, distributor, manager, documents, date, site }: WelcomeProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={clientCode} preview={`Client code ${clientCode}. Your account details and what to expect from us.`} eyebrow="Portfolio Management Service" title="Your account is open" reason={`You are receiving this email because your Moneybee PMS account was opened on ${activatedOn}. ${ALWAYS_SENT}`}>
      <Salutation name={name} />
      <P>Thank you for placing your trust in Moneybee. Your Portfolio Management Service account is now open. Please keep this email; it holds the details you will need when you write to us.</P>
      <Facts
        rows={[
          [{ label: "Client code", value: clientCode, mono: true }, { label: "Account opened", value: activatedOn }],
          [{ label: "Investment approach", value: approach }, { label: "Benchmark", value: benchmark }],
          [{ label: "Distributor", value: distributor }, { label: "Relationship manager", value: manager.name }],
        ]}
      />
      <Label>What you will receive from us</Label>
      <Steps
        items={[
          "Your custodian, demat and bank account details, within 3 working days, in a separate email.",
          "A monthly update on the portfolio, unless you ask us to stop it.",
          "A quarterly report on your account, in the format SEBI prescribes, with your holdings, transactions, fees and performance.",
          "Your statements in the investor portal, where you can sign in at any time.",
        ]}
      />
      {documents.length ? (
        <>
          <Label>Documents</Label>
          <Documents items={documents} />
        </>
      ) : null}
      <Action href="/portal/login">Sign in to the investor portal</Action>
      <Signature name={manager.name} role="Relationship Manager" lines={[[manager.phone, manager.email].filter(Boolean).join("  ·  ")].filter(Boolean)} />
    </MoneybeeEmail>
  );
}

export type AccountDetailsProps = Base & { clientCode: string; custodian: string; demat: string; bank: { name: string; account: string; ifsc: string } };

export const accountDetailsSubject = ({ clientCode }: Pick<AccountDetailsProps, "clientCode">) => `Your PMS account details (${clientCode})`;

/** Within 3 working days of opening (PMS MC Annexure 4B items 16 and 29). */
export function AccountDetails({ name, clientCode, custodian, demat, bank, date, site }: AccountDetailsProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={clientCode} preview="Your custodian, demat account and the bank account that holds your funds." eyebrow="Portfolio Management Service" title="Your account details" reason={`You are receiving this email because your Moneybee PMS account was opened. ${ALWAYS_SENT}`}>
      <Salutation name={name} />
      <P>As SEBI requires, here are the details of where your securities and funds are held. Your securities are held in your own name.</P>
      <Facts
        rows={[
          [{ label: "Client code", value: clientCode, mono: true }, { label: "Custodian", value: custodian }],
          [{ label: "Demat account", value: demat, mono: true }],
          [{ label: "Bank account for your funds", value: `${bank.name}, ${bank.account}` }, { label: "IFSC", value: bank.ifsc, mono: true }],
        ]}
      />
      <Notice>
        <strong>Moneybee will never send you new bank details by email.</strong> If you receive a message asking you to pay into a different account, do not pay. Call us first.
      </Notice>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

export type FundsReceivedProps = Base & { product: "pms" | "aif"; reference: string; amount: string; receivedOn: string; facts: { label: string; value: string }[] };

export const fundsReceivedSubject = ({ product, amount }: Pick<FundsReceivedProps, "product" | "amount">) => (product === "pms" ? `We have received ${amount} for your PMS account` : `Your contribution of ${amount} to Flyingbee has been received`);

/** Money received: for the PMS, received and invested; for Flyingbee, units allotted. */
export function FundsReceived({ name, product, reference, amount, receivedOn, facts, date, site }: FundsReceivedProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={reference} preview={`${amount}, received on ${receivedOn}.`} eyebrow={product === "pms" ? "Portfolio Management Service" : "Private and confidential. Flyingbee Investment Fund"} title={product === "pms" ? "Your funds have been received" : "Your contribution has been received"} reason={`You are receiving this email as a Moneybee ${product === "pms" ? "PMS client" : "unit holder"}. ${ALWAYS_SENT}`}>
      <Salutation name={name} />
      <P>{product === "pms" ? `We have received ${amount} on ${receivedOn}, and will invest it in your portfolio according to the investment approach.` : `We have received your contribution of ${amount} on ${receivedOn}, and units have been allotted to you as below.`}</P>
      <Facts rows={[[{ label: "Amount", value: amount }, { label: "Received", value: receivedOn }], ...facts.map((fact) => [fact])]} />
      {product === "aif" ? <P small muted style={{ marginTop: 10 }}>{INDICATIVE_NAV}</P> : null}
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

export type PmsMonthlyUpdateProps = Base & {
  month: string;
  asOf: string;
  rows: ReturnRow[];
  chart: ReturnRow[];
  words: WordsValue;
  changes: { label: string; value: string }[];
  documents: DocumentItem[];
  nextUpdate: string;
  unsubscribeHref: string;
};

export const pmsMonthlyUpdateSubject = ({ month }: Pick<PmsMonthlyUpdateProps, "month">) => `Moneybee PMS: update for ${month}`;

/** The monthly update to PMS clients, from the approved fact sheet. Result first, then the letter. */
export function PmsMonthlyUpdate({ name, month, asOf, rows, chart, words, changes, documents, nextUpdate, unsubscribeHref, date, site = DEFAULT_DETAILS }: PmsMonthlyUpdateProps) {
  const oneMonth = rows.find((row) => /^1 month/i.test(row.period));
  const five = rows.find((row) => /^5 year/i.test(row.period));
  return (
    <MoneybeeEmail
      audience="investor"
      site={site}
      date={date}
      eyebrow={`Monthly update, ${month}`}
      title={`Moneybee PMS in ${month}`}
      preview={oneMonth ? `The Moneybee PMS returned ${signedNumber(oneMonth.ours)}% in ${month}, against ${signedNumber(oneMonth.benchmark)}% for the ${PMS_NAMES.benchmark}.` : `The Moneybee PMS in ${month}.`}
      reason={`You are receiving the monthly update as a Moneybee PMS client. ${ALWAYS_SENT}`}
      unsubscribe={{ label: "Stop the monthly update.", href: unsubscribeHref }}
    >
      <Salutation name={name} />
      {oneMonth ? (
        <P>
          In {month}, the Moneybee PMS returned {signedNumber(oneMonth.ours)}%, against {signedNumber(oneMonth.benchmark)}% for the {PMS_NAMES.benchmark}.
          {five ? ` Over five years it has returned ${signedNumber(five.ours)}% a year, against ${signedNumber(five.benchmark)}%.` : ""} Returns are time weighted and after expenses, as set out in the note at the end of this letter.
        </P>
      ) : null}
      <Label>Performance to {longDate(asOf)}</Label>
      <ReturnBars rows={chart} names={PMS_NAMES} />
      <ReturnTable rows={rows} names={PMS_NAMES} />
      <P muted small style={{ marginTop: 10 }}>
        Returns in %. Periods above 1 year are CAGR. Your own portfolio&apos;s return depends on when you invested; it is shown in your statement in the investor portal.
      </P>
      <Label>From the investment team</Label>
      <Words {...words} />
      {changes.length ? (
        <>
          <Label>Changes to the portfolio</Label>
          <Facts rows={changes.map((change) => [change])} />
        </>
      ) : null}
      {documents.length ? (
        <>
          <Label>Documents</Label>
          <Documents items={documents} />
        </>
      ) : null}
      <P style={{ marginTop: 24 }}>
        The next update will follow {nextUpdate}. For any question about your account, please write to your relationship manager{site.phones[0] ? ` or call ${site.phones[0].number}` : ""}.
      </P>
      <Signature name="The Investment Team" role="Moneybee Portfolio Management Service" />
      <Disclosure paragraphs={pmsDisclosure(asOf, site)} />
    </MoneybeeEmail>
  );
}

export type PmsQuarterlyReportProps = Base & { quarter: string; clientCode: string; approach: string; benchmark: string; distributor: string; href: string; contact: string };

export const pmsQuarterlyReportSubject = ({ quarter }: Pick<PmsQuarterlyReportProps, "quarter">) => `Your PMS account statement for the quarter ended ${quarter}`;

/** The cover note for the quarterly report; the report itself follows SEBI's Annexure 5D (PMS MC 5.5.1). */
export function PmsQuarterlyReport({ name, quarter, clientCode, approach, benchmark, distributor, href, contact, date, site }: PmsQuarterlyReportProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={clientCode} preview={`Your holdings, transactions, fees and performance for the quarter ended ${quarter}.`} eyebrow="Quarterly report" title={`Your statement for the quarter ended ${quarter}`} reason={`You are receiving this report as a Moneybee PMS client. ${ALWAYS_SENT}`}>
      <Salutation name={name} />
      <P>Your account statement for the quarter ended {quarter} is ready in the investor portal. It is in the format SEBI prescribes for portfolio managers.</P>
      <Facts
        rows={[
          [{ label: "Client code", value: clientCode, mono: true }, { label: "Quarter ended", value: quarter }],
          [{ label: "Investment approach", value: approach }, { label: "Benchmark", value: benchmark }],
          [{ label: "Distributor", value: distributor }],
        ]}
      />
      <Label>What the statement contains</Label>
      <Steps
        items={[
          "Account overview: your details, investment approach, benchmark and the amount managed.",
          "Portfolio: allocation, value at the start and end of the quarter, and every inflow, outflow, fee and expense.",
          "Performance: your portfolio, the investment approach and the benchmark, over 1, 3, 5 and 10 years and since inception.",
          "Transactions and holdings at the end of the quarter.",
          "Other information: any deviation from the investment approach, related party investments and passive breaches.",
        ]}
      />
      <Action href={href}>Open the statement</Action>
      <Notice>If any of your details have changed, please write to {contact}. Performance data provided in the statement is not verified by any regulatory authority.</Notice>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

export type FeeStatementProps = Base & { clientCode: string; period: string; lines: { label: string; value: string }[]; highWaterMark?: { before: string; after: string }; hurdle?: string; total: string; href: string };

export const feeStatementSubject = ({ period }: Pick<FeeStatementProps, "period">) => `Your PMS fee statement for ${period}`;

/** Fees charged for a period, with the high water mark before and after (PMS MC 6.1.3.6). */
export function FeeStatement({ name, clientCode, period, lines, highWaterMark, hurdle, total, href, date, site }: FeeStatementProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={clientCode} preview={`Total charged for ${period}: ${total}.`} eyebrow="Fee statement" title={`Fees for ${period}`} reason={`You are receiving this statement as a Moneybee PMS client. ${ALWAYS_SENT}`}>
      <Salutation name={name} />
      <P>Here are the fees and expenses charged to your account for {period}, calculated as set out in the fees annexure to your agreement.</P>
      <Facts rows={[...lines.map((line) => [line]), [{ label: "Total charged", value: total }]]} />
      {highWaterMark || hurdle ? (
        <>
          <Label>How the performance fee was worked out</Label>
          <Facts rows={[...(hurdle ? [[{ label: "Hurdle rate", value: hurdle }]] : []), ...(highWaterMark ? [[{ label: "High water mark before", value: highWaterMark.before }, { label: "High water mark after", value: highWaterMark.after }]] : [])]} />
          <P small muted style={{ marginTop: 10 }}>A performance fee is charged only on the increase above the previous high water mark, the highest value your portfolio has reached on a date fees were charged.</P>
        </>
      ) : null}
      <Action href={href}>See the calculation</Action>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

export type AifInvestorUpdateProps = Base & {
  asOf: string;
  rows: ReturnRow[];
  chart: ReturnRow[];
  firstClose: string;
  nav: string;
  facts: { label: string; value: string }[];
  sectors: { name: string; weight: number }[];
  words: WordsValue;
  risks: { label: string; value: string }[];
  documents: DocumentItem[];
  contact: string;
};

export const aifInvestorUpdateSubject = ({ asOf }: Pick<AifInvestorUpdateProps, "asOf">) => `Private and confidential: Flyingbee Investment Fund, update to ${longDate(asOf)}`;

/** The periodic update to Flyingbee unit holders: NAV, returns (with the agency report), sectors, material risks. */
export function AifInvestorUpdate({ name, asOf, rows, chart, firstClose, nav, facts, sectors, words, risks, documents, contact, date, site }: AifInvestorUpdateProps) {
  const six = rows.find((row) => /^6 month/i.test(row.period));
  return (
    <MoneybeeEmail
      audience="investor"
      site={site}
      date={date}
      eyebrow="Private and confidential. For unit holders of Flyingbee Investment Fund only."
      title={`Flyingbee Investment Fund, update to ${longDate(asOf)}`}
      preview={six ? `Flyingbee returned ${signedNumber(six.ours)}% over six months, against ${signedNumber(six.benchmark)}% for the ${AIF_NAMES.benchmark}.` : `Flyingbee Investment Fund, update to ${longDate(asOf)}.`}
      reason="You are receiving this update as a unit holder of Flyingbee Investment Fund. Please do not forward it."
    >
      <Salutation name={name} />
      {six ? (
        <P>
          Over the six months to {longDate(asOf)}, Flyingbee Investment Fund returned {signedNumber(six.ours)}%, against {signedNumber(six.benchmark)}% for the {AIF_NAMES.benchmark}. The fund declared its first close on {firstClose}, so it does not yet have a one year record. Returns are net of management fees, expenses and taxes.
        </P>
      ) : null}
      <Facts rows={[...facts.map((fact) => [fact]), [{ label: "NAV per unit", value: nav }]]} />
      {chart.length ? (
        <>
          <Label>Performance (TWRR)</Label>
          <ReturnBars rows={chart} names={AIF_NAMES} />
          <ReturnTable rows={rows} names={AIF_NAMES} />
        </>
      ) : null}
      {sectors.length ? (
        <>
          <Label>Top five sectors, % of assets</Label>
          <Weights rows={sectors} />
        </>
      ) : null}
      <Label>From the fund manager</Label>
      <Words {...words} />
      {risks.length ? (
        <>
          <Label>Material risks</Label>
          <Facts rows={risks.map((risk) => [risk])} />
        </>
      ) : null}
      <Label>Your units</Label>
      <P>Your units, NAV and capital account are in the statement of account sent by the fund&apos;s registrar. {INDICATIVE_NAV}</P>
      {documents.length ? (
        <>
          <Label>Documents</Label>
          <Documents items={documents} />
        </>
      ) : null}
      <P style={{ marginTop: 24 }}>For any question about your investment, please write to {contact}.</P>
      <Signature name="The Fund Management Team" role="Flyingbee Investment Fund" />
      {chart.length ? <Disclosure paragraphs={aifPerformanceDisclosure(asOf)} /> : null}
    </MoneybeeEmail>
  );
}

export type StatementReadyProps = Base & { reference: string; statement: string; period: string; href: string };

export const statementReadySubject = ({ statement }: Pick<StatementReadyProps, "statement">) => `${statement} is ready`;

/** A statement or report has been added to the investor portal. */
export function StatementReady({ name, reference, statement, period, href, date, site }: StatementReadyProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={reference} preview={`${statement}, for ${period}, in the investor portal.`} eyebrow="Investor portal" title={`${statement} is ready`} reason={`You are receiving this email because a new document was added to your investor portal. ${ALWAYS_SENT}`}>
      <Salutation name={name} />
      <P>{statement} for {period} has been added to your investor portal. For your security, we do not attach statements to emails.</P>
      <Action href={href}>Open the investor portal</Action>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

export type WithdrawalProps = Base & { reference: string; stage: "received" | "paid"; amount: string; account: string; requestedOn: string; expectedBy?: string; paidOn?: string; utr?: string };

export const withdrawalSubject = ({ stage, amount }: Pick<WithdrawalProps, "stage" | "amount">) => (stage === "received" ? `Your withdrawal request for ${amount} has been received` : `Your withdrawal of ${amount} has been paid`);

/** A withdrawal: first that it was received and when to expect it, then that it was paid. */
export function Withdrawal({ name, reference, stage, amount, account, requestedOn, expectedBy, paidOn, utr, date, site }: WithdrawalProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={reference} preview={stage === "received" ? `Expected in your account by ${expectedBy}.` : `Paid on ${paidOn}.`} eyebrow="Withdrawal" title={stage === "received" ? "Your withdrawal request has been received" : "Your withdrawal has been paid"} reason={`You are receiving this email about a withdrawal from your Moneybee account. ${ALWAYS_SENT}`}>
      <Salutation name={name} />
      <P>{stage === "received" ? `We have received your request to withdraw ${amount}. We will pay it to your registered bank account below.` : `We have paid ${amount} to your registered bank account.`}</P>
      <Facts
        rows={[
          [{ label: "Amount", value: amount }, { label: "Requested", value: requestedOn }],
          [{ label: "Paid to", value: account }],
          stage === "received" ? [{ label: "Expected in your account by", value: expectedBy ?? "" }] : [{ label: "Paid on", value: paidOn ?? "" }, { label: "Bank reference (UTR)", value: utr ?? "", mono: true }],
        ]}
      />
      <Notice>If you did not ask for this withdrawal, please call us immediately.</Notice>
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

export type NoticeOfChangeProps = Base & { reference: string; product: "pms" | "aif"; change: string; effectiveFrom: string; words: WordsValue; options: string[]; respondBy?: string };

export const noticeOfChangeSubject = ({ change }: Pick<NoticeOfChangeProps, "change">) => `Notice of change: ${change}`;

/** A change to a fund or service the investor must be told of; for Flyingbee, with the exit option (AIF MC 13.1.1). */
export function NoticeOfChange({ name, reference, product, change, effectiveFrom, words, options, respondBy, date, site }: NoticeOfChangeProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={reference} preview={`Effective from ${effectiveFrom}.${respondBy ? ` Please respond by ${respondBy}.` : ""}`} eyebrow={product === "pms" ? "Notice, Portfolio Management Service" : "Private and confidential. Notice to unit holders of Flyingbee Investment Fund"} title={`Notice of change: ${change}`} reason={`You are receiving this notice as a Moneybee ${product === "pms" ? "PMS client" : "unit holder"}. ${ALWAYS_SENT}`}>
      <Salutation name={name} />
      <Words {...words} />
      <Facts rows={[[{ label: "What changes", value: change }], [{ label: "Effective from", value: effectiveFrom }, ...(respondBy ? [{ label: "Please respond by", value: respondBy }] : [])]]} />
      <Label>Your options</Label>
      <Steps items={options} />
      <Signature name="Compliance" />
    </MoneybeeEmail>
  );
}

export type KycDueProps = Base & { reference: string; item: string; dueBy: string; how: string[] };

export const kycDueSubject = ({ item }: Pick<KycDueProps, "item">) => `Action needed: ${item}`;

/** Something the investor must update, such as KYC or a nomination. */
export function KycDue({ name, reference, item, dueBy, how, date, site }: KycDueProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={reference} preview={`Please complete this by ${dueBy}.`} eyebrow="Action needed" title={item} reason={`You are receiving this email because your Moneybee account needs an update. ${ALWAYS_SENT}`}>
      <Salutation name={name} />
      <P>Our records show that your account needs the update below. Please complete it by {dueBy}.</P>
      <Facts rows={[[{ label: "What is needed", value: item }, { label: "By", value: dueBy }]]} />
      <Label>How to do it</Label>
      <Steps items={how} />
      <Signature name="Client Services" />
    </MoneybeeEmail>
  );
}

/** Who sets the deadline: a PMS complaint made to us, a Flyingbee one, or one raised on SCORES. */
export type ComplaintRule = "pms" | "aif" | "scores";
const COMPLAINT_DEADLINE: Record<ComplaintRule, string> = {
  pms: "within 30 working days of receiving it. Should we need further information from you, we will ask for it promptly, and the 30 days will run from when we receive it",
  aif: "within 21 days of receiving it",
  scores: "within 21 days of receiving it, and upload our response to SCORES",
};

export type ComplaintRegisteredProps = Base & { number: string; receivedAt: string; concerning: string; dueBy: string; rule: ComplaintRule; message: string };

export const complaintRegisteredSubject = ({ number }: Pick<ComplaintRegisteredProps, "number">) => `Your complaint has been registered (${number})`;

/** A complaint is logged. No rule sets a time to acknowledge, so none is promised; the response deadline follows the product. */
export function ComplaintRegistered({ name, number, receivedAt, concerning, dueBy, rule, message, date, site = DEFAULT_DETAILS }: ComplaintRegisteredProps) {
  const grievance = grievanceEmail(site);
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={number} preview={`We will respond in writing by ${dueBy}. Please quote ${number}.`} eyebrow="Investor complaint" title="Your complaint has been registered" reason={`You are receiving this email because you raised a complaint with Moneybee on ${receivedAt.split(",")[0]}.`} complaintRoute={false}>
      <Salutation name={name} />
      <P>We have registered your complaint and will respond to you in writing by {dueBy}, {COMPLAINT_DEADLINE[rule]}.</P>
      <Facts
        rows={[
          [{ label: "Complaint number", value: number, mono: true }, { label: "Received", value: receivedAt }],
          [{ label: "Concerning", value: concerning }, { label: "Response due by", value: dueBy }],
          [{ label: "Handled by", value: `Investor Grievance Officer, ${site.company}` }],
        ]}
      />
      <Label>Your complaint, as received</Label>
      <Quote>{message}</Quote>
      <Label>What happens next</Label>
      <Steps
        items={[
          "Our grievance officer will review your account records, and may call you for further details.",
          `We will write to you with our findings and any action taken, by ${dueBy}.`,
          <>
            If you are not satisfied with our response, or do not receive it by then, you may lodge the complaint with SEBI through <InlineLink href="https://scores.sebi.gov.in">SCORES</InlineLink>. You may also take the dispute to <InlineLink href="https://smartodr.in">SMART ODR</InlineLink>, the securities market&apos;s online conciliation and arbitration portal.
          </>,
        ]}
      />
      <Notice>Please quote complaint number {number} in any further correspondence about this matter.</Notice>
      <Signature name="Investor Grievance Officer" lines={[[grievance, site.phones[0]?.number].filter(Boolean).join("  ·  ")]} />
    </MoneybeeEmail>
  );
}

export type ComplaintResolvedProps = Base & { number: string; receivedAt: string; resolvedOn: string; words: WordsValue; actions: string[] };

export const complaintResolvedSubject = ({ number }: Pick<ComplaintResolvedProps, "number">) => `Our response to your complaint (${number})`;

/** The written response: findings in the officer's words, actions taken, and the route if the investor is not satisfied. */
export function ComplaintResolved({ name, number, receivedAt, resolvedOn, words, actions, date, site = DEFAULT_DETAILS }: ComplaintResolvedProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} reference={number} preview="Our findings, the action taken, and what you can do if you are not satisfied." eyebrow="Investor complaint" title="Our response to your complaint" reason="You are receiving this email in response to the complaint you raised with Moneybee." complaintRoute={false}>
      <Salutation name={name} />
      <Words {...words} />
      <Facts rows={[[{ label: "Complaint number", value: number, mono: true }, { label: "Received", value: receivedAt }], [{ label: "Responded", value: resolvedOn }]]} />
      {actions.length ? (
        <>
          <Label>Action taken</Label>
          <Steps items={actions} />
        </>
      ) : null}
      <Label>If you are not satisfied</Label>
      <P>
        You may lodge the complaint with SEBI through <InlineLink href="https://scores.sebi.gov.in">SCORES</InlineLink>, quoting our complaint number. You may also take the dispute to <InlineLink href="https://smartodr.in">SMART ODR</InlineLink>, the securities market&apos;s online conciliation and arbitration portal.
      </P>
      <Signature name="Investor Grievance Officer" lines={[grievanceEmail(site)]} />
    </MoneybeeEmail>
  );
}

export type InsightsProps = { name: string; date?: string; site?: SiteDetails; title: string; summary: string; href: string; unsubscribeHref: string };

export const insightsSubject = ({ title }: Pick<InsightsProps, "title">) => title;

/** A new article, to contacts who chose Insights. */
export function Insights({ name, title, summary, href, unsubscribeHref, date, site }: InsightsProps) {
  return (
    <MoneybeeEmail audience="investor" site={site} date={date} preview={summary} eyebrow="Insights" title={title} reason="You are receiving Insights because you asked for them." unsubscribe={{ label: "Stop Insights.", href: unsubscribeHref }}>
      <Salutation name={name} />
      <P>{summary}</P>
      <Action href={href}>Read the article</Action>
      <P small muted style={{ marginTop: 24 }}>
        This article is for information only and is not investment advice or an offer. Past performance may or may not be sustained in the future.{" "}
        <Link className="mb-muted" href="/investor-centre" style={{ color: "#5B5D61", textDecoration: "underline" }}>
          Disclosures
        </Link>
      </P>
      <Signature name="The Investment Team" />
    </MoneybeeEmail>
  );
}
