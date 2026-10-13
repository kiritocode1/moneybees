"use client";

import { Link, NavGroup, useAuth } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { CRM_ROLES, hasRole } from "@/lib/backend/roles";
import type { User } from "@/payload-types";

/*
 * The Desk group: the screens staff work in every day, drawn with Payload's
 * own nav__link markup above its groups. People and Deals are Payload lists;
 * their collections are kept out of the sidebar (group: false) so they appear
 * once, here. The CRM's internal records (activities, emails, tasks, entities)
 * are reached from a person or an enquiry, never browsed. The Website group
 * follows: the site's editable pages, for the people who edit them.
 */
const LINKS = [
  { href: "/admin", label: "Today", exact: true, crm: false },
  { href: "/admin/inbox", label: "Enquiries", exact: false, crm: true },
  { href: "/admin/collections/contacts", label: "People", exact: false, crm: true },
  { href: "/admin/collections/deals", label: "Deals", exact: false, crm: true },
] as const;

/** The Website group: the pages behind one screen (components/admin/website), then the lists they share. */
const PAGES = [
  { href: "/admin/website", label: "Pages", exact: true, also: /^\/admin\/globals\/[a-z-]+-page(\/|$)/ },
  { href: "/admin/collections/team-members", label: "Team", exact: false },
  { href: "/admin/collections/documents", label: "Documents", exact: false },
  { href: "/admin/collections/case-studies", label: "Case studies", exact: false },
  { href: "/admin/collections/openings", label: "Openings", exact: false },
  { href: "/admin/globals/site-details", label: "Office details", exact: false },
  { href: "/admin/guide", label: "Guide", exact: true },
] as const;

/** One sidebar link. `also` keeps it lit on screens it leads to, such as Pages while a page is open. */
type NavLink = { href: string; label: string; exact: boolean; also?: RegExp };

function Links({ links, pathname }: { links: readonly NavLink[]; pathname: string }) {
  return links.map(({ href, label, exact, also }) => {
    const active = (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)) || Boolean(also?.test(pathname));
    return (
      <Link key={href} href={href} className="nav__link" prefetch={false}>
        {active ? <div className="nav__link-indicator" /> : null}
        <span className="nav__link-label">{label}</span>
      </Link>
    );
  });
}

export function NavLinks() {
  const pathname = usePathname();
  const { user } = useAuth<User>();
  // Only links the signed-in person's role can open.
  const staff = user ? { ...user, collection: "users" as const } : null;
  const crm = hasRole(staff, ...CRM_ROLES);
  return (
    <>
      <NavGroup label="Desk">
        <Links links={LINKS.filter((link) => crm || !link.crm)} pathname={pathname} />
      </NavGroup>
      {hasRole(staff, "editor", "compliance", "hr") ? (
        <NavGroup label="Website">
          <Links links={PAGES} pathname={pathname} />
        </NavGroup>
      ) : null}
    </>
  );
}
