import sys; sys.path.insert(0,'work')
from common import *
P=np.load('work/polar.npy'); r=np.arange(0,420,0.5)
names=['Happiness','Awe','Admiration','Surprise','Sadness','Fear','Anger','Anticipation']
vals=[12,10,5,12,6,4,2,5]
def sub(prof,i,mid):
    a,b=prof[i],prof[i+1]; return r[i]+(a-mid)/(a-b)*0.5
def measure(prof):
    n=len(prof)
    # hole->value: first up-crossing of 126
    hole=np.nan
    for i in range(n-1):
        if prof[i]<=126<prof[i+1]: hole=sub(prof,i,126); break
    # value->track: down-crossing of 153 with >180 for 6 samples before and 65..120 for 16 samples after
    vout=np.nan
    for i in range(12,n-20):
        if prof[i]>=153>prof[i+1] and (prof[i-6:i]>175).all() and ((prof[i+4:i+20]>60)&(prof[i+4:i+20]<125)).all():
            vout=sub(prof,i,153); break
    # track->bg: last down-crossing of 62
    tout=np.nan
    for i in range(n-2,0,-1):
        if prof[i]>=62>prof[i+1]: tout=sub(prof,i,62); break
    return hole,vout,tout
out=[]
for k in range(8):
    bis=22.5+45*k
    res=np.array([measure(P[:,int(round((bis+d)*10))%3600]) for d in np.arange(-12,12.01,0.5)])
    med=np.nanmedian(res,axis=0); sd=np.nanstd(res,axis=0); cnt=np.sum(~np.isnan(res),axis=0)
    out.append(med)
    print(f'{names[k]:13s} v={vals[k]:2d} hole={med[0]:.2f}(sd {sd[0]:.2f}) value_outer={med[1]:.2f}(sd {sd[1]:.2f}, n={cnt[1]}) track_outer={med[2]:.2f}(sd {sd[2]:.2f})')
np.save('work/radii.npy',np.array(out))
