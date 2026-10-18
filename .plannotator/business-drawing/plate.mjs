/*
 * Preview prototype of the plate renderer (not production code). A plate is
 * what the AI would return: shapes on a 240x150 canvas, each with a role.
 * The renderer owns every style decision, so any plate reads like the
 * hand-made drawings in components/case-studies/drawings.tsx.
 *   construction  faint dashed hairline, there at rest
 *   line          ink stroke that draws itself on, in order
 *   solid         hatched fill with an ink outline, fades in
 *   accent        orange, lands last (stroke for paths, fill for shapes)
 *   flow          orange dashes moving along a path, once drawn
 */
const ORANGE = "#F6A11A";
const PATH = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;
const ROLES = new Set(["construction", "line", "solid", "accent", "flow"]);

export function validate(plate) {
  const problems = [];
  if (!Array.isArray(plate.parts) || plate.parts.length < 4 || plate.parts.length > 60) problems.push("4 to 60 parts");
  for (const [i, part] of (plate.parts ?? []).entries()) {
    if (part.type === "label") {
      if (!/^[A-Z0-9 ·&/.-]{1,18}$/.test(part.text ?? "")) problems.push(`part ${i}: label text`);
      continue;
    }
    if (!ROLES.has(part.role)) problems.push(`part ${i}: role`);
    if (part.type === "path" && !PATH.test(part.d ?? "")) problems.push(`part ${i}: path data`);
    for (const key of ["x", "y", "cx", "cy"]) if (key in part && !(part[key] >= -10 && part[key] <= 250)) problems.push(`part ${i}: ${key} off the plate`);
  }
  return problems;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function shape(part, attrs) {
  const a = Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(" ");
  if (part.type === "path") return `<path d="${esc(part.d)}" ${a}/>`;
  if (part.type === "circle") return `<circle cx="${part.cx}" cy="${part.cy}" r="${part.r}" ${a}/>`;
  if (part.type === "ellipse") return `<ellipse cx="${part.cx}" cy="${part.cy}" rx="${part.rx}" ry="${part.ry}" ${a}/>`;
  if (part.type === "rect") return `<rect x="${part.x}" y="${part.y}" width="${part.w}" height="${part.h}" ${a}/>`;
  return "";
}

/** The plate as an SVG string. Delays follow the order: lines in sequence, solids alongside, accents and flows last. */
export function render(plate, id = "p") {
  const ink = "#000";
  let lineAt = 0;
  const lines = plate.parts.filter((p) => p.role === "line").length;
  const accentStart = 200 + lines * 140;
  let accentAt = accentStart;
  const body = plate.parts.map((part) => {
    if (part.type === "label") {
      return `<text x="${part.x}" y="${part.y}" text-anchor="${part.anchor ?? "middle"}" font-size="6.4" fill="${ink}" fill-opacity=".65" font-family="ui-monospace, Menlo, monospace" letter-spacing=".12em">${esc(part.text)}</text>`;
    }
    switch (part.role) {
      case "construction":
        return shape(part, { fill: "none", stroke: ink, "stroke-width": ".5", "stroke-opacity": ".4", "stroke-dasharray": "2 2" });
      case "line": {
        const delay = 150 + lineAt++ * 140;
        return shape(part, { class: "draw", fill: "none", stroke: ink, "stroke-width": part.weight === "bold" ? "1.2" : ".9", pathLength: "1", style: `transition-delay:${delay}ms` });
      }
      case "solid":
        return shape(part, { class: "fade", fill: `url(#${id}-hatch)`, stroke: ink, "stroke-width": ".9", style: `transition-delay:${150 + lineAt * 140}ms` });
      case "accent": {
        const delay = accentAt;
        accentAt += 120;
        return part.type === "path" && !part.filled
          ? shape(part, { class: "draw", fill: "none", stroke: ORANGE, "stroke-width": "2.2", "stroke-linecap": "round", pathLength: "1", style: `transition-delay:${delay}ms` })
          : shape(part, { class: "fade", fill: ORANGE, stroke: ink, "stroke-width": ".6", style: `transition-delay:${delay}ms` });
      }
      case "flow":
        return shape(part, { class: "flow", fill: "none", stroke: ORANGE, "stroke-width": "2.2", "stroke-dasharray": "4 8", style: `transition-delay:${accentStart}ms` });
    }
    return "";
  }).join("\n");
  return `<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
<defs><pattern id="${id}-hatch" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="2.2" stroke="${ink}" stroke-width=".55" stroke-opacity=".6"/></pattern></defs>
${body}
</svg>`;
}
