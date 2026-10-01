from rings import *
import json
bg=23.3
s=json.load(open('p4seed.json'))
f=s['front']; dirv=np.array(s['dir'])
# extend search further
a=np.linspace(0,2*np.pi,1440,endpoint=False)
ts=np.arange(130,200,0.25); sc=[]
for t in ts:
    cx=f[0]+dirv[0]*t; cy=f[1]+dirv[1]*t
    sc.append(np.median(bil(LUM,cx-0.5+f[2]*np.cos(a),cy-0.5+f[2]*np.sin(a))-bg))
sc=np.array(sc); print('tail scores every 2.5:',[round(v,1) for v in sc[::10]])
seeds=[0,11.5,23,34.5,46.25,57.75,69.25,80.5,91.75,103.5,115,126.5,138.25]
rings_=[]
for t in seeds:
    cx=f[0]+dirv[0]*t; cy=f[1]+dirv[1]*t
    d=ring(cx,cy,f[2],bg=bg,win=3.0,n=1440)
    rings_.append(d)
    print(f"t={t:6.2f} c=({d['cx']:.2f},{d['cy']:.2f}) r={d['r']:.2f} rms={d['rms']:.3f} stroke={d['stroke']:.2f} peak={d['peak']:.0f} kept={d['kept']:.2f}")
json.dump([[d['cx'],d['cy'],d['r'],d['stroke']] for d in rings_],open('p4rings.json','w'))
c=np.array([[d['cx'],d['cy']] for d in rings_])
st=np.diff(c,axis=0); print('steps',st.round(2)); print('mean step',st.mean(0).round(3),'len',np.hypot(*st.mean(0)).round(3),'angle deg',np.degrees(np.arctan2(-st.mean(0)[1],st.mean(0)[0])).round(2))
