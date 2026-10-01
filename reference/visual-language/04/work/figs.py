# Line illustrations of 04, parameterised so the replica and the Moneybee version share construction.
import numpy as np
def cylinder(cx,top_cy,rx=21.15,ry=5.75,pitch=11.9,bands=3,accent_band=1,ink='#F2F2F2',accent='#F47957',sw=1.36,frame=None,frame_r=13,frame_sw=1.35):
    """Database cylinder: full top ellipse, sides, `bands` lower half-ellipse arcs every `pitch` (the last is the bottom)."""
    o=[]
    if frame: x0,y0,x1,y1=frame; o.append(f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" rx="{frame_r}" fill="none" stroke="{ink}" stroke-width="{frame_sw}"/>')
    bot=top_cy+pitch*bands
    o.append(f'<ellipse cx="{cx}" cy="{top_cy}" rx="{rx}" ry="{ry}" fill="none" stroke="{ink}" stroke-width="{sw}"/>')
    o.append(f'<path d="M{cx-rx:.2f} {top_cy:.2f} V{bot:.2f} M{cx+rx:.2f} {top_cy:.2f} V{bot:.2f}" stroke="{ink}" stroke-width="{sw}" fill="none"/>')
    for i in range(1,bands+1):
        y=top_cy+pitch*i; col=accent if (i-1)==accent_band else ink
        o.append(f'<path d="M{cx-rx:.2f} {y:.2f} A{rx} {ry} 0 0 0 {cx+rx:.2f} {y:.2f}" stroke="{col}" stroke-width="{sw}" fill="none"/>')
    return ''.join(o)
def fan(x_start,y0,x_curve_end,x_end,offsets,accent_line=True,ink='#F2F2F2',accent='#F47957',sw=1.0,c1=38,c2=44,arrow_x=None,head=(4,2.6)):
    """Lines leave one point and fan out on an S-curve (cubic, c1/c2 = control offsets), then run level to x_end.
    The level middle line, from arrow_x (arrowhead pointing left) to x_end, is the accent."""
    o=[f'<g fill="none" stroke="{ink}" stroke-width="{sw}">']
    for off in offsets:
        ye=y0+off
        o.append(f'<path d="M{x_start} {y0} C{x_start+c1} {y0} {x_curve_end-c2} {ye:.2f} {x_curve_end} {ye:.2f} L{x_end} {ye:.2f}"/>')
    o.append('</g>')
    if accent_line:
        ax=arrow_x; hl,hw=head
        o.append(f'<path d="M{ax+0.6} {y0} L{x_end} {y0}" stroke="{accent}" stroke-width="{sw+0.3}" fill="none"/>')
        o.append(f'<path d="M{ax} {y0} L{ax+hl} {y0-hw} L{ax+hl} {y0+hw} Z" fill="{accent}"/>')
    return ''.join(o)
def burst(cx,cy,n=30,offset=6,r_in=11,r_out=44.8,dot=1.1,sq=21.2,sq_r=5.6,ink='#F2F2F2',accent='#F47957',sw=1.0):
    o=[f'<g stroke="{ink}" stroke-width="{sw}">']
    for k in range(n):
        a=np.radians(offset+360/n*k); s,c=np.sin(a),-np.cos(a)
        o.append(f'<path d="M{cx+r_in*s:.2f} {cy+r_in*c:.2f} L{cx+(r_out-dot)*s:.2f} {cy+(r_out-dot)*c:.2f}"/>')
    o.append(f'</g><g fill="{ink}">')
    for k in range(n):
        a=np.radians(offset+360/n*k); o.append(f'<circle cx="{cx+r_out*np.sin(a):.2f}" cy="{cy-r_out*np.cos(a):.2f}" r="{dot}"/>')
    o.append('</g>')
    o.append(f'<rect x="{cx-sq/2:.2f}" y="{cy-sq/2:.2f}" width="{sq}" height="{sq}" rx="{sq_r}" fill="{accent}"/>')
    return ''.join(o)
def arrow(x0,y0,x1,y1,ink,sw=1.1,hl=3.6,hw=2.2):
    d=np.array([x1-x0,y1-y0]); u=d/np.linalg.norm(d); n=np.array([-u[1],u[0]]); b=np.array([x1,y1])-u*hl
    p1=b+n*hw; p2=b-n*hw
    return (f'<path d="M{x0:.2f} {y0:.2f} L{b[0]:.2f} {b[1]:.2f}" stroke="{ink}" stroke-width="{sw}" fill="none"/>'
            f'<path d="M{x1:.2f} {y1:.2f} L{p1[0]:.2f} {p1[1]:.2f} L{p2[0]:.2f} {p2[1]:.2f} Z" fill="{ink}"/>')
def distribute(src,targets,src_size=24.5,src_r=6,t_size=16.6,t_r=3.2,arrows=None,ink='#F2F2F2',accent='#F47957',sw=1.1,accent_src=True):
    sx,sy=src; o=[]
    o.append(f'<rect x="{sx-src_size/2:.2f}" y="{sy-src_size/2:.2f}" width="{src_size}" height="{src_size}" rx="{src_r}" fill="{accent if accent_src else "none"}" stroke="{"none" if accent_src else ink}" stroke-width="{sw}"/>')
    for (tx,ty) in targets:
        o.append(f'<rect x="{tx-t_size/2:.2f}" y="{ty-t_size/2:.2f}" width="{t_size}" height="{t_size}" rx="{t_r}" fill="none" stroke="{ink}" stroke-width="{sw}"/>')
    for (a,b) in arrows: o.append(arrow(*a,*b,ink))
    return ''.join(o)
