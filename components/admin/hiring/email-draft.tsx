"use client";

import { useState } from "react";
import { TextArea, TextInput } from "@/components/admin/fields";
import { FileDrop, FileRow, useAttachments } from "@/components/admin/files/file-row";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import type { ApplicantDetail } from "@/lib/hiring/desk";
import { fillTemplate } from "@/lib/crm/template";

export type Draft = { subject: string; body: string };

/**
 * An email to an applicant, started from a template and edited before it
 * goes. With `fill`, merge fields are filled for this applicant as they type;
 * without it (one email to several people) they stay in braces and the server
 * fills them per person. Fields only the server knows, such as the interview
 * time, always stay in braces until sending. `email` is what the actions
 * take: the words and the files attached.
 */
export function useDraft(applicant: ApplicantDetail, purpose: string | null, fill = true) {
  const start = applicant.templates.find((template) => template.purpose === purpose);
  const apply = (text: string) => (fill ? fillTemplate(text, applicant.values) : text);
  const [draft, setDraft] = useState<Draft>({ subject: start ? apply(start.subject) : "", body: start ? apply(start.body) : "" });
  const [template, setTemplate] = useState(start ? String(start.id) : "");
  const attach = useAttachments();
  const choose = (id: string) => {
    const chosen = applicant.templates.find((option) => String(option.id) === id);
    setTemplate(id);
    if (chosen) {
      setDraft({ subject: apply(chosen.subject), body: apply(chosen.body) });
      void attach.preset({ templateId: chosen.id });
    }
  };
  return { draft, setDraft, template, choose, attach, email: { ...draft, attachments: attach.refs } };
}

export function EmailDraft({ applicant, state, note }: { applicant: ApplicantDetail; state: ReturnType<typeof useDraft>; note?: string }) {
  const { draft, setDraft, template, choose, attach } = state;
  return (
    <FileDrop attach={attach} className="grid gap-3">
      {applicant.templates.length ? (
        <Select value={template} onValueChange={choose} size="compact">
          <SelectTrigger placeholder="Start from a template" aria-label="Start from a template" />
          <SelectContent>
            {applicant.templates.map((option, index) => (
              <SelectItem key={option.id} index={index} value={String(option.id)}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
      <TextInput label="Subject" value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} />
      <TextArea label="Message" value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} className="min-h-40" />
      <FileRow attach={attach} letter={template ? { templateId: Number(template) } : null} />
      <p className="text-caption text-muted-foreground">
        {note ?? `From ${applicant.sender} at Moneybee to ${applicant.email}.`}
        {applicant.emailConnected ? "" : " Email is not connected, so it will be saved here but not sent."}
      </p>
    </FileDrop>
  );
}
