// Run with: node --test lib/crm/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { fillTemplate, fillTemplateHtml } from "./template.ts";

test("merge fields fill in, unknown ones stay visible", () => {
  assert.equal(fillTemplate("Hello {{firstName}}, ref {{ reference }} {{missing}}", { firstName: "Asha", reference: "ENQ-00001" }), "Hello Asha, ref ENQ-00001 {{missing}}");
});

test("a value cannot inject markup into a designed email", () => {
  const html = fillTemplateHtml("<p>Hello {{name}}</p>", { name: '<img src=x onerror="alert(1)">' });
  assert.equal(html, "<p>Hello &lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>");
});
