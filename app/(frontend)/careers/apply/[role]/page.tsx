import config from "@payload-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getPayload } from "payload";
import { ApplyForm } from "@/components/careers/apply-form";
import { PortalFrame } from "@/components/portal/portal-frame";
import { SUBHEAD } from "@/components/hero/tokens";
import Link from "@/components/transition/transition-link";
import { type Team, TEAM_NAMES } from "@/lib/careers";
import { liveOpening } from "@/lib/hiring/apply";
import { applyFormProps, CAREERS_LINKS } from "../apply-props";

type Props = { params: Promise<{ role: string }> };

const findOpening = async (role: string) => (process.env.DATABASE_URL ? liveOpening(await getPayload({ config }), role) : null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const opening = await findOpening((await params).role);
  return { title: opening ? `Apply: ${opening.title}` : "Apply", robots: { index: false, follow: true } };
}

/** /careers/apply/<anchor>: the apply form for one Live role (Website › Openings). A role that has closed says so. */
export default async function ApplyForRolePage({ params }: Props) {
  await connection();
  const { role } = await params;
  if (!/^[a-z0-9-]{1,80}$/.test(role)) notFound();
  const opening = await findOpening(role);

  if (!opening) {
    return (
      <PortalFrame eyebrow="Careers at Moneybee" explore={CAREERS_LINKS}>
        <h1 className={SUBHEAD}>This role is not open</h1>
        <p className="mt-4 text-[15px] leading-[1.55] text-muted-foreground">It has been filled or taken down. The careers page lists the roles that are open, and you can still send your resume.</p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-medium">
          <Link href="/careers#openings" className="underline underline-offset-4">
            See open roles
          </Link>
          <Link href="/careers/apply" className="underline underline-offset-4">
            Send your resume
          </Link>
        </p>
      </PortalFrame>
    );
  }

  return (
    <PortalFrame size="form" eyebrow={null} explore={CAREERS_LINKS}>
      <ApplyForm
        role={{
          id: role,
          title: opening.title,
          team: TEAM_NAMES[opening.team as Team],
          location: opening.location,
          employment: opening.employment,
          mustHaves: (opening.mustHaves ?? []).map(({ line }) => line),
        }}
        {...await applyFormProps()}
      />
    </PortalFrame>
  );
}
