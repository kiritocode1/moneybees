"use client";

import { MailWarning } from "lucide-react";
import { Banner, BannerTitle } from "@/components/fluid/banner";

/**
 * Shown on Today, Enquiries and Hiring while RESEND_API_KEY is unset
 * (lib/crm/mail.ts `emailConnected`): every email is saved on the record with
 * the status "Not sent", and nobody receives it. Server screens render it
 * only when that is true.
 */
export function EmailBanner({ className = "mt-6" }: { className?: string }) {
  return (
    <div className="fluid">
      <Banner status="warning" icon={MailWarning} className={className}>
        <BannerTitle>Email is not connected. Confirmations and replies are saved here, but nobody receives them.</BannerTitle>
      </Banner>
    </div>
  );
}
