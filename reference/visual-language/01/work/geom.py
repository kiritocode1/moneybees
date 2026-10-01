# Rounded pie-slice geometry for image 01. Angles clockwise from 12 o'clock, screen coords (y down).
import numpy as np
def pt(c,ang,r):  # ang radians clockwise from up
    return (c[0]+r*np.sin(ang), c[1]-r*np.cos(ang))
def wedge(c,a0,a1,R,rc,rho,h):
    """Pie slice from centre c spanning a0..a1 (rad), sides inset by h (half the gap), outer arc radius R,
    outer corners filleted with radius rc, apex rounded by a circle of radius rho tangent to both sides.
    Returns (svg_path_d, polyline points)."""
    S=(a1-a0)/2; mid=a0+S
    def rot(x,y):  # local frame: +x along bisector, +y toward a1 side; to screen
        ang=mid+np.arctan2(y,x); r=np.hypot(x,y); return pt(c,ang,r)
    # side a1 in local frame: direction u=(cosS,sinS), inward normal n=(sinS,-cosS)
    u=np.array([np.cos(S),np.sin(S)]); n=np.array([np.sin(S),-np.cos(S)])
    s=np.sqrt((R-rc)**2-(h+rc)**2); f=s*u+(h+rc)*n          # outer fillet centre (a1 side)
    T_line=s*u+h*n; T_circ=f/np.linalg.norm(f)*R
    x0=(rho+h)/np.sin(S); A=np.array([x0,0.0])                # apex circle centre
    sa=x0*np.cos(S); A_line=sa*u+h*n                            # apex tangent on a1 side line
    mirror=lambda p: np.array([p[0],-p[1]])
    # polyline: go from apex tangent (a0 side) out along a0 side, fillet, outer arc, fillet, a1 side, apex arc
    pts=[]
    def arc_pts(center,rad,t0,t1,nseg):
        ts=np.linspace(t0,t1,nseg); return [center+rad*np.array([np.cos(t),np.sin(t)]) for t in ts]
    Tl0,Tc0,f0,Al0=mirror(T_line),mirror(T_circ),mirror(f),mirror(A_line)
    ang=lambda p,q: np.arctan2(q[1]-p[1],q[0]-p[0])
    pts+= [Al0, Tl0]
    pts+= arc_pts(f0,rc,ang(f0,Tl0),ang(f0,Tc0),24)
    pts+= arc_pts(np.zeros(2),R,np.arctan2(Tc0[1],Tc0[0]),np.arctan2(T_circ[1],T_circ[0]),120)
    t0,t1=ang(f,T_circ),ang(f,T_line)
    pts+= arc_pts(f,rc,t0,t1,24)
    pts+= [T_line, A_line]
    a0_,a1_=ang(A,A_line),ang(A,Al0)
    if a1_<a0_: a1_+=2*np.pi
    pts+= arc_pts(A,rho,a0_,a1_,40)
    poly=[rot(*p) for p in pts]
    P=lambda p: '%.2f %.2f'%rot(*p)
    d=(f'M{P(Al0)} L{P(Tl0)} A{rc:.2f} {rc:.2f} 0 0 1 {P(Tc0)} A{R:.2f} {R:.2f} 0 0 1 {P(T_circ)} '
       f'A{rc:.2f} {rc:.2f} 0 0 1 {P(T_line)} L{P(A_line)} A{rho:.2f} {rho:.2f} 0 0 1 {P(Al0)} Z')
    return d,poly
def raster(polys,W,H,ss=4):
    from PIL import Image,ImageDraw
    img=Image.new('L',(W*ss,H*ss),0); dr=ImageDraw.Draw(img)
    for poly in polys: dr.polygon([(x*ss,y*ss) for x,y in poly],fill=255)
    a=np.asarray(img,dtype=float)/255
    return a.reshape(H,ss,W,ss).mean(axis=(1,3))
