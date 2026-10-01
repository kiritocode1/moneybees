import json, numpy as np
from PIL import Image
from diff import run
P=json.load(open('posters.json')); P[2]['r']=355.3
names=['building-blocks','team','cooperation','impact']
word_right={0:180,1:128,2:264,3:175}
word_top={0:310,1:358,2:358,3:355}
allmasks=[]; res={}
for k,p in enumerate(P):
    l,t=p['l'],p['t']; w=p['r']-l; h=p['b']-t
    x0,y0=int(np.ceil(l))+2,int(np.ceil(t))+2; x1,y1=int(np.floor(p['r']))-2,int(np.floor(p['b']))-2
    loc=lambda a,b,c,d:[int(l+a),int(t+b),int(np.ceil(l+c)),int(np.ceil(t+d))]
    masks=[loc(14,14,70,40), loc(w-62,18,w-14,34), loc(w-30,352,w-18,398), loc(12,word_top[k],word_right[k],404)]
    allmasks+=masks
    A=np.array(Image.open('../../02-unit8-circles.png').convert('RGB'))[y0:y1,x0:x1]
    B=np.array(Image.open('../replica.png').convert('RGB'))[y0:y1,x0:x1]
    Image.fromarray(A).save(f'crop-orig-{k+1}.png'); Image.fromarray(B).save(f'crop-rep-{k+1}.png')
    lm=[[a-x0,b-y0,c-x0,d-y0] for a,b,c,d in masks]
    r=run(f'crop-orig-{k+1}.png',f'crop-rep-{k+1}.png',f'../diff-{k+1}-{names[k]}.png',lm,'light')
    r_all=run(f'crop-orig-{k+1}.png',f'crop-rep-{k+1}.png','/tmp/_x.png',[],'light')
    res[names[k]]=dict(text_masked=r, unmasked=dict(mae=r_all['mae'],pct_gt24=r_all['pct_gt24'],iou=r_all['iou']), crop=[x0,y0,x1,y1])
    print(names[k], r, '| unmasked', res[names[k]]['unmasked'])
r=run('../../02-unit8-circles.png','../replica.png','../diff.png',allmasks,'light')
print('composite (text masked, incl. black surround)', r)
res['composite']=r
json.dump(dict(results=res,masks=allmasks),open('metrics.json','w'),indent=1)
