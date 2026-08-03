import { getOption, optionNumeral } from "@/lib/options";

// Stub. Replace this whole file with the direction — structure, copy, and
// palette are all free here.

const option = getOption("option-4");

export default function Option4() {
  return (
    <main className="flex min-h-svh flex-col items-start justify-center gap-4 px-6 sm:px-10">
      <p className="text-8xl tabular-nums leading-none tracking-tight sm:text-9xl">
        {optionNumeral(option?.n ?? 4)}
      </p>
      <p className="text-sm text-black/50">
        {option?.note || "Not yet designed"}
      </p>
    </main>
  );
}
