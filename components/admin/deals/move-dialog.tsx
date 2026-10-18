"use client";

import { useEffect, useState } from "react";
import { TextInput } from "@/components/admin/fields";
import { Button } from "@/components/fluid/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/fluid/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { filesSentTo, type MoveInputs, moveDealTo } from "@/lib/crm/deal-actions";
import type { DealKind } from "@/lib/crm/deal-board";
import { fromLocalInput, toLocalInput, workingDaysAfter } from "@/lib/crm/due";
import { DEAL_STAGES, type DealStage, labelOf, LOST_REASONS } from "@/lib/crm/vocabulary";

/*
 * Moving a deal to a stage that needs one thing first: Meeting asks when and
 * where, Documents sent what went, Invested how much and when, Lost why.
 * Other stages move at once (see needsAsking). After the move, the next
 * letter can open on the person's page, filled from what was asked: the
 * Meeting confirmation, or on Invested the Welcome letter (PMS) or Funds
 * received (Flyingbee).
 */

export const needsAsking = (stage: DealStage) => ["meeting", "documents", "invested", "lost"].includes(stage);

export type MovingDeal = { id: number; kind: DealKind; personId: number; personName: string; hasEmail: boolean; hasEnquiry: boolean; amount: number | null; hasPortal: boolean };

const IST = { timeZone: "Asia/Kolkata" } as const;
const meetingWords = (at: Date) => `${at.toLocaleDateString("en-GB", { ...IST, weekday: "long", day: "numeric", month: "long" })}, ${at.toLocaleTimeString("en-GB", { ...IST, hour: "numeric", minute: "2-digit", hour12: true })}`;
const dayWords = (at: Date) => at.toLocaleDateString("en-GB", { ...IST, day: "numeric", month: "long", year: "numeric" });

/** The person's page with a letter open and filled in (person-view.tsx reads ?letter= and the f. fields). */
function letterHref(personId: number, letter: string, fill: Record<string, string>) {
  const query = new URLSearchParams({ letter });
  for (const [key, value] of Object.entries(fill)) if (value) query.set(`f.${key}`, value);
  return `/admin/people/${personId}?${query}`;
}

const check = "h-4 w-4 accent-[var(--foreground)]";

export function MoveDialog({ deal, to, canInvite, onClose, onDone }: { deal: MovingDeal; to: DealStage; canInvite: boolean; onClose: () => void; onDone: (result: { notice?: string; open?: string }) => void }) {
  const [at, setAt] = useState(() => toLocalInput(workingDaysAfter(new Date(), 1, 11)));
  const [where, setWhere] = useState("");
  const canConfirm = deal.hasEmail && deal.hasEnquiry;
  const [confirmLetter, setConfirmLetter] = useState(canConfirm);
  const [files, setFiles] = useState<string[] | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [chase, setChase] = useState(true);
  const [amount, setAmount] = useState(deal.amount ? String(deal.amount) : "");
  const [on, setOn] = useState(() => toLocalInput(new Date()).slice(0, 10));
  const [invite, setInvite] = useState(canInvite && !deal.hasPortal && deal.hasEmail);
  const [welcome, setWelcome] = useState(deal.hasEmail);
  const [why, setWhy] = useState<string>("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (to !== "documents") return;
    let live = true;
    void filesSentTo(deal.personId).then((names) => {
      if (!live) return;
      setFiles(names);
      setSent(names);
    });
    return () => {
      live = false;
    };
  }, [to, deal.personId]);

  const input = (): MoveInputs | null => {
    if (to === "meeting") {
      const when = fromLocalInput(at);
      return when && where.trim() ? { stage: to, meeting: { at: when.toISOString(), where: where.trim() } } : null;
    }
    if (to === "documents") return { stage: to, sent, chase };
    if (to === "invested") return on ? { stage: to, invested: { on: new Date(`${on}T00:00:00+05:30`).toISOString(), ...(amount ? { amount: Number(amount) } : {}) }, invite } : null;
    if (to === "lost") return why ? { stage: to, lost: { why: why as never, note } } : null;
    return { stage: to };
  };
  const ready = Boolean(input());

  const move = async () => {
    const asked = input();
    if (!asked) return;
    setBusy(true);
    setError(null);
    const result = await moveDealTo(deal.id, asked);
    setBusy(false);
    if (!result.ok) return setError(result.error);
    const crore = amount ? `Rs. ${amount} crore` : "";
    const open =
      to === "meeting" && confirmLetter && asked.meeting
        ? letterHref(deal.personId, "meeting-confirmation", { when: meetingWords(new Date(asked.meeting.at)), where: asked.meeting.where })
        : to === "invested" && welcome && asked.invested
          ? deal.kind === "pms"
            ? letterHref(deal.personId, "welcome", { activatedOn: dayWords(new Date(asked.invested.on)) })
            : letterHref(deal.personId, "funds-received", { product: "Flyingbee Investment Fund", amount: crore, receivedOn: dayWords(new Date(asked.invested.on)) })
          : undefined;
    onDone({ notice: result.notice, open });
  };

  return (
    <Dialog open onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent size="lg" className="fluid">
        <DialogHeader>
          <DialogTitle>
            {deal.personName} to {labelOf(DEAL_STAGES, to)}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          {to === "meeting" ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-caption text-muted-foreground">
                  When
                  <input type="datetime-local" value={at} onChange={(event) => setAt(event.target.value)} className="h-9 rounded-lg border bg-transparent px-3 text-body text-foreground [color-scheme:dark]" />
                </label>
                <TextInput label="Where" value={where} onChange={(event) => setWhere(event.target.value)} placeholder="At the office, or a video call" />
              </div>
              {canConfirm ? (
                <label className="flex cursor-pointer items-center gap-2 text-body text-foreground">
                  <input type="checkbox" checked={confirmLetter} onChange={(event) => setConfirmLetter(event.target.checked)} className={check} />
                  Then write the Meeting confirmation
                </label>
              ) : null}
            </>
          ) : null}

          {to === "documents" ? (
            <>
              <fieldset className="m-0 grid gap-1.5 border-0 p-0">
                <legend className="mb-1.5 p-0 text-caption text-muted-foreground">What went</legend>
                {files === null ? <p className="text-caption text-muted-foreground">Looking at their emails…</p> : null}
                {files?.length === 0 ? <p className="text-body text-muted-foreground">No files in their emails of the last two months.</p> : null}
                {files?.map((name) => (
                  <label key={name} className="flex cursor-pointer items-center gap-2 text-body text-foreground">
                    <input type="checkbox" checked={sent.includes(name)} onChange={(event) => setSent(event.target.checked ? [...sent, name] : sent.filter((each) => each !== name))} className={check} />
                    {name}
                  </label>
                ))}
              </fieldset>
              <label className="flex cursor-pointer items-center gap-2 text-body text-foreground">
                <input type="checkbox" checked={chase} onChange={(event) => setChase(event.target.checked)} className={check} />
                Chase the signed documents in three working days
              </label>
            </>
          ) : null}

          {to === "invested" ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput label="Amount invested (Rs. crore)" type="number" min={0} step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
                <label className="grid gap-1.5 text-caption text-muted-foreground">
                  Invested on
                  <input type="date" value={on} onChange={(event) => setOn(event.target.value)} className="h-9 rounded-lg border bg-transparent px-3 text-body text-foreground [color-scheme:dark]" />
                </label>
              </div>
              {canInvite && !deal.hasPortal && deal.hasEmail ? (
                <label className="flex cursor-pointer items-center gap-2 text-body text-foreground">
                  <input type="checkbox" checked={invite} onChange={(event) => setInvite(event.target.checked)} className={check} />
                  Invite {deal.personName} to the client portal
                </label>
              ) : null}
              {deal.hasEmail ? (
                <label className="flex cursor-pointer items-center gap-2 text-body text-foreground">
                  <input type="checkbox" checked={welcome} onChange={(event) => setWelcome(event.target.checked)} className={check} />
                  Then write the {deal.kind === "pms" ? "Welcome" : "Funds received"} letter
                </label>
              ) : null}
            </>
          ) : null}

          {to === "lost" ? (
            <>
              <div className="grid gap-1.5">
                <span className="text-caption text-muted-foreground">Why</span>
                <Select value={why} onValueChange={setWhy}>
                  <SelectTrigger placeholder="Choose a reason" aria-label="Why it was lost" />
                  <SelectContent>
                    {LOST_REASONS.map((reason, index) => (
                      <SelectItem key={reason.value} index={index} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <TextInput label="In a line (optional)" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Chose to stay with a mutual fund for now" />
            </>
          ) : null}

          {error ? <p className="text-caption text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={busy} disabled={!ready} onClick={() => void move()}>
            Move to {labelOf(DEAL_STAGES, to)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
