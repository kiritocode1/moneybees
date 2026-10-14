import type { Metadata } from "next";
import { connection } from "next/server";
import { ApplyForm } from "@/components/careers/apply-form";
import { PortalFrame } from "@/components/portal/portal-frame";
import { applyFormProps, CAREERS_LINKS } from "./apply-props";

export const metadata: Metadata = { title: "Send your resume", robots: { index: false, follow: true }, alternates: { canonical: "/careers/apply" } };

/** /careers/apply: an open application for a team, from "Send your resume" (lib/hiring/apply.ts). */
export default async function OpenApplicationPage() {
  await connection();
  return (
    <PortalFrame size="form" eyebrow={null} explore={CAREERS_LINKS}>
      <ApplyForm role={null} {...await applyFormProps()} />
    </PortalFrame>
  );
}
