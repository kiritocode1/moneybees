import type { TaskKind } from "@/lib/crm/vocabulary";

/** A task's kind from its first words: "Call Rohan…" is a call, "Send the checklist…" an email. Shared by playbook steps and quick add. */
export function kindFromTitle(text: string): TaskKind {
  if (/^\s*call\b/i.test(text)) return "call";
  if (/^\s*(reply|send|email|write)\b/i.test(text)) return "email";
  if (/\bmeeting\b/i.test(text)) return "meeting";
  return "todo";
}
