from PIL import Image; import numpy as np
from collections import deque
im=np.array(Image.open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/03-futerra-glyph-columns.png').convert('RGB')).astype(float); L=im.mean(2); H,W=L.shape
def cc(mask,conn=1):
    lab=np.zeros(mask.shape,int); cur=0; ys,xs=np.nonzero(mask); comps=[]
    for y0,x0 in zip(ys,xs):
        if lab[y0,x0]: continue
        cur+=1; q=deque([(y0,x0)]); lab[y0,x0]=cur; pts=[]
        while q:
            y,x=q.popleft(); pts.append((y,x))
            for dy in range(-conn,conn+1):
                for dx in range(-conn,conn+1):
                    yy,xx=y+dy,x+dx
                    if 0<=yy<H and 0<=xx<W and mask[yy,xx] and not lab[yy,xx]:
                        lab[yy,xx]=cur; q.append((yy,xx))
        p=np.array(pts); comps.append([p[:,1].min(),p[:,0].min(),p[:,1].max(),p[:,0].max(),len(p)])
    return comps,lab
if __name__=='__main__':
    m=L>90
    comps,_=cc(m)
    comps=[c for c in comps if c[4]>=2]
    # merge into blocks with generous gaps (words/lines)
    def merge(comps,gx,gy):
        bs=[list(c) for c in comps]; ch=True
        while ch:
            ch=False
            for i in range(len(bs)):
                for j in range(i+1,len(bs)):
                    a,b=bs[i],bs[j]
                    if a[0]-gx<=b[2] and b[0]-gx<=a[2] and a[1]-gy<=b[3] and b[1]-gy<=a[3]:
                        bs[i]=[min(a[0],b[0]),min(a[1],b[1]),max(a[2],b[2]),max(a[3],b[3]),a[4]+b[4]]; bs.pop(j); ch=True; break
                if ch: break
        return sorted(bs,key=lambda b:(b[1]//40,b[0]))
    for b in merge(comps,6,3): print('x %3d..%3d w %3d  y %3d..%3d h %2d  px %d'%(b[0],b[2],b[2]-b[0]+1,b[1],b[3],b[3]-b[1]+1,b[4]))
