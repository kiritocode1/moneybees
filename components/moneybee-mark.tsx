import { cn } from "@/lib/utils";

type MoneybeeMarkProps = {
  className?: string;
  compact?: boolean;
};

export function MoneybeeMark({ className, compact = false }: MoneybeeMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="size-7 shrink-0"
        fill="none"
      >
        <path
          d="M10.4 9.3 16 6l5.6 3.3v6.5L16 19l-5.6-3.2V9.3Z"
          fill="currentColor"
        />
        <path
          d="m6.1 16.1 5.1-3v6l-5.1 3v-6Zm19.8 0-5.1-3v6l5.1 3v-6Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M16 19v6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      {!compact && (
        <span className="text-[1.05rem] font-semibold tracking-[-0.045em]">
          moneybee
        </span>
      )}
    </span>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-4", className)}
      fill="none"
    >
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
