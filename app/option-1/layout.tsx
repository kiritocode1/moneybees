import type { Metadata } from "next";
import { OptionSwitcher } from "@/components/option-switcher";

export const metadata: Metadata = {
  title: "Moneybee | Investment Management",
  description: "Moneybee Portfolio Management Services and Alternative Investment Fund.",
};

export default function OptionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="option-one-shell min-h-svh bg-white text-black">
      {children}
      <OptionSwitcher current="option-1" />
    </div>
  );
}
