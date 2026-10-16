import type { ReactElement } from "react";
import { STARTER_TEMPLATES, type StarterTemplateKey } from "@/lib/crm/starter-content";
import { fillTemplate } from "@/lib/crm/template";
import { AIF_PRODUCT } from "@/lib/insights";
import { DEFAULT_DETAILS, type SiteDetails } from "@/lib/site/details";
import { AIF_DECK_FIGURES, DECK_FIGURES } from "@/lib/site/tokens";
import { ApplicationReceived, applicationReceivedSubject, InterviewInvitation, interviewInvitationSubject, NotTakenForward, notTakenForwardSubject, Offer, offerSubject } from "./applicants";
import type { WordsValue } from "./blocks";
import * as client from "./clients";
import { chartRows, emailRows } from "./disclosures";
import * as prospect from "./prospects";
import * as security from "./security";
import * as staff from "./staff";

/*
 * Every email Moneybee sends, with who gets it, when, the rule behind it, and
 * a sample. The /admin Emails screen draws from this list, the template
 * editor previews through it, and emails.test.mjs renders every sample.
 * `sends` means code sends it today; `planned` means the email is ready and
 * `needs` says what has to exist before it can go out.
 */

export const GROUPS = ["Prospects", "Clients", "Account security", "Applicants", "Staff"] as const;
export type Group = (typeof GROUPS)[number];

export type Sample = { subject: string; element: ReactElement };

export type CatalogueEntry = {
  id: string;
  group: Group;
  name: string;
  to: string;
  when: string;
  status: "sends" | "planned";
  needs?: string;
  /** The starter template whose words it uses; staff edit those in /admin › Email templates. */
  template?: StarterTemplateKey;
  rule?: string;
  sample: (words?: WordsValue, site?: SiteDetails) => Sample;
};

const DATE = "16 October 2026";
/** The values merge fields take in samples and test sends. */
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

const words = (key: StarterTemplateKey, override?: WordsValue): WordsValue => override ?? { text: fillTemplate(STARTER_TEMPLATES[key].body, SAMPLE_VALUES) };
const SENDER = { name: "Aditi Sharma", role: "Relationship Manager", phone: "+91 98672 90143", email: "aditi.sharma@moneybee.in" };
const PERSON = { name: "Rohan Mehta", date: DATE };
const MESSAGE = "I run a family business and want a long-term equity allocation outside mutual funds. How often do you report, and can I see the stocks in my own demat?";
const PMS_ROWS = emailRows(DECK_FIGURES.rows);
const PMS_CHART = chartRows(DECK_FIGURES.rows);
const AIF_ROWS = emailRows(AIF_DECK_FIGURES.rows);
const FACT_SHEET = { name: "Moneybee PMS fact sheet, July 2026", note: "PDF", href: "/investor-centre#documents" };
const DD = { name: "Disclosure Document", note: "PDF. Please read it, in particular the risk factors, before investing.", href: "/investor-centre#documents" };
const OFFICE = `${DEFAULT_DETAILS.address.line1} ${DEFAULT_DETAILS.address.line2}`;

export const CATALOGUE: CatalogueEntry[] = [
  // Prospects
  {
    id: "enquiry-received", group: "Prospects", name: "Enquiry received", to: "The person who sent a /contact form", when: "Automatically, when the form is sent", status: "sends", template: "enquiryAck",
    sample: (override, site) => ({
      subject: prospect.enquiryReceivedSubject({ reference: "ENQ-00042" }),
      element: <prospect.EnquiryReceived {...PERSON} site={site} reference="ENQ-00042" kind="pms" receivedAt="16 Oct 2026, 10:42 am" replyBy="17 Oct 2026, 10:42 am" answers={[{ label: "Name", value: "Rohan Mehta" }, { label: "Phone", value: "+91 98200 41873" }, { label: "Email", value: "rohan.mehta@gmail.com" }, { label: "City", value: "Pune" }, { label: "Investment amount", value: "1 crore to 5 crore" }]} message={MESSAGE} words={words("enquiryAck", override)} />,
    }),
  },
  {
    id: "enquiry-reply", group: "Prospects", name: "Reply to an enquiry", to: "The person who wrote in", when: "When staff reply from the enquiry", status: "sends", template: "complaint",
    sample: (override, site) => ({
      subject: "Your message to Moneybee (ENQ-00042)",
      element: <prospect.Letter {...PERSON} site={site} reference="ENQ-00042" eyebrow="Reply to your enquiry" title="Your PMS enquiry" words={words("complaint", override)} sender={SENDER} reason="You are receiving this email in reply to your enquiry ENQ-00042." original={{ label: "Your enquiry of 16 October 2026", message: MESSAGE }} />,
    }),
  },
  {
    id: "pms-introduction", group: "Prospects", name: "PMS introduction", to: "A PMS prospect", when: "The relationship manager's first reply", status: "sends", template: "pmsReply", rule: "PMS MC 2.3.2, 4.5.3.6, 5.6.4; Annexure 2A",
    sample: (override, site) => ({
      subject: prospect.pmsIntroductionSubject({ reference: "ENQ-00042" }),
      element: <prospect.PmsIntroduction {...PERSON} site={site} reference="ENQ-00042" words={words("pmsReply", override)} sender={SENDER} asOf={DECK_FIGURES.asOf} rows={PMS_ROWS} chart={PMS_CHART} documents={[FACT_SHEET, DD]} />,
    }),
  },
  {
    id: "aif-introduction", group: "Prospects", name: "Flyingbee introduction", to: "A Flyingbee prospect", when: "The relationship manager's first reply", status: "sends", template: "aifReply", rule: "AIF MC 3.2.1, 3.2.2, 22.5.1",
    sample: (override, site) => ({
      subject: prospect.aifIntroductionSubject({ reference: "ENQ-00043" }),
      element: <prospect.AifIntroduction {...PERSON} site={site} reference="ENQ-00043" words={words("aifReply", override)} sender={{ ...SENDER, role: "Relationship Manager, Flyingbee Investment Fund" }} terms={AIF_PRODUCT.terms} />,
    }),
  },
  {
    id: "meeting-confirmation", group: "Prospects", name: "Meeting confirmation", to: "A prospect or client", when: "When a meeting is set", status: "sends", template: "meetingConfirmation",
    sample: (override, site) => ({
      subject: prospect.meetingConfirmationSubject({ when: SAMPLE_VALUES.meetingAt }),
      element: <prospect.MeetingConfirmation {...PERSON} site={site} reference="ENQ-00042" words={words("meetingConfirmation", override)} sender={SENDER} when={SAMPLE_VALUES.meetingAt} place={{ kind: "office", address: OFFICE, mapHref: "https://www.google.com/maps/dir/?api=1&destination=18.9987,72.82925" }} attendees="Aditi Sharma, and a member of the investment team" agenda={["How we choose companies, and how the portfolio is built.", "Fees, reporting and how your account is held.", "Your questions."]} bring={["Any questions about your existing portfolio you would like us to look at."]} />,
    }),
  },
  {
    id: "meeting-follow-up", group: "Prospects", name: "Meeting follow-up", to: "A prospect or client", when: "After a meeting", status: "sends", template: "meetingFollowUp",
    sample: (override, site) => ({
      subject: prospect.meetingFollowUpSubject({ meetingOn: SAMPLE_VALUES.meetingOn }),
      element: <prospect.MeetingFollowUp {...PERSON} site={site} reference="ENQ-00042" words={words("meetingFollowUp", override)} sender={SENDER} meetingOn={SAMPLE_VALUES.meetingOn} nextSteps={["Aditi Sharma sends the account opening checklist and the fees annexure, by 23 October.", "Rohan Mehta confirms whether to open a new demat account or use the existing one, by 28 October."]} documents={[FACT_SHEET]} />,
    }),
  },
  {
    id: "pms-checklist", group: "Prospects", name: "PMS account opening", to: "A new PMS client", when: "When they decide to open an account", status: "sends", template: "pmsChecklist", rule: "PMS MC Annexure 4B item 28, 4.3.4, 2.3.2",
    sample: (override, site) => ({
      subject: prospect.checklistSubject({ product: "pms", reference: "ENQ-00042" }),
      element: <prospect.Checklist {...PERSON} site={site} reference="ENQ-00042" product="pms" words={words("pmsChecklist", override)} sender={SENDER} sendTo="customersupportaif@moneybee.in" items={prospect.PMS_CHECKLIST.items} steps={prospect.PMS_CHECKLIST.steps} />,
    }),
  },
  {
    id: "aif-checklist", group: "Prospects", name: "Flyingbee subscription", to: "A new Flyingbee investor", when: "When they decide to invest", status: "sends", template: "aifChecklist", rule: "AIF MC 3.2.2",
    sample: (override, site) => ({
      subject: prospect.checklistSubject({ product: "aif", reference: "ENQ-00043" }),
      element: <prospect.Checklist {...PERSON} site={site} reference="ENQ-00043" product="aif" words={words("aifChecklist", override)} sender={SENDER} sendTo="customersupportaif@moneybee.in" items={prospect.AIF_CHECKLIST.items} steps={prospect.AIF_CHECKLIST.steps} />,
    }),
  },
  {
    id: "event-invitation", group: "Prospects", name: "Event invitation", to: "Contacts who chose events", when: "Before an investor meet or call", status: "planned", needs: "A mailing desk with compliance approval and unsubscribe", rule: "Flyingbee content to eligible investors only",
    sample: (_, site) => ({
      subject: prospect.eventInvitationSubject({ title: "Moneybee investor meet", when: "Thursday 13 November 2026" }),
      element: <prospect.EventInvitation {...PERSON} site={site} words={{ text: "We would be glad to have you at our next investor meet, where the investment team will talk through the portfolio and take questions." }} title="Moneybee investor meet" when="Thursday 13 November 2026, 6:00 pm to 7:30 pm" where="Moneybee office, Lower Parel, and by video call" speakers={["The Moneybee investment team"]} agenda={["The portfolio over the last quarter.", "Questions from investors."]} replyBy="Friday 7 November" href="/contact" unsubscribeHref="/email/preferences" />,
    }),
  },

  // Clients
  {
    id: "welcome", group: "Clients", name: "Welcome, PMS account opened", to: "A new PMS client", when: "When the account is activated", status: "planned", needs: "Client accounts linked to the back office",
    sample: (_, site) => ({ subject: client.welcomeSubject(), element: <client.Welcome {...PERSON} site={site} clientCode="MB01234" approach="QueenBee" benchmark="S&P BSE 500 TRI" activatedOn="16 October 2026" distributor="Direct Plan" manager={SENDER} documents={[{ name: "Your signed PMS agreement", note: "PDF, in the investor portal", href: "/portal" }]} /> }),
  },
  {
    id: "account-details", group: "Clients", name: "Account details", to: "A new PMS client", when: "Within 3 working days of opening", status: "planned", needs: "Client accounts linked to the back office", rule: "PMS MC Annexure 4B items 16, 29",
    sample: (_, site) => ({ subject: client.accountDetailsSubject({ clientCode: "MB01234" }), element: <client.AccountDetails {...PERSON} site={site} clientCode="MB01234" custodian="[Custodian name]" demat="IN300000 12345678" bank={{ name: "[Bank]", account: "XXXXXX4321", ifsc: "XXXX0000000" }} /> }),
  },
  {
    id: "funds-received", group: "Clients", name: "Funds received, units allotted", to: "A PMS client or Flyingbee investor", when: "When money is received", status: "planned", needs: "Client accounts linked to the back office",
    sample: (_, site) => ({ subject: client.fundsReceivedSubject({ product: "aif", amount: "Rs. 1,00,00,000" }), element: <client.FundsReceived {...PERSON} site={site} product="aif" reference="FB-000123" amount="Rs. 1,00,00,000" receivedOn="16 October 2026" facts={[{ label: "Units allotted", value: "[from CAMS]" }, { label: "NAV per unit", value: "[from CAMS]" }]} /> }),
  },
  {
    id: "pms-monthly-update", group: "Clients", name: "PMS monthly update", to: "PMS clients who have not opted out", when: "After compliance approves the month's fact sheet", status: "planned", needs: "A mailing desk with compliance approval and unsubscribe", rule: "PMS MC 4.5.3, 5.6",
    sample: (_, site) => ({
      subject: client.pmsMonthlyUpdateSubject({ month: "July 2026" }),
      element: <client.PmsMonthlyUpdate {...PERSON} site={site} date="8 August 2026" month="July 2026" asOf={DECK_FIGURES.asOf} rows={PMS_ROWS} chart={PMS_CHART} words={{ text: "[The investment team's letter for the month: what moved the portfolio, what changed and why. No forecasts of returns.]" }} changes={[{ label: "Added", value: "[Company], [one line on why]" }, { label: "Exited", value: "[Company], [one line on why]" }]} documents={[{ ...FACT_SHEET, note: "PDF, attached" }, { name: "Your statement for July 2026", note: "In the investor portal", href: "/portal" }]} nextUpdate="in the second week of September" unsubscribeHref="/email/preferences" />,
    }),
  },
  {
    id: "pms-quarterly-report", group: "Clients", name: "PMS quarterly report", to: "Every PMS client", when: "Each quarter", status: "planned", needs: "Statements in the investor portal", rule: "PMS MC 5.5.1, Annexure 5D",
    sample: (_, site) => ({ subject: client.pmsQuarterlyReportSubject({ quarter: "30 September 2026" }), element: <client.PmsQuarterlyReport {...PERSON} site={site} quarter="30 September 2026" clientCode="MB01234" approach="QueenBee" benchmark="S&P BSE 500 TRI" distributor="Direct Plan" href="/portal" contact="customersupportaif@moneybee.in or 022-4030 2080" /> }),
  },
  {
    id: "fee-statement", group: "Clients", name: "Fee statement", to: "A PMS client", when: "Each time fees are charged", status: "planned", needs: "Fee data from the back office", rule: "PMS MC 6.1.3.6",
    sample: (_, site) => ({ subject: client.feeStatementSubject({ period: "the quarter ended 30 September 2026" }), element: <client.FeeStatement {...PERSON} site={site} clientCode="MB01234" period="the quarter ended 30 September 2026" lines={[{ label: "Management fee", value: "[Rs.]" }, { label: "Performance fee", value: "[Rs.]" }, { label: "Expenses at actuals", value: "[Rs.]" }]} hurdle="[As in your agreement]" highWaterMark={{ before: "[Rs.]", after: "[Rs.]" }} total="[Rs.]" href="/portal" /> }),
  },
  {
    id: "aif-investor-update", group: "Clients", name: "Flyingbee investor update", to: "Flyingbee unit holders", when: "Each quarter; material risks within 60 days of quarter end", status: "planned", needs: "A mailing desk, and the benchmarking agency's report", rule: "AIF MC Annexure 4 Part C, 11.4.4, 22.5.2",
    sample: (_, site) => ({
      subject: client.aifInvestorUpdateSubject({ asOf: AIF_DECK_FIGURES.asOf }),
      element: (
        <client.AifInvestorUpdate
          {...PERSON}
          site={site}
          date="8 August 2026"
          asOf={AIF_DECK_FIGURES.asOf}
          rows={AIF_ROWS}
          chart={AIF_ROWS.filter((row) => row.ours !== null)}
          firstClose="30 October 2025"
          nav="[from CAMS, as on 31 July 2026]"
          facts={[{ label: "Fund", value: "Flyingbee Investment Fund, Category III AIF" }, { label: "Trustee", value: "Axis Trustee" }, { label: "Custodian and fund accountant", value: "Orbis" }, { label: "Registrar", value: "CAMS" }]}
          sectors={[{ name: "Food and Agriculture", weight: 11.19 }, { name: "Chemicals", weight: 10.61 }, { name: "Oil & Gas", weight: 7.85 }, { name: "Renewable Energy", weight: 7.17 }, { name: "Power & Transmission", weight: 7.07 }]}
          words={{ text: "[The fund manager's note for the quarter.]" }}
          risks={[{ label: "Concentration", value: "[Largest holding and top five as % of assets]" }, { label: "Liquidity and realisation", value: "[Share in unlisted companies, and how long an exit would take]" }, { label: "Leverage", value: "[None, or the exposure]" }]}
          documents={[{ name: "Flyingbee investor update, July 2026", note: "PDF, attached" }, { name: "Performance versus benchmark report", note: "PDF, from the benchmarking agency, attached" }]}
          contact="customersupportaif@moneybee.in"
        />
      ),
    }),
  },
  {
    id: "statement-ready", group: "Clients", name: "Statement ready", to: "A client", when: "When a statement is added to the portal", status: "planned", needs: "Statements in the investor portal",
    sample: (_, site) => ({ subject: client.statementReadySubject({ statement: "Your September 2026 statement" }), element: <client.StatementReady {...PERSON} site={site} reference="MB01234" statement="Your September 2026 statement" period="September 2026" href="/portal" /> }),
  },
  {
    id: "withdrawal", group: "Clients", name: "Withdrawal received, then paid", to: "A client", when: "When a withdrawal is asked for, and when it is paid", status: "planned", needs: "Withdrawals in the back office",
    sample: (_, site) => ({ subject: client.withdrawalSubject({ stage: "received", amount: "Rs. 5,00,000" }), element: <client.Withdrawal {...PERSON} site={site} reference="WD-00017" stage="received" amount="Rs. 5,00,000" account="[Bank], XXXXXX4321" requestedOn="16 October 2026" expectedBy="[date]" /> }),
  },
  {
    id: "notice-of-change", group: "Clients", name: "Notice of change", to: "Affected clients or unit holders", when: "Before a material change", status: "planned", needs: "A mailing desk with compliance approval", rule: "AIF MC 13.1.1",
    sample: (_, site) => ({ subject: client.noticeOfChangeSubject({ change: "[What changes]" }), element: <client.NoticeOfChange {...PERSON} site={site} reference="NOT-2026-01" product="aif" change="[What changes]" effectiveFrom="[date]" respondBy="[at least one month from today]" words={{ text: "[Why the change is being made, in plain words.]" }} options={["Do nothing, and the change applies to your units from the date above.", "If you do not agree, tell us by the date above, and you may exit the fund. The exit is completed within three months of that date."]} /> }),
  },
  {
    id: "kyc-due", group: "Clients", name: "KYC or nomination due", to: "A client", when: "When an update is due", status: "planned", needs: "Client accounts linked to the back office",
    sample: (_, site) => ({ subject: client.kycDueSubject({ item: "Update your nomination" }), element: <client.KycDue {...PERSON} site={site} reference="MB01234" item="Update your nomination" dueBy="[date]" how={["Download the nomination form from the investor portal.", "Sign it and send it to customersupportaif@moneybee.in."]} /> }),
  },
  {
    id: "complaint-registered", group: "Clients", name: "Complaint registered", to: "The investor who complained", when: "When a complaint is logged", status: "planned", needs: "A complaint register in /admin", rule: "PMS 30 working days (Annexure 4B item 30); AIF 21 days; SCORES 21 calendar days",
    sample: (_, site) => ({ subject: client.complaintRegisteredSubject({ number: "CMP-2026-0007" }), element: <client.ComplaintRegistered {...PERSON} site={site} number="CMP-2026-0007" receivedAt="16 Oct 2026, 10:42 am" concerning="PMS account, client code MB01234" dueBy="27 November 2026" rule="pms" message="My July statement shows a withdrawal of Rs. 5 lakh that I did not request. Please explain and correct it." /> }),
  },
  {
    id: "complaint-resolved", group: "Clients", name: "Complaint resolved", to: "The investor who complained", when: "With the written response", status: "planned", needs: "A complaint register in /admin", rule: "SCORES circular 2023/156",
    sample: (_, site) => ({ subject: client.complaintResolvedSubject({ number: "CMP-2026-0007" }), element: <client.ComplaintResolved {...PERSON} site={site} number="CMP-2026-0007" receivedAt="16 October 2026" resolvedOn="30 October 2026" words={{ text: "[What we found, in plain words.]" }} actions={["[What was corrected, and when.]"]} /> }),
  },
  {
    id: "insights", group: "Clients", name: "Insights", to: "Contacts who chose Insights", when: "When an article is published", status: "planned", needs: "A mailing desk with compliance approval and unsubscribe", rule: "Annexure 2A",
    sample: (_, site) => ({ subject: client.insightsSubject({ title: "[Article title]" }), element: <client.Insights {...PERSON} site={site} title="[Article title]" summary="[Two sentences on what the article says.]" href="/" unsubscribeHref="/email/preferences" /> }),
  },

  // Account security
  {
    id: "sign-in-code", group: "Account security", name: "Sign-in code", to: "An investor", when: "When they sign in on a new browser", status: "sends",
    sample: (_, site) => ({ subject: security.signInCodeSubject({ code: "482913" }), element: <security.SignInCode {...PERSON} site={site} code="482913" validUntil="10:52 am IST on 16 October 2026" account="r•••••@gmail.com" requestedAt="16 Oct 2026, 10:42 am" browser="Chrome on macOS" near="Pune, India" resetHref="/portal/forgot" phone="022-4030 2080" /> }),
  },
  {
    id: "set-password", group: "Account security", name: "Set your password", to: "An investor", when: "When they ask for a new password", status: "sends",
    sample: (_, site) => ({ subject: security.setPasswordSubject({ who: "investor" }), element: <security.SetPassword {...PERSON} site={site} who="investor" href="/portal/reset?token=sample" validFor="30 minutes" requestedAt="16 Oct 2026, 10:42 am" browser="Chrome on macOS" near="Pune, India" /> }),
  },
  {
    id: "password-changed", group: "Account security", name: "Password changed", to: "An investor", when: "When their password changes", status: "planned", needs: "A hook on the investor password change",
    sample: (_, site) => ({ subject: security.passwordChangedSubject(), element: <security.PasswordChanged {...PERSON} site={site} at="16 Oct 2026, 10:42 am" browser="Chrome on macOS" resetHref="/portal/forgot" phone="022-4030 2080" /> }),
  },
  {
    id: "new-browser", group: "Account security", name: "New browser signed in", to: "An investor", when: "After a first sign-in on a browser", status: "planned", needs: "A step after the sign-in code is accepted",
    sample: (_, site) => ({ subject: security.newBrowserSubject(), element: <security.NewBrowser {...PERSON} site={site} at="16 Oct 2026, 10:44 am" browser="Chrome on macOS" near="Pune, India" resetHref="/portal/forgot" phone="022-4030 2080" /> }),
  },

  // Applicants
  {
    id: "application-received", group: "Applicants", name: "Application received", to: "An applicant", when: "Automatically, when they apply", status: "sends", template: "applicationAck",
    sample: (override, site) => ({ subject: applicationReceivedSubject({ reference: "APP-00011" }), element: <ApplicationReceived {...PERSON} site={site} reference="APP-00011" role={SAMPLE_VALUES.role} words={words("applicationAck", override)} receivedAt="16 Oct 2026, 10:42 am" resume="rohan-mehta-resume.pdf" notice="30 days" mustHaves={[{ question: "A CFA charter or CA qualification", answer: "yes" }, { question: "Two years of equity research", answer: "yes" }]} keptUntil={SAMPLE_VALUES.keptUntil} /> }),
  },
  {
    id: "interview-invitation", group: "Applicants", name: "Interview invitation", to: "An applicant", when: "When HR adds an interview", status: "sends", template: "interviewInvite",
    sample: (override, site) => ({ subject: interviewInvitationSubject({ role: SAMPLE_VALUES.role }), element: <InterviewInvitation {...PERSON} site={site} reference="APP-00011" role={SAMPLE_VALUES.role} words={words("interviewInvite", override)} when={SAMPLE_VALUES.interviewAt} where={SAMPLE_VALUES.interviewPlace} with={SAMPLE_VALUES.interviewWith} sender={{ name: "Priya Nair", role: "Human Resources" }} /> }),
  },
  {
    id: "offer", group: "Applicants", name: "Offer", to: "An applicant", when: "When HR makes an offer", status: "sends", template: "offer",
    sample: (override, site) => ({ subject: offerSubject(), element: <Offer {...PERSON} site={site} reference="APP-00011" role={SAMPLE_VALUES.role} words={words("offer", override)} sender={{ name: "Priya Nair", role: "Human Resources" }} /> }),
  },
  {
    id: "not-taken-forward", group: "Applicants", name: "Not taken forward", to: "An applicant", when: "When HR closes the application", status: "sends", template: "applicationReject",
    sample: (override, site) => ({ subject: notTakenForwardSubject({ role: SAMPLE_VALUES.role }), element: <NotTakenForward {...PERSON} site={site} reference="APP-00011" role={SAMPLE_VALUES.role} words={words("applicationReject", override)} keptUntil={SAMPLE_VALUES.keptUntil} sender={{ name: "Priya Nair", role: "Human Resources" }} /> }),
  },

  // Staff
  {
    id: "staff-new-enquiry", group: "Staff", name: "New enquiry", to: "The desk the playbook names", when: "When an enquiry arrives", status: "sends",
    sample: () => ({
      subject: staff.staffNewEnquirySubject({ severity: "high", title: "PMS enquiry from Rohan Mehta", replyBy: "2:42 pm" }),
      element: <staff.StaffNewEnquiry date={DATE} reference="ENQ-00042" title="PMS enquiry from Rohan Mehta" severity="high" replyBy="2:42 pm today, in 4 hours" receivedAt="16 Oct 2026, 10:42 am" contact={[{ label: "Email", value: "rohan.mehta@gmail.com" }, { label: "Phone", value: "+91 98200 41873" }, { label: "Investment amount", value: "Above 5 crore" }, { label: "City", value: "Pune" }]} message={MESSAGE} reasons={["PMS ticket above Rs. 5 crore."]} playbook={{ name: "Large PMS investor", steps: ["Call within the reply time; email only if they don't pick up.", "Offer a meeting with the fund manager.", "Open a deal once a meeting is set."] }} href="/admin/inbox/42" roleLabel="Sales" />,
    }),
  },
  {
    id: "staff-new-application", group: "Staff", name: "New application", to: "HR", when: "When someone applies", status: "sends",
    sample: () => ({ subject: staff.staffNewApplicationSubject({ name: "Rohan Mehta", role: SAMPLE_VALUES.role }), element: <staff.StaffNewApplication date={DATE} reference="APP-00011" name="Rohan Mehta" role={SAMPLE_VALUES.role} receivedAt="16 Oct 2026, 10:42 am" facts={[{ label: "Notice period", value: "30 days" }, { label: "City", value: "Pune" }, { label: "Resume", value: "Attached to the application" }]} mustHaves={{ asked: 3, met: 2, missed: ["Comfortable working from Lower Parel five days a week"] }} href="/admin/hiring/11" roleLabel="HR" /> }),
  },
  {
    id: "fact-sheet-waiting", group: "Staff", name: "Fact sheet waiting", to: "Compliance", when: "When a fact sheet is submitted", status: "sends",
    sample: () => ({ subject: staff.factSheetWaitingSubject({ title: "Moneybee PMS, August 2026" }), element: <staff.FactSheetWaiting date={DATE} title="Moneybee PMS, August 2026" product="Moneybee PMS" month="August 2026" submittedBy="Aditi Sharma" submittedAt="16 Oct 2026, 10:42 am" href="/admin/collections/fact-sheets/3" roleLabel="Compliance" /> }),
  },
  {
    id: "staff-new-complaint", group: "Staff", name: "New complaint", to: "The grievance officer and compliance", when: "When a complaint is registered", status: "planned", needs: "A complaint register in /admin",
    sample: () => ({ subject: staff.staffNewComplaintSubject({ number: "CMP-2026-0007", dueBy: "27 November 2026" }), element: <staff.StaffNewComplaint date={DATE} number="CMP-2026-0007" investor="Rohan Mehta" concerning="PMS account, client code MB01234" receivedAt="16 Oct 2026, 10:42 am" dueBy="27 November 2026" daysLeft={42} rule="PMS, 30 working days" message="My July statement shows a withdrawal of Rs. 5 lakh that I did not request. Please explain and correct it." href="/admin" roleLabel="Compliance" /> }),
  },
  {
    id: "mailing-waiting", group: "Staff", name: "Mailing waiting", to: "Compliance", when: "When a mailing is ready to send", status: "planned", needs: "A mailing desk with compliance approval",
    sample: () => ({ subject: staff.mailingWaitingSubject({ title: "Moneybee PMS: update for July 2026" }), element: <staff.MailingWaiting date={DATE} title="Moneybee PMS: update for July 2026" audience="PMS clients who receive the monthly update" recipients={214} writtenBy="The investment team" sendOn="8 August 2026" href="/admin" roleLabel="Compliance" /> }),
  },
  {
    id: "staff-password-reset", group: "Staff", name: "Staff password reset", to: "A staff member", when: "When they ask for a new /admin password", status: "sends",
    sample: (_, site) => ({ subject: security.setPasswordSubject({ who: "staff" }), element: <security.SetPassword name="Aditi Sharma" date={DATE} site={site} who="staff" href="/admin/reset/sample" validFor="1 hour" requestedAt="16 Oct 2026, 10:42 am" /> }),
  },
];

export const catalogueEntry = (id: string) => CATALOGUE.find((entry) => entry.id === id);

/** Which email a template's words go into, for the editor's preview and test send. */
export const EMAIL_FOR_PURPOSE: Record<string, string> = {
  enquiry_ack: "enquiry-received",
  enquiry_reply: "enquiry-reply",
  pms_introduction: "pms-introduction",
  aif_introduction: "aif-introduction",
  meeting_confirmation: "meeting-confirmation",
  follow_up: "meeting-follow-up",
  pms_checklist: "pms-checklist",
  aif_checklist: "aif-checklist",
  application_ack: "application-received",
  application_reject: "not-taken-forward",
  interview_invite: "interview-invitation",
  offer: "offer",
  other: "enquiry-reply",
};
