import numpy as np
a=np.load('alpha.npy'); discs=np.load('discs.npy')
H,W=a.shape
yy,xx=np.mgrid[0:H,0:W]
w=np.clip((1-a)/1.098,0,1.2)
for i,(cx,cy,r) in enumerate(discs):
    inside=np.hypot(xx-cx,yy-cy)<r-1.5
    wi=np.where(inside,w,0)
    # line rows 193..197 profile along x: coverage sum over rows
    colsum=wi[190:201,:].sum(0)
    xs=np.where((colsum>0.5)&inside[195])[0]
    # arm pixels: rows away from line
    arm=wi.copy(); arm[192:199,:]=0
    ys,xs2=np.where(arm>0.25)
    # per row weighted centroid for upper and lower arms
    up=[];lo=[]
    for y in range(int(cy-r),int(cy+r)):
        row=arm[y]
        if row.sum()<0.3: continue
        m=row>0.05
        xc=(np.arange(W)[m]*row[m]).sum()/row[m].sum()
        (up if y<195 else lo).append((xc,y,row[m].sum()))
    up=np.array(up);lo=np.array(lo)
    # fit x = k*y + b
    ku,bu=np.polyfit(up[:,1],up[:,0],1); kl,bl=np.polyfit(lo[:,1],lo[:,0],1)
    yt=(bl-bu)/(ku-kl); xt=ku*yt+bu
    print(f'disc{i+1} cx={cx:.2f} r={r:.2f} line x from {xs.min()} to {xs.max()}  line cov mean {colsum[xs.min()+3:xs.max()-8].mean():.2f}')
    print(f'   upper arm rows {up[0,1]:.0f}-{up[-1,1]:.0f} x {up[0,0]:.2f}->{up[-1,0]:.2f} slope dx/dy={ku:.3f} angle from horiz={np.degrees(np.arctan(1/abs(ku))):.1f}  width={up[3:-3,2].mean()*np.sin(np.arctan(1/abs(ku))):.2f}')
    print(f'   lower arm rows {lo[0,1]:.0f}-{lo[-1,1]:.0f} x {lo[0,0]:.2f}->{lo[-1,0]:.2f} slope={kl:.3f}')
    print(f'   apex from arm fits ({xt:.2f},{yt:.2f}) ; tip - cx = {xt-cx:.2f}; tip-left edge = {xt-(cx-r):.2f}; tail x0 upper={up[0,0]:.2f} y={up[0,1]}')
