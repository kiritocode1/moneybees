import sys; sys.path.insert(0,'/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/01/work'); sys.path.insert(0,'work')
from diff import *
SRC='/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/03-futerra-glyph-columns.png'
o=load(SRC); r=load('replica.png'); nt=load('work/replica_notext.png')
# text boxes measured on the original (x0,y0,x1,y1): label, headings, bodies, page number
TXT=[(57,289,92,295),(83,404,231,457),(291,404,360,455),(499,404,629,457),(83,481,229,549),(291,481,443,563),(499,481,641,575),(57,624,66,630)]
mask=boxmask(TXT,o.shape,3)
rt=np.abs(r-nt).max(2)>8; ys,xs=np.nonzero(rt)
for x0,y0,x1,y1 in TXT:
    sel=(xs>x0-30)&(xs<x1+60)&(ys>y0-6)&(ys<y1+6)
    if sel.any(): mask[ys[sel].min()-2:ys[sel].max()+3, xs[sel].min()-2:xs[sel].max()+3]=True
mae,pct,d=metrics(o,r,mask)
print('mask %.2f%% of image; MAE %.2f; pct>24 %.3f%%'%(100*mask.mean(),mae,pct))
Lo=o.mean(2); Lr=r.mean(2)
for name,(x0,y0,x1,y1) in [('glyph1',(78,340,130,394)),('glyph2',(286,340,338,394)),('glyph3',(494,340,548,394))]:
    a=Lo[y0:y1,x0:x1]>144; b=Lr[y0:y1,x0:x1]>144
    print(name,'IoU %.3f'%iou(a,b),'ink orig %d replica %d'%(a.sum(),b.sum()), 'local MAE %.2f'%np.abs(o[y0:y1,x0:x1]-r[y0:y1,x0:x1]).mean())
card_o=(Lo>29.5); card_r=(Lr>29.5); print('card+content mask IoU (L>29.5) %.4f'%iou(card_o&~mask,card_r&~mask))
dd=np.abs(o-r); print('unmasked MAE %.2f pct>24 %.3f%%'%(dd.mean(),100*(dd.max(2)>24).mean()))
diff_png(d,mask,'diff.png')
