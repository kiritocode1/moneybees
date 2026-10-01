import sys; sys.path.insert(0,'work')
from common import *
from collections import deque
mt=np.load('work/mt.npy'); mv=np.load('work/mv.npy')
tv=(mv>0.99)&(L<150)
tt=(mt>0.99)&(mv<0.01)&(L<62)
txt=tv|tt
def cc(mask):
    lab=np.zeros(mask.shape,int); cur=0; ys,xs=np.nonzero(mask); comps=[]
    for y0,x0 in zip(ys,xs):
        if lab[y0,x0]: continue
        cur+=1; q=deque([(y0,x0)]); lab[y0,x0]=cur; pts=[]
        while q:
            y,x=q.popleft(); pts.append((y,x))
            for dy in (-1,0,1):
                for dx in (-1,0,1):
                    yy,xx=y+dy,x+dx
                    if 0<=yy<mask.shape[0] and 0<=xx<mask.shape[1] and mask[yy,xx] and not lab[yy,xx]:
                        lab[yy,xx]=cur; q.append((yy,xx))
        p=np.array(pts); comps.append((p[:,1].min(),p[:,0].min(),p[:,1].max(),p[:,0].max(),len(p)))
    return comps
comps=[c for c in cc(txt) if c[4]>=6]
# group into lines: merge boxes that are close
comps.sort(key=lambda b:(b[1],b[0]))
groups=[]
for b in comps:
    for g in groups:
        if abs((b[1]+b[3])/2-(g[1]+g[3])/2)<14 and b[0]<g[2]+14 and b[2]>g[0]-14:
            g[0]=min(g[0],b[0]); g[1]=min(g[1],b[1]); g[2]=max(g[2],b[2]); g[3]=max(g[3],b[3]); g[4]+=b[4]; g[5]+=1; break
    else: groups.append([b[0],b[1],b[2],b[3],b[4],1])
# second pass merge
changed=True
while changed:
    changed=False
    for i in range(len(groups)):
        for j in range(i+1,len(groups)):
            a,b=groups[i],groups[j]
            if abs((a[1]+a[3])/2-(b[1]+b[3])/2)<14 and a[0]<b[2]+14 and a[2]>b[0]-14:
                a[0]=min(a[0],b[0]); a[1]=min(a[1],b[1]); a[2]=max(a[2],b[2]); a[3]=max(a[3],b[3]); a[4]+=b[4]; a[5]+=b[5]; groups.pop(j); changed=True; break
        if changed: break
groups.sort(key=lambda g:(g[1],g[0]))
for g in groups: print('x %d..%d (w %d) y %d..%d (h %d) cx %.1f  px %d glyphs %d'%(g[0],g[2],g[2]-g[0]+1,g[1],g[3],g[3]-g[1]+1,(g[0]+g[2]+1)/2,g[4],g[5]))
np.save('work/textboxes.npy',np.array([g[:4] for g in groups]))
np.save('work/textmask.npy',txt)
