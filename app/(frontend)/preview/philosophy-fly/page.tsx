import PerformanceChart from "@/components/pms-v2/performance-chart";
import { FlythroughDrawn } from "../philosophy-3d/flythrough-drawn";

/** PREVIEW ONLY. The proposed /our-approach pair: the PMS returns chart, then the fly-through, weathered and drawn in hairline. */
export default function PhilosophyFlyPreview() {
  return (
    <main className="option-one bg-white text-black">
      <PerformanceChart />
      <FlythroughDrawn />
      <div className="h-[40svh]" />
    </main>
  );
}
