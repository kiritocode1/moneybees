# Writes ../moneybee.svg (area-true wealth growth) and ../moneybee-linear.svg (philosophy stages)
# Geometry rules carried over from 08-growing-circles.png (see STUDY.md):
#   discs on one horizontal axis, edge-to-edge gap 2.24px, group centred on the canvas,
#   arrow = 0.95px white line from the disc's left edge to 0.68px short of its centre,
#   chevron arms 16.5px at 45 deg, text column x = cx - 0.91*r_smallest,
#   largest-disc bottom -> first text cap top = 45.3px, whole composition centred vertically.
import math
W,H=736,552
WHITE='#FFFFFF'; INK='#000000'; ORANGE='#F6A11A'; GREY='#9D9EA1'
GAP=2.24; ARM=16.5; LW=0.95; APEX_DX=-0.68
FONTS='font-family'
# figure in local coords, origin = point between the feet (traced from the reference)
FIG=('<ellipse cx="-2.0" cy="-33.7" rx="2.3" ry="2.9"/>'
     '<path d="M1.2 -34.3 L10.2 -38.0 L11.1 -36.5 L2.0 -32.9 Z"/>'
     '<path d="M-4.6 -30.2 L4.4 -30.2 L4.5 -34.5 L6.0 -34.5 L6.4 -28.4 L1.3 -27.9 L1.5 -16.9 L1.8 -5.9 L2.2 0 L-2.4 0 L-2.7 -13.9 L-3.7 -17.4 L-5.4 -22.4 L-5.7 -27.7 Z"/>')
SHADOW='M-2.5 -0.5 L3 -0.1 L22 4.0 L37 6.4 L46 6.9 L54 6.8 L60 7.4 L61 8.8 L55 10.0 L43 9.6 L29 8.4 L12 4.9 L-1 1.4 Z'
FIG_TOP=37.2          # head top above the feet
FEET_BELOW_TOP=6.5    # feet sit this far inside the disc's top edge
FEET_DX=-5.5          # feet x relative to disc centre
CAP_GAP=45.3          # largest disc bottom -> first text cap top
def layout(diams):
    r=[d/2 for d in diams]
    total=sum(diams)+GAP*(len(diams)-1)
    x=(W-total)/2; cx=[]
    for ri in r: cx.append(x+ri); x+=2*ri+GAP
    return r,cx
def disc(cx,cy,r,fill,idx,arrow=True):
    s=[f'<circle id="disc-{idx}" cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{fill}"/>']
    if arrow:
        ax=cx+APEX_DX
        s.append(f'<g clip-path="url(#clip-{idx})" stroke="{WHITE}" stroke-width="{LW}" fill="none">'
                 f'<line x1="{cx-r-1:.2f}" y1="{cy:.2f}" x2="{ax:.2f}" y2="{cy:.2f}"/>'
                 f'<polyline points="{ax-ARM:.2f},{cy-ARM:.2f} {ax:.2f},{cy:.2f} {ax-ARM:.2f},{cy+ARM:.2f}"/></g>')
    return s
def figure(cx,cy,r,idx):
    fx=cx+FEET_DX; fy=cy-r+FEET_BELOW_TOP
    return [f'<g clip-path="url(#clip-{idx})"><path transform="translate({fx:.2f} {fy:.2f})" d="{SHADOW}" fill="{INK}" fill-opacity="0.85"/></g>',
            f'<g fill="{INK}" transform="translate({fx:.2f} {fy:.2f})">{FIG}</g>']
def build(diams, fills, cols, cap_h, line_gaps, text_fn, name, title):
    r,cx=layout(diams)
    rmax=max(r)
    comp=FIG_TOP-FEET_BELOW_TOP+2*rmax+CAP_GAP+cap_h+sum(line_gaps)+3
    top=(H-comp)/2
    cy=top+FIG_TOP-FEET_BELOW_TOP+rmax
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{title}">',
         f'<rect width="{W}" height="{H}" fill="{WHITE}"/><defs>']
    for i,(c,ri) in enumerate(zip(cx,r)):
        out.append(f'<clipPath id="clip-{i}"><circle cx="{c:.2f}" cy="{cy:.2f}" r="{ri:.2f}"/></clipPath>')
    out.append('</defs>')
    for i,(c,ri,f) in enumerate(zip(cx,r,fills)): out+=disc(c,cy,ri,f,i)
    last=len(diams)-1
    out+=figure(cx[last],cy,r[last],last)
    base0=cy+rmax+CAP_GAP+cap_h
    colx=[c-0.91*min(r) for c in cx]
    for i,x in enumerate(colx): out+=text_fn(i,x,base0,line_gaps)
    out.append('</svg>')
    open(f'../{name}.svg','w').write('\n'.join(out))
    print(name,'diam',[round(d,2) for d in diams],'cx',[round(c,2) for c in cx],'cy',round(cy,2),'colx',[round(c,2) for c in colx],'top',round(top,1))
# A: area-true wealth growth. Areas proportional to value, so d ∝ sqrt(value).
vals=[1.0,5.97,28.85]
d1=60.0
diamsA=[d1*math.sqrt(v/vals[0]) for v in vals]
labelsA=[('INVESTED','AUG 2007','Rs. 1 Mn'),('S&amp;P BSE 500 TRI','JUL 2026','Rs. 5.97 Mn'),('MONEYBEE PMS','JUL 2026','Rs. 28.85 Mn')]
def textA(i,x,b,g):
    l1,l2,v=labelsA[i]
    return [f'<text x="{x:.2f}" y="{b:.2f}" font-family="Instrument Serif" font-size="27" fill="{INK}">{v}</text>',
            f'<text x="{x:.2f}" y="{b+g[0]:.2f}" font-family="Geist Mono" font-size="9.5" letter-spacing="0.6" fill="{INK}">{l1}</text>',
            f'<text x="{x:.2f}" y="{b+g[0]+g[1]:.2f}" font-family="Geist Mono" font-size="9.5" letter-spacing="0.6" fill="{INK}">{l2}</text>']
build(diamsA,[GREY,INK,ORANGE],3,18.0,[18.0,14.0],textA,'moneybee',
      'Rs. 1 Mn invested in Aug 2007 grew to Rs. 5.97 Mn in the S&amp;P BSE 500 TRI and Rs. 28.85 Mn in Moneybee PMS by July 2026')
# B: linear +36px step, philosophy stages (not data)
diamsB=[140,176,212]
stagesB=['Undiscovered','Under-researched','Under-estimated']
def textB(i,x,b,g):
    return [f'<text x="{x:.2f}" y="{b:.2f}" font-family="Instrument Serif" font-size="30" fill="{INK}">0{i+1}</text>',
            f'<text x="{x:.2f}" y="{b+g[0]:.2f}" font-family="Instrument Serif" font-size="21" fill="{INK}">{stagesB[i]}</text>']
build(diamsB,[INK,INK,ORANGE],3,20.0,[26.0],textB,'moneybee-linear','Undiscovered, under-researched, under-estimated')
