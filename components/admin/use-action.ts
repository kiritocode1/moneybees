"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Result = { ok: true } | { ok: false; error: string };

/** Runs a server action, keeps its error for the form to show, and refreshes the screen when it worked. */
export function useAction() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const run = (action: () => Promise<Result>, onDone?: () => void) =>
    startTransition(async () => {
      setError(null);
      const result = await action();
      if (!result.ok) return setError(result.error);
      onDone?.();
      router.refresh();
    });
  return { pending, error, run };
}
