from rings import *
INV=255-LUM; bg=13
print('-- venn')
for (cx,cy) in [(125,378),(100,429),(151,429)]:
    d=ring(cx+15,cy+15,32.5,bg=bg,win=3.0,n=1440,img=INV)
    print(f"c=({d['cx']:.2f},{d['cy']:.2f}) r={d['r']:.2f} rms={d['rms']:.3f} stroke={d['stroke']:.2f} peak={255-d['peak']:.0f} kept={d['kept']:.2f}")
print('-- common data disc')
d=disc(248.5+0.5,416,32.5,bg=242,img=LUM*0+ (255-LUM))
