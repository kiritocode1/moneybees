import Link from "next/link";
import { OPTIONS, optionNumeral } from "@/lib/options";

// Internal chooser, not a client-facing page. It stays deliberately plain so
// it never reads as one of the directions on offer.

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-black">
      <header className="px-6 pt-10 sm:px-10">
        <p className="text-xs uppercase tracking-[0.2em] text-black/50">
          Moneybee
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
          Four directions. Choose one.
        </h1>
      </header>

      <main className="flex flex-1 flex-col px-6 py-10 sm:px-10">
        <ul className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <li key={option.slug} className="flex">
              <Link
                href={`/${option.slug}`}
                className="group flex min-h-44 flex-1 flex-col justify-between rounded-lg border border-black/15 p-6 transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:min-h-56"
              >
                <span className="text-6xl tabular-nums leading-none tracking-tight sm:text-8xl">
                  {optionNumeral(option.n)}
                </span>
                <span className="mt-6 flex items-end justify-between gap-4">
                  <span className="text-sm text-black/60 transition-colors group-hover:text-white/70">
                    {option.note || "Not yet designed"}
                  </span>
                  <span
                    aria-hidden
                    className="text-sm text-black/30 transition-transform group-hover:translate-x-1 group-hover:text-white/70"
                  >
                    &rarr;
                  </span>
                </span>
                <span className="sr-only">{option.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
