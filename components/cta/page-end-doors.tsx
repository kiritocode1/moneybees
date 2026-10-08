import { LockKeyhole, MessageSquareText } from "lucide-react";
import { COLUMN } from "@/components/hero/tokens";
import Link from "@/components/transition/transition-link";
import { ENQUIRY_HREF } from "@/lib/contact-v2";
import { LOGINS } from "@/lib/investor-centre";
import { type Door, DoorCard, QUIET_LINK } from "./door-card";

/** The enquiry door. Like every enquiry link on the site it opens the form on /contact, General tab (ENQUIRY_HREF). */
const ENQUIRY: Door = {
  name: "Get Started",
  audience: "Enquiry",
  text: "Questions about Moneybee, the PMS or the AIF. Choose the topic on the form and the team gets back to you.",
  action: "Enquire",
  href: ENQUIRY_HREF,
};

/**
 * The close of a content page (user, 2026-10-08): the same door cards as the
 * Investor Centre, side by side. Client Login on the left, the enquiry on the
 * right in orange. Not the black closing band the user rejected on
 * 2026-09-30: white, two cards, one action each. `login={false}` leaves only
 * the enquiry, for a page that already opens on the logins.
 */
export function PageEndDoors({ login = true }: { login?: boolean }) {
  return (
    <section aria-label="Next steps" className="border-t border-black/10 bg-white text-black">
      <div className={`${COLUMN} py-[96px] max-md:py-[56px]`}>
        <div className={`grid grid-cols-1 gap-[16px] ${login ? "md:grid-cols-2" : "md:max-w-[50%]"}`}>
          {login && (
            <DoorCard door={LOGINS.client} icon={LockKeyhole}>
              <Link href="/portal/forgot" className={QUIET_LINK}>
                Forgot password?
              </Link>
            </DoorCard>
          )}
          <DoorCard door={ENQUIRY} icon={MessageSquareText} primary />
        </div>
      </div>
    </section>
  );
}
