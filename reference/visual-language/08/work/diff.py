"""diff.py orig.png render.png out_diff.png --mask x0,y0,x1,y1 ... --shape KIND
Metrics: MAE (0-255, mean over RGB and unmasked px), % px with max-channel |diff| > 24,
and IoU of a shape mask computed identically on both images. The mask rectangles
(text) are excluded from MAE/%>24 and from IoU. diff.png: grey = original luminance at 35%,
red = pixels only in original shape mask, cyan = only in replica, black = |diff|>24 elsewhere,
hatched blue tint = masked region."""
import sys, json, numpy as np
from PIL import Image
def load(p): return np.array(Image.open(p).convert('RGB')).astype(float)
def shape_mask(im, kind):
    r,g,b=im[...,0],im[...,1],im[...,2]
    lum=0.2126*r+0.7152*g+0.0722*b
    if kind=='red':   # 08: red disc (alpha>0.5 on paper->red axis)
        paper=np.array([0xF2,0xEF,0xE8],float); red=np.array([0xDF,0x29,0x14],float); d=red-paper
        return ((im-paper)@d)/(d@d)>0.5
    if kind=='light': return lum>128      # white rings on black
    if kind=='dark':  return lum<128      # black ink on light
    raise SystemExit('kind?')
def run(orig, rend, out, masks, kind, region=None):
    A=load(orig); B=load(rend)
    assert A.shape==B.shape, (A.shape,B.shape)
    H,W,_=A.shape
    keep=np.ones((H,W),bool)
    for (x0,y0,x1,y1) in masks: keep[y0:y1,x0:x1]=False
    if region is not None:
        x0,y0,x1,y1=region; reg=np.zeros((H,W),bool); reg[y0:y1,x0:x1]=True; keep&=reg
    d=np.abs(A-B)
    mae=d[keep].mean()
    big=(d.max(2)>24)
    pct=100*big[keep].mean()
    ma=shape_mask(A,kind)&keep; mb=shape_mask(B,kind)&keep
    iou=(ma&mb).sum()/max(1,(ma|mb).sum())
    lumA=(0.2126*A[...,0]+0.7152*A[...,1]+0.0722*A[...,2])
    vis=np.stack([255-0.35*(255-lumA)]*3,-1)
    vis[big&keep]=[0,0,0]
    vis[ma&~mb]=[230,30,30]
    vis[mb&~ma]=[0,170,200]
    hatch=((np.add.outer(np.arange(H),np.arange(W))//3)%2==0)
    vis[(~keep)&hatch]=vis[(~keep)&hatch]*0.6+np.array([80,110,255])*0.4
    Image.fromarray(vis.clip(0,255).astype(np.uint8)).save(out)
    return dict(mae=round(float(mae),2), pct_gt24=round(float(pct),2), iou=round(float(iou),4),
                shape_px_orig=int(ma.sum()), shape_px_rep=int(mb.sum()), px_compared=int(keep.sum()))
if __name__=='__main__':
    orig,rend,out=sys.argv[1:4]
    cfg=json.loads(sys.argv[4]) if len(sys.argv)>4 else {}
    print(json.dumps(run(orig,rend,out,cfg.get('masks',[]),cfg.get('kind','dark'),cfg.get('region'))))
