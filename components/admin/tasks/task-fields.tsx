"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { type DuePreset, duePresets, fromLocalInput, toLocalInput } from "@/lib/crm/due";
import { TASK_KINDS, type TaskKind } from "@/lib/crm/vocabulary";

/*
 * The pickers every task form shares (the person composer, the Tasks desk,
 * quick add): when it is due, what kind it is, and who owns it. Times are
 * picked from presets, never typed, and read in Mumbai time.
 */

const IST = { timeZone: "Asia/Kolkata" } as const;
const timeOf = (at: Date) => at.toLocaleTimeString("en-GB", { ...IST, hour: "2-digit", minute: "2-digit", hour12: false });

/** "Tomorrow, 10:00", "Monday 19 Oct, 10:00", "In a week, Thu 22 Oct". */
function presetText(preset: DuePreset) {
  if (preset.key === "week") return `In a week, ${preset.at.toLocaleDateString("en-GB", { ...IST, weekday: "short", day: "numeric", month: "short" })}`;
  if (preset.key === "monday") return `Monday ${preset.at.toLocaleDateString("en-GB", { ...IST, day: "numeric", month: "short" })}, ${timeOf(preset.at)}`;
  return `${preset.label}, ${timeOf(preset.at)}`;
}

/** When it is due: the presets for now, or a date and time picked. Mumbai time. */
export function DuePicker({ value, onChange, now }: { value: string; onChange: (iso: string) => void; now: Date }) {
  // The presets are worked out once, so a choice keeps matching while the clock ticks.
  const [presets] = useState(() => duePresets(now));
  const [picking, setPicking] = useState(false);
  const match = presets.find((preset) => preset.at.toISOString() === value);
  const chosen = match && !picking ? match.key : "custom";
  const custom = chosen === "custom";
  return (
    <div className="grid gap-1.5">
      <Select
        value={chosen}
        onValueChange={(next) => {
          const preset = presets.find((option) => option.key === next);
          setPicking(!preset);
          if (preset) onChange(preset.at.toISOString());
        }}
        size="compact"
      >
        <SelectTrigger aria-label="When" />
        <SelectContent>
          {presets.map((preset, index) => (
            <SelectItem key={preset.key} index={index} value={preset.key}>
              {presetText(preset)}
            </SelectItem>
          ))}
          <SelectItem index={presets.length} value="custom">
            Pick a date and time
          </SelectItem>
        </SelectContent>
      </Select>
      {custom ? (
        <input
          type="datetime-local"
          aria-label="Date and time"
          value={toLocalInput(new Date(value))}
          onChange={(event) => {
            const at = fromLocalInput(event.target.value);
            if (at) onChange(at.toISOString());
          }}
          className="h-7 rounded-md border bg-transparent px-2 text-caption text-foreground [color-scheme:dark]"
        />
      ) : null}
    </div>
  );
}

export type StaffOption = { id: number; name: string };

/** Who owns it; the signed-in staff member is marked (you). */
export function OwnerSelect({ staff, me, value, onChange }: { staff: StaffOption[]; me: number; value: number; onChange: (id: number) => void }) {
  return (
    <Select value={String(value)} onValueChange={(next) => onChange(Number(next))} size="compact">
      <SelectTrigger aria-label="Who" />
      <SelectContent>
        {staff.map((member, index) => (
          <SelectItem key={member.id} index={index} value={String(member.id)}>
            {member.id === me ? `${member.name} (you)` : member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function KindSelect({ value, onChange }: { value: TaskKind; onChange: (kind: TaskKind) => void }) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as TaskKind)} size="compact">
      <SelectTrigger aria-label="Kind of task" />
      <SelectContent>
        {TASK_KINDS.map((kind, index) => (
          <SelectItem key={kind.value} index={index} value={kind.value}>
            {kind.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
