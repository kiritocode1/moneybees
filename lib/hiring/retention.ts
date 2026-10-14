import type { Payload } from "payload";
import { deleteResume } from "@/lib/hiring/resume-store";

/**
 * Deletes every application past its deleteAfter day, resume first, and
 * leaves one audit line per run that names no one. Run daily by
 * /api/cron/retention (vercel.json). The applicant agreed to the period when
 * they applied; Desk settings › Hiring sets it for new applications.
 */
export async function deleteExpiredApplications(payload: Payload, now = new Date()) {
  const { docs } = await payload.find({ collection: "applications", where: { deleteAfter: { less_than_equal: now.toISOString() } }, limit: 500, depth: 0, overrideAccess: true, select: { resume: true } });
  for (const doc of docs) {
    if (doc.resume?.key) await deleteResume(doc.resume.key);
    await payload.delete({ collection: "applications", id: doc.id, overrideAccess: true });
  }
  if (docs.length) {
    await payload.create({
      collection: "audit-log",
      overrideAccess: true,
      data: { action: "delete", collectionSlug: "applications", docId: "retention", summary: `Deleted ${docs.length} application${docs.length === 1 ? "" : "s"} past their keep-until day, with their resumes`, changes: {} },
    });
  }
  return docs.length;
}
