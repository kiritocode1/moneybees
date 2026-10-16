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
