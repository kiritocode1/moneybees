# Build 07/replica.svg (original colours) and 07/moneybee.svg (two shaded-face variants side by side)
# from the measured vertices in 07/geometry.json. Model: parallel (dimetric) projection,
# screen(u, v, z) = O + u*U + v*Vv - z*Z with U=(51.5, 19.25), Vv=(-51.6, 19.5), footprint units u,v.
import json, sys
import numpy as np
from PIL import Image
ROOT = '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language'
sys.path.insert(0, f'{ROOT}/05')
from trace import trace
V = {k: tuple(v) for k, v in json.load(open(f'{ROOT}/07/geometry.json'))['vertices'].items()}

def P(*pts):
    return ' '.join(f'{x:.2f},{y:.2f}' for x, y in pts)

colTop = P(V['col top back (0,0,Hc)'], V['col top right (1,0,Hc)'], V['col top front (1,1,Hc)'], V['col top left (0,1,Hc)'])
colLeft = P(V['col top left (0,1,Hc)'], V['col top front (1,1,Hc)'], (350.65, 526.0), (298.96, 506.6))
colRight = P(V['col top right (1,0,Hc)'], V['col top front (1,1,Hc)'], V['col right-face bottom-front (1,1,Ha)'], V['col right-face bottom-back (1,0,Ha)'])
armTop = P(V['col right-face bottom-back (1,0,Ha)'], V['arm top back-end (3,0,Ha)'], V['arm top front-end (3,1,Ha)'], V['col right-face bottom-front (1,1,Ha)'])
armFront = P(V['col right-face bottom-front (1,1,Ha)'], V['arm top front-end (3,1,Ha)'], V['arm ground front-end (3,1,0)'], (350.65, 525.8))
armEnd = P(V['arm top back-end (3,0,Ha)'], V['arm top front-end (3,1,Ha)'], V['arm ground front-end (3,1,0)'], V['arm ground back-end (3,0,0)'])
barTop = P((350.70, 462.6), V['bar top back (2,1,Hb)'], V['bar top front-right (2,1+L,Hb)'], V['bar top front-left (1,1+L,Hb)'])
barEnd = P(V['bar top front-left (1,1+L,Hb)'], V['bar top front-right (2,1+L,Hb)'], V['bar ground front-right (2,1+L,0)'], V['bar ground front-left (1,1+L,0)'])
barLong = P(V['bar top back (2,1,Hb)'], V['bar top front-right (2,1+L,Hb)'], V['bar ground front-right (2,1+L,0)'], V['bar/arm ground (2,1,0)'])

def solid(lit, shade, shade_op=1.0, shadow_d=''):
    """back-to-front: column + arm, then the bar. A translucent shade is knocked out to the page first,
    so black-85% reads as one flat colour instead of letting the orange behind it show through."""
    def sh(pts, d=False):
        attr = f'd="{pts}"' if d else f'points="{pts}"'
        tag = 'path' if d else 'polygon'
        ko = f'<{tag} {attr} fill="#FFFFFF"/>' if shade_op < 1 else ''
        op = f' fill-opacity="{shade_op}"' if shade_op < 1 else ''
        return ko + f'<{tag} {attr} fill="{shade}"{op}/>'
    s = [f'<polygon points="{p}" fill="{lit}"/>' for p in (colTop, colLeft, armTop, armFront)]
    s += [sh(colRight), sh(armEnd)]
    s += [f'<polygon points="{p}" fill="{lit}"/>' for p in (barTop, barEnd)]
    s += [sh(barLong)]
    if shadow_d:
        s += [sh(shadow_d, d=True)]
    return ''.join(s)

LEAD = {'01': (132.2, 424.0, 555.0, 227.34), '03': (438.9, 193.0, 363.7, 402.12), '02': (545.5, 453.0, 536.0, 504.46)}
def leaders(stroke, op):
    return ''.join(f'<path d="M{x:.2f},{y0:.2f} V{y1:.2f} H{xe:.2f}" fill="none" stroke="{stroke}" stroke-opacity="{op}" stroke-width="1"/>'
                   for x, y0, y1, xe in LEAD.values())

# ---------- traced figure + shadow (replica only) ----------
a = np.array(Image.open(f'{ROOT}/07-isometric-block.png').convert('RGB')).astype(float)
fx0, fy0, fx1, fy1 = 256, 464, 318, 526
sub = a[fy0:fy1, fx0:fx1]
mx = sub.max(-1)
cov_fig = np.clip((124 - mx) / (124 - 25), 0, 1)
fig_d = trace(cov_fig, fx0, fy0)
cov_sh = np.clip((223 - sub[..., 0]) / (223 - 124), 0, 1)
yy, xx = np.mgrid[fy0:fy1, fx0:fx1] + 0.5
edge = -0.39382 * xx + 640.33                   # bar long-face top edge
top_back = -0.39347 * xx + 600.48               # bar top back-left silhouette
cov_sh[(yy > edge - 0.6) | (yy < top_back + 0.5)] = 0
shadow_d = trace(cov_sh, fx0, fy0)

body = ['Lorem ipsum dolor sit amet,', 'consectetuer adipiscing elit, sed', 'diam nonummy nibh euismod',
        'tincidunt ut laoreet dolore', 'magna aliquam erat volutpat. Ut', 'wisi enim ad minim veniam, quis']
blen = [56, 64, 61, 54, 65, 65]
def callout(num, nx, tx, top):
    s = [f'<text x="{nx - 1:.1f}" y="{top + 14.5}" font-size="19.6" font-weight="700" letter-spacing="-0.8">{num}</text>',
         f'<text x="{tx - 0.6:.1f}" y="{top + 7.8}" font-size="10.6" font-weight="700" letter-spacing="-0.3" textLength="81" lengthAdjust="spacing">Lorem ipsum dolor</text>']
    for y0 in (top + 22.6, top + 75.8):
        for j, (t, L) in enumerate(zip(body, blen)):
            s.append(f'<text x="{tx}" y="{y0 + 6.72 * j:.2f}" font-size="5.3" fill="#3c3c3c" textLength="{L}" lengthAdjust="spacingAndGlyphs">{t}</text>')
    return ''.join(s)

replica = f'''<svg xmlns="http://www.w3.org/2000/svg" width="736" height="736" viewBox="0 0 736 736">
  <!-- replica of 07-isometric-block.png: faces from measured vertices (07/geometry.json) -->
  <rect width="736" height="736" fill="#F2EFE8"/>
  {leaders('#000', 0.38)}
  {solid('#DF2914', '#7C1F17', 1.0, shadow_d)}
  <path d="{fig_d}" fill="#101416"/>
  <g fill="#111416" font-family="Inter Tight, Helvetica, Arial, sans-serif">
    {callout('03', 428, 457, 165.5)}{callout('01', 120, 148, 395.5)}{callout('02', 533, 561, 429)}
    <text x="145.4" y="176" font-size="14.4" font-weight="600" letter-spacing="-0.3" textLength="101" lengthAdjust="spacing">Business Growth</text>
    <text x="145.8" y="190" font-size="9.3" font-weight="400" textLength="109.5" lengthAdjust="spacing">INFOGRAPHICS TEMPLATE</text>
  </g>
</svg>
'''
open(f'{ROOT}/07/replica.svg', 'w').write(replica)
json.dump({'rects': [[140, 158, 262, 195, 'title'], [420, 158, 560, 280, '03 text'], [112, 388, 245, 516, '01 text'],
                     [525, 422, 650, 543, '02 text'], [256, 464, 318, 526, 'figure + its shadow']]},
          open(f'{ROOT}/07/masks.json', 'w'))

# ---------- moneybee ----------
LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
def mb_callout(num, nx, top, w=104):
    return (f'<text x="{nx}" y="{top + 17}" font-family="Instrument Serif" font-size="24" fill="#000">{num}</text>'
            f'<foreignObject x="{nx + 30}" y="{top - 2}" width="{w}" height="120">'
            f'<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Instrument Serif;font-size:17px;line-height:18px;color:#000;margin:0 0 6px">Lorem ipsum</div>'
            f'<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Rethink Sans;font-size:8px;line-height:11.5px;color:#000;opacity:.72">{LOREM}</div>'
            f'</foreignObject>')

def walker(fx, fy, h, fill='#000'):
    """plain walking silhouette, feet at (fx, fy), height h (head, torso, two straight legs apart)."""
    r = 0.07 * h
    return (f'<g fill="{fill}"><circle cx="{fx + 0.02 * h:.2f}" cy="{fy - h + r:.2f}" r="{r:.2f}"/>'
            f'<rect x="{fx - 0.10 * h:.2f}" y="{fy - 0.82 * h:.2f}" width="{0.22 * h:.2f}" height="{0.40 * h:.2f}" rx="{0.07 * h:.2f}"/>'
            f'<polygon points="{P((fx - 0.09 * h, fy - 0.48 * h), (fx + 0.02 * h, fy - 0.48 * h), (fx - 0.10 * h, fy), (fx - 0.19 * h, fy))}"/>'
            f'<polygon points="{P((fx - 0.02 * h, fy - 0.48 * h), (fx + 0.10 * h, fy - 0.48 * h), (fx + 0.20 * h, fy), (fx + 0.11 * h, fy))}"/></g>')

def shadow(fx, fy, h):
    # cast shadow on the bar top: a parallelogram from the feet along the screen direction (+0.93, +0.37)
    # measured: 1.24 x figure height, 15.5 deg below horizontal, about 5 px wide at h 39.5
    import math
    L = 1.24 * h; w = 0.065 * h
    dx, dy = math.cos(math.radians(15.5)) * L, math.sin(math.radians(15.5)) * L
    return 'M' + P((fx, fy - w), (fx + dx, fy + dy - w), (fx + dx, fy + dy + w), (fx, fy + w)) + 'Z'

def panel(shade, op):
    fx, fy, h = 267.5, 508.5, 39.5     # measured feet position and height (head top 469, feet 508.5)
    return f'''<rect width="736" height="736" fill="#FFFFFF"/>
    {leaders('#9D9EA1', 1)}
    {solid('#F6A11A', shade, op, shadow(fx, fy, h))}
    {walker(fx, fy, h)}
    {mb_callout('03', 426, 166)}{mb_callout('01', 118, 396)}{mb_callout('02', 531, 429)}
    <text x="145" y="178" font-family="Instrument Serif" font-size="28" fill="#000">Lorem ipsum</text>'''

mb = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1472" height="736" viewBox="0 0 1472 736">
  <!-- left: shaded face #8C5E22; right: black at 85% (knocked out to the page) -->
  <g>{panel('#8C5E22', 1.0)}</g>
  <g transform="translate(736 0)">{panel('#000000', 0.85)}</g>
</svg>
'''
open(f'{ROOT}/07/moneybee.svg', 'w').write(mb)
print('ok', len(fig_d), len(shadow_d))
