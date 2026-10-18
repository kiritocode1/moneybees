import { Action, Bullets, Facts, Label, P, Quote, Severity, type SeverityLevel, Steps } from "./blocks";
import { MoneybeeEmail } from "./frame";

/*
 * Alerts to Moneybee staff. Each carries enough to act from the email
 * alone (who, what, how urgent, the playbook) and one link to the screen
 * in /admin. Staff footers say only why the person got it.
 */

type Base = { date?: string; href: string; roleLabel: string };
const reason = (roleLabel: string) => `You receive these alerts because you hold the ${roleLabel} role in Moneybee's admin.`;

export type StaffNewEnquiryProps = Base & {
  reference: string;
  title: string;
  severity: SeverityLevel;
  replyBy: string;
  receivedAt: string;
  contact: { label: string; value: string }[];
  message?: string;
  reasons: string[];
  playbook?: { name: string; steps: string[] };
};

export const staffNewEnquirySubject = ({ severity, title, replyBy }: Pick<StaffNewEnquiryProps, "severity" | "title" | "replyBy">) => `[${severity[0].toUpperCase()}${severity.slice(1)}] ${title}, reply by ${replyBy}`;

/** To the desk the playbook names when an enquiry arrives (lib/crm/enquiries.ts followUp). */
export function StaffNewEnquiry({ reference, title, severity, replyBy, receivedAt, contact, message, reasons, playbook, href, roleLabel, date }: StaffNewEnquiryProps) {
  const level = `${severity[0].toUpperCase()}${severity.slice(1)}`;
  return (
    <MoneybeeEmail audience="staff" date={date} reference={reference} preview={[reasons[0], playbook ? `Playbook: ${playbook.name}.` : null].filter(Boolean).join(" ")} eyebrow="New enquiry" title={title} reason={reason(roleLabel)}>
      <Severity level={severity}>Reply due by {replyBy}</Severity>
      <Facts rows={[[{ label: "Reference", value: reference, mono: true }, { label: "Received", value: receivedAt }], ...pairUp(contact)]} />
      {message ? <Quote>{message}</Quote> : null}
      {reasons.length ? (
        <>
          <Label>Why it is rated {level}</Label>
          <Bullets items={reasons} />
        </>
      ) : null}
      {playbook ? (
        <>
          <Label>Playbook: {playbook.name}</Label>
          <Steps items={playbook.steps} />
        </>
      ) : null}
      <Action href={href}>Open {reference}</Action>
    </MoneybeeEmail>
  );
}

const pairUp = (facts: { label: string; value: string }[]) => {
  const rows: { label: string; value: string }[][] = [];
  for (let i = 0; i < facts.length; i += 2) rows.push(facts.slice(i, i + 2));
  return rows;
};

export type StaffNewApplicationProps = Base & { reference: string; name: string; role: string; receivedAt: string; facts: { label: string; value: string }[]; mustHaves: { asked: number; met: number; missed: string[] } };

export const staffNewApplicationSubject = ({ name, role }: Pick<StaffNewApplicationProps, "name" | "role">) => `New application: ${name}, ${role}`;

/** To HR when someone applies (lib/hiring/apply.ts followUpApplication). */
export function StaffNewApplication({ reference, name, role, receivedAt, facts, mustHaves, href, roleLabel, date }: StaffNewApplicationProps) {
  return (
    <MoneybeeEmail audience="staff" date={date} reference={reference} preview={mustHaves.asked ? `Must-haves met: ${mustHaves.met} of ${mustHaves.asked}.` : `Applied for ${role}.`} eyebrow="New application" title={`${name}, ${role}`} reason={reason(roleLabel)}>
      <Facts rows={[[{ label: "Reference", value: reference, mono: true }, { label: "Received", value: receivedAt }], ...pairUp([...(mustHaves.asked ? [{ label: "Must-haves met", value: `${mustHaves.met} of ${mustHaves.asked}` }] : []), ...facts])]} />
      {mustHaves.missed.length ? (
        <>
          <Label>Answered no</Label>
          <Bullets items={mustHaves.missed} />
        </>
      ) : null}
      <Action href={href}>Open in the Hiring desk</Action>
    </MoneybeeEmail>
  );
}

export type FactSheetWaitingProps = Base & { title: string; product: string; month: string; submittedBy: string; submittedAt: string };

export const factSheetWaitingSubject = ({ title }: Pick<FactSheetWaitingProps, "title">) => `Fact sheet waiting for approval: ${title}`;

/** To compliance when a fact sheet is submitted (lib/backend/fact-sheet-workflow.ts). */
export function FactSheetWaiting({ title, product, month, submittedBy, submittedAt, href, roleLabel, date }: FactSheetWaitingProps) {
  return (
    <MoneybeeEmail audience="staff" date={date} preview={`Submitted by ${submittedBy}. Nothing reaches the site until it is approved.`} eyebrow="Fact sheet" title={`${title} is waiting for approval`} reason={reason(roleLabel)}>
      <Facts rows={[[{ label: "Product", value: product }, { label: "Month", value: month }], [{ label: "Submitted by", value: submittedBy }, { label: "Submitted", value: submittedAt }]]} />
      <P style={{ marginTop: 16 }}>Its figures reach the website, and the monthly update, only once you approve it. Someone other than the person who submitted it must approve.</P>
      <Action href={href}>Review the fact sheet</Action>
    </MoneybeeEmail>
  );
}

export type StaffNewComplaintProps = Base & { number: string; investor: string; concerning: string; receivedAt: string; dueBy: string; daysLeft: number; rule: string; message: string };

export const staffNewComplaintSubject = ({ number, dueBy }: Pick<StaffNewComplaintProps, "number" | "dueBy">) => `[Complaint] ${number}, respond by ${dueBy}`;

/** To the grievance officer and compliance when a complaint is registered. */
export function StaffNewComplaint({ number, investor, concerning, receivedAt, dueBy, daysLeft, rule, message, href, roleLabel, date }: StaffNewComplaintProps) {
  return (
    <MoneybeeEmail audience="staff" date={date} reference={number} preview={`${investor}. Respond by ${dueBy}.`} eyebrow="Investor complaint" title={`Complaint from ${investor}`} reason={reason(roleLabel)}>
      <Severity level="critical">Respond by {dueBy}, {daysLeft} days left</Severity>
      <Facts rows={[[{ label: "Complaint number", value: number, mono: true }, { label: "Received", value: receivedAt }], [{ label: "Concerning", value: concerning }, { label: "Deadline set by", value: rule }]]} />
      <Quote>{message}</Quote>
      <Action href={href}>Open {number}</Action>
    </MoneybeeEmail>
  );
}

export type MailingWaitingProps = Base & { title: string; audience: string; recipients: number; writtenBy: string; sendOn: string };

export const mailingWaitingSubject = ({ title }: Pick<MailingWaitingProps, "title">) => `Mailing waiting for approval: ${title}`;

/** To compliance when a mailing is ready to send. */
export function MailingWaiting({ title, audience, recipients, writtenBy, sendOn, href, roleLabel, date }: MailingWaitingProps) {
  return (
    <MoneybeeEmail audience="staff" date={date} preview={`${recipients} recipients. Nothing is sent until you approve it.`} eyebrow="Mailing" title={`${title} is waiting for approval`} reason={reason(roleLabel)}>
      <Facts rows={[[{ label: "To", value: audience }, { label: "Recipients", value: String(recipients) }], [{ label: "Written by", value: writtenBy }, { label: "Planned for", value: sendOn }]]} />
      <P style={{ marginTop: 16 }}>Nothing is sent until you approve it. Check any figures against the approved fact sheet, and that the disclosures are complete.</P>
      <Action href={href}>Review the mailing</Action>
    </MoneybeeEmail>
  );
}

export type TaskLine = { title: string; due: string; overdue?: boolean; person: string; href: string };

export type TaskAssignedProps = Base & { assignedBy: string; tasks: TaskLine[]; reference?: string };

export const taskAssignedSubject = ({ assignedBy, tasks }: Pick<TaskAssignedProps, "assignedBy" | "tasks">) => (tasks.length === 1 ? `A task for you from ${assignedBy}: ${tasks[0].title}` : `${tasks.length} tasks for you from ${assignedBy}`);

/** To a staff member when someone else gives them a task, or an enquiry's playbook steps (lib/crm/tasks.ts). */
export function TaskAssigned({ assignedBy, tasks, reference, href, roleLabel, date }: TaskAssignedProps) {
  const first = tasks[0];
  return (
    <MoneybeeEmail audience="staff" date={date} reference={reference} preview={`${first.title}, due ${first.due}.`} eyebrow="Tasks" title={tasks.length === 1 ? `${assignedBy} gave you a task` : `${assignedBy} gave you ${tasks.length} tasks`} reason={reason(roleLabel)}>
      {tasks.map((task) => (
        <Facts key={`${task.title}-${task.href}`} rows={[[{ label: "Task", value: task.title }], [{ label: "For", value: task.person }, { label: "Due", value: task.due }]]} />
      ))}
      <Action href={href}>{tasks.length === 1 ? "Open it" : "Open your tasks"}</Action>
    </MoneybeeEmail>
  );
}

export type TasksTodayProps = Base & { name: string; overdue: TaskLine[]; today: TaskLine[] };

export const tasksTodaySubject = ({ overdue, today }: Pick<TasksTodayProps, "overdue" | "today">) =>
  [overdue.length ? `${overdue.length} overdue` : null, today.length ? `${today.length} due today` : null].filter(Boolean).join(", ").replace(/^./, (c) => c.toUpperCase()) + ": your tasks";

/** Each working morning at 9:00, to each staff member with tasks overdue or due that day (app/api/cron/task-digest). Not sent on an empty day. */
export function TasksToday({ name, overdue, today, href, roleLabel, date }: TasksTodayProps) {
  // A playbook step ends in a full stop; the line goes on, so it is dropped. Under Due today, the time alone.
  const lines = (tasks: TaskLine[]) => tasks.map((task) => `${task.title.replace(/\.$/, "")}, ${task.person}, ${task.overdue ? `was due ${task.due}` : task.due.replace(/^Today, /, "")}`);
  return (
    <MoneybeeEmail audience="staff" date={date} preview={tasksTodaySubject({ overdue, today })} eyebrow="Tasks" title={`Good morning, ${name.split(/\s+/)[0]}`} reason={reason(roleLabel)}>
      {overdue.length ? (
        <>
          <Label>Overdue</Label>
          <Bullets items={lines(overdue)} />
        </>
      ) : null}
      {today.length ? (
        <>
          <Label>Due today</Label>
          <Bullets items={lines(today)} />
        </>
      ) : null}
      <Action href={href}>Open your tasks</Action>
    </MoneybeeEmail>
  );
}
