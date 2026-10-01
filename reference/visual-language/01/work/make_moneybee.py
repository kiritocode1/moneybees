# Moneybee version of 01: Top 5 sector allocation as a rounded rose, area-true.
import sys; sys.path.insert(0,'work')
import numpy as np
from geom import wedge
W,H=1179,1191; c=(589.5,600.0)
DATA=[('Renewable Energy',12.2),('Chemicals',11.74),('Oil & Gas',8.97),('Financials & NBFC',8.72),('Capital Goods',7.8)]
SCALE_MAX=15.0            # the track's outer radius stands for 15% of portfolio
RT=391.6; RC=30.0; Hh=1.15  # track radius, one corner radius for every corner (apex included), half-gap
N=len(DATA); SPAN=360/N; START=-SPAN/2   # first sector centred on 12 o'clock
def area(poly):
    p=np.array(poly); x,y=p[:,0],p[:,1]; return 0.5*abs(np.dot(x,np.roll(y,-1))-np.dot(y,np.roll(x,-1)))
def w(k,R,rc=RC): return wedge(c,np.radians(START+SPAN*k),np.radians(START+SPAN*k+SPAN),R,rc,RC,Hh)
A_track=area(w(0,RT)[1])
def radius_for(v):
    # bisection so the drawn (rounded) wedge area is v/SCALE_MAX of the drawn track area
    lo,hi=RC*2.5,RT
    for _ in range(60):
        mid=(lo+hi)/2
        if area(w(0,mid)[1])/A_track < v/SCALE_MAX: lo=mid
        else: hi=mid
    return (lo+hi)/2
# closed-form approximation used in the React component: r^2 = r0^2 + (RT^2 - r0^2) v/max
S=np.radians(SPAN/2); x0=(RC+Hh)/np.sin(S); hole=x0-RC
if __name__=='__main__':
    radii=[radius_for(v) for _,v in DATA]
    # fit r0 for the closed form
    best=None
    for r0 in np.arange(0,200,0.1):
        pr=[np.sqrt(r0**2+(RT**2-r0**2)*v/SCALE_MAX) for _,v in DATA]; e=np.max(np.abs(np.array(pr)-radii))
        if best is None or e<best[0]: best=(e,r0)
    print('hole radius (apex cap) %.1f  track area %.0f'%(hole,A_track))
    for (n,v),R in zip(DATA,radii):
        print(f'{n:18s} {v:6.2f}  R={R:6.2f}  R/RT={R/RT:.3f}  area ratio={area(w(0,R)[1])/A_track:.4f} target {v/SCALE_MAX:.4f}')
    print('closed form r0=%.1f max err %.2fpx'%(best[1],best[0]))
    np.save('work/mb_radii.npy',np.array(radii))

def fmt(v): return ('%g'%v)
LABEL_LINES={'Renewable Energy':['RENEWABLE','ENERGY'],'Chemicals':['CHEMICALS'],'Oil & Gas':['OIL &amp; GAS'],
             'Financials & NBFC':['FINANCIALS','&amp; NBFC'],'Capital Goods':['CAPITAL','GOODS']}
R_TEXT=205.0; NUM=76; LAB=22; LAB_LH=28; ACCENT_INDEX=0
def build_svg():
    radii=np.load('work/mb_radii.npy')
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
       f'<rect width="{W}" height="{H}" fill="#000000"/>',
       '<text x="64" y="118" fill="#FFFFFF" font-family="Instrument Serif, serif" font-size="56">Top 5 - Sector Allocation (%)</text>',
       '<g fill="#FFFFFF" fill-opacity="0.18">']
    for k in range(N): o.append(f'<path d="{w(k,RT)[0]}"/>')
    o.append('</g>')
    for k,((name,v),R) in enumerate(zip(DATA,radii)):
        fill='#F6A11A' if k==ACCENT_INDEX else '#FFFFFF'
        o.append(f'<path d="{w(k,R)[0]}" fill="{fill}"/>')
    o.append('<g fill="#000000" text-anchor="middle">')
    for k,(name,v) in enumerate(DATA):
        a=np.radians(START+SPAN*k+SPAN/2); x=c[0]+R_TEXT*np.sin(a); y=c[1]-R_TEXT*np.cos(a)
        lines=LABEL_LINES[name]; blk=0.70*NUM+16+LAB_LH*(len(lines)-1)+0.72*LAB  # cap-height stack
        top=y-blk/2; nb=top+0.70*NUM
        o.append(f'<text x="{x:.1f}" y="{nb:.1f}" font-family="Instrument Serif, serif" font-size="{NUM}">{fmt(v)}</text>')
        for i,l in enumerate(lines):
            o.append(f'<text x="{x:.1f}" y="{nb+16+0.72*LAB+LAB_LH*i:.1f}" font-family="Geist Mono, monospace" font-size="{LAB}" letter-spacing="2.2">{l}</text>')
    o.append('</g></svg>')
    return '\n'.join(o)
if __name__=='__main__':
    open('moneybee.svg','w').write(build_svg())
