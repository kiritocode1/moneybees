# Measure every visible edge of the 07 solid (least squares), intersect into vertices.
import json, math, sys
sys.path.insert(0, '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/06')
from edges import *
SRC = '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/07-isometric-block.png'
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
    print(f'{name:30s} y = {m:+.5f}x {c:+8.2f}  angle {math.degrees(math.atan(m)):+6.2f}°  rms {rms:.3f} n={n}')
def vedge(name, yr, xw, A, B):
    pts = []
    for y in yr:
        x = hcross(a, cls, y, xw[0], xw[1], A, B)
        if x is not None:
            pts.append((x, y + 0.5))
    m, c, rms, n = fitv(pts)
    E[name] = ('v', c)
    print(f'{name:30s} x = {c:.2f} (dx/dy {m:+.5f})  rms {rms:.3f} n={n}')

edge('col top back-left (v)', range(303, 348), (270, 305), 'P', 'L')
edge('col top back-right (u)', range(354, 399), (270, 305), 'P', 'L')
edge('col top front-right (v)', range(355, 399), (290, 325), 'L', 'S')
edge('col right-face bottom (v)', range(355, 399), (380, 415), 'S', 'L')
vedge('col left vertical', range(305, 470), (285, 315), 'P', 'L')
vedge('col front vertical', range(322, 402), (340, 365), 'L', 'S')
vedge('col right vertical', range(302, 386), (390, 415), 'S', 'P')
edge('arm top back (u)', range(406, 500), (380, 440), 'P', 'L')
edge('arm end top (v)', range(457, 501), (420, 455), 'L', 'S')
edge('arm end bottom (v)', range(457, 501), (535, 570), 'S', 'P')
vedge('arm end left vertical', range(452, 540), (440, 465), 'L', 'S')
vedge('arm end right vertical', range(432, 542), (490, 515), 'S', 'P')
edge('arm front bottom (u)', range(405, 450), (535, 570), 'L', 'P')
vedge('bar long-face right vertical', range(486, 540), (390, 415), 'S', 'L')
edge('bar long bottom (v)', range(282, 399), (540, 600), 'S', 'P')
edge('bar long top (v)', range(325, 399), (475, 535), 'L', 'S')
vedge('bar end left vertical', range(512, 570), (215, 240), 'P', 'L')
vedge('bar end/long vertical', range(535, 585), (268, 290), 'L', 'S')
edge('bar end bottom (u)', range(231, 276), (565, 600), 'L', 'P')
edge('bar top back-left (v)', range(231, 296), (480, 515), 'P', 'L')

def X(e1, e2):
    a1, a2 = E[e1], E[e2]
    if a1[0] == 'v':
        x = a1[1]; return (x, a2[0] * x + a2[1])
    if a2[0] == 'v':
        x = a2[1]; return (x, a1[0] * x + a1[1])
    x = (a2[1] - a1[1]) / (a1[0] - a2[0]); return (x, a1[0] * x + a1[1])
V = {}
for k, (e1, e2) in {
 'col top back (0,0,Hc)': ('col top back-left (v)', 'col top back-right (u)'),
 'col top left (0,1,Hc)': ('col left vertical', 'col top back-left (v)'),
 'col top right (1,0,Hc)': ('col right vertical', 'col top back-right (u)'),
 'col top front (1,1,Hc)': ('col front vertical', 'col top front-right (v)'),
 'col right-face bottom-front (1,1,Ha)': ('col front vertical', 'col right-face bottom (v)'),
 'col right-face bottom-back (1,0,Ha)': ('col right vertical', 'col right-face bottom (v)'),
 'arm top back-end (3,0,Ha)': ('arm end right vertical', 'arm top back (u)'),
 'arm top back-end via v (3,0,Ha)': ('arm end right vertical', 'arm end top (v)'),
 'arm top front-end (3,1,Ha)': ('arm end left vertical', 'arm end top (v)'),
 'arm ground back-end (3,0,0)': ('arm end right vertical', 'arm end bottom (v)'),
 'arm ground front-end (3,1,0)': ('arm end left vertical', 'arm end bottom (v)'),
 'arm ground front-end via u': ('arm end left vertical', 'arm front bottom (u)'),
 'bar/arm ground (2,1,0)': ('bar long-face right vertical', 'bar long bottom (v)'),
 'bar/arm ground via u': ('bar long-face right vertical', 'arm front bottom (u)'),
 'bar top back (2,1,Hb)': ('bar long-face right vertical', 'bar long top (v)'),
 'bar top front-right (2,1+L,Hb)': ('bar end/long vertical', 'bar long top (v)'),
 'bar ground front-right (2,1+L,0)': ('bar end/long vertical', 'bar long bottom (v)'),
 'bar ground front-left (1,1+L,0)': ('bar end left vertical', 'bar end bottom (u)'),
 'bar top front-left (1,1+L,Hb)': ('bar end left vertical', 'bar top back-left (v)'),
 'bar top meets col (1,1,Hb)': ('col left vertical', 'bar top back-left (v)'),
}.items():
    V[k] = X(e1, e2)
    print(f'{k:40s} ({V[k][0]:7.2f}, {V[k][1]:7.2f})')
json.dump({'edges': {k: list(v) for k, v in E.items()}, 'vertices': V}, open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/07/geometry.json', 'w'), indent=1)
