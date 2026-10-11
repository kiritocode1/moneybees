import PerformanceChart from "@/components/pms-v2/performance-chart";
import { PillarsDrawnSection } from "../philosophy-3d/pillars-drawn";

/** PREVIEW ONLY. The proposed /our-approach pair: the PMS returns chart, then the 3D pillars drawn in the site's 2D style. */
export default function PhilosophyDrawnPreview() {
  return (
    <main className="option-one bg-white text-black">
      <PerformanceChart />
      <PillarsDrawnSection />
      <div className="h-[40svh]" />
    </main>
  );
}
