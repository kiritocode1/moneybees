import assert from "node:assert/strict";
import { test } from "node:test";
import { describeDeleteBlockers, readTitle, requiredDependents } from "./delete-dependencies.ts";

const collections = [
  {
    slug: "contacts",
    labels: { singular: "Person", plural: "People" },
    admin: { useAsTitle: "name" },
    fields: [],
  },
  {
    slug: "enquiries",
    labels: { singular: "Enquiry", plural: "Enquiries" },
    admin: { useAsTitle: "title" },
    fields: [
      { name: "contact", type: "relationship", relationTo: "contacts", required: true },
      { name: "cc", type: "relationship", relationTo: "contacts" },
      { name: "watchers", type: "relationship", relationTo: "contacts", required: true, hasMany: true },
      {
        name: "origin",
        type: "group",
        fields: [{ name: "contact", type: "relationship", relationTo: "contacts", required: true }],
      },
      {
        name: "answers",
        type: "array",
        fields: [{ name: "contact", type: "relationship", relationTo: "contacts", required: true }],
      },
      { name: "people", type: "join", collection: "contacts", on: "contact" },
    ],
  },
  {
    slug: "deals",
    fields: [{ name: "contact", type: "relationship", relationTo: "contacts", required: true }],
  },
  {
    slug: "payload-preferences",
    fields: [{ name: "user", type: "relationship", relationTo: "contacts", required: true }],
  },
];

test("the walk keeps required single relations and drops the rest", () => {
  const found = requiredDependents(collections, "contacts");
  assert.deepEqual(
    found.map((dependency) => `${dependency.slug}.${dependency.path}`),
    ["enquiries.contact", "enquiries.origin.contact", "deals.contact"],
  );
  assert.deepEqual(found[0], {
    slug: "enquiries",
    path: "contact",
    singular: "Enquiry",
    plural: "Enquiries",
    titleField: "title",
  });
  assert.equal(found[2].singular, "Deal");
  assert.equal(found[2].plural, "Deals");
});

test("a title can sit behind a group", () => {
  assert.equal(readTitle({ profile: { name: "Rohan Mehta" } }, "profile.name"), "Rohan Mehta");
  assert.equal(readTitle({ profile: null }, "profile.name"), undefined);
});

test("the message names the row and the blockers", () => {
  assert.equal(
    describeDeleteBlockers(
      { label: "Person", title: "Rohan Mehta" },
      [
        { singular: "Enquiry", plural: "Enquiries", count: 1, title: "PMS enquiry from Rohan Mehta" },
        { singular: "Deal", plural: "Deals", count: 1, title: "Rohan Mehta, Moneybee PMS" },
        { singular: "Activity", plural: "Activities", count: 18, title: "A long activity title" },
      ],
    ),
    'Deleting Rohan Mehta is not possible without deleting 1 enquiry ("PMS enquiry from Rohan Mehta"), 1 deal ("Rohan Mehta, Moneybee PMS") and 18 activities first.',
  );
});

test("one blocker stays singular and a missing title falls back to the collection label", () => {
  assert.equal(
    describeDeleteBlockers(
      { label: "Staff member" },
      [{ singular: "Task", plural: "Tasks", count: 1, title: "Call Rohan" }],
    ),
    'Deleting this staff member is not possible without deleting 1 task ("Call Rohan") first.',
  );
});
