from rings import *
# dark rings on light: invert luminance
INV=255-LUM
bg=255-242
out=[]
for cx in (153,218,282,346,410):
    d=ring(cx,186,33.5,bg=bg,win=3.0,n=1440,img=INV)
    out.append(d)
    print(f"c=({d['cx']:.2f},{d['cy']:.2f}) r={d['r']:.2f} rms={d['rms']:.3f} stroke={d['stroke']:.2f} peak={255-d['peak']:.0f} kept={d['kept']:.2f} ell={d['ell_ax'].round(2)}")
import numpy as np
c=[d['cx'] for d in out]; print('pitch',np.diff(c).round(2),'mean',np.diff(c).mean().round(3))
