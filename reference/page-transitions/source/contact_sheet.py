"""Contact sheet: python3 contact_sheet.py <video> <out.png> <start_s> <end_s> <step_s> [cols] [thumb_w]
Extracts frames with ffmpeg at exact timestamps and labels each with its video time."""
import subprocess, sys, tempfile, os
from PIL import Image, ImageDraw, ImageFont
video, out, start, end, step = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 4
tw = int(sys.argv[7]) if len(sys.argv) > 7 else 360
font = ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", 15)
tmp = tempfile.mkdtemp()
times, t = [], start
while t <= end + 1e-6:
    times.append(round(t, 3)); t += step
thumbs = []
for i, ts in enumerate(times):
    p = os.path.join(tmp, f"{i:03d}.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ts), "-i", video, "-frames:v", "1", "-vf", f"scale={tw}:-1", p], check=True)
    im = Image.open(p).convert("RGB")
    d = ImageDraw.Draw(im)
    label = f"{ts:.2f}s"
    d.rectangle([0, 0, 70, 20], fill=(0, 0, 0))
    d.text((5, 2), label, fill=(255, 255, 255), font=font)
    thumbs.append(im)
w, h = thumbs[0].size
rows = (len(thumbs) + cols - 1) // cols
pad = 4
sheet = Image.new("RGB", (cols * (w + pad) + pad, rows * (h + pad) + pad), (230, 30, 30))
for i, im in enumerate(thumbs):
    sheet.paste(im, (pad + (i % cols) * (w + pad), pad + (i // cols) * (h + pad)))
sheet.save(out)
print(out, len(thumbs), "frames")
