import { CAREERS } from "@/lib/careers";

/*
 * What each /careers section says, in the shape the Careers page record in
 * /admin stores it: today's words, written by the first migration so the page
 * reads the same. The roles are a list of their own (collections/Openings.ts);
 * resumes come in through the apply form (/careers/apply) to Hiring in /admin.
 */

export type CareersIntroContent = { label?: string | null; heading: string; lead?: string | null; buttonLabel?: string | null; resumeLabel?: string | null };
export type JobBoardContent = { heading: string };
export type CareersOfficeContent = { heading: string; text?: string | null; detail?: string | null; caption?: string | null; linkLabel?: string | null; link?: string | null };
export type CareersResumeContent = { heading: string; text?: string | null; buttonLabel: string; note?: string | null };

export const CAREERS_INTRO: CareersIntroContent = {
  label: "Careers at Moneybee",
  heading: "Build your career with Moneybee",
  lead: CAREERS.lead,
  buttonLabel: "View roles",
  resumeLabel: "Send your resume",
};

export const JOB_BOARD: JobBoardContent = { heading: "Find your role" };

export const CAREERS_OFFICE: CareersOfficeContent = {
  heading: "Life at Moneybee",
  text: "Our team works across listed and unlisted company research, portfolio management, corporate advisory and compliance.",
  detail: "Based in Lower Parel, Mumbai, Moneybee Group has been working with businesses and investors since 2004.",
  caption: "At our Lower Parel office",
  linkLabel: "Meet the team",
  link: "/about#team",
};

export const CAREERS_RESUME: CareersResumeContent = {
  heading: "Tell us about yourself.",
  text: "Send your resume with a short note about your experience and the team you would like to work with.",
  buttonLabel: "Send your resume",
};

/** /careers as it stood before it was editable, top to bottom. */
export const CAREERS_SECTIONS = [
  { blockType: "careersIntro", hidden: false, ...CAREERS_INTRO },
  { blockType: "jobBoard", hidden: false, ...JOB_BOARD },
  { blockType: "careersOffice", hidden: false, ...CAREERS_OFFICE },
  { blockType: "careersResume", hidden: false, ...CAREERS_RESUME },
] as const;
