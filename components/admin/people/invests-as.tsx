"use client";

import { useState } from "react";
import { TextInput } from "@/components/admin/fields";
import { useAction } from "@/components/admin/use-action";
import { Button } from "@/components/fluid/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { type EntityType, INVESTS_AS } from "@/lib/crm/entities";
import { setInvestsAs } from "@/lib/crm/person-actions";

/*
 * What a person invests as: themselves, or an HUF, family office, company or
 * trust by name. Used by Change on the person's Account panel, and as the
 * offer when their Flyingbee enquiry named an investor type (the person's
 * Account panel and the enquiry's Person panel). Typing the name of one
 * that exists links them to it (lib/crm/entities.ts).
 */

type Choice = "self" | EntityType;

/** A likely name to type over, from the person's surname. */
function sample(type: Choice, personName: string) {
  const surname = personName.trim().split(/\s+/).at(-1) ?? "";
  return { self: "", huf: `${surname} Family HUF`, family_office: `${surname} Family Office`, company: "As on its PAN", trust: `${surname} Family Trust`, other: "As on its PAN" }[type];
}

export function InvestsAsForm({
  personId,
  personName,
  initial,
  types,
  submit,
  onDone,
  onCancel,
}: {
  personId: number;
  personName: string;
  initial: { type: Choice; name: string };
  /** Only these choices, when an enquiry said which; otherwise all of them. */
  types?: EntityType[];
  submit: string;
  onDone?: () => void;
  onCancel?: () => void;
}) {
  const [type, setType] = useState<Choice>(initial.type);
  const [name, setName] = useState(initial.name);
  const { pending, error, run } = useAction();
  const options = types ? INVESTS_AS.filter(({ value }) => value !== "self" && types.includes(value)) : INVESTS_AS;

  return (
    <form
      className="grid gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        run(() => setInvestsAs(personId, { type, name: type === "self" ? "" : name }), onDone);
      }}
    >
      {options.length > 1 ? (
        <Select value={type} onValueChange={(value) => setType(value as Choice)} size="compact">
          <SelectTrigger aria-label="Invests as" />
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={option.value} index={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
      {type === "self" ? null : <TextInput label="Name" value={name} onChange={(event) => setName(event.target.value)} placeholder={sample(type, personName)} />}
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="compact" variant="secondary" loading={pending} disabled={type !== "self" && !name.trim()}>
          {submit}
        </Button>
        {onCancel ? (
          <Button type="button" size="compact" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

/** The offer, when their enquiry named an investor type and no entity is recorded yet. */
export function EntityOffer({ personId, personName, suggested }: { personId: number; personName: string; suggested: { said: string; types: EntityType[] } }) {
  const lower = (words: string) => (words === "HUF" ? words : words.toLowerCase());
  const label = INVESTS_AS.find(({ value }) => value === suggested.types[0])?.label ?? suggested.said;
  return (
    <div className="mt-3 grid gap-2 rounded-lg border border-dashed p-3">
      <p className="text-caption text-muted-foreground">
        Their enquiry says they invest as {suggested.said === "HUF" ? "an" : "a"} {lower(suggested.said)}.
      </p>
      <InvestsAsForm personId={personId} personName={personName} initial={{ type: suggested.types[0], name: "" }} types={suggested.types} submit={suggested.types.length > 1 ? "Add it" : `Add the ${lower(label)}`} />
    </div>
  );
}
