import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResetForm } from "@/components/portal/password-forms";
import { PortalFrame } from "@/components/portal/portal-frame";

export const metadata: Metadata = { title: "Choose a password", robots: { index: false, follow: false } };

/** Opened from the emailed link, which carries the reset token. Without one there is nothing to set. */
export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  if (!token) redirect("/portal/forgot");
  return (
    <PortalFrame>
      <ResetForm token={token} />
    </PortalFrame>
  );
}
