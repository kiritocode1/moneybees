/*
 * The hiring vocabulary the Applications collection, the server actions and
 * the /admin/hiring screens share (.plannotator/hiring-cycle/plan.md). Client
 * safe: nothing here imports a server module.
 */

/** Where an application stands. Every open one moves forward one stage at a time, or to Closed. */
export const STAGES = [
  { value: "new", label: "New" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "closed", label: "Closed" },
] as const;
export type Stage = (typeof STAGES)[number]["value"];

/** The one stage each open stage moves to next, and the button that moves it. */
export const NEXT = {
  new: { stage: "shortlisted", action: "Shortlist" },
  shortlisted: { stage: "interview", action: "Invite to interview" },
  interview: { stage: "offer", action: "Make an offer" },
  offer: { stage: "hired", action: "Mark as hired" },
} as const satisfies Partial<Record<Stage, { stage: Stage; action: string }>>;

/** Stages still being worked; Hired and Closed are finished. */
export const OPEN_STAGES = ["new", "shortlisted", "interview", "offer"] as const satisfies readonly Stage[];
export const isOpenStage = (stage: string): stage is keyof typeof NEXT => (OPEN_STAGES as readonly string[]).includes(stage);

export const CLOSE_REASONS = [
  { value: "not_taken_forward", label: "Not taken forward" },
  { value: "role_filled", label: "Role filled" },
  { value: "withdrew", label: "They withdrew" },
] as const;
export type CloseReason = (typeof CLOSE_REASONS)[number]["value"];

export const NOTICE_PERIODS = [
  { value: "now", label: "Can start now" },
  { value: "15", label: "15 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days or more" },
] as const;
export type Notice = (typeof NOTICE_PERIODS)[number]["value"];

/** The /admin/hiring tabs: one per stage. */
export const HIRING_TABS = STAGES.map(({ value, label }) => ({ key: value, label }));

export const stageLabel = (stage: string) => STAGES.find((option) => option.value === stage)?.label ?? stage;
export const noticeLabel = (notice: string | null | undefined) => NOTICE_PERIODS.find((option) => option.value === notice)?.label ?? "";

/** "APP-00012": what the applicant quotes and HR searches by. */
export const applicationReference = (id: number) => `APP-${String(id).padStart(5, "0")}`;

/** One row of the /admin/hiring list. */
export type HiringRow = {
  id: number;
  reference: string;
  name: string;
  role: string;
  /** "Investment research" for an open application, else null. */
  team: string | null;
  /** How many must-haves they answered yes to, of how many asked; null when none were asked. */
  mustHaves: { yes: number; of: number } | null;
  notice: string;
  receivedAt: string;
  owner: string | null;
  stage: Stage;
  closeReason: string | null;
};
