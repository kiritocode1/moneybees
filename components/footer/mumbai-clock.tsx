"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });

/** The Mumbai office's local time, after Aspen's office clocks. Rendered after mount so server and client agree. */
export default function MumbaiClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <p className="text-[11px] uppercase tracking-[.08em]">
      <span className="block text-[rgba(0,0,0,.55)]">Mumbai</span>
      <span className="mt-[4px] block font-mono text-[1.6rem] tracking-[-.02em] normal-case tabular-nums">
        {time ?? "--:--"} <span className="text-[13px] text-[rgba(0,0,0,.55)]">IST</span>
      </span>
    </p>
  );
}
