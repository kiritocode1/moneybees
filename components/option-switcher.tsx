import Link from "next/link";
import { OPTIONS, optionNumeral } from "@/lib/options";
import { cn } from "@/lib/utils";

export type OptionSwitcherProps = {
  /** Slug of the direction currently being viewed. */
  current: string;
  className?: string;
};

/**
 * Quiet review-only control for moving between directions. Rendered by each
 * option layout rather than the root, so any direction can drop it without
 * affecting the others.
 */
export function OptionSwitcher({ current, className }: OptionSwitcherProps) {
  return (
    <nav
      aria-label="Design directions"
      className={cn(
        "fixed inset-x-0 bottom-4 z-50 flex justify-center px-4",
        className,
      )}
    >
      <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/80 p-1 text-black shadow-sm backdrop-blur-md">
        <Link
          href="/"
          className="rounded-full px-3 py-1.5 text-xs tracking-wide text-black/60 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Index
        </Link>
        <span aria-hidden className="h-4 w-px bg-black/10" />
        {OPTIONS.map((option) => {
          const isCurrent = option.slug === current;
          return (
            <Link
              key={option.slug}
              href={`/${option.slug}`}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
                isCurrent
                  ? "bg-black text-white"
                  : "text-black/60 hover:text-black",
              )}
            >
              <span className="sr-only">{option.label}</span>
              <span aria-hidden>{optionNumeral(option.n)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
