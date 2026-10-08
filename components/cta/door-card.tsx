import type { ComponentType, ReactNode } from "react";
import { EYEBROW } from "@/components/hero/tokens";
import Link from "@/components/transition/transition-link";

/** What a door card shows. `href` is a site path, or a mailto for the office. */
export type Door = { name: string; audience: string; text: string; action: string; href: string };

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";
const PILL = `inline-flex items-center justify-center rounded-full px-[26px] py-[13px] text-[15px] font-medium no-underline transition-[color,background-color,border-color,scale] duration-200 ease-[cubic-bezier(.23,1,.32,1)] active:scale-[0.97] motion-reduce:transition-none ${FOCUS}`;
export const QUIET_LINK = `text-[14px] text-black/60 underline-offset-4 hover:text-black hover:underline ${FOCUS}`;

/**
 * One door: an icon, who it is for, what it does, and a single action. The
 * Investor Centre logins and the closing pair on content pages are built from
 * it (components/cta/page-end-doors.tsx). `primary` gives the orange action;
 * `children` sits beside the action for a quiet second link.
 */
export function DoorCard({
  door,
  icon: Icon,
  primary,
  children,
}: {
  door: Door;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  primary?: boolean;
  children?: ReactNode;
}) {
  const action = primary ? `${PILL} bg-[#F6A11A] text-black hover:bg-black hover:text-white` : `${PILL} border border-black/20 text-black hover:border-black`;
  return (
    <article className="flex flex-col rounded-[20px] border border-black/[.08] bg-white p-[40px] shadow-[0_1px_2px_rgba(0,0,0,.04),0_16px_40px_-16px_rgba(0,0,0,.12)] max-md:p-[24px]">
      <div className="flex items-center justify-between gap-4">
        <span aria-hidden="true" className={`inline-flex h-[48px] w-[48px] items-center justify-center rounded-full ${primary ? "bg-[#FDEFE2]" : "bg-[#F6F6F6]"}`}>
          <Icon size={20} strokeWidth={1.5} />
        </span>
        <span className={`${EYEBROW} text-black/55`}>{door.audience}</span>
      </div>
      <h2 className="mt-[32px] font-serif text-[clamp(2rem,1.6rem+1vw,2.5rem)] leading-[1.05] font-normal tracking-[-.015em]">{door.name}</h2>
      <p className="mt-[12px] max-w-[420px] text-[15px] leading-[1.55] text-black/65">{door.text}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-[24px] gap-y-[12px] pt-[36px]">
        {door.href.startsWith("/") ? (
          <Link href={door.href} className={action}>
            {door.action}
          </Link>
        ) : (
          <a href={door.href} className={action}>
            {door.action}
          </a>
        )}
        {children}
      </div>
    </article>
  );
}
