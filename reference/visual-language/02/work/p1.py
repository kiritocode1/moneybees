from PIL import Image; import numpy as np
im=np.array(Image.open('../../02-unit8-circles.png').convert('RGB')).astype(float)
lum=im.mean(2)
H,W=lum.shape
# coarse poster boxes from column/row occupancy
m=lum>10
cols=m.mean(0); rows=m.mean(1)
def runs(v,th):
    r=[];inb=False
    for i,x in enumerate(v):
        if x>th and not inb: s=i; inb=True
        if x<=th and inb: r.append((s,i-1)); inb=False
    if inb: r.append((s,len(v)-1))
    return r
print('col runs',runs(cols,0.3)); print('row runs',runs(rows,0.3))
