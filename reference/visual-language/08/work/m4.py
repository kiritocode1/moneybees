from PIL import Image; import numpy as np
im=np.array(Image.open('../../08-growing-circles.png').convert('RGB')).astype(float)
lum=0.2126*im[...,0]+0.7152*im[...,1]+0.0722*im[...,2]
paperL=0.2126*0xF2+0.7152*0xEF+0.0722*0xE8
ink=np.clip((paperL-lum)/(paperL-25),0,1)
ink[:300]=0
np.save('ink.npy',ink)
rows=ink.sum(1)
inb=False
for y in range(300,552):
    if rows[y]>1.0 and not inb: y0=y; inb=True
    if rows[y]<=1.0 and inb:
        inb=False; band=ink[y0:y]
        cols=band.sum(0); xs=np.where(cols>0.3)[0]
        if len(xs)==0: continue
        groups=[]; s=xs[0]; p=xs[0]
        for x in xs[1:]:
            if x-p>25: groups.append((int(s),int(p))); s=x
            p=x
        groups.append((int(s),int(p)))
        prof=rows[y0:y]
        print(f'y {y0}-{y-1} h={y-y0} peakrow={y0+int(np.argmax(prof))}', groups)
