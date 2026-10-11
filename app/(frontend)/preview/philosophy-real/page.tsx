import PerformanceChart from "@/components/pms-v2/performance-chart";
import { FlythroughDrawn } from "../philosophy-3d/flythrough-drawn";

/** PREVIEW ONLY. The fly-through in weathered marble and gilt with a hairline accent. */
export default function PhilosophyRealPreview() {
  return (
    <main className="option-one bg-white text-black">
      <PerformanceChart />
      <FlythroughDrawn look="real" />
      <div className="h-[40svh]" />
    </main>
  );
}
