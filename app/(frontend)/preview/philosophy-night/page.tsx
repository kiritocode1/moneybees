import PerformanceChart from "@/components/pms-v2/performance-chart";
import { FlythroughNight } from "../philosophy-3d/flythrough-night";

/** PREVIEW ONLY. The proposed /our-approach pair: the PMS returns chart, then the fly-through on black. */
export default function PhilosophyNightPreview() {
  return (
    <main className="option-one bg-white text-black">
      <PerformanceChart />
      <FlythroughNight />
      <div className="h-[40svh]" />
    </main>
  );
}
