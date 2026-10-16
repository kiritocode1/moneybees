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
  { value: "application_ack", label: "Application received (automatic)" },
  { value: "application_reject", label: "Application not taken forward" },
  { value: "interview_invite", label: "Interview invitation" },
  { value: "offer", label: "Offer" },
  { value: "other", label: "Other" },
] as const;
