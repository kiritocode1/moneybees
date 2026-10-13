"use client";

import { createContext, type ReactNode, useContext } from "react";
import { DEFAULT_DETAILS, type SiteDetails } from "@/lib/site/details";

const Details = createContext<SiteDetails>(DEFAULT_DETAILS);

/** Hands the office and contact details, read on the server in app/(frontend)/layout.tsx, to the client sections. */
export function SiteDetailsProvider({ details, children }: { details: SiteDetails; children: ReactNode }) {
  return <Details value={details}>{children}</Details>;
}

/** The office and contact details in a client component. */
export const useSiteDetails = () => useContext(Details);
