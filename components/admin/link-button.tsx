"use client";

import { BookOpen, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/fluid/button";

/** Icons by name, so a server screen can ask for one without passing a component across. */
const ICONS = { pencil: Pencil, eye: Eye, book: BookOpen } as const;

/**
 * A Fluid Functionalism button that is a link, with its icon set the way the
 * component spaces it. `external` opens a site page in a new tab.
 */
export function LinkButton({
  href,
  icon,
  external = false,
  variant = "secondary",
  size = "compact",
  className,
  children,
}: {
  href: string;
  icon?: keyof typeof ICONS;
  external?: boolean;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  children: ReactNode;
}) {
  return (
    <Button asChild size={size} variant={variant} leadingIcon={icon ? ICONS[icon] : undefined} className={className}>
      {external ? (
        <a href={href} target="_blank" rel="noreferrer" className="no-underline">
          {children}
        </a>
      ) : (
        <Link href={href} className="no-underline">
          {children}
        </Link>
      )}
    </Button>
  );
}
