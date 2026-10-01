# Composite replica of 02-unit8-circles.png: four flat posters at their measured rectangles.
import json, numpy as np
W,H=736,992
P=json.load(open('posters.json'))
P[2]['r']=355.3   # poster 3's right edge sits under a paper-edge highlight at x=356-357
BGS=['#1C1C1C','#181816','#181816','#181816']
WHITE='#E6E6E6'; SW=2.15
ringsP2=json.load(open('p2rings.json')); ringsP4=json.load(open('p4rings.json'))
o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',f'<rect width="{W}" height="{H}" fill="#000"/>']
for k,p in enumerate(P):
    o.append(f'<rect x="{p["l"]:.2f}" y="{p["t"]:.2f}" width="{p["r"]-p["l"]:.2f}" height="{p["b"]-p["t"]:.2f}" fill="{BGS[k]}"/>')
g=f'fill="none" stroke="{WHITE}" stroke-width="{SW}"'
# P1 grid: pitch 59.98 x 60.2, centreline r 28.96, filled discs r 30.05
xs=[116.15,176.13,236.13,296.10]; ys=[165.66,225.98,286.12]
o.append(f'<g {g}>')
for j,y in enumerate(ys):
    for i,x in enumerate(xs):
        if i==1 and j<2: continue
        o.append(f'<circle cx="{x}" cy="{y}" r="28.96"/>')
o.append('</g>')
o.append(f'<circle cx="176.13" cy="165.67" r="30.04" fill="#E4E4E4"/><circle cx="176.13" cy="226.12" r="30.05" fill="#D2D2D2"/>')
# P2 team
o.append(f'<g {g}>'+''.join(f'<circle cx="{c[0]:.2f}" cy="{c[1]:.2f}" r="{c[2]:.2f}"/>' for c in ringsP2)+'</g>')
# P3 cooperation
o.append(f'<g {g}><circle cx="206.11" cy="654.78" r="81.72"/><circle cx="206.12" cy="742.57" r="81.72"/></g>')
# P4 impact: 13 rings, opacity (13-k)/13, drawn back to front
N=len(ringsP4)
# opaque grey strokes (mix of white and poster bg), back to front: overlaps do not add up
def mix(a):
    v=round(0x18+a*(0xE6-0x18)); return f'#{v:02X}{v:02X}{v:02X}'
o.append('<g fill="none" stroke-width="2.15">'+''.join(f'<circle cx="{c[0]:.2f}" cy="{c[1]:.2f}" r="{c[2]:.2f}" stroke="{mix((N-k)/N)}"/>' for k,c in reversed(list(enumerate(ringsP4))))+'</g>')
# text, poster-local
words={0:['building','blocks'],1:['team'],2:['cooperation'],3:['impact']}
ls={0:-0.9,1:-0.9,2:-0.9,3:-0.9}
for k,p in enumerate(P):
    l,t=p['l'],p['t']; w=p['r']-p['l']
    o.append(f'<g transform="translate({l:.2f} {t:.2f})" fill="{WHITE}" font-family="Inter">')
    o.append(f'<text x="20.2" y="32.2" font-size="15.6" font-weight="600" letter-spacing="-0.2">Unit8.</text>')
    o.append(f'<text x="{w-19.2:.2f}" y="28.3" font-size="6.2" text-anchor="end">digital natives</text>')
    o.append(f'<text transform="translate({w-22.1:.2f} 391.6) rotate(-90)" font-size="6.2">unit8.com</text>')
    lines=words[k]
    for i,wd in enumerate(lines):
        y=391.6-45.9*(len(lines)-1-i)
        o.append(f'<text x="19.6" y="{y:.2f}" font-size="42.2" font-weight="500" letter-spacing="{ls[k]}">{wd}</text>')
    o.append('</g>')
o.append('</svg>')
open('../replica.svg','w').write('\n'.join(o))
