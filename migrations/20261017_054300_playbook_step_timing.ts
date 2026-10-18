import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/*
 * When each starter playbook step is due once someone takes the enquiry,
 * and the event that ticks it (lib/crm/tasks.ts). Frozen here by the step's
 * own words, so only steps still worded as the starter playbooks wrote them
 * change; a step compliance has reworded keeps With the reply. Two are rules
 * to keep in mind rather than tasks.
 */
const STEPS: { step: string; when: string; ticks: string | null }[] = [
  { step: 'Call the investor before writing.', when: 'reply', ticks: 'call' },
  { step: 'Check their account with operations before promising anything.', when: 'reply', ticks: null },
  { step: 'Copy compliance on the reply.', when: 'rule', ticks: null },
  { step: 'Log the call and what was agreed here.', when: 'reply', ticks: 'call' },
  { step: "Call within the reply time; email only if they don't pick up.", when: 'reply', ticks: 'call' },
  { step: 'Offer a meeting with the fund manager.', when: 'next_day', ticks: null },
  { step: 'Open a deal once a meeting is set.', when: 'three_days', ticks: 'deal' },
  { step: 'Confirm the Rs. 1 crore minimum and how they invest before sending documents.', when: 'reply', ticks: null },
  { step: 'Reply with the fact sheet and the Rs. 50 lakh minimum.', when: 'reply', ticks: 'reply' },
  { step: 'Ask for a time to call.', when: 'reply', ticks: 'reply' },
  { step: 'Confirm the Rs. 1 crore minimum before sending any material.', when: 'reply', ticks: null },
  { step: 'Send no AIF returns until compliance has cleared them for this person.', when: 'rule', ticks: null },
  { step: 'Find the client code in the back office.', when: 'reply', ticks: null },
  { step: 'Reply with what will happen and by when.', when: 'reply', ticks: 'reply' },
  { step: 'Answer it, or pass it to the right desk.', when: 'reply', ticks: 'reply' },
  { step: 'Close it with a line on what was done.', when: 'three_days', ticks: null },
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const { step, when, ticks } of STEPS) {
    await db.execute(sql`UPDATE playbooks_steps SET "when" = ${when}::enum_playbooks_steps_when, ticks_when = ${ticks}::enum_playbooks_steps_ticks_when WHERE step = ${step}`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`UPDATE playbooks_steps SET "when" = 'reply', ticks_when = NULL`)
}
