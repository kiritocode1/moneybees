/**
 * Antimetal's four corner marks, drawn on a dashed box. Paths are copied from
 * the pinned source (reference/antimetal/source/index.html): a 7px mark from a
 * 10-unit box, 1.5 stroke, pulled 1px outside the border so it sits on it.
 */
const CORNERS = [
  { style: { top: -1, left: -1 }, d: "M 1.25 10 L 1.25 1.25 L 10 1.25" },
  { style: { top: -1, right: -1 }, d: "M 0 1.25 L 8.75 1.25 L 8.75 10" },
  { style: { bottom: -1, left: -1 }, d: "M 1.25 0 L 1.25 8.75 L 10 8.75" },
  { style: { bottom: -1, right: -1 }, d: "M 8.75 0 L 8.75 8.75 L 0 8.75" },
] as const;

export default function CornerBrackets() {
  return CORNERS.map(({ style, d }) => (
    <span key={d} aria-hidden="true" className="pointer-events-none absolute leading-[0]" style={style}>
      <svg width="7" height="7" viewBox="0 0 10 10" fill="none" overflow="visible">
        <path d={d} stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  ));
}
