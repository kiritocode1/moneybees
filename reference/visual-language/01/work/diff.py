# Diff a Chrome render against the original. Metrics: MAE (mean |diff| over RGB, 0-255) and % of pixels whose
# max-channel |diff| > 24, both computed outside the text mask. Writes diff.png: grey = |diff| x3, red tint = masked.
import sys, json; import numpy as np; from PIL import Image
def load(p): return np.array(Image.open(p).convert('RGB')).astype(float)
def metrics(orig,rend,mask):
    d=np.abs(orig-rend); keep=~mask
    mae=d[keep].mean(); big=(d.max(axis=2)>24)
    return mae, 100*big[keep].mean(), d
def diff_png(d,mask,out):
    v=np.clip(d.max(axis=2)*3,0,255)
    rgb=np.stack([v,v,v],2)
    rgb[mask]=rgb[mask]*0.35+np.array([120,20,20])*0.65
    Image.fromarray(rgb.astype(np.uint8)).save(out)
def iou(a,b): return (a&b).sum()/max((a|b).sum(),1)
def boxmask(boxes,shape,pad):
    m=np.zeros(shape[:2],bool)
    for x0,y0,x1,y1 in boxes: m[max(0,y0-pad):y1+1+pad, max(0,x0-pad):x1+1+pad]=True
    return m
