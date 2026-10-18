import type { Payload } from "payload";
import { OPEN_STAGES } from "@/lib/crm/deal-board";
import { ENTITY_TYPES, labelOf } from "@/lib/crm/vocabulary";
import type { Enquiry, Entity, User } from "@/payload-types";

/*
 * Who the money comes from. A person invests as themselves, or through an
 * entity (an HUF, family office, company or trust) that several people can
 * share, such as a father and son in one family's HUF. The Flyingbee form
 * asks for an investor type; when it says anything but Individual, the desk
 * is offered the entity to make (suggestedEntity). A person's open deals
 * follow their entity, so the deals board shows it; Invested and Lost deals
 * keep the one they closed with.
 */

export type EntityType = Exclude<Entity["type"], "individual">;
export type InvestsAs = { type: "self" } | { type: EntityType; name: string };

/** The choices for Invests as, Themselves first. */
export const INVESTS_AS = [{ value: "self", label: "Themselves" }, ...ENTITY_TYPES.filter(({ value }) => value !== "individual")] as { value: "self" | EntityType; label: string }[];

/** The Flyingbee form's investor types (lib/contact-v2.ts), as the entity types each could be. */
const FROM_FORM: Record<string, EntityType[]> = { HUF: ["huf"], "Family office": ["family_office"], "Company or trust": ["company", "trust"] };

/** What their latest enquiry that asked says they invest through, if not themselves: the form's words, and the entity types they could mean. */
export function suggestedEntity(enquiries: Pick<Enquiry, "answers" | "status">[]) {
  for (const enquiry of enquiries) {
    const said = enquiry.status === "spam" ? undefined : (enquiry.answers as Record<string, string> | null)?.investor;
    if (said) return FROM_FORM[said] ? { said, types: FROM_FORM[said] } : null;
  }
  return null;
}

/**
 * Sets what a person invests as. A name and type that already exist link
 * to that entity; otherwise the entity only they use is renamed, or a new
 * one is made. Their open deals follow, and the timeline gets a line.
 */
export async function setEntity(payload: Payload, user: User, personId: number, choice: InvestsAs) {
  const person = await payload.findByID({ collection: "contacts", id: personId, depth: 0, user, overrideAccess: false });
  const current = (typeof person.entity === "object" ? person.entity?.id : person.entity) ?? null;

  let entity: Entity | null = null;
  if (choice.type !== "self") {
    const name = choice.name.trim();
    const alike = await payload.find({ collection: "entities", where: { name: { like: name }, type: { equals: choice.type } }, limit: 20, depth: 0, user, overrideAccess: false });
    entity = alike.docs.find((doc) => doc.name.trim().toLowerCase() === name.toLowerCase()) ?? null;
    if (!entity && current) {
      const sharing = await payload.count({ collection: "contacts", where: { entity: { equals: current }, id: { not_equals: personId } }, user, overrideAccess: false });
      if (!sharing.totalDocs) entity = await payload.update({ collection: "entities", id: current, data: { name, type: choice.type }, user, overrideAccess: false });
    }
    entity ??= await payload.create({ collection: "entities", data: { name, type: choice.type }, user, overrideAccess: false });
  }

  const next = entity?.id ?? null;
  if (next !== current) await payload.update({ collection: "contacts", id: personId, data: { entity: next }, user, overrideAccess: false });
  const open = await payload.find({ collection: "deals", where: { contact: { equals: personId }, stage: { in: [...OPEN_STAGES] } }, limit: 20, depth: 0, user, overrideAccess: false });
  // The stage goes with the entity so the deal's stage stamp (collections/Deals.ts) sees no move.
  for (const deal of open.docs) await payload.update({ collection: "deals", id: deal.id, data: { entity: next, stage: deal.stage }, user, overrideAccess: false });

  const now = new Date().toISOString();
  await payload.create({
    collection: "activities",
    user,
    overrideAccess: false,
    data: { contact: personId, type: "system", summary: entity ? `${user.name} noted they invest through ${entity.name}` : `${user.name} noted they invest as themselves`, body: entity ? labelOf(ENTITY_TYPES, entity.type) : undefined, actor: user.id, at: now },
  });
  await payload.update({ collection: "contacts", id: personId, data: { lastActivityAt: now }, user, overrideAccess: false });
  return entity;
}
