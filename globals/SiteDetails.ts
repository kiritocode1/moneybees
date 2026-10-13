import { revalidatePath } from "next/cache";
import type { GlobalAfterChangeHook, GlobalConfig } from "payload";
import { allow, allowField, everyone } from "@/lib/backend/roles";
import { DEFAULT_DETAILS } from "@/lib/site/details";

/** Every page prints these, so a save rebuilds the whole site. */
const revalidateSite: GlobalAfterChangeHook = ({ doc, context }) => {
  if (!context.skipRevalidate) revalidatePath("/", "layout");
  return doc;
};

/** Registrations and the disclaimer are regulatory text. */
const complianceOnly = { update: allowField("compliance") };

/**
 * The office and contact details every page shows, edited once: the footer,
 * /contact, the homepage's Get started and the search data read them
 * (lib/site/load-details.ts). Saving puts them live; there is no draft.
 */
export const SiteDetails: GlobalConfig = {
  slug: "site-details",
  label: "Office details",
  // Listed under Website in the sidebar by components/admin/nav-links.tsx.
  admin: { group: false, hideAPIURL: true, description: "Shown in the footer of every page, on the Contact page and on the Home page. Saving puts changes live." },
  access: { read: everyone, update: allow("editor", "compliance") },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Office",
          fields: [
            { type: "row", fields: [
              { name: "company", type: "text", required: true, label: "Company name", defaultValue: DEFAULT_DETAILS.company, admin: { description: "The legal name, in the footer." } },
              { name: "officeName", type: "text", required: true, label: "Name on the office card", defaultValue: DEFAULT_DETAILS.officeName, admin: { description: "On the Contact page." } },
            ] },
            {
              name: "address",
              type: "group",
              label: "Address",
              fields: [
                { name: "line1", type: "text", required: true, label: "First line", defaultValue: DEFAULT_DETAILS.address.line1 },
                { name: "line2", type: "text", required: true, label: "Second line", defaultValue: DEFAULT_DETAILS.address.line2 },
              ],
            },
            {
              name: "pin",
              type: "group",
              label: "Map pin",
              fields: [
                { name: "fromLink", type: "ui", admin: { components: { Field: "/components/admin/site-details/map-pin#MapPin" } } },
                { type: "row", fields: [
                  { name: "lat", type: "number", required: true, label: "Latitude", min: -90, max: 90, defaultValue: DEFAULT_DETAILS.pin.lat },
                  { name: "lon", type: "number", required: true, label: "Longitude", min: -180, max: 180, defaultValue: DEFAULT_DETAILS.pin.lon },
                ] },
              ],
            },
          ],
        },
        {
          label: "Phone and email",
          fields: [
            {
              name: "phones",
              type: "array",
              label: "Phone numbers",
              labels: { singular: "Number", plural: "Numbers" },
              minRows: 1,
              defaultValue: DEFAULT_DETAILS.phones,
              admin: { description: "The first is the main line, shown wherever there is room for one number." },
              fields: [
                { type: "row", fields: [
                  { name: "label", type: "text", required: true, label: "What it is for" },
                  { name: "number", type: "text", required: true, label: "Number", admin: { description: "As people should see it, e.g. 022-4030 2080." } },
                ] },
              ],
            },
            { name: "email", type: "email", required: true, label: "Main email", defaultValue: DEFAULT_DETAILS.email },
            {
              name: "desks",
              type: "array",
              label: "Flyingbee AIF desks",
              labels: { singular: "Desk", plural: "Desks" },
              defaultValue: DEFAULT_DETAILS.desks,
              admin: { description: "In the footer and on the Contact page." },
              fields: [
                { type: "row", fields: [
                  { name: "label", type: "text", required: true, label: "What it is for" },
                  { name: "email", type: "email", required: true },
                ] },
              ],
            },
          ],
        },
        {
          label: "Registrations and disclaimer",
          description: "Regulatory text: only compliance can change it.",
          fields: [
            {
              name: "registrations",
              type: "array",
              label: "SEBI registrations",
              labels: { singular: "Registration", plural: "Registrations" },
              defaultValue: DEFAULT_DETAILS.registrations,
              access: complianceOnly,
              fields: [
                { type: "row", fields: [
                  { name: "business", type: "text", required: true },
                  { name: "number", type: "text", required: true },
                ] },
              ],
            },
            { name: "disclaimer", type: "textarea", required: true, label: "Disclaimer in the footer", defaultValue: DEFAULT_DETAILS.disclaimer, access: complianceOnly },
          ],
        },
      ],
    },
  ],
};
