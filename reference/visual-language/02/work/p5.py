from rings import *
import json
bg=23.3
# 1) front ring
f=ring(581.5,644,72.5,bg=bg,win=3)
print('front',{k:(round(v,2) if isinstance(v,float) else v) for k,v in f.items() if k in('cx','cy','r','rms','stroke','peak','kept')})
# 2) search along diagonal: score = mean of max(lum-bg) sampled on circle of radius R centred at c(t)
a=np.linspace(0,2*np.pi,1440,endpoint=False)
R=f['r']
best=[]
dirv=np.array([-1.0,1.03]); dirv/=np.linalg.norm(dirv)
ts=np.arange(0,140,0.25)
sc=[]
for t in ts:
    cx=f['cx']+dirv[0]*t; cy=f['cy']+dirv[1]*t
    X=cx-0.5+R*np.cos(a); Y=cy-0.5+R*np.sin(a)
    v=bil(LUM,X,Y)-bg
    sc.append(np.median(v))
sc=np.array(sc)
pk=[i for i in range(1,len(ts)-1) if sc[i]>=sc[i-1] and sc[i]>=sc[i+1] and sc[i]>8]
print('peaks t:',[round(ts[i],2) for i in pk]); print('scores:',[round(sc[i],1) for i in pk])
json.dump(dict(front=[f['cx'],f['cy'],f['r']],t=[float(ts[i]) for i in pk],dir=list(dirv)),open('p4seed.json','w'))
