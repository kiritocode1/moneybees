import type { Metadata } from "next";
import { OptionSwitcher } from "@/components/option-switcher";

// Type: inherits Rethink Sans from the root layout. To give this direction its
// own face, import it here, add its variable class to the wrapper below, and
// set the family on it. (Avoid writing Tailwind class syntax in comments —
// the scanner compiles it into real CSS.)

export const metadata: Metadata = {
  title: "Quiet Authority",
  description: "Moneybee design direction one: Quiet Authority.",
};

export default function OptionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-svh bg-white text-black">
      {children}
      <OptionSwitcher current="option-1" />
    </div>
  );
}
