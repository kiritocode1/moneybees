/*
 * The starter email templates as the hiring migration (20261014_151509)
 * wrote them, frozen here so that migration writes the same rows on a fresh
 * database whatever lib/crm/starter-content.ts says now. Later migrations
 * move these rows on (20261016_*_email_letters compares bodies against them).
 */

export const TEMPLATES_2026_10_14 = {
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
} as const;
