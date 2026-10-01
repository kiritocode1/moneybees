# Background of 04 is a photographic grey light-streak on black: model it as a smoothed low-res raster.
from PIL import Image, ImageFilter; import numpy as np, base64, io
SRC='/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/04-payto-line-cards.png'
im=np.array(Image.open(SRC).convert('RGB')).astype(float); L=im.mean(2); H,W=L.shape
CARDS=[43.91,210.18,376.2,542.28]; CW=149.2; CT=125.5; CH=202.0
bgm=np.ones((H,W),bool)
for x0 in CARDS: bgm[int(CT)-3:int(CT+CH)+4,int(x0)-3:int(x0+CW)+4]=False
bgm[449:,:]=False
# fill masked pixels by iterative diffusion on a 1/3 grid
s=3; h,w=H//s+1,W//s+1
acc=np.zeros((h,w)); cnt=np.zeros((h,w))
ys,xs=np.nonzero(bgm); np.add.at(acc,(ys//s,xs//s),L[ys,xs]); np.add.at(cnt,(ys//s,xs//s),1)
known=cnt>0; g=np.where(known,acc/np.maximum(cnt,1),0.0)
for _ in range(3000):
    p=np.pad(g,1,mode='edge'); avg=(p[:-2,1:-1]+p[2:,1:-1]+p[1:-1,:-2]+p[1:-1,2:])/4
    g=np.where(known,g,avg)
img=Image.fromarray(np.clip(g,0,255).astype(np.uint8)).resize((W,H),Image.BICUBIC).filter(ImageFilter.GaussianBlur(2))
small=img.resize((W//3,H//3),Image.LANCZOS)
buf=io.BytesIO(); small.save(buf,'PNG',optimize=True)
open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/04/work/bg_uri.txt','w').write('data:image/png;base64,'+base64.b64encode(buf.getvalue()).decode())
back=np.array(small.resize((W,H),Image.BILINEAR)).astype(float)
print('bg model MAE on known bg pixels %.2f  (raster %dx%d, %d bytes)'%(np.abs(back[bgm]-L[bgm]).mean(),W//3,H//3,len(buf.getvalue())))
