"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from "react";
import { cn } from "@/components/fluid/lib/utils";

/*
 * The two plain controls Fluid Functionalism leaves out: a multi-line text
 * area and a bare labelled input, drawn with its tokens (border, focus ring,
 * body type) so they sit beside its Select and Button without a seam.
 */

const CONTROL =
  "w-full rounded-lg border bg-transparent px-3 font-[inherit] text-body text-foreground outline-none transition-[border-color,box-shadow] duration-100 placeholder:text-muted-foreground hover:border-foreground/25 focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]/40 disabled:opacity-50";

type Labelled = { label: string; hideLabel?: boolean; hint?: string };

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & Labelled>(function TextArea({ label, hideLabel, hint, className, id, ...props }, ref) {
  const fallback = useId();
  const fieldId = id ?? fallback;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={fieldId} className={cn("text-caption text-muted-foreground", hideLabel && "sr-only")}>
        {label}
      </label>
      <textarea ref={ref} id={fieldId} className={cn(CONTROL, "min-h-24 resize-y py-2 leading-[var(--lh-body)]", className)} {...props} />
      {hint ? <p className="text-caption text-muted-foreground">{hint}</p> : null}
    </div>
  );
});

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Labelled>(function TextInput({ label, hideLabel, hint, className, id, ...props }, ref) {
  const fallback = useId();
  const fieldId = id ?? fallback;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={fieldId} className={cn("text-caption text-muted-foreground", hideLabel && "sr-only")}>
        {label}
      </label>
      <input ref={ref} id={fieldId} className={cn(CONTROL, "h-9", className)} {...props} />
      {hint ? <p className="text-caption text-muted-foreground">{hint}</p> : null}
    </div>
  );
});
