"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/fluid/select";
import { pagePicture, SITE_PAGES } from "@/lib/pages/site-pages";

/** The Guide's page choice: the chosen page's still beside a menu of all eleven. */
export function PagePicker({ current }: { current: string }) {
  const router = useRouter();
  const page = SITE_PAGES.find((p) => p.key === current) ?? SITE_PAGES[0];
  return (
    <span className="inline-flex items-center gap-2">
      <img src={pagePicture(page)} alt="" className="h-[34px] w-[54px] rounded-[5px] border object-cover object-top" />
      <Select value={page.key} onValueChange={(key) => router.push(`/admin/guide?page=${key}#what`)}>
        <SelectTrigger aria-label="Page" className="min-w-[230px]" />
        <SelectContent>
          {SITE_PAGES.map((option, index) => (
            <SelectItem key={option.key} index={index} value={option.key}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </span>
  );
}
