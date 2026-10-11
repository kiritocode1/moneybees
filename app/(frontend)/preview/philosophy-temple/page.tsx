import PerformanceChart from "@/components/pms-v2/performance-chart";
import { PillarsSection } from "./temple";

/**
 * PREVIEW ONLY. The proposed /our-approach pair: the PMS returns chart, then
 * the six pillars as a line-drawn tholos. Nothing here is linked from the site.
 */
export default function PhilosophyTemplePreview() {
  return (
    <main className="option-one bg-white text-black">
      <PerformanceChart />
      <PillarsSection />
      <div className="h-[40svh]" />
    </main>
  );
}
