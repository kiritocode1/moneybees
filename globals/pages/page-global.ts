import { revalidatePath } from "next/cache";
import type { Block, Field, GlobalAfterChangeHook, GlobalAfterReadHook, GlobalConfig, GlobalSlug } from "payload";
import { allow } from "@/lib/backend/roles";
import type { Action } from "@/lib/pages/home-content";
import { SECTION_KINDS, type SectionKind } from "@/lib/pages/sections";

/*
 * What every editable page shares (globals/HomePage.ts, globals/PmsPage.ts
 * and the rest): its sections as blocks, edited beside the live page
 * (user, 2026-10-12: show the section, then edit it), drafts that save
 * themselves, and Publish to put them on the site.
 */

/** Shows the page beside the form, and carries the preview's clicks into it. */
const BRIDGE: Field = { name: "previewBridge", type: "ui", admin: { components: { Field: "/components/admin/site-editor/preview-bridge#PreviewBridge" } } };

/** Every section's first field: off the live page without losing its words. */
const hidden: Field = {
  name: "hidden",
  type: "checkbox",
  label: "Hide on the site",
  defaultValue: false,
  admin: { description: "The section stays here, and greyed out in the preview, until you show it again." },
};

/** A button or link: its words and where it goes. Either one empty removes it. */
export const action = (name: string, label: string, value: Action): Field => ({
  name,
  type: "group",
  label,
  fields: [
    {
      type: "row",
      fields: [
        { name: "label", type: "text", label: "Words on it", defaultValue: value.label ?? undefined },
        { name: "link", type: "text", label: "Goes to", defaultValue: value.link ?? undefined, admin: { description: "A page here, like /pms, or a full web address." } },
      ],
    },
  ],
});

/** One kind of section, by its name and picture in lib/pages/sections.ts. */
export const section = (slug: SectionKind, fields: Field[]): Block => {
  const kind = SECTION_KINDS[slug];
  return {
    slug,
    interfaceName: `Section${slug.charAt(0).toUpperCase()}${slug.slice(1)}`,
    labels: { singular: kind.name, plural: kind.name },
    admin: {
      disableBlockName: true,
      images: { thumbnail: { url: kind.picture, alt: kind.name } },
      components: { Label: "/components/admin/site-editor/section-label#SectionLabel" },
    },
    fields: [hidden, ...fields],
  };
};

/** Sections that open a page, holding its one main heading. */
const TOP: readonly string[] = ["hero", "productHero", "logins", "enquiry", "careersIntro"];

/** The editable pages' records, named "<page>-page" (home-page, pms-page). */
type PageSlug = Extract<GlobalSlug, `${string}-page`>;

/** An editable page: its record in /admin, its address on the site, and the sections it offers. */
export function pageGlobal({ slug, label, path, blocks }: { slug: PageSlug; label: string; path: string; blocks: Block[] }): GlobalConfig {
  /** Rebuilds the page when a version is published; drafts only reach the preview. */
  const revalidate: GlobalAfterChangeHook = ({ doc, context }) => {
    if (doc._status === "published" && !context.skipRevalidate) revalidatePath(path);
    return doc;
  };

  /**
   * Payload 3.89's edit view asks whether a global is published by reading it
   * with `select: { updatedAt: true }`, which leaves out `_status`, so after a
   * reload a live page with unpublished changes reads "Draft" and loses its
   * "Revert to published" link. A read that leaves the status out gets it back.
   */
  const keepStatus: GlobalAfterReadHook = async ({ doc, req }) => {
    if (doc._status !== undefined || !doc.updatedAt) return doc;
    const { _status } = await req.payload.findGlobal({ slug, depth: 0, select: { _status: true }, overrideAccess: true, req });
    return { ...doc, _status };
  };

  return {
    slug,
    label,
    admin: {
      // Listed under Website in the sidebar by components/admin/nav-links.tsx.
      group: false,
      // Staff never need the raw API view.
      hideAPIURL: true,
      livePreview: {
        url: `/live-preview?path=${path}`,
        openByDefault: true,
        breakpoints: [
          { name: "desktop", label: "Desktop", width: 1440, height: 900 },
          { name: "phone", label: "Phone", width: 390, height: 844 },
        ],
      },
    },
    versions: { drafts: { autosave: { interval: 800 } }, max: 50 },
    access: {
      // The public site and API see the published page; staff also see drafts.
      read: ({ req }) => (req.user?.collection === "users" ? true : { _status: { equals: "published" } }),
      update: allow("editor", "compliance"),
      readVersions: allow("editor", "compliance"),
    },
    hooks: { afterChange: [revalidate], afterRead: [keepStatus] },
    fields: [
      BRIDGE,
      {
        name: "sections",
        type: "blocks",
        label: "Sections",
        labels: { singular: "Section", plural: "Sections" },
        blocks,
        // Collapsed rows read as a list of the page; the class drops Payload's Collapse All and Show All (components/admin/admin.css).
        admin: { initCollapsed: true, className: "mb-page-sections" },
        // The top section holds the page's one main heading.
        validate: (value: unknown) =>
          !Array.isArray(value) || value.filter((row: { blockType?: string }) => TOP.includes(row.blockType ?? "")).length <= 1 || "The page can have only one top section.",
      },
    ],
  };
}
