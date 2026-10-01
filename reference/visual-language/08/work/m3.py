import numpy as np
a=np.load('alpha.npy'); discs=np.load('discs.npy')
w=np.clip((1-a)/1.098,0,1.2)
H,W=a.shape
out=[]
for i,(cx,cy,r) in enumerate(discs):
    x0=int(cx-24); x1=int(cx+3)
    up=[];lo=[]
    for y in range(int(cy-22),int(cy+23)):
        if 192<=y<=198: continue
        row=w[y,x0:x1+1].copy()
        m=row>0.12
        if row[m].sum()<0.5: continue
        # take the connected run with max mass
        xs=np.arange(x0,x1+1)
        xc=(xs[m]*row[m]).sum()/row[m].sum()
        (up if y<195 else lo).append((xc+0.5,y+0.5,row[m].sum()))  # continuous coords
    up=np.array(up);lo=np.array(lo)
    ku,bu=np.polyfit(up[:,1],up[:,0],1); kl,bl=np.polyfit(lo[:,1],lo[:,0],1)
    yt=(bl-bu)/(ku-kl); xt=ku*yt+bu
    angu=np.degrees(np.arctan2(1,abs(ku))); angl=np.degrees(np.arctan2(1,abs(kl)))
    # arm width perpendicular: horizontal mass * sin(angle)
    wu=np.median(up[:,2])*np.sin(np.radians(angu))
    # line: coverage over rows 192..198 per column in [cx-r+3, cx-25]
    xs=np.arange(int(cx-r)+3,int(cx-26))
    cov=w[190:200,xs].sum(0)
    rows=np.arange(190,200)+0.5
    ycen=(w[190:200,xs]*rows[:,None]).sum(0)/cov
    # left end of line: first column from disc edge where line coverage >0.5
    colcov=w[192:199,:].sum(0)
    xl=int(cx-r)-3
    while colcov[xl]<0.5: xl+=1
    cxx=cx+0.5; cyy=cy+0.5
    print(f'disc{i+1} centre({cxx:.2f},{cyy:.2f}) r={r:.2f}')
    print(f'   upper arm y {up[0,1]:.1f}..{up[-1,1]:.1f}  x {up[0,0]:.2f}..{up[-1,0]:.2f} angle {angu:.1f} deg ; lower arm y {lo[0,1]:.1f}..{lo[-1,1]:.1f} x {lo[0,0]:.2f}..{lo[-1,0]:.2f} angle {angl:.1f}')
    print(f'   apex ({xt:.2f},{yt:.2f}) apex-cx={xt-cxx:+.2f}; arm dx={xt-up[0,0]:.2f} dy={yt-up[0,1]:.2f} ; arm width {wu:.2f}')
    print(f'   line width(mean col coverage) {cov.mean():.2f}  y centre {ycen.mean():.2f}  left start px {xl} (disc left edge {cxx-r:.2f})')
    out.append((xt,yt,xt-up[0,0],yt-up[0,1]))
np.save('arrows.npy',np.array(out))
