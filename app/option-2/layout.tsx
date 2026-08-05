import type { Metadata } from "next";
import { OptionSwitcher } from "@/components/option-switcher";

export const metadata: Metadata = {
  title: "Moneybee | Long-term investment management",
  description: "Moneybee Portfolio Management Services and Alternative Investment Fund.",
};

export default function OptionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="option-two-shell min-h-svh bg-[#f3f2ee] text-[#2d2b27]">
      {children}
      <OptionSwitcher current="option-2" />
    </div>
  );
}
