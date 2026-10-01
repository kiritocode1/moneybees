import sys, itertools, subprocess, os; sys.path.insert(0,'work')
from make_replica import *
# render a strip of variants, each in a 60x60 cell, glyph centre at same sub-pixel offset as the original
V3=list(itertools.product([1.8,2.0,2.2],[1.8,2.1],[4.6,5.0],[18.4,18.8]))
V1=[(s,r) for s in [9.9,10.4,10.9] for r in [16.06,16.5]]
cells=[]
fx3,fy3=G3[0]%1,G3[1]%1; fx1,fy1=G1[0]%1,G1[1]%1
o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{60*len(V3)}" height="120"><rect width="100%" height="100%" fill="#222222"/>']
for i,(sw,tipr,hub,tip) in enumerate(V3): o.append(glyph_burst(60*i+30+fx3,30+fy3,hub=hub,tipr=tipr,sw=sw,tip=tip,r1=tip-tipr))
for i,(s,r) in enumerate(V1): o.append(glyph_triangles(60*i+30+fx1,90+fy1,side=s,r=r))
o.append('</svg>'); open('work/variants.svg','w').write('\n'.join(o))
print(len(V3),len(V1))
import json; json.dump({'V3':V3,'V1':V1},open('work/variants.json','w'))
