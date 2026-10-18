/*
 * The option lists the CRM collections and the /admin screens share, so a
 * label is written once. Values are stored; labels are what staff read.
 */

type Options = readonly { value: string; label: string }[];
/** The stored values of an option list, e.g. "prospect" | "investor". */
export type ValueOf<T extends Options> = T[number]["value"];
/** Label for a stored value, falling back to the value itself. */
export const labelOf = <T extends Options>(options: T, value: string | null | undefined) => options.find((option) => option.value === value)?.label ?? value ?? "";

export const CONTACT_KINDS = [
  { value: "prospect", label: "Prospect" },
  { value: "investor", label: "Investor" },
  { value: "distributor", label: "Distributor" },
  { value: "other", label: "Other" },
] as const;

export const CONTACT_SOURCES = [
  { value: "website", label: "Website" },
  { value: "offline", label: "Offline" },
  { value: "referral", label: "Referral" },
  { value: "distributor", label: "Distributor" },
  { value: "import", label: "Import" },
  { value: "portal", label: "Client portal" },
] as const;

/** Mailings a person can agree to. A broadcast picks one, and only reaches people who chose it. */
export const TOPICS = [
  { value: "factsheet", label: "Monthly fact sheet" },
  { value: "insights", label: "Insights" },
  { value: "events", label: "Events" },
] as const;

export const ENTITY_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "huf", label: "HUF" },
  { value: "family_office", label: "Family office" },
  { value: "company", label: "Company" },
  { value: "trust", label: "Trust" },
  { value: "other", label: "Other" },
] as const;

export const ENQUIRY_STATUSES = [
  { value: "new", label: "New" },
  { value: "open", label: "Being handled" },
  { value: "waiting", label: "Waiting on them" },
  { value: "converted", label: "Turned into a deal" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
] as const;
export type EnquiryStatus = ValueOf<typeof ENQUIRY_STATUSES>;

export const ENQUIRY_KIND_LABELS = { pms: "PMS", aif: "AIF", support: "Investor support", general: "General" } as const;

export const DEAL_STAGES = [
  { value: "enquiry", label: "Enquiry" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting", label: "Meeting" },
  { value: "documents", label: "Documents sent" },
  { value: "onboarding", label: "Onboarding" },
  { value: "invested", label: "Invested" },
  { value: "lost", label: "Lost" },
] as const;
export type DealStage = ValueOf<typeof DEAL_STAGES>;

/** Why a deal was lost, picked when it moves to Lost; a line of detail goes with it. */
export const LOST_REASONS = [
  { value: "elsewhere", label: "Went with another manager" },
  { value: "minimum", label: "Below the minimum" },
  { value: "not_eligible", label: "Not eligible" },
  { value: "not_now", label: "Not now" },
  { value: "stopped_replying", label: "Stopped replying" },
  { value: "other", label: "Other" },
] as const;
export type LostReason = ValueOf<typeof LOST_REASONS>;

export const TASK_KINDS = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "todo", label: "To do" },
] as const;
export type TaskKind = ValueOf<typeof TASK_KINDS>;

/** Where a task came from. Most are made by the work, not typed in. */
export const TASK_SOURCES = [
  { value: "manual", label: "Added by hand" },
  { value: "call", label: "A call" },
  { value: "meeting", label: "A meeting" },
  { value: "note", label: "A note" },
  { value: "follow_up", label: "A task done" },
  { value: "playbook", label: "A playbook" },
  { value: "deal", label: "A deal moving" },
] as const;

/** When a playbook step is due once someone takes the enquiry, or "rule": not a task, a line to keep in mind. */
export const STEP_WHEN = [
  { value: "reply", label: "With the reply" },
  { value: "next_day", label: "Next working day" },
  { value: "three_days", label: "In three working days" },
  { value: "week", label: "In a week" },
  { value: "rule", label: "Not a task: a rule to keep in mind" },
] as const;
export type StepWhen = ValueOf<typeof STEP_WHEN>;

/** What ticks a playbook step off by itself. */
export const STEP_TICKS = [
  { value: "reply", label: "A reply is sent" },
  { value: "call", label: "A call is logged" },
  { value: "deal", label: "A deal is opened" },
] as const;
export type StepTick = ValueOf<typeof STEP_TICKS>;

export const ACTIVITY_TYPES = [
  { value: "form", label: "Website form" },
  { value: "email_out", label: "Email sent" },
  { value: "email_in", label: "Email received" },
  { value: "email_event", label: "Email opened or clicked" },
  { value: "call", label: "Call" },
  { value: "meeting", label: "Meeting" },
  { value: "note", label: "Note" },
  { value: "page_view", label: "Page viewed" },
  { value: "stage", label: "Stage changed" },
  { value: "task", label: "Task" },
  { value: "system", label: "System" },
] as const;
export type ActivityType = ValueOf<typeof ACTIVITY_TYPES>;

export const EMAIL_STATUSES = [
  { value: "queued", label: "Queued" },
  { value: "logged", label: "Not sent, email not connected" },
  { value: "sent", label: "Sent" },
  { value: "delivered", label: "Delivered" },
  { value: "opened", label: "Opened" },
  { value: "clicked", label: "Clicked" },
  { value: "bounced", label: "Bounced" },
  { value: "complained", label: "Marked as spam" },
  { value: "failed", label: "Failed" },
  { value: "received", label: "Received" },
] as const;
export type EmailStatus = ValueOf<typeof EMAIL_STATUSES>;

export const TEMPLATE_PURPOSES = [
  { value: "enquiry_ack", label: "Enquiry received (automatic)" },
  { value: "enquiry_reply", label: "Reply to an enquiry" },
  { value: "pms_introduction", label: "PMS introduction" },
  { value: "aif_introduction", label: "Flyingbee introduction" },
  { value: "meeting_confirmation", label: "Meeting confirmation" },
  { value: "follow_up", label: "Follow-up after a meeting" },
  { value: "pms_checklist", label: "PMS account opening" },
  { value: "aif_checklist", label: "Flyingbee subscription" },
  { value: "event_invitation", label: "Event invitation" },
  { value: "welcome", label: "Welcome, PMS account opened" },
  { value: "account_details", label: "Account details" },
  { value: "funds_received", label: "Funds received" },
  { value: "pms_monthly_update", label: "PMS monthly update" },
  { value: "pms_quarterly_report", label: "PMS quarterly report" },
  { value: "fee_statement", label: "Fee statement" },
  { value: "aif_investor_update", label: "Flyingbee investor update" },
  { value: "statement_ready", label: "Statement ready" },
  { value: "withdrawal_received", label: "Withdrawal received" },
  { value: "withdrawal_paid", label: "Withdrawal paid" },
  { value: "notice_of_change", label: "Notice of change" },
  { value: "kyc_due", label: "KYC or nomination due" },
  { value: "complaint_registered", label: "Complaint registered" },
  { value: "complaint_resolved", label: "Complaint resolved" },
  { value: "insights", label: "Insights" },
  { value: "application_ack", label: "Application received (automatic)" },
  { value: "application_reject", label: "Application not taken forward" },
  { value: "interview_invite", label: "Interview invitation" },
  { value: "offer", label: "Offer" },
  { value: "other", label: "Other" },
] as const;
