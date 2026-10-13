"use server";

import config from "@payload-config";
import { headers } from "next/headers";
import { APIError, getPayload } from "payload";
import type { Period } from "@/lib/figure-limits";
import { lastDay, type Month } from "./month";

/*
 * What the fact sheet screen (components/admin/fact-sheet) asks of the
 * server. Every change goes through Payload as the signed-in person, so the
 * maker-checker rules in lib/backend/fact-sheet-workflow.ts still decide who
 * may submit, approve or change what.
 */

export type SheetInput = {
  id: number | null;
  product: number;
  month: Month;
  returns: { period: Period; ours: number | null; benchmark: number | null }[];
  wealth: { ours: number | null; benchmark: number | null };
  sectors: { name: string; weight: number }[];
  pdf: number | null;
  correctionReason: string;
};

export type SheetResult = { ok: true; id: number } | { ok: false; error: string };

async function asStaff() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== "users") throw new APIError("Your session ended. Sign in again.", 401);
  return { payload, user };
}

/** Runs one change and turns a refusal into a message the screen can show. */
async function attempt(run: () => Promise<number>): Promise<SheetResult> {
  try {
    return { ok: true, id: await run() };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "That did not save. Try again." };
  }
}

/** Saves the screen's boxes as a draft, and with `submit` sends it to compliance. */
export async function saveSheet(input: SheetInput, submit: boolean): Promise<SheetResult> {
  return attempt(async () => {
    const { payload, user } = await asStaff();
    const data = {
      product: input.product,
      asOf: lastDay(input.month),
      // A period with neither number has not run; it is left out and the site prints N/A.
      returns: input.returns.filter((row) => row.ours !== null || row.benchmark !== null),
      wealth: input.wealth,
      sectors: input.sectors,
      pdf: input.pdf,
      correctionReason: input.correctionReason || null,
    };
    const saved = input.id
      ? await payload.update({ collection: "fact-sheets", id: input.id, data, user, overrideAccess: false })
      : await payload.create({ collection: "fact-sheets", data: { ...data, status: "draft" }, user, overrideAccess: false });
    if (submit) await payload.update({ collection: "fact-sheets", id: saved.id, data: { status: "in_review", reviewNote: null }, user, overrideAccess: false });
    return saved.id;
  });
}

/** Moves a sheet: back to draft (taken back or sent back with a note), or published by compliance. */
export async function moveSheet(id: number, to: "draft" | "published", note?: string): Promise<SheetResult> {
  return attempt(async () => {
    const { payload, user } = await asStaff();
    await payload.update({ collection: "fact-sheets", id, data: { status: to, ...(note === undefined ? {} : { reviewNote: note }) }, user, overrideAccess: false });
    return id;
  });
}

/** Starts the fix for a published month: a draft copy of it, which needs a reason before it can go to compliance. */
export async function correctSheet(id: number): Promise<SheetResult> {
  return attempt(async () => {
    const { payload, user } = await asStaff();
    const live = await payload.findByID({ collection: "fact-sheets", id, depth: 0, user, overrideAccess: false });
    const copy = await payload.create({
      collection: "fact-sheets",
      data: {
        product: live.product,
        asOf: live.asOf,
        status: "draft",
        returns: live.returns?.map(({ period, ours, benchmark }) => ({ period, ours, benchmark })),
        wealth: live.wealth,
        sectors: live.sectors?.map(({ name, weight }) => ({ name, weight })),
        pdf: live.pdf,
      },
      user,
      overrideAccess: false,
    });
    return copy.id;
  });
}
