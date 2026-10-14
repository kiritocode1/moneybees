/*
 * The email templates and playbooks every database starts with, as drafts for
 * compliance and HR to edit in /admin. They name no one, so the migration
 * that adds hiring (migrations/20261014_*_hiring.ts) writes them to
 * production too, where none exist yet; scripts/seed-crm.ts reuses them
 * locally. Merge fields in double braces are filled in when an email is sent.
 */

export type StarterTemplate = { name: string; purpose: string; subject: string; body: string };

export const STARTER_TEMPLATES = {
  enquiryAck: {
    name: "Enquiry received",
    purpose: "enquiry_ack",
    subject: "We have your enquiry ({{reference}})",
    body: "Hello {{firstName}},\n\nThank you for writing to Moneybee. Your reference is {{reference}}. Someone from our team will reply to this address.\n\nIf it is urgent, call us on 022-4030 2080.\n\nMoneybee",
  },
  pmsReply: {
    name: "PMS first reply",
    purpose: "enquiry_reply",
    subject: "Moneybee PMS: your enquiry ({{reference}})",
    body: "Hello {{firstName}},\n\nThank you for your interest in Moneybee PMS. The minimum investment is Rs. 50 lakh, as SEBI sets for portfolio management services.\n\nI have attached our latest fact sheet. Could we find 20 minutes this week to talk through how we invest and whether it suits you?\n\n{{senderName}}\nMoneybee",
  },
  aifReply: {
    name: "AIF first reply",
    purpose: "enquiry_reply",
    subject: "Flyingbee Investment Fund: your enquiry ({{reference}})",
    body: "Hello {{firstName}},\n\nThank you for asking about the Flyingbee Investment Fund, our Category III AIF. The minimum commitment is Rs. 1 crore.\n\nBefore I send the fund's documents, could you confirm you are investing as an individual, HUF, family office or company? I would also like to set up a call with the fund team.\n\n{{senderName}}\nMoneybee",
  },
  complaint: {
    name: "Investor concern, first reply",
    purpose: "enquiry_reply",
    subject: "Your message to Moneybee ({{reference}})",
    body: "Hello {{firstName}},\n\nThank you for telling us. I am looking into this now with our operations team and will call you today.\n\nYour reference is {{reference}}. Please quote it if you write to us again.\n\n{{senderName}}\nMoneybee",
  },
  applicationAck: {
    name: "Application received",
    purpose: "application_ack",
    subject: "We have your application ({{reference}})",
    body: "Hello {{firstName}},\n\nThank you for applying for {{role}} at Moneybee. Your reference is {{reference}}.\n\nIf we would like to talk, we will write to you at this address.\n\nMoneybee",
  },
  applicationReject: {
    name: "Application not taken forward",
    purpose: "application_reject",
    subject: "Your application for {{role}}",
    body: "Hello {{firstName}},\n\nThank you for applying to Moneybee. We have decided not to take your application for {{role}} forward.\n\nWe will keep your details until {{keptUntil}} in case a similar role opens, unless you ask us to delete them.\n\nMoneybee",
  },
  interviewInvite: {
    name: "Interview invitation",
    purpose: "interview_invite",
    subject: "Interview for {{role}} at Moneybee",
    body: "Hello {{firstName}},\n\nWe would like to meet you about the {{role}} role.\n\nWhen: {{interviewAt}}\nWhere: {{interviewPlace}}\nWith: {{interviewWith}}\n\nIf that time does not suit you, reply with two or three times that do.\n\n{{senderName}}\nMoneybee",
  },
  offer: {
    name: "Offer",
    purpose: "offer",
    subject: "Your offer from Moneybee",
    body: "Hello {{firstName}},\n\nWe would like to offer you the {{role}} role at Moneybee.\n\n[Write the terms here: start date, salary, and anything else agreed.]\n\nReply to this email with any questions, or to accept.\n\n{{senderName}}\nMoneybee",
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
