# Measure every visible edge of the 06 tower as a least-squares line, then intersect to get vertices.
import json, math, sys
sys.path.insert(0, '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/06')
from edges import *
SRC = '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/06-stacked-blocks.png'
a, cls = load(SRC)
E = {}
def edge(name, xr, yw, A, B):
    pts = []
    for x in xr:
        y = vcross(a, cls, x, yw[0], yw[1], A, B)
        if y is not None:
            pts.append((x + 0.5, y))
    m, c, rms, n = fitline(pts)
    pts = [p for p in pts if abs(p[1] - (m * p[0] + c)) < 1.2]
    m, c, rms, n = fitline(pts)
    E[name] = (m, c)
    print(f'{name:28s} y = {m:+.5f}x {c:+8.2f}  angle {math.degrees(math.atan(m)):+6.2f}°  rms {rms:.3f} n={n} x[{pts[0][0]:.0f},{pts[-1][0]:.0f}]')

def vedge(name, yr, xw, A, B):
    pts = []
    for y in yr:
        x = hcross(a, cls, y, xw[0], xw[1], A, B)
        if x is not None:
            pts.append((x, y + 0.5))
    m, c, rms, n = fitv(pts)
    E[name] = ('v', c)
    print(f'{name:28s} x = {c:.2f} (dx/dy {m:+.5f})  rms {rms:.3f} n={n}')

vedge('left', list(range(180, 330)) + list(range(372, 480)) + list(range(524, 535)), (240, 275), 'P', 'L')
vedge('front', list(range(140, 320)) + list(range(372, 490)) + list(range(525, 550)), (355, 390), 'L', 'S')
vedge('right', list(range(180, 330)) + list(range(372, 480)) + list(range(520, 530)), (470, 505), 'S', 'P')
# block A
edge('A lit top', range(264, 368), (100, 200), 'P', 'L')
edge('A right top', range(380, 484), (100, 200), 'P', 'S')
edge('A lit bottom', range(264, 368), (320, 360), 'L', 'S')
edge('A under back-left', range(262, 326), (340, 362), 'S', 'P')
edge('A under back-right', range(424, 486), (340, 362), 'S', 'P')
# block B
edge('B lit top', range(262, 328), (350, 372), 'P', 'L')
edge('B lit top (center)', range(338, 368), (340, 372), 'S', 'L')
edge('B right top', range(424, 486), (345, 375), 'P', 'S')
edge('B lit bottom', range(262, 350), (480, 505), 'L', 'P')
edge('B right bottom', range(410, 486), (480, 510), 'S', 'P')
# block C (top face visible)
edge('C top back-left', range(262, 350), (495, 520), 'P', 'S')
edge('C top back-right', range(410, 486), (495, 520), 'P', 'S')
edge('C lit top', range(264, 368), (500, 530), 'S', 'L')
edge('C lit bottom', range(262, 340), (535, 565), 'L', 'P')
edge('C right bottom', range(410, 486), (530, 570), 'S', 'P')
# block D
edge('D top back-left', range(262, 340), (550, 580), 'P', 'S')
edge('D top back-right', range(410, 486), (550, 580), 'P', 'S')
edge('D lit top', range(264, 368), (560, 600), 'S', 'L')
edge('D lit bottom', range(264, 368), (580, 620), 'L', 'P')
edge('D right bottom', range(380, 484), (580, 620), 'S', 'P')

def X(e1, e2):
    a1, a2 = E[e1], E[e2]
    if a1[0] == 'v':
        x = a1[1]; return (x, a2[0] * x + a2[1])
    if a2[0] == 'v':
        x = a2[1]; return (x, a1[0] * x + a1[1])
    x = (a2[1] - a1[1]) / (a1[0] - a2[0]); return (x, a1[0] * x + a1[1])
V = {}
for k, (e1, e2) in {
 'A top-left': ('left', 'A lit top'), 'A top-front': ('front', 'A lit top'), 'A top-front(r)': ('front', 'A right top'), 'A top-right': ('right', 'A right top'),
 'A bot-left': ('left', 'A lit bottom'), 'A bot-front': ('front', 'A lit bottom'),
 'A/B left wedge tip': ('A under back-left', 'B lit top'), 'A/B right wedge tip': ('A under back-right', 'B right top'),
 'A under left(start)': ('left', 'A under back-left'), 'A under right(start)': ('right', 'A under back-right'),
 'B top-left': ('left', 'B lit top'), 'B top-front': ('front', 'B lit top'), 'B top-right': ('right', 'B right top'),
 'B bot-left': ('left', 'B lit bottom'), 'B bot-front': ('front', 'B lit bottom'), 'B bot-right': ('right', 'B right bottom'),
 'B/C left wedge tip': ('B lit bottom', 'C top back-left'), 'B/C right wedge tip': ('B right bottom', 'C top back-right'),
 'C topface left': ('left', 'C top back-left'), 'C topface right': ('right', 'C top back-right'),
 'C top-front': ('front', 'C lit top'), 'C top-left': ('left', 'C lit top'),
 'C bot-left': ('left', 'C lit bottom'), 'C bot-front': ('front', 'C lit bottom'), 'C bot-right': ('right', 'C right bottom'),
 'C/D left wedge tip': ('C lit bottom', 'D top back-left'), 'C/D right wedge tip': ('C right bottom', 'D top back-right'),
 'D topface left': ('left', 'D top back-left'), 'D topface right': ('right', 'D top back-right'),
 'D top-front': ('front', 'D lit top'), 'D top-left': ('left', 'D lit top'),
 'D bot-left': ('left', 'D lit bottom'), 'D bot-front': ('front', 'D lit bottom'), 'D bot-front(r)': ('front', 'D right bottom'), 'D bot-right': ('right', 'D right bottom'),
}.items():
    V[k] = X(e1, e2)
    print(f'{k:24s} ({V[k][0]:7.2f}, {V[k][1]:7.2f})')
json.dump({'edges': {k: list(v) for k, v in E.items()}, 'vertices': V}, open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/06/geometry.json', 'w'), indent=1)
