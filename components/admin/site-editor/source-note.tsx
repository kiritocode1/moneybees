import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/fluid/button";

/**
 * The one style for "this part is edited somewhere else" at the top of a
 * section's fields: an icon, one line, and a button to the place
 * (admin-ergonomics plan B). Without `href` it is a plain note.
 */
export function SourceNote({ icon: Icon, children, href, action }: { icon: LucideIcon; children: ReactNode; href?: string; action?: string }) {
  return (
    <div className="fluid mb-4 flex items-center gap-3 rounded-[10px] bg-muted px-3 py-2.5 text-body text-foreground">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1">{children}</span>
      {href && action ? (
        <Button asChild size="compact" variant="secondary" className="shrink-0">
          <Link href={href} className="no-underline">
            {action}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
