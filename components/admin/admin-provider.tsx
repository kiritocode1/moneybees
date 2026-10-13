"use client";

import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { FluidProvider } from "@/components/fluid/lib/fluid-provider";
import { untitleduiIcons } from "@/components/fluid/lib/icons-untitledui";
import "./admin.css";

/*
 * Wraps all of /admin (payload.config.ts admin.components.providers), so our
 * screens and the menus they open share Fluid Functionalism's settings:
 * rounded corners, the default size step, Untitled UI icons, and reduced
 * motion that follows the OS. Payload's own views ignore these contexts.
 */

// Inter with its optical-size axis: FF animates a label's weight together
// with opsz, so the label gets bolder without getting wider.
const inter = Inter({ subsets: ["latin"], axes: ["opsz"], display: "swap" });

export function AdminProvider({ children }: { children: ReactNode }) {
  return (
    <FluidProvider shape="rounded" size="default" icons={untitleduiIcons}>
      <style>{`:root{--font-fluid:${inter.style.fontFamily}}`}</style>
      {children}
    </FluidProvider>
  );
}
