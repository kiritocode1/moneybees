import { experimental_decide as decide } from "ai";
import { gatewayOptions, MODELS } from "@/lib/ai/gateway";
import { type EnquiryKind, highest, rank, type Reason, type Severity } from "@/lib/crm/severity";

/*
 * AI triage of a new enquiry, behind the ai-enquiry-triage flag. Jev answers
 * typed questions with probabilities; it writes nothing. Its answer can only
 * raise the severity the rules gave, and only when it is at least as sure as
 * the confidence set in /admin (Desk settings). Every answer is kept on the
 * enquiry so staff see what the AI thought and how sure it was.
 */

const QUESTIONS = {
  severity: {
    type: "choice",
    instructions: "How urgently should a portfolio management firm answer this enquiry?",
    criteria: {
      critical: "An existing investor reports a problem with their money: a withdrawal, redemption or credit not received, a complaint, a grievance, a regulator or legal threat.",
      high: "A large investor, a family office or company, a time-sensitive request, or a complaint from someone who is not yet an investor.",
      normal: "An ordinary question about investing in the PMS or the AIF, or routine investor service.",
      low: "General questions, partnership or vendor pitches, job seekers, anything not about investing or an existing account.",
    },
  },
  complaint: {
    type: "boolean",
    instructions: "Is the writer complaining about Moneybee or about something that happened to their account?",
    criteria: { true: "They are unhappy and want something fixed.", false: "They are asking for information or want to invest." },
  },
  spam: {
    type: "boolean",
    instructions: "Is this spam, a sales pitch to the firm, or an automated message?",
  },
  compliance: {
    type: "boolean",
    instructions: "Should the compliance officer see this before anyone replies?",
    criteria: {
      true: "It mentions SEBI, SCORES, a legal notice, fraud, unauthorised transactions, or asks for guaranteed returns.",
      false: "Nothing regulatory or legal.",
    },
  },
} as const;

/** Form fields that identify the person; Jev decides without them. */
const PERSONAL = new Set(["name", "email", "phone"]);

export type TriageAnswers = {
  model: string;
  at: string;
  severity: { choice: Severity; probability: number };
  complaint: number;
  spam: number;
  compliance: number;
};

/** Asks Jev about one enquiry. The state is the form as the visitor filled it, without their name, email or phone. */
export async function askJev(input: { kind: EnquiryKind; answers: Readonly<Record<string, string>>; existingInvestor: boolean }): Promise<TriageAnswers> {
  const rest = Object.fromEntries(Object.entries(input.answers).filter(([key]) => !PERSONAL.has(key)));
  const { answers } = await decide({
    model: MODELS.decide,
    state: { form: input.kind, existingInvestor: input.existingInvestor, answers: rest },
    questions: QUESTIONS,
    providerOptions: gatewayOptions("enquiry-triage"),
  });
  const choice = answers.severity.choice as Severity;
  return {
    model: MODELS.decide,
    at: new Date().toISOString(),
    severity: { choice, probability: answers.severity.probabilities?.[choice] ?? 0 },
    complaint: answers.complaint.probability,
    spam: answers.spam.probability,
    compliance: answers.compliance.probability,
  };
}

/** The severity after the AI's answer, and the reason it rose, if it did. Never lower than the rules. */
export function raiseWithAi(rules: Severity, ai: TriageAnswers, confidence: number, existingInvestor: boolean): { severity: Severity; reasons: Reason[] } {
  const reasons: Reason[] = [];
  if (ai.severity.probability >= confidence && rank(ai.severity.choice) > rank(rules)) {
    reasons.push({ severity: ai.severity.choice, why: `AI rates it ${ai.severity.choice} (${Math.round(ai.severity.probability * 100)}% sure).`, source: "ai" });
  }
  if (ai.complaint >= confidence) {
    const severity: Severity = existingInvestor ? "critical" : "high";
    if (rank(severity) > rank(rules)) reasons.push({ severity, why: `AI reads it as a complaint (${Math.round(ai.complaint * 100)}% sure).`, source: "ai" });
  }
  return { severity: highest(rules, ...reasons.map((reason) => reason.severity)), reasons };
}

