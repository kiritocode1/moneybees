import measured from "@/lib/admin/guide-shots.json";

/** A picture scripts/guide-shots.mjs took, and where each control sits on it, as percentages of the picture. */
type GuideShot = { src: string; w: number; h: number; marks: { x: number; y: number; w: number; h: number; side: string }[] };

const SHOTS: Record<string, GuideShot | undefined> = measured;

/** Puts a number 11px outside its control, on the side the script found clear. */
function place({ x, y, w, h, side }: GuideShot["marks"][number]) {
  if (side === "right") return { left: `${x + w}%`, top: `${y + h / 2}%`, transform: "translate(11px, -50%)" };
  if (side === "top") return { left: `${x + w / 2}%`, top: `${y}%`, transform: "translate(-50%, calc(-100% - 9px))" };
  if (side === "bottom") return { left: `${x + w / 2}%`, top: `${y + h}%`, transform: "translate(-50%, 9px)" };
  return { left: `${x}%`, top: `${y + h / 2}%`, transform: "translate(calc(-100% - 11px), -50%)" };
}

/**
 * The Guide's numbered dot, the same on pictures and in the lists beside them.
 * Blue, because the admin's own selected states and step numbers are amber.
 */
export function Marker({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[12px] leading-none font-semibold text-white ${className}`}>
      {n}
    </span>
  );
}

/**
 * A real screen of the admin with its controls ringed and numbered, the
 * number beside the ring rather than on it. `numbers` labels the marks in
 * order (1, 2, 3 by default). Shown at its own size, smaller only when the
 * column is narrower.
 */
export function AnnotatedShot({ id, alt, numbers, className = "" }: { id: string; alt: string; numbers?: readonly number[]; className?: string }) {
  const shot = SHOTS[id];
  if (!shot) return null;
  return (
    <figure className={`relative m-0 w-full ${className}`} style={{ maxWidth: shot.w }}>
      {/* Numbers near an edge may sit just outside the picture, so only the picture is clipped. */}
      <img src={shot.src} alt={alt} width={shot.w} height={shot.h} loading="lazy" className="block h-auto w-full rounded-xl border" />
      {shot.marks.map((mark, index) => (
        <span key={index} aria-hidden="true">
          <span
            className="pointer-events-none absolute rounded-lg border-2 border-[#2563EB] shadow-[0_0_0_2px_rgba(0,0,0,.35)]"
            style={{ left: `calc(${mark.x}% - 5px)`, top: `calc(${mark.y}% - 5px)`, width: `calc(${mark.w}% + 10px)`, height: `calc(${mark.h}% + 10px)` }}
          />
          <span className="absolute" style={place(mark)}>
            <Marker n={numbers?.[index] ?? index + 1} className="shadow-[0_0_0_3px_rgba(0,0,0,.55)]" />
          </span>
        </span>
      ))}
    </figure>
  );
}
