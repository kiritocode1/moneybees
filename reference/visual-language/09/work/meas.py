import numpy as np
from PIL import Image
im=np.array(Image.open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/09-process-diagram-sheet.png').convert('RGB')).astype(float); L=im.mean(2)
INK=np.clip((242-L)/(242-51),0,1)
def line_pos(axis,a0,a1,b0,b1):
    """axis='v': vertical line within cols a0..a1, rows b0..b1 -> (x centre, integrated width). 'h' analogous."""
    if axis=='v': prof=INK[b0:b1,a0:a1].mean(0)
    else: prof=INK[a0:a1,b0:b1].mean(1)
    idx=np.arange(a0,a1)+0.5; w=prof.clip(0); w=np.where(w>0.05,w,0)
    return (idx*w).sum()/w.sum(), w.sum()
def period(sig):
    s=sig-sig.mean(); ac=np.correlate(s,s,'full')[len(s)-1:]; ac/=ac[0]
    for k in range(2,len(ac)-1):
        if ac[k]>ac[k-1] and ac[k]>=ac[k+1] and ac[k]>0.15:
            a,b,c=ac[k-1],ac[k],ac[k+1]; return round(k+0.5*(a-c)/(a-2*b+c),3), round(ac[k],2)
def edge_cross(prof,lvl,x0):
    for i in range(len(prof)-1):
        a,b=prof[i],prof[i+1]
        if (a-lvl)*(b-lvl)<=0 and a!=b: return x0+i+0.5+(lvl-a)/(b-a)
def fit_arm(x0,x1,y0,y1):
    pts=[]
    for y in range(y0,y1):
        row=INK[y,x0:x1]; m=row>0.08
        if row[m].sum()<0.15: continue
        xs=np.arange(x0,x1)[m]+0.5; pts.append(((xs*row[m]).sum()/row[m].sum(),y+0.5))
    pts=np.array(pts); k,b=np.polyfit(pts[:,1],pts[:,0],1); return pts,k,b
