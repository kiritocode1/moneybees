import sys; sys.path.insert(0,'work')
from comps import *
from PIL import ImageDraw
bg=34.0; cov=np.clip((L-bg)/(255-bg),0,1)
def tri_cov(cx,cy,s,phi,x0,y0,w,h,ss=8):
    img=Image.new('L',(w*ss,h*ss),0); d=ImageDraw.Draw(img)
    R=s/np.sqrt(3)
    pts=[((cx-x0+R*np.sin(np.radians(phi+120*i)))*ss,(cy-y0-R*np.cos(np.radians(phi+120*i)))*ss) for i in range(3)]
    d.polygon(pts,fill=255); a=np.asarray(img,float)/255; return a.reshape(h,ss,w,ss).mean((1,3))
cents=[(104.00,352.72),(91.39,358.09),(116.37,358.19),(89.07,372.94),(118.68,372.87),(96.01,382.06),(111.76,381.98)]
res=[]
for cx,cy in cents:
    x0,y0=int(cx)-10,int(cy)-10; patch=cov[y0:y0+20,x0:x0+20]
    best=None
    for s in np.arange(9,13.01,0.25):
        for phi in range(0,120,2):
            for dx in (-0.5,0,0.5):
                for dy in (-0.5,0,0.5):
                    m=tri_cov(cx+dx,cy+dy,s,phi,x0,y0,20,20,4); e=((m-patch)**2).sum()
                    if best is None or e<best[0]: best=(e,s,phi,cx+dx,cy+dy)
    res.append(best)
cx0=np.mean([b[3] for b in res]); cy0=np.mean([b[4] for b in res])
for b in res:
    pos=(np.degrees(np.arctan2(b[3]-cx0,-(b[4]-cy0)))+360)%360
    # apex directions are phi, phi+120, phi+240; report the one closest to radial-out
    dirs=[(b[2]+120*i)%360 for i in range(3)]; rel=[((d_-pos+180)%360)-180 for d_ in dirs]; j=int(np.argmin(np.abs(rel)))
    print('side %.2f  pos %.1f  r %.2f  apex-nearest-outward %.1f (rel %.1f)  sse %.2f'%(b[1],pos,np.hypot(b[3]-cx0,b[4]-cy0),dirs[j],rel[j],b[0]))
print('centre',round(cx0,2),round(cy0,2))
