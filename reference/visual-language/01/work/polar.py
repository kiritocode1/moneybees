import sys; sys.path.insert(0,'work')
from common import *
cx,cy=589.5,584.2
# angles measured clockwise from 12 o'clock (screen), like a compass
th=np.deg2rad(np.arange(0,360,0.1)); r=np.arange(0,420,0.5)
T,R=np.meshgrid(th,r)
X=cx+R*np.sin(T); Y=cy-R*np.cos(T)
P=bil(L,X,Y)
np.save('work/polar.npy',P)
# gap angles at several radii: minima of luminance in angle
for rad in [100,150,200,250,380]:
    ri=int(rad/0.5); prof=P[ri]
    mins=[]
    for k in range(8):
        a0=k*45; idx=np.arange(int((a0-6)*10),int((a0+6)*10))%3600
        seg=prof[idx]; ref=np.percentile(seg,80); w=np.clip(ref-seg,0,None); w[w<ref*0.3]=0
        ang=(idx/10.0); ang=np.where(ang>a0+180,ang-360,ang)
        c=(w*ang).sum()/max(w.sum(),1e-9); width=(w/ref).sum()*0.1
        mins.append((round(c,2),round(width,2)))
    print(rad,mins)
