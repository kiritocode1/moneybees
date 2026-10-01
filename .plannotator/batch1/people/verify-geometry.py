"""Compare rendered figure geometry with the pinned study SVGs, without installing packages."""
import json
import math
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
SVG = {"s": "http://www.w3.org/2000/svg"}
rendered = json.loads((HERE / "rendered-geometry.json").read_text())["data"]["result"]


def points(value):
    return tuple(tuple(float(axis) for axis in pair.split(",")) for pair in value.split())


reference = ET.parse(ROOT / "reference/visual-language/07/moneybee.svg").getroot()
expected_faces = sorted(points(el.attrib["points"]) for el in reference.find("s:g", SVG).findall("s:polygon", SVG))
actual_faces = sorted(points(value) for value in rendered["polygons"])
assert actual_faces == expected_faces, "Application path faces differ from study 07"
assert len(actual_faces) == 9, "Application path must retain all nine measured faces"

posters = ET.parse(ROOT / "reference/visual-language/02/replica.svg").getroot()
expected_rings = posters.find("s:g", SVG).findall("s:circle", SVG)
actual_rings = [(float(cell["x"]), float(cell["y"]), float(cell["r"])) for cell in rendered["culture"]]
assert len(actual_rings) == 12, "Culture needs the original 4 by 3 grid"
errors = []
for ring in expected_rings:
    x = float(ring.attrib["cx"]) - 55.67
    y = float(ring.attrib["cy"]) - 55.89
    radius = float(ring.attrib["r"])
    nearest = min(actual_rings, key=lambda cell: math.hypot(cell[0] - x, cell[1] - y))
    errors.append(math.hypot(nearest[0] - x, nearest[1] - y))
    assert abs(nearest[2] - radius) < 0.001, "Culture ring radius differs from study 02"
assert max(errors) < 0.02, f"Culture centre error: {max(errors)}"

report = {
    "application_path": {"faces": 9, "vertex_error_px": 0, "source": "reference/visual-language/07/moneybee.svg"},
    "culture_grid": {"rings": 12, "max_centre_error_px": round(max(errors), 4), "radius_error_px": 0, "source": "reference/visual-language/02/replica.svg"},
    "deliberate_changes": ["Moneybee palette from brief", "four culture selections", "four application callouts", "responsive callout layout"],
}
(HERE / "geometry-results.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
