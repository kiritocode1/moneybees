# Builds the self-contained deck from template.html by inlining every image as a data URI.
import base64, pathlib
d = pathlib.Path(__file__).parent
root = d.parents[1]
s = (d / "template.html").read_text()
images = {
    "HOME": ("home.jpg", "image/jpeg"), "PMS": ("pms.jpg", "image/jpeg"),
    "INVESTOR": ("investor.jpg", "image/jpeg"), "CONTACT": ("contact.jpg", "image/jpeg"),
    "COVER_HOME": ("cover-home.jpg", "image/jpeg"), "COVER_PMS": ("cover-pms.jpg", "image/jpeg"),
    "COVER_ABOUT": ("cover-about.jpg", "image/jpeg"),
    "LOGO": (str(root / "public/moneybee-logo.svg"), "image/svg+xml"),
}
for key, (name, mime) in images.items():
    data = base64.b64encode((d / name).read_bytes()).decode()
    s = s.replace("{{" + key + "}}", f"data:{mime};base64,{data}")
assert "{{" not in s, "unfilled placeholder"
(root / "Moneybee-progress-update-08-Oct-2026.html").write_text(s)
print("built", len(s) // 1024, "KB")
