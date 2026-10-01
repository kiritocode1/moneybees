from PIL import Image; import numpy as np
SRC='/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/01-radial-wedges.png'
im=np.array(Image.open(SRC).convert('RGB')).astype(float); L=im.mean(axis=2)
H,W=L.shape
def bil(img,x,y):
    # x,y in SVG continuous coords (pixel i covers [i,i+1]); convert to index space
    x=np.asarray(x)-0.5; y=np.asarray(y)-0.5
    x0=np.floor(x).astype(int); y0=np.floor(y).astype(int); fx=x-x0; fy=y-y0
    x0=np.clip(x0,0,img.shape[1]-2); y0=np.clip(y0,0,img.shape[0]-2)
    a=img[y0,x0]; b=img[y0,x0+1]; c=img[y0+1,x0]; d=img[y0+1,x0+1]
    if img.ndim==3: fx=fx[...,None]; fy=fy[...,None]
    return a*(1-fx)*(1-fy)+b*fx*(1-fy)+c*(1-fx)*fy+d*fx*fy
