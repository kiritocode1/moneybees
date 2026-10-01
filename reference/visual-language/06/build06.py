# Build 06/replica.svg (original colours) and 06/moneybee.svg (two shaded-face variants side by side)
# from the measured vertices in 06/geometry.json.
import json, sys
import numpy as np
from PIL import Image
ROOT = '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language'
sys.path.insert(0, f'{ROOT}/05')
from trace import trace
G = json.load(open(f'{ROOT}/06/geometry.json'))
V = {k: tuple(v) for k, v in G['vertices'].items()}
XL, XF, XR = 257.42, 373.24, 489.02          # left, front and right vertical edges

def under_back(e1, e2):
    (m1, c1), (m2, c2) = G['edges'][e1], G['edges'][e2]
    x = (c2 - c1) / (m1 - m2); return (x, m1 * x + c1)

# per block: y at the left edge, front edge and right edge for the top and bottom horizontal outlines
B = {
 'A': dict(top=(V['A top-left'][1], V['A top-front'][1], V['A top-right'][1]),
           bot=(V['A bot-left'][1], V['A bot-front'][1], V['A under right(start)'][1]),
           cap=('under', under_back('A under back-left', 'A under back-right'))),
 'B': dict(top=(366.45, 351.15, 366.26), bot=(V['B bot-left'][1], V['B bot-front'][1], V['B bot-right'][1]), cap=None),
 'C': dict(top=(508.10, V['C top-front'][1], V['C topface right'][1]),
           bot=(V['C bot-left'][1], V['C bot-front'][1], V['C bot-right'][1]),
           cap=('top', under_back('C top back-left', 'C top back-right'))),
 'D': dict(top=(567.30, V['D top-front'][1], V['D topface right'][1]),
           bot=(V['D bot-left'][1], V['D bot-front'][1], V['D bot-right'][1]),
           cap=('top', under_back('D top back-left', 'D top back-right'))),
}
ORDER = ['D', 'C', 'A', 'B']   # painter's order: B overlaps A's underside and C's top face

def P(*pts):
    return ' '.join(f'{x:.2f},{y:.2f}' for x, y in pts)

def block_faces(b):
    """returns (shaded polygon points, lit polygon points) for one block."""
    t, bo, cap = B[b]['top'], B[b]['bot'], B[b]['cap']
    lit_face = P((XL, t[0]), (XF, t[1]), (XF, bo[1]), (XL, bo[0]))
    if cap and cap[0] == 'under':      # right face + underside (seen from below) as one outline
        shade = P((XF, t[1]), (XR, t[2]), (XR, bo[2]), cap[1], (XL, bo[0]), (XF, bo[1]))
    elif cap and cap[0] == 'top':      # top face (seen from above) + right face as one outline
        shade = P((XL, t[0]), cap[1], (XR, t[2]), (XR, bo[2]), (XF, bo[1]), (XF, t[1]))
    else:
        shade = P((XF, t[1]), (XR, t[2]), (XR, bo[2]), (XF, bo[1]))
    return shade, lit_face

def tower(lit, shade, shade_op=1.0):
    # every shaded face sits behind every lit face of the blocks it overlaps, so all shaded outlines go in
    # one group (group opacity: a translucent shade never double-darkens) and the lit faces paint on top.
    faces = [block_faces(b) for b in ORDER]
    g = f'<g fill="{shade}"' + (f' opacity="{shade_op}"' if shade_op < 1 else '') + '>'
    g += ''.join(f'<polygon points="{s_}"/>' for s_, _ in faces) + '</g>'
    g += f'<g fill="{lit}">' + ''.join(f'<polygon points="{l_}"/>' for _, l_ in faces) + '</g>'
    return g

# leaders (measured centrelines): vertical under the numeral, elbow, horizontal to the block edge
LEAD = {'03': (132.2, 205.5, 376.0, XL), '01': (132.2, 446.5, 576.85, XL),
        '04': (533.8, 201.0, 283.4, XR), '02': (533.8, 442.5, 524.9, XR)}
def leaders(stroke, op, w=1):
    return ''.join(f'<path d="M{x:.2f},{y0:.2f} V{y1:.2f} H{xe:.2f}" fill="none" stroke="{stroke}" stroke-opacity="{op}" stroke-width="{w}"/>'
                   for x, y0, y1, xe in LEAD.values())

# ---------- replica ----------
a = np.array(Image.open(f'{ROOT}/06-stacked-blocks.png').convert('RGB')).astype(float)
Y = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
fx0, fy0, fx1, fy1 = 324, 94, 346, 139
sub = a[fy0:fy1, fx0:fx1]
cov = np.clip((239 - Y[fy0:fy1, fx0:fx1]) / (239 - 16), 0, 1)
cov[(sub[..., 0] - sub[..., 1]) > 50] = 0
fig_d = trace(cov, fx0, fy0)

body = ['Lorem ipsum dolor sit amet,', 'consectetuer adipiscing elit, sed', 'diam nonummy nibh euismod',
        'tincidunt ut laoreet dolore', 'magna aliquam erat volutpat. Ut', 'wisi enim ad minim veniam, quis']
blen = [57, 63, 61, 53, 65, 65]
def callout(num, nx, tx, top):
    s = [f'<text x="{nx - 1:.1f}" y="{top + 15}" font-size="20.6" font-weight="700" letter-spacing="-0.8">{num}</text>',
         f'<text x="{tx - 0.6:.1f}" y="{top + 7.8}" font-size="10.6" font-weight="700" letter-spacing="-0.3" textLength="81" lengthAdjust="spacing">Lorem ipsum dolor</text>']
    for p, y0 in enumerate((top + 22.8, top + 76.4)):
        for j, (t, L) in enumerate(zip(body, blen)):
            s.append(f'<text x="{tx}" y="{y0 + 6.72 * j:.2f}" font-size="5.3" fill="#3c3c3c" textLength="{L}" lengthAdjust="spacingAndGlyphs">{t}</text>')
    return ''.join(s)

replica = f'''<svg xmlns="http://www.w3.org/2000/svg" width="736" height="736" viewBox="0 0 736 736">
  <!-- replica of 06-stacked-blocks.png: faces from measured vertices (06/geometry.json) -->
  <rect width="736" height="736" fill="#F2EFE8"/>
  {leaders('#000', 0.38)}
  {tower('#DF2914', '#7C1F17')}
  <path d="{fig_d}" fill="#101416"/>
  <g fill="#111416" font-family="Inter Tight, Helvetica, Arial, sans-serif">
    {callout('03', 120, 149, 178)}{callout('04', 521, 550, 178)}{callout('01', 120, 149, 418)}{callout('02', 521, 550, 418)}
    <text x="551" y="657" font-size="13.8" font-weight="600" letter-spacing="-0.3" textLength="125" lengthAdjust="spacing">Business Growth and</text>
    <text x="551" y="674" font-size="13.8" font-weight="600" letter-spacing="-0.3" textLength="61.5" lengthAdjust="spacing">Scalability</text>
    <text x="551.6" y="689" font-size="10" font-weight="400" textLength="108.5" lengthAdjust="spacing">INFOGRAPHICS TEMPLATE</text>
  </g>
</svg>
'''
open(f'{ROOT}/06/replica.svg', 'w').write(replica)
json.dump({'rects': [[114, 172, 242, 292, '03 text'], [515, 172, 642, 292, '04 text'], [114, 412, 242, 532, '01 text'],
                     [515, 412, 642, 532, '02 text'], [545, 640, 700, 695, 'title'], [324, 94, 346, 139, 'figure']]},
          open(f'{ROOT}/06/masks.json', 'w'))

# ---------- moneybee (two panels: shade #8C5E22 | black 85%) ----------
LABELS = {'01': 'Liquidity risk', '02': 'Valuation risk', '03': 'Market risk', '04': 'Concentration risk'}
LOREM = ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore '
         'et dolore magna aliqua.')
def mb_callout(num, nx, top, align_right=False):
    # numeral in Instrument Serif, label in Instrument Serif, body in Rethink Sans (HTML for wrapping)
    return (f'<text x="{nx}" y="{top + 17}" font-family="Instrument Serif" font-size="24" fill="#000">{num}</text>'
            f'<foreignObject x="{nx + 30}" y="{top - 2}" width="{96 if nx < 300 else 110}" height="120">'
            f'<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Instrument Serif;font-size:17px;line-height:18px;color:#000;margin:0 0 6px">{LABELS[num]}</div>'
            f'<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Rethink Sans;font-size:8px;line-height:11.5px;color:#000;opacity:.72">{LOREM}</div>'
            f'</foreignObject>')

def silhouette(fx, fy, h, fill='#000'):
    """plain standing figure, feet centred at (fx, fy), height h."""
    r = 0.07 * h
    return (f'<g fill="{fill}"><circle cx="{fx:.2f}" cy="{fy - h + r:.2f}" r="{r:.2f}"/>'
            f'<rect x="{fx - 0.12 * h:.2f}" y="{fy - 0.82 * h:.2f}" width="{0.24 * h:.2f}" height="{0.40 * h:.2f}" rx="{0.07 * h:.2f}"/>'
            f'<rect x="{fx - 0.11 * h:.2f}" y="{fy - 0.50 * h:.2f}" width="{0.10 * h:.2f}" height="{0.50 * h:.2f}"/>'
            f'<rect x="{fx + 0.01 * h:.2f}" y="{fy - 0.50 * h:.2f}" width="{0.10 * h:.2f}" height="{0.50 * h:.2f}"/></g>')

def panel(shade, op):
    return f'''<rect width="736" height="736" fill="#FFFFFF"/>
    {leaders('#9D9EA1', 1)}
    {tower('#F6A11A', shade, op)}
    {silhouette(335.0, 138.4, 38)}
    {mb_callout('03', 118, 178)}{mb_callout('04', 519, 178)}{mb_callout('01', 118, 418)}{mb_callout('02', 519, 418)}
    <text x="551" y="672" font-family="Instrument Serif" font-size="28" fill="#000">Risk management</text>'''

mb = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1472" height="736" viewBox="0 0 1472 736">
  <!-- left: shaded face #8C5E22 (red lit->shade OKLCH relation applied to #F6A11A); right: black at 85% -->
  <g>{panel('#8C5E22', 1.0)}</g>
  <g transform="translate(736 0)">{panel('#000000', 0.85)}</g>
</svg>
'''
open(f'{ROOT}/06/moneybee.svg', 'w').write(mb)
print('ok')
