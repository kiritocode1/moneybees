/*
 * The starter email templates as 20261016_072000_email_letters_words wrote
 * them, frozen so that migration writes the same rows on a fresh database
 * whatever lib/crm/starter-content.ts holds now (its later templates need
 * purposes added by 20261016_154424_email_desk).
 */

export const TEMPLATES_2026_10_16 = {
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
} as const;
