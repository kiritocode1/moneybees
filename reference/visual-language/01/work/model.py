import sys; sys.path.insert(0,'work')
from common import *
from geom import *
c=(589.5,584.2); names=['Happiness','Awe','Admiration','Surprise','Sadness','Fear','Anger','Anticipation']
Rv=[361.02,321.75,282.57,360.87,277.92,219.34,167.06,282.42]; RT=391.6
RC_V=29.0; RC_T=30.0; RHO=31.95; Hh=0.9
def build(Rv=Rv,RT=RT,rcv=RC_V,rct=RC_T,rho=RHO,h=Hh):
    tr=[wedge(c,np.radians(45*k),np.radians(45*k+45),RT,rct,rho,h) for k in range(8)]
    va=[wedge(c,np.radians(45*k),np.radians(45*k+45),Rv[k],rcv,rho,h) for k in range(8)]
    return tr,va
if __name__=='__main__':
    tr,va=build()
    mt=raster([p for _,p in tr],W,H); mv=raster([p for _,p in va],W,H)
    np.save('work/mt.npy',mt); np.save('work/mv.npy',mv)
    # observed masks
    ov=(L>153).astype(float); ot=(L>62).astype(float)
    # text-robust: evaluate IoU excluding pixels where observed is dark inside the model (text)
    for name,m,o in [('value',mv,ov),('track+value',np.maximum(mt,mv),ot)]:
        mb=m>0.5; ob=o>0.5
        inter=(mb&ob).sum(); uni=(mb|ob).sum(); print(name,'raw IoU',round(inter/uni,4))
