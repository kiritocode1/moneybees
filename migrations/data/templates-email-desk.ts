/*
 * The letters added with the Emails page (plan .plannotator/email-templates/merge),
 * frozen for 20261016_154500_email_desk_words: their purposes exist from
 * 20261016_154424_email_desk on.
 */

export const TEMPLATES_EMAIL_DESK = {
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
} as const;
