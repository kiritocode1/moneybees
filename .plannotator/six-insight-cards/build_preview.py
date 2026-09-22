from pathlib import Path
from math import cos, sin, pi

W, H = 1428, 1166
CARD_W, CARD_H = 450, 561
positions = [(0,0),(489,0),(978,0),(0,605),(489,605),(978,605)]
titles = ["Wealth comparison","Research selection","Historical picks","Business growth","Risk &amp; process","Fund allocation"]

out = [f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
<radialGradient id="glow"><stop stop-color="#eb5a3c" stop-opacity=".62"/><stop offset=".45" stop-color="#eb5a3c" stop-opacity=".18"/><stop offset="1" stop-color="#eb5a3c" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#eb5a3c" stop-opacity=".58"/><stop offset="1" stop-color="#eb5a3c" stop-opacity=".05"/></linearGradient>
<style>.card{{fill:#1b1b1e}}.title{{fill:#e4e0da;font:700 34px Arial,sans-serif;letter-spacing:-.7px}}.idx{{fill:#e4e0da;fill-opacity:.34;font:13px monospace;letter-spacing:1px}}.label{{fill:#e4e0da;fill-opacity:.48;font:11px monospace;letter-spacing:.5px}}.line{{fill:none;stroke:#f0d6c8;stroke-opacity:.5;stroke-width:1.15;stroke-linejoin:round}}.dim{{fill:none;stroke:#f0d6c8;stroke-opacity:.25;stroke-width:1}}.face{{fill:#232327;stroke:#f0d6c8;stroke-opacity:.5;stroke-width:1.1}}.face2{{fill:#1d1d21;stroke:#f0d6c8;stroke-opacity:.42;stroke-width:1.1}}.hot{{fill:#eb5a3c;stroke:#eb5a3c;stroke-width:1.1}}.wall{{fill:#b8422a;stroke:#b8422a;stroke-width:1.1}}.dot{{fill:#eb5a3c}}.speck{{fill:#f0d6c8;fill-opacity:.27}}.mark{{fill:none;stroke:#e4e0da;stroke-opacity:.55;stroke-width:1.5}}</style>
<g id="marks"><path class="mark" d="M53 144v-14h14M383 130h14v14M53 495v14h14M383 509h14v-14"/></g>
<g id="specks"><circle class="speck" cx="89" cy="211" r="1"/><circle class="speck" cx="155" cy="306" r="1"/><circle class="speck" cx="344" cy="263" r="1.5"/><circle class="speck" cx="268" cy="438" r="1"/><circle class="speck" cx="104" cy="454" r="1"/><circle class="speck" cx="374" cy="390" r="1"/><circle class="speck" cx="316" cy="181" r="1"/></g>
</defs><rect width="{W}" height="{H}" fill="#28282a"/>''']

def begin(i):
    x,y=positions[i]
    out.append(f'<g transform="translate({x} {y})"><path class="card" d="M14 0H436L450 14V547L436 561H14L0 547V14Z"/><use href="#marks"/><use href="#specks"/><text class="title" x="54" y="80">{titles[i]}</text><text class="idx" x="370" y="78">{i+4:03d}</text>')

def end(): out.append('</g>')

def diamond(cx,cy,rx,ry,cls='face'):
    return f'<path class="{cls}" d="M{cx} {cy-ry}L{cx+rx} {cy}L{cx} {cy+ry}L{cx-rx} {cy}Z"/>'

def slab(cx,cy,rx,ry,depth,top='face',side='face2'):
    return f'<path class="{side}" d="M{cx-rx} {cy}L{cx} {cy+ry}L{cx+rx} {cy}V{cy+depth}L{cx} {cy+ry+depth}L{cx-rx} {cy+depth}Z"/>'+diamond(cx,cy,rx,ry,top)

# Wealth, measured plate stacks
begin(0)
out.append('<ellipse class="line" cx="225" cy="446" rx="150" ry="51" stroke-dasharray="2 9"/><ellipse cx="145" cy="372" rx="72" ry="46" fill="url(#glow)"/>')
for j in range(13):
    cy=438-j*12
    out.append(slab(145,cy,39,14,5,'hot' if j==12 else 'face','wall' if j>=8 else 'face2'))
for j in range(4): out.append(slab(302,438-j*12,35,12,5,'face','face2'))
out.append('<path class="line" d="M191 294h18v109h-18M258 403h-18"/><text class="idx" x="214" y="344">4.83×</text><text class="label" x="109" y="475">₹2.885 cr</text><text class="label" x="276" y="475">₹59.7 L</text>')
end()

# Research, six suspended narrowing planes
begin(1)
out.append('<g transform="translate(225 205)"><path d="M0 8V272" stroke="url(#beam)" stroke-width="22"/>')
counts=[11,8,6,4,3,1]
for s,(rx,cy) in enumerate(zip([132,108,86,66,48,29],[18,66,113,158,201,242])):
    ry=rx*.35
    out.append(diamond(0,cy,rx,ry,'line'))
    n=counts[s]
    for j in range(n):
        px=(j-(n-1)/2)*min(17,rx*1.5/max(1,n))
        py=cy+((j%2)*2-1)*3
        out.append(f'<circle class="{"dot" if s==3 and j==n//2 else "speck"}" cx="{px:.1f}" cy="{py:.1f}" r="{6 if s==3 and j==n//2 else 2}"/>')
out.append('<circle r="52" fill="url(#glow)" cy="158"/><circle class="dot" r="9" cy="158"/><text class="label" x="-150" y="22">~6,000</text><text class="label" x="50" y="248">~20</text></g>')
end()

# Five-tier pyramid
begin(2)
out.append('<g transform="translate(225 448)"><ellipse class="line" rx="150" ry="52" stroke-dasharray="2 9"/><ellipse cx="0" cy="-173" rx="70" ry="52" fill="url(#glow)"/>')
tiers=[(132,0),(108,-49),(84,-94),(61,-135),(37,-171)]
for k,(r,cy) in enumerate(tiers):
    top='hot' if k==4 else 'face'
    side='wall' if k==4 else ('face2' if k%2 else 'face')
    out.append(slab(0,cy,r,r*.35,22,top,side))
out.append('<path class="line" d="M-158 17C-95 55 95 55 158 17"/><text class="label" x="-22" y="-214">100×</text></g>')
end()

# Growth bars and data path
begin(3)
out.append('<g transform="translate(225 439)"><path class="line" d="M-154 12L154 12" stroke-dasharray="2 8"/>')
heights=[38,60,89,137,202]
xs=[-124,-62,0,62,124]
points=[]
for i,(x,h) in enumerate(zip(xs,heights)):
    top='hot' if i==4 else 'face'
    side='wall' if i==4 else 'face2'
    out.append(f'<path class="{side}" d="M{x-16} {-h}L{x} {-h+6}L{x+16} {-h}V0L{x} 6L{x-16} 0Z"/>'+diamond(x,-h,16,6,top))
    points.append((x,-h-25))
out.append('<path d="M'+ ' '.join((f'{x} {y}' if i==0 else f'L{x} {y}') for i,(x,y) in enumerate(points)) +'" class="line"/>')
for i,(x,y) in enumerate(points):
    out.append(f'<circle cx="{x}" cy="{y}" r="{34 if i==4 else 0}" fill="url(#glow)"/><circle class="dot" cx="{x}" cy="{y}" r="{8 if i==4 else 3}"/>')
out.append('<text class="label" x="-142" y="35">FY20</text><text class="label" x="105" y="35">FY24</text></g>')
end()

# Risk, four defensive square frames around core
begin(4)
out.append('<g transform="translate(225 344)"><ellipse class="line" rx="145" ry="51" stroke-dasharray="2 9"/>')
for k,(r,z) in enumerate([(130,0),(103,-30),(77,-60),(52,-91)]):
    cls='hot' if k==2 else 'line'
    out.append(f'<path class="{cls}" d="M0 {z-r*.35}L{r} {z}L0 {z+r*.35}L{-r} {z}Z"/>')
out.append('<ellipse cx="0" cy="-92" rx="75" ry="56" fill="url(#glow)"/>'+slab(0,-86,34,12,72,'hot','wall'))
for a,label in [(0,'L'),(pi/2,'V'),(pi,'M'),(3*pi/2,'C')]:
    x=cos(a)*130;y=sin(a)*45
    out.append(f'<circle class="face" cx="{x:.1f}" cy="{y:.1f}" r="11"/><text class="label" x="{x-3:.1f}" y="{y+4:.1f}">{label}</text>')
out.append('</g>')
end()

# Allocation, 100 isometric units
begin(5)
out.append('<g transform="translate(225 300)"><ellipse class="line" rx="167" ry="70" cy="94" stroke-dasharray="2 9"/><ellipse cx="-45" cy="-22" rx="95" ry="65" fill="url(#glow)"/>')
for row in range(10):
    for col in range(10):
        j=row*10+col
        x=(col-row)*15
        y=(col+row)*6.2
        top='hot' if j<51 else 'face'
        side='wall' if j<51 else 'face2'
        out.append(slab(x,y,13,4.6,5,top,side))
out.append('<path class="line" d="M-151 69C-72 103 12 105 91 72"/><text class="label" x="-152" y="125">51% listed</text><text class="label" x="72" y="125">49% unlisted</text></g>')
end()

out.append('</svg>')
Path('.plannotator/six-insight-cards/proposed-grid.svg').write_text(''.join(out))
