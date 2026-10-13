"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import { Link2 } from "lucide-react";
import { type ClipboardEvent, useId, useState, useTransition } from "react";
import { mapEmbed } from "@/lib/site/details";
import { pinFromShortLink } from "@/lib/site/maps-actions";
import { isShortMapsLink, type Pin, pinFromMapsLink } from "@/lib/site/maps-link";

/**
 * Office details › Map pin (admin-ergonomics plan E): paste a Google Maps link
 * and Latitude and Longitude fill themselves; the map beside it is the one
 * visitors see on the Contact page, pinned on the two numbers as they stand.
 */
export function MapPin() {
  const { dispatchFields, setModified } = useForm();
  const lat = useFormFields(([fields]) => fields["pin.lat"]?.value);
  const lon = useFormFields(([fields]) => fields["pin.lon"]?.value);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const id = useId();

  const place = (pin: Pin | null) => {
    if (!pin) return setMessage("That link has no place in it. Open the office in Google Maps and copy the link from Share.");
    dispatchFields({ type: "UPDATE", path: "pin.lat", value: pin.lat });
    dispatchFields({ type: "UPDATE", path: "pin.lon", value: pin.lon });
    setModified(true);
    setMessage("The pin moved. Save to put it on the site.");
  };
  const read = (value: string) => {
    setLink(value);
    setMessage(null);
    if (!value.trim()) return;
    if (isShortMapsLink(value)) startTransition(async () => place(await pinFromShortLink(value)));
    else place(pinFromMapsLink(value));
  };

  const pinned = typeof lat === "number" && typeof lon === "number";
  return (
    <div className="fluid mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div>
        <label htmlFor={id} className="mb-1.5 block text-body font-medium text-foreground">
          Paste a Google Maps link
        </label>
        <div className="flex h-10 items-center gap-2 rounded-md border bg-card px-3">
          <Link2 aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            id={id}
            type="url"
            value={link}
            placeholder="https://maps.app.goo.gl/…"
            onChange={(event) => setLink(event.target.value)}
            onPaste={(event: ClipboardEvent<HTMLInputElement>) => {
              event.preventDefault();
              read(event.clipboardData.getData("text"));
            }}
            onBlur={() => link && read(link)}
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-body text-foreground outline-none"
          />
        </div>
        <p role="status" className="mt-2 text-caption text-muted-foreground">
          {pending ? "Reading the link…" : (message ?? "Or type the two numbers below.")}
        </p>
      </div>
      <div className="h-[260px] overflow-hidden rounded-xl border bg-muted">
        {pinned ? <iframe title="The office on the map" src={mapEmbed({ pin: { lat, lon } })} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" /> : null}
      </div>
    </div>
  );
}
