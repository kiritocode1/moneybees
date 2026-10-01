"""Check captured geometry and motion against the pinned circle study."""
from pathlib import Path
import json
import math
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]


def result(name):
    envelope = json.loads((HERE / name).read_text())
    assert envelope["success"], envelope
    return envelope["data"]["result"]


hero = result("motion-hero.json")
assert hero["start"] == "2007" and hero["end"] == "2026", hero
assert hero["radiiBeforeScroll"] == ["0px"] * 3, hero

motion = result("motion-circles.json")
svg = ET.parse(ROOT / "reference/visual-language/08/moneybee.svg").getroot()
ns = {"svg": "http://www.w3.org/2000/svg"}
pinned = svg.findall("svg:circle", ns)
assert len(pinned) == len(motion["after"]) == 3
for index, (before, after, source, value) in enumerate(zip(motion["before"], motion["after"], pinned, motion["values"])):
    radius = float(after["r"].removesuffix("px"))
    for coordinate in ("cx", "cy"):
        assert before[coordinate] == after[coordinate]
        assert math.isclose(after[coordinate], float(source.attrib[coordinate]), abs_tol=0.005)
    assert math.isclose(radius, float(source.attrib["r"]), abs_tol=0.005)
    assert math.isclose((radius / 30) ** 2, value / motion["values"][0], abs_tol=0.001)
    assert after["fill"] == source.attrib["fill"]
    assert before["r"] == "0px"
    assert 0 < float(motion["during"][index].removesuffix("px")) < radius
assert sum(disc["fill"] == "#F6A11A" for disc in motion["after"]) == 1

reduced = result("reduced-motion.json")
assert reduced["reduced"] and reduced["yearAnimations"] == reduced["hiddenFigures"] == 0
for radius in reduced["radii"]:
    assert math.isclose(radius["actual"], radius["expected"], abs_tol=0.001)
    assert radius["transition"] == "0s"

mobile = result("mobile-runtime.json")
assert mobile["width"] == mobile["scrollWidth"] == 390
assert mobile["tableRows"] == 8 and mobile["aifRows"] == 5 and mobile["aifUnavailableRows"] == 3
assert mobile["noEmDash"] and mobile["noNortheastArrow"]

print("PASS: pinned circle geometry, proportional areas, one orange disc, fixed centres, interrupted reveal, year endpoints, reduced motion, eight PMS periods, five AIF periods, and 390px overflow check")
