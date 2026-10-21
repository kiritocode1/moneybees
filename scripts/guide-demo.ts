/**
 * Puts the Guide videos' demo people back where every take starts
 * (scripts/guide-videos.mjs runs it before each recording). All are owned by
 * Asha Rao (sales) and live on example.com addresses; nothing else is touched.
 *
 *   GUIDE_DEMO=1 npx payload run scripts/guide-demo.ts
 *
 * Refuses to run without GUIDE_DEMO=1, or in production: it deletes and
 * remakes these people's enquiries, deals, tasks, emails, timeline lines,
 * portal accounts and entities.
 */
import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { receiveEnquiry } from "@/lib/crm/enquiries";
import { workingDaysAfter } from "@/lib/crm/due";
import type { Contact, User } from "@/payload-types";

if (process.env.GUIDE_DEMO !== "1" || process.env.NODE_ENV === "production") {
  console.error("guide-demo: set GUIDE_DEMO=1 to reset the demo people (never in production).");
  process.exit(1);
}

const payload = await getPayload({ config });
const DAY = 86_400_000;
const at = (days: number, hour = 11) => {
  const day = new Date(Date.now() + days * DAY);
  return new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour, 0) - 330 * 60_000).toISOString();
};

const PEOPLE = {
  ananya: { name: "Ananya Bose", email: "ananya.bose@example.com", phone: "+919820044444", city: "Mumbai" },
  kunal: { name: "Kunal Shah", email: "kunal.shah@example.com", phone: "+919820055555", city: "Mumbai" },
  rohit: { name: "Rohit Kapoor", email: "rohit.kapoor@example.com", phone: "+919820066666", city: "Pune" },
  priya: { name: "Priya Menon", email: "priya.menon@example.com", phone: "+919820077777", city: "Bengaluru" },
  deepa: { name: "Deepa Iyer", email: "deepa.iyer@example.com", phone: "+919820088888", city: "Chennai" },
  sanjay: { name: "Sanjay Agarwal", email: "sanjay.agarwal@example.com", phone: "+919820099999", city: "Kolkata" },
} as const;

const one = async <T>(promise: Promise<{ docs: T[] }>) => (await promise).docs[0];
const asha = await one(payload.find({ collection: "users", where: { email: { equals: "asha.sales@moneybee.local" } }, limit: 1, depth: 0, overrideAccess: true }));
const product = async (slug: string) => one(payload.find({ collection: "products", where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true }));
const pms = await product("moneybee-pms");
const aif = await product("flyingbee");
if (!asha || !pms || !aif) throw new Error("guide-demo needs Asha Rao (asha.sales@moneybee.local) and the moneybee-pms and flyingbee products.");

/** Removes everything a demo person has, and the person. */
async function clear(email: string) {
  const person = await one(payload.find({ collection: "contacts", where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true }));
  if (!person) return;
  for (const collection of ["tasks", "activities", "emails", "deals", "enquiries"] as const) await payload.delete({ collection, where: { contact: { equals: person.id } }, overrideAccess: true });
  const entity = typeof person.entity === "object" ? person.entity?.id : person.entity;
  await payload.delete({ collection: "contacts", id: person.id, overrideAccess: true });
  // Their entity goes too, unless someone else invests through it.
  if (entity && !(await payload.count({ collection: "contacts", where: { entity: { equals: entity } }, overrideAccess: true })).totalDocs) await payload.delete({ collection: "entities", id: entity, overrideAccess: true });
  await payload.delete({ collection: "investors", where: { email: { equals: email } }, overrideAccess: true });
}

async function person(key: keyof typeof PEOPLE, extra: Partial<Contact> = {}) {
  return payload.create({ collection: "contacts", data: { ...PEOPLE[key], kind: "prospect", source: "website", owner: asha.id, ...extra }, overrideAccess: true });
}

async function deal(contact: Contact, data: { product: number; stage: "contacted" | "meeting" | "invested"; amount: number; days: number; investedOn?: string }) {
  const made = await payload.create({ collection: "deals", data: { title: `${contact.name}, ${data.product === pms.id ? pms.name : aif.name}`, contact: contact.id, product: data.product, stage: data.stage, ticketSize: data.amount, owner: asha.id, investedOn: data.investedOn }, overrideAccess: true });
  await payload.update({ collection: "deals", id: made.id, data: { stage: data.stage, stageChangedAt: at(-data.days, 10) }, overrideAccess: true });
  await line(contact, { deal: made.id, type: "stage", summary: `Asha Rao opened a ${data.product === pms.id ? pms.name : aif.name} deal` }, -data.days - 1);
  return made;
}

async function line(contact: Contact, data: { deal?: number; type: "form" | "stage" | "call" | "email_out" | "note"; summary: string; body?: string }, days: number) {
  await payload.create({ collection: "activities", data: { contact: contact.id, ...data, actor: data.type === "form" ? undefined : asha.id, at: at(days, 12) }, overrideAccess: true });
}

async function task(contact: Contact, data: { title: string; kind: "call" | "email" | "meeting" | "todo"; dueAt: string; deal?: number; letter?: string }) {
  await payload.create({ collection: "tasks", data: { ...data, source: "manual", owner: asha.id, contact: contact.id, createdBy: asha.id }, overrideAccess: true });
}

async function enquiry(kind: "pms" | "aif", answers: Record<string, string>) {
  const received = await receiveEnquiry(kind, answers, { page: "/contact" });
  if (!received.ok) throw new Error(`guide-demo: ${received.error}`);
}

async function reset(payload: Payload, owner: User) {
  for (const { email } of Object.values(PEOPLE)) await clear(email);

  // Ananya Bose: met nobody yet; her PMS deal sits at Contacted with nothing planned (A deal, from meeting to invested).
  const ananya = await person("ananya");
  await enquiry("pms", { ...PEOPLE.ananya, amount: "1 crore to 5 crore", message: "I would like to understand how the PMS works before investing about 2 crore." });
  await deal(ananya, { product: pms.id, stage: "contacted", amount: 2, days: 3 });

  // Kunal Shah: a meeting is set, and the checklist is due today (When a deal is lost).
  const kunal = await person("kunal");
  const kunalDeal = await deal(kunal, { product: pms.id, stage: "meeting", amount: 1.5, days: 5 });
  await task(kunal, { title: "Meeting, at the office", kind: "meeting", dueAt: at(1, 11), deal: kunalDeal.id });
  await task(kunal, { title: "Send the PMS account opening checklist", kind: "email", dueAt: at(0, 17), deal: kunalDeal.id });

  // Priya Menon: a prospect with a call overdue and a letter due today (Your tasks, A person's page, Sending a file).
  const priya = await person("priya");
  await line(priya, { type: "form", summary: "Sent the PMS form", body: "Could you explain the fees before I decide?" }, -6);
  await line(priya, { type: "call", summary: "Asha Rao logged a call", body: "Spoke. She wants the fee illustration and a call after reading it." }, -2);
  await task(priya, { title: "Call Priya Menon about the fees", kind: "call", dueAt: at(-1, 16) });
  await task(priya, { title: "Send Priya Menon the fee illustration", kind: "email", dueAt: at(0, 15) });
  await task(priya, { title: "Ask Priya Menon if she read the disclosure document", kind: "todo", dueAt: workingDaysAfter(new Date(), 3).toISOString() });

  // Deepa Iyer: invested this quarter, no portal account yet (Opening a client's portal account).
  const deepa = await person("deepa", { kind: "investor" });
  await deal(deepa, { product: pms.id, stage: "invested", amount: 1, days: 2, investedOn: at(-2, 10) });

  // Rohit Kapoor and Sanjay Agarwal arrive through the Contact form, as real enquiries do.
  await enquiry("pms", { name: PEOPLE.rohit.name, email: PEOPLE.rohit.email, phone: PEOPLE.rohit.phone, amount: "1 crore to 5 crore", city: PEOPLE.rohit.city, message: "I run a business in Pune and would like to move part of my savings into a PMS. What would you need from me?" });
  await enquiry("aif", { name: PEOPLE.sanjay.name, email: PEOPLE.sanjay.email, phone: PEOPLE.sanjay.phone, investor: "HUF", commitment: "1 crore to 5 crore", message: "Our family HUF would like to invest in Flyingbee. Please send the details." });
  for (const key of ["rohit", "sanjay"] as const) {
    const made = await one(payload.find({ collection: "contacts", where: { email: { equals: PEOPLE[key].email } }, limit: 1, depth: 0, overrideAccess: true }));
    if (made) await payload.update({ collection: "contacts", id: made.id, data: { owner: owner.id }, overrideAccess: true });
  }
}

await reset(payload, asha);
console.log("guide-demo: reset", Object.values(PEOPLE).map(({ name }) => name).join(", "));
process.exit(0);
