import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/fluid/button";
import { EYEBROW, SUBHEAD } from "@/components/hero/tokens";
import { PortalFrame } from "@/components/portal/portal-frame";
import { currentInvestor } from "@/lib/auth/portal";
import { signOut } from "@/lib/auth/portal-actions";

export const metadata: Metadata = { title: "Your portal", robots: { index: false, follow: false } };

/**
 * The signed-in investor's home. Statements arrive with the statements
 * upload (plan §6, phase 1); until then the list is empty and says so.
 */
export default async function PortalHome() {
  const investor = await currentInvestor();
  if (!investor) redirect("/portal/login");

  return (
    <PortalFrame wide>
      <div className="flex max-w-[880px] flex-wrap items-end justify-between gap-6 border-b border-black/10 pb-8">
        <div>
          <p className={`${EYEBROW} text-black/60`}>{investor.email}</p>
          <h1 className={`mt-[14px] ${SUBHEAD}`}>{investor.name}</h1>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="tertiary">
            Sign out
          </Button>
        </form>
      </div>
      <section aria-labelledby="statements" className="mt-10 max-w-[880px]">
        <h2 id="statements" className="text-[15px] font-semibold">
          Statements
        </h2>
        <p className="mt-3 text-[15px] leading-[1.55] text-black/65">No statements yet. Moneybee adds your statements here each month.</p>
      </section>
    </PortalFrame>
  );
}
