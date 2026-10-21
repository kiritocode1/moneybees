import type { Field } from "payload";

/** The parts of a collection config the delete guard reads. Tests can pass plain objects. */
export type DeleteCollection = {
  slug: string;
  fields: Field[];
  labels?: {
    singular?: unknown;
    plural?: unknown;
  };
  admin?: {
    useAsTitle?: string;
  };
};

/** A required relation that would stop a row from being deleted. */
export type DeleteDependency = {
  slug: string;
  path: string;
  singular: string;
  plural: string;
  titleField?: string;
};

/** One collection's count of records still pointing at the row being deleted. */
export type DeleteBlocker = {
  singular: string;
  plural: string;
  count: number;
  title?: string;
};

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

/** "fact-sheets" becomes "fact sheet", "enquiries" becomes "enquiry". */
function singularize(slug: string) {
  const words = slug.replace(/-/g, " ");
  if (/[^aeiou]ies$/i.test(words)) return `${words.slice(0, -3)}y`;
  if (/s$/i.test(words) && !/(ss|us|is)$/i.test(words)) return words.slice(0, -1);
  return words;
}

function humanize(words: string) {
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function pluralize(singular: string) {
  if (/[^aeiou]y$/i.test(singular)) return `${singular.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/i.test(singular)) return `${singular}es`;
  return `${singular}s`;
}

export function collectionLabels(collection: DeleteCollection) {
  const configuredSingular = text(collection.labels?.singular);
  const configuredPlural = text(collection.labels?.plural);
  const singular = configuredSingular ?? humanize(singularize(collection.slug));
  const plural = configuredPlural ?? (configuredSingular ? pluralize(singular) : humanize(collection.slug.replace(/-/g, " ")));
  return { singular, plural };
}

/**
 * Required single relations stored on another collection's own row. Those are
 * the ones Postgres rejects with `ON DELETE set null` because the column is
 * NOT NULL. Optional relations set null and hasMany relations cascade.
 */
function dependenciesIn(fields: Field[], target: string, prefix = ""): { path: string }[] {
  const found: { path: string }[] = [];

  for (const field of fields) {
    if (field.type === "relationship" || field.type === "upload") {
      if (field.hasMany || !field.required) continue;
      // Polymorphic relations live in a different shape. None exist today; a
      // future one needs its own query before this guard can block on it.
      if (typeof field.relationTo !== "string" || field.relationTo !== target) continue;
      found.push({ path: `${prefix}${field.name}` });
      continue;
    }

    if (field.type === "group") {
      const name = "name" in field && typeof field.name === "string" ? field.name : undefined;
      found.push(...dependenciesIn(field.fields, target, name ? `${prefix}${name}.` : prefix));
      continue;
    }

    if (field.type === "row" || field.type === "collapsible") {
      found.push(...dependenciesIn(field.fields, target, prefix));
      continue;
    }

    if (field.type === "tabs") {
      for (const tab of field.tabs) {
        const name = "name" in tab && typeof tab.name === "string" ? tab.name : undefined;
        found.push(...dependenciesIn(tab.fields, target, name ? `${prefix}${name}.` : prefix));
      }
    }
  }

  return found;
}

/** Every collection whose required relations point at `target`. System tables cascade, so skip them. */
export function requiredDependents(collections: readonly DeleteCollection[], target: string): DeleteDependency[] {
  return collections
    .filter((collection) => !collection.slug.startsWith("payload-"))
    .flatMap((collection) => {
      const { singular, plural } = collectionLabels(collection);
      return dependenciesIn(collection.fields, target).map(({ path }) => ({
        slug: collection.slug,
        path,
        singular,
        plural,
        titleField: collection.admin?.useAsTitle,
      }));
    });
}

/** Reads a dot path from a document, for collections whose title is nested. */
export function readTitle(doc: unknown, path: string | undefined): string | undefined {
  if (!doc || !path) return undefined;
  const value = path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) return (current as Record<string, unknown>)[key];
    return undefined;
  }, doc);
  return text(value);
}

function joinList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** The sentence shown in the admin's delete toast. */
export function describeDeleteBlockers(target: { label: string; title?: string }, blockers: readonly DeleteBlocker[]) {
  const label = text(target.label) ?? "record";
  const name = text(target.title) ?? `this ${label.toLowerCase()}`;
  const list = blockers.map((blocker) => {
    const noun = (blocker.count === 1 ? blocker.singular : blocker.plural).toLowerCase();
    const sample = blocker.title && blocker.count <= 3 ? ` ("${blocker.title}")` : "";
    return `${blocker.count} ${noun}${sample}`;
  });
  return `Deleting ${name} is not possible without deleting ${joinList(list)} first.`;
}
