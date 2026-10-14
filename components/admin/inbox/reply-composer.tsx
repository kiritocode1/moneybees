"use client";

import { useState } from "react";
import { TextArea, TextInput } from "@/components/admin/fields";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/fluid/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { replyToEnquiry } from "@/lib/crm/admin-actions";
import type { EnquiryDetail } from "@/lib/crm/enquiry-detail";
import { fillTemplate } from "@/lib/crm/template";

/**
 * The reply, written here and sent from the signed-in person through Resend.
 * Picking a template fills the subject and body with the person's name and
 * the reference; the playbook's template is listed first. Sending moves the
 * enquiry to "waiting on them" and stops its reply clock.
 */
export function ReplyComposer({ enquiry }: { enquiry: EnquiryDetail }) {
  const [subject, setSubject] = useState(`Re: your ${enquiry.kindLabel} enquiry (${enquiry.reference})`);
  const [body, setBody] = useState("");
  const [template, setTemplate] = useState("");
  const { pending, error, run } = useAction();
  const values = { firstName: enquiry.contact?.firstName, name: enquiry.contact?.name, reference: enquiry.reference, senderName: enquiry.sender };

  const applyTemplate = (id: string) => {
    const chosen = enquiry.templates.find((option) => String(option.id) === id);
    setTemplate(id);
    if (!chosen) return;
    setSubject(fillTemplate(chosen.subject, values));
    setBody(fillTemplate(chosen.body ?? "", values));
  };

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
          run(() => replyToEnquiry(enquiry.id, { subject, body }), () => {
            setBody("");
            setTemplate("");
          });
        }}
      >
        <TextInput label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
        <TextArea label="Message" value={body} onChange={(event) => setBody(event.target.value)} className="min-h-48" placeholder={`Hello ${enquiry.contact?.firstName ?? ""},`} />
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-caption text-muted-foreground">
            {enquiry.emailConnected
              ? `From ${enquiry.sender} at Moneybee to ${enquiry.contact?.email}. Their reply comes to your inbox.`
              : "Email is not connected, so this reply will be saved on the timeline but not sent."}
          </p>
          <Button type="submit" loading={pending} disabled={!body.trim() || !subject.trim()}>
            {enquiry.emailConnected ? "Send reply" : "Save reply without sending"}
          </Button>
        </div>
      </form>
    </section>
  );
}
