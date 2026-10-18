"use client";

import { type ReactNode, useState } from "react";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/fluid/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/fluid/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { advanceApplication, assignApplication, closeRole, deleteApplication, makeOffer, notTakenForward, stepBack, takeApplication, tellOthers } from "@/lib/hiring/admin-actions";
import type { ApplicantDetail } from "@/lib/hiring/desk";
import { isOpenStage, NEXT, STAGES, stageLabel } from "@/lib/hiring/stages";
import { EmailDraft, useDraft } from "./email-draft";

/*
 * The side column of /admin/hiring/:id. Each panel is one decision: the next
 * stage, the role once someone is hired, who has it, who the person is, and
 * when the application is deleted.
 */

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h2 className="mb-3 text-caption font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

/** The stages a hire passes through, drawn as five segments; Closed is not one of them. */
const TRACK = STAGES.filter(({ value }) => value !== "closed");

const HINTS = {
  new: "Next: shortlist, or tell them it is not going ahead.",
  shortlisted: "Next: add an interview and invite them.",
  interview: "Next: make an offer once the interviews are done.",
  offer: "Next: mark them hired when they accept.",
} as const;

export function StagePanel({ applicant, onInterview }: { applicant: ApplicantDetail; onInterview: () => void }) {
  const { pending, error, run } = useAction();
  const [dialog, setDialog] = useState<"reject" | "offer" | null>(null);
  const { stage } = applicant;
  const reached = TRACK.findIndex(({ value }) => value === stage);
  const open = isOpenStage(stage);

  return (
    <Panel title="Stage">
      <div className="mb-3 flex gap-1" aria-hidden="true">
        {TRACK.map(({ value }, index) => (
          <span key={value} className={`h-[3px] flex-1 rounded-full ${stage === "closed" ? "bg-muted" : index < reached ? "bg-foreground" : index === reached ? "bg-[#F6A11A]" : "bg-muted"}`} />
        ))}
      </div>
      <p className="text-title font-semibold text-foreground">{applicant.closeReason ? `${applicant.stageLabel}: ${applicant.closeReason}` : applicant.stageLabel}</p>
      {open ? <p className="mt-0.5 text-caption text-muted-foreground">{HINTS[stage]}</p> : null}

      <div className="mt-3 grid gap-2">
        {stage === "new" || stage === "offer" ? (
          <Button loading={pending} onClick={() => run(() => advanceApplication(applicant.id, stage === "new" ? "shortlisted" : "hired"))}>
            {NEXT[stage].action}
          </Button>
        ) : null}
        {stage === "shortlisted" ? <Button onClick={onInterview}>{NEXT.shortlisted.action}</Button> : null}
        {stage === "interview" ? (
          <>
            <Button onClick={() => setDialog("offer")}>{NEXT.interview.action}</Button>
            <Button variant="secondary" onClick={onInterview}>
              Add another interview
            </Button>
          </>
        ) : null}
        {open ? (
          <Button variant="tertiary" className="text-destructive" onClick={() => setDialog("reject")}>
            Not taken forward
          </Button>
        ) : null}
        {stage === "closed" ? (
          <Button variant="secondary" loading={pending} onClick={() => run(() => stepBack(applicant.id))}>
            Reopen as New
          </Button>
        ) : stage !== "new" ? (
          <Button variant="ghost" size="compact" loading={pending} onClick={() => run(() => stepBack(applicant.id))}>
            Move back to {stageLabel(TRACK[reached - 1]?.value ?? "new")}
          </Button>
        ) : null}
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
      </div>

      {dialog === "reject" ? <RejectDialog applicant={applicant} onClose={() => setDialog(null)} /> : null}
      {dialog === "offer" ? <OfferDialog applicant={applicant} onClose={() => setDialog(null)} /> : null}
    </Panel>
  );
}

function EmailDialog({ title, description, children, onClose }: { title: string; description: string; children: ReactNode; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent size="lg" className="fluid max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({ applicant, onClose }: { applicant: ApplicantDetail; onClose: () => void }) {
  const draft = useDraft(applicant, "application_reject");
  const { pending, error, run } = useAction();
  return (
    <EmailDialog title={`Tell ${applicant.values.firstName} it is not going ahead?`} description="The application moves to Closed. Edit the email if you want." onClose={onClose}>
      <EmailDraft applicant={applicant} state={draft} />
      {error ? <p className="mt-3 text-caption text-destructive">{error}</p> : null}
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="secondary" loading={pending} onClick={() => run(() => notTakenForward(applicant.id, {}), onClose)}>
          Close without emailing
        </Button>
        <Button loading={pending} onClick={() => run(() => notTakenForward(applicant.id, { email: draft.email }), onClose)}>
          {applicant.emailConnected ? "Send and close" : "Save the email and close"}
        </Button>
      </DialogFooter>
    </EmailDialog>
  );
}

function OfferDialog({ applicant, onClose }: { applicant: ApplicantDetail; onClose: () => void }) {
  const draft = useDraft(applicant, "offer");
  const { pending, error, run } = useAction();
  return (
    <EmailDialog title={`Offer ${applicant.role} to ${applicant.values.firstName}`} description="The application moves to Offer. Write the terms before sending, or move it without an email if the offer went another way." onClose={onClose}>
      <EmailDraft applicant={applicant} state={draft} />
      {error ? <p className="mt-3 text-caption text-destructive">{error}</p> : null}
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="secondary" loading={pending} onClick={() => run(() => makeOffer(applicant.id, {}), onClose)}>
          Move without emailing
        </Button>
        <Button loading={pending} onClick={() => run(() => makeOffer(applicant.id, { email: draft.email }), onClose)}>
          {applicant.emailConnected ? "Send the offer" : "Save the offer"}
        </Button>
      </DialogFooter>
    </EmailDialog>
  );
}

/** Once someone is hired: take the role off the site, and tell the others still open on it. */
export function RolePanel({ applicant }: { applicant: ApplicantDetail }) {
  const { pending, error, run } = useAction();
  const [telling, setTelling] = useState(false);
  const { opening, others } = applicant;
  if (applicant.stage !== "hired" || !opening) return null;
  return (
    <Panel title="The role">
      {opening.status === "live" ? (
        <>
          <p className="text-body text-foreground">{opening.title} is still open on the website.</p>
          <Button className="mt-3 w-full" loading={pending} onClick={() => run(() => closeRole(opening.id))}>
            Close the role
          </Button>
        </>
      ) : (
        <p className="text-body text-muted-foreground">{opening.title} is off the website.</p>
      )}
      {others.length ? (
        <>
          <p className="mt-4 text-body text-foreground">
            {others.length} other {others.length === 1 ? "person is" : "people are"} still being considered for it.
          </p>
          <Button variant="secondary" className="mt-3 w-full" onClick={() => setTelling(true)}>
            Tell them it is filled
          </Button>
        </>
      ) : null}
      {error ? <p className="mt-2 text-caption text-destructive">{error}</p> : null}
      {telling ? <TellDialog applicant={applicant} onClose={() => setTelling(false)} /> : null}
    </Panel>
  );
}

function TellDialog({ applicant, onClose }: { applicant: ApplicantDetail; onClose: () => void }) {
  const [chosen, setChosen] = useState(() => new Set(applicant.others.map(({ id }) => id)));
  const draft = useDraft(applicant, "application_reject", false);
  const { pending, error, run } = useAction();
  const toggle = (id: number) => setChosen((current) => (current.has(id) ? new Set([...current].filter((value) => value !== id)) : new Set([...current, id])));
  return (
    <EmailDialog title="Tell the others the role is filled" description="Each gets this email with their own name filled in, and moves to Closed." onClose={onClose}>
      <ul className="m-0 mb-4 grid list-none gap-1 p-0">
        {applicant.others.map((other) => (
          <li key={other.id}>
            <label className="flex items-center gap-2 py-1 text-body text-foreground">
              <input type="checkbox" checked={chosen.has(other.id)} onChange={() => toggle(other.id)} className="h-4 w-4" />
              {other.name} <span className="text-muted-foreground">· {other.stage}</span>
            </label>
          </li>
        ))}
      </ul>
      <EmailDraft applicant={applicant} state={draft} note="Merge fields in braces are filled in for each person." />
      {error ? <p className="mt-3 text-caption text-destructive">{error}</p> : null}
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button loading={pending} disabled={chosen.size === 0} onClick={() => run(() => tellOthers(applicant.opening?.id ?? 0, { ids: [...chosen], email: draft.email }), onClose)}>
          {applicant.emailConnected ? `Send ${chosen.size} ${chosen.size === 1 ? "email" : "emails"}` : `Save ${chosen.size} ${chosen.size === 1 ? "email" : "emails"} and close them`}
        </Button>
      </DialogFooter>
    </EmailDialog>
  );
}

export function OwnerPanel({ applicant }: { applicant: ApplicantDetail }) {
  const { pending, error, run } = useAction();
  return (
    <Panel title="With">
      <p className="text-body text-foreground">{applicant.owner?.name ?? "Nobody yet"}</p>
      <div className="mt-3 grid gap-2">
        {!applicant.owner ? (
          <Button onClick={() => run(() => takeApplication(applicant.id))} loading={pending}>
            Take it
          </Button>
        ) : null}
        <Select value={applicant.owner ? String(applicant.owner.id) : ""} onValueChange={(value) => run(() => assignApplication(applicant.id, Number(value)))} size="compact">
          <SelectTrigger placeholder="Give it to someone" aria-label="Give it to someone" />
          <SelectContent>
            {applicant.staff.map((member, index) => (
              <SelectItem key={member.id} index={index} value={String(member.id)}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
      </div>
    </Panel>
  );
}

export function PersonPanel({ applicant }: { applicant: ApplicantDetail }) {
  const rows = [
    ["Email", <a key="email" href={`mailto:${applicant.email}`} className="text-foreground">{applicant.email}</a>],
    ["Phone", applicant.phone ? <a key="phone" href={`tel:${applicant.phone}`} className="text-foreground tabular-nums">{applicant.phone}</a> : null],
    ["City", applicant.city],
    ["LinkedIn", applicant.linkedin ? <a key="linkedin" href={applicant.linkedin} target="_blank" rel="noreferrer" className="text-foreground">Profile</a> : null],
    ["Notice", applicant.notice],
    ["Applied before", applicant.appliedBefore ? `${applicant.appliedBefore} ${applicant.appliedBefore === 1 ? "time" : "times"}` : "No"],
  ] as const;
  return (
    <Panel title="Applicant">
      <dl className="m-0 grid gap-1.5">
        {rows.map(([label, value]) =>
          value ? (
            <div key={label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-2 text-body">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="m-0 break-words">{value}</dd>
            </div>
          ) : null,
        )}
      </dl>
    </Panel>
  );
}

export function KeepPanel({ applicant }: { applicant: ApplicantDetail }) {
  const [confirming, setConfirming] = useState(false);
  const { pending, error, run } = useAction();
  return (
    <Panel title="Kept until">
      <p className="text-body text-foreground tabular-nums">{new Date(applicant.deleteAfter).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}</p>
      <p className="mt-0.5 text-caption text-muted-foreground">Deleted automatically on that day, resume included.</p>
      <Button variant="secondary" size="compact" className="mt-3 w-full" onClick={() => setConfirming(true)}>
        Delete now
      </Button>
      {error ? <p className="mt-2 text-caption text-destructive">{error}</p> : null}
      {confirming ? (
        <Dialog open onOpenChange={(next) => (next ? null : setConfirming(false))}>
          <DialogContent className="fluid">
            <DialogHeader>
              <DialogTitle>Delete {applicant.name}&apos;s application?</DialogTitle>
              <DialogDescription>The application, its resume and its timeline are deleted for good. Use this when they ask to be removed.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="bg-destructive" loading={pending} onClick={() => run(() => deleteApplication(applicant.id), () => window.location.assign("/admin/hiring"))}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </Panel>
  );
}
