import { Badge, type BadgeColor } from "@/components/fluid/badge";
import { type Severity, SEVERITY_LABELS } from "@/lib/crm/severity";

const COLOR: Record<Severity, BadgeColor> = { critical: "red", high: "orange", normal: "blue", low: "gray" };

/** Severity as a dot badge: the colour carries the level, the word says it. */
export function SeverityBadge({ severity, size }: { severity: Severity; size?: "default" | "compact" }) {
  return (
    <Badge variant="dot" color={COLOR[severity]} size={size}>
      {SEVERITY_LABELS[severity]}
    </Badge>
  );
}
