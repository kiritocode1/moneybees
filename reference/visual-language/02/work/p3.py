import numpy as np, json
from rings import *
# poster 1 grid: guess from zoom
res=[]
for j,cy in enumerate([165,225.5,286]):
    for i,cx in enumerate([116,176,236,296]):
        if i==1 and j<2:
            d=disc(cx+0.5,cy+0.5,29.5); d['kind']='disc'
        else:
            d=ring(cx+0.5,cy+0.5,29.0); d['kind']='ring'
        d['i']=i;d['j']=j; res.append(d)
        print(f"r{j}c{i} {d['kind']:4s} c=({d['cx']:.2f},{d['cy']:.2f}) r={d['r']:.2f} rms={d['rms']:.3f} " + (f"stroke={d['stroke']:.2f} peak={d['peak']:.0f} ell={d['ell_ax'].round(2)}" if d['kind']=='ring' else f"inner={d['inner']:.0f}"))
