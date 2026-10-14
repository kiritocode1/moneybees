import { experimental_decide as decide, generateText, jsonSchema, Output } from "ai";
import { gatewayOptions, MODELS } from "@/lib/ai/gateway";
import type { Application } from "@/payload-types";

/*
 * The two AI steps in hiring, each behind its switch in /admin › Desk
 * settings (lib/flags.ts). Both are suggestions a person reads: neither moves
 * an application or sends anything.
 */

export type ApplicantScreen = {
  model: string;
  at: string;
  /** Jev's probability that the applicant meets each must-have, in the opening's order. */
  mustHaves: { question: string; probability: number }[];
  fit: { choice: "strong" | "possible" | "weak"; probability: number };
};

/**
 * Jev reads what the applicant wrote and answered, without their name, email
 * or phone, and says how likely each must-have is met and how well they fit.
 */
export async function screenApplicant(application: Application): Promise<ApplicantScreen> {
  const questions = Object.fromEntries([
    ...(application.mustHaves ?? []).map(({ question }, index) => [
      `must${index}`,
      { type: "boolean", instructions: `Does the applicant meet this requirement: "${question}"?`, criteria: { true: "What they wrote supports it.", false: "It is missing or contradicted." } },
    ]),
    [
      "fit",
      {
        type: "choice",
        instructions: `How well does this applicant fit the ${application.roleTitle} role at an equity portfolio manager?`,
        criteria: { strong: "Relevant experience and a clear reason for the role.", possible: "Some relevant experience, or a reason that needs a conversation.", weak: "Little that relates to the role." },
      },
    ],
  ]);
  const { answers } = await decide({
    model: MODELS.decide,
    state: {
      role: application.roleTitle,
      noticePeriod: application.notice,
      answers: (application.mustHaves ?? []).map(({ question, answer }) => ({ question, answer })),
      whyThisRole: application.why,
      experience: application.experience,
    },
    questions: questions as never,
    providerOptions: gatewayOptions("applicant-screen"),
  });
  const read = answers as Record<string, { probability?: number; choice?: string; probabilities?: Record<string, number> }>;
  const choice = (read.fit?.choice ?? "possible") as ApplicantScreen["fit"]["choice"];
  return {
    model: MODELS.decide,
    at: new Date().toISOString(),
    mustHaves: (application.mustHaves ?? []).map(({ question }, index) => ({ question, probability: read[`must${index}`]?.probability ?? 0 })),
    fit: { choice, probability: read.fit?.probabilities?.[choice] ?? 0 },
  };
}

export type ResumeFields = { name?: string; email?: string; phone?: string; city?: string; linkedin?: string };

const RESUME_FIELDS = jsonSchema<ResumeFields>({
  type: "object",
  properties: {
    name: { type: "string", description: "The person's full name" },
    email: { type: "string" },
    phone: { type: "string" },
    city: { type: "string", description: "The city they live in now" },
    linkedin: { type: "string", description: "Their LinkedIn profile address, if the resume has one" },
  },
  additionalProperties: false,
});

/** Haiku reads a PDF resume into the apply form's details step. Fields it cannot find are left out. */
export async function readResumeFields(pdf: Uint8Array): Promise<ResumeFields> {
  const { output } = await generateText({
    model: MODELS.extract,
    output: Output.object({ schema: RESUME_FIELDS }),
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: pdf, mediaType: "application/pdf" },
          { type: "text", text: "Copy the applicant's contact details from this resume. Leave out any you cannot find; do not guess." },
        ],
      },
    ],
    providerOptions: gatewayOptions("resume-parse"),
  });
  return output;
}
