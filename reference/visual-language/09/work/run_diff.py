import json
from diff import run
M=[(170,28,395,52),(30,76,165,112),(30,292,140,329),(30,516,125,550),(30,748,150,781),(125,172,440,202),
   (110,368,141,388),(85,412,112,440),(140,412,168,440),(228,403,268,430),(335,380,376,455),(440,403,482,430),
   (70,619,98,632),(190,619,228,632),(180,578,238,590),(330,576,355,590),(325,619,360,632),(325,660,360,686),(422,619,453,632),(468,619,496,632),
   (160,801,210,813),(428,793,485,805),(428,885,475,897),(274,803,289,818),(274,834,289,849),(274,865,289,880),(275,899,288,913),(28,930,540,1010)]
res={}
res['text_masked_ink']=run('../../09-process-diagram-sheet.png','../replica.png','../diff.png',M,'ink')
res['text_masked_dark']=run('../../09-process-diagram-sheet.png','../replica.png','/tmp/_d.png',M,'dark')
res['unmasked_ink']=run('../../09-process-diagram-sheet.png','../replica.png','/tmp/_u.png',[],'ink')
# per stage, text masked
for nm,reg in dict(stage1=(24,70,540,285),stage2=(24,285,540,508),stage3=(24,508,540,739),stage4=(24,739,540,930)).items():
    res[nm]=run('../../09-process-diagram-sheet.png','../replica.png','/tmp/_s.png',M,'ink',region=reg)
for k,v in res.items(): print(k,v)
json.dump(dict(results=res,masks=M),open('metrics.json','w'),indent=1)
# filled-shape IoU (lum<128 inside the four filled shapes' boxes, text masked) and 1px-tolerant F for all ink
import numpy as np
from PIL import Image
A=np.array(Image.open('../../09-process-diagram-sheet.png').convert('L')).astype(float)
B=np.array(Image.open('../replica.png').convert('L')).astype(float)
keep=np.ones(A.shape,bool)
for (a,b,c,d) in M: keep[b:d,a:c]=False
fills=np.zeros(A.shape,bool)
for (a,b,c,d) in [(210,378,286,454),(424,379,498,452),(312,596,372,656),(250,885,313,916)]: fills[b:d,a:c]=True
ma=(A<128)&keep&fills; mb=(B<128)&keep&fills
res['filled_shapes_iou']=round(float((ma&mb).sum()/(ma|mb).sum()),4)
def dil(a):
    b=a.copy(); b[1:]|=a[:-1]; b[:-1]|=a[1:]; b[:,1:]|=a[:,:-1]; b[:,:-1]|=a[:,1:]; return b
for nm,reg in dict(all=(0,0,564,1056),stage1=(24,70,540,285),stage2=(24,285,540,508),stage3=(24,508,540,739),stage4=(24,739,540,930)).items():
    r=np.zeros(A.shape,bool); r[reg[1]:reg[3],reg[0]:reg[2]]=True
    ia=(A<212)&keep&r; ib=(B<212)&keep&r
    p=(ib&dil(ia)).sum()/ib.sum(); q=(ia&dil(ib)).sum()/ia.sum()
    res[f'ink_f1_tol1px_{nm}']=round(float(2*p*q/(p+q)),4)
print({k:v for k,v in res.items() if 'f1' in k or 'filled' in k})
json.dump(dict(results=res,masks=M),open('metrics.json','w'),indent=1)
