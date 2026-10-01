# Writes ../replica.svg from the measured model of 08-growing-circles.png
import numpy as np
W,H=736,552
PAPER='#F2EFE8'; RED='#DF2914'; INK='#161618'
# measured (continuous px coords; see STUDY.md)
R0,DR=34.62,17.74          # radius of disc 1, radius step
GAP=2.24                    # edge-to-edge gap
CY=195.21
LEFT=119.72                 # left edge of disc 1
r=[R0+DR*k for k in range(4)]
cx=[154.34,243.88,368.43,528.45]; x=LEFT
for k in range(4):
    pass
APEX_DX=-0.68; ARM=16.5; LW=0.95; LY=195.12
TEXT_DX=-31.5               # column left edge = disc centre - 31.5
out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
     f'<rect width="{W}" height="{H}" fill="{PAPER}"/>','<defs>']
for k in range(4):
    out.append(f'<clipPath id="c{k}"><circle cx="{cx[k]:.2f}" cy="{CY}" r="{r[k]:.2f}"/></clipPath>')
out.append('</defs>')
for k in range(4):
    out.append(f'<circle cx="{cx[k]:.2f}" cy="{CY}" r="{r[k]:.2f}" fill="{RED}"/>')
# shadow on disc 4, clipped to it
out.append(f'<g clip-path="url(#c3)"><path d="M520.5 113.4 L526 113.8 L545 117.9 L560 120.3 L569 120.8 L577 120.7 L583 121.3 L584 122.7 L578 123.9 L566 123.5 L552 122.3 L535 118.8 L522 115.3 Z" fill="#000" fill-opacity="0.85"/></g>')
for k in range(4):
    ax=cx[k]+APEX_DX
    out.append(f'<g clip-path="url(#c{k})" stroke="#FFFFFF" stroke-width="{LW}" fill="none" stroke-linecap="butt" stroke-linejoin="miter">'
               f'<line x1="{cx[k]-r[k]-1:.2f}" y1="{LY}" x2="{ax:.2f}" y2="{LY}"/>'
               f'<polyline points="{ax-ARM:.2f},{LY-ARM:.2f} {ax:.2f},{LY:.2f} {ax-ARM:.2f},{LY+ARM:.2f}"/></g>')
# figure (silhouette traced from the darkness map, rows 76-114)
out.append(f'<g fill="{INK}">'
  '<ellipse cx="521.0" cy="80.2" rx="2.3" ry="2.9"/>'
  '<path d="M524.2 79.6 L533.2 75.9 L534.1 77.4 L525.0 81.0 Z"/>'
  '<path d="M518.4 83.7 L527.4 83.7 L527.5 79.4 L529.0 79.4 L529.4 85.5 L524.3 86.0 L524.5 97 L524.8 108 L525.2 113.9 L520.6 113.9 L520.3 100 L519.3 96.5 L517.6 91.5 L517.3 86.2 Z"/>'
  '</g>')
# text
tx=[c+TEXT_DX for c in cx]
body=['Lorem ipsum dolor sit amet,','consectetuer adipiscing elit, sed','diam nonummy nibh euismod',
      'tincidunt ut laoreet dolore','magna aliquam erat volutpat. Ut','wisi enim ad minim veniam, quis']
out.append(f'<g fill="{INK}" font-family="Inter Tight">')
for k in range(4):
    x=tx[k]
    out.append(f'<text x="{x:.2f}" y="341.3" font-size="18.4" font-weight="800" letter-spacing="-0.3">0{k+1}</text>')
    out.append(f'<text x="{x:.2f}" y="358.2" font-size="10.4" font-weight="600" letter-spacing="-0.5">Lorem ipsum</text>')
    out.append(f'<text x="{x:.2f}" y="373.2" font-size="10.4" font-weight="600" letter-spacing="-0.5">dolor</text>')
    for p,base in enumerate((387.6,436.4)):
        for i,l in enumerate(body):
            out.append(f'<text x="{x-0.5:.2f}" y="{base+6.2*i:.2f}" font-size="4.75" font-weight="400" letter-spacing="-0.17" fill-opacity="0.9">{l}</text>')
out.append('</g></svg>')
open('../replica.svg','w').write('\n'.join(out))
print('cx',[round(c,2) for c in cx],'r',[round(v,2) for v in r])
