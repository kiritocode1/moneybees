/** Unit corners of a pointy-top hexagon, starting at the top and going clockwise. */
const CORNERS = Array.from({ length: 6 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * Math.PI) / 3;
  return [Math.cos(angle), Math.sin(angle)] as const;
});

/**
 * Traces a pointy-top hexagon of circumradius `r` centred on (x, y) onto the
 * current path; call `beginPath()` first and `fill()` or `stroke()` after.
 * The footer's dot lettering draws its cells with this, on a honeycomb lattice.
 */
export function hexagon(context: CanvasRenderingContext2D, x: number, y: number, r: number) {
  CORNERS.forEach(([cx, cy], i) => {
    if (i === 0) context.moveTo(x + cx * r, y + cy * r);
    else context.lineTo(x + cx * r, y + cy * r);
  });
  context.closePath();
}

/** Rows of a honeycomb sit closer than its columns: sin(60°) of the cell pitch. */
export const ROW_PITCH = Math.sqrt(3) / 2;
