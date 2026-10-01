from PIL import Image; import numpy as np
im=np.array(Image.open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/09-process-diagram-sheet.png').convert('RGB')).astype(float)
LUM=im.mean(2)
def bil(img,x,y):
    x0=np.floor(x).astype(int); y0=np.floor(y).astype(int); fx=x-x0; fy=y-y0
    return img[y0,x0]*(1-fx)*(1-fy)+img[y0,x0+1]*fx*(1-fy)+img[y0+1,x0]*(1-fx)*fy+img[y0+1,x0+1]*fx*fy
def fitc(x,y):
    A=np.c_[2*x,2*y,np.ones_like(x)]; b=x*x+y*y
    cx,cy,c=np.linalg.lstsq(A,b,rcond=None)[0]; r=np.sqrt(c+cx*cx+cy*cy)
    return cx,cy,r,np.hypot(x-cx,y-cy)-r
def fit_ellipse_axes(x,y):
    # general conic fit -> axis lengths and angle (for perspective check)
    D=np.c_[x*x,x*y,y*y,x,y,np.ones_like(x)]
    _,_,V=np.linalg.svd(D); a,b,c,d,e,f=V[-1]
    M=np.array([[a,b/2],[b/2,c]]); ctr=np.linalg.solve(2*M,[-d,-e])
    f0=f+ (a*ctr[0]**2+b*ctr[0]*ctr[1]+c*ctr[1]**2 + d*ctr[0]+e*ctr[1])
    ev,evec=np.linalg.eigh(M); ax=np.sqrt(-f0/ev)
    ang=np.degrees(np.arctan2(evec[1,0],evec[0,0]))
    return ctr,ax,ang
def ring(cx,cy,r,bg=24.0,win=5.0,n=720,img=None):
    """centreline fit of a thin bright ring. returns cx,cy,r (centre, continuous coords where pixel i covers [i,i+1]),
    stroke width (integrated coverage / peak), peak level, kept fraction"""
    img=LUM if img is None else img
    for it in range(3):
        a=np.linspace(0,2*np.pi,n,endpoint=False)
        rs=np.arange(r-win,r+win,0.1)
        X=cx-0.5+np.outer(np.cos(a),rs); Y=cy-0.5+np.outer(np.sin(a),rs)   # sample in pixel-centre coords
        P=bil(img,X,Y)-bg; P=np.clip(P,0,None)
        pk=P.max(1)
        cen=(P*rs).sum(1)/np.maximum(P.sum(1),1e-6)
        width=P.sum(1)*0.1
        ok=pk>0.35*np.median(pk)
        medw=np.median(width[ok]); ok&=(width<1.4*medw)&(width>0.6*medw)
        x=cx+np.cos(a[ok])*cen[ok]; y=cy+np.sin(a[ok])*cen[ok]
        ncx,ncy,nr,res=fitc(x,y)
        keep=np.abs(res)<3*np.std(res)+0.05
        ncx,ncy,nr,res=fitc(x[keep],y[keep])
        cx,cy,r=ncx,ncy,nr
    peak=np.median(pk[ok])+bg
    stroke=np.median(width[ok])/(np.median(pk[ok]))
    ctr,ax,ang=fit_ellipse_axes(x[keep],y[keep])
    return dict(cx=cx,cy=cy,r=r,rms=float(np.std(res)),stroke=float(stroke),peak=float(peak),kept=float(ok.mean()),ell_ax=ax,ell_ang=ang)
def disc(cx,cy,r,bg=24.0,level=None,n=720,img=None):
    img=LUM if img is None else img
    for it in range(3):
        a=np.linspace(0,2*np.pi,n,endpoint=False)
        rs=np.arange(r-6,r+6,0.05)
        X=cx-0.5+np.outer(np.cos(a),rs); Y=cy-0.5+np.outer(np.sin(a),rs)
        P=bil(img,X,Y)
        inner=np.median(P[:,:20]); lvl=(inner+bg)/2 if level is None else level
        pts=[]
        for i in range(n):
            p=P[i]; idx=np.where((p[:-1]>=lvl)&(p[1:]<lvl))[0]
            if len(idx)!=1: continue
            j=idx[0]; rr=rs[j]+(p[j]-lvl)/(p[j]-p[j+1])*0.05
            pts.append((cx+np.cos(a[i])*rr,cy+np.sin(a[i])*rr))
        pts=np.array(pts); ncx,ncy,nr,res=fitc(pts[:,0],pts[:,1])
        keep=np.abs(res)<1.0; ncx,ncy,nr,res=fitc(pts[keep,0],pts[keep,1]); cx,cy,r=ncx,ncy,nr
    return dict(cx=cx,cy=cy,r=r,rms=float(np.std(res)),inner=float(inner),kept=float(keep.mean()*len(pts)/n))
