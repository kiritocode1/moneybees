"use client";

import {
  Briefcase,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ChartColumn,
  ClipboardList,
  FileText,
  History,
  Image,
  Inbox,
  LayoutTemplate,
  LineChart,
  Mail,
  Package,
  Settings,
  ShieldCheck,
  UserCheck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { LinkButton } from "@/components/admin/link-button";
import { SCREENS, type ScreenIcon as Icon, type ScreenKey, screenGuideHref } from "@/lib/admin/screens";

const ICONS: Record<Icon, LucideIcon> = {
  today: CalendarCheck,
  inbox: Inbox,
  people: Users,
  deals: Briefcase,
  hiring: UserCheck,
  pages: LayoutTemplate,
  team: UserRound,
  documents: FileText,
  cases: ChartColumn,
  openings: BriefcaseBusiness,
  office: Building2,
  factSheets: LineChart,
  products: Package,
  files: Image,
  playbooks: ClipboardList,
  templates: Mail,
  clients: ShieldCheck,
  staff: Users,
  audit: History,
  settings: Settings,
};

/** A screen's icon, by its entry in lib/admin/screens.ts. */
export function ScreenIcon({ screen, className = "h-4 w-4" }: { screen: ScreenKey; className?: string }) {
  const Glyph = ICONS[SCREENS[screen].icon];
  return <Glyph aria-hidden="true" className={className} />;
}

/**
 * The line under a screen's title (admin-ergonomics, screen intros): what the
 * screen is and what it changes, and How to use this into its Guide entry.
 * Set as the `admin.components.Description` of a collection or global with
 * `clientProps: { screen }`; our own views render it under their h1.
 */
export function ScreenIntro({ screen }: { screen: ScreenKey }) {
  return (
    <div className="fluid my-3 flex max-w-[900px] items-center gap-3 rounded-[10px] bg-muted px-4 py-3 text-body text-foreground">
      <ScreenIcon screen={screen} className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1">{SCREENS[screen].line}</span>
      <LinkButton href={screenGuideHref(screen)} icon="book" className="shrink-0">
        How to use this
      </LinkButton>
    </div>
  );
}
