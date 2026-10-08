import type { Metadata } from "next";
import { ForgotForm } from "@/components/portal/password-forms";
import { PortalFrame } from "@/components/portal/portal-frame";

export const metadata: Metadata = { title: "Set a new password", robots: { index: false, follow: false } };

export default function ForgotPage() {
  return (
    <PortalFrame>
      <ForgotForm />
    </PortalFrame>
  );
}
