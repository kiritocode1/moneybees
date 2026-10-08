import { LockKeyhole, Network } from "lucide-react";
import { DoorCard, QUIET_LINK } from "@/components/cta/door-card";
import { COLUMN, SUBHEAD } from "@/components/hero/tokens";
import Link from "@/components/transition/transition-link";
import { LOGINS } from "@/lib/investor-centre";

/*
 * /investor-centre, content plan §12: the two logins kept apart, as the
 * page's first section since the hero was dropped (user, 2026-10-08). Each is
 * a door card (components/cta/door-card.tsx) with one action: Client Login
 * opens the portal's sign-in page, Distributor Login asks the office for an
 * account. The documents are study-04 cards in
 * components/investor-v3/document-cards.tsx.
 */

/**
 * Client Login and Distributor Login: two doors, never one. White, so the grey
 * Documents section below reads as the next part. The nav is absolute (113px,
 * 75px on phones), so the section starts below it.
 */
export function LoginsSection() {
  return (
    <section id="logins" aria-labelledby="investor-centre-heading" className="scroll-mt-[96px] bg-white pt-[113px] text-black max-md:pt-[75px]">
      <div className={`${COLUMN} border-t border-black/10 pt-[64px] pb-[96px] max-md:pt-[40px] max-md:pb-[64px]`}>
        <h1 id="investor-centre-heading" className={SUBHEAD}>
          Investor Centre
        </h1>
        <div className="mt-[40px] grid grid-cols-1 gap-[16px] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <DoorCard door={LOGINS.client} icon={LockKeyhole} primary>
            <Link href="/portal/forgot" className={QUIET_LINK}>
              Forgot password?
            </Link>
          </DoorCard>
          <DoorCard door={LOGINS.distributor} icon={Network} />
        </div>
      </div>
    </section>
  );
}
