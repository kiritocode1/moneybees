import type { ReactNode } from "react";
import PageTransition from "@/components/transition/page-transition";

/**
 * Re-mounted on every navigation, so each page enters and leaves inside its
 * own <PageTransition>: the Tres Mares slide approved in
 * .plannotator/pms-v3/plan.md.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
