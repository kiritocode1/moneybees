"use client";

import { useState, useTransition } from "react";
import { TextArea, TextInput } from "@/components/admin/fields";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/fluid/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { previewReply, replyToEnquiry } from "@/lib/crm/admin-actions";
import type { EnquiryDetail } from "@/lib/crm/enquiry-detail";
import type { ReplyDraft } from "@/lib/crm/reply";
import { fillTemplate } from "@/lib/crm/template";

/**
 * The reply, written here and sent from the signed-in person through Resend.
 * Picking a template fills the subject and the words, and its purpose decides
 * the email they go into (lib/crm/reply.ts): a letter, the PMS or Flyingbee
 * introduction with its facts and disclosures, a meeting confirmation or
 * follow-up, or an account checklist. Preview draws exactly what will go.
 * Sending moves the enquiry to "waiting on them" and stops its reply clock.
 */
export function ReplyComposer({ enquiry }: { enquiry: EnquiryDetail }) {
  const [subject, setSubject] = useState(`Re: your ${enquiry.kindLabel} enquiry (${enquiry.reference})`);
  const [body, setBody] = useState("");
  const [template, setTemplate] = useState("");
  const [purpose, setPurpose] = useState("enquiry_reply");
  const [meeting, setMeeting] = useState({ when: "", where: enquiry.office, link: "", with: enquiry.sender });
  const [followUp, setFollowUp] = useState({ meetingOn: "", steps: "" });
  const [preview, setPreview] = useState<{ html?: string; error?: string } | null>(null);
  const [drawing, startDrawing] = useTransition();
  const { pending, error, run } = useAction();
  const values = { firstName: enquiry.contact?.firstName, name: enquiry.contact?.name, reference: enquiry.reference, senderName: enquiry.sender };

  const applyTemplate = (id: string) => {
    const chosen = enquiry.templates.find((option) => String(option.id) === id);
    setTemplate(id);
    setPreview(null);
    if (!chosen) return;
    setPurpose(chosen.purpose);
    setSubject(fillTemplate(chosen.subject, values));
    setBody(fillTemplate(chosen.body ?? "", values));
  };

  const draft = (): ReplyDraft => ({
    subject,
    body,
    purpose,
    ...(purpose === "meeting_confirmation" ? { meeting: { when: meeting.when, where: meeting.where, with: meeting.with, ...(meeting.link ? { link: meeting.link } : {}) } } : {}),
    ...(purpose === "follow_up" ? { followUp } : {}),
  });

  const ready = Boolean(body.trim() && subject.trim()) && (purpose !== "meeting_confirmation" || Boolean(meeting.when.trim() && meeting.where.trim() && meeting.with.trim())) && (purpose !== "follow_up" || Boolean(followUp.meetingOn.trim()));

  const showPreview = () =>
    startDrawing(async () => {
      const result = await previewReply(enquiry.id, draft());
      setPreview(result.ok ? { html: result.html } : { error: result.error });
    });

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b pb-2">
        <h2 className="text-title font-semibold text-foreground">Reply</h2>
        {enquiry.templates.length ? (
          <div className="w-60">
            <Select value={template} onValueChange={applyTemplate} size="compact">
              <SelectTrigger placeholder="Start from a template" aria-label="Start from a template" />
              <SelectContent>
                {enquiry.templates.map((option, index) => (
                  <SelectItem key={option.id} index={index} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          run(() => replyToEnquiry(enquiry.id, draft()), () => {
            setBody("");
            setTemplate("");
            setPurpose("enquiry_reply");
            setPreview(null);
          });
        }}
      >
        <TextInput label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
        <TextArea label="Message" value={body} onChange={(event) => setBody(event.target.value)} className="min-h-48" placeholder={`Your words. "Dear ${enquiry.contact?.name ?? ""}," and your signature are added for you.`} />

        {purpose === "meeting_confirmation" ? (
          <div className="grid gap-3 rounded-xl border p-3 sm:grid-cols-2">
            <TextInput label="When" value={meeting.when} onChange={(event) => setMeeting({ ...meeting, when: event.target.value })} placeholder="Tuesday 21 October, 4:00 pm" />
            <TextInput label="With" value={meeting.with} onChange={(event) => setMeeting({ ...meeting, with: event.target.value })} />
            <TextInput label="Where" value={meeting.where} onChange={(event) => setMeeting({ ...meeting, where: event.target.value })} />
            <TextInput label="Video call link, if not in person" value={meeting.link} onChange={(event) => setMeeting({ ...meeting, link: event.target.value })} placeholder="https://" />
          </div>
        ) : null}

        {purpose === "follow_up" ? (
          <div className="grid gap-3 rounded-xl border p-3">
            <TextInput label="Date of the meeting" value={followUp.meetingOn} onChange={(event) => setFollowUp({ ...followUp, meetingOn: event.target.value })} placeholder="21 October 2026" />
            <TextArea label="Agreed next steps, one per line, each saying who and by when" value={followUp.steps} onChange={(event) => setFollowUp({ ...followUp, steps: event.target.value })} className="min-h-24" />
          </div>
        ) : null}

        {error ? <p className="text-caption text-destructive">{error}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-caption text-muted-foreground">
            {enquiry.emailConnected
              ? `From ${enquiry.sender} at Moneybee to ${enquiry.contact?.email}. Their reply comes to your inbox.`
              : "Email is not connected, so this reply will be saved on the timeline but not sent."}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" loading={drawing} disabled={!ready} onClick={showPreview}>
              Preview
            </Button>
            <Button type="submit" loading={pending} disabled={!ready}>
              {enquiry.emailConnected ? "Send reply" : "Save reply without sending"}
            </Button>
          </div>
        </div>

        {preview ? (
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-caption text-muted-foreground">Exactly what {enquiry.contact?.name ?? "they"} will receive</span>
              <Button type="button" size="compact" variant="ghost" onClick={() => setPreview(null)}>
                Close preview
              </Button>
            </div>
            {preview.error ? (
              <p className="text-caption text-destructive">{preview.error}</p>
            ) : (
              <iframe title="Reply preview" srcDoc={preview.html} className="h-[720px] w-full rounded-xl border bg-muted" />
            )}
          </div>
        ) : null}
      </form>
    </section>
  );
}
