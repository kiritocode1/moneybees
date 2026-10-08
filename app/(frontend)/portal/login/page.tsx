import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/portal/login-form";
import { PortalFrame } from "@/components/portal/portal-frame";
import { currentInvestor } from "@/lib/auth/portal";

export const metadata: Metadata = { title: "Client Login", robots: { index: false, follow: false } };

/** /portal/login: email and password, then the emailed code (lib/auth/portal.ts). A signed-in investor goes straight to /portal. */
export default async function PortalLoginPage() {
  if (await currentInvestor()) redirect("/portal");
  return (
    <PortalFrame>
      <LoginForm />
    </PortalFrame>
  );
}
