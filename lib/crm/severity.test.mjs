// Run with: node --test lib/crm/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { ENQUIRIES } from "../contact-v2.ts";
import { effectiveSeverity, RULE_ANSWERS, rulesSeverity } from "./severity.ts";

const options = (field) => ENQUIRIES.flatMap((enquiry) => enquiry.fields).find((f) => f.name === field)?.options ?? [];

test("the rules read option strings the form really offers", () => {
  assert.ok(options("amount").includes(RULE_ANSWERS.topBand));
  assert.ok(options("commitment").includes(RULE_ANSWERS.topBand));
  assert.ok(options("topic").includes(RULE_ANSWERS.withdrawal));
  for (const type of RULE_ANSWERS.largeInvestorTypes) assert.ok(options("investor").includes(type));
});

test("each tab starts at its default", () => {
  assert.equal(rulesSeverity({ kind: "general", answers: { message: "Where is your office?" }, existingInvestor: false }).severity, "low");
  assert.equal(rulesSeverity({ kind: "pms", answers: { amount: "50 lakh to 1 crore" }, existingInvestor: false }).severity, "normal");
});

test("a withdrawal or an investor's complaint is critical", () => {
  assert.equal(rulesSeverity({ kind: "support", answers: { topic: "Withdrawal" }, existingInvestor: true }).severity, "critical");
  const complaint = rulesSeverity({ kind: "general", answers: { message: "My redemption has not been credited, I want to raise a grievance" }, existingInvestor: true });
  assert.equal(complaint.severity, "critical");
  assert.equal(complaint.reasons[0].severity, "critical");
});

test("a complaint from someone who is not an investor is high", () => {
  assert.equal(rulesSeverity({ kind: "general", answers: { message: "I want to complain about a call I got" }, existingInvestor: false }).severity, "high");
});

test("large tickets and institutional investors are high", () => {
  assert.equal(rulesSeverity({ kind: "pms", answers: { amount: "Above 5 crore" }, existingInvestor: false }).severity, "high");
  assert.equal(rulesSeverity({ kind: "aif", answers: { commitment: "1 crore to 5 crore", investor: "Family office" }, existingInvestor: false }).severity, "high");
});

test("an overdue enquiry shows one level up, only while it waits on us", () => {
  const past = new Date(Date.now() - 60_000);
  assert.deepEqual(effectiveSeverity("normal", past, "new"), { severity: "high", overdue: true });
  assert.deepEqual(effectiveSeverity("critical", past, "open"), { severity: "critical", overdue: true });
  assert.deepEqual(effectiveSeverity("normal", past, "waiting"), { severity: "normal", overdue: false });
  assert.deepEqual(effectiveSeverity("normal", new Date(Date.now() + 60_000), "new"), { severity: "normal", overdue: false });
});
