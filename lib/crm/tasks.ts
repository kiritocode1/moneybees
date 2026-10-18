import type { Payload, PayloadRequest } from "payload";
import { createElement } from "react";
import { CATALOGUE } from "@/emails";
import { renderEmail, siteOrigin } from "@/emails/render";
import { TaskAssigned, type TaskLine, TasksToday, taskAssignedSubject, tasksTodaySubject } from "@/emails/staff";
import { dueLabel, istAt, workingDaysAfter } from "@/lib/crm/due";
import { enquiryReference } from "@/lib/crm/reference";
import { STARTER_TEMPLATES } from "@/lib/crm/starter-content";
import { kindFromTitle } from "@/lib/crm/task-kind";
import type { StepTick, StepWhen } from "@/lib/crm/vocabulary";
import type { Contact, EmailTemplate, Playbook, Task, User } from "@/payload-types";

/*
 * The work that makes tasks, so nobody has to remember to add them: an
 * enquiry's playbook steps become the owner's tasks when it is taken, due
 * when each step says; a step ticks itself when its event happens (a reply
 * sent, a call logged, a deal opened). Also the "Done" line every finished
 * task leaves on the person's timeline, and the email to someone given a
 * task by somebody else. Callers check the staff member's role first.
 */

type Actor = Pick<User, "id" | "name">;

const idOf = (value: number | { id: number } | null | undefined) => (value && typeof value === "object" ? value.id : (value ?? undefined));

/** When a playbook step is due: with the reply means the enquiry's reply-by time. */
export function stepDue(when: StepWhen, replyBy: string | null | undefined, now: Date) {
  if (when === "reply") return replyBy ? new Date(replyBy) : workingDaysAfter(now, 1);
  if (when === "three_days") return workingDaysAfter(now, 3);
  if (when === "week") return istAt(now, 7, 10);
  return workingDaysAfter(now, 1);
}

/** The Emails page id of the letter an Email templates row draws, so an email task opens it. */
export const letterFor = (purpose: string | null | undefined) => (purpose ? (CATALOGUE.find((entry) => entry.template && STARTER_TEMPLATES[entry.template].purpose === purpose)?.id ?? null) : null);

const TICK_REASONS: Record<StepTick, string> = { reply: "Ticked when the reply was sent.", call: "Ticked when a call was logged.", deal: "Ticked when the deal was opened." };

/** Marks a task done and leaves its line on the person's timeline, where its outcome and Undo find it. */
export async function markDone(payload: Payload, task: Task, actor: Actor, { body, req, closed = false }: { body?: string; req?: Partial<PayloadRequest>; closed?: boolean } = {}) {
  const now = new Date().toISOString();
  await payload.update({ collection: "tasks", id: task.id, overrideAccess: true, req, data: { doneAt: now, doneBy: actor.id, ...(body ? { outcome: body } : {}) } });
  const contact = idOf(task.contact);
  if (!contact) return;
  await payload.create({
    collection: "activities",
    overrideAccess: true,
    req,
    data: { contact, enquiry: idOf(task.enquiry), deal: idOf(task.deal), task: task.id, type: "task", summary: `${actor.name} ${closed ? "closed" : "did"}: ${task.title}`, body, actor: actor.id, at: now },
  });
}

/**
 * Makes an enquiry's playbook steps into tasks for its owner, once each:
 * a step already made into a task is left as it is, and a rule is skipped.
 * Returns the tasks made, for the email to their owner (some may already be
 * ticked, when their event happened before anyone took the enquiry).
 */
export async function tasksFromPlaybook(payload: Payload, enquiryId: number, owner: Actor, actor: Actor, now = new Date()) {
  const enquiry = await payload.findByID({ collection: "enquiries", id: enquiryId, depth: 0, overrideAccess: true });
  const contact = idOf(enquiry.contact);
  const playbookId = idOf(enquiry.playbook);
  if (!contact || !playbookId) return [];
  const [playbook, existing] = await Promise.all([
    payload.findByID({ collection: "playbooks", id: playbookId, depth: 1, overrideAccess: true }) as Promise<Playbook>,
    payload.find({ collection: "tasks", where: { enquiry: { equals: enquiryId }, step: { exists: true } }, limit: 100, depth: 0, overrideAccess: true }),
  ]);
  const made = new Set(existing.docs.map((task) => task.step));
  const letter = letterFor((playbook.template as EmailTemplate | null | undefined)?.purpose);
  const created: Task[] = [];
  for (const step of playbook.steps ?? []) {
    const when = (step.when ?? "reply") as StepWhen;
    if (!step.id || when === "rule" || made.has(step.id)) continue;
    const kind = kindFromTitle(step.step);
    created.push(
      await payload.create({
        collection: "tasks",
        overrideAccess: true,
        data: { title: step.step, kind, source: "playbook", dueAt: stepDue(when, enquiry.dueAt, now).toISOString(), owner: owner.id, contact, enquiry: enquiryId, deal: idOf(enquiry.deal), step: step.id, letter: kind === "email" ? letter : null, createdBy: actor.id },
      }),
    );
  }
  // A step whose event already happened (the deal opened, the reply sent) ticks at once.
  if (created.length && enquiry.deal) await tickSteps(payload, enquiryId, "deal", actor);
  if (created.length && enquiry.firstResponseAt) await tickSteps(payload, enquiryId, "reply", actor);
  return created;
}

/** The enquiry changed hands: its open playbook tasks go with it. */
export async function movePlaybookTasks(payload: Payload, enquiryId: number, ownerId: number) {
  await payload.update({ collection: "tasks", where: { enquiry: { equals: enquiryId }, source: { equals: "playbook" }, doneAt: { exists: false } }, overrideAccess: true, data: { owner: ownerId } });
}

/** Ticks the enquiry's open playbook tasks whose step ticks itself on this event. */
export async function tickSteps(payload: Payload, enquiryId: number | null | undefined, event: StepTick, actor: Actor) {
  if (!enquiryId) return 0;
  const tasks = await payload.find({ collection: "tasks", where: { enquiry: { equals: enquiryId }, step: { exists: true }, doneAt: { exists: false } }, limit: 50, depth: 0, overrideAccess: true });
  if (!tasks.docs.length) return 0;
  const enquiry = await payload.findByID({ collection: "enquiries", id: enquiryId, depth: 0, overrideAccess: true });
  const playbookId = idOf(enquiry.playbook);
  if (!playbookId) return 0;
  const playbook = await payload.findByID({ collection: "playbooks", id: playbookId, depth: 0, overrideAccess: true });
  const ticking = new Set((playbook.steps ?? []).filter((step) => step.ticksWhen === event).map((step) => step.id));
  const due = tasks.docs.filter((task) => task.step && ticking.has(task.step));
  for (const task of due) await markDone(payload, task, actor, { body: TICK_REASONS[event] });
  return due.length;
}

/** One line of a task email: what, for whom, when, and where to open it. */
export function taskLine(task: Task, now: Date): TaskLine {
  const contact = task.contact && typeof task.contact === "object" ? (task.contact as Contact) : null;
  return {
    title: task.title,
    due: dueLabel(new Date(task.dueAt), now),
    overdue: new Date(task.dueAt) < now,
    person: contact?.name ?? "No one named",
    href: contact ? `/admin/people/${contact.id}` : "/admin/tasks",
  };
}

const roleLabel = (user: User) => (user.roles ?? []).filter((role) => role !== "admin").map((role) => role[0].toUpperCase() + role.slice(1)).join(" or ") || "Admin";

/** Tells a staff member that someone else gave them tasks. Nothing when they gave them to themselves. */
export async function tellNewOwner(payload: Payload, ownerId: number, actor: Actor, tasks: Task[], origin: string, now = new Date()) {
  if (!tasks.length || ownerId === actor.id) return;
  const owner = await payload.findByID({ collection: "users", id: ownerId, depth: 0, overrideAccess: true, disableErrors: true });
  if (!owner?.email) return;
  // Read again, so a step that ticked itself on creation is not announced.
  const withPeople = await payload.find({ collection: "tasks", where: { id: { in: tasks.map((task) => task.id) }, doneAt: { exists: false } }, depth: 1, limit: tasks.length, overrideAccess: true });
  if (!withPeople.docs.length) return;
  const lines = withPeople.docs.map((task) => taskLine(task, now));
  const enquiry = idOf(tasks[0].enquiry);
  const email = await renderEmail(
    createElement(TaskAssigned, { assignedBy: actor.name, tasks: lines, reference: enquiry ? enquiryReference(enquiry) : undefined, href: lines.length === 1 ? lines[0].href : "/admin/tasks", roleLabel: roleLabel(owner) }),
    origin,
  );
  await payload.sendEmail({ to: owner.email, subject: taskAssignedSubject({ assignedBy: actor.name, tasks: lines }), ...email });
}

/**
 * The morning email (app/api/cron/task-digest, weekdays 9:00 in Mumbai): to
 * each desk member with tasks overdue or due today, those tasks. Nobody
 * gets one on an empty day. Returns how many went.
 */
export async function sendTaskDigests(payload: Payload, now = new Date()) {
  const endOfToday = istAt(now, 1, 0);
  const { docs } = await payload.find({
    collection: "tasks",
    where: { doneAt: { exists: false }, dueAt: { less_than: endOfToday.toISOString() } },
    sort: "dueAt",
    limit: 2000,
    depth: 1,
    overrideAccess: true,
  });
  const byOwner = new Map<number, Task[]>();
  for (const task of docs) {
    const owner = idOf(task.owner);
    if (owner) byOwner.set(owner, [...(byOwner.get(owner) ?? []), task]);
  }
  let sent = 0;
  for (const [ownerId, tasks] of byOwner) {
    const owner = tasks[0].owner && typeof tasks[0].owner === "object" ? (tasks[0].owner as User) : null;
    if (!owner?.email) continue;
    const lines = tasks.map((task) => taskLine(task, now));
    const overdue = lines.filter((line) => line.overdue);
    const today = lines.filter((line) => !line.overdue);
    const email = await renderEmail(createElement(TasksToday, { name: owner.name, overdue, today, href: "/admin/tasks", roleLabel: roleLabel(owner) }), siteOrigin());
    await payload.sendEmail({ to: owner.email, subject: tasksTodaySubject({ overdue, today }), ...email });
    sent += 1;
    payload.logger.info({ msg: "Task digest sent", ownerId, tasks: lines.length });
  }
  return sent;
}
