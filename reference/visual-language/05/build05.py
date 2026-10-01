# Build 05/replica.svg (original colours) from the measured model in global_fit.json.
import json, sys
import numpy as np
from PIL import Image
sys.path.insert(0, '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/05')
from trace import trace
ROOT = '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language'
G = json.load(open(f'{ROOT}/05/global_fit.json'))['model']
VARIANT = sys.argv[1] if len(sys.argv) > 1 else 'k'
STROKE = float(sys.argv[2]) if len(sys.argv) > 2 else 1.26

x0, y0, d, cx, yc, k, ex = (G[n] for n in ['x0', 'y0', 'd', 'cx', 'yc', 'k', 'ex'])
if VARIANT == 'k0':
    w = json.load(open(f'{ROOT}/05/global_fit.json'))['k0_model']
    x0, y0, d, cx, yc, ex = w; k = 0.0

curves = []
for i in range(12):
    yi = y0 + i * d
    curves.append(f'<path d="M{x0:.2f},{yi:.2f} Q{cx:.2f},{yc + k * (yi - yc):.2f} {ex:.2f},{yc:.2f}"/>')

# figure + shadow silhouette traced from the original (masked out of the metrics)
a = np.array(Image.open(f'{ROOT}/05-converging-lines.png').convert('RGB')).astype(float)
Y = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
fx0, fy0, fx1, fy1 = 552, 328, 646, 394
cov = np.clip((239 - Y[fy0:fy1, fx0:fx1]) / (239 - 16), 0, 1)
fig_d = trace(cov, fx0, fy0)

hz0, hz1 = 470.0, 632.0
def off(x):
    return (x - hz0) / (hz1 - hz0)

body = ['Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod',
        'tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis',
        'nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod',
        'tincidunt ut laoreet dolore']
body_base = [255.0, 261.0, 267.0, 277.0, 283.0]
body_len = [154, 153, 152, 153, 44]
steps = []
for i in range(4):
    dy = 77 * i
    steps.append(f'<text x="97.2" y="{253 + dy}" font-size="16.5" font-weight="700" letter-spacing="-0.6">0{i+1}</text>')
    steps.append(f'<text x="121.6" y="{248.2 + dy}" font-size="9.7" font-weight="700" letter-spacing="-0.25" textLength="67.5" lengthAdjust="spacing">Lorem ipsum dolor</text>')
    for t, b, L in zip(body, body_base, body_len):
        steps.append(f'<text x="122" y="{b + dy}" font-size="4.5" fill="#4a4a4a" textLength="{L}" lengthAdjust="spacingAndGlyphs">{t}</text>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="736" height="736" viewBox="0 0 736 736">
  <!-- replica of 05-converging-lines.png, geometry from 05/global_fit.json (12 quadratic Beziers, one family) -->
  <defs>
    <linearGradient id="hz" gradientUnits="userSpaceOnUse" x1="{hz0}" y1="0" x2="{hz1}" y2="0">
      <stop offset="0" stop-color="#DF2914" stop-opacity="0.95"/>
      <stop offset="{off(526):.3f}" stop-color="#DF2914" stop-opacity="0.95"/>
      <stop offset="{off(558):.3f}" stop-color="#DF2914" stop-opacity="0.53"/>
      <stop offset="{off(614):.3f}" stop-color="#DF2914" stop-opacity="0.53"/>
      <stop offset="1" stop-color="#DF2914" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="736" height="736" fill="#F2EFE8"/>
  <g fill="#111416" font-family="Inter Tight, Helvetica, Arial, sans-serif">
    <text x="119.6" y="145" font-size="20.6" font-weight="700" letter-spacing="-0.55" textLength="126.5" lengthAdjust="spacing">Project Steps</text>
    <text x="120.2" y="165" font-size="13.8" font-weight="400" textLength="172" lengthAdjust="spacing">INFOGRAPHICS TEMPLATE</text>
    {"".join(steps)}
  </g>
  <line x1="{hz0}" y1="{yc:.2f}" x2="{hz1}" y2="{yc:.2f}" stroke="url(#hz)" stroke-width="1"/>
  <g fill="none" stroke="#DF2914" stroke-width="{STROKE}">
    {"".join(curves)}
  </g>
  <path d="{fig_d}" fill="#101416"/>
</svg>
'''
open(f'{ROOT}/05/replica.svg', 'w').write(svg)
json.dump({'rects': [[112, 122, 300, 172, 'title'], [552, 326, 646, 394, 'figure+shadow']] +
           [[92, 236 + 77 * i, 286, 290 + 77 * i, f'step {i+1} text'] for i in range(4)]},
          open(f'{ROOT}/05/masks.json', 'w'))
print('wrote replica.svg', VARIANT, STROKE, 'figure path chars', len(fig_d))
