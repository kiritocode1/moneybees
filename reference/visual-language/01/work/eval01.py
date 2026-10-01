import sys; sys.path.insert(0,'work')
from diff import *
from common import SRC
orig=load(SRC); rend=load(sys.argv[1] if len(sys.argv)>1 else 'work/replica_try.png')
boxes=np.load('work/textboxes.npy'); boxes=[b for b in boxes if b[3]-b[1]>3]
# replica text boxes: where render differs from the no-text render
nt=load('work/replica_notext.png') if len(sys.argv)<3 else load(sys.argv[2])
rt=np.abs(rend-nt).max(2)>10
ys,xs=np.nonzero(rt)
mask=boxmask(boxes,orig.shape,5)
# add replica text bbox per original box neighbourhood
for x0,y0,x1,y1 in boxes:
    sel=(xs>x0-40)&(xs<x1+40)&(ys>y0-8)&(ys<y1+8)
    if sel.any(): mask[ys[sel].min()-3:ys[sel].max()+4, xs[sel].min()-3:xs[sel].max()+4]=True
mae,pct,d=metrics(orig,rend,mask)
Lo=orig.mean(2); Lr=rend.mean(2)
keep=~mask
print('mask: %.2f%% of image'%(100*mask.mean()))
print('MAE %.2f  pct>24 %.3f%%'%(mae,pct))
for name,thr in [('value (L>153)',153),('track+value (L>62)',62)]:
    a=(Lo>thr)&keep; b=(Lr>thr)&keep; print(name,'IoU %.4f'%iou(a,b))
# unmasked whole-image numbers for honesty
d_all=np.abs(orig-rend); print('unmasked MAE %.2f pct>24 %.3f%%'%(d_all.mean(),100*(d_all.max(2)>24).mean()))
diff_png(d,mask,sys.argv[3] if len(sys.argv)>3 else 'work/diff_try.png')
np.save('work/mask01.npy',mask)
