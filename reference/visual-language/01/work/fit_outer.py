import sys; sys.path.insert(0,'work')
from fit_edges import *
def vbound(prof):
    n=len(prof)
    for i in range(12,n-20):
        if prof[i]>=153>prof[i+1] and (prof[i-6:i]>175).all() and ((prof[i+4:i+14]>55)&(prof[i+4:i+14]<125)).all():
            return r[i]+(prof[i]-153)/(prof[i]-prof[i+1])*0.5
    return np.nan
def tbound(prof):
    for i in range(len(prof)-2,0,-1):
        if prof[i]>=62>prof[i+1]: return r[i]+(prof[i]-62)/(prof[i]-prof[i+1])*0.5
    return np.nan
ds=np.arange(-22.3,22.31,0.1)
res={}
for kind,fn in [('value',vbound),('track',tbound)]:
    allrc=[]
    for k in range(8):
        data=np.array([fn(P[:,int(round((22.5+45*k+d)*10))%3600]) for d in ds])
        ok=~np.isnan(data)&(data<400)
        best=None
        Rg=np.nanmedian(data[np.abs(ds)<8])
        for R in np.arange(Rg-1.5,Rg+1.51,0.1):
            for rc in np.arange(10,45,0.25):
                m=np.array([boundary(R,rc,0.9,np.deg2rad(d)) for d in ds[ok]])
                mm=np.isfinite(m)&(m<R+60)
                e=np.mean((m[mm]-data[ok][mm])**2)
                if best is None or e<best[0]: best=(e,R,rc)
        print(f'{kind} {names[k]:13s} R={best[1]:.2f} rc={best[2]:.2f} rms={np.sqrt(best[0]):.2f} n={ok.sum()}')
        allrc.append(best[2]); res[(kind,k)]=best
    print(kind,'rc median',np.median(allrc))
np.save('work/outerfit.npy',np.array([[res[(kd,k)][1],res[(kd,k)][2],np.sqrt(res[(kd,k)][0])] for kd in ['value','track'] for k in range(8)]))
