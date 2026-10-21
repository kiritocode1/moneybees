import {
  APIError,
  type CollectionBeforeDeleteHook,
  type CollectionConfig,
  type CollectionSlug,
  type PayloadRequest,
  type SanitizedCollectionConfig,
} from "payload";
import {
  collectionLabels,
  describeDeleteBlockers,
  readTitle,
  requiredDependents,
  type DeleteBlocker,
} from "./delete-dependencies";

/** The title of the row being deleted, when the collection has one. */
async function targetTitle(req: PayloadRequest, collection: SanitizedCollectionConfig, id: number | string) {
  const field = typeof collection.admin.useAsTitle === "string" ? collection.admin.useAsTitle : undefined;
  if (!field) return undefined;

  try {
    const doc = await req.payload.findByID({
      collection: collection.slug,
      id,
      depth: 0,
      overrideAccess: true,
      req,
      showHiddenFields: true,
    });
    return readTitle(doc, field);
  } catch {
    return undefined;
  }
}

/**
 * Stops a delete before Postgres rejects it, and names the rows that must go
 * first. The checks come from the collection config, so every collection gets
 * the same behaviour without a per-collection list to maintain.
 */
export const deleteDependencyGuard: CollectionBeforeDeleteHook = async ({ id, collection, req }) => {
  const dependencies = requiredDependents(req.payload.config.collections, collection.slug);
  if (dependencies.length === 0) return;

  const blockers: DeleteBlocker[] = [];
  for (const dependency of dependencies) {
    const result = await req.payload.find({
      collection: dependency.slug as CollectionSlug,
      where: { [dependency.path]: { equals: id } },
      limit: 3,
      depth: 0,
      overrideAccess: true,
      req,
      showHiddenFields: true,
    });
    if (result.totalDocs === 0) continue;

    blockers.push({
      singular: dependency.singular,
      plural: dependency.plural,
      count: result.totalDocs,
      title: readTitle(result.docs[0], dependency.titleField),
    });
  }

  if (blockers.length === 0) return;

  throw new APIError(
    describeDeleteBlockers({ label: collectionLabels(collection).singular, title: await targetTitle(req, collection, id) }, blockers),
    400,
  );
};

/** Adds the guard in front of whatever delete hooks the collection already has. */
export function withDeleteGuard(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      beforeDelete: [deleteDependencyGuard, ...(collection.hooks?.beforeDelete ?? [])],
    },
  };
}
