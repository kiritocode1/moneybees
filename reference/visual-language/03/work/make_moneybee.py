# Moneybee version of 03: the philosophy's three stages, on a black band, card-sized canvas (641 x 360, shown at 2x).
import numpy as np
W,H=641,360
OX,OY=46.8,279.7                       # reference card origin; every x/y below is reference minus this
COLS=[83-OX,291-OX,499.5-OX]           # 36.2, 244.2, 452.7
GLYPH_CY=367.8-OY                      # 88.1: mean glyph centre y in the reference
R_G=21.0                               # glyph radius (reference glyphs are 42-43.6 px across)
SW=1.8                                 # stroke width (reference: 1.66 ring, 1.8 spokes and tip rings)
HEAD_BASE=417-OY; BODY_BASE=HEAD_BASE+31; BODY_LH=9.6
INK='#FFFFFF'; GREY='#9D9EA1'; ACCENT='#F6A11A'
def found(cx,cy):
    # Undiscovered: a 5x5 field of dots, one found (orange) inside a ring.
    o=[]; pitch=9.0
    for i in range(5):
        for j in range(5):
            x,y=cx+(j-2)*pitch,cy+(i-2)*pitch
            if (i,j)==(1,3): continue
            o.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="1.5" fill="{INK}"/>')
    fx,fy=cx+pitch,cy-pitch
    o.append(f'<circle cx="{fx:.2f}" cy="{fy:.2f}" r="6" fill="none" stroke="{INK}" stroke-width="{SW}"/>')
    o.append(f'<circle cx="{fx:.2f}" cy="{fy:.2f}" r="2.9" fill="{ACCENT}"/>')
    return ''.join(o)
def coverage(cx,cy):
    # Under-researched: the reference's 12-spoke burst, with three spokes missing: coverage with a gap.
    o=[f'<g fill="none" stroke="{INK}" stroke-width="{SW}"><circle cx="{cx}" cy="{cy}" r="4.6"/>']
    for k in range(12):
        if k in (3,4,5): continue
        a=np.radians(30*k); s,c=np.sin(a),-np.cos(a)
        o.append(f'<path d="M{cx+5.5*s:.2f} {cy+5.5*c:.2f} L{cx+16.6*s:.2f} {cy+16.6*c:.2f}"/><circle cx="{cx+18.4*s:.2f}" cy="{cy+18.4*c:.2f}" r="1.8"/>')
    return ''.join(o)+'</g>'
def value_gap(cx,cy):
    # Under-estimated: price (disc) inside value (ring); the annulus between them is the gap, measured by one tick line.
    return (f'<circle cx="{cx}" cy="{cy}" r="19.75" fill="none" stroke="{INK}" stroke-width="{SW}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="11" fill="{INK}"/>'
            f'<path d="M{cx+12.6} {cy} L{cx+18.2} {cy} M{cx+12.6} {cy-2.6} L{cx+12.6} {cy+2.6} M{cx+18.2} {cy-2.6} L{cx+18.2} {cy+2.6}" stroke="{INK}" stroke-width="1.2" fill="none"/>')
HEADS=[('Un','discovered'),('Under-','researched'),('Under-','estimated')]
LOREM=[["Lorem ipsum dolor sit amet, consectetur","adipiscing elit. Sed do eiusmod tempor","incididunt ut labore et dolore magna."],
       ["Ut enim ad minim veniam, quis nostrud","exercitation ullamco laboris nisi ut","aliquip ex ea commodo consequat."],
       ["Duis aute irure dolor in reprehenderit","in voluptate velit esse cillum dolore","eu fugiat nulla pariatur."]]
def svg():
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
       f'<rect width="{W}" height="{H}" fill="#000000"/>',
       f'<text x="{57-OX:.1f}" y="{296-OY:.1f}" fill="{GREY}" font-family="Geist Mono, monospace" font-size="5.5" letter-spacing="0.55">PHILOSOPHY</text>']
    for k,(x,fn) in enumerate(zip(COLS,[found,coverage,value_gap])):
        o.append(fn(x+R_G,GLYPH_CY))
        pre,it=HEADS[k]
        o.append(f'<text x="{x:.1f}" y="{HEAD_BASE:.1f}" fill="{INK}" font-family="Instrument Serif, serif" font-size="19">{pre}<tspan font-style="italic">{it}</tspan></text>')
        for i,line in enumerate(LOREM[k]):
            o.append(f'<text x="{x:.1f}" y="{BODY_BASE+i*BODY_LH:.1f}" fill="{GREY}" font-family="Rethink Sans, sans-serif" font-size="7.2">{line}</text>')
    o.append('</svg>'); return '\n'.join(o)
if __name__=='__main__': open('moneybee.svg','w').write(svg())
