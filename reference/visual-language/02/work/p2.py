from PIL import Image; import numpy as np, json
im=np.array(Image.open('../../02-unit8-circles.png').convert('RGB')).astype(float)
lum=im.mean(2)
boxes=[(56,357,56,475),(380,678,56,475),(56,357,498,919),(380,678,498,919)]
def cross(profile, lvl, rising=True):
    # position (continuous) where profile crosses lvl; profile index i covers [i,i+1]
    for i in range(len(profile)-1):
        a,b=profile[i],profile[i+1]
        if (a<lvl<=b) if rising else (a>=lvl>b):
            return i+0.5+(lvl-a)/(b-a)
    return np.nan
res=[]
for k,(x0,x1,y0,y1) in enumerate(boxes):
    inner=np.median(lum[y0+20:y1-20,x0+5:x0+15]); lvl=inner/2
    L=[];R=[];T=[];B=[]
    for y in range(y0+15,y1-15,3):
        L.append((cross(lum[y,x0-3:x0+4],lvl,True)+x0-3,y+0.5))
        R.append((cross(lum[y,x1-4:x1+6],lvl,False)+x1-4,y+0.5))
    for x in range(x0+15,x1-15,3):
        T.append((x+0.5,cross(lum[y0-2:y0+4,x],lvl,True)+y0-2))
        B.append((x+0.5,cross(lum[y1-4:y1+6,x],lvl,False)+y1-4))
    L,R,T,B=map(np.array,(L,R,T,B))
    def med(a,i): v=a[:,i]; v=v[~np.isnan(v)]; return np.median(v), np.polyfit(np.arange(len(v)),v,1)[0]
    l,ls=med(L,0); r,rs=med(R,0); t,ts=med(T,1); b,bs=med(B,1)
    print(f'poster{k+1}: left {l:.2f} right {r:.2f} top {t:.2f} bottom {b:.2f} | w {r-l:.2f} h {b-t:.2f} aspect h/w {(b-t)/(r-l):.4f} | slopes px/sample L{ls:.4f} R{rs:.4f} T{ts:.4f} B{bs:.4f} | inner lum {inner}')
    res.append(dict(l=l,r=r,t=t,b=b))
json.dump(res,open('posters.json','w'),indent=1)
