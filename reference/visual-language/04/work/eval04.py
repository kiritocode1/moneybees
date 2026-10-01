import sys; sys.path.insert(0,'/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/01/work')
from diff import *
SRC='/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/04-payto-line-cards.png'
o=load(SRC); r=load('replica.png'); nt=load('work/replica_notext.png')
CARDS=[43.91,210.18,376.2,542.28]
TXT=[]
for x in CARDS:
    x=int(x); TXT+= [(x+17,146,x+140,193),(x+17,303,x+72,313)]
mask=boxmask(TXT,o.shape,2)
rt=np.abs(r-nt).max(2)>8; ys,xs=np.nonzero(rt)
for x0,y0,x1,y1 in TXT:
    sel=(xs>x0-5)&(xs<x1+40)&(ys>y0-5)&(ys<y1+5)
    if sel.any(): mask[ys[sel].min()-2:ys[sel].max()+3, xs[sel].min()-2:xs[sel].max()+3]=True
mae,pct,d=metrics(o,r,mask)
print('mask %.2f%% of image; MAE %.2f; pct>24 %.3f%%'%(100*mask.mean(),mae,pct))
Lo=o.mean(2); Lr=r.mean(2); Oo=o[...,0]-o[...,2]; Or=r[...,0]-r[...,2]
for name,(x0,y0,x1,y1) in [('cylinder',(80,202,157,279)),('fan',(236,205,335,295)),('burst',(400,198,500,300)),('distribute',(558,215,675,282))]:
    a=(Oo[y0:y1,x0:x1]>60); b=(Or[y0:y1,x0:x1]>60)
    wa=(Lo[y0:y1,x0:x1]>150)&~a; wb=(Lr[y0:y1,x0:x1]>150)&~b
    ca=np.clip((Lo[y0:y1,x0:x1]-75)/165,0,1); cb=np.clip((Lr[y0:y1,x0:x1]-75)/165,0,1)
    print(f'{name:10s} accent IoU {iou(a,b):.3f} (px {a.sum()} vs {b.sum()})  white-line IoU {iou(wa,wb):.3f}  soft IoU {np.minimum(ca,cb).sum()/np.maximum(ca,cb).sum():.3f}  local MAE {np.abs(o[y0:y1,x0:x1]-r[y0:y1,x0:x1]).mean():.2f}')
cards_o=np.abs(Lo-75)<4; cards_r=np.abs(Lr-75)<4
print('card-fill mask IoU (|L-75|<4, text masked) %.4f'%iou(cards_o&~mask,cards_r&~mask))
dd=np.abs(o-r); print('unmasked MAE %.2f pct>24 %.3f%%'%(dd.mean(),100*(dd.max(2)>24).mean()))
diff_png(d,mask,'diff.png')
