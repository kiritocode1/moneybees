# Moneybee version of 04: Flyingbee AIF key terms, one card each, white line art with one orange element per card.
import sys; sys.path.insert(0,'/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/04/work')
from figs import *
INK='#FFFFFF'; ACC='#F6A11A'; GREY='#9D9EA1'
CW,CH,CT,CR,GAP,MX=149.2,202.0,125.5,4,16.9,43.9       # measured card size, top, radius, gap and side margin
TERMS=[('Minimum investment',['Rs. 1 crore']),('Suitable time frame',['3 to 5 years']),
       ('Investment in',['Listed and pre-IPO/unlisted','opportunities']),('Benchmark',['S&amp;P BSE 500 TRI']),
       ('Exit load',['No exit load, subject to','approved fund documents'])]
N=len(TERMS); W=round(2*MX+N*CW+(N-1)*GAP); H=453
ILL_CY=248.5   # measured mean illustration centre y in the reference
def timeline(cx,cy,years=5,span=90,lo=3,hi=5):
    x0=cx-span/2; step=span/years; o=[f'<path d="M{x0} {cy} H{x0+span}" stroke="{INK}" stroke-width="1.36"/>']
    for k in range(years+1): o.append(f'<path d="M{x0+k*step:.2f} {cy-5} V{cy+5}" stroke="{INK}" stroke-width="1.36"/>')
    o.append(f'<path d="M{x0+lo*step:.2f} {cy} H{x0+hi*step:.2f}" stroke="{ACC}" stroke-width="4" stroke-linecap="round"/>')
    return ''.join(o)
def listed_unlisted(cx,cy):
    sx,sy=cx-40,cy; o=[f'<rect x="{sx-12.25}" y="{sy-12.25}" width="24.5" height="24.5" rx="6" fill="{ACC}"/>']
    tg=[(cx+18,cy-21,False),(cx+40,cy,False),(cx+2,cy+16,True)]   # measured target layout; the third is unlisted (dashed)
    for tx,ty,dash in tg:
        o.append(f'<rect x="{tx-8.3:.2f}" y="{ty-8.3:.2f}" width="16.6" height="16.6" rx="3.2" fill="none" stroke="{INK}" stroke-width="1.1"{" stroke-dasharray=\"2.2 2\"" if dash else ""}/>')
    o.append(arrow(sx+12.5,sy-6.6,tx_:=cx+5.7,cy-18.6,INK)); o.append(arrow(sx+12.5,sy,cx+27.2,cy,INK)); o.append(arrow(sx+12.5,sy+6.4,cx-11.2,cy+12,INK))
    return ''.join(o)
def exit_frame(cx,cy,s=56,r=11,gap=9):
    x0,y0,x1,y1=cx-s/2,cy-s/2,cx+s/2,cy+s/2
    d=(f'M{x1} {cy-gap} V{y0+r} A{r} {r} 0 0 0 {x1-r} {y0} H{x0+r} A{r} {r} 0 0 0 {x0} {y0+r} '
       f'V{y1-r} A{r} {r} 0 0 0 {x0+r} {y1} H{x1-r} A{r} {r} 0 0 0 {x1} {y1-r} V{cy+gap}')
    return (f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="1.36"/>'
            f'<circle cx="{cx-12}" cy="{cy}" r="2.2" fill="{INK}"/>'
            f'<g stroke="{ACC}" fill="{ACC}">{arrow(cx-8,cy,x1+22,cy,ACC,sw=1.6,hl=5,hw=3.2)}</g>')
def svg():
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',f'<rect width="{W}" height="{H}" fill="#000000"/>']
    for k,(term,lines) in enumerate(TERMS):
        x=MX+k*(CW+GAP); cx=x+CW/2
        o.append(f'<rect x="{x:.2f}" y="{CT}" width="{CW}" height="{CH}" rx="{CR}" fill="#FFFFFF" fill-opacity="0.18"/>')
        o.append(f'<text x="{x+18.1:.2f}" y="155" fill="{INK}" font-family="Instrument Serif, serif" font-size="12.5">{term}</text>')
        for i,l in enumerate(lines): o.append(f'<text x="{x+18.1:.2f}" y="{170.5+10*i}" fill="{GREY}" font-family="Rethink Sans, sans-serif" font-size="7.2">{l}</text>')
        if k==0: o.append(cylinder(cx,ILL_CY-17.9,rx=21.35,ry=5.8,pitch=11.87,accent_band=2,ink=INK,accent=ACC,frame=(cx-33.8,ILL_CY-33.9,cx+33.8,ILL_CY+33.9)))
        if k==1: o.append(timeline(cx,ILL_CY))
        if k==2: o.append(listed_unlisted(cx,ILL_CY))
        if k==3: o.append(fan(cx-15.5,ILL_CY,cx+48.5,cx+54.5,[-39.25,-24.88,-12.98,13.02,24.9,39.21],ink=INK,accent=ACC,arrow_x=cx-34.5))
        if k==4: o.append(exit_frame(cx-8,ILL_CY))
    o.append('</svg>'); return '\n'.join(o)
if __name__=='__main__':
    open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/04/moneybee.svg','w').write(svg()); print('canvas',W,H)
