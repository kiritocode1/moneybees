import type { ReactElement } from "react";
import { STARTER_TEMPLATES, type StarterTemplateKey } from "@/lib/crm/starter-content";
import { fillTemplate, fillTemplateHtml } from "@/lib/crm/template";
import { AIF_PRODUCT } from "@/lib/insights";
import { DEFAULT_DETAILS, type SiteDetails } from "@/lib/site/details";
import { AIF_DECK_FIGURES, DECK_FIGURES } from "@/lib/site/tokens";
import { ApplicationReceived, InterviewInvitation, NotTakenForward, Offer } from "./applicants";
import type { WordsValue } from "./blocks";
import * as client from "./clients";
import { chartRows, emailRows } from "./disclosures";
import * as prospect from "./prospects";
import * as security from "./security";
import * as staff from "./staff";

/*
 * Every email Moneybee sends: who gets it, when, how it goes out, the rule
 * behind it, and how to draw it. The /admin Emails page (one page for seeing,
 * editing and sending) draws from this list, and emails.test.mjs renders
 * every one. `compose` turns a template's words and an email's facts into
 * the subject and the email; the page's preview, its test send and Send to
 * a client all go through it.
 */

export const GROUPS = ["Prospects", "Clients", "Account security", "Applicants", "Staff"] as const;
export type Group = (typeof GROUPS)[number];

/** How an email goes out. Only "here" is sent from the Emails page itself. */
export type Channel = "automatic" | "enquiry" | "hiring" | "here" | "mailing" | "system";
export const CHANNEL_LABELS: Record<Channel, string> = { automatic: "Automatic", enquiry: "From an enquiry", hiring: "From Hiring", here: "Send here", mailing: "Mailing", system: "System" };

/** A fact staff fill in before sending from the page; `sample` is what the preview shows until they do. */
export type Field = { key: string; label: string; sample: string; kind?: "text" | "textarea" | "lines" | "select"; options?: readonly string[]; optional?: boolean };

/** Words a template may use, besides the person's {{name}} and {{firstName}}; `sample` fills it in previews. */
export type MergeField = { key: string; label: string; sample?: string };

export type Values = Readonly<Record<string, string>>;
type DrawInput = { words: WordsValue; values: Values; name: string; site?: SiteDetails };

export type CatalogueEntry = {
  id: string;
  group: Group;
  name: string;
  to: string;
  when: string;
  channel: Channel;
  rule?: string;
  /** For mailings: what has to exist before it can go to a list. */
  needs?: string;
  /** The starter template whose words it uses; the row in Email templates holds the words staff edit. */
  template?: StarterTemplateKey;
  /** For "here": the facts staff fill in. */
  fields?: Field[];
  /** For templated emails that are not sent from here: the words they may use. */
  merge?: MergeField[];
  /** The subject when there is no template. */
  subject?: (values: Values) => string;
  draw: (input: DrawInput) => ReactElement;
};

/** The values merge fields and facts take in previews and test sends. */
export const SAMPLE_VALUES = {
  firstName: "Rohan",
  name: "Rohan Mehta",
  reference: "ENQ-00042",
  role: "Equity Research Analyst",
  keptUntil: "16 October 2027",
  interviewAt: "Tuesday 21 October, 11:00 am",
  interviewPlace: "Moneybee, Lower Parel",
  interviewWith: "the research team",
  replyBy: "10:42 am on Friday 17 October 2026",
  meetingAt: "Tuesday 21 October, 4:00 pm",
  meetingOn: "21 October 2026",
  senderName: "Aditi Sharma",
} as const;

const DATE = "16 October 2026";
const SENDER = { name: "Aditi Sharma", role: "Relationship Manager", phone: "+91 98672 90143", email: "aditi.sharma@moneybee.in" };
const MESSAGE = "I run a family business and want a long-term equity allocation outside mutual funds. How often do you report, and can I see the stocks in my own demat?";
const PMS_ROWS = emailRows(DECK_FIGURES.rows);
const PMS_CHART = chartRows(DECK_FIGURES.rows);
const AIF_ROWS = emailRows(AIF_DECK_FIGURES.rows);
const FACT_SHEET = { name: "Moneybee PMS fact sheet, July 2026", note: "PDF", href: "/investor-centre" };
const DD = { name: "Disclosure Document", note: "PDF. Please read it, in particular the risk factors, before investing.", href: "/investor-centre" };
const OFFICE = `${DEFAULT_DETAILS.address.line1} ${DEFAULT_DETAILS.address.line2}`;
const PRODUCTS = ["Portfolio Management Service", "Flyingbee Investment Fund"] as const;
const isAif = (value: string | undefined) => value === PRODUCTS[1];
const lines = (value: string | undefined) => (value ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
const COMPLAINT_RULES = { "PMS, made to us": "pms", "Flyingbee, made to us": "aif", "Raised on SCORES": "scores" } as const;

const ENQUIRY_MERGE: MergeField[] = [{ key: "reference", label: "Reference" }, { key: "senderName", label: "Sender" }];
const APPLICANT_MERGE: MergeField[] = [{ key: "role", label: "Role" }, { key: "reference", label: "Reference" }, { key: "keptUntil", label: "Kept until" }, { key: "senderName", label: "Sender" }];

export const CATALOGUE: CatalogueEntry[] = [
  // Prospects
  {
    id: "enquiry-received", group: "Prospects", name: "Enquiry received", to: "The person who sent a /contact form", when: "When the form is sent", channel: "automatic", template: "enquiryAck",
    merge: [{ key: "reference", label: "Reference" }, { key: "replyBy", label: "Reply due by" }],
    draw: ({ words, name, site }) => <prospect.EnquiryReceived name={name} date={DATE} site={site} reference="ENQ-00042" kind="pms" receivedAt="16 Oct 2026, 10:42 am" replyBy="17 Oct 2026, 10:42 am" answers={[{ label: "Full name", value: name }, { label: "Phone", value: "+91 98200 41873" }, { label: "Email", value: "rohan.mehta@gmail.com" }, { label: "City", value: "Pune" }, { label: "Investment amount", value: "1 crore to 5 crore" }]} message={MESSAGE} words={words} />,
  },
  {
    id: "enquiry-reply", group: "Prospects", name: "Reply to an enquiry", to: "The person who wrote in", when: "When staff reply from the enquiry", channel: "enquiry", template: "complaint", merge: ENQUIRY_MERGE,
    draw: ({ words, name, site }) => <prospect.Letter name={name} date={DATE} site={site} reference="ENQ-00042" eyebrow="Reply to your enquiry" title="Your PMS enquiry" words={words} sender={SENDER} reason="You are receiving this email in reply to your enquiry ENQ-00042." original={{ label: "Your enquiry of 16 October 2026", message: MESSAGE }} />,
  },
  {
    id: "pms-introduction", group: "Prospects", name: "PMS introduction", to: "A PMS prospect", when: "The relationship manager's first reply", channel: "enquiry", template: "pmsReply", merge: ENQUIRY_MERGE, rule: "PMS MC 2.3.2, 4.5.3.6, 5.6.4; Annexure 2A",
    draw: ({ words, name, site }) => <prospect.PmsIntroduction name={name} date={DATE} site={site} reference="ENQ-00042" words={words} sender={SENDER} asOf={DECK_FIGURES.asOf} rows={PMS_ROWS} chart={PMS_CHART} documents={[FACT_SHEET, DD]} />,
  },
  {
    id: "aif-introduction", group: "Prospects", name: "Flyingbee introduction", to: "A Flyingbee prospect", when: "The relationship manager's first reply", channel: "enquiry", template: "aifReply", merge: ENQUIRY_MERGE, rule: "AIF MC 3.2.1, 3.2.2, 22.5.1",
    draw: ({ words, name, site }) => <prospect.AifIntroduction name={name} date={DATE} site={site} reference="ENQ-00043" words={words} sender={{ ...SENDER, role: "Relationship Manager, Flyingbee Investment Fund" }} terms={AIF_PRODUCT.terms} />,
  },
  {
    id: "meeting-confirmation", group: "Prospects", name: "Meeting confirmation", to: "A prospect or client", when: "When a meeting is set, from the enquiry", channel: "enquiry", template: "meetingConfirmation", merge: [...ENQUIRY_MERGE, { key: "meetingAt", label: "Meeting time" }],
    draw: ({ words, name, site }) => <prospect.MeetingConfirmation name={name} date={DATE} site={site} reference="ENQ-00042" words={words} sender={SENDER} when={SAMPLE_VALUES.meetingAt} place={{ kind: "office", address: OFFICE, mapHref: "https://www.google.com/maps/dir/?api=1&destination=18.9987,72.82925" }} attendees="Aditi Sharma, and a member of the investment team" agenda={["How we choose companies, and how the portfolio is built.", "Fees, reporting and how your account is held.", "Your questions."]} />,
  },
  {
    id: "meeting-follow-up", group: "Prospects", name: "Meeting follow-up", to: "A prospect or client", when: "After a meeting, from the enquiry", channel: "enquiry", template: "meetingFollowUp", merge: [...ENQUIRY_MERGE, { key: "meetingOn", label: "Meeting date" }],
    draw: ({ words, name, site }) => <prospect.MeetingFollowUp name={name} date={DATE} site={site} reference="ENQ-00042" words={words} sender={SENDER} meetingOn={SAMPLE_VALUES.meetingOn} nextSteps={["Aditi Sharma sends the account opening checklist and the fees annexure, by 23 October.", "Rohan Mehta confirms whether to open a new demat account or use the existing one, by 28 October."]} documents={[FACT_SHEET]} />,
  },
  {
    id: "pms-checklist", group: "Prospects", name: "PMS account opening", to: "A new PMS client", when: "When they decide to open an account, from the enquiry", channel: "enquiry", template: "pmsChecklist", merge: ENQUIRY_MERGE, rule: "PMS MC Annexure 4B item 28, 4.3.4, 2.3.2",
    draw: ({ words, name, site }) => <prospect.Checklist name={name} date={DATE} site={site} reference="ENQ-00042" product="pms" words={words} sender={SENDER} sendTo="customersupportaif@moneybee.in" {...prospect.PMS_CHECKLIST} />,
  },
  {
    id: "aif-checklist", group: "Prospects", name: "Flyingbee subscription", to: "A new Flyingbee investor", when: "When they decide to invest, from the enquiry", channel: "enquiry", template: "aifChecklist", merge: ENQUIRY_MERGE, rule: "AIF MC 3.2.2",
    draw: ({ words, name, site }) => <prospect.Checklist name={name} date={DATE} site={site} reference="ENQ-00043" product="aif" words={words} sender={SENDER} sendTo="customersupportaif@moneybee.in" {...prospect.AIF_CHECKLIST} />,
  },
  {
    id: "event-invitation", group: "Prospects", name: "Event invitation", to: "Contacts who chose events", when: "Before an investor meet or call", channel: "mailing", needs: "The mailing desk, with compliance approval and unsubscribe", template: "eventInvitation", rule: "Flyingbee content to eligible investors only",
    merge: [{ key: "title", label: "Event", sample: "Moneybee investor meet" }, { key: "when", label: "When", sample: "Thursday 13 November 2026" }],
    draw: ({ words, name, site }) => <prospect.EventInvitation name={name} date={DATE} site={site} words={words} title="Moneybee investor meet" when="Thursday 13 November 2026, 6:00 pm to 7:30 pm" where="Moneybee office, Lower Parel, and by video call" speakers={["The Moneybee investment team"]} agenda={["The portfolio over the last quarter.", "Questions from investors."]} replyBy="Friday 7 November" href="/contact" unsubscribeHref="/email/preferences" />,
  },

  // Clients
  {
    id: "welcome", group: "Clients", name: "Welcome, PMS account opened", to: "A new PMS client", when: "When the account is activated", channel: "here", template: "welcome",
    fields: [
      { key: "clientCode", label: "Client code", sample: "MB01234" },
      { key: "activatedOn", label: "Account opened", sample: "16 October 2026" },
      { key: "approach", label: "Investment approach", sample: "QueenBee" },
      { key: "benchmark", label: "Benchmark", sample: "S&P BSE 500 TRI" },
      { key: "distributor", label: "Distributor", sample: "Direct Plan" },
      { key: "manager", label: "Relationship manager", sample: "Aditi Sharma" },
      { key: "managerPhone", label: "Manager's phone", sample: "+91 98672 90143", optional: true },
      { key: "managerEmail", label: "Manager's email", sample: "aditi.sharma@moneybee.in", optional: true },
      { key: "agreement", label: "Link to the signed agreement", sample: "/portal", optional: true },
    ],
    draw: ({ words, values, name, site }) => <client.Welcome name={name} site={site} words={words} clientCode={values.clientCode} approach={values.approach} benchmark={values.benchmark} activatedOn={values.activatedOn} distributor={values.distributor} manager={{ name: values.manager, phone: values.managerPhone, email: values.managerEmail }} documents={values.agreement ? [{ name: "Your signed PMS agreement", note: "PDF", href: values.agreement }] : []} />,
  },
  {
    id: "account-details", group: "Clients", name: "Account details", to: "A new PMS client", when: "Within 3 working days of opening", channel: "here", template: "accountDetails", rule: "PMS MC Annexure 4B items 16, 29",
    fields: [
      { key: "clientCode", label: "Client code", sample: "MB01234" },
      { key: "custodian", label: "Custodian", sample: "[Custodian name]" },
      { key: "demat", label: "Demat account number", sample: "IN300000 12345678" },
      { key: "bankName", label: "Bank", sample: "[Bank]" },
      { key: "bankAccount", label: "Bank account number", sample: "XXXXXX4321" },
      { key: "ifsc", label: "IFSC", sample: "XXXX0000000" },
    ],
    draw: ({ words, values, name, site }) => <client.AccountDetails name={name} site={site} words={words} clientCode={values.clientCode} custodian={values.custodian} demat={values.demat} bank={{ name: values.bankName, account: values.bankAccount, ifsc: values.ifsc }} />,
  },
  {
    id: "funds-received", group: "Clients", name: "Funds received", to: "A PMS client or Flyingbee investor", when: "When money is received", channel: "here", template: "fundsReceived",
    fields: [
      { key: "product", label: "Product", sample: PRODUCTS[0], kind: "select", options: PRODUCTS },
      { key: "reference", label: "Client code or folio", sample: "MB01234" },
      { key: "amount", label: "Amount", sample: "Rs. 50,00,000" },
      { key: "receivedOn", label: "Received on", sample: "16 October 2026" },
      { key: "units", label: "Units allotted (Flyingbee)", sample: "", optional: true },
      { key: "nav", label: "NAV per unit (Flyingbee)", sample: "", optional: true },
    ],
    draw: ({ words, values, name, site }) => <client.FundsReceived name={name} site={site} words={words} product={isAif(values.product) ? "aif" : "pms"} reference={values.reference} amount={values.amount} receivedOn={values.receivedOn} facts={[...(values.units ? [{ label: "Units allotted", value: values.units }] : []), ...(values.nav ? [{ label: "NAV per unit", value: values.nav }] : [])]} />,
  },
  {
    id: "pms-monthly-update", group: "Clients", name: "PMS monthly update", to: "PMS clients who have not opted out", when: "After compliance approves the month's fact sheet", channel: "mailing", needs: "The mailing desk, with compliance approval and unsubscribe", template: "pmsMonthlyUpdate", rule: "PMS MC 4.5.3, 5.6",
    merge: [{ key: "month", label: "Month", sample: "July 2026" }],
    draw: ({ words, name, site }) => <client.PmsMonthlyUpdate name={name} site={site} date="8 August 2026" month="July 2026" asOf={DECK_FIGURES.asOf} rows={PMS_ROWS} chart={PMS_CHART} words={words} changes={[{ label: "Added", value: "[Company], [one line on why]" }, { label: "Exited", value: "[Company], [one line on why]" }]} documents={[{ ...FACT_SHEET, note: "PDF, attached" }, { name: "Your statement for July 2026", note: "In the investor portal", href: "/portal" }]} nextUpdate="in the second week of September" unsubscribeHref="/email/preferences" />,
  },
  {
    id: "pms-quarterly-report", group: "Clients", name: "PMS quarterly report", to: "Every PMS client", when: "Each quarter, when the statement is in the portal", channel: "here", template: "pmsQuarterlyReport", rule: "PMS MC 5.5.1, Annexure 5D",
    fields: [
      { key: "clientCode", label: "Client code", sample: "MB01234" },
      { key: "quarter", label: "Quarter ended", sample: "30 September 2026" },
      { key: "approach", label: "Investment approach", sample: "QueenBee" },
      { key: "benchmark", label: "Benchmark", sample: "S&P BSE 500 TRI" },
      { key: "distributor", label: "Distributor", sample: "Direct Plan" },
    ],
    draw: ({ words, values, name, site = DEFAULT_DETAILS }) => <client.PmsQuarterlyReport name={name} site={site} words={words} quarter={values.quarter} clientCode={values.clientCode} approach={values.approach} benchmark={values.benchmark} distributor={values.distributor} href="/portal" contact={`${site.email} or ${site.phones[0]?.number ?? ""}`.trim()} />,
  },
  {
    id: "fee-statement", group: "Clients", name: "Fee statement", to: "A PMS client", when: "Each time fees are charged", channel: "here", template: "feeStatement", rule: "PMS MC 6.1.3.6",
    fields: [
      { key: "clientCode", label: "Client code", sample: "MB01234" },
      { key: "period", label: "Period", sample: "the quarter ended 30 September 2026" },
      { key: "managementFee", label: "Management fee", sample: "Rs. 0" },
      { key: "performanceFee", label: "Performance fee", sample: "Rs. 0" },
      { key: "expenses", label: "Expenses at actuals", sample: "Rs. 0" },
      { key: "total", label: "Total charged", sample: "Rs. 0" },
      { key: "hurdle", label: "Hurdle rate", sample: "", optional: true },
      { key: "hwmBefore", label: "High water mark before", sample: "", optional: true },
      { key: "hwmAfter", label: "High water mark after", sample: "", optional: true },
    ],
    draw: ({ words, values, name, site }) => <client.FeeStatement name={name} site={site} words={words} clientCode={values.clientCode} period={values.period} lines={[{ label: "Management fee", value: values.managementFee }, { label: "Performance fee", value: values.performanceFee }, { label: "Expenses at actuals", value: values.expenses }]} hurdle={values.hurdle || undefined} highWaterMark={values.hwmBefore && values.hwmAfter ? { before: values.hwmBefore, after: values.hwmAfter } : undefined} total={values.total} href="/portal" />,
  },
  {
    id: "aif-investor-update", group: "Clients", name: "Flyingbee investor update", to: "Flyingbee unit holders", when: "Each quarter; material risks within 60 days of quarter end", channel: "mailing", needs: "The mailing desk, and the benchmarking agency's report", template: "aifInvestorUpdate", rule: "AIF MC Annexure 4 Part C, 11.4.4, 22.5.2",
    merge: [{ key: "asOf", label: "Figures as on", sample: "31 July 2026" }],
    draw: ({ words, name, site }) => (
      <client.AifInvestorUpdate
        name={name}
        site={site}
        date="8 August 2026"
        asOf={AIF_DECK_FIGURES.asOf}
        rows={AIF_ROWS}
        chart={AIF_ROWS.filter((row) => row.ours !== null)}
        firstClose="30 October 2025"
        nav="[from CAMS, as on 31 July 2026]"
        facts={[{ label: "Fund", value: "Flyingbee Investment Fund, Category III AIF" }, { label: "Trustee", value: "Axis Trustee" }, { label: "Custodian and fund accountant", value: "Orbis" }, { label: "Registrar", value: "CAMS" }]}
        sectors={[{ name: "Food and Agriculture", weight: 11.19 }, { name: "Chemicals", weight: 10.61 }, { name: "Oil & Gas", weight: 7.85 }, { name: "Renewable Energy", weight: 7.17 }, { name: "Power & Transmission", weight: 7.07 }]}
        words={words}
        risks={[{ label: "Concentration", value: "[Largest holding and top five as % of assets]" }, { label: "Liquidity and realisation", value: "[Share in unlisted companies, and how long an exit would take]" }, { label: "Leverage", value: "[None, or the exposure]" }]}
        documents={[{ name: "Flyingbee investor update, July 2026", note: "PDF, attached" }, { name: "Performance versus benchmark report", note: "PDF, from the benchmarking agency, attached" }]}
        contact="customersupportaif@moneybee.in"
      />
    ),
  },
  {
    id: "statement-ready", group: "Clients", name: "Statement ready", to: "A client", when: "When a statement is added to the portal", channel: "here", template: "statementReady",
    fields: [
      { key: "reference", label: "Client code", sample: "MB01234" },
      { key: "statement", label: "Statement", sample: "Your September 2026 statement" },
      { key: "period", label: "Period", sample: "September 2026" },
    ],
    draw: ({ words, values, name, site }) => <client.StatementReady name={name} site={site} words={words} reference={values.reference} statement={values.statement} period={values.period} href="/portal" />,
  },
  {
    id: "withdrawal-received", group: "Clients", name: "Withdrawal received", to: "A client", when: "When a withdrawal is asked for", channel: "here", template: "withdrawalReceived",
    fields: [
      { key: "reference", label: "Withdrawal reference", sample: "WD-00017" },
      { key: "amount", label: "Amount", sample: "Rs. 5,00,000" },
      { key: "account", label: "Paid to", sample: "[Bank], XXXXXX4321" },
      { key: "requestedOn", label: "Requested on", sample: "16 October 2026" },
      { key: "expectedBy", label: "Expected in their account by", sample: "23 October 2026" },
    ],
    draw: ({ words, values, name, site }) => <client.Withdrawal name={name} site={site} words={words} stage="received" reference={values.reference} amount={values.amount} account={values.account} requestedOn={values.requestedOn} expectedBy={values.expectedBy} />,
  },
  {
    id: "withdrawal-paid", group: "Clients", name: "Withdrawal paid", to: "A client", when: "When a withdrawal is paid", channel: "here", template: "withdrawalPaid",
    fields: [
      { key: "reference", label: "Withdrawal reference", sample: "WD-00017" },
      { key: "amount", label: "Amount", sample: "Rs. 5,00,000" },
      { key: "account", label: "Paid to", sample: "[Bank], XXXXXX4321" },
      { key: "requestedOn", label: "Requested on", sample: "16 October 2026" },
      { key: "paidOn", label: "Paid on", sample: "22 October 2026" },
      { key: "utr", label: "Bank reference (UTR)", sample: "[UTR]" },
    ],
    draw: ({ words, values, name, site }) => <client.Withdrawal name={name} site={site} words={words} stage="paid" reference={values.reference} amount={values.amount} account={values.account} requestedOn={values.requestedOn} paidOn={values.paidOn} utr={values.utr} />,
  },
  {
    id: "notice-of-change", group: "Clients", name: "Notice of change", to: "Affected clients or unit holders", when: "Before a material change", channel: "here", template: "noticeOfChange", rule: "AIF MC 13.1.1",
    fields: [
      { key: "reference", label: "Notice reference", sample: "NOT-2026-01" },
      { key: "product", label: "Product", sample: PRODUCTS[1], kind: "select", options: PRODUCTS },
      { key: "change", label: "What changes", sample: "[What changes]" },
      { key: "effectiveFrom", label: "Effective from", sample: "[date]" },
      { key: "respondBy", label: "Respond by", sample: "[at least one month from today]", optional: true },
      { key: "options", label: "Their options, one per line", sample: "Do nothing, and the change applies to your units from the date above.\nIf you do not agree, tell us by the date above, and you may exit the fund. The exit is completed within three months of that date.", kind: "lines" },
    ],
    draw: ({ words, values, name, site }) => <client.NoticeOfChange name={name} site={site} words={words} reference={values.reference} product={isAif(values.product) ? "aif" : "pms"} change={values.change} effectiveFrom={values.effectiveFrom} respondBy={values.respondBy || undefined} options={lines(values.options)} />,
  },
  {
    id: "kyc-due", group: "Clients", name: "KYC or nomination due", to: "A client", when: "When an update is due", channel: "here", template: "kycDue",
    fields: [
      { key: "reference", label: "Client code", sample: "MB01234" },
      { key: "item", label: "What is needed", sample: "Update your nomination" },
      { key: "dueBy", label: "By", sample: "[date]" },
      { key: "how", label: "How to do it, one step per line", sample: "Download the nomination form from the investor portal.\nSign it and send it to customersupportaif@moneybee.in.", kind: "lines" },
    ],
    draw: ({ words, values, name, site }) => <client.KycDue name={name} site={site} words={words} reference={values.reference} item={values.item} dueBy={values.dueBy} how={lines(values.how)} />,
  },
  {
    id: "complaint-registered", group: "Clients", name: "Complaint registered", to: "The investor who complained", when: "When a complaint is logged", channel: "here", template: "complaintRegistered", rule: "PMS 30 working days (Annexure 4B item 30); AIF 21 days; SCORES 21 calendar days",
    fields: [
      { key: "number", label: "Complaint number", sample: "CMP-2026-0007" },
      { key: "receivedAt", label: "Received", sample: "16 Oct 2026, 10:42 am" },
      { key: "concerning", label: "Concerning", sample: "PMS account, client code MB01234" },
      { key: "rule", label: "Made how", sample: "PMS, made to us", kind: "select", options: Object.keys(COMPLAINT_RULES) },
      { key: "dueBy", label: "Response due by", sample: "27 November 2026" },
      { key: "message", label: "The complaint, as received", sample: "My July statement shows a withdrawal of Rs. 5 lakh that I did not request. Please explain and correct it.", kind: "textarea" },
    ],
    draw: ({ words, values, name, site }) => <client.ComplaintRegistered name={name} site={site} words={words} number={values.number} receivedAt={values.receivedAt} concerning={values.concerning} dueBy={values.dueBy} rule={COMPLAINT_RULES[values.rule as keyof typeof COMPLAINT_RULES] ?? "pms"} message={values.message} />,
  },
  {
    id: "complaint-resolved", group: "Clients", name: "Complaint resolved", to: "The investor who complained", when: "With the written response", channel: "here", template: "complaintResolved", rule: "SCORES circular 2023/156",
    fields: [
      { key: "number", label: "Complaint number", sample: "CMP-2026-0007" },
      { key: "receivedAt", label: "Received", sample: "16 October 2026" },
      { key: "resolvedOn", label: "Responded", sample: "30 October 2026" },
      { key: "actions", label: "Action taken, one per line", sample: "[What was corrected, and when.]", kind: "lines" },
    ],
    draw: ({ words, values, name, site }) => <client.ComplaintResolved name={name} site={site} words={words} number={values.number} receivedAt={values.receivedAt} resolvedOn={values.resolvedOn} actions={lines(values.actions)} />,
  },
  {
    id: "insights", group: "Clients", name: "Insights", to: "Contacts who chose Insights", when: "When an article is published", channel: "mailing", needs: "The mailing desk, with compliance approval and unsubscribe", template: "insights", rule: "Annexure 2A",
    merge: [{ key: "title", label: "Article title", sample: "[Article title]" }],
    draw: ({ words, name, site }) => <client.Insights name={name} site={site} words={words} title="[Article title]" summary="[Two sentences on what the article says.]" href="/" unsubscribeHref="/email/preferences" />,
  },

  // Account security
  {
    id: "sign-in-code", group: "Account security", name: "Sign-in code", to: "An investor", when: "When they sign in on a new browser", channel: "system", subject: () => security.signInCodeSubject({ code: "482913" }),
    draw: ({ name, site }) => <security.SignInCode name={name} date={DATE} site={site} code="482913" validUntil="10:52 am IST" account="r•••••@gmail.com" requestedAt="16 Oct 2026, 10:42 am" browser="Chrome on macOS" near="Pune, India" resetHref="/portal/forgot" phone="022-4030 2080" />,
  },
  {
    id: "set-password", group: "Account security", name: "Set your password", to: "An investor", when: "When they ask for a new password", channel: "system", subject: () => security.setPasswordSubject({ who: "investor" }),
    draw: ({ name, site }) => <security.SetPassword name={name} date={DATE} site={site} who="investor" href="/portal/reset?token=sample" validFor="30 minutes" requestedAt="16 Oct 2026, 10:42 am" browser="Chrome on macOS" near="Pune, India" />,
  },
  {
    id: "portal-invitation", group: "Account security", name: "Portal invitation", to: "A client", when: "When the desk invites them to the portal from their page", channel: "system", subject: () => security.portalInvitationSubject(),
    draw: ({ name, site }) => <security.PortalInvitation name={name} date={DATE} site={site} href="/portal/reset?token=sample" validUntil="23 October 2026, 11:42 am" account="r…@gmail.com" invitedBy="Aditi Sharma, Moneybee" loginHref="/portal/login" clientCodes={["MB01234"]} />,
  },
  {
    id: "password-changed", group: "Account security", name: "Password changed", to: "An investor", when: "When their password changes", channel: "system", needs: "A hook on the investor password change", subject: () => security.passwordChangedSubject(),
    draw: ({ name, site }) => <security.PasswordChanged name={name} date={DATE} site={site} at="16 Oct 2026, 10:42 am" browser="Chrome on macOS" resetHref="/portal/forgot" phone="022-4030 2080" />,
  },
  {
    id: "new-browser", group: "Account security", name: "New browser signed in", to: "An investor", when: "After a first sign-in on a browser", channel: "system", needs: "A step after the sign-in code is accepted", subject: () => security.newBrowserSubject(),
    draw: ({ name, site }) => <security.NewBrowser name={name} date={DATE} site={site} at="16 Oct 2026, 10:44 am" browser="Chrome on macOS" near="Pune, India" resetHref="/portal/forgot" phone="022-4030 2080" />,
  },

  // Applicants
  {
    id: "application-received", group: "Applicants", name: "Application received", to: "An applicant", when: "When they apply", channel: "automatic", template: "applicationAck", merge: APPLICANT_MERGE,
    draw: ({ words, name, site }) => <ApplicationReceived name={name} date={DATE} site={site} reference="APP-00011" role={SAMPLE_VALUES.role} words={words} receivedAt="16 Oct 2026, 10:42 am" resume="rohan-mehta-resume.pdf" notice="30 days" mustHaves={[{ question: "A CFA charter or CA qualification", answer: "yes" }, { question: "Two years of equity research", answer: "yes" }]} keptUntil={SAMPLE_VALUES.keptUntil} />,
  },
  {
    id: "interview-invitation", group: "Applicants", name: "Interview invitation", to: "An applicant", when: "When HR adds an interview", channel: "hiring", template: "interviewInvite", merge: [...APPLICANT_MERGE, { key: "interviewAt", label: "Interview time" }, { key: "interviewPlace", label: "Interview place" }, { key: "interviewWith", label: "Interviewer" }],
    draw: ({ words, name, site }) => <InterviewInvitation name={name} date={DATE} site={site} reference="APP-00011" role={SAMPLE_VALUES.role} words={words} when={SAMPLE_VALUES.interviewAt} where={SAMPLE_VALUES.interviewPlace} with={SAMPLE_VALUES.interviewWith} sender={{ name: "Priya Nair", role: "Human Resources" }} />,
  },
  {
    id: "offer", group: "Applicants", name: "Offer", to: "An applicant", when: "When HR makes an offer", channel: "hiring", template: "offer", merge: APPLICANT_MERGE,
    draw: ({ words, name, site }) => <Offer name={name} date={DATE} site={site} reference="APP-00011" role={SAMPLE_VALUES.role} words={words} sender={{ name: "Priya Nair", role: "Human Resources" }} />,
  },
  {
    id: "not-taken-forward", group: "Applicants", name: "Not taken forward", to: "An applicant", when: "When HR closes the application", channel: "hiring", template: "applicationReject", merge: APPLICANT_MERGE,
    draw: ({ words, name, site }) => <NotTakenForward name={name} date={DATE} site={site} reference="APP-00011" role={SAMPLE_VALUES.role} words={words} keptUntil={SAMPLE_VALUES.keptUntil} sender={{ name: "Priya Nair", role: "Human Resources" }} />,
  },

  // Staff
  {
    id: "staff-new-enquiry", group: "Staff", name: "New enquiry", to: "The desk the playbook names", when: "When an enquiry arrives", channel: "system", subject: () => staff.staffNewEnquirySubject({ severity: "high", title: "PMS enquiry from Rohan Mehta", replyBy: "2:42 pm" }),
    draw: () => <staff.StaffNewEnquiry date={DATE} reference="ENQ-00042" title="PMS enquiry from Rohan Mehta" severity="high" replyBy="2:42 pm today, in 4 hours" receivedAt="16 Oct 2026, 10:42 am" contact={[{ label: "Email", value: "rohan.mehta@gmail.com" }, { label: "Phone", value: "+91 98200 41873" }, { label: "Investment amount", value: "Above 5 crore" }, { label: "City", value: "Pune" }]} message={MESSAGE} reasons={["PMS ticket above Rs. 5 crore."]} playbook={{ name: "Large PMS investor", steps: ["Call within the reply time; email only if they don't pick up.", "Offer a meeting with the fund manager.", "Open a deal once a meeting is set."] }} href="/admin/inbox/42" roleLabel="Sales" />,
  },
  {
    id: "staff-new-application", group: "Staff", name: "New application", to: "HR", when: "When someone applies", channel: "system", subject: () => staff.staffNewApplicationSubject({ name: "Rohan Mehta", role: SAMPLE_VALUES.role }),
    draw: () => <staff.StaffNewApplication date={DATE} reference="APP-00011" name="Rohan Mehta" role={SAMPLE_VALUES.role} receivedAt="16 Oct 2026, 10:42 am" facts={[{ label: "Notice period", value: "30 days" }, { label: "City", value: "Pune" }, { label: "Resume", value: "Attached to the application" }]} mustHaves={{ asked: 3, met: 2, missed: ["Comfortable working from Lower Parel five days a week"] }} href="/admin/hiring/11" roleLabel="HR" />,
  },
  {
    id: "fact-sheet-waiting", group: "Staff", name: "Fact sheet waiting", to: "Compliance", when: "When a fact sheet is submitted", channel: "system", subject: () => staff.factSheetWaitingSubject({ title: "Moneybee PMS, August 2026" }),
    draw: () => <staff.FactSheetWaiting date={DATE} title="Moneybee PMS, August 2026" product="Moneybee PMS" month="August 2026" submittedBy="Aditi Sharma" submittedAt="16 Oct 2026, 10:42 am" href="/admin/collections/fact-sheets/3" roleLabel="Compliance" />,
  },
  {
    id: "staff-new-complaint", group: "Staff", name: "New complaint", to: "The grievance officer and compliance", when: "When a complaint is registered", channel: "system", needs: "A complaint register in /admin", subject: () => staff.staffNewComplaintSubject({ number: "CMP-2026-0007", dueBy: "27 November 2026" }),
    draw: () => <staff.StaffNewComplaint date={DATE} number="CMP-2026-0007" investor="Rohan Mehta" concerning="PMS account, client code MB01234" receivedAt="16 Oct 2026, 10:42 am" dueBy="27 November 2026" daysLeft={42} rule="PMS, 30 working days" message="My July statement shows a withdrawal of Rs. 5 lakh that I did not request. Please explain and correct it." href="/admin" roleLabel="Compliance" />,
  },
  {
    id: "mailing-waiting", group: "Staff", name: "Mailing waiting", to: "Compliance", when: "When a mailing is ready to send", channel: "system", needs: "The mailing desk", subject: () => staff.mailingWaitingSubject({ title: "Moneybee PMS: update for July 2026" }),
    draw: () => <staff.MailingWaiting date={DATE} title="Moneybee PMS: update for July 2026" audience="PMS clients who receive the monthly update" recipients={214} writtenBy="The investment team" sendOn="8 August 2026" href="/admin" roleLabel="Compliance" />,
  },
  {
    id: "task-assigned", group: "Staff", name: "A task for you", to: "A staff member", when: "When someone else gives them a task, or an enquiry's playbook steps", channel: "system", subject: () => staff.taskAssignedSubject({ assignedBy: "Vikram Iyer", tasks: [{ title: "Call Rohan Mehta about the meeting", due: "Mon 19 Oct, 10:00", person: "Rohan Mehta", href: "/admin/tasks" }] }),
    draw: () => <staff.TaskAssigned date={DATE} assignedBy="Vikram Iyer" tasks={[{ title: "Call Rohan Mehta about the meeting", due: "Mon 19 Oct, 10:00", person: "Rohan Mehta", href: "/admin/people/1" }]} href="/admin/tasks" roleLabel="Sales" />,
  },
  {
    id: "tasks-today", group: "Staff", name: "Your tasks today", to: "Each staff member with tasks due", when: "Each working day at 9:00, only when something is overdue or due", channel: "system", subject: () => staff.tasksTodaySubject({ overdue: [{ title: "", due: "", person: "", href: "" }], today: [{ title: "", due: "", person: "", href: "" }, { title: "", due: "", person: "", href: "" }] }),
    draw: () => (
      <staff.TasksToday
        date={DATE}
        name="Aditi Sharma"
        overdue={[{ title: "Send the PMS account opening checklist", due: "Thu 15 Oct", overdue: true, person: "Kavita Shah", href: "/admin/people/4" }]}
        today={[{ title: "Call again", due: "10:00", person: "Rohan Mehta", href: "/admin/people/1" }, { title: "Meeting with the fund manager", due: "15:00", person: "Arjun Desai", href: "/admin/people/3" }]}
        href="/admin/tasks"
        roleLabel="Sales"
      />
    ),
  },
  {
    id: "staff-password-reset", group: "Staff", name: "Staff password reset", to: "A staff member", when: "When they ask for a new /admin password", channel: "system", subject: () => security.setPasswordSubject({ who: "staff" }),
    draw: ({ site }) => <security.SetPassword name="Aditi Sharma" date={DATE} site={site} who="staff" href="/admin/reset/sample" validFor="1 hour" requestedAt="16 Oct 2026, 10:42 am" />,
  },
];

export const catalogueEntry = (id: string) => CATALOGUE.find((entry) => entry.id === id);

/** An email's facts and merge fields as its sample shows them. */
export const sampleValues = (entry: CatalogueEntry): Record<string, string> => ({
  ...Object.fromEntries((entry.merge ?? []).filter((field) => field.sample !== undefined).map((field) => [field.key, field.sample as string])),
  ...Object.fromEntries((entry.fields ?? []).map((field) => [field.key, field.sample])),
});

/** The words a template for this email may use. */
export const mergeFields = (entry: CatalogueEntry): MergeField[] => [{ key: "name", label: "Full name" }, { key: "firstName", label: "First name" }, ...(entry.fields ?? []).filter((field) => field.kind !== "lines" && field.kind !== "textarea").map(({ key, label }) => ({ key, label })), ...(entry.merge ?? []).map(({ key, label }) => ({ key, label }))];

/** A template's subject and words as stored; html is a design from the old template editor. */
export type TemplateWords = { subject: string; body: string; html?: string | null };

/**
 * The subject and the email: the template's words filled with the person's
 * name and the facts, drawn into the email. Without a template row, the
 * starter's words. Unknown merge fields stay visible, so nothing is guessed.
 */
export function compose(entry: CatalogueEntry, { template, values = {}, name = SAMPLE_VALUES.name, site }: { template?: TemplateWords | null; values?: Values; name?: string; site?: SiteDetails } = {}) {
  const facts = { ...SAMPLE_VALUES, ...sampleValues(entry), ...values, name, firstName: name.split(/\s+/)[0] };
  const raw = template ?? (entry.template ? STARTER_TEMPLATES[entry.template] : null);
  const words: WordsValue = { text: raw ? fillTemplate(raw.body, facts) : "", html: raw && "html" in raw && raw.html ? fillTemplateHtml(raw.html, facts) : null };
  const subject = raw ? fillTemplate(raw.subject, facts) : (entry.subject?.(facts) ?? entry.name);
  return { subject, words, element: entry.draw({ words, values: facts, name, site }) };
}
