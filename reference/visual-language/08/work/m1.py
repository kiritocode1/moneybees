from PIL import Image; import numpy as np
P='/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/08-growing-circles.png'
im=np.array(Image.open(P).convert('RGB')).astype(float)
paper=np.array([0xF2,0xEF,0xE8],float); red=np.array([0xDF,0x29,0x14],float)
d=red-paper
alpha=((im-paper)@d)/(d@d)   # 0 paper, 1 red
np.save('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/08/work/alpha.npy',alpha)
def fit(pts):
    x,y=pts[:,0],pts[:,1]
    A=np.c_[2*x,2*y,np.ones_like(x)]; b=x*x+y*y
    cx,cy,c=np.linalg.lstsq(A,b,rcond=None)[0]
    r=np.sqrt(c+cx*cx+cy*cy); res=np.hypot(x-cx,y-cy)-r
    return cx,cy,r,res
def interp(img,x,y):
    x0=int(np.floor(x)); y0=int(np.floor(y)); fx=x-x0; fy=y-y0
    if x0<0 or y0<0 or x0+1>=img.shape[1] or y0+1>=img.shape[0]: return np.nan
    return (img[y0,x0]*(1-fx)*(1-fy)+img[y0,x0+1]*fx*(1-fy)+img[y0+1,x0]*(1-fx)*fy+img[y0+1,x0+1]*fx*fy)
guess=[(153,195,34),(242,195,52),(367,195,69),(527,195,87)]
res_all=[]
for (gx,gy,gr) in guess:
    pts=[]
    for a in np.linspace(0,2*np.pi,720,endpoint=False):
        # march from 0.6r to 1.3r find 0.5 crossing (outward, last inside->outside)
        rs=np.arange(gr*0.7,gr*1.25,0.05)
        vals=np.array([interp(alpha,gx+r*np.cos(a),gy+r*np.sin(a)) for r in rs])
        if np.any(np.isnan(vals)): continue
        # require inside red and outside paper
        idx=np.where((vals[:-1]>=0.5)&(vals[1:]<0.5))[0]
        if len(idx)!=1: continue
        if vals[-1]>0.1 or vals[0]<0.9: continue
        i=idx[0]; r0=rs[i]+(vals[i]-0.5)/(vals[i]-vals[i+1])*0.05
        pts.append((gx+r0*np.cos(a),gy+r0*np.sin(a),a))
    pts=np.array(pts)
    cx,cy,r,res=fit(pts[:,:2])
    keep=np.abs(res)<1.0
    cx,cy,r,res=fit(pts[keep,:2])
    print(f'disc c=({cx:.2f},{cy:.2f}) r={r:.2f} d={2*r:.2f} n={keep.sum()}/{len(pts)} rms={res.std():.3f}')
    res_all.append((cx,cy,r))
np.save('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/08/work/discs.npy',np.array(res_all))
for i in range(3):
    a,b=res_all[i],res_all[i+1]
    print('gap',b[0]-b[2]-(a[0]+a[2]))
