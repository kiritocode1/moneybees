from PIL import Image; import numpy as np, json
im=np.array(Image.open('../../02-unit8-circles.png').convert('RGB')).astype(float)
P=json.load(open('posters.json')); lum=im.mean(2)
def bbox(mask,x0,y0):
    ys,xs=np.where(mask)
    if len(xs)==0: return None
    return (xs.min()+x0,ys.min()+y0,xs.max()+x0+1,ys.max()+y0+1)
for k,p in enumerate(P):
    l,t=p['l'],p['t']; w=p['r']-p['l']; h=p['b']-p['t']
    L=lum[int(t):int(p['b']),int(l):int(p['r'])]
    ox,oy=int(l)-l,int(t)-t  # local offset of array index 0
    def reg(x0,y0,x1,y1,th=90):
        sub=L[y0:y1,x0:x1]; m=sub>th
        b=bbox(m,x0,y0)
        if b is None: return None
        return tuple(round(v+o,1) for v,o in zip(b,(ox,oy,ox,oy)))
    print(f'poster{k+1} w={w:.1f} h={h:.1f}')
    print('  logo   ', reg(5,5,110,60))
    print('  tag    ', reg(150,5,int(w)-5,60,th=70))
    print('  url    ', reg(int(w)-45,300,int(w)-3,int(h)-5,th=70))
    print('  word   ', reg(5,280,int(w)-45,int(h)-5))
    # row profile of word region for baselines
    sub=L[280:int(h)-5,5:int(w)-45]>90
    rows=sub.sum(1)
    ys=np.where(rows>0)[0]
    bands=[];s=ys[0];pr=ys[0]
    for y in ys[1:]:
        if y-pr>3: bands.append((s+280+oy,pr+281+oy)); s=y
        pr=y
    bands.append((s+280+oy,pr+281+oy))
    print('  word row bands', [(round(a,1),round(b,1)) for a,b in bands])
