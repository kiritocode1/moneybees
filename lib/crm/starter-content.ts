/*
 * The email templates and playbooks every database starts with, as drafts for
 * compliance and HR to edit in /admin. They name no one, so the migration
 * that adds hiring (migrations/20261014_*_hiring.ts) writes them to
 * production too, where none exist yet; scripts/seed-crm.ts reuses them
 * locally. Merge fields in double braces are filled in when an email is sent.
 * A body is only the letter's own words: the greeting, the facts, the
 * signature and the disclosures are drawn by the email it goes into (emails/).
 */

export type StarterTemplate = { name: string; purpose: string; subject: string; body: string };

export const STARTER_TEMPLATES = {
  enquiryAck: {
    name: "Enquiry received",
    purpose: "enquiry_ack",
    subject: "Your enquiry has been received ({{reference}})",
    body: "Thank you for writing to Moneybee. A member of our team will reply to this address by {{replyBy}}.",
  },
  pmsReply: {
    name: "PMS introduction",
    purpose: "pms_introduction",
    subject: "Moneybee Portfolio Management Service: the information you requested ({{reference}})",
    body: "Thank you for your interest in Moneybee's Portfolio Management Service. As requested, here are our latest fact sheet and Disclosure Document, with a summary below of how we manage portfolios.\n\nWe invest in small and mid-sized Indian companies that lead their niche, and hold them while they grow. The stocks are held in your own demat account, so you see every holding.",
  },
  aifReply: {
    name: "Flyingbee introduction",
    purpose: "aif_introduction",
    subject: "Flyingbee Investment Fund: your enquiry ({{reference}})",
    body: "Thank you for your interest in the Flyingbee Investment Fund, our Category III Alternative Investment Fund. It invests in high-growth listed companies, and in unlisted companies before they go public.\n\nThe fund is offered privately, to eligible investors only. Before I send the Private Placement Memorandum, could you please confirm how you would invest: as a resident or non-resident individual, an HUF or a company? The minimum commitment is Rs. 1 crore.",
  },
  complaint: {
    name: "Investor concern, first reply",
    purpose: "enquiry_reply",
    subject: "Your message to Moneybee ({{reference}})",
    body: "Thank you for bringing this to our attention. I am looking into it now with our operations team, and will call you today.\n\nPlease quote reference {{reference}} if you write to us again.",
  },
  meetingConfirmation: {
    name: "Meeting confirmation",
    purpose: "meeting_confirmation",
    subject: "Our meeting on {{meetingAt}}",
    body: "Thank you for making the time to meet us. I am writing to confirm the details below.\n\nShould anything change, please reply to this email or call me, and we will find another time.",
  },
  meetingFollowUp: {
    name: "Meeting follow-up",
    purpose: "follow_up",
    subject: "Following our meeting on {{meetingOn}}",
    body: "Thank you for meeting us on {{meetingOn}}. As promised, here is a summary of what we discussed.\n\n[Write the points discussed here, one paragraph each.]",
  },
  pmsChecklist: {
    name: "PMS account opening",
    purpose: "pms_checklist",
    subject: "Opening your Moneybee PMS account ({{reference}})",
    body: "Thank you for choosing to open an account with Moneybee's Portfolio Management Service. Below is everything we need from you, and the order in which it happens.",
  },
  aifChecklist: {
    name: "Flyingbee subscription",
    purpose: "aif_checklist",
    subject: "Investing in Flyingbee Investment Fund ({{reference}})",
    body: "Thank you for choosing to invest in the Flyingbee Investment Fund. Below is everything we need from you to complete your subscription.",
  },
  eventInvitation: {
    name: "Event invitation",
    purpose: "event_invitation",
    subject: "Invitation: {{title}}, {{when}}",
    body: "We would be glad to have you at our next investor meet, where the investment team will talk through the portfolio and take questions.",
  },
  welcome: {
    name: "Welcome, PMS account opened",
    purpose: "welcome",
    subject: "Your Moneybee PMS account is open ({{clientCode}})",
    body: "Thank you for placing your trust in Moneybee. Your Portfolio Management Service account is now open. Please keep this email; it holds the details you will need when you write to us.",
  },
  accountDetails: {
    name: "Account details",
    purpose: "account_details",
    subject: "Your PMS account details ({{clientCode}})",
    body: "As SEBI requires, here are the details of where your securities and funds are held. Your securities are held in your own name.",
  },
  fundsReceived: {
    name: "Funds received",
    purpose: "funds_received",
    subject: "We have received {{amount}} ({{reference}})",
    body: "We have received {{amount}} on {{receivedOn}}. The details are below.",
  },
  pmsMonthlyUpdate: {
    name: "PMS monthly update",
    purpose: "pms_monthly_update",
    subject: "Moneybee PMS: update for {{month}}",
    body: "[The investment team's letter for the month: what moved the portfolio, what changed and why. No forecasts of returns.]",
  },
  pmsQuarterlyReport: {
    name: "PMS quarterly report",
    purpose: "pms_quarterly_report",
    subject: "Your PMS account statement for the quarter ended {{quarter}}",
    body: "Your account statement for the quarter ended {{quarter}} is ready in the investor portal. It is in the format SEBI prescribes for portfolio managers.",
  },
  feeStatement: {
    name: "Fee statement",
    purpose: "fee_statement",
    subject: "Your PMS fee statement for {{period}}",
    body: "Here are the fees and expenses charged to your account for {{period}}, calculated as set out in the fees annexure to your agreement.",
  },
  aifInvestorUpdate: {
    name: "Flyingbee investor update",
    purpose: "aif_investor_update",
    subject: "Private and confidential: Flyingbee Investment Fund, update to {{asOf}}",
    body: "[The fund manager's note for the quarter.]",
  },
  statementReady: {
    name: "Statement ready",
    purpose: "statement_ready",
    subject: "{{statement}} is ready",
    body: "{{statement}} for {{period}} has been added to your investor portal. For your security, we do not attach statements to emails.",
  },
  withdrawalReceived: {
    name: "Withdrawal received",
    purpose: "withdrawal_received",
    subject: "Your withdrawal request for {{amount}} has been received",
    body: "We have received your request to withdraw {{amount}}. We will pay it to your registered bank account below.",
  },
  withdrawalPaid: {
    name: "Withdrawal paid",
    purpose: "withdrawal_paid",
    subject: "Your withdrawal of {{amount}} has been paid",
    body: "We have paid {{amount}} to your registered bank account. The details are below.",
  },
  noticeOfChange: {
    name: "Notice of change",
    purpose: "notice_of_change",
    subject: "Notice of change: {{change}}",
    body: "We are writing to tell you of a change to {{product}}, effective from {{effectiveFrom}}.\n\n[Why the change is being made, in plain words.]",
  },
  kycDue: {
    name: "KYC or nomination due",
    purpose: "kyc_due",
    subject: "Action needed: {{item}}",
    body: "Our records show that your account needs the update below. Please complete it by {{dueBy}}.",
  },
  complaintRegistered: {
    name: "Complaint registered",
    purpose: "complaint_registered",
    subject: "Your complaint has been registered ({{number}})",
    body: "We have registered your complaint and will respond to you in writing by {{dueBy}}.",
  },
  complaintResolved: {
    name: "Complaint resolved",
    purpose: "complaint_resolved",
    subject: "Our response to your complaint ({{number}})",
    body: "Thank you for your patience while we looked into your complaint.\n\n[What we found, in plain words.]",
  },
  insights: {
    name: "Insights",
    purpose: "insights",
    subject: "{{title}}",
    body: "We have published a new article in Insights, which we thought you would find useful.",
  },
  applicationAck: {
    name: "Application received",
    purpose: "application_ack",
    subject: "Your application has been received ({{reference}})",
    body: "Thank you for applying for {{role}} at Moneybee. We will read your application carefully, and if we would like to meet you, we will write to you at this address.",
  },
  applicationReject: {
    name: "Application not taken forward",
    purpose: "application_reject",
    subject: "Your application for {{role}}",
    body: "Thank you for your interest in Moneybee and for the time you gave to your application. After careful consideration, we have decided not to take your application for {{role}} further.\n\nWe will keep your details until {{keptUntil}} in case a similar role opens, unless you ask us to delete them sooner.",
  },
  interviewInvite: {
    name: "Interview invitation",
    purpose: "interview_invite",
    subject: "Interview for {{role}} at Moneybee",
    body: "Thank you for your application for {{role}}. We would like to invite you to an interview; the details are below.\n\nIf the time does not suit you, please reply with two or three times that do.",
  },
  offer: {
    name: "Offer",
    purpose: "offer",
    subject: "Your offer from Moneybee",
    body: "We are pleased to offer you the position of {{role}} at Moneybee.\n\n[Write the terms here: start date, salary, and anything else agreed.]\n\nPlease reply to this email to accept, or with any questions.",
  },
} as const satisfies Record<string, StarterTemplate>;

export type StarterTemplateKey = keyof typeof STARTER_TEMPLATES;

/** The enquiry playbooks, first match wins by order. `template` names a starter template. */
export const STARTER_PLAYBOOKS = [
  { name: "Investor withdrawal or complaint", order: 10, kinds: [], severities: ["critical"], responseHours: 2, handlerRoles: ["operations", "compliance"], template: "complaint", steps: ["Call the investor before writing.", "Check their account with operations before promising anything.", "Copy compliance on the reply.", "Log the call and what was agreed here."] },
  { name: "Large PMS investor", order: 20, kinds: ["pms"], severities: ["high"], responseHours: 4, handlerRoles: ["sales"], template: "pmsReply", steps: ["Call within the reply time; email only if they don't pick up.", "Offer a meeting with the fund manager.", "Open a deal once a meeting is set."] },
  { name: "Large AIF investor", order: 21, kinds: ["aif"], severities: ["high"], responseHours: 4, handlerRoles: ["sales"], template: "aifReply", steps: ["Call within the reply time; email only if they don't pick up.", "Confirm the Rs. 1 crore minimum and how they invest before sending documents.", "Open a deal once a meeting is set."] },
  { name: "PMS enquiry", order: 30, kinds: ["pms"], severities: [], responseHours: 24, handlerRoles: ["sales"], template: "pmsReply", steps: ["Reply with the fact sheet and the Rs. 50 lakh minimum.", "Ask for a time to call."] },
  { name: "AIF enquiry", order: 40, kinds: ["aif"], severities: [], responseHours: 24, handlerRoles: ["sales"], template: "aifReply", steps: ["Confirm the Rs. 1 crore minimum before sending any material.", "Send no AIF returns until compliance has cleared them for this person."] },
  { name: "Investor support", order: 50, kinds: ["support"], severities: [], responseHours: 24, handlerRoles: ["operations"], template: null, steps: ["Find the client code in the back office.", "Reply with what will happen and by when."] },
  { name: "General enquiry", order: 90, kinds: ["general"], severities: [], responseHours: 72, handlerRoles: ["sales"], template: null, steps: ["Answer it, or pass it to the right desk.", "Close it with a line on what was done."] },
] as const satisfies readonly {
  name: string;
  order: number;
  kinds: readonly string[];
  severities: readonly string[];
  responseHours: number;
  handlerRoles: readonly string[];
  template: StarterTemplateKey | null;
  steps: readonly string[];
}[];
