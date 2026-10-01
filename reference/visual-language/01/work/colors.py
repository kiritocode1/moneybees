import sys; sys.path.insert(0,'work')
from fit_edges import *
cx,cy=589.5,584.2
yy,xx=np.mgrid[0:H,0:W]; X=xx+0.5; Y=yy+0.5
dx=X-cx; dy=Y-cy; R=np.hypot(dx,dy); A=(np.degrees(np.arctan2(dx,-dy))+360)%360
k=(A//45).astype(int); d=A-(k*45+22.5)
Rv=np.array([361.02,321.75,282.57,360.87,277.92,219.34,167.06,282.42])
# text mask: dark pixels inside disc away from gaps/hole
dist_ray=np.minimum(np.abs(np.sin(np.radians(A-k*45)))*R, np.abs(np.sin(np.radians(A-(k+1)*45)))*R)
chart=(R<385)
Lm=L.copy()
text=chart&(R>70)&(dist_ray>4)
# value interior (away from edges)
vin=(R>80)&(R<Rv[k]-6)&(dist_ray>5)&(L>160)
tin=(R>Rv[k]+6)&(R<385)&(dist_ray>6)&(L>60)&(L<120)
def fitlin(mask,name):
    px=im[mask]; x=X[mask]; y=Y[mask]
    Amat=np.c_[np.ones(len(x)),x,y]
    coef,res,_,_=np.linalg.lstsq(Amat,px,rcond=None)
    pred=Amat@coef; rms=np.sqrt(np.mean((pred-px)**2,axis=0))
    print(name,'n=',mask.sum(),'mean',px.mean(0).round(1),'median',np.median(px,0))
    print('  linear fit rgb = c0 + cx*x + cy*y:',coef.round(4).tolist(),'rms',rms.round(2))
    return coef
cv=fitlin(vin,'value')
ct=fitlin(tin,'track')
bg=(R>420)&(Y<1165)
print('bg',np.median(im[bg],0),im[bg].std(0).round(2), bg.sum())
# evaluate gradient at corners of chart bbox
for (x,y) in [(200,195),(980,975),(200,975),(980,195),(590,584)]:
    print((x,y),'value',(cv[0]+cv[1]*x+cv[2]*y).round(1),'track',(ct[0]+ct[1]*x+ct[2]*y).round(1))
# per-sector medians
for kk in range(8):
    print(names[kk],'value med',np.median(im[vin&(k==kk)],0),'track med',np.median(im[tin&(k==kk)],0) if (tin&(k==kk)).sum() else None)
# bottom bar
for y in range(1164,1176): print(y, im[y,600].astype(int), im[y,100].astype(int))
